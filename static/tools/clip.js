//SKRIV OM AT DEN BRUKER BBOX OF DERMED FORENKLER CLIPPERLAYER TIL EN BOX SOM INNEHOLDER HELE LAGET.
function clip(layerName,clipperName){
    let layer = geolist[layerName];
    let clipper = geolist[clipperName];
    var clipperBbox = turf.bbox(clipper);
    let clippedFeatures = [];
    for(let feat of layer.features){
        clippedFeatures.push(turf.bboxClip(feat,clipperBbox));
    }
    let featureCollection = {"features" : clippedFeatures,"fileName" : layerName+"_Clipped","type":"FeatureCollection"};
    addNewLayerToMap("C"+layerName,featureCollection);
}