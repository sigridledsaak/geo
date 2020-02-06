
function makeColorPicker(layer){
    var swatches = document.getElementById('swatches');
    var layer = document.getElementById('layer');
    var colors = [
        '#ffffcc',
        '#a1dab4',
        '#41b6c4',
        '#2c7fb8',
        '#253494',
        '#fed976',
        '#feb24c',
        '#fd8d3c',
        '#f03b20',
        '#bd0026'
    ];
    //console.log(layerlist);
    colors.forEach(function(color) {
    var swatch = document.createElement('button');
    swatch.style.backgroundColor = color;
    swatch.addEventListener('click', function() {
        map.setPaintProperty(layer.value, 'fill-color', color);
    });
    swatches.appendChild(swatch);
    });
}
