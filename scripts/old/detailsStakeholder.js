import { db } from './Database.js';
import { coordsToAddress } from './location.js';
import { OLMap } from './Map.js';
import { getURLValues, fillDetail } from './util.js';

function loadDetails() {
    let urlValues = getURLValues();

    db.querySQL(`SELECT * FROM stakeholders WHERE id = ${urlValues['md']}`).then(
        async function(stakeholderQueryResults) {
            let stakeholder = stakeholderQueryResults[0]['values'][0];
            let columnMap = db.getColumnMap(stakeholderQueryResults);

            let location = [stakeholder[columnMap.get('longitude')], stakeholder[columnMap.get('latitude')]];

            //Textual content
            fillDetail("name", String(stakeholder[columnMap.get('name')]));
            fillDetail("type", String(stakeholder[columnMap.get('type')]));
            fillDetail("location", await coordsToAddress(location));
            fillDetail("description", String(stakeholder[columnMap.get('description')]));
            document.getElementById('url').href = String(stakeholder[columnMap.get('url')]);
        }
    );

    const map = new OLMap("stakeholders", false);
    map.addMarkers([urlValues['md']]);
}

loadDetails();