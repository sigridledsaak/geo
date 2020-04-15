var map = document.getElementById("map");
var colors = [
    '#0fe388',
    '#00b300',
    '#3333ff',
    '#2c7fb8',
    '#253494',
    '#ff66b3',
    '#feb24c',
    '#fd8d3c',
    '#f03b20',
    '#bd0026',
    '#804000',
    '#404040'
];

function makeColorPicker(layerName){
    var swatches = document.getElementById('swatches-'+layerName);
    var tab = document.getElementById(layerName);
    var layer = layerlist[layerName];
    colors.forEach(function(color) {
    var swatch = document.createElement('button');
    swatch.style.height = "15px";
    swatch.style.backgroundColor = color;
    swatch.addEventListener('click', function() {
        layer.setStyle({color: color});
        //tab.style.backgroundColor = color;
        //tab.nextSibling.style.backgroundColor = color;
        tab.children[1].style.backgroundColor = color;

    });
    swatches.appendChild(swatch);
    });
}
