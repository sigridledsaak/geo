
var map = document.getElementById("map");

function uploadFiles() {
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
            for(i = 0; i < array.length; i++){
                var layerName = array[i].fileName;
                layerList[layerName]=array[i];
            }
        }
        addLayersToMap(layerList);
        //geolist is a list of all the geojsons for every layer in the map, used in the workers.
        geolist = layerList;
    });
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


