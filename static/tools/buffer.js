function makeBuffer(radius, layerName){
    var layer = geolist[layerName];
    var buffer = turf.buffer(layer, radius, {units: "kilometers" });
    try {
        var merged = merge(buffer.features);
    } catch {
        var merged = buffer;
    }
    return merged;
}

function buffer(radius, layerName){
    var errorMessage = document.getElementById("bufferWarning");
    try {
         var merged = makeBuffer(radius, layerName);
         errorMessage.innerText = "";
         addNewLayerToMap("buffer"+radius+layerName,merged);
    }catch {
        errorMessage.innerText = "No such layer";
    }
}