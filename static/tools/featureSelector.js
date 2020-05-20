function openWindow(layerName){
    var warning = document.getElementById("featureSelectorWarning");
    if (layerName == "Select layer"){
        warning.innerText = "Select a layer";
    }else {
        var modal = document.getElementById("featureSelectionModal");
        //Show the modal
        warning.innerText = "";
        modal.style.display = "block";
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
      if (event.target == modal) {
        modal.style.display = "none";
        clearModal();
        initDynamicDropDowns();
      }
    };
}

function getRules(){
    let constraints = document.getElementsByClassName("constraintRow");
    var ruleList= [];
    for (let con of constraints){
        var ruleobj = {};
        let property = con.children[0].options[con.children[0].selectedIndex].value;
        let operator = con.children[1].options[con.children[1].selectedIndex].value;
        let value = con.children[2].options[con.children[2].selectedIndex].value;
        ruleobj["property"] = property;
        ruleobj["operator"] = operator;
        ruleobj["value"] = value;
        ruleList.push(ruleobj);
    }
    return ruleList;
}

//TODO fix : valuesDrop that just adds options when you chose different props
//TODO fix : several rules does not work!
//TODO fix : reset modal when close X
//TODO fix : when you chose a layer and change before open the modal , the propdrop is fucked. X
//TODO : NÅR open tool blir kalt kan vi vell hente props, trenger ikke ha onchange på hvilket lag! X

//checks which of the features in the layer that satisfies the first rule, then those features are put in templayers and
//used to check which satisfies also the next rule and so on.
function featureSelection(){
    var ruleList = getRules();
    let layerName = document.getElementById('featureSelectionDrop').options[document.getElementById('featureSelectionDrop').selectedIndex].value;
    let layer = layerlist[layerName];
    let numberOfRules = ruleList.length;
    let templayers = layer._layers;
    for (var i = 0; i<numberOfRules;i++){
        let featuresThatSatisfyRule = [];
        for (let layer in templayers){
            console.log(templayers[layer].feature);
            if (templayers[layer].feature){
                if (checkRule(templayers[layer].feature,ruleList[i])){
                    featuresThatSatisfyRule.push(templayers[layer].feature);
                }
            }
        }
        templayers = featuresThatSatisfyRule;
    }
    if(templayers.length==0) {
        alert("There is no element in the specified layer that fulfills the constraints given in the feature selector.");
    }else if (templayers.length ==1){
        let newlayer = templayers[0];
        newlayer["properties"]=`FeatureSelected with rules ${JSON.stringify(ruleList,null,2)}`;
        addNewLayerToMap("FS" + layerName, newlayer);
    }else {

        let featureSelected = merge(templayers);
        featureSelected["properties"]=`FeatureSelected with rules ${JSON.stringify(ruleList,null,2)}`;
        addNewLayerToMap("FS" + layerName, featureSelected);
    }
    document.getElementById("closeButton").click();
}

function checkRule(feature,rule){
    console.log(feature);
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
    //let layerName = document.getElementById('featureSelectionDrop').options[document.getElementById('featureSelectionDrop').selectedIndex].value;
    let layer = layerlist[layerName];
    let properties = "";
    //Just need to access one feature to get the property names.
    for (let l in layer._layers){
        let props = layer._layers[l].feature.properties;
        properties = Object.keys(props);
        break;
    }
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
    for (let l in layer._layers){
        let val = layer._layers[l].feature.properties[property];
        if (!values.includes(val)){
            let option = document.createElement("option");
            option.value = val;
            option.text = val;
            valueDrop.add(option);
            values.push(val);
        }
    }
}

function addConstraint(){
    let numberOfContraints = document.getElementsByClassName("constraintRow").length;
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
                let option = document.createElement("option");
                option.value = val;
                option.text = val;
                valueDrop.add(option);
                values.push(val);
            }
        }
    });
}

function initDynamicDropDowns(){
    let propertiesDropDown = document.getElementById("propertiesDrop");
    let valueDrop = document.getElementById("propertyValuesDrop");
    if (propertiesDropDown.options.length === 0){
        let pOption = document.createElement("option");
        pOption.value = "Select feature";
        pOption.text = "Select feature";
        propertiesDropDown.add(pOption);
    }
    if (valueDrop.options.length === 0){
        let option = document.createElement("option");
        option.value = "Select value";
        option.text = "Select value";
        valueDrop.add(option);
    }
}

//TODO : klarer ikke fjerne alle constraintradene!! må fikse det

function clearModal() {
    let constraints = document.getElementsByClassName("constraintRow");
    let parent = document.getElementsByClassName("constraintContent")[0];
    let count = 0;
    // for (let i = 1; i<constraints.length; i++) {
    //     //     console.log("removed");
    //     //     console.log(parent.children);
    //     //     parent.removeChild(constraints[i]);
    //     // }
    console.log(constraints.length);
    while (parent.lastChild && count < constraints.length) {
        parent.removeChild(parent.lastChild);
        count=count+1;
        console.log(count);
    }
    let propertiesDropDown = document.getElementById("propertiesDrop");
    propertiesDropDown.innerHTML = "";
    let valueDrop = document.getElementById("propertyValuesDrop");
    valueDrop.innerHTML = "";
}
