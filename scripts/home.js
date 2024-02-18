import { OLMap } from "./Map.js";
import { db } from "./Database.js";

const map = new OLMap();

fetch('/data/config.json').then(res => {
    if (!res.ok) {
        throw new Error("HTTP error " + res.status);
    }

    return res.json();
}).then(resJson => {
    const areaCol = resJson["search"]["area"]["fields"][0];

    db.querySQL(`SELECT "${areaCol}" FROM metadata`).then(res => {
        let areaAmounts = {};

        for (const key in res) {
            const area = res[key][areaCol];

            if (area in areaAmounts) {
                areaAmounts[area] = areaAmounts[area] + 1;
            } else {
                areaAmounts[area] = 1;
            }
        }

        map.addAreas(areaAmounts);
    });
});