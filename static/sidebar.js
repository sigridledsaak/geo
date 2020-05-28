
function toggleSidebar() {
    document.getElementById("burgerButton").classList.toggle("active");
    document.getElementById("sidebar").classList.toggle("active");
    updateSidebar();
}

function updateSidebar(){
    var coll = document.getElementsByClassName("collapsible");
    var i;
    for (i = 0; i < coll.length; i++) {
        if (coll[i].getAttribute("data-listener")==="false"){
            coll[i].addEventListener("click", function() {
                this.classList.toggle("active");
                var content = this.nextElementSibling;
                content.classList.toggle("active");
                if (content.style.maxHeight) {
                    content.style.maxHeight = null;
                } else {
                    content.style.maxHeight = content.scrollHeight + "px";
                }
            });
            coll[i].setAttribute("data-listener","true");
        }
    }
}

function updateSidebarLayers(){
    var coll = document.getElementsByClassName("collapse_button");
    var i;
    for (i = 0; i < coll.length; i++) {
        if (coll[i].getAttribute("data-listener")==="false") {
            coll[i].addEventListener("click", function () {
                this.classList.toggle("active");
                this.parentNode.classList.toggle("active");
                var layerName = this.parentNode.id;
                try {
                    var nextLayer = this.parentNode.nextElementSibling.className;
                } catch {
                    var nextLayer = "";
                }
                if (nextLayer === "collapsible_layer" || nextLayer === "") {
                    var content = createLayerContent(layerName);
                    insertAfter(content, this.parentNode);
                    makeColorPicker(layerName);
                    if (content.style.maxHeight) {
                        content.style.maxHeight = null;
                    } else {
                        content.style.maxHeight = content.scrollHeight + "px";
                    }
                }
                var content = this.parentNode.nextElementSibling;
                content.classList.toggle("active");
                if (this.classList.contains("active")) {
                    content.style.display = "";
                } else {
                    content.style.display = "none";
                }
            });
            coll[i].setAttribute("data-listener","true");
        }
    }
}

function insertAfter(el, referenceNode) {
    referenceNode.parentNode.insertBefore(el, referenceNode.nextSibling);
}

function createLayerContent(layerName){
    var content = document.createElement("DIV");
    content.className = "content";
    content.id = "layer-content";
    var label = document.createElement("LABEL");
    label.innerText = "Choose a color";
    var div = document.createElement("DIV");
    div.id = "swatches-"+layerName;
    div.className = "swatches";
    var featureColorCheck = document.createElement("INPUT");
    featureColorCheck.className = "featureCheckbox";
    featureColorCheck.id = layerName + "featureCheckbox";
    featureColorCheck.setAttribute("type","checkbox");
    featureColorCheck.checked = false;
    featureColorCheck.addEventListener('click', function() { showFeaturesByColor(layerName)});
    var featureLabel = document.createElement("LABEL");
    featureLabel.innerText="Show features by color";

    let attributes = getPropertyNames(layerName);
    var attributeDrop = document.createElement("SELECT");
    attributeDrop.id = layerName+"attributeDrop";
    let defaultOption = document.createElement("OPTION");
    defaultOption.value = "Select property to show by";
    defaultOption.text = "Select property to show by";
    attributeDrop.add(defaultOption);
    for (let a of attributes){
        attributeDrop.add(createOptionFromText(a));
    }

    let linebreak = document.createElement("br");
    content.appendChild(label);
    content.appendChild(div);
    content.appendChild(attributeDrop);
    content.appendChild(linebreak);
    content.appendChild(featureLabel);
    content.appendChild(featureColorCheck);

    return content;
}

function showFeaturesByColor(layerName){
    var layerElement = document.getElementById(layerName + "featureCheckbox");
    if (layerElement.classList.contains("checked")){
        //Setting the color of the layer back to the color it was last.
        const color = document.getElementById(layerName+"collapse_button").style.backgroundColor;
        const layer = layerlist[layerName];
        layer.setStyle({color:color});
        layerElement.classList.remove("checked");
        document.getElementById("closeButtonAttribute").click();
    } else {
        //Setting different colors for the different features.
        setColorsForFeatures(layerName);
        layerElement.classList.add("checked");
    }
}

function setColorsForFeatures(layerName){
    let property = document.getElementById(layerName+"attributeDrop").options[document.getElementById(layerName+'attributeDrop').selectedIndex].value;
    let layer = layerlist[layerName];
    let maxval = colors.length;
    let count = 0;
    // Using a map instead of object because maps can have any key type, dict only strings. Here my key will be an object
    let featuresAndColor = new Map();
    if(Object.keys(layer._layers).length == 1) {
        alert("There is only one feature in this layer");
    }else if (property != "Select property to show by"){
        layer.eachLayer(function (layer) {
            let feat = layer.feature;
            let color = "";
            let propertyValue = feat.properties[property];
            if (featuresAndColor.has(propertyValue)){
                color = featuresAndColor.get(propertyValue);
            }else {
                color = colors[count];
                count ++;
                if(count>=maxval-1){
                    count = 0;
                }
            }
        featuresAndColor.set(propertyValue,color);
        layer.setStyle({color:color});
        });
        showAttributeWindow(featuresAndColor,property);
    }else {
        layer.eachLayer(function (layer) {
            let feat = layer.feature;
            let color = "";
            //Making a string containing the object, to be able to compare them.
            let obj = JSON.stringify(feat.properties);
            if (featuresAndColor.has(obj)){
                color = featuresAndColor.get(obj);
            }else {
                color = colors[count];
                count ++;
                if(count>=maxval-1){
                    count = 0;
                }
            }
        featuresAndColor.set(obj,color);
        layer.setStyle({color:color});
        });
    }
}


function getPropertyNames(layerName){
    let propertyNames;
    try {
        propertyNames = Object.keys(geolist[layerName].features[0].properties);
    }catch (e){
        propertyNames = Object.keys(geolist[layerName].properties);
    }
    return propertyNames
}

function createOptionFromText(text){
    let option = document.createElement("option");
    option.value = text;
    option.text = text;
    return option;
}
