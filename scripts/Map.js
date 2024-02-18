export class OLMap {
    map = null;

    constructor(table, addPopup) {
        //Init map
        this.map = new ol.Map({
            target: 'map',
            layers: [
                new ol.layer.Tile({
                    source: new ol.source.OSM(),
                }),
            ],
            view: new ol.View({
                center: ol.proj.fromLonLat([14.267089, 46.956260]),
                zoom: 4,
            }),
            controls: [],
        });
    }

    displayAreas(areas) {
        const source = areaVector.getSource();
        const total = Object.values(areas).reduce((a, b) => a + b, 0);
        console.log(total);

        source.getFeatures().forEach(feat => {
            const name = feat.getProperties()["name"];

            if (name in areas) {
                feat.setStyle(
                    new ol.style.Style({
                        fill: new ol.style.Fill({
                            color: [0, 255, 0, 1]
                        })
                }));
            }
        });
    }

    addAreas(areas) {
        const source = areaVector.getSource();

        source.on("change", ev => {
            if (source.getState() === "ready" ) {
                this.displayAreas(areas);
            } else {
                throw error;
            }
        });

        this.map.addLayer(areaVector);
    }
}

const areaVector = new ol.layer.Vector({
    source: new ol.source.Vector({
        url: '/data/custom.geojson',
        format: new ol.format.GeoJSON()
    }),
    style: null,
});


/*areaVector.getSource().on("change", function(ev) {
    if( areaVector.getSource().getState() === "ready" ) {
        console.log(areaVector.getSource().getFeatures())
    }
});*/