import { db } from './Database.js';

//Main functionality
async function search() {
    db.querySQL("SELECT * FROM metadata").then(res => {
        console.log(res);
    });

    console.log(config);
    console.log(inputfields);
}

//Global
let inputfields = null;
let config = null;
const searchButton = document.getElementById("searchButtonID");

//Run on page load
fetch('/data/config.json').then(res => {
    if (!res.ok) {
        throw new Error("HTTP error " + res.status);
    }

    return res.json();
}).then(resJson => {
    config = resJson;
    inputfields = {};

    for (let key in config["search"]) {
        inputfields[key] = document.getElementById(`${key}ID`);
    }
}).then(() => {
    searchButton.addEventListener("click", search);
});

/*import { db } from './Database.js';
import { coordsToAddress } from './location.js';
import { QueryConstructor } from './QueryConstructor.js';
import { OLMap } from './Map.js';
import { addOptions } from './util.js';
import { FlexInput } from './FlexInput.js';

const detailsURL = window.location.origin + "/detailsmetadata";

const map = new OLMap("metadata", true);

const searchResultsDiv = document.getElementById('searchResults');

//Input
const searchIn = document.getElementById('searchID');
const stakeholderIn = document.getElementById('stakeholderID');
const locationIn = document.getElementById('locationID');
const dateIn = document.getElementById('dateID');

const searchButton = document.getElementById('searchButtonID');


async function searchDB() {
    const qc = new QueryConstructor("SELECT id, name, stakeholder, longitude, latitude, date FROM metadata ");

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

    qc.addQC(flexInput.getQC());
    console.log(qc.getComponents());
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

searchButton.addEventListener("click", showSearchResults);

addOptions(db, "stakeholders", "name", "stakeholderOptions");

const flexInput = new FlexInput('metadata', 'flex');*/
