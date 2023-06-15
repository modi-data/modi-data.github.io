export function addOptions(db, table, column, htmlId) {
    db.querySQL(`SELECT DISTINCT ${column} FROM ${table}`).then(
        function(searchResults) {
            const datalist = document.getElementById(htmlId);
            datalist.innerHTML = "";

            searchResults[0]['values'].forEach(element => {
                datalist.innerHTML = datalist.innerHTML + `<option value="${element[0]}">`
            });
        }
    );
}

//Get variables encoded in the url
export function getURLValues() {
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

export function fillDetail(id, val) {
    const detailDiv = document.getElementById(id);
    detailDiv.innerHTML = val;
}