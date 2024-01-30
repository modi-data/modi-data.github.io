import { db } from './Database.js';
import { getURLValues } from './util.js';

//----------------------------------------------------------------
// MAIN FUNCTIONALITY
//----------------------------------------------------------------

async function showData(config) {
    db.querySQL(`SELECT * FROM metadata WHERE id=${getURLValues()["id"]}`).then(res => {
        console.log(res);
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