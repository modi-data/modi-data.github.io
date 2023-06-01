import { db } from './Database.js';
import { coordsToAddress } from './location.js';
import { QueryConstructor } from './QueryConstructor.js';
import { OLMap } from './Map.js';

const SEARCH_LIMIT = 5;
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
        qc.addComponent('WHERE', `stakeholder='${stakeholderIn.value}'`);
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
            let cards = new Array();

            for (let i = 0; i < res.length; i++) {
                cards.push(document.createElement("li"));
                markers.push(res[i][columnMap.get('id')]);
            }

            map.addMarkers(markers);

            res.forEach(async (element, index) => {
                const newCard = cards[index];
                newCard.className = "searchResult";
                
                newCard.innerHTML = `<div class="resultName">${element[columnMap.get('name')]}</div>
                <div class="resultInfo"><b>Stakeholder:</b> ${element[columnMap.get('stakeholder')]}</div>
                <div class="resultInfo"><b>Location:</b> ${await coordsToAddress([element[columnMap.get('longitude')], element[columnMap.get('latitude')]])}</div>
                <div class="resultInfo"><b>Date:</b> ${element[columnMap.get('date')]}</div>
                <div class="resultButton"><a class="button-link" href=${detailsURL + "?md=" + element[columnMap.get('id')]}>
                    <button class="base-style white-style small-style">More info</button></a></div>`

                cards[index] = newCard;
            });

            for (let i = 0; i < cards.length; i++) {
                searchResultsDiv.appendChild(cards[i]);
            }
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

addOptions("metadata", "stakeholder", "stakeholderOptions");
