function featureSelection(layerName,feature){
    var loader = document.getElementById("featureSelectorLoader");
    var layer = geolist[layerName];
    loader.style.display = "inline";
    return "";
}

function updatePropertiesDrop(){
    let propertiesDropDown = document.getElementById("propertiesDrop");
    propertiesDropDown.innerHTML = "";
    let layerName = document.getElementById('featureSelectionDrop').options[document.getElementById('featureSelectionDrop').selectedIndex].value;
    let layer = layerlist[layerName];
    let properties = "";
    for (let l in layer._layers){
        let props = layer._layers[l].feature.properties;
        properties = Object.keys(props);
        console.log(l);
        break;
    }
    console.log(properties);
    for (let prop of properties){
        let option = document.createElement("option");
        console.log(prop);
        option.value = prop;
        option.text = prop;
        propertiesDropDown.add(option);
    }
    console.log(properties);
}