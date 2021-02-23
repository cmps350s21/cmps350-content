//Select DOM
const todoInput = document.querySelector(".todo-input");
const todoButton = document.querySelector(".todo-add");
const todoList = document.querySelector(".todo-list");

//Event Listeners
document.addEventListener("DOMContentLoaded", getTodos);
todoButton.addEventListener("click", addTodo);
todoList.addEventListener("click", deleteTodo);

//Functions
function addTodo() {
  renderToDo(todoInput.value)

  //Save to localStorage
  saveTodo(todoInput.value);
  todoInput.value = "";
}

function renderToDo(toDoTask) {
  //Create todo div
  const todoDiv = document.createElement("div");
  todoDiv.classList.add("todo");
  //Create list item
  const newTodo = document.createElement("li");
  newTodo.innerText = toDoTask;
  newTodo.classList.add("todo-item");
  todoDiv.appendChild(newTodo);

  //Create Completed Button
  const completedButton = document.createElement("button");
  completedButton.innerHTML = `<i class="fas fa-check"></i>`;
  completedButton.classList.add("complete-btn");
  todoDiv.appendChild(completedButton);

  //Create trash button
  const trashButton = document.createElement("button");
  trashButton.innerHTML = `<i class="fas fa-trash"></i>`;
  trashButton.classList.add("trash-btn");
  todoDiv.appendChild(trashButton);
  //attach final Todo
  todoList.appendChild(todoDiv);
}

function deleteTodo(e) {
  const item = e.target;

  if (item.classList[0] === "trash-btn") {
    const todo = item.parentElement;
    // Add animation class
    todo.classList.add("fall");
    todo.addEventListener("transitionend", e => {
      todo.remove();
    });

    //Remove from localStorage
    removeTodo(todo);
  }
  if (item.classList[0] === "complete-btn") {
    const todo = item.parentElement;
    todo.classList.toggle("completed");
    console.log(todo);
  }
}

function saveTodo(todo) {
  let todos;
  if (localStorage.todos === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.todos);
  }
  todos.push(todo);
  localStorage.todos = JSON.stringify(todos);
}

function removeTodo(todo) {
  let todos;
  if (localStorage.todos === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.todos);
  }
  const todoIndex = todo.children[0].innerText;
  todos.splice(todos.indexOf(todoIndex), 1);
  localStorage.todos = JSON.stringify(todos);
}

function getTodos() {
  let todos;
  if (localStorage.todos === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.todos);
  }
  todos.forEach( (todo) => {
    renderToDo(todo)
  });
}