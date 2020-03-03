self.addEventListener('message', function(ev) {
    importScripts('https://npmcdn.com/@turf/turf/turf.min.js');
    var data = ev.data;
    try {
        var merged1 = merge(data.layer1.features);
    } catch (e) {
        console.log(e);
        var merged1 = data.layer1;
    } try{
        var merged2 = merge(data.layer2.features);
    } catch (e) {
        console.log(e);
        var merged2 = data.layer2;
    }

    if (merged1.geometry.type==="MultiPolygon") {
        var pieces1 = merged1.geometry.coordinates.map(c => turf.polygon(c))
    } else {
        var pieces1 = [merged1];
    }

    if (merged2.geometry.type === "MultiPolygon") {
        var pieces2 = merged2.geometry.coordinates.map(c => turf.polygon(c))
    } else {
        var pieces2 = [merged2];
    }
    var intersections = [];
    for(var i = 0; i<pieces1.length; i++){
        for (var j = 0; j<pieces2.length; j++){
            var poly1 = turf.unkinkPolygon(pieces1[i]);
            var poly2 = turf.unkinkPolygon(pieces2[j]);
            try {
                var intersected = turf.intersect(merge(poly1.features),merge(poly2.features));
                if (intersected != null) {
                    intersections.push(intersected);
                }
            } catch (e) {
                console.log(e);
            }
        }
    }
    self.postMessage(intersections) //sends back to the function that uses the worker
    }, false);

//Need this to merge the layers if they are not merged.
function merge(layers){
    var merged = turf.union(...layers);
    return merged
}