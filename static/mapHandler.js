
var layers = {
    Custom : L.mapbox.styleLayer('mapbox://styles/sigridledsaak/ck620zhrk0n131int59scse0h'),
    Streets: L.mapbox.styleLayer('mapbox://styles/mapbox/streets-v11'),
    Light: L.mapbox.styleLayer('mapbox://styles/mapbox/light-v10'),
    Dark : L.mapbox.styleLayer('mapbox://styles/mapbox/dark-v10'),
    Satellite: L.mapbox.styleLayer('mapbox://styles/mapbox/satellite-v9'),


  };
  layers.Custom.addTo(map);
  L.control.layers(layers).addTo(map);
