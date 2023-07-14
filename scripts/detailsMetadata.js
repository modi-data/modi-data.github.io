import { db } from './Database.js';
import { coordsToAddress } from './location.js';
import { OLMap } from './Map.js';
import { getURLValues, fillDetail } from './util.js';

function loadDetails() {
    let urlValues = getURLValues();

    db.querySQL(`SELECT * FROM metadata WHERE id = ${urlValues['md']}`).then(
        async function(metadataQueryResults) {
            let metadata = metadataQueryResults[0]['values'][0];
            let columnMap = db.getColumnMap(metadataQueryResults);

            let location = [metadata[columnMap.get('longitude')], metadata[columnMap.get('latitude')]];

            //Textual content
            fillDetail("name", String(metadata[columnMap.get('name')]));
            fillDetail("stakeholder", String(metadata[columnMap.get('stakeholder')]));
            fillDetail("location", await coordsToAddress(location));
            fillDetail("date", String(metadata[columnMap.get('date')]));
            fillDetail("description", String(metadata[columnMap.get('description')]));
            document.getElementById('url-dataset').href = String(metadata[columnMap.get('url')]);
            document.getElementById('url-metadata').href = `${window.location.origin}/data/metadataFiles/${String(metadata[columnMap.get('file')])}`;
        }
    );

    const map = new OLMap("metadata", false);
    map.addMarkers([urlValues['md']]);
}

loadDetails();