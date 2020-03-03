function intersect(layername1,layername2){
    var errorMessage = document.getElementById("intersectWarning");
    var loader = document.getElementById("intersectLoader");

    try {
        var layer1 = geolist[layername1];
        var layer2 = geolist[layername2];
        errorMessage.innerText = "";
        loader.style.display = "inline";
    }catch {
        errorMessage.innerText = "Upload first"
    }
    if (window.Worker) {
        var worker = new Worker('static/workers/intersectWorker.js');
        worker.addEventListener('message', function(e) {
            if (e.data.length != 0) {
                addNewLayerToMap("intersect" + layername1 + layername2, e.data);
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
}
