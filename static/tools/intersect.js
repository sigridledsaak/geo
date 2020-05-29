function intersect(layername1,layername2){
    var loader = document.getElementById("intersectLoader");
    var warning = document.getElementById("intersectWarning");
    if(layername1 ==="Select 1. layer" || layername2 ==="Select 2. layer"|| layername1 ==="Select layer" || layername2 === "Select layer" ) {
        warning.innerText = "Invalid input";
        return;
    }
    try {
        var layer1 = geolist[layername1];
        var layer2 = geolist[layername2];
        //errorMessage.innerText = "";
        loader.style.display = "inline";
        warning.innerText = "";
        if (window.Worker) {
            var worker = new Worker('static/workers/intersectWorker.js');
            worker.addEventListener('message', function(e) {
                if (e.data.length != 0) {
                    let layer = merge(e.data);
                    layer["properties"]={Info : `Intersection between ${layername1} and ${layername2}`};
                    addNewLayerToMap("I" + layername1 + layername2, layer);
                } else {
                    alert("The layers has no overlapping geometry.");
                }
                loader.style.display = "none";
            }, false); // Add listener to listen for messages that come from the worker
            worker.postMessage({'layer1' : layer1, 'layer2' : layer2}); //This is how we post information to the worker
        } else {
            //This code makes the UI freeze until the layer is added to the map, only used if the browser does not support web workers.
            var layer1 = merge(geolist[layername1].features);
            var layer2 = merge(geolist[layername2].features);
            var intersected = turf.intersect(layer1,layer2);
            addNewLayerToMap("intersect"+layername1+layername2,intersected);
            loader.style.display = "none";
        }
    }catch (e){
        warning.innerText("Error, check console");
        console.log(e);
    }

}
