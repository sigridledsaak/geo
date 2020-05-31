function showAttributeWindow(propertyAndColorMap,property){
    let n = propertyAndColorMap.size;
    let window = document.getElementById("attributeWindow");
    let sortedMap = new Map([...propertyAndColorMap].sort((a,b) => a[0] - b[0]));
    //Only show attributewindow if number of different values for attribute is less than 25. 
    if (n<25){
       document.getElementById("attributeList").innerText = property;
       window.style.display = "block";
       sortedMap.forEach(addElementToWindow);
    }
}

function addElementToWindow(value,key){
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