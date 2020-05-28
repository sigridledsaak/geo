self.addEventListener('message', function(ev) {
    importScripts('https://npmcdn.com/@turf/turf/turf.min.js');
    var layer = ev.data.layer;
    var attribute = ev.data.attribute;
    var featuresToMerge = {};
    let res;
    if (attribute === "All"){
        let feature = turf.union(...layer.features);
        feature.properties = {};
        feature.properties["Info"] = "Dissolved "+attribute;
        res = feature;
    }else {
        //Lag en featurecollection der hver feature er et polygon som inneholder de featurene i laget som har samme verdi for attribute
        for (let feat of layer.features) {
            let propertyVal = feat.properties[attribute];
            let newFeat = feat;
            newFeat.properties = {};
            newFeat.properties[attribute] = propertyVal;
            if (featuresToMerge[propertyVal]) {
                featuresToMerge[propertyVal].push(newFeat);
            } else {
                featuresToMerge[propertyVal] = [];
                featuresToMerge[propertyVal].push(newFeat);
            }
        }
        let mergedFeatures = {};
        let featureList = [];
        for (let feat of Object.keys(featuresToMerge)){
            let merged = turf.union(...featuresToMerge[feat]);
            mergedFeatures[feat] = merged;
            featureList.push(merged);
        }
        //Lag featurecollection av de mergede featurene
        let featureCollection = {"features" : featureList,"fileName" : "dissolved "+attribute,"type":"FeatureCollection"};
        res = featureCollection;
    }


    self.postMessage(res) //sends back to the function that uses the worker
    }, false);
