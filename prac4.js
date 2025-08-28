// Define the viewer
const viewer = new Cesium.Viewer("cesiumContainer");


// Grant CesiumJS access to your ion assets
Cesium.Ion.defaultAccessToken = "mytoken123";


// Set terrain provider as Cesium World Terrain using ion asset id 1
viewer.scene.setTerrain(
   new Cesium.Terrain(
      Cesium.CesiumTerrainProvider.fromIonAssetId(1),
   ),
);
viewer.scene.globe.depthTestAgainstTerrain = true;

// Watts_River_Sub-Catchment_Boundary
try {
   const subCatchment = await Cesium.IonResource.fromAssetId(123456);
   const subCatchmentSource = await Cesium.GeoJsonDataSource.load(subCatchment, {
      clampToGround: true, // Clamp to the terrain
      stroke: Cesium.Color.ORANGE, // Style in orange colour
      strokeWidth: 2,
   });
   await viewer.dataSources.add(subCatchmentSource); // Add to the viewer
   await viewer.zoomTo(subCatchmentSource); // Zoom the viewer to the boundary
} catch (error) {
  console.log(error);
}

// Water_Body_Polygons
try {
   const waterBodies = await Cesium.IonResource.fromAssetId(123456);
   const waterBodiesSource = await Cesium.GeoJsonDataSource.load(waterBodies, {
      clampToGround: true, // Clamp to the terrain
      fill: Cesium.Color.DODGERBLUE.withAlpha(0.9), // Style in blue colour
   });
   await viewer.dataSources.add(waterBodiesSource); // Add to the viewer
   await viewer.zoomTo(waterBodiesSource); // Zoom the viewer to the boundary
} catch (error) {
  console.log(error);
}

// Flood_Water_Surface
try {
   const floodSource = await Cesium.GeoJsonDataSource.load(
      await Cesium.IonResource.fromAssetId(123456)
   );

   const floodHeight = 92; // meters above sea level
   const floodColor = Cesium.Color.BLUE.withAlpha(0.4); // Blue with transparency

   floodSource.entities.values.forEach(entity => {
      if (entity.polygon) {
         entity.polygon.extrudedHeight = floodHeight; // Set floodHeight
         entity.polygon.material = floodColor;
         entity.polygon.outline = false;
      }
   });

  await viewer.dataSources.add(floodSource); // Add to the viewer
} catch (error) {
  console.error(error);
}

// Cesium OSM Buildings
try {
   const OSMbuildings = await Cesium.Cesium3DTileset.fromIonAssetId(96188);
   viewer.scene.primitives.add(OSMbuildings, {
      clampToGround: true // Clamp to the terrain
   });

   OSMbuildings.style = new Cesium.Cesium3DTileStyle({
      color : 'color("red")', // Style in red colour
   });

} catch (error) {
  console.log(error);
}
