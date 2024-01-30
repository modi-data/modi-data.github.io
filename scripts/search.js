import { db } from './Database.js';
import { addOptions } from './util.js';

//----------------------------------------------------------------
// GLOBAL VARIABLES
//----------------------------------------------------------------

let input = null; //html input fields
let config = null;
let columns = null; //All the columns we want to search in
const searchButton = document.getElementById("searchButtonID");
const resultsContainer = document.getElementById("searchResultsBody");

//----------------------------------------------------------------
// MAIN FUNCTIONALITY
//----------------------------------------------------------------

function translateRes(queryRes) {
    let translation = {};

    for (let qKey in queryRes) {
        let resultTrans = {}

        for (let cKey in config) {
            let data = "";

            const f = config[cKey]["fields"];
            for (let i = 0; i < f.length; i++) {
                if (f[i] in queryRes[qKey]) {
                    data = `${data}${queryRes[qKey][f[i]]} &bull; `;
                }
            }

            data = data.slice(0, -" &bull; ".length);
            resultTrans[cKey] = data;
        }

        translation[qKey] = resultTrans;
    }

    return translation;
}

function buildResultHtml(res) {
    return `
        <a class="row resultName" href="details/?id=${res["id"]}">${res["file"]}</a>
        <div class="row resultText">${res["text"]}</div>
        <div class="row resultAttributes">${res["producer"]} &bull; 
            ${res["area"]} &bull; ${res["type"]} &bull; ${res["usecase"]}</div>`;
}

async function displaySearchResults(res) {
    resultsContainer.innerHTML = "";

    for (let key in res) {
        const result = document.createElement("li");
        result.className = 'container searchResult';
        result.id = res[key]["id"];
        result.innerHTML = buildResultHtml(res[key]);
        resultsContainer.appendChild(result);
    }
}

async function search() {
    let query = `SELECT ${columns} FROM metadata`;
    let optionsSet = false;

    // Add options to query
    for (let key in config) {
        if (config[key]["type"] == "options" && input[key].value) {
            if (!optionsSet) {
                query = `${query} WHERE `;
                optionsSet = true;
            }

            query = `${query}"${config[key]["fields"][0]}"='${input[key].value}' AND `;
        }
    }

    if (optionsSet) {
        query = query.slice(0, -" AND ".length);
    }

    db.querySQL(query).then(res => {
        console.log(res);
        displaySearchResults(translateRes(res));
    });
}

//----------------------------------------------------------------
// PAGE SETUP
//----------------------------------------------------------------

//Run on page load
fetch('/data/config.json').then(res => { //Check fetch response
    if (!res.ok) {
        throw new Error("HTTP error " + res.status);
    }

    return res.json();
}).then(resJson => { //Setup field configs and columns
    config = resJson["search"];
    input = {};
    columns = 'id, file, ';

    for (let key in config) {
        if (config[key]["type"] == "hidden") {
            continue;
        }

        input[key] = document.getElementById(`${key}ID`);

        //init columns
        for (let i = 0; i < config[key]["fields"].length; i++) {
            columns = columns + `"${config[key]["fields"][i]}", `;
        }
    }

    columns = columns.slice(0, -2);
}).then(() => { //Setup eventlistener
    searchButton.addEventListener("click", search);
}).then(() => { //Load options
    for (let key in config) {
        let col = config[key];

        if (col["type"] == "options") {
            for (let i = 0; i < col["fields"].length; i++) {
                addOptions(db, col["fields"][i], `${key}Options`);
            }
        }
    }
});
