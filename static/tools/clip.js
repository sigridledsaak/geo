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
            if (clippedFeatures.length ==0){
                alert("The result is empty, the layer to clip might not have any features inside the layer to clip by.");
                return;
            }else {
                let featureCollection = {"features" : clippedFeatures,"fileName" : layerName+"_Clipped","type":"FeatureCollection"};
                result = featureCollection;
            }

        }catch(e) {
            console.log(e);
            result = turf.bboxClip(layer,clipperBbox);
            if (result.geometry.coordinates.length ==0){
                alert("The result is empty, the layer to clip might not have any features inside the layer to clip by.");
                return;
            }

        }
        addNewLayerToMap("C"+layerName,result);
    }

}