self.addEventListener('message', function(ev) {
    importScripts('https://npmcdn.com/@turf/turf/turf.min.js');
    var data = ev.data;
    try {
        var merged1 = merge(data.layer1.features);
    } catch {
        var merged1 = data.layer1;
    } try{
        var merged2 = merge(data.layer2.features);
    } catch {
        var merged2 = data.layer2;
    }
    console.log(merged1);
    console.log(merged2);
    var union = turf.union(merged1,merged2);
    self.postMessage(union) //sends back to the function that uses the worker
    }, false);

function merge(layers){
    var merged = turf.union(...layers);
    return merged
}