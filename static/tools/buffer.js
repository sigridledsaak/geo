function makeBuffer(layerName, radius){
    var layer = geolist[layerName];
    var buffer = turf.buffer(layer, radius, {units: "kilometers" });
    try {
        var merged = merge(buffer.features);
    } catch {
        var merged = buffer;
    }
    return merged;
}

function buffer(layerName,radius){
    var errorMessage = document.getElementById("bufferWarning");
    //Checks if the input radius is a number
    if(isNaN(radius)){
        errorMessage.innerText = "Radius must be a number"
    } else {
        if (layerName === "Select layer"){
            errorMessage.innerText = "Choose a layer, if none in menu upload"
        } else {
            errorMessage.innerText = "";
            try {
                var merged = makeBuffer(layerName, radius);
                merged["properties"] = {Info: `Buffer with radius: ${radius} km, around : ${layerName}`};
                //errorMessage.innerText = "";
                addNewLayerToMap("B" + radius + layerName, merged);
            } catch (e) {
                console.log(e);
            }
        }
    }
}