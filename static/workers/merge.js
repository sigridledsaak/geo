
function merge(layers){
    var merged = turf.union(...layers);
    return merged
}

function union(layername1,layername2){
    var errorMessage = document.getElementById("unionWarning");
    var loader = document.getElementById("unionLoader");
    loader.style.display = "inline";
    try {
        var union = makeUnion(layername1,layername2);
        addNewLayerToMap("union"+layername1+layername2,union);
    } catch (e) {
        console.log(e);
        errorMessage.innerText = "Error";
    }
    loader.style.display = "none";
}

function makeUnion(layername1,layername2){
    var layer1 = merge(geolist[layername1].features);
    var layer2 = merge(geolist[layername2].features);
    var union = turf.union(layer1,layer2);
    return union;

}



