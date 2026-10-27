// ---------- State ----------
var todos = [];            // each todo: { id, text, completed }
var currentFilter = "all"; // all | active | completed
var nextId = 1;

// ---------- Elements ----------
var input = document.getElementById("todoInput");
var addBtn = document.getElementById("addBtn");
var list = document.getElementById("todoList");
var countLabel = document.getElementById("count");
var clearCompletedBtn = document.getElementById("clearCompleted");
var clearAllBtn = document.getElementById("clearAll");
var filterButtons = document.querySelectorAll(".filter");

// ---------- Storage ----------
function save() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

function load() {
  var saved = localStorage.getItem("todos");
  if (saved) {
    todos = JSON.parse(saved);
    for (var i = 0; i < todos.length; i++) {
      if (todos[i].id >= nextId) {
        nextId = todos[i].id + 1;
      }
    }
  }
}

// ---------- Actions ----------
function addTodo() {
  var text = input.value.trim();
  if (text === "") return;

  todos.push({ id: nextId, text: text, completed: false });
  nextId++;
  input.value = "";
  update();
}

function toggleTodo(id) {
  for (var i = 0; i < todos.length; i++) {
    if (todos[i].id === id) {
      todos[i].completed = !todos[i].completed;
    }
  }
  update();
}

function deleteTodo(id) {
  var kept = [];
  for (var i = 0; i < todos.length; i++) {
    if (todos[i].id !== id) kept.push(todos[i]);
  }
  todos = kept;
  update();
}

function editTodo(id, newText) {
  newText = newText.trim();
  if (newText === "") {
    deleteTodo(id);
    return;
  }
  for (var i = 0; i < todos.length; i++) {
    if (todos[i].id === id) todos[i].text = newText;
  }
  update();
}

function clearCompleted() {
  var kept = [];
  for (var i = 0; i < todos.length; i++) {
    if (!todos[i].completed) kept.push(todos[i]);
  }
  todos = kept;
  update();
}

function clearAll() {
  todos = [];
  update();
}

// ---------- Editing (double-click) ----------
function startEdit(li, todo) {
  var textSpan = li.querySelector(".text");
  var editBox = document.createElement("input");
  editBox.type = "text";
  editBox.className = "edit-input";
  editBox.value = todo.text;
  li.replaceChild(editBox, textSpan);
  editBox.focus();

  var finished = false;
  function finish() {
    if (finished) return;
    finished = true;
    editTodo(todo.id, editBox.value);
  }

  editBox.addEventListener("keydown", function (e) {
    if (e.key === "Enter") finish();
    if (e.key === "Escape") {
      finished = true;
      update();
    }
  });
  editBox.addEventListener("blur", finish);
}

// ---------- Rendering ----------
function render() {
  list.innerHTML = "";

  for (var i = 0; i < todos.length; i++) {
    var todo = todos[i];

    if (currentFilter === "active" && todo.completed) continue;
    if (currentFilter === "completed" && !todo.completed) continue;

    var li = document.createElement("li");
    if (todo.completed) li.className = "done";

    var checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.completed;

    var span = document.createElement("span");
    span.className = "text";
    span.textContent = todo.text;

    var del = document.createElement("button");
    del.className = "delete";
    del.textContent = "🗑";

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(del);
    list.appendChild(li);

    attachEvents(li, checkbox, span, del, todo);
  }

  // items left
  var left = 0;
  for (var j = 0; j < todos.length; j++) {
    if (!todos[j].completed) left++;
  }
  countLabel.textContent = left + (left === 1 ? " item left" : " items left");

  // active filter button
  for (var k = 0; k < filterButtons.length; k++) {
    var btn = filterButtons[k];
    if (btn.getAttribute("data-filter") === currentFilter) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  }
}

// separate function so each todo keeps its own values
function attachEvents(li, checkbox, span, del, todo) {
  checkbox.addEventListener("change", function () { toggleTodo(todo.id); });
  del.addEventListener("click", function () { deleteTodo(todo.id); });
  span.addEventListener("dblclick", function () { startEdit(li, todo); });
}

function update() {
  save();
  render();
}

// ---------- Events ----------
addBtn.addEventListener("click", addTodo);
input.addEventListener("keydown", function (e) {
  if (e.key === "Enter") addTodo();
});

for (var f = 0; f < filterButtons.length; f++) {
  filterButtons[f].addEventListener("click", function () {
    currentFilter = this.getAttribute("data-filter");
    render();
  });
}

clearCompletedBtn.addEventListener("click", clearCompleted);
clearAllBtn.addEventListener("click", clearAll);

// ---------- Start ----------
load();
render();
