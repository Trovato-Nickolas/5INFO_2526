import {error} from "@sveltejs/kit"
import {json} from "@svelte/kit"
import Database from "better-sqlite3"

const db = new Database("todo.db",{verbose:console.log})

export async function GET({params, request, url}) {
    console.log("Ricevuto HTTP GET con parametro:", params);

    const sql_azione2 = db.prepare("SELECT * FROM todo");
    const sql_azione3 = db.prepare("SELECT * FROM todo WHERE id = ?");
    const sql_azione4 = db.prepare("SELECT * FROM todo WHERE done = ?");
    const sql_azione5 = db.prepare("SELECT * FROM todo WHERE priority = ?");

    const exec_query = (azione, param) =>{
        const todo = param || param == 0 ? azione.all(param) : azione.all();
        console.log(todo)
        if (todo.length > 0)
            return json(todo, {status: 200});
        else
            return json({}, {status: 404});
    };

    try {
        if (params.id) {
            console.log(params.id)
            return exec_query(sql_azione3, params.id)
        }
        if (url.searchParams.has("priority")) {
            return exec_query(sql_azione4, +url.searchParams.get("done"));
        }
        if (url.searchParams.has("done")) {
            return exec_query(sql_azione4, +JSON.parse(url.searchParams.get("priority")));
        }
        console.log("helo")
        return exec_query(sql_azione2)
    } catch (e) {
        return json({}, {status: 500});
    }


  
}