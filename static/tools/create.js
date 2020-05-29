function create(){
    try {
        let i = createdCounter;
    }catch {
        window.createdCounter = 0;
    }
    //EditableLayers will be the drawed elements that it should be possible to remove by clicking on the trash icon.
    var editableLayers = new L.FeatureGroup();
    var drawOptions = {
             position: 'topright',
             draw: {
                 polygon: {
                     allowIntersection: false, // No intersection in polygons
                     drawError: {
                         color: '#bd0026', // Color the shape will turn when intersects
                         message: '<strong>Error<strong> polygon can not intersect it-self!' // Message that will show when it intersects
                     }
                 },
                 circlemarker : false
             }
             ,edit : {
                 featureGroup : editableLayers,
                 edit : false
             }
         };
    var drawControl = new L.Control.Draw(drawOptions);

     let drawButton = document.getElementById("drawButton");
     if (drawButton.innerText === "Enable drawing") {
         drawButton.innerText = "Drawing enabled";
         drawButton.disabled = true;

         map.addControl(drawControl);
         map.addLayer(editableLayers);

         map.on('draw:created', function (e) {
             var type = e.layerType;
             let layer = e.layer;
             let geojson = layer.toGeoJSON();
             if (type == "polygon" || type == "rectangle") {
                 geojson.properties["info"] = "Drawed " + type;
                 addNewLayerToMap("draw" + createdCounter, geojson);
                 createdCounter++;
             }
             if (type == "circle") {
                 var radius = e.layer.getRadius();
                 let area = (Math.PI) * (radius * radius);
                 layer.bindPopup('Radius: ' + radius.toFixed(1) + 'm, Area : ' + (area / 1000000).toFixed(2) + ' km<sup>2</sup>');
                 editableLayers.addLayer(layer);
                 layer.openPopup();

             }
             if (type == "polyline") {
                 //Calculate the length of the line
                 let totalDistance = 0;
                 let prevLatLng = null;
                 for (let latlng of layer._latlngs) {
                     if (prevLatLng == null) {
                         prevLatLng = latlng;
                     } else {
                         totalDistance += prevLatLng.distanceTo(latlng);
                         prevLatLng = latlng;
                     }
                 }
                 layer.bindPopup(`<p> Polyline with length : ${totalDistance.toFixed(1)}m`);
                 editableLayers.addLayer(layer);
                 layer.openPopup();

             }
             if (type == "marker") {
                 layer.bindPopup(`<p>lat,long : ${geojson.geometry.coordinates[1]},${geojson.geometry.coordinates[0]}`);
                 editableLayers.addLayer(layer);
                 layer.openPopup();

             }
         });
     }

}

