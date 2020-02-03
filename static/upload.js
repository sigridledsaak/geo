
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

//More info: https://developer.mozilla.org/en-US/docs/Web/API/FileReader
function handleZipFile(file){
	var reader = new FileReader();
    reader.onload = function(){
	    if (reader.readyState != 2 || reader.error){
		    return;
	    } else {
		    convertToLayer(reader.result);
		    console.log("Den ska vær ferdig");
  	    }
    };
    reader.readAsArrayBuffer(file);
}

function convertToLayer(buffer){
    console.log("helle");
    shp(buffer).then(function(geojson){	//More info: https://github.com/calvinmetcalf/shapefile-js
        console.log("hellooo");
        var shpfile = new L.shapefile(geojson).addTo(map);//More info: https://github.com/calvinmetcalf/leaflet.shapefile
        console.log("HEILT FERDIG");
    });
}