import { db } from './Database.js';
import { QueryConstructor } from './QueryConstructor.js';

export class FlexInput {
    id = null;
    table = null;

    constructor(table, id) {
        this.table = table;
        this.id = id;

        this.initOptions();
    }

    initOptions() {
        const datalist = document.getElementById(`${this.id}FieldOptions`);

        db.querySQL(`SELECT * FROM ${this.table} LIMIT 1`).then(
            async function(results) {
                let columnMap = db.getColumnMap(results);

                datalist.innerHTML = "";

                columnMap.forEach((value, key, map) => {
                    datalist.innerHTML = datalist.innerHTML + `<option value="${key}">`
                })
            }
        );
    }

    getQC() {
        const qc = new QueryConstructor("");

        const fieldIn = document.getElementById(`${this.id}Field`);
        const searchIn = document.getElementById(`${this.id}`);

        if (searchIn.value && fieldIn.value) {
            qc.addComponent('WHERE', `(${fieldIn.value} LIKE '%${searchIn.value}%')`);
        }

        return qc;
    }
}