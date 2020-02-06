
function merge(layers){
    var merged = turf.union(...layers);
    return merged
}