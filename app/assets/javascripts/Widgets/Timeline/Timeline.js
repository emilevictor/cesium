/*global define*/
define(['Core/DeveloperError', 'Core/ClockRange', 'Core/defined', 'Core/destroyObject', 'Core/JulianDate', 'Widgets/getElement', 'Widgets/Timeline/TimelineTrack', 'Widgets/Timeline/TimelineHighlightRange'], function(
        DeveloperError,
        ClockRange,
        defined,
        destroyObject,
        JulianDate,
        getElement,
        TimelineTrack,
        TimelineHighlightRange) {
    "use strict";

    var timelineWheelDelta = 1e12;

    var timelineMouseMode = {
        none : 0,
        scrub : 1,
        slide : 2,
        zoom : 3,
        touchOnly : 4
    };
    var timelineTouchMode = {
        none : 0,
        scrub : 1,
        slideZoom : 2,
        singleTap : 3,
        ignore : 4
    };

    var timelineTicScales = [0.001, 0.002, 0.005, 0.01, 0.02, 0.05, 0.1, 0.25, 0.5, 1.0, 2.0, 5.0, 10.0, 15.0, 30.0, 60.0, // 1min
    120.0, // 2min
    300.0, // 5min
    600.0, // 10min
    900.0, // 15min
    1800.0, // 30min
    3600.0, // 1hr
    7200.0, // 2hr
    14400.0, // 4hr
    21600.0, // 6hr
    43200.0, // 12hr
    86400.0, // 24hr
    172800.0, // 2days
    345600.0, // 4days
    604800.0, // 7days
    1296000.0, // 15days
    2592000.0, // 30days
    5184000.0, // 60days
    7776000.0, // 90days
    15552000.0, // 180days
    31536000.0, // 365days
    63072000.0, // 2years
    126144000.0, // 4years
    157680000.0, // 5years
    315360000.0, // 10years
    630720000.0, // 20years
    1261440000.0, // 40years
    1576800000.0, // 50years
    3153600000.0, // 100years
    6307200000.0, // 200years
    12614400000.0, // 400years
    15768000000.0, // 500years
    31536000000.0 // 1000years
    ];

    var timelineMonthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    function Timeline(container, clock) {
        //>>includeStart('debug', pragmas.debug);
        if (!defined(container)) {
            throw new DeveloperError('container is required.');
        }
        if (!defined(clock)) {
            throw new DeveloperError('clock is required.');
        }
        //>>includeEnd('debug');

        container = getElement(container);

        /**
         * Gets the parent container.
         * @memberof Timeline
         * @type {Element}
         */
        this.container = container;

        var topDiv = document.createElement('div');
        topDiv.className = 'cesium-timeline-main';
        container.appendChild(topDiv);
        this._topDiv = topDiv;

        this._endJulian = undefined;
        this._epochJulian = undefined;
        this._lastXPos = undefined;
        this._scrubElement = undefined;
        this._startJulian = undefined;
        this._timeBarSecondsSpan = undefined;
        this._clock = clock;
        this._scrubJulian = clock.currentTime;
        this._mainTicSpan = -1;
        this._mouseMode = timelineMouseMode.none;
        this._touchMode = timelineTouchMode.none;
        this._touchState = {
            centerX : 0,
            spanX : 0
        };
        this._mouseX = 0;
        this._timelineDrag = 0;
        this._timelineDragLocation = undefined;
        this._lastHeight = undefined;
        this._lastWidth = undefined;

        this._topDiv.innerHTML = '<div class="cesium-timeline-bar"></div><div class="cesium-timeline-trackContainer">' +
                                     '<canvas class="cesium-timeline-tracks" width="10" height="1">' +
                                     '</canvas></div><div class="cesium-timeline-needle"></div><span class="cesium-timeline-ruler"></span>';
        this._timeBarEle = this._topDiv.childNodes[0];
        this._trackContainer = this._topDiv.childNodes[1];
        this._trackListEle = this._topDiv.childNodes[1].childNodes[0];
        this._needleEle = this._topDiv.childNodes[2];
        this._rulerEle = this._topDiv.childNodes[3];
        this._context = this._trackListEle.getContext('2d');

        this._trackList = [];
        this._highlightRanges = [];

        this.zoomTo(clock.startTime, clock.stopTime);

        this._onMouseDown = createMouseDownCallback(this);
        this._onMouseUp = createMouseUpCallback(this);
        this._onMouseMove = createMouseMoveCallback(this);
        this._onMouseWheel = createMouseWheelCallback(this);
        this._onTouchStart = createTouchStartCallback(this);
        this._onTouchMove = createTouchMoveCallback(this);
        this._onTouchEnd = createTouchEndCallback(this);

        var timeBarEle = this._timeBarEle;
        document.addEventListener('mouseup', this._onMouseUp, false);
        document.addEventListener('mousemove', this._onMouseMove, false);
        timeBarEle.addEventListener('mousedown', this._onMouseDown, false);
        timeBarEle.addEventListener('DOMMouseScroll', this._onMouseWheel, false); // Mozilla mouse wheel
        timeBarEle.addEventListener('mousewheel', this._onMouseWheel, false);
        timeBarEle.addEventListener('touchstart', this._onTouchStart, false);
        timeBarEle.addEventListener('touchmove', this._onTouchMove, false);
        timeBarEle.addEventListener('touchend', this._onTouchEnd, false);

        this._topDiv.oncontextmenu = function() {
            return false;
        };

        clock.onTick.addEventListener(this.updateFromClock, this);
        this.updateFromClock();
    }

    Timeline.prototype.addEventListener = function(type, listener, useCapture) {
        this._topDiv.addEventListener(type, listener, useCapture);
    };

    Timeline.prototype.removeEventListener = function(type, listener, useCapture) {
        this._topDiv.removeEventListener(type, listener, useCapture);
    };

    Timeline.prototype.isDestroyed = function() {
        return false;
    };

    Timeline.prototype.destroy = function() {
        this._clock.onTick.removeEventListener(this.updateFromClock, this);

        document.removeEventListener('mouseup', this._onMouseUp, false);
        document.removeEventListener('mousemove', this._onMouseMove, false);

        var timeBarEle = this._timeBarEle;
        timeBarEle.removeEventListener('mousedown', this._onMouseDown, false);
        timeBarEle.removeEventListener('DOMMouseScroll', this._onMouseWheel, false); // Mozilla mouse wheel
        timeBarEle.removeEventListener('mousewheel', this._onMouseWheel, false);
        timeBarEle.removeEventListener('touchstart', this._onTouchStart, false);
        timeBarEle.removeEventListener('touchmove', this._onTouchMove, false);
        timeBarEle.removeEventListener('touchend', this._onTouchEnd, false);
        this.container.removeChild(this._topDiv);
        destroyObject(this);
    };

    Timeline.prototype.addHighlightRange = function(color, heightInPx) {
        var newHighlightRange = new TimelineHighlightRange(color, heightInPx);
        this._highlightRanges.push(newHighlightRange);
        this.resize();
        return newHighlightRange;
    };

    Timeline.prototype.addTrack = function(interval, heightInPx, color, backgroundColor) {
        var newTrack = new TimelineTrack(interval, heightInPx, color, backgroundColor);
        this._trackList.push(newTrack);
        this._lastHeight = undefined;
        this.resize();
        return newTrack;
    };

    Timeline.prototype.zoomTo = function(startJulianDate, endJulianDate) {
        this._timeBarSecondsSpan = startJulianDate.getSecondsDifference(endJulianDate);

        //>>includeStart('debug', pragmas.debug);
        if (this._timeBarSecondsSpan <= 0) {
            throw new DeveloperError('Start time must come before end time.');
        }
        //>>includeEnd('debug');

        this._startJulian = startJulianDate;
        this._endJulian = endJulianDate;

        // If clock is not unbounded, clamp timeline range to clock.
        if (this._clock && (this._clock.clockRange !== ClockRange.UNBOUNDED)) {
            var clockStart = this._clock.startTime;
            var clockEnd = this._clock.stopTime;
            var clockSpan = clockStart.getSecondsDifference(clockEnd);
            var startOffset = this._startJulian.getSecondsDifference(clockStart);
            var endOffset = this._endJulian.getSecondsDifference(clockEnd);

            if (this._timeBarSecondsSpan >= clockSpan) {
                // if new duration longer than clock range duration, clamp to full range.
                this._timeBarSecondsSpan = clockSpan;
                this._startJulian = this._clock.startTime;
                this._endJulian = this._clock.stopTime;
            } else if (startOffset > 0) {
                // if timeline start is before clock start, shift right
                this._endJulian = this._endJulian.addSeconds(startOffset);
                this._startJulian = clockStart;
                this._timeBarSecondsSpan = this._startJulian.getSecondsDifference(this._endJulian);
            } else if (endOffset < 0) {
                // if timeline end is after clock end, shift left
                this._startJulian = this._startJulian.addSeconds(endOffset);
                this._endJulian = clockEnd;
                this._timeBarSecondsSpan = this._startJulian.getSecondsDifference(this._endJulian);
            }
        }

        this._makeTics();

        var evt = document.createEvent('Event');
        evt.initEvent('setzoom', true, true);
        evt.startJulian = this._startJulian;
        evt.endJulian = this._endJulian;
        evt.epochJulian = this._epochJulian;
        evt.totalSpan = this._timeBarSecondsSpan;
        evt.mainTicSpan = this._mainTicSpan;
        this._topDiv.dispatchEvent(evt);
    };

    Timeline.prototype.zoomFrom = function(amount) {
        var centerSec = this._startJulian.getSecondsDifference(this._scrubJulian);
        if ((amount > 1) || (centerSec < 0) || (centerSec > this._timeBarSecondsSpan)) {
            centerSec = this._timeBarSecondsSpan * 0.5;
        } else {
            centerSec += (centerSec - this._timeBarSecondsSpan * 0.5);
        }
        var centerSecFlip = this._timeBarSecondsSpan - centerSec;
        this.zoomTo(this._startJulian.addSeconds(centerSec - (centerSec * amount)), this._endJulian.addSeconds((centerSecFlip * amount) - centerSecFlip));
    };

    function twoDigits(num) {
        return ((num < 10) ? ('0' + num.toString()) : num.toString());
    }

    Timeline.prototype.makeLabel = function(julianDate) {
        var gregorian = julianDate.toGregorianDate();
        var millisecond = gregorian.millisecond, millisecondString = ' UTC';
        if ((millisecond > 0) && (this._timeBarSecondsSpan < 3600)) {
            millisecondString = Math.floor(millisecond).toString();
            while (millisecondString.length < 3) {
                millisecondString = '0' + millisecondString;
            }
            millisecondString = '.' + millisecondString;
        }

        return timelineMonthNames[gregorian.month - 1] + ' ' + gregorian.day + ' ' + gregorian.year + ' ' + twoDigits(gregorian.hour) +
            ':' + twoDigits(gregorian.minute) + ':' + twoDigits(gregorian.second) + millisecondString;
    };

    Timeline.prototype.smallestTicInPixels = 7.0;

    Timeline.prototype._makeTics = function() {
        var timeBar = this._timeBarEle;

        var seconds = this._startJulian.getSecondsDifference(this._scrubJulian);
        var xPos = Math.round(seconds * this._topDiv.clientWidth / this._timeBarSecondsSpan);
        var scrubX = xPos - 8, tic;
        var widget = this;

        this._needleEle.style.left = xPos.toString() + 'px';

        var tics = '';

        var minimumDuration = 0.01;
        var maximumDuration = 31536000000.0; // ~1000 years
        var epsilon = 1e-10;

        // If time step size is known, enter it here...
        var minSize = 0;

        var duration = this._timeBarSecondsSpan;
        if (duration < minimumDuration) {
            duration = minimumDuration;
            this._timeBarSecondsSpan = minimumDuration;
            this._endJulian = this._startJulian.addSeconds(minimumDuration);
        } else if (duration > maximumDuration) {
            duration = maximumDuration;
            this._timeBarSecondsSpan = maximumDuration;
            this._endJulian = this._startJulian.addSeconds(maximumDuration);
        }

        var timeBarWidth = this._timeBarEle.clientWidth;
        if (timeBarWidth < 10) {
            timeBarWidth = 10;
        }
        var startJulian = this._startJulian;

        // epsilonTime: a small fraction of one pixel width of the timeline, measured in seconds.
        var epsilonTime = Math.min((duration / timeBarWidth) * 1e-5, 0.4);

        // epochJulian: a nearby time to be considered "zero seconds", should be a round-ish number by human standards.
        var epochJulian;
        if (duration > 315360000) { // 3650+ days visible, epoch is start of the first visible century.
            epochJulian = JulianDate.fromIso8601(startJulian.toDate().toISOString().substring(0, 2) + '00-01-01T00:00:00Z');
        } else if (duration > 31536000) { // 365+ days visible, epoch is start of the first visible decade.
            epochJulian = JulianDate.fromIso8601(startJulian.toDate().toISOString().substring(0, 3) + '0-01-01T00:00:00Z');
        } else if (duration > 86400) { // 1+ day(s) visible, epoch is start of the year.
            epochJulian = JulianDate.fromIso8601(startJulian.toDate().toISOString().substring(0, 4) + '-01-01T00:00:00Z');
        } else { // Less than a day on timeline, epoch is midnight of the visible day.
            epochJulian = JulianDate.fromIso8601(startJulian.toDate().toISOString().substring(0, 10) + 'T00:00:00Z');
        }
        // startTime: Seconds offset of the left side of the timeline from epochJulian.
        var startTime = epochJulian.addSeconds(epsilonTime).getSecondsDifference(this._startJulian);
        // endTime: Seconds offset of the right side of the timeline from epochJulian.
        var endTime = startTime + duration;
        this._epochJulian = epochJulian;

        function getStartTic(ticScale) {
            return Math.floor(startTime / ticScale) * ticScale;
        }

        function getNextTic(tic, ticScale) {
            return Math.ceil((tic / ticScale) + 0.5) * ticScale;
        }

        function getAlpha(time) {
            return (time - startTime) / duration;
        }

        function remainder(x, y) {
            //return x % y;
            return x - (y * Math.round(x / y));
        }

        // Width in pixels of a typical label, plus padding
        this._rulerEle.innerHTML = this.makeLabel(this._endJulian.addSeconds(-minimumDuration));
        var sampleWidth = this._rulerEle.offsetWidth + 20;

        var origMinSize = minSize;
        minSize -= epsilon;

        var renderState = {
            y : 0,
            startTime : startTime,
            startJulian : startJulian,
            epochJulian : epochJulian,
            duration : duration,
            timeBarWidth : timeBarWidth,
            getAlpha : getAlpha
        };
        this._highlightRanges.forEach(function(highlightRange) {
            tics += highlightRange.render(renderState);
        });

        // Calculate tic mark label spacing in the TimeBar.
        var mainTic = 0.0, subTic = 0.0, tinyTic = 0.0;
        // Ideal labeled tic as percentage of zoom interval
        var idealTic = sampleWidth / timeBarWidth;
        if (idealTic > 1.0) {
            // Clamp to width of window, for thin windows.
            idealTic = 1.0;
        }
        // Ideal labeled tic size in seconds
        idealTic *= this._timeBarSecondsSpan;
        var ticIndex = -1, smallestIndex = -1;

        var i, ticScaleLen = timelineTicScales.length;
        for (i = 0; i < ticScaleLen; ++i) {
            var sc = timelineTicScales[i];
            ++ticIndex;
            mainTic = sc;
            // Find acceptable main tic size not smaller than ideal size.
            if ((sc > idealTic) && (sc > minSize)) {
                break;
            }
            if ((smallestIndex < 0) && ((timeBarWidth * (sc / this._timeBarSecondsSpan)) >= this.smallestTicInPixels)) {
                smallestIndex = ticIndex;
            }
        }
        if (ticIndex > 0) {
            while (ticIndex > 0) // Compute sub-tic size that evenly divides main tic.
            {
                --ticIndex;
                if (Math.abs(remainder(mainTic, timelineTicScales[ticIndex])) < 0.00001) {
                    if (timelineTicScales[ticIndex] >= minSize) {
                        subTic = timelineTicScales[ticIndex];
                    }
                    break;
                }
            }

            if (smallestIndex >= 0) {
                while (smallestIndex < ticIndex) // Compute tiny tic size that evenly divides sub-tic.
                {
                    if ((Math.abs(remainder(subTic, timelineTicScales[smallestIndex])) < 0.00001) && (timelineTicScales[smallestIndex] >= minSize)) {
                        tinyTic = timelineTicScales[smallestIndex];
                        break;
                    }
                    ++smallestIndex;
                }
            }
        }

        minSize = origMinSize;
        if ((minSize > epsilon) && (tinyTic < 0.00001) && (Math.abs(minSize - mainTic) > epsilon)) {
            tinyTic = minSize;
            if (minSize <= (mainTic + epsilon)) {
                subTic = 0.0;
            }
        }

        var lastTextLeft = -999999, textWidth;
        if ((timeBarWidth * (tinyTic / this._timeBarSecondsSpan)) >= 3.0) {
            for (tic = getStartTic(tinyTic); tic <= endTime; tic = getNextTic(tic, tinyTic)) {
                tics += '<span class="cesium-timeline-ticTiny" style="left: ' + Math.round(timeBarWidth * getAlpha(tic)).toString() + 'px;"></span>';
            }
        }
        if ((timeBarWidth * (subTic / this._timeBarSecondsSpan)) >= 3.0) {
            for (tic = getStartTic(subTic); tic <= endTime; tic = getNextTic(tic, subTic)) {
                tics += '<span class="cesium-timeline-ticSub" style="left: ' + Math.round(timeBarWidth * getAlpha(tic)).toString() + 'px;"></span>';
            }
        }
        if ((timeBarWidth * (mainTic / this._timeBarSecondsSpan)) >= 2.0) {
            this._mainTicSpan = mainTic;
            endTime += mainTic;
            tic = getStartTic(mainTic);
            var leapSecond = epochJulian.getTaiMinusUtc();
            while (tic <= endTime) {
                var ticTime = startJulian.addSeconds(tic - startTime);
                if (mainTic > 2.1) {
                    var ticLeap = ticTime.getTaiMinusUtc();
                    if (Math.abs(ticLeap - leapSecond) > 0.1) {
                        tic += (ticLeap - leapSecond);
                        ticTime = startJulian.addSeconds(tic - startTime);
                    }
                }
                var ticLeft = Math.round(timeBarWidth * getAlpha(tic));
                var ticLabel = this.makeLabel(ticTime);
                this._rulerEle.innerHTML = ticLabel;
                textWidth = this._rulerEle.offsetWidth;
                var labelLeft = ticLeft - ((textWidth / 2) - 1);
                if (labelLeft > lastTextLeft) {
                    lastTextLeft = labelLeft + textWidth + 5;
                    tics += '<span class="cesium-timeline-ticMain" style="left: ' + ticLeft.toString() + 'px;"></span>' + '<span class="cesium-timeline-ticLabel" style="left: ' + labelLeft.toString() +
                            'px;">' + ticLabel + '</span>';
                } else {
                    tics += '<span class="cesium-timeline-ticSub" style="left: ' + ticLeft.toString() + 'px;"></span>';
                }
                tic = getNextTic(tic, mainTic);
            }
        } else {
            this._mainTicSpan = -1;
        }

        tics += '<span class="cesium-timeline-icon16" style="left:' + scrubX + 'px;bottom:0;background-position: 0px 0px;"></span>';
        timeBar.innerHTML = tics;
        this._scrubElement = timeBar.lastChild;

        // Clear track canvas.
        this._context.clearRect(0, 0, this._trackListEle.width, this._trackListEle.height);

        renderState.y = 0;
        this._trackList.forEach(function(track) {
            track.render(widget._context, renderState);
            renderState.y += track.height;
        });
    };

    Timeline.prototype.updateFromClock = function() {
        this._scrubJulian = this._clock.currentTime;
        var scrubElement = this._scrubElement;
        if (defined(this._scrubElement)) {
            var seconds = this._startJulian.getSecondsDifference(this._scrubJulian);
            var xPos = Math.round(seconds * this._topDiv.clientWidth / this._timeBarSecondsSpan);

            if (this._lastXPos !== xPos) {
                this._lastXPos = xPos;

                scrubElement.style.left = (xPos - 8) + 'px';
                this._needleEle.style.left = xPos + 'px';
            }
        }
        if (defined(this._timelineDragLocation)) {
            this._setTimeBarTime(this._timelineDragLocation, this._timelineDragLocation * this._timeBarSecondsSpan / this._topDiv.clientWidth);
            this.zoomTo(this._startJulian.addSeconds(this._timelineDrag), this._endJulian.addSeconds(this._timelineDrag));
        }
    };

    Timeline.prototype._setTimeBarTime = function(xPos, seconds) {
        xPos = Math.round(xPos);
        this._scrubJulian = this._startJulian.addSeconds(seconds);
        if (this._scrubElement) {
            var scrubX = xPos - 8;
            this._scrubElement.style.left = scrubX.toString() + 'px';
            this._needleEle.style.left = xPos.toString() + 'px';
        }

        var evt = document.createEvent('Event');
        evt.initEvent('settime', true, true);
        evt.clientX = xPos;
        evt.timeSeconds = seconds;
        evt.timeJulian = this._scrubJulian;
        evt.clock = this._clock;
        this._topDiv.dispatchEvent(evt);
    };

    function createMouseDownCallback(timeline) {
        return function(e) {
            if (timeline._mouseMode !== timelineMouseMode.touchOnly) {
                if (e.button === 0) {
                    timeline._mouseMode = timelineMouseMode.scrub;
                    if (timeline._scrubElement) {
                        timeline._scrubElement.style.backgroundPosition = '-16px 0';
                    }
                    timeline._onMouseMove(e);
                } else {
                    timeline._mouseX = e.clientX;
                    if (e.button === 2) {
                        timeline._mouseMode = timelineMouseMode.zoom;
                    } else {
                        timeline._mouseMode = timelineMouseMode.slide;
                    }
                }
            }
            e.preventDefault();
        };
    }

    function createMouseUpCallback(timeline) {
        return function(e) {
            timeline._mouseMode = timelineMouseMode.none;
            if (timeline._scrubElement) {
                timeline._scrubElement.style.backgroundPosition = '0px 0px';
            }
            timeline._timelineDrag = 0;
            timeline._timelineDragLocation = undefined;
        };
    }

    function createMouseMoveCallback(timeline) {
        return function(e) {
            var dx;
            if (timeline._mouseMode === timelineMouseMode.scrub) {
                e.preventDefault();
                var x = e.clientX - timeline._topDiv.getBoundingClientRect().left;

                if (x < 0) {
                    timeline._timelineDragLocation = 0;
                    timeline._timelineDrag = -0.01 * timeline._timeBarSecondsSpan;
                } else if (x > timeline._topDiv.clientWidth) {
                    timeline._timelineDragLocation = timeline._topDiv.clientWidth;
                    timeline._timelineDrag = 0.01 * timeline._timeBarSecondsSpan;
                } else {
                    timeline._timelineDragLocation = undefined;
                    timeline._setTimeBarTime(x, x * timeline._timeBarSecondsSpan / timeline._topDiv.clientWidth);
                }

            } else if (timeline._mouseMode === timelineMouseMode.slide) {
                dx = timeline._mouseX - e.clientX;
                timeline._mouseX = e.clientX;
                if (dx !== 0) {
                    var dsec = dx * timeline._timeBarSecondsSpan / timeline._topDiv.clientWidth;
                    timeline.zoomTo(timeline._startJulian.addSeconds(dsec), timeline._endJulian.addSeconds(dsec));
                }
            } else if (timeline._mouseMode === timelineMouseMode.zoom) {
                dx = timeline._mouseX - e.clientX;
                timeline._mouseX = e.clientX;
                if (dx !== 0) {
                    timeline.zoomFrom(Math.pow(1.01, dx));
                }
            }
        };
    }

    function createMouseWheelCallback(timeline) {
        return function(e) {
            var dy = e.wheelDeltaY || e.wheelDelta || (-e.detail);
            timelineWheelDelta = Math.max(Math.min(Math.abs(dy), timelineWheelDelta), 1);
            dy /= timelineWheelDelta;
            timeline.zoomFrom(Math.pow(1.05, -dy));
        };
    }

    function createTouchStartCallback(timeline) {
        return function(e) {
            var len = e.touches.length, seconds, xPos, leftX = timeline._topDiv.getBoundingClientRect().left;
            e.preventDefault();
            timeline._mouseMode = timelineMouseMode.touchOnly;
            if (len === 1) {
                seconds = timeline._startJulian.getSecondsDifference(timeline._scrubJulian);
                xPos = Math.round(seconds * timeline._topDiv.clientWidth / timeline._timeBarSecondsSpan + leftX);
                if (Math.abs(e.touches[0].clientX - xPos) < 50) {
                    timeline._touchMode = timelineTouchMode.scrub;
                    if (timeline._scrubElement) {
                        timeline._scrubElement.style.backgroundPosition = (len === 1) ? '-16px 0' : '0 0';
                    }
                } else {
                    timeline._touchMode = timelineTouchMode.singleTap;
                    timeline._touchState.centerX = e.touches[0].clientX - leftX;
                }
            } else if (len === 2) {
                timeline._touchMode = timelineTouchMode.slideZoom;
                timeline._touchState.centerX = (e.touches[0].clientX + e.touches[1].clientX) * 0.5 - leftX;
                timeline._touchState.spanX = Math.abs(e.touches[0].clientX - e.touches[1].clientX);
            } else {
                timeline._touchMode = timelineTouchMode.ignore;
            }
        };
    }

    function createTouchEndCallback(timeline) {
        return function(e) {
            var len = e.touches.length, leftX = timeline._topDiv.getBoundingClientRect().left;
            if (timeline._touchMode === timelineTouchMode.singleTap) {
                timeline._touchMode = timelineTouchMode.scrub;
                timeline._handleTouchMove(e);
            } else if (timeline._touchMode === timelineTouchMode.scrub) {
                timeline._handleTouchMove(e);
            }
            timeline._mouseMode = timelineMouseMode.touchOnly;
            if (len !== 1) {
                timeline._touchMode = (len > 0) ? timelineTouchMode.ignore : timelineTouchMode.none;
            } else if (timeline._touchMode === timelineTouchMode.slideZoom) {
                timeline._touchState.centerX = e.touches[0].clientX - leftX;
            }
            if (timeline._scrubElement) {
                timeline._scrubElement.style.backgroundPosition = '0 0';
            }
        };
    }

    function createTouchMoveCallback(timeline) {
        return function(e) {
            var dx, x, len, newCenter, newSpan, newStartTime, zoom = 1, leftX = timeline._topDiv.getBoundingClientRect().left;
            if (timeline._touchMode === timelineTouchMode.singleTap) {
                timeline._touchMode = timelineTouchMode.slideZoom;
            }
            timeline._mouseMode = timelineMouseMode.touchOnly;
            if (timeline._touchMode === timelineTouchMode.scrub) {
                e.preventDefault();
                if (e.changedTouches.length === 1) {
                    x = e.changedTouches[0].clientX - leftX;
                    if ((x >= 0) && (x <= timeline._topDiv.clientWidth)) {
                        timeline._setTimeBarTime(x, x * timeline._timeBarSecondsSpan / timeline._topDiv.clientWidth);
                    }
                }
            } else if (timeline._touchMode === timelineTouchMode.slideZoom) {
                len = e.touches.length;
                if (len === 2) {
                    newCenter = (e.touches[0].clientX + e.touches[1].clientX) * 0.5 - leftX;
                    newSpan = Math.abs(e.touches[0].clientX - e.touches[1].clientX);
                } else if (len === 1) {
                    newCenter = e.touches[0].clientX - leftX;
                    newSpan = 0;
                }

                if (defined(newCenter)) {
                    if ((newSpan > 0) && (timeline._touchState.spanX > 0)) {
                        // Zoom and slide
                        zoom = (timeline._touchState.spanX / newSpan);
                        newStartTime = timeline._startJulian.addSeconds(((timeline._touchState.centerX * timeline._timeBarSecondsSpan) - (newCenter * timeline._timeBarSecondsSpan * zoom)) / timeline._topDiv.clientWidth);
                    } else {
                        // Slide to newCenter
                        dx = timeline._touchState.centerX - newCenter;
                        newStartTime = timeline._startJulian.addSeconds(dx * timeline._timeBarSecondsSpan / timeline._topDiv.clientWidth);
                    }

                    timeline.zoomTo(newStartTime, newStartTime.addSeconds(timeline._timeBarSecondsSpan * zoom));
                    timeline._touchState.centerX = newCenter;
                    timeline._touchState.spanX = newSpan;
                }
            }
        };
    }

    Timeline.prototype.resize = function() {
        var width = this.container.clientWidth;
        var height = this.container.clientHeight;

        if (width === this._lastWidth && height === this._lastHeight) {
            return;
        }

        this._trackContainer.style.height = height + 'px';

        var trackListHeight = 1;
        this._trackList.forEach(function(track) {
            trackListHeight += track.height;
        });
        this._trackListEle.style.height = trackListHeight.toString() + 'px';
        this._trackListEle.width = this._trackListEle.clientWidth;
        this._trackListEle.height = trackListHeight;
        this._makeTics();

        this._lastWidth = width;
        this._lastHeight = height;
    };

    return Timeline;
});
