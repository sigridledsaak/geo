var map = document.getElementById("map");
var colors = [
    '#0fe388',
    '#00b300',
    '#0E6655',
    '#3333ff',
    '#2c7fb8',
    '#253494',
    '#8E44AD',
    '#ff66b3',
    '#F1C40F',
    '#fd8d3c',
    '#D35400',
    '#C0392B',
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
            tab.children[2].style.backgroundColor = color;
        });
    swatches.appendChild(swatch);
    });
}
