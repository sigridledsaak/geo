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
    var layer = geolist[layerName];
    var errorMessage = document.getElementById("bufferWarning");
    var loader = document.getElementById("bufferLoader");
    //Checks if the input radius is a number
    if(isNaN(radius)){
        errorMessage.innerText = "Radius must be a number"
    } else {
        if (layerName === "Select layer"){
            errorMessage.innerText = "Choose a layer, if none in menu upload"
        } else {
            errorMessage.innerText = "";
            try {
                if (window.Worker) {
                    loader.style.display = "inline";
                    var worker = new Worker('static/workers/bufferWorker.js');
                    worker.addEventListener('message', function (e) {
                        var layer = e.data;
                        layer["properties"] = {Info: `Buffer with radius: ${radius} km, around : ${layerName}`};
                        addNewLayerToMap("B" + radius + layerName, layer);
                        loader.style.display = "none";
                    }, false); // Add listener to listen for messages that come from the worker
                    worker.postMessage({'layer': layer, 'radius': radius});

                }else {
                    var merged = makeBuffer(layerName, radius);
                    merged["properties"] = {Info: `Buffer with radius: ${radius} km, around : ${layerName}`};
                    //errorMessage.innerText = "";
                    addNewLayerToMap("B" + radius + layerName, merged);
                }
            } catch (e) {
                console.log(e);
            }
        }
    }
}