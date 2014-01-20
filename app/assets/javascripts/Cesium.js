/*global define*/
define([
    'Core/AxisAlignedBoundingBox',
    'Core/BingMapsApi',
    'Core/BoundingRectangle',
    'Core/BoundingSphere',
    'Core/BoxGeometry',
    'Core/BoxOutlineGeometry',
    'Core/Cartesian2',
    'Core/Cartesian3',
    'Core/Cartesian4',
    'Core/Cartographic',
    'Core/CatmullRomSpline',
    'Core/CircleGeometry',
    'Core/CircleOutlineGeometry',
    'Core/Clock',
    'Core/ClockRange',
    'Core/ClockStep',
    'Core/Color',
    'Core/ColorGeometryInstanceAttribute',
    'Core/ComponentDatatype',
    'Core/CornerType',
    'Core/CorridorGeometry',
    'Core/CorridorGeometryLibrary',
    'Core/CorridorOutlineGeometry',
    'Core/CubicRealPolynomial',
    'Core/CylinderGeometry',
    'Core/CylinderGeometryLibrary',
    'Core/CylinderOutlineGeometry',
    'Core/DefaultProxy',
    'Core/DeveloperError',
    'Core/EarthOrientationParameters',
    'Core/EarthOrientationParametersSample',
    'Core/EllipseGeometry',
    'Core/EllipseGeometryLibrary',
    'Core/EllipseOutlineGeometry',
    'Core/Ellipsoid',
    'Core/EllipsoidGeodesic',
    'Core/EllipsoidGeometry',
    'Core/EllipsoidOutlineGeometry',
    'Core/EllipsoidTangentPlane',
    'Core/EllipsoidalOccluder',
    'Core/EncodedCartesian3',
    'Core/Enumeration',
    'Core/Event',
    'Core/EventHelper',
    'Core/Extent',
    'Core/ExtentGeometry',
    'Core/ExtentOutlineGeometry', 'Core/FAR', 'Core/FeatureDetection', 'Core/Fullscreen', 'Core/GeographicProjection', 'Core/Geometry', 'Core/GeometryAttribute', 'Core/GeometryAttributes', 'Core/GeometryInstance', 'Core/GeometryInstanceAttribute', 'Core/GeometryPipeline', 'Core/HeightmapTessellator', 'Core/HermitePolynomialApproximation', 'Core/HermiteSpline', 'Core/Iau2000Orientation', 'Core/Iau2006XysData', 'Core/Iau2006XysSample', 'Core/IauOrientationAxes', 'Core/IauOrientationParameters', 'Core/IndexDatatype', 'Core/InterpolationAlgorithm', 'Core/Intersect', 'Core/IntersectionTests', 'Core/Interval', 'Core/Iso8601', 'Core/JulianDate', 'Core/KeyboardEventModifier', 'Core/LagrangePolynomialApproximation', 'Core/LeapSecond', 'Core/LinearApproximation', 'Core/LinearSpline', 'Core/Math', 'Core/Matrix2', 'Core/Matrix3', 'Core/Matrix4', 'Core/NearFarScalar', 'Core/ObjectOrientedBoundingBox', 'Core/Occluder', 'Core/Packable', 'Core/PackableForInterpolation', 'Core/Plane', 'Core/PolygonGeometry', 'Core/PolygonGeometryLibrary', 'Core/PolygonOutlineGeometry', 'Core/PolygonPipeline', 'Core/PolylineGeometry', 'Core/PolylinePipeline', 'Core/PolylineVolumeGeometry', 'Core/PolylineVolumeGeometryLibrary', 'Core/PolylineVolumeOutlineGeometry', 'Core/PrimitiveType', 'Core/QuadraticRealPolynomial', 'Core/QuarticRealPolynomial', 'Core/Quaternion', 'Core/QuaternionSpline', 'Core/Queue', 'Core/Ray', 'Core/ReferenceFrame', 'Core/RequestErrorEvent', 'Core/RuntimeError', 'Core/ScreenSpaceEventHandler', 'Core/ScreenSpaceEventType', 'Core/Shapes', 'Core/ShowGeometryInstanceAttribute', 'Core/Simon1994PlanetaryPositions', 'Core/SimplePolylineGeometry', 'Core/SphereGeometry', 'Core/SphereOutlineGeometry', 'Core/Spherical', 'Core/Spline', 'Core/TaskProcessor', 'Core/TimeConstants', 'Core/TimeInterval', 'Core/TimeIntervalCollection', 'Core/TimeStandard', 'Core/Tipsify', 'Core/Transforms', 'Core/TridiagonalSystemSolver', 'Core/VertexFormat', 'Core/Visibility', 'Core/WallGeometry', 'Core/WallGeometryLibrary', 'Core/WallOutlineGeometry', 'Core/WebMercatorProjection', 'Core/WindingOrder', 'Core/barycentricCoordinates', 'Core/binarySearch', 'Core/buildModuleUrl', 'Core/cancelAnimationFrame', 'Core/clone', 'Core/combine', 'Core/createGuid', 'Core/defaultValue', 'Core/defineProperties', 'Core/defined', 'Core/destroyObject', 'Core/freezeObject', 'Core/getFilenameFromUri', 'Core/getImagePixels', 'Core/isCrossOriginUrl', 'Core/isLeapYear', 'Core/jsonp', 'Core/loadArrayBuffer', 'Core/loadBlob', 'Core/loadImage', 'Core/loadImageViaBlob', 'Core/loadJson', 'Core/loadText', 'Core/loadWithXhr', 'Core/loadXML', 'Core/pointInsideTriangle', 'Core/requestAnimationFrame', 'Core/throttleRequestByServer', 'Core/wrapFunction', 'Core/writeTextToCanvas', 'DynamicScene/ColorMaterialProperty', 'DynamicScene/CompositeDynamicObjectCollection', 'DynamicScene/CompositeMaterialProperty', 'DynamicScene/CompositePositionProperty', 'DynamicScene/CompositeProperty', 'DynamicScene/ConstantPositionProperty', 'DynamicScene/ConstantProperty', 'DynamicScene/CzmlDataSource', 'DynamicScene/DataSource', 'DynamicScene/DataSourceCollection', 'DynamicScene/DataSourceDisplay', 'DynamicScene/DynamicBillboard', 'DynamicScene/DynamicBillboardVisualizer', 'DynamicScene/DynamicClock', 'DynamicScene/DynamicCone', 'DynamicScene/DynamicConeVisualizerUsingCustomSensor', 'DynamicScene/DynamicDirectionsProperty', 'DynamicScene/DynamicEllipse', 'DynamicScene/DynamicEllipsoid', 'DynamicScene/DynamicEllipsoidVisualizer', 'DynamicScene/DynamicLabel', 'DynamicScene/DynamicLabelVisualizer', 'DynamicScene/DynamicObject', 'DynamicScene/DynamicObjectCollection', 'DynamicScene/DynamicObjectView', 'DynamicScene/DynamicPath', 'DynamicScene/DynamicPathVisualizer', 'DynamicScene/DynamicPoint', 'DynamicScene/DynamicPointVisualizer', 'DynamicScene/DynamicPolygon', 'DynamicScene/DynamicPolygonVisualizer', 'DynamicScene/DynamicPolyline', 'DynamicScene/DynamicPolylineVisualizer', 'DynamicScene/DynamicPyramid', 'DynamicScene/DynamicPyramidVisualizer', 'DynamicScene/DynamicVector', 'DynamicScene/DynamicVectorVisualizer', 'DynamicScene/DynamicVertexPositionsProperty', 'DynamicScene/GeoJsonDataSource', 'DynamicScene/GridMaterialProperty', 'DynamicScene/ImageMaterialProperty', 'DynamicScene/MaterialProperty', 'DynamicScene/PolylineOutlineMaterialProperty', 'DynamicScene/PositionProperty', 'DynamicScene/Property', 'DynamicScene/ReferenceProperty', 'DynamicScene/SampledPositionProperty', 'DynamicScene/SampledProperty', 'DynamicScene/TimeIntervalCollectionPositionProperty', 'DynamicScene/TimeIntervalCollectionProperty', 'DynamicScene/VisualizerCollection', 'DynamicScene/createDynamicPropertyDescriptor', 'Renderer/AutomaticUniforms', 'Renderer/BlendEquation', 'Renderer/BlendFunction', 'Renderer/BlendingState', 'Renderer/Buffer', 'Renderer/BufferUsage', 'Renderer/ClearCommand', 'Renderer/Context', 'Renderer/CubeMap', 'Renderer/CubeMapFace', 'Renderer/CullFace', 'Renderer/DepthFunction', 'Renderer/DrawCommand', 'Renderer/Framebuffer', 'Renderer/MipmapHint', 'Renderer/Pass', 'Renderer/PassState', 'Renderer/PickFramebuffer', 'Renderer/PixelDatatype', 'Renderer/PixelFormat', 'Renderer/RenderState', 'Renderer/Renderbuffer', 'Renderer/RenderbufferFormat', 'Renderer/ShaderCache', 'Renderer/ShaderProgram', 'Renderer/StencilFunction', 'Renderer/StencilOperation', 'Renderer/Texture', 'Renderer/TextureAtlas', 'Renderer/TextureAtlasBuilder', 'Renderer/TextureMagnificationFilter', 'Renderer/TextureMinificationFilter', 'Renderer/TextureWrap', 'Renderer/UniformDatatype', 'Renderer/UniformState', 'Renderer/VertexArray', 'Renderer/VertexArrayFacade', 'Renderer/VertexLayout', 'Renderer/createShaderSource', 'Renderer/loadCubeMap', 'Scene/AnimationCollection', 'Scene/Appearance', 'Scene/ArcGisImageServerTerrainProvider', 'Scene/ArcGisMapServerImageryProvider', 'Scene/Billboard', 'Scene/BillboardCollection', 'Scene/BingMapsImageryProvider', 'Scene/BingMapsStyle', 'Scene/Camera', 'Scene/CameraColumbusViewMode', 'Scene/CameraController', 'Scene/CameraEventAggregator', 'Scene/CameraEventType', 'Scene/CameraFlightPath', 'Scene/CentralBody', 'Scene/CentralBodySurface', 'Scene/CentralBodySurfaceShaderSet', 'Scene/CesiumTerrainProvider', 'Scene/CompositePrimitive', 'Scene/Credit', 'Scene/CreditDisplay', 'Scene/CullingVolume', 'Scene/CustomSensorVolume', 'Scene/DebugAppearance', 'Scene/DebugModelMatrixPrimitive', 'Scene/DiscardMissingTileImagePolicy', 'Scene/EllipsoidPrimitive', 'Scene/EllipsoidSurfaceAppearance', 'Scene/EllipsoidTerrainProvider', 'Scene/ExtentPrimitive', 'Scene/FrameState', 'Scene/FrustumCommands', 'Scene/GeographicTilingScheme', 'Scene/GoogleEarthImageryProvider', 'Scene/GridImageryProvider', 'Scene/HeightmapTerrainData', 'Scene/HorizontalOrigin', 'Scene/Imagery', 'Scene/ImageryLayer', 'Scene/ImageryLayerCollection', 'Scene/ImageryProvider', 'Scene/ImageryState', 'Scene/Label', 'Scene/LabelCollection', 'Scene/LabelStyle', 'Scene/Material', 'Scene/MaterialAppearance', 'Scene/Moon', 'Scene/NeverTileDiscardPolicy', 'Scene/OpenStreetMapImageryProvider', 'Scene/OrthographicFrustum', 'Scene/PerInstanceColorAppearance', 'Scene/PerformanceDisplay', 'Scene/PerspectiveFrustum', 'Scene/PerspectiveOffCenterFrustum', 'Scene/Polygon', 'Scene/Polyline', 'Scene/PolylineCollection', 'Scene/PolylineColorAppearance', 'Scene/PolylineMaterialAppearance', 'Scene/Primitive', 'Scene/PrimitivePipeline', 'Scene/PrimitiveState', 'Scene/RectangularPyramidSensorVolume', 'Scene/Scene', 'Scene/SceneMode', 'Scene/SceneTransforms', 'Scene/SceneTransitioner', 'Scene/ScreenSpaceCameraController', 'Scene/SensorVolumeCollection', 'Scene/SingleTileImageryProvider', 'Scene/SkyAtmosphere', 'Scene/SkyBox', 'Scene/Sun', 'Scene/SunPostProcess', 'Scene/TerrainData', 'Scene/TerrainMesh', 'Scene/TerrainProvider', 'Scene/TerrainState', 'Scene/TexturePool', 'Scene/Tile', 'Scene/TileCoordinatesImageryProvider', 'Scene/TileDiscardPolicy', 'Scene/TileImagery', 'Scene/TileMapServiceImageryProvider', 'Scene/TileProviderError', 'Scene/TileReplacementQueue', 'Scene/TileState', 'Scene/TileTerrain', 'Scene/TilingScheme', 'Scene/VRTheWorldTerrainProvider', 'Scene/VerticalOrigin', 'Scene/ViewportQuad', 'Scene/WebMapServiceImageryProvider', 'Scene/WebMercatorTilingScheme', 'Scene/createTangentSpaceDebugPrimitive', 'Scene/sampleTerrain', 'ThirdParty/Tween', 'ThirdParty/Uri', 'ThirdParty/measureText', 'ThirdParty/mersenne-twister', 'ThirdParty/sprintf', 'ThirdParty/topojson', 'ThirdParty/weakmap', 'ThirdParty/when',
    'Workers/createTaskProcessorWorker'
], function(Core_AxisAlignedBoundingBox, Core_BingMapsApi, Core_BoundingRectangle, Core_BoundingSphere, Core_BoxGeometry, Core_BoxOutlineGeometry, Core_Cartesian2, Core_Cartesian3, Core_Cartesian4, Core_Cartographic, Core_CatmullRomSpline, Core_CircleGeometry, Core_CircleOutlineGeometry, Core_Clock, Core_ClockRange, Core_ClockStep, Core_Color, Core_ColorGeometryInstanceAttribute, Core_ComponentDatatype, Core_CornerType, Core_CorridorGeometry, Core_CorridorGeometryLibrary, Core_CorridorOutlineGeometry, Core_CubicRealPolynomial, Core_CylinderGeometry, Core_CylinderGeometryLibrary, Core_CylinderOutlineGeometry, Core_DefaultProxy, Core_DeveloperError, Core_EarthOrientationParameters, Core_EarthOrientationParametersSample, Core_EllipseGeometry, Core_EllipseGeometryLibrary, Core_EllipseOutlineGeometry, Core_Ellipsoid, Core_EllipsoidGeodesic, Core_EllipsoidGeometry, Core_EllipsoidOutlineGeometry, Core_EllipsoidTangentPlane, Core_EllipsoidalOccluder, Core_EncodedCartesian3, Core_Enumeration, Core_Event, Core_EventHelper, Core_Extent, Core_ExtentGeometry, Core_ExtentOutlineGeometry, Core_FAR, Core_FeatureDetection, Core_Fullscreen, Core_GeographicProjection, Core_Geometry, Core_GeometryAttribute, Core_GeometryAttributes, Core_GeometryInstance, Core_GeometryInstanceAttribute, Core_GeometryPipeline, Core_HeightmapTessellator, Core_HermitePolynomialApproximation, Core_HermiteSpline, Core_Iau2000Orientation, Core_Iau2006XysData, Core_Iau2006XysSample, Core_IauOrientationAxes, Core_IauOrientationParameters, Core_IndexDatatype, Core_InterpolationAlgorithm, Core_Intersect, Core_IntersectionTests, Core_Interval, Core_Iso8601, Core_JulianDate, Core_KeyboardEventModifier, Core_LagrangePolynomialApproximation, Core_LeapSecond, Core_LinearApproximation, Core_LinearSpline, Core_Math, Core_Matrix2, Core_Matrix3, Core_Matrix4, Core_NearFarScalar, Core_ObjectOrientedBoundingBox, Core_Occluder, Core_Packable, Core_PackableForInterpolation, Core_Plane, Core_PolygonGeometry, Core_PolygonGeometryLibrary, Core_PolygonOutlineGeometry, Core_PolygonPipeline, Core_PolylineGeometry, Core_PolylinePipeline, Core_PolylineVolumeGeometry, Core_PolylineVolumeGeometryLibrary, Core_PolylineVolumeOutlineGeometry, Core_PrimitiveType, Core_QuadraticRealPolynomial, Core_QuarticRealPolynomial, Core_Quaternion, Core_QuaternionSpline, Core_Queue, Core_Ray, Core_ReferenceFrame, Core_RequestErrorEvent, Core_RuntimeError, Core_ScreenSpaceEventHandler, Core_ScreenSpaceEventType, Core_Shapes, Core_ShowGeometryInstanceAttribute, Core_Simon1994PlanetaryPositions, Core_SimplePolylineGeometry, Core_SphereGeometry, Core_SphereOutlineGeometry, Core_Spherical, Core_Spline, Core_TaskProcessor, Core_TimeConstants, Core_TimeInterval, Core_TimeIntervalCollection, Core_TimeStandard, Core_Tipsify, Core_Transforms, Core_TridiagonalSystemSolver, Core_VertexFormat, Core_Visibility, Core_WallGeometry, Core_WallGeometryLibrary, Core_WallOutlineGeometry, Core_WebMercatorProjection, Core_WindingOrder, Core_barycentricCoordinates, Core_binarySearch, Core_buildModuleUrl, Core_cancelAnimationFrame, Core_clone, Core_combine, Core_createGuid, Core_defaultValue, Core_defineProperties, Core_defined, Core_destroyObject, Core_freezeObject, Core_getFilenameFromUri, Core_getImagePixels, Core_isCrossOriginUrl, Core_isLeapYear, Core_jsonp, Core_loadArrayBuffer, Core_loadBlob, Core_loadImage, Core_loadImageViaBlob, Core_loadJson, Core_loadText, Core_loadWithXhr, Core_loadXML, Core_pointInsideTriangle, Core_requestAnimationFrame, Core_throttleRequestByServer, Core_wrapFunction, Core_writeTextToCanvas, DynamicScene_ColorMaterialProperty, DynamicScene_CompositeDynamicObjectCollection, DynamicScene_CompositeMaterialProperty, DynamicScene_CompositePositionProperty, DynamicScene_CompositeProperty, DynamicScene_ConstantPositionProperty, DynamicScene_ConstantProperty, DynamicScene_CzmlDataSource, DynamicScene_DataSource, DynamicScene_DataSourceCollection, DynamicScene_DataSourceDisplay, DynamicScene_DynamicBillboard, DynamicScene_DynamicBillboardVisualizer, DynamicScene_DynamicClock, DynamicScene_DynamicCone, DynamicScene_DynamicConeVisualizerUsingCustomSensor, DynamicScene_DynamicDirectionsProperty, DynamicScene_DynamicEllipse, DynamicScene_DynamicEllipsoid, DynamicScene_DynamicEllipsoidVisualizer, DynamicScene_DynamicLabel, DynamicScene_DynamicLabelVisualizer, DynamicScene_DynamicObject, DynamicScene_DynamicObjectCollection, DynamicScene_DynamicObjectView, DynamicScene_DynamicPath, DynamicScene_DynamicPathVisualizer, DynamicScene_DynamicPoint, DynamicScene_DynamicPointVisualizer, DynamicScene_DynamicPolygon, DynamicScene_DynamicPolygonVisualizer, DynamicScene_DynamicPolyline, DynamicScene_DynamicPolylineVisualizer, DynamicScene_DynamicPyramid, DynamicScene_DynamicPyramidVisualizer, DynamicScene_DynamicVector, DynamicScene_DynamicVectorVisualizer, DynamicScene_DynamicVertexPositionsProperty, DynamicScene_GeoJsonDataSource, DynamicScene_GridMaterialProperty, DynamicScene_ImageMaterialProperty, DynamicScene_MaterialProperty, DynamicScene_PolylineOutlineMaterialProperty, DynamicScene_PositionProperty, DynamicScene_Property, DynamicScene_ReferenceProperty, DynamicScene_SampledPositionProperty, DynamicScene_SampledProperty, DynamicScene_TimeIntervalCollectionPositionProperty, DynamicScene_TimeIntervalCollectionProperty, DynamicScene_VisualizerCollection, DynamicScene_createDynamicPropertyDescriptor, Renderer_AutomaticUniforms, Renderer_BlendEquation, Renderer_BlendFunction, Renderer_BlendingState, Renderer_Buffer, Renderer_BufferUsage, Renderer_ClearCommand, Renderer_Context, Renderer_CubeMap, Renderer_CubeMapFace, Renderer_CullFace, Renderer_DepthFunction, Renderer_DrawCommand, Renderer_Framebuffer, Renderer_MipmapHint, Renderer_Pass, Renderer_PassState, Renderer_PickFramebuffer, Renderer_PixelDatatype, Renderer_PixelFormat, Renderer_RenderState, Renderer_Renderbuffer, Renderer_RenderbufferFormat, Renderer_ShaderCache, Renderer_ShaderProgram, Renderer_StencilFunction, Renderer_StencilOperation, Renderer_Texture, Renderer_TextureAtlas, Renderer_TextureAtlasBuilder, Renderer_TextureMagnificationFilter, Renderer_TextureMinificationFilter, Renderer_TextureWrap, Renderer_UniformDatatype, Renderer_UniformState, Renderer_VertexArray, Renderer_VertexArrayFacade, Renderer_VertexLayout, Renderer_createShaderSource, Renderer_loadCubeMap, Scene_AnimationCollection, Scene_Appearance, Scene_ArcGisImageServerTerrainProvider, Scene_ArcGisMapServerImageryProvider, Scene_Billboard, Scene_BillboardCollection, Scene_BingMapsImageryProvider, Scene_BingMapsStyle, Scene_Camera, Scene_CameraColumbusViewMode, Scene_CameraController, Scene_CameraEventAggregator, Scene_CameraEventType, Scene_CameraFlightPath, Scene_CentralBody, Scene_CentralBodySurface, Scene_CentralBodySurfaceShaderSet, Scene_CesiumTerrainProvider, Scene_CompositePrimitive, Scene_Credit, Scene_CreditDisplay, Scene_CullingVolume, Scene_CustomSensorVolume, Scene_DebugAppearance, Scene_DebugModelMatrixPrimitive, Scene_DiscardMissingTileImagePolicy, Scene_EllipsoidPrimitive, Scene_EllipsoidSurfaceAppearance, Scene_EllipsoidTerrainProvider, Scene_ExtentPrimitive, Scene_FrameState, Scene_FrustumCommands, Scene_GeographicTilingScheme, Scene_GoogleEarthImageryProvider, Scene_GridImageryProvider, Scene_HeightmapTerrainData, Scene_HorizontalOrigin, Scene_Imagery, Scene_ImageryLayer, Scene_ImageryLayerCollection, Scene_ImageryProvider, Scene_ImageryState, Scene_Label, Scene_LabelCollection, Scene_LabelStyle, Scene_Material, Scene_MaterialAppearance, Scene_Moon, Scene_NeverTileDiscardPolicy, Scene_OpenStreetMapImageryProvider, Scene_OrthographicFrustum, Scene_PerInstanceColorAppearance, Scene_PerformanceDisplay, Scene_PerspectiveFrustum, Scene_PerspectiveOffCenterFrustum, Scene_Polygon, Scene_Polyline, Scene_PolylineCollection, Scene_PolylineColorAppearance, Scene_PolylineMaterialAppearance, Scene_Primitive, Scene_PrimitivePipeline, Scene_PrimitiveState, Scene_RectangularPyramidSensorVolume, Scene_Scene, Scene_SceneMode, Scene_SceneTransforms, Scene_SceneTransitioner, Scene_ScreenSpaceCameraController, Scene_SensorVolumeCollection, Scene_SingleTileImageryProvider, Scene_SkyAtmosphere, Scene_SkyBox, Scene_Sun, Scene_SunPostProcess, Scene_TerrainData, Scene_TerrainMesh, Scene_TerrainProvider, Scene_TerrainState, Scene_TexturePool, Scene_Tile, Scene_TileCoordinatesImageryProvider, Scene_TileDiscardPolicy, Scene_TileImagery, Scene_TileMapServiceImageryProvider, Scene_TileProviderError, Scene_TileReplacementQueue, Scene_TileState, Scene_TileTerrain, Scene_TilingScheme, Scene_VRTheWorldTerrainProvider, Scene_VerticalOrigin, Scene_ViewportQuad, Scene_WebMapServiceImageryProvider, Scene_WebMercatorTilingScheme, Scene_createTangentSpaceDebugPrimitive, Scene_sampleTerrain, ThirdParty_Tween, ThirdParty_Uri, ThirdParty_measureText, ThirdParty_mersenne_twister, ThirdParty_sprintf, ThirdParty_topojson, ThirdParty_weakmap, ThirdParty_when, Workers_createTaskProcessorWorker) {
  "use strict";
  /*jshint sub:true*/
  var Cesium = {
    _shaders : {}
  };
  Cesium['AxisAlignedBoundingBox'] = Core_AxisAlignedBoundingBox;
  Cesium['BingMapsApi'] = Core_BingMapsApi;
  Cesium['BoundingRectangle'] = Core_BoundingRectangle;
  Cesium['BoundingSphere'] = Core_BoundingSphere;
  Cesium['BoxGeometry'] = Core_BoxGeometry;
  Cesium['BoxOutlineGeometry'] = Core_BoxOutlineGeometry;
  Cesium['Cartesian2'] = Core_Cartesian2;
  Cesium['Cartesian3'] = Core_Cartesian3;
  Cesium['Cartesian4'] = Core_Cartesian4;
  Cesium['Cartographic'] = Core_Cartographic;
  Cesium['CatmullRomSpline'] = Core_CatmullRomSpline;
  Cesium['CircleGeometry'] = Core_CircleGeometry;
  Cesium['CircleOutlineGeometry'] = Core_CircleOutlineGeometry;
  Cesium['Clock'] = Core_Clock;
  Cesium['ClockRange'] = Core_ClockRange;
  Cesium['ClockStep'] = Core_ClockStep;
  Cesium['Color'] = Core_Color;
  Cesium['ColorGeometryInstanceAttribute'] = Core_ColorGeometryInstanceAttribute;
  Cesium['ComponentDatatype'] = Core_ComponentDatatype;
  Cesium['CornerType'] = Core_CornerType;
  Cesium['CorridorGeometry'] = Core_CorridorGeometry;
  Cesium['CorridorGeometryLibrary'] = Core_CorridorGeometryLibrary;
  Cesium['CorridorOutlineGeometry'] = Core_CorridorOutlineGeometry;
  Cesium['CubicRealPolynomial'] = Core_CubicRealPolynomial;
  Cesium['CylinderGeometry'] = Core_CylinderGeometry;
  Cesium['CylinderGeometryLibrary'] = Core_CylinderGeometryLibrary;
  Cesium['CylinderOutlineGeometry'] = Core_CylinderOutlineGeometry;
  Cesium['DefaultProxy'] = Core_DefaultProxy;
  Cesium['DeveloperError'] = Core_DeveloperError;
  Cesium['EarthOrientationParameters'] = Core_EarthOrientationParameters;
  Cesium['EarthOrientationParametersSample'] = Core_EarthOrientationParametersSample;
  Cesium['EllipseGeometry'] = Core_EllipseGeometry;
  Cesium['EllipseGeometryLibrary'] = Core_EllipseGeometryLibrary;
  Cesium['EllipseOutlineGeometry'] = Core_EllipseOutlineGeometry;
  Cesium['Ellipsoid'] = Core_Ellipsoid;
  Cesium['EllipsoidGeodesic'] = Core_EllipsoidGeodesic;
  Cesium['EllipsoidGeometry'] = Core_EllipsoidGeometry;
  Cesium['EllipsoidOutlineGeometry'] = Core_EllipsoidOutlineGeometry;
  Cesium['EllipsoidTangentPlane'] = Core_EllipsoidTangentPlane;
  Cesium['EllipsoidalOccluder'] = Core_EllipsoidalOccluder;
  Cesium['EncodedCartesian3'] = Core_EncodedCartesian3;
  Cesium['Enumeration'] = Core_Enumeration;
  Cesium['Event'] = Core_Event;
  Cesium['EventHelper'] = Core_EventHelper;
  Cesium['Extent'] = Core_Extent;
  Cesium['ExtentGeometry'] = Core_ExtentGeometry;
  Cesium['ExtentOutlineGeometry'] = Core_ExtentOutlineGeometry;
  Cesium['FAR'] = Core_FAR;
  Cesium['FeatureDetection'] = Core_FeatureDetection;
  Cesium['Fullscreen'] = Core_Fullscreen;
  Cesium['GeographicProjection'] = Core_GeographicProjection;
  Cesium['Geometry'] = Core_Geometry;
  Cesium['GeometryAttribute'] = Core_GeometryAttribute;
  Cesium['GeometryAttributes'] = Core_GeometryAttributes;
  Cesium['GeometryInstance'] = Core_GeometryInstance;
  Cesium['GeometryInstanceAttribute'] = Core_GeometryInstanceAttribute;
  Cesium['GeometryPipeline'] = Core_GeometryPipeline;
  Cesium['HeightmapTessellator'] = Core_HeightmapTessellator;
  Cesium['HermitePolynomialApproximation'] = Core_HermitePolynomialApproximation;
  Cesium['HermiteSpline'] = Core_HermiteSpline;
  Cesium['Iau2000Orientation'] = Core_Iau2000Orientation;
  Cesium['Iau2006XysData'] = Core_Iau2006XysData;
  Cesium['Iau2006XysSample'] = Core_Iau2006XysSample;
  Cesium['IauOrientationAxes'] = Core_IauOrientationAxes;
  Cesium['IauOrientationParameters'] = Core_IauOrientationParameters;
  Cesium['IndexDatatype'] = Core_IndexDatatype;
  Cesium['InterpolationAlgorithm'] = Core_InterpolationAlgorithm;
  Cesium['Intersect'] = Core_Intersect;
  Cesium['IntersectionTests'] = Core_IntersectionTests;
  Cesium['Interval'] = Core_Interval;
  Cesium['Iso8601'] = Core_Iso8601;
  Cesium['JulianDate'] = Core_JulianDate;
  Cesium['KeyboardEventModifier'] = Core_KeyboardEventModifier;
  Cesium['LagrangePolynomialApproximation'] = Core_LagrangePolynomialApproximation;
  Cesium['LeapSecond'] = Core_LeapSecond;
  Cesium['LinearApproximation'] = Core_LinearApproximation;
  Cesium['LinearSpline'] = Core_LinearSpline;
  Cesium['Math'] = Core_Math;
  Cesium['Matrix2'] = Core_Matrix2;
  Cesium['Matrix3'] = Core_Matrix3;
  Cesium['Matrix4'] = Core_Matrix4;
  Cesium['NearFarScalar'] = Core_NearFarScalar;
  Cesium['ObjectOrientedBoundingBox'] = Core_ObjectOrientedBoundingBox;
  Cesium['Occluder'] = Core_Occluder;
  Cesium['Packable'] = Core_Packable;
  Cesium['PackableForInterpolation'] = Core_PackableForInterpolation;
  Cesium['Plane'] = Core_Plane;
  Cesium['PolygonGeometry'] = Core_PolygonGeometry;
  Cesium['PolygonGeometryLibrary'] = Core_PolygonGeometryLibrary;
  Cesium['PolygonOutlineGeometry'] = Core_PolygonOutlineGeometry;
  Cesium['PolygonPipeline'] = Core_PolygonPipeline;
  Cesium['PolylineGeometry'] = Core_PolylineGeometry;
  Cesium['PolylinePipeline'] = Core_PolylinePipeline;
  Cesium['PolylineVolumeGeometry'] = Core_PolylineVolumeGeometry;
  Cesium['PolylineVolumeGeometryLibrary'] = Core_PolylineVolumeGeometryLibrary;
  Cesium['PolylineVolumeOutlineGeometry'] = Core_PolylineVolumeOutlineGeometry;
  Cesium['PrimitiveType'] = Core_PrimitiveType;
  Cesium['QuadraticRealPolynomial'] = Core_QuadraticRealPolynomial;
  Cesium['QuarticRealPolynomial'] = Core_QuarticRealPolynomial;
  Cesium['Quaternion'] = Core_Quaternion;
  Cesium['QuaternionSpline'] = Core_QuaternionSpline;
  Cesium['Queue'] = Core_Queue;
  Cesium['Ray'] = Core_Ray;
  Cesium['ReferenceFrame'] = Core_ReferenceFrame;
  Cesium['RequestErrorEvent'] = Core_RequestErrorEvent;
  Cesium['RuntimeError'] = Core_RuntimeError;
  Cesium['ScreenSpaceEventHandler'] = Core_ScreenSpaceEventHandler;
  Cesium['ScreenSpaceEventType'] = Core_ScreenSpaceEventType;
  Cesium['Shapes'] = Core_Shapes;
  Cesium['ShowGeometryInstanceAttribute'] = Core_ShowGeometryInstanceAttribute;
  Cesium['Simon1994PlanetaryPositions'] = Core_Simon1994PlanetaryPositions;
  Cesium['SimplePolylineGeometry'] = Core_SimplePolylineGeometry;
  Cesium['SphereGeometry'] = Core_SphereGeometry;
  Cesium['SphereOutlineGeometry'] = Core_SphereOutlineGeometry;
  Cesium['Spherical'] = Core_Spherical;
  Cesium['Spline'] = Core_Spline;
  Cesium['TaskProcessor'] = Core_TaskProcessor;
  Cesium['TimeConstants'] = Core_TimeConstants;
  Cesium['TimeInterval'] = Core_TimeInterval;
  Cesium['TimeIntervalCollection'] = Core_TimeIntervalCollection;
  Cesium['TimeStandard'] = Core_TimeStandard;
  Cesium['Tipsify'] = Core_Tipsify;
  Cesium['Transforms'] = Core_Transforms;
  Cesium['TridiagonalSystemSolver'] = Core_TridiagonalSystemSolver;
  Cesium['VertexFormat'] = Core_VertexFormat;
  Cesium['Visibility'] = Core_Visibility;
  Cesium['WallGeometry'] = Core_WallGeometry;
  Cesium['WallGeometryLibrary'] = Core_WallGeometryLibrary;
  Cesium['WallOutlineGeometry'] = Core_WallOutlineGeometry;
  Cesium['WebMercatorProjection'] = Core_WebMercatorProjection;
  Cesium['WindingOrder'] = Core_WindingOrder;
  Cesium['barycentricCoordinates'] = Core_barycentricCoordinates;
  Cesium['binarySearch'] = Core_binarySearch;
  Cesium['buildModuleUrl'] = Core_buildModuleUrl;
  Cesium['cancelAnimationFrame'] = Core_cancelAnimationFrame;
  Cesium['clone'] = Core_clone;
  Cesium['combine'] = Core_combine;
  Cesium['createGuid'] = Core_createGuid;
  Cesium['defaultValue'] = Core_defaultValue;
  Cesium['defineProperties'] = Core_defineProperties;
  Cesium['defined'] = Core_defined;
  Cesium['destroyObject'] = Core_destroyObject;
  Cesium['freezeObject'] = Core_freezeObject;
  Cesium['getFilenameFromUri'] = Core_getFilenameFromUri;
  Cesium['getImagePixels'] = Core_getImagePixels;
  Cesium['isCrossOriginUrl'] = Core_isCrossOriginUrl;
  Cesium['isLeapYear'] = Core_isLeapYear;
  Cesium['jsonp'] = Core_jsonp;
  Cesium['loadArrayBuffer'] = Core_loadArrayBuffer;
  Cesium['loadBlob'] = Core_loadBlob;
  Cesium['loadImage'] = Core_loadImage;
  Cesium['loadImageViaBlob'] = Core_loadImageViaBlob;
  Cesium['loadJson'] = Core_loadJson;
  Cesium['loadText'] = Core_loadText;
  Cesium['loadWithXhr'] = Core_loadWithXhr;
  Cesium['loadXML'] = Core_loadXML;
  Cesium['pointInsideTriangle'] = Core_pointInsideTriangle;
  Cesium['requestAnimationFrame'] = Core_requestAnimationFrame;
  Cesium['throttleRequestByServer'] = Core_throttleRequestByServer;
  Cesium['wrapFunction'] = Core_wrapFunction;
  Cesium['writeTextToCanvas'] = Core_writeTextToCanvas;
  Cesium['ColorMaterialProperty'] = DynamicScene_ColorMaterialProperty;
  Cesium['CompositeDynamicObjectCollection'] = DynamicScene_CompositeDynamicObjectCollection;
  Cesium['CompositeMaterialProperty'] = DynamicScene_CompositeMaterialProperty;
  Cesium['CompositePositionProperty'] = DynamicScene_CompositePositionProperty;
  Cesium['CompositeProperty'] = DynamicScene_CompositeProperty;
  Cesium['ConstantPositionProperty'] = DynamicScene_ConstantPositionProperty;
  Cesium['ConstantProperty'] = DynamicScene_ConstantProperty;
  Cesium['CzmlDataSource'] = DynamicScene_CzmlDataSource;
  Cesium['DataSource'] = DynamicScene_DataSource;
  Cesium['DataSourceCollection'] = DynamicScene_DataSourceCollection;
  Cesium['DataSourceDisplay'] = DynamicScene_DataSourceDisplay;
  Cesium['DynamicBillboard'] = DynamicScene_DynamicBillboard;
  Cesium['DynamicBillboardVisualizer'] = DynamicScene_DynamicBillboardVisualizer;
  Cesium['DynamicClock'] = DynamicScene_DynamicClock;
  Cesium['DynamicCone'] = DynamicScene_DynamicCone;
  Cesium['DynamicConeVisualizerUsingCustomSensor'] = DynamicScene_DynamicConeVisualizerUsingCustomSensor;
  Cesium['DynamicDirectionsProperty'] = DynamicScene_DynamicDirectionsProperty;
  Cesium['DynamicEllipse'] = DynamicScene_DynamicEllipse;
  Cesium['DynamicEllipsoid'] = DynamicScene_DynamicEllipsoid;
  Cesium['DynamicEllipsoidVisualizer'] = DynamicScene_DynamicEllipsoidVisualizer;
  Cesium['DynamicLabel'] = DynamicScene_DynamicLabel;
  Cesium['DynamicLabelVisualizer'] = DynamicScene_DynamicLabelVisualizer;
  Cesium['DynamicObject'] = DynamicScene_DynamicObject;
  Cesium['DynamicObjectCollection'] = DynamicScene_DynamicObjectCollection;
  Cesium['DynamicObjectView'] = DynamicScene_DynamicObjectView;
  Cesium['DynamicPath'] = DynamicScene_DynamicPath;
  Cesium['DynamicPathVisualizer'] = DynamicScene_DynamicPathVisualizer;
  Cesium['DynamicPoint'] = DynamicScene_DynamicPoint;
  Cesium['DynamicPointVisualizer'] = DynamicScene_DynamicPointVisualizer;
  Cesium['DynamicPolygon'] = DynamicScene_DynamicPolygon;
  Cesium['DynamicPolygonVisualizer'] = DynamicScene_DynamicPolygonVisualizer;
  Cesium['DynamicPolyline'] = DynamicScene_DynamicPolyline;
  Cesium['DynamicPolylineVisualizer'] = DynamicScene_DynamicPolylineVisualizer;
  Cesium['DynamicPyramid'] = DynamicScene_DynamicPyramid;
  Cesium['DynamicPyramidVisualizer'] = DynamicScene_DynamicPyramidVisualizer;
  Cesium['DynamicVector'] = DynamicScene_DynamicVector;
  Cesium['DynamicVectorVisualizer'] = DynamicScene_DynamicVectorVisualizer;
  Cesium['DynamicVertexPositionsProperty'] = DynamicScene_DynamicVertexPositionsProperty;
  Cesium['GeoJsonDataSource'] = DynamicScene_GeoJsonDataSource;
  Cesium['GridMaterialProperty'] = DynamicScene_GridMaterialProperty;
  Cesium['ImageMaterialProperty'] = DynamicScene_ImageMaterialProperty;
  Cesium['MaterialProperty'] = DynamicScene_MaterialProperty;
  Cesium['PolylineOutlineMaterialProperty'] = DynamicScene_PolylineOutlineMaterialProperty;
  Cesium['PositionProperty'] = DynamicScene_PositionProperty;
  Cesium['Property'] = DynamicScene_Property;
  Cesium['ReferenceProperty'] = DynamicScene_ReferenceProperty;
  Cesium['SampledPositionProperty'] = DynamicScene_SampledPositionProperty;
  Cesium['SampledProperty'] = DynamicScene_SampledProperty;
  Cesium['TimeIntervalCollectionPositionProperty'] = DynamicScene_TimeIntervalCollectionPositionProperty;
  Cesium['TimeIntervalCollectionProperty'] = DynamicScene_TimeIntervalCollectionProperty;
  Cesium['VisualizerCollection'] = DynamicScene_VisualizerCollection;
  Cesium['createDynamicPropertyDescriptor'] = DynamicScene_createDynamicPropertyDescriptor;
  Cesium['AutomaticUniforms'] = Renderer_AutomaticUniforms;
  Cesium['BlendEquation'] = Renderer_BlendEquation;
  Cesium['BlendFunction'] = Renderer_BlendFunction;
  Cesium['BlendingState'] = Renderer_BlendingState;
  Cesium['Buffer'] = Renderer_Buffer;
  Cesium['BufferUsage'] = Renderer_BufferUsage;
  Cesium['ClearCommand'] = Renderer_ClearCommand;
  Cesium['Context'] = Renderer_Context;
  Cesium['CubeMap'] = Renderer_CubeMap;
  Cesium['CubeMapFace'] = Renderer_CubeMapFace;
  Cesium['CullFace'] = Renderer_CullFace;
  Cesium['DepthFunction'] = Renderer_DepthFunction;
  Cesium['DrawCommand'] = Renderer_DrawCommand;
  Cesium['Framebuffer'] = Renderer_Framebuffer;
  Cesium['MipmapHint'] = Renderer_MipmapHint;
  Cesium['Pass'] = Renderer_Pass;
  Cesium['PassState'] = Renderer_PassState;
  Cesium['PickFramebuffer'] = Renderer_PickFramebuffer;
  Cesium['PixelDatatype'] = Renderer_PixelDatatype;
  Cesium['PixelFormat'] = Renderer_PixelFormat;
  Cesium['RenderState'] = Renderer_RenderState;
  Cesium['Renderbuffer'] = Renderer_Renderbuffer;
  Cesium['RenderbufferFormat'] = Renderer_RenderbufferFormat;
  Cesium['ShaderCache'] = Renderer_ShaderCache;
  Cesium['ShaderProgram'] = Renderer_ShaderProgram;
  Cesium['StencilFunction'] = Renderer_StencilFunction;
  Cesium['StencilOperation'] = Renderer_StencilOperation;
  Cesium['Texture'] = Renderer_Texture;
  Cesium['TextureAtlas'] = Renderer_TextureAtlas;
  Cesium['TextureAtlasBuilder'] = Renderer_TextureAtlasBuilder;
  Cesium['TextureMagnificationFilter'] = Renderer_TextureMagnificationFilter;
  Cesium['TextureMinificationFilter'] = Renderer_TextureMinificationFilter;
  Cesium['TextureWrap'] = Renderer_TextureWrap;
  Cesium['UniformDatatype'] = Renderer_UniformDatatype;
  Cesium['UniformState'] = Renderer_UniformState;
  Cesium['VertexArray'] = Renderer_VertexArray;
  Cesium['VertexArrayFacade'] = Renderer_VertexArrayFacade;
  Cesium['VertexLayout'] = Renderer_VertexLayout;
  Cesium['createShaderSource'] = Renderer_createShaderSource;
  Cesium['loadCubeMap'] = Renderer_loadCubeMap;
  Cesium['AnimationCollection'] = Scene_AnimationCollection;
  Cesium['Appearance'] = Scene_Appearance;
  Cesium['ArcGisImageServerTerrainProvider'] = Scene_ArcGisImageServerTerrainProvider;
  Cesium['ArcGisMapServerImageryProvider'] = Scene_ArcGisMapServerImageryProvider;
  Cesium['Billboard'] = Scene_Billboard;
  Cesium['BillboardCollection'] = Scene_BillboardCollection;
  Cesium['BingMapsImageryProvider'] = Scene_BingMapsImageryProvider;
  Cesium['BingMapsStyle'] = Scene_BingMapsStyle;
  Cesium['Camera'] = Scene_Camera;
  Cesium['CameraColumbusViewMode'] = Scene_CameraColumbusViewMode;
  Cesium['CameraController'] = Scene_CameraController;
  Cesium['CameraEventAggregator'] = Scene_CameraEventAggregator;
  Cesium['CameraEventType'] = Scene_CameraEventType;
  Cesium['CameraFlightPath'] = Scene_CameraFlightPath;
  Cesium['CentralBody'] = Scene_CentralBody;
  Cesium['CentralBodySurface'] = Scene_CentralBodySurface;
  Cesium['CentralBodySurfaceShaderSet'] = Scene_CentralBodySurfaceShaderSet;
  Cesium['CesiumTerrainProvider'] = Scene_CesiumTerrainProvider;
  Cesium['CompositePrimitive'] = Scene_CompositePrimitive;
  Cesium['Credit'] = Scene_Credit;
  Cesium['CreditDisplay'] = Scene_CreditDisplay;
  Cesium['CullingVolume'] = Scene_CullingVolume;
  Cesium['CustomSensorVolume'] = Scene_CustomSensorVolume;
  Cesium['DebugAppearance'] = Scene_DebugAppearance;
  Cesium['DebugModelMatrixPrimitive'] = Scene_DebugModelMatrixPrimitive;
  Cesium['DiscardMissingTileImagePolicy'] = Scene_DiscardMissingTileImagePolicy;
  Cesium['EllipsoidPrimitive'] = Scene_EllipsoidPrimitive;
  Cesium['EllipsoidSurfaceAppearance'] = Scene_EllipsoidSurfaceAppearance;
  Cesium['EllipsoidTerrainProvider'] = Scene_EllipsoidTerrainProvider;
  Cesium['ExtentPrimitive'] = Scene_ExtentPrimitive;
  Cesium['FrameState'] = Scene_FrameState;
  Cesium['FrustumCommands'] = Scene_FrustumCommands;
  Cesium['GeographicTilingScheme'] = Scene_GeographicTilingScheme;
  Cesium['GoogleEarthImageryProvider'] = Scene_GoogleEarthImageryProvider;
  Cesium['GridImageryProvider'] = Scene_GridImageryProvider;
  Cesium['HeightmapTerrainData'] = Scene_HeightmapTerrainData;
  Cesium['HorizontalOrigin'] = Scene_HorizontalOrigin;
  Cesium['Imagery'] = Scene_Imagery;
  Cesium['ImageryLayer'] = Scene_ImageryLayer;
  Cesium['ImageryLayerCollection'] = Scene_ImageryLayerCollection;
  Cesium['ImageryProvider'] = Scene_ImageryProvider;
  Cesium['ImageryState'] = Scene_ImageryState;
  Cesium['Label'] = Scene_Label;
  Cesium['LabelCollection'] = Scene_LabelCollection;
  Cesium['LabelStyle'] = Scene_LabelStyle;
  Cesium['Material'] = Scene_Material;
  Cesium['MaterialAppearance'] = Scene_MaterialAppearance;
  Cesium['Moon'] = Scene_Moon;
  Cesium['NeverTileDiscardPolicy'] = Scene_NeverTileDiscardPolicy;
  Cesium['OpenStreetMapImageryProvider'] = Scene_OpenStreetMapImageryProvider;
  Cesium['OrthographicFrustum'] = Scene_OrthographicFrustum;
  Cesium['PerInstanceColorAppearance'] = Scene_PerInstanceColorAppearance;
  Cesium['PerformanceDisplay'] = Scene_PerformanceDisplay;
  Cesium['PerspectiveFrustum'] = Scene_PerspectiveFrustum;
  Cesium['PerspectiveOffCenterFrustum'] = Scene_PerspectiveOffCenterFrustum;
  Cesium['Polygon'] = Scene_Polygon;
  Cesium['Polyline'] = Scene_Polyline;
  Cesium['PolylineCollection'] = Scene_PolylineCollection;
  Cesium['PolylineColorAppearance'] = Scene_PolylineColorAppearance;
  Cesium['PolylineMaterialAppearance'] = Scene_PolylineMaterialAppearance;
  Cesium['Primitive'] = Scene_Primitive;
  Cesium['PrimitivePipeline'] = Scene_PrimitivePipeline;
  Cesium['PrimitiveState'] = Scene_PrimitiveState;
  Cesium['RectangularPyramidSensorVolume'] = Scene_RectangularPyramidSensorVolume;
  Cesium['Scene'] = Scene_Scene;
  Cesium['SceneMode'] = Scene_SceneMode;
  Cesium['SceneTransforms'] = Scene_SceneTransforms;
  Cesium['SceneTransitioner'] = Scene_SceneTransitioner;
  Cesium['ScreenSpaceCameraController'] = Scene_ScreenSpaceCameraController;
  Cesium['SensorVolumeCollection'] = Scene_SensorVolumeCollection;
  Cesium['SingleTileImageryProvider'] = Scene_SingleTileImageryProvider;
  Cesium['SkyAtmosphere'] = Scene_SkyAtmosphere;
  Cesium['SkyBox'] = Scene_SkyBox;
  Cesium['Sun'] = Scene_Sun;
  Cesium['SunPostProcess'] = Scene_SunPostProcess;
  Cesium['TerrainData'] = Scene_TerrainData;
  Cesium['TerrainMesh'] = Scene_TerrainMesh;
  Cesium['TerrainProvider'] = Scene_TerrainProvider;
  Cesium['TerrainState'] = Scene_TerrainState;
  Cesium['TexturePool'] = Scene_TexturePool;
  Cesium['Tile'] = Scene_Tile;
  Cesium['TileCoordinatesImageryProvider'] = Scene_TileCoordinatesImageryProvider;
  Cesium['TileDiscardPolicy'] = Scene_TileDiscardPolicy;
  Cesium['TileImagery'] = Scene_TileImagery;
  Cesium['TileMapServiceImageryProvider'] = Scene_TileMapServiceImageryProvider;
  Cesium['TileProviderError'] = Scene_TileProviderError;
  Cesium['TileReplacementQueue'] = Scene_TileReplacementQueue;
  Cesium['TileState'] = Scene_TileState;
  Cesium['TileTerrain'] = Scene_TileTerrain;
  Cesium['TilingScheme'] = Scene_TilingScheme;
  Cesium['VRTheWorldTerrainProvider'] = Scene_VRTheWorldTerrainProvider;
  Cesium['VerticalOrigin'] = Scene_VerticalOrigin;
  Cesium['ViewportQuad'] = Scene_ViewportQuad;
  Cesium['WebMapServiceImageryProvider'] = Scene_WebMapServiceImageryProvider;
  Cesium['WebMercatorTilingScheme'] = Scene_WebMercatorTilingScheme;
  Cesium['createTangentSpaceDebugPrimitive'] = Scene_createTangentSpaceDebugPrimitive;
  Cesium['sampleTerrain'] = Scene_sampleTerrain;
  Cesium['Tween'] = ThirdParty_Tween;
  Cesium['Uri'] = ThirdParty_Uri;
//  Cesium['knockout-3.0.0'] = ThirdParty_knockout_3_0_0;
//  Cesium['knockout-es5'] = ThirdParty_knockout_es5;
//  Cesium['knockout'] = ThirdParty_knockout;
  Cesium['measureText'] = ThirdParty_measureText;
  Cesium['mersenne-twister'] = ThirdParty_mersenne_twister;
  Cesium['sprintf'] = ThirdParty_sprintf;
  Cesium['topojson'] = ThirdParty_topojson;
  Cesium['weakmap'] = ThirdParty_weakmap;
  Cesium['when'] = ThirdParty_when;
//  Cesium['Animation'] = Widgets_Animation_Animation;
//  Cesium['AnimationViewModel'] = Widgets_Animation_AnimationViewModel;
//  Cesium['BaseLayerPicker'] = Widgets_BaseLayerPicker_BaseLayerPicker;
//  Cesium['BaseLayerPickerViewModel'] = Widgets_BaseLayerPicker_BaseLayerPickerViewModel;
//  Cesium['ImageryProviderViewModel'] = Widgets_BaseLayerPicker_ImageryProviderViewModel;
//  Cesium['createDefaultBaseLayers'] = Widgets_BaseLayerPicker_createDefaultBaseLayers;
//  Cesium['CesiumWidget'] = Widgets_CesiumWidget_CesiumWidget;
//  Cesium['ClockViewModel'] = Widgets_ClockViewModel;
//  Cesium['Command'] = Widgets_Command;
//  Cesium['FullscreenButton'] = Widgets_FullscreenButton_FullscreenButton;
//  Cesium['FullscreenButtonViewModel'] = Widgets_FullscreenButton_FullscreenButtonViewModel;
//  Cesium['Geocoder'] = Widgets_Geocoder_Geocoder;
//  Cesium['GeocoderViewModel'] = Widgets_Geocoder_GeocoderViewModel;
//  Cesium['HomeButton'] = Widgets_HomeButton_HomeButton;
//  Cesium['HomeButtonViewModel'] = Widgets_HomeButton_HomeButtonViewModel;
//  Cesium['Observable'] = Widgets_Observable;
//  Cesium['SceneModePicker'] = Widgets_SceneModePicker_SceneModePicker;
//  Cesium['SceneModePickerViewModel'] = Widgets_SceneModePicker_SceneModePickerViewModel;
//  Cesium['SvgPathBindingHandler'] = Widgets_SvgPathBindingHandler;
//  Cesium['Timeline'] = Widgets_Timeline_Timeline;
//  Cesium['TimelineHighlightRange'] = Widgets_Timeline_TimelineHighlightRange;
//  Cesium['TimelineTrack'] = Widgets_Timeline_TimelineTrack;
//  Cesium['ToggleButtonViewModel'] = Widgets_ToggleButtonViewModel;
//  Cesium['Viewer'] = Widgets_Viewer_Viewer;
//  Cesium['viewerDragDropMixin'] = Widgets_Viewer_viewerDragDropMixin;
//  Cesium['viewerDynamicObjectMixin'] = Widgets_Viewer_viewerDynamicObjectMixin;
//  Cesium['checkForChromeFrame'] = Widgets_checkForChromeFrame;
//  Cesium['createCommand'] = Widgets_createCommand;
//  Cesium['getElement'] = Widgets_getElement;
//  Cesium['subscribeAndEvaluate'] = Widgets_subscribeAndEvaluate;
  Cesium['createTaskProcessorWorker'] = Workers_createTaskProcessorWorker;
  return Cesium;
});