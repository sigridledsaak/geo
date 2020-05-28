


function clip(clipperName,layerName){
    let layer = geolist[layerName];
    let clipper = geolist[clipperName];
    //let clipper_coords = clipper._latlngs;
    console.log(clipper);
    let clipped = turf.bboxClip(layer,clipper);
    addNewLayerToMap("C"+layerName,clipped);
}