//SKRIV OM AT DEN BRUKER BBOX OF DERMED FORENKLER CLIPPERLAYER TIL EN BOX SOM INNEHOLDER HELE LAGET.
//Gjør at cliplaget blir større enn forventet hvertfall ved bruk av et polygon som clipper.
function clip(layerName,clipperName){
    var result;
    let warning = document.getElementById("clipWarning");
    if(layerName ==="Select layer to clip"|| clipperName ==="Select layer to clip by"){
        warning.innerText = "Invalid values";
    }else {
        warning.innerText = "";
        let layer = geolist[layerName];
        let clipper = geolist[clipperName];
        var clipperBbox = turf.bbox(clipper);
        let clippedFeatures = [];
        try{
            for(let feat of layer.features){
                clippedFeatures.push(turf.bboxClip(feat,clipperBbox));
            }
            let featureCollection = {"features" : clippedFeatures,"fileName" : layerName+"_Clipped","type":"FeatureCollection"};
            result = featureCollection;
        }catch(e) {
            console.log(e);
            result = turf.bboxClip(layer,clipperBbox);
        }
        addNewLayerToMap("C"+layerName,result);
    }

}