import { db } from './Database.js';
import { coordsToAddress } from './location.js';

export class OLMap {
    map = null;
    marker = null;
    overlay = null;
    addPopup = true; //if false, add popups when markers are clicked
    detailsURL = window.location.origin + "/details";
    table = "";

    //Popup elements
    container = null;
    content = null;
    closer = null;

    constructor(table, addPopup) {
        this.table = table;
        this.addPopup = addPopup;
        
        if (table == "metadata") {
            this.detailsURL = this.detailsURL + "metadata";
        } else if (table == "stakeholders") {
            this.detailsURL = this.detailsURL + "stakeholder";
        }

        this.initMap();

        if (this.addPopup) {
            this.initPopup();
        }
    }

    initMap() {
        //Init map
        this.map = new ol.Map({
            target: 'map',
            size: [100, 100],
            layers: [
                new ol.layer.Tile({
                    source: new ol.source.OSM(),
                }),
            ],
            view: new ol.View({
                center: [0, 0],
                zoom: 2,
            }),
            controls: [],
        });

        //Add markers
        this.marker = new ol.layer.Vector({
            source: new ol.source.Vector({
                features: [],
            }),
            style: new ol.style.Style({
                image: new ol.style.Icon({
                    src: 'https://docs.maptiler.com/openlayers/default-marker/marker-icon.png',
                    anchor: [0.5, 1],
                    scale: 0.85
                })
            })
        })
        
        this.map.addLayer(this.marker);
    }

    initPopup() {
        //Elements that makeup the popup
        this.container = document.getElementById('popup');
        this.content = document.getElementById('popup-content');
        this.closer = document.getElementById('popup-closer');


        //Overlay is used to add popups when markers are clicked
        this.overlay = new ol.Overlay({
            element: this.container,
            autoPan: {
                animation: {
                    duration: 250,
                },
            },
        })

        let overlays = this.map.getOverlays();
        overlays.push(this.overlay);

        /**
         * Add a click handler to hide the popup.
         * @return {boolean} Don't follow the href.
         */
        this.closer.onclick = () => {
            this.closePopup();
            return false;
        };

        this.map.on('pointerdown', this.mapClick.bind(this));
    }

    /**
     * Show the marker of each datapoint on the map
     * 
     * @param {array of strings} IDs 
     */
    addMarkers(IDs) {
        let features = this.marker.getSource().getFeatures();
        let randomLocation;

        db.querySQL(`SELECT id, longitude, latitude FROM ${this.table} WHERE id IN (${IDs.toString()})`).then(
            async function(searchResults) {
                let columnMap = db.getColumnMap(searchResults);
    
                await searchResults[0]['values'].forEach(async element => {
                    const location = [element[columnMap.get('longitude')], element[columnMap.get('latitude')]];
                    randomLocation = location;

                    features.push(
                        new ol.Feature({
                            geometry: new ol.geom.Point(
                                ol.proj.fromLonLat(location)
                            ),
                            id: element[columnMap.get('id')]
                        })
                    );
                });
            }
        ).then(_ => { 
            this.marker.getSource().addFeatures(features);

            if (features.length > 1) {
                const view = this.map.getView();
                view.fit(this.marker.getSource().getExtent());
                view.setZoom(view.getZoom() - 1);
            } else {
                this.map.getView().setCenter(ol.proj.fromLonLat(randomLocation));
                this.map.getView().setZoom(6); //Number 5 is arbitrary, but the zoom is decent
            }
        });
    }

    clearMarkers() {
        this.marker.getSource().clear();
    }

    closePopup() {
        this.content.innerHTML = "";
        this.overlay.setPosition(undefined);
        this.closer.blur();
    }

    constructPopup(feature) {
        if (this.table == 'metadata') {
            db.querySQL(`SELECT name, stakeholder, longitude, latitude, date FROM metadata WHERE id = ${feature.get('id')}`).then(
                async (searchResults) => {
                    let res = searchResults[0]['values'][0];
                    let columnMap = db.getColumnMap(searchResults);
    
                    this.content.innerHTML = `<div class="resultName">${res[columnMap.get('name')]}</div>
                    <div class="resultInfo"><b>Stakeholder:</b> ${res[columnMap.get('stakeholder')]}</div>
                    <div class="resultInfo"><b>Location:</b> ${await coordsToAddress([res[columnMap.get('longitude')], res[columnMap.get('latitude')]])}</div>
                    <div class="resultInfo"><b>Date:</b> ${res[columnMap.get('date')]}</div>
                    <div class="resultButton"><a class="button-link" href=${this.detailsURL + "?md=" + feature.get('id')}>
                        <button class="base-style white-style small-style">More info</button></a></div>`;
    
                    this.overlay.setPosition(feature.getGeometry().getCoordinates());
                }
            );
        } else if (this.table == 'stakeholders') {
            db.querySQL(`SELECT name, longitude, latitude, type FROM stakeholders WHERE id = ${feature.get('id')}`).then(
                async (searchResults) => {
                    let res = searchResults[0]['values'][0];
                    let columnMap = db.getColumnMap(searchResults);
    
                    this.content.innerHTML = `<div class="resultName">${res[columnMap.get('name')]}</div>
                    <div class="resultInfo"><b>Type:</b> ${res[columnMap.get('type')]}</div>
                    <div class="resultInfo"><b>Location:</b> ${await coordsToAddress([res[columnMap.get('longitude')], res[columnMap.get('latitude')]])}</div>
                    <div class="resultButton"><a class="button-link" href=${this.detailsURL + "?md=" + feature.get('id')}>
                        <button class="base-style white-style small-style">More info</button></a></div>`;
    
                    this.overlay.setPosition(feature.getGeometry().getCoordinates());
                }
            );
        }
    }

    mapClick(evt) {
        let mouseButton = evt.activePointers[0].button;

        if (mouseButton == 0) {
            const feature = this.map.forEachFeatureAtPixel(evt.pixel, function(feature) {
                return feature;
            });
    
            if (feature) {
                this.constructPopup(feature);
            } else {
                this.closePopup();
            }
        } else {
            let lonlat = ol.proj.toLonLat(evt.coordinate);
            let locationIn = document.getElementById("locationID");
            locationIn.value = `${lonlat[0]}, ${lonlat[1]}`;
        }
    }
}