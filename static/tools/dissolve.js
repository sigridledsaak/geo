
function updateDissolveAttributes(layername){
    let attributeDrop = document.getElementById("dissolveAttributesDrop");
    attributeDrop.innerHTML = "";
    attributeDrop.add(createOptionFromText("Select attribute"));
    attributeDrop.add(createOptionFromText("All"));
    let attributes = getPropertyNames(layername);
    for (let a of attributes){
        attributeDrop.add(createOptionFromText(a));
    }
}

function dissolve(layername,attribute){
    var loader = document.getElementById("dissolveLoader");
    var warning = document.getElementById("dissolveWarning");
    if(layername ==="Select layer" || attribute ==="Select attribute") {
        warning.innerText = "Invalid input";
        return;
    }
    try {
        var layer = geolist[layername];
        loader.style.display = "inline";
        warning.innerText = "";
        if (window.Worker) {
            var worker = new Worker('static/workers/dissolveWorker.js');
            worker.addEventListener('message', function(e) {
                if (e.data.length != 0) {
                    let layer = e.data;
                    addNewLayerToMap("D" + layername + attribute, layer);
                } else {
                    alert("Error in dissolve");
                }
                loader.style.display = "none";
            }, false); // Add listener to listen for messages that come from the worker
            worker.postMessage({'layer' : layer, 'attribute' : attribute}); //This is how we post information to the worker
        } else {
            //This code makes the UI freeze until the layer is added to the map, only used if the browser does not support web workers.
            var layer = geolist[layername];
            var dissolved = turf.dissolve(layer,{propertyName:attribute});
            addNewLayerToMap("D"+layername+attribute,dissolved);
            loader.style.display = "none";
        }
    }catch (e){
        warning.innerText="Error, check console";
        console.log(e);
    }
}