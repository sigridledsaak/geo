
var map = document.getElementById("map");

function submitFiles() {
	var files = document.getElementById('file').files;
	if (files.length == 0) {
	  return; //do nothing if no file given yet
    }
    var file = files[0];
    if (file.name.slice(-3) != 'zip'){ //Only allow .zip files, secure and simple.
        document.getElementById('warning').innerHTML = 'Select .zip file';
        return;
    } else {
        document.getElementById('warning').innerHTML = ''; //clear warning message.
        handleZipFile(file);
    }
}

function handleZipFile(file){
	var reader = new FileReader();
    reader.onload = function(){
	    if (reader.readyState != 2 || reader.error){
		    return;
	    } else {
		    convertToLayers(reader.result);
  	    }
    };
    var str = reader.readAsArrayBuffer(file);
}

//Makes a dictionary of all the shp files in the zip and their belonging shp
function convertToLayers(buffer){
    window .geolist = {};
    var layerList = {};
    shp(buffer).then(function(array){ //Array here is an array of the geojson from the shp files in the zipped file uploaded
        if( array.length === undefined){ //If there is only one shp file in the zip then the array will be a geojson, and the length will be undefined
            var layerName = array.fileName;
            layerList[layerName] = array;
        } else {
            for(i = 0; i<array.length; i++){
                var layerName = array[i].fileName;
                layerList[layerName]=array[i];
            }
        }
        addLayersToMap(layerList);
        //geolist is a list of all the geojsons for every layer in the map, used in the workers.
        geolist = layerList;
    });
}

//Makes the layers list in the template and adds them to the map
function addLayersToMap(layers){
    window .layerlist = {};
    var layerListParent = document.getElementById("layerListParent");
    for(var key in layers){
        //Adding every layer in the layerlist in the sidebar
        var node = document.createElement("DIV");
        node.className = "collapsible_layer";
        node.id = key;

        var textnode = document.createTextNode(key);
        node.appendChild(textnode);

        var button = document.createElement("BUTTON");
        button.className = "collapse_button";
        button.id = key+"collapse_button";
        button.innerHTML = "<i class=\"fas fa-edit\"></i>";

        var checkbox = makeCheckboxes(key);
        node.appendChild(checkbox);
        node.appendChild(button);
        layerListParent.appendChild(node);

        //Adding every layer in the map
        var layer = L.shapefile(layers[key]);
        layer.addTo(map);
        layerlist[key] = layer;
    }
    updateSidebarLayers();
}

function addNewLayerToMap(key,geojson){
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
    button.innerHTML = "<i class=\"fas fa-edit\"></i>";

    var checkbox = makeCheckboxes(key);
    node.appendChild(checkbox);
    node.appendChild(button);
    layerListParent.appendChild(node);

    //Adding layer in the map
    var layer = L.shapefile(geojson);
    layer.addTo(map);
    layerlist[key] = layer;
    updateSidebarLayers();
}

function makeCheckboxes(key) {
    var checkbox = document.createElement("INPUT");
        checkbox.className = "layerCheckbox";
        checkbox.id = key + "checkbox";
        checkbox.setAttribute("type","checkbox");
        checkbox.checked = true;
        checkbox.classList.add("checked");
        checkbox.addEventListener('click', function(){
            layerClicked(key);
        });
    return checkbox;
}

//Handles the clicking on the checkboxes on the layers, click once it will be disabled and disapper from the map, click once more and it will come back
function layerClicked(layer){
    var layerElement = document.getElementById(layer+"checkbox");
    if (layerElement.classList.contains("checked")){
        map.removeLayer(layerlist[layer]);
        layerElement.classList.remove("checked");
    } else {
        map.addLayer(layerlist[layer]);
        layerElement.classList.add("checked");
    }
}