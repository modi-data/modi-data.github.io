import { db } from './Database.js';
import { coordsToAddress } from './location.js';
import { QueryConstructor } from './QueryConstructor.js';
import { OLMap } from './Map.js';

const detailsURL = window.location.origin + "/details";

const map = new OLMap(true);

const searchResultsDiv = document.getElementById('searchResults');

//Input
const searchIn = document.getElementById('searchID');
const stakeholderIn = document.getElementById('stakeholderID');
const locationIn = document.getElementById('locationID');
const dateIn = document.getElementById('dateID');

const searchButton = document.getElementById('searchButtonID');


async function searchDB() {
    const qc = new QueryConstructor("SELECT * FROM metadata ");

    if (searchIn.value) {
        qc.addComponent('WHERE', `(name LIKE '%${searchIn.value}%' OR description LIKE '%${searchIn.value}%')`);
    }

    if (stakeholderIn.value) {
        await db.querySQL(`SELECT id FROM stakeholders WHERE name = '${stakeholderIn.value}'`).then(
            function(res) {
                qc.addComponent('WHERE', `stakeholder=${res[0]['values'][db.getColumnMap(res).get('id')]}`)
            }
        );
    }

    if (dateIn.value) {
        qc.addComponent('ORDER BY', `ABS(JULIANDAY(date) - JULIANDAY('${dateIn.value}'))`);
    }
    //MAKE search more advanced when searching both date and location
    if (locationIn.value) {
        let lonLat = locationIn.value.split(/[ ,]+/);
        qc.addComponent('ORDER BY', `((longitude - ${lonLat[0]}) * (longitude - ${lonLat[0]}) + (latitude - ${lonLat[1]}) * (latitude - ${lonLat[1]}))`)
    }

    return db.querySQL(qc.getQuery());
}

function showSearchResults() {
    //clear the results field
    searchResultsDiv.innerHTML = "";

    searchDB().then(
        function(searchResults) {
            const res = searchResults[0]['values'];

            map.clearMarkers();
            let markers = new Array();

            let columnMap = db.getColumnMap(searchResults);

            res.forEach((element) => {
                let id = element[columnMap.get('id')];
                markers.push(id);

                const newCard = document.createElement("li");
                newCard.className = "searchResult";

                newCard.innerHTML = `<div class="resultName">${element[columnMap.get('name')]}</div>
                <div class="resultInfo" id=stakeholder-${element[columnMap.get('stakeholder')]}-${element[columnMap.get('id')]}><b>Stakeholder:</b> None</div>
                <div class="resultInfo" id=location-${id}><b>Location:</b> None</div>
                <div class="resultInfo"><b>Date:</b> ${element[columnMap.get('date')]}</div>
                <div class="resultButton"><a class="button-link" href=${detailsURL + "?md=" + id}>
                    <button class="base-style white-style small-style">More info</button></a></div>`;
                
                searchResultsDiv.appendChild(newCard);

            }); 

            map.addMarkers(markers);

            res.forEach(async (element) => {
                const field = document.getElementById(`location-${element[columnMap.get('id')]}`);
                field.innerHTML = `<b>Location:</b> ${await coordsToAddress([element[columnMap.get('longitude')], element[columnMap.get('latitude')]])}`;

                db.querySQL(`SELECT name FROM stakeholders WHERE id = ${element[columnMap.get('stakeholder')]}`).then(
                    function(shResults) {
                        let shMap = db.getColumnMap(shResults);
                        const shField = document.getElementById(`stakeholder-${element[columnMap.get('stakeholder')]}-${element[columnMap.get('id')]}`);
                        shField.innerHTML = `<b>Stakeholder:</b> ${shResults[0]['values'][shMap.get('name')]}`
                    }
                );
            });
        }
    );
}

function addOptions(table, column, htmlId) {
    db.querySQL(`SELECT DISTINCT ${column} FROM ${table}`).then(
        function(searchResults) {
            const datalist = document.getElementById(htmlId);
            datalist.innerHTML = "";

            searchResults[0]['values'].forEach(element => {
                datalist.innerHTML = datalist.innerHTML + `<option value="${element[0]}">`
            });
        }
    );
}


searchButton.addEventListener("click", showSearchResults);

addOptions("stakeholders", "name", "stakeholderOptions");
