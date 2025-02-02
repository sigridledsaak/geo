
function merge(layers){
    var merged = turf.union(...layers);
    return merged
}

function union(layername1,layername2){
    var loader = document.getElementById("unionLoader");
    var warning = document.getElementById("unionWarning");
    if(layername1 ==="Select 1. layer" || layername2 ==="Select 2. layer"|| layername1 ==="Select layer" || layername2 === "Select layer" ) {
        warning.innerText = "Invalid input";
        return;
    }
    try {
        var layer1 = geolist[layername1];
        var layer2 = geolist[layername2];
        loader.style.display = "inline";
        warning.innerText = "";
        if (window.Worker) {
            var worker = new Worker('static/workers/unionWorker.js');
            worker.addEventListener('message', function(e) {
                var layer = e.data;
                layer["properties"]={Info : `Union between ${layername1} and ${layername2}`};
                addNewLayerToMap("U"+layername1+layername2,layer);
                loader.style.display = "none";
            }, false); // Add listener to listen for messages that come from the worker
            worker.postMessage({'layer1' : layer1, 'layer2' : layer2}); //This is how we post information to the worker
        } else {
            //This code makes the UI freeze until the layer is added to the map, only used if the browser does not support web workers.
            var layer1 = merge(geolist[layername1].features);
            var layer2 = merge(geolist[layername2].features);
            var union = turf.union(layer1,layer2);
            return union;
        }
    }catch (e) {
        console.log(e);
        warning.innerText = "Error, check console";
    }

}



