var map = document.getElementById("map");

function makeColorPicker(layerName){
    var swatches = document.getElementById('swatches-'+layerName);
    var colors = [
        '#ffffcc',
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
    var layer = layerlist[layerName];
    colors.forEach(function(color) {
    var swatch = document.createElement('button');
    swatch.style.height = "15px";
    swatch.style.backgroundColor = color;
    swatch.addEventListener('click', function() {
        layer.setStyle({color: color});
    });
    swatches.appendChild(swatch);
    });
}
