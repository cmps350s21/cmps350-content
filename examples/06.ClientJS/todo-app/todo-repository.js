export function getTodos() {
    let todos;
    if (localStorage.todos === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.todos);
    }
    return todos;
}

export function addTodo(todo) {
    let todos;
    if (localStorage.todos === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.todos);
    }
    todos.push(todo);
    localStorage.todos = JSON.stringify(todos);
}

export function deleteTodo(todo) {
    let todos;
    if (localStorage.todos === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.todos);
    }
    todos.splice(todos.indexOf(todo), 1);
    localStorage.todos = JSON.stringify(todos);
}