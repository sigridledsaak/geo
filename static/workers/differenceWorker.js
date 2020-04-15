self.addEventListener('message', function(ev) {
    importScripts('https://npmcdn.com/@turf/turf/turf.min.js');
    var layer1 = ev.data.layer1;
    var layer2 = ev.data.layer2;
    var differences = [];
    if (layer1.type === "FeatureCollection"){
        var features1 = turf.union(...layer1.features);
    } else if (layer1.type === "Feature"){
        var features1 = layer1;
    }
    if (layer2.type === "FeatureCollection"){
         var features2 = turf.union(...layer2.features);
    }  else if (layer2.type === "Feature"){
        var features2 = layer2;
    }
    try {
        var difference = turf.difference(features1,features2);
        if (difference != null){
            differences.push(difference);
        }
    }catch (e) {
        console.log(e);
    }
    self.postMessage(differences) //sends back to the function that uses the worker
    }, false);
