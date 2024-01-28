import { db } from './Database.js';
import { QueryConstructor } from './QueryConstructor.js';
import { OLMap } from './Map.js';
import { addOptions } from './util.js';

const detailsURL = window.location.origin + "/detailsstakeholder";

const map = new OLMap("stakeholders", true);

const searchResultsDiv = document.getElementById('searchResults');

//Input
const searchIn = document.getElementById('searchID');
const typeIn = document.getElementById('typeID');
const locationIn = document.getElementById('locationID');

const searchButton = document.getElementById('searchButtonID');


async function searchDB() {
    const qc = new QueryConstructor("SELECT id, name, type FROM stakeholders ");

    if (searchIn.value) {
        qc.addComponent('WHERE', `(name LIKE '%${searchIn.value}%' OR description LIKE '%${searchIn.value}%')`);
    }

    if (typeIn.value) {
        qc.addComponent('WHERE', `type='${typeIn.value}'`);
    }

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
                <div class="resultInfo"><b>Type:</b> ${element[columnMap.get('type')]}</div>
                <div class="resultButton"><a class="button-link" href=${detailsURL + "?md=" + id}>
                    <button class="base-style white-style small-style">More info</button></a></div>`;

                searchResultsDiv.appendChild(newCard);
            });

            map.addMarkers(markers);
        }
    );
}

searchButton.addEventListener("click", showSearchResults);

addOptions(db, "stakeholders", "type", "typeOptions");
