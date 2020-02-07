function makeBuffer(radius, layerName){
    var layer = geolist[layerName];
    var buffer = turf.buffer(layer, radius, {units: "kilometers" });
    var merged = merge(buffer.features);
    addNewLayerToMap("buffer"+radius+layerName,merged);
}