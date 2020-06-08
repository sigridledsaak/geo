function differences(layername1,layername2){

    var loader = document.getElementById("differenceLoader");
    var warning = document.getElementById("differenceWarning");
    if(layername1 ==="Select 1. layer" || layername2 ==="Select 2. layer"|| layername1 ==="Select layer" || layername2 === "Select layer" ) {
        warning.innerText = "Invalid input";
        return;
    }
    try {
        warning.innerText = "";
        var layer1 = turf.buffer(geolist[layername1],0.000001);
        var layer2 = turf.buffer(geolist[layername2],0.000001);
        loader.style.display = "inline";
        var timeout = setTimeout(function(){warning.innerText = "Slow tool, be patient.."}, 5000);
        if (window.Worker) {
            var worker = new Worker('static/workers/differenceWorker.js');
            worker.addEventListener('message', function(e) {
                if (e.data.length != 0) {
                    let layer = merge(e.data);
                    //Properties må være object!
                     layer["properties"]={Info : `Difference between ${layername1} and ${layername2}`};
                     addNewLayerToMap("D" + layername1 + layername2, layer);
                     warning.innerText = "";
                } else {
                    warning.innerText = "";
                    alert("The result is empty, maybe there is no difference or other failure, check console");
                }
                loader.style.display = "none";
                warning.innerText = "";
                clearTimeout(timeout);
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
    }catch(e) {
        warning.innerText = "Error, check console";
        console.log(e);
    }

}