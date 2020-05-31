self.addEventListener('message', function(ev) {
    importScripts('https://npmcdn.com/@turf/turf/turf.min.js');
    var layer = ev.data.layer;
    var attribute = ev.data.attribute;
    var featuresToMerge = {};
    let res;
    let notDissolved = true;
    //This checks if the layer has several features, if it does not the layer is already dissolved.
    // If this is the case we will just return a message about this to the user.
    try {
        let feat =turf.union(...layer.features);
    }catch {
        notDissolved = false;
    }
    if (attribute === "All"&& notDissolved){
        let feature = turf.union(...layer.features);
        feature.properties = {};
        feature.properties["Info"] = "Dissolved "+attribute;
        res = feature;
    }else if (!notDissolved){
        res ="";
    } else {
        //Creating a featurecollection where each feature is a polygon that contains the features in the layer with the same
        //value for attribute.
        //First make a dict with every possible attribute value for the given attribute as key
        // and the belonging value to each key is the features that has that value for the given attribute.
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
        //Merging all the features in the list of features for each attribute value(key) to one feature.
        let mergedFeatures = {};
        let featureList = [];
        for (let feat of Object.keys(featuresToMerge)){
            let merged = turf.union(...featuresToMerge[feat]);
            mergedFeatures[feat] = merged;
            featureList.push(merged);
        }
        //Create a feature collection of the single features for each attributevalue.
        let featureCollection = {"features" : featureList,"fileName" : "dissolved "+attribute,"type":"FeatureCollection"};
        res = featureCollection;
    }


    self.postMessage(res) //sends back to the function that uses the worker
    }, false);
