import { db } from './Database.js';
import { addOptions, addCheckbox } from './util.js';

//----------------------------------------------------------------
// GLOBAL VARIABLES
//----------------------------------------------------------------

let config = null;
let columns = null; //All the columns we want to search in
const searchButton = document.getElementById("searchButtonID");
const dropdownButton = document.getElementById("dropdownID");
const dropdownMenu = document.getElementById("dropdownMenuID");
const resultsContainer = document.getElementById("searchResultsBody");
const searchContainer = document.getElementById("searchcontainerID");

//----------------------------------------------------------------
// MAIN FUNCTIONALITY
//----------------------------------------------------------------

function makeBold(input, select) {
    if (select == "") {
        return input;
    }

    return input.replace(new RegExp(`([a-z]*${select}[a-z]*)`,'ig'), `<b>$1</b>`);
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

    if (resultsContainer.innerHTML == "") {
        resultsContainer.innerHTML = "No Results";
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

function encodeHTMLChars(str) {
    return str.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
}

function addTextToQuery(query, fields, texts) {
    query = `${query}(`;
    for (const field of fields) {
        query = `${query}(`;

        for (const text of texts) {
            query = `${query}"${field}" LIKE "%${encodeHTMLChars(text)}%" OR `;
        }
        query = query.slice(0, -" OR ".length);
        query = `${query}) OR `;
    }
    query = query.slice(0, -" OR ".length);
    query = `${query})`;

    return query;
}

function addOptionsToQuery(query, data) {
    for (const key in config) {
        if (config[key]["type"] == "options" && key in data) {
            query = `${query}(`;

            for (const val of data[key]) {
                query = `${query}"${config[key]["fields"][0]}"="${encodeHTMLChars(val)}" OR `;
            }
            query = query.slice(0, -" OR ".length);
            query = `${query}) AND `;
        }
    }

    return query;
}

async function search() {
    const data = processFormData();
    console.log(data);


    let query = `SELECT ${columns} FROM metadata`;
    
    if (Object.keys(data).length == 0) {
        db.querySQL(query).then(res => {
            displaySearchResults(translateRes(res), "");
        });
        return;
    }

    query = `${query} WHERE `;

    if ("text" in data) {
        const fields = ['file'].concat(config["text"]["fields"]);
        query = addTextToQuery(query, fields, data['text']);
        query = `${query} AND `;
    }

    query = addOptionsToQuery(query, data);

    query = query.slice(0, -" AND ".length);

    console.log(query);

    if ("text" in data) {
        db.querySQL(query).then(res => {
            displaySearchResults(translateRes(res), data["text"][0]);
        });
        return;
    }

    db.querySQL(query).then(res => {
        displaySearchResults(translateRes(res), "");
    });
}

function toggleVisibility() {
    if(dropdownMenu.style.display == 'block') {
        dropdownMenu.style.display = 'none';
        dropdownButton.getElementsByTagName('img')[0].style.transform = null;

        if (document.querySelectorAll('input:checked').length != 0) {
            searchContainer.style.boxShadow = "1px 1px 4px blue";
        }
    } else {
        dropdownMenu.style.display = 'block';
        dropdownButton.getElementsByTagName('img')[0].style.transform = 'scaleY(-1)';
        searchContainer.style.boxShadow = null;
    }
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
    columns = 'id, file, ';

    for (const key in config) {
        if (config[key]["type"] == "hidden") {
            continue;
        }

        //init columns
        for (let i = 0; i < config[key]["fields"].length; i++) {
            columns = columns + `"${config[key]["fields"][i]}", `;
        }
    }

    columns = columns.slice(0, -2);
}).then(() => { //Setup eventlistener
    searchButton.addEventListener("click", search);
    dropdownButton.addEventListener("click", toggleVisibility);
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
