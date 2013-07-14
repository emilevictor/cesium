/*global define*/
define([
        '../../Core/binarySearch',
        '../../Core/ClockStep',
        '../../Core/ClockRange',
        '../../Core/defineProperties',
        '../../Core/DeveloperError',
        '../createCommand',
        '../ToggleButtonViewModel',
        '../../ThirdParty/sprintf',
        '../../ThirdParty/knockout'
    ], function(
        binarySearch,
        ClockStep,
        ClockRange,
        defineProperties,
        DeveloperError,
        createCommand,
        ToggleButtonViewModel,
        sprintf,
        knockout) {
    "use strict";

    var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var realtimeShuttleRingAngle = 15;
    var maxShuttleRingAngle = 105;

    function cancelRealtime(clockViewModel) {
        if (clockViewModel.clockStep === ClockStep.SYSTEM_CLOCK) {
            clockViewModel.clockStep = ClockStep.SYSTEM_CLOCK_MULTIPLIER;
            clockViewModel.multiplier = 1;
        }
    }

    function unpause(clockViewModel) {
        cancelRealtime(clockViewModel);
        clockViewModel.shouldAnimate = true;
    }

    function numberComparator(left, right) {
        return left - right;
    }

    function getTypicalMultiplierIndex(multiplier, shuttleRingTicks) {
        var index = binarySearch(shuttleRingTicks, multiplier, numberComparator);
        return index < 0 ? ~index : index;
    }

    function angleToMultiplier(angle, shuttleRingTicks) {
        //Use a linear scale for -1 to 1 between -15 < angle < 15 degrees
        if (Math.abs(angle) <= realtimeShuttleRingAngle) {
            return angle / realtimeShuttleRingAngle;
        }

        var minp = realtimeShuttleRingAngle;
        var maxp = maxShuttleRingAngle;
        var maxv;
        var minv = 0;
        var scale;
        if (angle > 0) {
            maxv = Math.log(shuttleRingTicks[shuttleRingTicks.length - 1]);
            scale = (maxv - minv) / (maxp - minp);
            return Math.exp(minv + scale * (angle - minp));
        }

        maxv = Math.log(-shuttleRingTicks[0]);
        scale = (maxv - minv) / (maxp - minp);
        return -Math.exp(minv + scale * (Math.abs(angle) - minp));
    }

    function multiplierToAngle(multiplier, shuttleRingTicks, clockViewModel) {
        if (clockViewModel.clockStep === ClockStep.SYSTEM_CLOCK) {
            return realtimeShuttleRingAngle;
        }

        if (Math.abs(multiplier) <= 1) {
            return multiplier * realtimeShuttleRingAngle;
        }

        var minp = realtimeShuttleRingAngle;
        var maxp = maxShuttleRingAngle;
        var maxv;
        var minv = 0;
        var scale;

        if (multiplier > 0) {
            maxv = Math.log(shuttleRingTicks[shuttleRingTicks.length - 1]);
            scale = (maxv - minv) / (maxp - minp);
            return (Math.log(multiplier) - minv) / scale + minp;
        }

        maxv = Math.log(-shuttleRingTicks[0]);
        scale = (maxv - minv) / (maxp - minp);
        return -((Math.log(Math.abs(multiplier)) - minv) / scale + minp);
    }

    /**
     * The view model for the {@link Animation} widget.
     * @alias AnimationViewModel
     * @constructor
     *
     * @param {ClockViewModel} [clockViewModel] The ClockViewModel instance to use.
     *
     * @exception {DeveloperError} clockViewModel is required.
     *
     * @see Animation
     */
    var AnimationViewModel = function(clockViewModel) {
        if (typeof clockViewModel === 'undefined') {
            throw new DeveloperError('clockViewModel is required.');
        }

        var that = this;

        this._clockViewModel = clockViewModel;

        this._allShuttleRingTicks = [];

        this._dateFormatter = AnimationViewModel.defaultDateFormatter;
        this._timeFormatter = AnimationViewModel.defaultTimeFormatter;

        /**
         * Gets or sets whether the shuttle ring is currently being dragged.  This property is observable.
         * @type {Boolean}
         * @default false
         */
        this.shuttleRingDragging = false;

        /**
         * Gets or sets whether dragging the shuttle ring should cause the multiplier
         * to snap to the defined tick values rather than interpolating between them.
         * This property is observable.
         * @type {Boolean}
         * @default false
         */
        this.snapToTicks = false;

        knockout.track(this, ['_allShuttleRingTicks', '_dateFormatter', '_timeFormatter', 'shuttleRingDragging', 'snapToTicks']);

        this._sortedFilteredPositiveTicks = [];

        this.setShuttleRingTicks(AnimationViewModel.defaultTicks);

        /**
         * Gets the string representation of the current time.  This property is observable.
         * @type {String}
         * @default undefined
         */
        this.timeLabel = undefined;
        knockout.defineProperty(this, 'timeLabel', function() {
            return that._timeFormatter(that._clockViewModel.currentTime, that);
        });

        /**
         * Gets the string representation of the current date.  This property is observable.
         * @type {String}
         * @default undefined
         */
        this.dateLabel = undefined;
        knockout.defineProperty(this, 'dateLabel', function() {
            return that._dateFormatter(that._clockViewModel.currentTime, that);
        });

        /**
         * Gets the string representation of the current multiplier.  This property is observable.
         * @type {String}
         * @default undefined
         */
        this.multiplierLabel = undefined;
        knockout.defineProperty(this, 'multiplierLabel', function() {
            var clockViewModel = that._clockViewModel;
            if (clockViewModel.clockStep === ClockStep.SYSTEM_CLOCK) {
                return 'Today';
            }

            var multiplier = clockViewModel.multiplier;

            //If it's a whole number, just return it.
            if (multiplier % 1 === 0) {
                return multiplier.toFixed(0) + 'x';
            }

            //Convert to decimal string and remove any trailing zeroes
            return multiplier.toFixed(3).replace(/0{0,3}$/, "") + 'x';
        });

        /**
         * Gets or sets the current shuttle ring angle.  This property is observable.
         * @type {Number}
         * @default undefined
         */
        this.shuttleRingAngle = undefined;
        knockout.defineProperty(this, 'shuttleRingAngle', {
            get : function() {
                return multiplierToAngle(clockViewModel.multiplier, that._allShuttleRingTicks, clockViewModel);
            },
            set : function(angle) {
                angle = Math.max(Math.min(angle, maxShuttleRingAngle), -maxShuttleRingAngle);
                var ticks = that._allShuttleRingTicks;

                var clockViewModel = that._clockViewModel;
                clockViewModel.clockStep = ClockStep.SYSTEM_CLOCK_MULTIPLIER;

                //If we are at the max angle, simply return the max value in either direction.
                if (Math.abs(angle) === maxShuttleRingAngle) {
                    clockViewModel.multiplier = angle > 0 ? ticks[ticks.length - 1] : ticks[0];
                    return;
                }

                var multiplier = angleToMultiplier(angle, ticks);
                if (that.snapToTicks) {
                    multiplier = ticks[getTypicalMultiplierIndex(multiplier, ticks)];
                } else {
                    if (multiplier !== 0) {
                        var positiveMultiplier = Math.abs(multiplier);

                        if (positiveMultiplier > 100) {
                            var numDigits = positiveMultiplier.toFixed(0).length - 2;
                            var divisor = Math.pow(10, numDigits);
                            multiplier = (Math.round(multiplier / divisor) * divisor) | 0;
                        } else if (positiveMultiplier > realtimeShuttleRingAngle) {
                            multiplier = Math.round(multiplier);
                        } else if (positiveMultiplier > 1) {
                            multiplier = +multiplier.toFixed(1);
                        } else if (positiveMultiplier > 0) {
                            multiplier = +multiplier.toFixed(2);
                        }
                    }
                }
                clockViewModel.multiplier = multiplier;
            }
        });

        this._canAnimate = undefined;
        knockout.defineProperty(this, '_canAnimate', function() {
            var clockViewModel = that._clockViewModel;
            var clockRange = clockViewModel.clockRange;

            if (that.shuttleRingDragging || clockRange === ClockRange.UNBOUNDED) {
                return true;
            }

            var multiplier = clockViewModel.multiplier;
            var currentTime = clockViewModel.currentTime;
            var startTime = clockViewModel.startTime;

            var result = false;
            if (clockRange === ClockRange.LOOP_STOP) {
                result = currentTime.greaterThan(startTime) || (currentTime.equals(startTime) && multiplier > 0);
            } else {
                var stopTime = clockViewModel.stopTime;
                result = (currentTime.greaterThan(startTime) && currentTime.lessThan(stopTime)) || //
                (currentTime.equals(startTime) && multiplier > 0) || //
                (currentTime.equals(stopTime) && multiplier < 0);
            }

            if (!result) {
                clockViewModel.shouldAnimate = false;
            }
            return result;
        });

        this._isSystemTimeAvailable = undefined;
        knockout.defineProperty(this, '_isSystemTimeAvailable', function() {
            var clockViewModel = that._clockViewModel;
            var clockRange = clockViewModel.clockRange;
            if (clockRange === ClockRange.UNBOUNDED) {
                return true;
            }

            var systemTime = clockViewModel.systemTime;
            return systemTime.greaterThanOrEquals(clockViewModel.startTime) && systemTime.lessThanOrEquals(clockViewModel.stopTime);
        });

        this._isAnimating = undefined;
        knockout.defineProperty(this, '_isAnimating', function() {
            return that._clockViewModel.shouldAnimate && (that._canAnimate || that.shuttleRingDragging);
        });

        var pauseCommand = createCommand(function() {
            var clockViewModel = that._clockViewModel;
            if (clockViewModel.shouldAnimate) {
                cancelRealtime(clockViewModel);
                clockViewModel.shouldAnimate = false;
            } else if (that._canAnimate) {
                unpause(clockViewModel);
            }
        });

        this._pauseViewModel = new ToggleButtonViewModel(pauseCommand, {
            toggled : knockout.computed(function() {
                return !that._isAnimating;
            }),
            tooltip : 'Pause'
        });

        var playReverseCommand = createCommand(function() {
            var clockViewModel = that._clockViewModel;
            cancelRealtime(clockViewModel);
            var multiplier = clockViewModel.multiplier;
            if (multiplier > 0) {
                clockViewModel.multiplier = -multiplier;
            }
            clockViewModel.shouldAnimate = true;
        });

        this._playReverseViewModel = new ToggleButtonViewModel(playReverseCommand, {
            toggled : knockout.computed(function() {
                return that._isAnimating && (clockViewModel.multiplier < 0);
            }),
            tooltip : 'Play Reverse'
        });

        var playForwardCommand = createCommand(function() {
            var clockViewModel = that._clockViewModel;
            cancelRealtime(clockViewModel);
            var multiplier = clockViewModel.multiplier;
            if (multiplier < 0) {
                clockViewModel.multiplier = -multiplier;
            }
            clockViewModel.shouldAnimate = true;
        });

        this._playForwardViewModel = new ToggleButtonViewModel(playForwardCommand, {
            toggled : knockout.computed(function() {
                return that._isAnimating && clockViewModel.multiplier > 0 && clockViewModel.clockStep !== ClockStep.SYSTEM_CLOCK;
            }),
            tooltip : 'Play Forward'
        });

        var playRealtimeCommand = createCommand(function() {
            var clockViewModel = that._clockViewModel;
            clockViewModel.clockStep = ClockStep.SYSTEM_CLOCK;
            clockViewModel.multiplier = 1.0;
            clockViewModel.shouldAnimate = true;
        }, knockout.getObservable(this, '_isSystemTimeAvailable'));

        this._playRealtimeViewModel = new ToggleButtonViewModel(playRealtimeCommand, {
            toggled : knockout.computed(function() {
                return clockViewModel.shouldAnimate && clockViewModel.clockStep === ClockStep.SYSTEM_CLOCK;
            }),
            tooltip : knockout.computed(function() {
                return that._isSystemTimeAvailable ? 'Today (real-time)' : 'Current time not in range';
            })
        });

        this._slower = createCommand(function() {
            var clockViewModel = that._clockViewModel;
            cancelRealtime(clockViewModel);
            var shuttleRingTicks = that._allShuttleRingTicks;
            var multiplier = clockViewModel.multiplier;
            var index = getTypicalMultiplierIndex(multiplier, shuttleRingTicks) - 1;
            if (index >= 0) {
                clockViewModel.multiplier = shuttleRingTicks[index];
            }
        });

        this._faster = createCommand(function() {
            var clockViewModel = that._clockViewModel;
            cancelRealtime(clockViewModel);
            var shuttleRingTicks = that._allShuttleRingTicks;
            var multiplier = clockViewModel.multiplier;
            var index = getTypicalMultiplierIndex(multiplier, shuttleRingTicks) + 1;
            if (index < shuttleRingTicks.length) {
                clockViewModel.multiplier = shuttleRingTicks[index];
            }
        });
    };

    /**
     * The default date formatter used by new instances.
     * @memberof AnimationViewModel
     *
     * @param {JulianDate} date The date to be formatted
     * @param {AnimationViewModel} viewModel The AnimationViewModel instance requesting formatting.
     * @returns {String} The string representation of the calendar date portion of the provided date.
     */
    AnimationViewModel.defaultDateFormatter = function(date, viewModel) {
        var gregorianDate = date.toGregorianDate();
        return monthNames[gregorianDate.month - 1] + ' ' + gregorianDate.day + ' ' + gregorianDate.year;
    };

    /**
     * Gets or sets the default array of known clock multipliers associated with new instances of the shuttle ring.
     * @memberof AnimationViewModel
     */
    AnimationViewModel.defaultTicks = [//
    0.001, 0.002, 0.005, 0.01, 0.02, 0.05, 0.1, 0.25, 0.5, 1.0, 2.0, 5.0, 10.0,//
    15.0, 30.0, 60.0, 120.0, 300.0, 600.0, 900.0, 1800.0, 3600.0, 7200.0, 14400.0,//
    21600.0, 43200.0, 86400.0, 172800.0, 345600.0, 604800.0];

    /**
     * The default time formatter used by new instances.
     * @memberof AnimationViewModel
     *
     * @param {JulianDate} date The date to be formatted
     * @param {AnimationViewModel} viewModel The AnimationViewModel instance requesting formatting.
     * @returns {String} The string representation of the time portion of the provided date.
     */
    AnimationViewModel.defaultTimeFormatter = function(date, viewModel) {
        var gregorianDate = date.toGregorianDate();
        var millisecond = Math.round(gregorianDate.millisecond);
        if (Math.abs(viewModel._clockViewModel.multiplier) < 1) {
            return sprintf("%02d:%02d:%02d.%03d", gregorianDate.hour, gregorianDate.minute, gregorianDate.second, millisecond);
        }
        return sprintf("%02d:%02d:%02d UTC", gregorianDate.hour, gregorianDate.minute, gregorianDate.second);
    };

    /**
     * Gets a copy of the array of positive known clock multipliers to associate with the shuttle ring.
     *
     * @memberof AnimationViewModel
     * @returns The array of known clock multipliers associated with the shuttle ring.
     */
    AnimationViewModel.prototype.getShuttleRingTicks = function() {
        return this._sortedFilteredPositiveTicks.slice(0);
    };

    /**
     * Sets the array of positive known clock multipliers to associate with the shuttle ring.
     * These values will have negative equivalents created for them and sets both the minimum
     * and maximum range of values for the shuttle ring as well as the values that are snapped
     * to when a single click is made.  The values need not be in order, as they will be sorted
     * automatically, and duplicate values will be removed.
     * @memberof AnimationViewModel
     *
     * @param positiveTicks The list of known positive clock multipliers to associate with the shuttle ring.
     *
     * @exception {DeveloperError} positiveTicks is required.
     */
    AnimationViewModel.prototype.setShuttleRingTicks = function(positiveTicks) {
        if (typeof positiveTicks === 'undefined') {
            throw new DeveloperError('positiveTicks is required.');
        }

        var i;
        var len;
        var tick;

        var hash = {};
        var sortedFilteredPositiveTicks = this._sortedFilteredPositiveTicks;
        sortedFilteredPositiveTicks.length = 0;
        for (i = 0, len = positiveTicks.length; i < len; ++i) {
            tick = positiveTicks[i];
            //filter duplicates
            if (!hash.hasOwnProperty(tick)) {
                hash[tick] = true;
                sortedFilteredPositiveTicks.push(tick);
            }
        }
        sortedFilteredPositiveTicks.sort(numberComparator);

        var allTicks = [];
        for (len = sortedFilteredPositiveTicks.length, i = len - 1; i >= 0; --i) {
            tick = sortedFilteredPositiveTicks[i];
            if (tick !== 0) {
                allTicks.push(-tick);
            }
        }
        Array.prototype.push.apply(allTicks, sortedFilteredPositiveTicks);

        this._allShuttleRingTicks = allTicks;
    };

    defineProperties(AnimationViewModel.prototype, {
        /**
         * Gets a command that decreases the speed of animation.
         * @memberof AnimationViewModel.prototype
         * @type {Command}
         */
        slower : {
            get : function() {
                return this._slower;
            }
        },

        /**
         * Gets a command that increases the speed of animation.
         * @memberof AnimationViewModel.prototype
         * @type {Command}
         */
        faster : {
            get : function() {
                return this._faster;
            }
        },

        /**
         * Gets the clock view model.
         * @memberof AnimationViewModel.prototype
         *
         * @type {ClockViewModel}
         */
        clockViewModel : {
            get : function() {
                return this._clockViewModel;
            }
        },

        /**
         * Gets the pause toggle button view model.
         * @memberof AnimationViewModel.prototype
         *
         * @type {ToggleButtonViewModel}
         */
        pauseViewModel : {
            get : function() {
                return this._pauseViewModel;
            }
        },

        /**
         * Gets the reverse toggle button view model.
         * @memberof AnimationViewModel.prototype
         *
         * @type {ToggleButtonViewModel}
         */
        playReverseViewModel : {
            get : function() {
                return this._playReverseViewModel;
            }
        },

        /**
         * Gets the play toggle button view model.
         * @memberof AnimationViewModel.prototype
         *
         * @type {ToggleButtonViewModel}
         */
        playForwardViewModel : {
            get : function() {
                return this._playForwardViewModel;
            }
        },

        /**
         * Gets the realtime toggle button view model.
         * @memberof AnimationViewModel.prototype
         *
         * @type {ToggleButtonViewModel}
         */
        playRealtimeViewModel : {
            get : function() {
                return this._playRealtimeViewModel;
            }
        },

        /**
         * Gets or sets the current date formatting function, which takes a
         * {@link JulianDate} and an AnimationViewModel instance and
         * returns a string representation of the calendar date portion.
         * @memberof AnimationViewModel.prototype
         *
         * @type {Function}
         */
        dateFormatter : {
            //TODO:@exception {DeveloperError} dateFormatter must be a function.
            get : function() {
                return this._dateFormatter;
            },
            set : function(dateFormatter) {
                if (typeof dateFormatter !== 'function') {
                    throw new DeveloperError('dateFormatter must be a function');
                }
                this._dateFormatter = dateFormatter;
            }
        },

        /**
         * Gets or sets the current time formatting function, which takes a
         * {@link JulianDate} and an AnimationViewModel instance and
         * returns a string representation of the time portion.
         * @memberof AnimationViewModel.prototype
         *
         * @type {Function}
         */
        timeFormatter : {
            //TODO:@exception {DeveloperError} timeFormatter must be a function.
            get : function() {
                return this._timeFormatter;
            },
            set : function(timeFormatter) {
                if (typeof timeFormatter !== 'function') {
                    throw new DeveloperError('timeFormatter must be a function');
                }
                this._timeFormatter = timeFormatter;
            }
        }
    });

    //Currently exposed for tests.
    AnimationViewModel._maxShuttleRingAngle = maxShuttleRingAngle;
    AnimationViewModel._realtimeShuttleRingAngle = realtimeShuttleRingAngle;

    return AnimationViewModel;
});
