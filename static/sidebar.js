
function toggleSidebar() {
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
    content.appendChild(label);
    content.appendChild(div);
    return content;
}