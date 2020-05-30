self.addEventListener('message', function(ev) {
    importScripts('https://npmcdn.com/@turf/turf/turf.min.js');
    var data = ev.data;
    var layer = data.layer;
    var radius = data.radius;
    var buffer = turf.buffer(layer, radius, {units: "kilometers" });
    try {
        var merged = merge(buffer.features);
    } catch {
        var merged = buffer;
    }
    self.postMessage(merged) //sends back to the function that uses the worker
    }, false);

function merge(layers){
    var merged = turf.union(...layers);
    return merged
}