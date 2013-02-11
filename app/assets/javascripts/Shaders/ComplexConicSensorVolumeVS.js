// This file is automatically rebuilt by the Cesium build process.
/*global define*/
define(function() {
    "use strict";
    return "attribute vec4 position;\n\
varying vec3 v_positionEC;\n\
varying vec3 v_sensorVertexWC;\n\
varying vec3 v_sensorVertexEC;\n\
varying vec3 v_sensorAxisEC;\n\
void main()\n\
{\n\
gl_Position = czm_modelViewInfiniteProjection * position;\n\
v_positionEC = (czm_modelView * position).xyz;\n\
vec4 sensorVertexMC = vec4(0.0, 0.0, 0.0, 1.0);\n\
v_sensorVertexWC = (czm_model * sensorVertexMC).xyz;\n\
v_sensorVertexEC = (czm_modelView * sensorVertexMC).xyz;\n\
v_sensorAxisEC = czm_normal * vec3(0.0, 0.0, 1.0);\n\
}\n\
";
});