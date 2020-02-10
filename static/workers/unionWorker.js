self.addEventListener('message', function(ev) {
    importScripts('https://npmcdn.com/@turf/turf/turf.min.js');
    var data = ev.data;
    var merged1 = merge(data.layer1.features);
    var merged2 = merge(data.layer2.features);
    var union = turf.union(merged1,merged2);
    self.postMessage(union) //for å sende tilbake
    }, false);

function merge(layers){
    var merged = turf.union(...layers);
    return merged
}