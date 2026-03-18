import { json } from "@sveltejs/kit"

let todos = [
    {
        id: 1,
        task: "studare TPSI",
        done: true,
        priority: 1
    }
]

export async function GET({ params, request, url }) {
    console.log("Ricevuto HTTP GET")

    const id = Number(params.id);

    if (isFinite(id)) {
        let todo = todos.filter(t => t.id == id)

        if (todo.length === 0) return json("ERROR NOT FOUND");

        return json(todo);
    }

    let res = todos;
    if (url.searchParams.has("priority")) {
        res = todos.filter(t => t.priority == +url.searchParams.get('priority'))
        return json(res)
    } else if (url.searchParams.has("done")) {
        res = todos.filter(t => t.done == (url.searchParams.get('done') === 'true'))
        return json(res)
    }



    return json("ERROR ID INVALID");
}

export async function POST({ request }) {
    console.log("Ricevuto HTTP POST");

    const body = await request.json();

    console.log("POST BODY:", body)

    body.id = Math.ceil(Math.random() * 100);

    todos.push(body);

    return json('OK')
}

export async function PUT({ params, request }) {
    console.log("Ricevuto HTTP PUT con parametro:", params)

    const body = await request.json();

    console.log("PUT BODY:", body);

    let todo = todos.findIndex(t => t.id == params.id)

    todos[todo] = body

    return json('OK');
}

export async function PATCH({ params, request }) {
    console.log("Ricevuto HTTP PATCH con paramentro", params);

    let body = await request.json();

    let todo = todos.findIndex(t => t.id == params.id);

    const key = Object.keys(body);

    todos[todo][key] = body[key];

    return json("OK");
}

export async function DELETE({ params, request }) {
    console.log("Ricevuto HTTP DELETE  con parametro:", params);

    todos = todos.filter(t => t.id != params.id);

    return json('OK');
}