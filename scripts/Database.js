export class Database {
    db = null;

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
        const dataPromise = fetch("/metadata.sqlite3").then(res => res.arrayBuffer());
        const [SQL, buf] = await Promise.all([sqlPromise, dataPromise])
        
        this.db = new SQL.Database(new Uint8Array(buf));
    }

    /* Find which index in the values array corresponds to which column in the database
    *
    * @param queryResult, db.exec return object
    * @return map, Column names (String) to index (int)
    */
    getColumnMap(queryResult) {
        let columnMap = new Map();
        let columnArray = queryResult[0].columns;

        for (let i = 0; i < columnArray.length; i++) {
            columnMap.set(columnArray[i], i);
        }

        return columnMap;
    }

    /* Query the database
    * 
    * @param sqlString, an sql query (String)
    * @return result object, contains a 'column' array and a 'values' array 
    */
    async querySQL(sqlString) {
        while(this.db == null) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        return this.db.exec(sqlString);
    }
}

export const db = new Database();