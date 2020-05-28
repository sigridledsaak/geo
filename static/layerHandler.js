
//Makes the layers list in the template and adds them to the map
function addLayersToMap(layers) {
    try {
        layerlist.length;
    }catch {
       window.layerlist = {};
    }
    var layerListParent = document.getElementById("layerListParent");
    for (var key in layers) {

        var color = Math.round(Math.random() * 11);
        //Adding every layer in the layerlist in the sidebar
        var node = document.createElement("DIV");
        node.className = "collapsible_layer";
        node.id = key;
        //var textnode = document.createTextNode(key);
        var textnode = document.createElement("div");
        textnode.innerText = key;
        textnode.className = "collapsible_layer_text";
        node.appendChild(textnode);
        var button = document.createElement("BUTTON");
        button.className = "collapse_button";
        button.id = key + "collapse_button";
        button.setAttribute("data-listener", "false");
        button.style.backgroundColor = colors[color];
        button.innerHTML = "<i class=\"fas fa-edit\"></i>";

        var checkbox = makeCheckboxes(key);
        node.appendChild(checkbox);
        node.appendChild(button);

        var downloadbutton = document.createElement("ICON");

        downloadbutton.className = "fas fa-download downloadButton";
        downloadbutton.id = "download:" +key;
        downloadbutton.addEventListener("click", function (event) {
            downloadLayer(event);
        });
        node.appendChild(downloadbutton);

        var deletebutton = document.createElement("ICON");

        deletebutton.className = "fas fa-trash-alt deleteButton";
        deletebutton.id = "delete:" + key;
        deletebutton.addEventListener("click", function (event) {
            deleteLayer(event);
        });
        node.appendChild(deletebutton);

        layerListParent.appendChild(node);

        //Adding every layer in the map
        try {
            var layer = L.shapefile(layers[key]);
        }catch (e) {
            console.log(e);
            var layer = layers[key];

        }
        for (let l in layer._layers) {
            layer._layers[l].bindPopup("<p>" + JSON.stringify(layer._layers[l].feature.properties, null, 4) + "</p>");
        }
        layer.setStyle({color: colors[color]});
        layer.addTo(map);
        layerlist[key] = layer;
    }
    updateSidebarLayers();
    updateToolDropDowns();
}



function addNewLayerToMap(key,geojson){
    try {
        layerlist.length;
    }catch {
       window.layerlist = {};
    }
    let modifiedKey = createLayerName(key);
    geolist[modifiedKey]=geojson;
    var color = Math.round(Math.random()*11);
    var layerListParent = document.getElementById("layerListParent");
    //Adding layer in the layerlist in the sidebar
    var node = document.createElement("DIV");
    node.className = "collapsible_layer";
    node.id = modifiedKey;

    var textnode = document.createElement("div");
    textnode.innerText = modifiedKey;
    textnode.className = "collapsible_layer_text";
    node.appendChild(textnode);

    var button = document.createElement("BUTTON");
    button.className = "collapse_button";
    button.id = modifiedKey+"collapse_button";
    button.setAttribute("data-listener","false");
    button.style.backgroundColor = colors[color];
    button.innerHTML = "<i class=\"fas fa-edit\"></i>";

    var checkbox = makeCheckboxes(modifiedKey);
    node.appendChild(checkbox);
    node.appendChild(button);

    var downloadbutton = document.createElement("ICON");
    downloadbutton.className = "fas fa-download downloadButton";
    downloadbutton.id = "download:" + modifiedKey;
    downloadbutton.addEventListener("click", function (event) {
        downloadLayer(event);
    });
    node.appendChild(downloadbutton);


    var deletebutton = document.createElement("ICON");
    deletebutton.className = "fas fa-trash-alt deleteButton";
    deletebutton.id = "delete:" + modifiedKey;
    deletebutton.addEventListener("click", function (event) {
        deleteLayer(event);
    });
    node.appendChild(deletebutton);

    layerListParent.appendChild(node);
    //Adding layer in the map
    try {
        var layer = L.shapefile(geojson);
    }catch (e) {
        var layer = geojson;
    }
    for (let l in layer._layers){
        layer._layers[l].bindPopup("<p>"+JSON.stringify(layer._layers[l].feature.properties, null, 4)+"</p>");
    }
    layer.setStyle({color:colors[color]});
    layer.addTo(map);
    layerlist[modifiedKey] = layer;
    updateSidebarLayers();
    addSingleOptionDropDown(modifiedKey);
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
    for (let drop of toolDrops){
        drop.innerHTML = "";
        let defaultoption = document.createElement("option");
        defaultoption.value = "Select layer";
        defaultoption.text = "Select layer";
        drop.options.add(defaultoption);

        for (let layerName of Object.keys(layerlist)){
            let option = document.createElement("option");
            option.text = layerName;
            option.value = layerName;
            let options = Array.from(drop.options);
            if (!options.includes(option)) {
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

function deleteLayer(event){
    let button = event.target;
    let l = button.id;
    let layername = l.split(":")[1];
    let layer = layerlist[layername];
    map.removeLayer(layer);
    let layerButton = document.getElementById(layername);
    let parent = layerButton.parentElement;
    parent.removeChild(layerButton);

    delete layerlist[layername];
    delete geolist[layername];

    //Må oppdatere dropdown for alle toolene, med denne blir de kun lagt til i listen selvom de finnes der allerede
    updateToolDropDowns();


}
