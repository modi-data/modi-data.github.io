import { db } from "./Database.js";

export class OLMap {
    map = null;

    constructor(center) {
        //Init map
        this.map = new ol.Map({
            target: 'map',
            layers: [
                new ol.layer.Tile({
                    source: new ol.source.OSM(),
                }),
            ],
            view: new ol.View({
                center: ol.proj.fromLonLat(center),
                zoom: 4,
            }),
            controls: [],
        });

        fetch('/data/config.json').then(res => { //Check fetch response
            if (!res.ok) {
                throw new Error("HTTP error " + res.status);
            }
            
            return res.json();
        }).then(res => {
            const area = res["search"]["area"]["fields"][0];

            db.querySQL(`SELECT "${area}", COUNT("${area}") FROM metadata GROUP BY "${area}"`).then(result => {
                let amounts = {};
                let total = 0;

                for (const key in result) {
                    amounts[result[key][area]] = result[key][`COUNT("${area}")`];
                    total = total + result[key][`COUNT("${area}")`];
                }

                if (!total) {
                    total = 1;
                }

                amounts["total"] = total;

                return amounts
            }).then(amounts => {
                return new ol.layer.Vector({
                    source: new ol.source.Vector({
                        url: '/data/custom.geojson',
                        format: new ol.format.GeoJSON()
                    }),
                    style: function(feature, _) {
                        const name = feature.getProperties()["name"];
                        
                        let num = 0;
                        
                        if (name in amounts) {
                            num = amounts[name];
                        }
                        
                        const oppacity = (num / amounts["total"]) * 0.5;

                        return new ol.style.Style({
                            fill: new ol.style.Fill({
                                color: [255, 0, 0, oppacity]
                            })
                        });
                    }
                });
            }).then(vec => {
                this.map.addLayer(vec);
        })});
    }
}