export function addOptions(db, column, name, groupName) {
    let htmlID = `${name}${groupName}`;
    const datalist = document.getElementById(htmlID);

    db.querySQL(`SELECT DISTINCT "${column}" FROM ${db.tableName}`).then(res => {
        for (let row in res) {
            datalist.innerHTML = datalist.innerHTML + `<option value="${res[row][column]}"></option>`
        }
    });
}

export function addCheckbox(db, column, name, groupName) {
    let htmlID = `${name}${groupName}`;
    const datalist = document.getElementById(htmlID);

    db.querySQL(`SELECT DISTINCT "${column}" FROM ${db.tableName}`).then(res => {
        let i = 1;
        for (let row in res) {
            datalist.innerHTML = datalist.innerHTML + `
                <input type="checkbox" id="${name}${i}" name="${name}" value="${res[row][column]}">
                <label for="${name}${i}">${res[row][column]}</label><br>`;
            i = i + 1;
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