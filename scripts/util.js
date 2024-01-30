export function addOptions(db, column, htmlID) {
    const datalist = document.getElementById(htmlID);
    db.querySQL(`SELECT DISTINCT "${column}" FROM ${db.tableName}`).then(res => {
        for (let row in res) {
            datalist.innerHTML = datalist.innerHTML + `<option value="${res[row][column]}"></option>`
        }
    });
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