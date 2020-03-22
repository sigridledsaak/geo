self.addEventListener('message', function(ev) {
    importScripts('https://npmcdn.com/@turf/turf/turf.min.js');
    var layer1 = ev.data.layer1;
    var layer2 = ev.data.layer2;
    var intersections = [];
    let len1 = 0;
    let len2 = 0;
    if (layer1.type === "FeatureCollection"){
        len1 = layer1.features.length;
        var features1 = layer1.features;
    } else if (layer1.type === "Feature"){
        len1 = 1;
        var features1 = [layer1];
    }
    if (layer2.type === "FeatureCollection"){
        len2 = layer2.features.length;
         var features2 = layer2.features;
    }  else if (layer2.type === "Feature"){
        len2 = 1;
        var features2 = [layer2];
    }

    for (var i = 0; i < len1; i++) {
        for (var j = 0; j < len2; j++){
            try {
                var intersection = turf.intersect(features1[i],features2[j]);
                if (intersection != null){
                    console.log("Fucked");
                    intersections.push(intersection);
                }
            }catch (e) {
                console.log(e);
            }
        }
    }
    self.postMessage(intersections) //sends back to the function that uses the worker
    }, false);
