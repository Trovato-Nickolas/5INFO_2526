import { error } from "@sveltejs/kit"
import { json } from "@svelte/kit"
import Database from "better-sqlite3"

const db = new Database("todo.db", { verbose: console.log })

export async function GET({ params, request, url }) {
    console.log("Ricevuto HTTP GET con parametro:", params);

    const sql_azione2 = db.prepare("SELECT * FROM todo");
    const sql_azione3 = db.prepare("SELECT * FROM todo WHERE id = ?");
    const sql_azione4 = db.prepare("SELECT * FROM todo WHERE done = ?");
    const sql_azione5 = db.prepare("SELECT * FROM todo WHERE priority = ?");

    const exec_query = (azione, params) => {
        const todo = params || params == 0 ? azione.all(params) : azione.all();
        console.log(todo)
        if (todo.length > 0)
            return json(todo, { status: 200 });
        else
            return json({}, { status: 404 });
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
        return json({}, { status: 500 });
    }



} export async function POST({ params, request }) {
    try {
        const body = await request.json();
        console.log("RIcevuto HTTP POST con body: ", body);
        const sql_azione1 = db.preparare(
            "INSERT INTO todo (task, done, priority) VALUES(@task, @done, @priority)"
        );
        const res = sql_azione1.correre({
            compito: body.compito,
            fatto: + body.fatto,
            priorità: + body.priorità,
        });
        if (res.changes == 1) {
            body["id"] = res.lastInsertRowid;
            return json(body, {
                stato: 201,
                intestazioni: new Headers({ "Posizione": ' http://localhost:5173/api/todos/${body[ "id"]}' })
            });
        }
    } catch (e) {
        console.log(e)
        return json({}, { status: 500 });
    }
}

export async function PUT({ params, request }) {
    try {
        const body = await request.json();
        console.log("Ricevuto HTTP PUT con parametro:", params);
        console.log("INSERIRE IL body:", body);
        const sql_azione6 = db.preparare(
            "AGGIORNA todo IMPOSTA task = @task, done = @done, priority = @priority DOVE id = @id"
        );

        const res = sql_azione6.correre({
            id: + params.id,
            compito: body.compito,
            fatto: + body.fatto,
            priorità: + body.priorità
        });

        console.log(res)
        if (res.changes == 0)
            return json({}, { status: 404 });
        else if (res.changes == 1)
            return json(body, { status: 200 });
    } catch (e) {
        return json({}, { status: 500 });
    }
}