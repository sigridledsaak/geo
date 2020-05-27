
var map = document.getElementById("map");

function uploadFiles() {
	var files = document.getElementById('file').files;
	if (files.length == 0) {
	  return; //do nothing if no file given yet
    }
    var file = files[0];
    if (file.name.slice(-3) === 'zip') { //Only allow .zip files, secure and simple.
        document.getElementById('warning').innerHTML = ''; //clear warning message.
        handleZipFile(file);
    } else if (file.name.slice(-7) ==='geojson') {
        document.getElementById('warning').innerHTML = ''; //clear warning message.
        handleGeojson(file);
    } else {
        document.getElementById('warning').innerHTML = 'Select .zip or .geojson file';
        return;
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
    reader.readAsArrayBuffer(file);
}

function handleGeojson(file){
    var reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function(){
	    if (reader.readyState != 2 || reader.error){
		    return;
	    } else {
	        var jsonString = reader.result;
	        convertToLayer(jsonString);
  	    }
    };

}



//Makes a dictionary of all the shp files in the zip and their belonging shp
function convertToLayers(buffer){
    //geolist is a list of all the geojsons for every layer in the map, used in the workers.
    var layerList = {};
    shp(buffer).then(function(array){ //Array here is an array of the geojson from the shp files in the zipped file uploaded
        if( array.length === undefined){ //If there is only one shp file in the zip then the array will be a geojson, and the length will be undefined
            var originalName = array.fileName;
            var layerName = createLayerName(originalName);
            layerList[layerName] = array;
            geolist[layerName] = array;
        } else {
            for(let i = 0; i < array.length; i++){
                var originalName = array[i].fileName;
                var layerName = createLayerName(originalName);
                layerList[layerName]=array[i];
                geolist[layerName] = array[i];
            }
        }
        addLayersToMap(layerList);
    }).catch((error)=>console.log(error));
}

//When uploaded file is a geojson.
function convertToLayer(jsonString){
    var geojson = JSON.parse(jsonString);
    let originalname = geojson.fileName;
    let layername = createLayerName(originalname);
    let layerObject = {};
    //Add layer to map
    layerObject[layername]=geojson;
    geolist[layername] = geojson;
    addLayersToMap(layerObject);
}

function downloadLayer(event){
    let button = event.target;
    let l = button.id;
    let downloadLayerName = l.split(":")[1];
    let layer = JSON.stringify(geolist[downloadLayerName]);
    try {
        var b = new Blob([layer],{type:"text/plain;charset=utf-8"});
        saveAs(b, downloadLayerName+".geojson");
    } catch (e) {
        console.log(e);
        window.open("data:text/plain;charset=utf-8+,"+ encodeURIComponent(layer), '_blank','');
    }



}
//Makes sure there is no duplicate names for the geojsons, and handles the initialization of the geolist
function createLayerName(layername){
    try {
        let count = layerCounter;
    }catch {
        window.layerCounter = 0;
    }
    let correctName = layername;
    try{
        if (geolist[layername]){
        correctName = layername+String(layerCounter);
        layerCounter = layerCounter+1;
        }
    }catch {
        window .geolist = {};
    }
    return correctName;
}


