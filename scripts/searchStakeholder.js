import { db } from './Database.js';
import { coordsToAddress } from './location.js';
import { QueryConstructor } from './QueryConstructor.js';
import { OLMap } from './Map.js';

const detailsURL = window.location.origin + "/details";

const map = new OLMap(true);

const searchResultsDiv = document.getElementById('searchResults');

//Input
const searchIn = document.getElementById('searchID');
const typeIn = document.getElementById('typeID');

const searchButton = document.getElementById('searchButtonID');


async function searchDB() {

}

function showSearchResults() {
   
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
