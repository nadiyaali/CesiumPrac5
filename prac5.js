//https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/healesville?unitGroup=metric&include=current&key=RE97NG4S5WSUWE7T8CN73RZ5D&contentType=json

// Grant CesiumJS access to your ion assets
Cesium.Ion.defaultAccessToken = "mytoken123";

// Define the viewer
const viewer = new Cesium.Viewer("cesiumContainer");

// Set terrain provider as Cesium World Terrain using ion asset id 1
viewer.scene.setTerrain(
   new Cesium.Terrain(
      Cesium.CesiumTerrainProvider.fromIonAssetId(1),
   ),
);
viewer.scene.globe.depthTestAgainstTerrain = true;


// Create a container for the weather UI
const weatherContainer = document.createElement('div');
// Define styling
weatherContainer.style.position = 'absolute';
weatherContainer.style.top = '10px';
weatherContainer.style.left = '10px';
weatherContainer.style.zIndex = '999';
weatherContainer.style.backgroundColor = 'rgba(0,0,0,0.5)';
weatherContainer.style.padding = '10px';
weatherContainer.style.borderRadius = '5px';
weatherContainer.style.color = 'white';
weatherContainer.style.fontFamily = 'Arial, sans-serif';
viewer.container.appendChild(weatherContainer);
// Add a button to fetch weather data
const weatherButton = document.createElement('button');
// Define styling
weatherButton.textContent = 'Get Current Weather';
weatherButton.style.marginBottom = '10px';
weatherButton.style.marginTop = '10px';
weatherButton.style.padding = '5px 10px';
weatherButton.style.cursor = 'pointer';
weatherContainer.appendChild(weatherButton); // Place inside weatherContainer

//Add a div to display the weather data
const weatherInfo = document.createElement('div');
weatherInfo.id = 'weatherInfo';
weatherContainer.appendChild(weatherInfo); // Place inside weatherContainer


// Function to fetch and display weather data
async function fetchWeatherData() {
try {
weatherButton.disabled = true;
weatherButton.textContent = 'Fetching weather data...';
const response = await
fetch('https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/healesville?unitGroup=metric&include=current&key=ADDAPIKEY&contentType=json');
const data = await response.json();
weatherInfo.innerHTML = `
<div><strong>Time:</strong>
${data.currentConditions.datetime}</div>
<div><strong>Conditions:</strong>
${data.currentConditions.conditions}</div>
<div><strong>Temperature:</strong>
${data.currentConditions.temp}°C</div>
<div><strong>Rainfall:</strong>
${data.currentConditions.precip}mm</div>
<div><strong>Chance of Rainfall:</strong>
${data.currentConditions.precipprob}%</div>
`;
weatherButton.textContent = 'Refresh Weather';
} catch (error) {
weatherInfo.textContent = 'Error fetching weather data';
console.error(error);
} finally {
weatherButton.disabled = false;
}
}

// Add click event to the button
weatherButton.addEventListener('click', fetchWeatherData);




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
