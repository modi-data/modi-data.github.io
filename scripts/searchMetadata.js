import { db } from './Database.js';
import { addOptions } from './util.js';

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
fetch('/data/config.json').then(res => { //Check fetch response
    if (!res.ok) {
        throw new Error("HTTP error " + res.status);
    }

    return res.json();
}).then(resJson => { //Setup field configs
    config = resJson;
    inputfields = {};

    for (let key in config["search"]) {
        inputfields[key] = document.getElementById(`${key}ID`);
    }
}).then(() => { //Setup eventlistener
    searchButton.addEventListener("click", search);
}).then(() => { //Load options
    for (let key in config["search"]) {
        let col = config["search"][key];
        if (col["type"] == "options") {
            for (let i = 0; i < col["fields"].length; i++) {
                addOptions(db, col["fields"][i], `${key}Options`);
            }
        }
    }
});
