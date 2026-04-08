const TODOS_URL = "http://localhost:5173/api/todos"

export async function get_all_todos(){
    const response = await fetch(TODOS_URL);
    return await response.json();
}

export async function create_todo(todo) {

    const request = await fetch("http://localhost:5173/api/todos", {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(todo), // body data type must match "Content-Type" header
        mode: "cors", // no-cors, *cors, same-origin
    });
}