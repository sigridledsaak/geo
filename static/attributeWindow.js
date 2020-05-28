function showAttributeWindow(propertyAndColorMap,property){
    let n = propertyAndColorMap.size;
    let window = document.getElementById("attributeWindow");
    console.log(n);
    if (n<25){
       document.getElementById("attributeList").innerText = property;
       window.style.display = "block";
       propertyAndColorMap.forEach(addElementToWindow);
    }

}

function addElementToWindow(value,key,map){
    let attributeList = document.getElementById("attributeList");
    let div = document.createElement("DIV");
    let colorDot = document.createElement("SPAN");
    colorDot.className = "colorCircle";
    colorDot.style.backgroundColor = value;
    colorDot.style.display = "inline";
    div.innerText = key;
    div.appendChild(colorDot);
    attributeList.appendChild(div);
}

function closeAttributeWindow(){
    let window = document.getElementById("attributeWindow");
    window.style.display = "none";
    let attributeList = document.getElementById("attributeList");
    attributeList.innerHTML ="";

}