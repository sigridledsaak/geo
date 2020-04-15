function differences(layername1,layername2){
    var errorMessage = document.getElementById("differenceWarning");
    var loader = document.getElementById("differenceLoader");
    try {
        var layer1 = turf.buffer(geolist[layername1],0.000001);
        var layer2 = turf.buffer(geolist[layername2],0.000001);
        errorMessage.innerText = "";
        loader.style.display = "inline";
    }catch {
        errorMessage.innerText = "Upload first"
    }
    if (window.Worker) {
        var worker = new Worker('static/workers/differenceWorker.js');
        worker.addEventListener('message', function(e) {
            if (e.data.length != 0) {
                let layer = merge(e.data);
                //Properties må være object!
                 layer["properties"]={Info : `Difference between ${layername1} and ${layername2}`};
                addNewLayerToMap("D" + layername1 + layername2, layer);
            } else {
                alert("The layers has no overlapping geometry or other failure, check console");
            }
            loader.style.display = "none";
        }, false); // Add listener to listen for messages that come from the worker
        worker.postMessage({'layer1' : layer1, 'layer2' : layer2}); //This is how we post information to the worker
    } else {
        //This code makes the UI freeze until the layer is added to the map, only used if the browser does not support web workers.
        var layer1 = merge(geolist[layername1].features);
        var layer2 = merge(geolist[layername2].features);
        var differenced = turf.difference(layer1,layer2);
        addNewLayerToMap("difference"+layername1+layername2,differenced);
        loader.style.display = "none";
    }
}