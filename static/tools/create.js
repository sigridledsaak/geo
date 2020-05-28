function create(){
    try {
        let i = createdCounter;
    }catch {
        window.createdCounter = 0;
    }
     let drawButton = document.getElementById("drawButton");
     if (drawButton.innerText === "Enable drawing") {
         // Initialise the FeatureGroup to store editable layers
         var editableLayers = new L.FeatureGroup();
         map.addLayer(editableLayers);

         var drawOptions = {
             position: 'topright',
             draw: {
                 polygon: {
                     allowIntersection: false, // No intersection in polygons
                     drawError: {
                         color: '#bd0026', // Color the shape will turn when intersects
                         message: '<strong>Oh snap!<strong> you can\'t draw that!' // Message that will show when intersect
                     },
                 }
             }
         };
         var drawControl = new L.Control.Draw(drawOptions);
         map.addControl(drawControl);

         var editableLayers = new L.FeatureGroup();
         map.addLayer(editableLayers);

         map.on('draw:created', function (e) {
             var type = e.layerType;
             console.log(type);
             let layer = e.layer;
             let geojson = layer.toGeoJSON();

             if (type =="polygon"){
                 addNewLayerToMap("draw"+createdCounter,geojson);
                 createdCounter++;
             }
             if (type =="marker"){
                 layer.bindPopup(`<p>lat,long : ${geojson.geometry.coordinates[1]},${geojson.geometry.coordinates[0]}`);
                 layer.addTo(map);
             }


         });

     }else {
         map.removeControl(drawControl);
         drawButton.innerText = "Enable drawing";
     }


}

