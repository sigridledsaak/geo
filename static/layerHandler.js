//Makes the layers list in the template and adds them to the map
function addLayersToMap(layers){
    window .layerlist = {};
    window .layerCounter =0;
    var layerListParent = document.getElementById("layerListParent");
    for(var key in layers){
        var color = Math.round(Math.random()*11);
        //Adding every layer in the layerlist in the sidebar
        var node = document.createElement("DIV");
        node.className = "collapsible_layer";
        node.id = key;
        var textnode = document.createTextNode(key);
        node.appendChild(textnode);
        var button = document.createElement("BUTTON");
        button.className = "collapse_button";
        button.id = key+"collapse_button";
        button.setAttribute("data-listener","false");
        button.style.backgroundColor = colors[color];
        button.innerHTML = "<i class=\"fas fa-edit\"></i>";

        var checkbox = makeCheckboxes(key);
        node.appendChild(checkbox);
        node.appendChild(button);
        layerListParent.appendChild(node);

        //Adding every layer in the map
        var layer = L.shapefile(layers[key]);
        for (let l in layer._layers){
            layer._layers[l].bindPopup("<p>"+JSON.stringify(layer._layers[l].feature.properties, null, 4)+"</p>");
        }
        layer.setStyle({color : colors[color]});
        layer.addTo(map);
        layerlist[key] = layer;
    }
    updateSidebarLayers();
    updateToolDropDowns();
}

function addNewLayerToMap(key,geojson){
    if (geolist[key]){
        key = key+String(layerCounter);
        layerCounter = layerCounter+1;
    }
    geolist[key]=geojson;
    var color = Math.round(Math.random()*11);
    var layerListParent = document.getElementById("layerListParent");
    //Adding layer in the layerlist in the sidebar
    var node = document.createElement("DIV");
    node.className = "collapsible_layer";
    node.id = key;

    var textnode = document.createTextNode(key);
    node.appendChild(textnode);

    var button = document.createElement("BUTTON");
    button.className = "collapse_button";
    button.id = key+"collapse_button";
    button.setAttribute("data-listener","false");
    button.style.backgroundColor = colors[color];
    button.innerHTML = "<i class=\"fas fa-edit\"></i>";

    var checkbox = makeCheckboxes(key);
    node.appendChild(checkbox);
    node.appendChild(button);
    layerListParent.appendChild(node);

    //Adding layer in the map
    try {
        var layer = L.shapefile(geojson);
    }catch (e) {
        console.log(e);
        var layer = geojson;
    }
    for (let l in layer._layers){
        layer._layers[l].bindPopup("<p>"+JSON.stringify(layer._layers[l].feature.properties, null, 4)+"</p>");
    }
    layer.setStyle({color:colors[color]});
    layer.addTo(map);
    layerlist[key] = layer;
    updateSidebarLayers();
    addSingleOptionDropDown(key);
}

function makeCheckboxes(key) {
    var checkbox = document.createElement("INPUT");
        checkbox.className = "layerCheckbox";
        checkbox.id = key + "checkbox";
        checkbox.setAttribute("type","checkbox");
        checkbox.checked = true;
        checkbox.classList.add("checked");
        checkbox.addEventListener('click', function(){
            checkboxClicked(key);
        });
    return checkbox;
}

//Handles the clicking on the checkboxes on the layers, click once it will be disabled and disapper from the map, click once more and it will come back
function checkboxClicked(layer){
    var layerElement = document.getElementById(layer+"checkbox");
    if (layerElement.classList.contains("checked")){
        map.removeLayer(layerlist[layer]);
        layerElement.classList.remove("checked");
    } else {
        map.addLayer(layerlist[layer]);
        layerElement.classList.add("checked");
    }
}

function updateToolDropDowns(){
    let toolDrops = document.getElementsByClassName("toolDrop");
    for (let layerName of Object.keys(layerlist)){
        for (let drop of toolDrops){
            let option = document.createElement("option");
            option.text = layerName;
            option.value = layerName;
            let options = Array.from(drop.options);
            if (!options.includes(option)){
                drop.options.add(option);
            }
        }
    }
}
function addSingleOptionDropDown(layerName){
    let toolDrops = document.getElementsByClassName("toolDrop");
    for (let drop of toolDrops){
        let option = document.createElement("option");
        option.text = layerName;
        option.value = layerName;
        drop.options.add(option);
    }
}
