import { db } from './Database.js';
import { OLMap } from "./Map.js";

const map = new OLMap("metadata", true);

db.querySQL("SELECT id FROM metadata").then((sr) => {
        map.addMarkers(sr[0]['values']);
    }
);
