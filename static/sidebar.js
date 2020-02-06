
function toggleSidebar() {
    document.getElementById("sidebar").classList.toggle("active");
    updateSidebar();
}
function updateSidebar(){
    var coll = document.getElementsByClassName("collapsible");
    var i;
    for (i = 0; i < coll.length; i++) {
      coll[i].addEventListener("click", function() {
        this.classList.toggle("active");
        var content = this.nextElementSibling;
        if (content.style.maxHeight){
          content.style.maxHeight = null;
        } else {
          content.style.maxHeight = content.scrollHeight + "px";
        }
      });
    }
}

function updateSidebarLayers(){
    var coll = document.getElementsByClassName("collapse_button");
    var i;
    for (i = 0; i < coll.length; i++) {
        coll[i].addEventListener("click", function() {
            this.classList.toggle("active");
            this.parentNode.classList.toggle("active");
            if (this.parentNode.nextElementSibling.className === "collapsible_layer") {
                var content = createLayerContent();
                insertAfter(content, this.parentNode);
                if (content.style.maxHeight) {
                    content.style.maxHeight = null;
                } else {
                    content.style.maxHeight = content.scrollHeight + "px";
                }
            }
            var content = this.parentNode.nextElementSibling;
            if (this.classList.contains("active")) {
                content.style.display = "";
            } else {
                content.style.display = "none";
            }
        });
    }
}
function insertAfter(el, referenceNode) {
    referenceNode.parentNode.insertBefore(el, referenceNode.nextSibling);
}

function createLayerContent(){
    var content = document.createElement("DIV");
    content.className = "content";
    content.id = "layer-content";
    var par = document.createElement("P");
    par.innerText = "Hello";
    content.appendChild(par);
    return content;

}