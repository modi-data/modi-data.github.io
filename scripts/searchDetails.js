import { db } from './Database.js';
import { getURLValues } from './util.js';

//----------------------------------------------------------------
// MAIN FUNCTIONALITY
//----------------------------------------------------------------

function fillContainer(name, fields, data) {
    const container = document.getElementById(`${name}ID`);
    container.innerHTML = "";

    for (const key in fields) {
        const newBox = document.createElement("div");
        const newField = document.createElement("div");
        const newData = document.createElement("div");
        newBox.className = `details-${name}-box`;
        newField.className = `details-${name}-field`;
        newData.className = `details-${name}-data`;

        newField.innerHTML = `${key}: `;

        let content = data[fields[key]];
        if (content == null) {
            content = 'N/A';
        }
        newData.innerHTML = `${content}`;

        newBox.appendChild(newField);
        newBox.appendChild(newData);
        container.appendChild(newBox);
    }
}

function fillPage(config, data) {
    for (const key in config) {
        const val = config[key];
        if (typeof val === 'string') {
            document.getElementById(`${key}ID`).innerHTML = data[val];
        } else {
            fillContainer(key, val, data);
        }
    }
}

function configDonwload(config, file) {
    let a = document.getElementById("downloadLinkID");
    a.href = `${config["linkToYMLFiles"]}${file}`;
    a.download = file;
}

async function showData(config) {
    db.querySQL(`SELECT * FROM metadata WHERE id=${getURLValues()["id"]}`).then(res => {
        configDonwload(config["general"], res["0"]["file"]);
        fillPage(config["show"], res["0"]);
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
}).then(config => { 
    showData(config);
});