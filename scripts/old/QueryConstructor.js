export class QueryConstructor {
    baseText = "";
    components = new Map();
    componentOrder = new Map([['select', ', '], ['from', ', '], ['where', ' and '], ['group by', ' and '], ['having', ' and '], ['order by', ' + ']]);

    constructor(baseText) {
        this.baseText = baseText.toLowerCase();
    }

    addComponent(keyWord, text) {
        keyWord = keyWord.toLowerCase();

        if (!this.components.has(keyWord)) {
            this.components.set(keyWord, new Array());
        }

        this.components.get(keyWord).push(text);
    }

    buildComponent(sep, arr) {
        let comp = arr[0];

        for (let i = 1; i < arr.length; i++) {
            comp = comp + `${sep}${arr[i]}`;
        }

        return comp;
    }

    getComponents() {
        return this.components;
    }

    addQC(qc) {
        console.log(qc.getComponents())
        qc.getComponents().forEach((value, key, map) => {
            this.addComponent(key, value)
        });
    }

    getQuery() {
        let query = this.baseText;

        for (const [key, value] of this.componentOrder) {
            if (this.components.has(key)) {
                query = query + ` ${key} ${this.buildComponent(value, this.components.get(key))}`;
            }
        }

        return query;
    }
}