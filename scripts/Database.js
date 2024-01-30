export class Database {
    db = null;
    name = "metadata";
    tableName = "metadata";

    constructor() {
        this.loadDb();
    }

    /* Load the database
    * First load the code from node modules necessary to manage the database, then load the database
    */
    async loadDb() {
        //Database
        const sqlPromise = initSqlJs({
            locateFile: file => `https://sql.js.org/dist/sql-wasm.wasm`
        });
        const dataPromise = fetch("/data/metadata.db").then(res => res.arrayBuffer());
        const [SQL, buf] = await Promise.all([sqlPromise, dataPromise])
        
        this.db = new SQL.Database(new Uint8Array(buf));
    }

    /* Query the database
    * 
    * @param sqlString, an sql query (String)
    * @return result object, contains a 'column' array and a 'values' array 
    */
    async querySQL(sqlString, json=true) {
        while(this.db == null) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        let queryRes = this.db.exec(sqlString);

        if (queryRes.length == 0) {
            return json ? {} : [];
        }
        
        queryRes = queryRes[0];

        if (json) {
            let jsonRes = {};
            let col = queryRes["columns"];
            let val = queryRes["values"];

            for (var r = 0; r < val.length; r++) {
                let jsonRow = {};
                for (var c = 0; c < col.length; c++) {
                    jsonRow[col[c]] = val[r][c];
                }
                jsonRes[r] = jsonRow;
            }

            return jsonRes;
        }

        return queryRes;
    }
}

export const db = new Database();