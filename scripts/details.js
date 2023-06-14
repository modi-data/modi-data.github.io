import { db } from './Database.js'
import { coordsToAddress } from './location.js';
import { OLMap } from './Map.js';

//Get variables encoded in the url
function getURLValues() {
    var search = window.location.search.replace(/^\?/,'').replace(/\+/g,' ');
    var values = {};
  
    if (search.length) {
      var part, parts = search.split('&');
  
      for (var i=0, iLen=parts.length; i<iLen; i++ ) {
        part = parts[i].split('=');
        values[part[0]] = window.decodeURIComponent(part[1]);
      }
    }
    return values;
  }

function fillDetail(id, val) {
    const detailDiv = document.getElementById(id);
    detailDiv.innerHTML = val;
}

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
            document.getElementById('url').href = String(metadata[columnMap.get('storedat')]);
        }
    );

    const map = new OLMap(false);
    map.addMarkers([urlValues['md']]);
}

loadDetails();