import { db } from './Database.js';
import { addOptions, addCheckbox } from './util.js';

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

function makeBold(input, select) {
    if (select == "") {
        return input;
    }

    console.log(select);
    console.log(new RegExp(`${select}`,'ig'));
    let temp = input.replace(new RegExp(`([a-z]*${select}[a-z]*)`,'ig'), `<b>$1</b>`);
    console.log(temp);
    return temp;
}

function translateRes(queryRes) {
    let translation = {};

    for (const qKey in queryRes) {
        let resultTrans = {}

        for (const cKey in config) {
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

function buildResultHtml(res, searchText) {
    return `
        <a class="resultName" href="details/?id=${res["id"]}">${res["file"]}</a>
        <div class="resultText">${makeBold(res["text"], searchText)}</div>
        <div class="resultAttributes">${res["producer"]} &bull; 
            ${res["area"]} &bull; ${res["type"]} &bull; ${res["usecase"]}</div>`;
}

async function displaySearchResults(res, searchText) {
    resultsContainer.innerHTML = "";

    for (const key in res) {
        const result = document.createElement("li");
        result.className = 'searchResult';
        result.id = res[key]["id"];
        result.innerHTML = buildResultHtml(res[key], searchText);
        resultsContainer.appendChild(result);
    }
}

function processFormData() {
    const form = new FormData(document.getElementById("form"));
    let jsonData = {};

    form.forEach((value, key) => {
        if (value !== "") {
            if (key in jsonData) {
                jsonData[key].push(value);
            } else {
                jsonData[key] = [value];
            }
        }
    });

    return jsonData;
}

async function search() {
    let data = processFormData();
    
}
/*
async function search() {
    let query = `SELECT ${columns} FROM metadata WHERE (file LIKE '%${input["text"].value}%'`;

    for (let i = 0; i < config["text"]["fields"].length; i++) {
        query = `${query} OR "${config["text"]["fields"][i]}" LIKE '%${input["text"].value}%'`
    }

    query = `${query}) AND `

    // Add options to query
    for (const key in config) {
        if (config[key]["type"] == "options" && input[key].value) {
            query = `${query}"${config[key]["fields"][0]}"='${input[key].value}' AND `;
        }
    }

    query = query.slice(0, -" AND ".length);

    db.querySQL(query).then(res => {
        displaySearchResults(translateRes(res), input["text"].value);
    });
}*/

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

    for (const key in config) {
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
    for (const key in config) {
        let col = config[key];

        if (col["type"] == "options") {
            for (let i = 0; i < col["fields"].length; i++) {
                addOptions(db, col["fields"][i], key, "Options");
            }
        }
    }
}).then(() => { //Add checkboxes
    for (const key in config) {
        let col = config[key];

        if (col["type"] == "options") {
            for (let i = 0; i < col["fields"].length; i++) {
                addCheckbox(db, col["fields"][i], key, "DROPDOWNID");
            }
        }
    }
});
