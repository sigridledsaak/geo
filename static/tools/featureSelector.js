function openWindow(layerName){
    var warning = document.getElementById("featureSelectorWarning");
    if (layerName === "Select layer"){
        warning.innerText = "Select a layer";
    }else {
        var modal = document.getElementById("featureSelectionModal");
        //Show the modal
        warning.innerText = "";
        modal.style.display = "block";
        let modalTitle = document.getElementById("modalLayerName");
        modalTitle.innerText = layerName;
        initDynamicDropDowns();
        updatePropertiesDrop(layerName);
        document.getElementById("rulesDrop").options.selectedIndex = 0;
    }
    //Hide modal when closebutton is clicked
    var closeButton = document.getElementById("closeButton");
    closeButton.onclick = function() {
         modal.style.display = "none";
         clearModal();
         initDynamicDropDowns();
    };
    //Hide modal when user clicks outside the modal
    window.onclick = function(event) {
      if (event.target === modal) {
        modal.style.display = "none";
        clearModal();
        initDynamicDropDowns();
      }
    };
}

function checkRules(property,operator,value){
    if (property ==="Select attribute"){
        return false;
    }else if (operator ==="Select function"){
        return false;
    }else if (value ==="Select value"){
        return false;
    }else {
        return true;
    }

}

function getRules(){
    let constraints = document.getElementsByClassName("constraintRow");
    var ruleList= [];
    for (let con of constraints){
        var ruleobj = {};
        let property = con.children[0].options[con.children[0].selectedIndex].value;
        let operator = con.children[1].options[con.children[1].selectedIndex].value;
        let value = con.children[2].options[con.children[2].selectedIndex].value;
        if (checkRules(property,operator,value)){
            ruleobj["property"] = property;
            ruleobj["operator"] = operator;
            ruleobj["value"] = value;
            ruleList.push(ruleobj);
        }else {
            ruleList.push("EMPTYFIELD");
        }

    }
    return ruleList;
}

//checks which of the features in the layer that satisfies the first rule, then those features are put in templayers and
//used to check which satisfies also the next rule and so on.
function featureSelection(){
    var ruleList = getRules();
    let warning = document.getElementById("modalWarning");
    if (ruleList.includes("EMPTYFIELD")){
        warning.innerText = "All available dropdown-fields must have a valid value";
        warning.style = "color:red";
    }else {
        warning.innerText = "";
        let layerName = document.getElementById('featureSelectionDrop').options[document.getElementById('featureSelectionDrop').selectedIndex].value;
        let layer = layerlist[layerName];
        let numberOfRules = ruleList.length;
        let templayers = layer._layers;
        for (var i = 0; i<numberOfRules;i++){
            let featuresThatSatisfyRule = [];
            for (let layer in templayers) {
                let feat;
                if (templayers[layer].feature) {
                    feat = templayers[layer].feature;
                } else {
                    feat = templayers[layer];
                }
                if (checkRule(feat, ruleList[i])) {
                    featuresThatSatisfyRule = featuresThatSatisfyRule.concat(feat);
                }
            }
            templayers = featuresThatSatisfyRule;
        }
        if(templayers.length===0) {
            alert("There is no element in the specified layer that fulfills the constraints given in the feature selector.");
        }else if (templayers.length ===1){
            //Add the single feature to the map
            let newlayer = templayers[0];
            addNewLayerToMap("FS" + layerName, newlayer);
            document.getElementById("closeButton").click();
        }else {
            //Have to make a featureCollection of the features that satisfy the rules to be able to use the map in the other tools
            let featureCollection = {"features" : templayers,"fileName" : layerName,"type":"FeatureCollection"};
            addNewLayerToMap("FS" + layerName, featureCollection);
            document.getElementById("closeButton").click();
        }

    }

}

function checkRule(feature,rule){
    switch (rule.operator) {
        case "==":
            return feature.properties[rule.property]==rule.value;
        case ">":
            return feature.properties[rule.property]>rule.value;
        case "<":
            return feature.properties[rule.property]<rule.value;
        case ">=":
            return feature.properties[rule.property]>=rule.value;
        case "<=":
            return feature.properties[rule.property]<=rule.value;
        case "!=":
            return feature.properties[rule.property]!=rule.value;
    }
}

function updatePropertiesDrop(layerName){
    let propertiesDropDown = document.getElementById("propertiesDrop");
    let properties = getPropertyNames(layerName);
    for (let prop of properties){
        let option = document.createElement("option");
        option.value = prop;
        option.text = prop;
        propertiesDropDown.add(option);
    }
}

function updatePropertyValuesDrop(){
    let valueDrop = document.getElementById("propertyValuesDrop");
    valueDrop.innerHTML = "";
    let option = document.createElement("option");
    option.value = "Select value";
    option.text = "Select value";
    valueDrop.add(option);                                 
    let property = document.getElementById("propertiesDrop").options[document.getElementById("propertiesDrop").selectedIndex].value;
    let layerName = document.getElementById('featureSelectionDrop').options[document.getElementById('featureSelectionDrop').selectedIndex].value;
    let layer = layerlist[layerName];
    let values = [];
    for (let l in layer._layers) {
        let val = layer._layers[l].feature.properties[property];
        if (!values.includes(val)) {
            values.push(val);
        }
    }
    let sortedVals = values.sort((a, b) => a - b);
    var map = sortedVals.map(value => valueDrop.add(createOptionFromText(value)));
}

function addConstraint(){
    let numberOfContraints = document.getElementsByClassName("constraintRow").length;
    let minusButton = document.getElementById("minusButton");
    if (numberOfContraints>0){
        minusButton.style = "display : inline";
    }
    let modalContent = document.getElementsByClassName("constraintContent")[0];
    let div = document.createElement("div");
    div.className = "constraintRow";
    div.id = "constraintRow"+numberOfContraints;
    let propDrop = document.createElement("select");
    let properties = document.getElementById("propertiesDrop").options;
    propDrop.id ="propertiesDrop"+numberOfContraints;
    propDrop.class = "propertiesDrop";
    let ruleDrop = document.createElement("select");
    let rules = document.getElementById("rulesDrop").options;
    let valDrop = document.createElement("select");
    valDrop.id = "propertyValuesDrop"+numberOfContraints;
    valDrop.class = "propertiesValuesDrop";
    let option = document.createElement("option");
    option.value = "Select value";
    option.text = "Select value";
    valDrop.add(option);

    for (let rule of rules){
        let newrule = document.createElement("option");
        newrule.value = rule.value;
        newrule.text = rule.text;
        ruleDrop.add(newrule);
    }
    for (let prop of properties){
        let newprop = document.createElement("option");
        newprop.value = prop.value;
        newprop.text = prop.text;
        propDrop.add(newprop);                                    
    }
    div.appendChild(propDrop);
    div.appendChild(ruleDrop);
    div.appendChild(valDrop);
    modalContent.appendChild(div);
    //Adds listener for the onchange event to the propdrop to populate the attribute values in the attribute values dropdown.
    updateAddedPropertyValuesDrop(numberOfContraints);
}

function removeConstraint(){
    let numberOfConstraints = document.getElementsByClassName("constraintRow").length;
    let minusButton = document.getElementById("minusButton");
    //When you remove the secondlast row the button should be hidden
    if (numberOfConstraints===2){
        minusButton.style = "display : none";
    }
    let modalContent = document.getElementsByClassName("constraintContent")[0];
    let constraintToBeRemoved = document.getElementById("constraintRow"+String(numberOfConstraints-1));
    modalContent.removeChild(constraintToBeRemoved);
}


function updateAddedPropertyValuesDrop(number){
    let propDrop = document.getElementById("propertiesDrop"+number);
    propDrop.addEventListener('change', function() {
        let property = document.getElementById("propertiesDrop"+String(number)).options[document.getElementById("propertiesDrop"+String(number)).selectedIndex].value;
        let layerName = document.getElementById('featureSelectionDrop').options[document.getElementById('featureSelectionDrop').selectedIndex].value;
        let layer = layerlist[layerName];
        let valueDrop = document.getElementById("propertyValuesDrop"+String(number));
        valueDrop.innerHTML = "";
        let option = document.createElement("option");
        option.value = "Select value";
        option.text = "Select value";
        valueDrop.add(option);
        let values = [];
        for (let l in layer._layers) {
            let val = layer._layers[l].feature.properties[property];
            if (!values.includes(val)) {
                values.push(val);
            }
        }
        let sortedVals = values.sort((a, b) => a - b);
        var map = sortedVals.map(value => valueDrop.add(createOptionFromText(value)));
    });
}

function initDynamicDropDowns(){
    let propertiesDropDown = document.getElementById("propertiesDrop");
    let valueDrop = document.getElementById("propertyValuesDrop");
    if (propertiesDropDown.options.length === 0){
        let pOption = document.createElement("option");
        pOption.value = "Select attribute";
        pOption.text = "Select attribute";
        propertiesDropDown.add(pOption);
    }
    if (valueDrop.options.length === 0){
        let option = document.createElement("option");
        option.value = "Select value";
        option.text = "Select value";
        valueDrop.add(option);
    }
}

function clearModal() {
    let constraints = document.getElementsByClassName("constraintRow").length-1;
    let parent = document.getElementsByClassName("constraintContent")[0];
    //Remove all but the first constraint rows
    while (constraints !=0){
        parent.removeChild(parent.children[constraints]);
        constraints = constraints-1;
    }
    let propertiesDropDown = document.getElementById("propertiesDrop");
    propertiesDropDown.innerHTML = "";
    let valueDrop = document.getElementById("propertyValuesDrop");
    valueDrop.innerHTML = "";
    let minusButton = document.getElementById("minusButton");
    minusButton.style = "display : none";
}
