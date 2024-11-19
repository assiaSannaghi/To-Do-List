// Select important DOM elements
const addBtn = document.getElementById("add-btn");
const taskInput = document.getElementById("task-input");
const form = document.getElementById("inputForm");
const listContainer = document.getElementById("list-container");
const cancelEdit = document.getElementById("cancelEdit");
const ErrorMsg = document.getElementById("ErrorMsg");

// Initialize state array with data from localstorage or an empty array
const state = JSON.parse(localStorage.getItem("data")) || [];

// Save data to localstorage
const saveData = () => {
  localStorage.setItem("data", JSON.stringify(state));
};

// Add new task to "state" array, to UI and to localstorage
const addTask = () => {
  const taskObject = {
    id: `${taskInput.value.toLowerCase().split(" ").join("-")}-${Date.now()}`,
    description: `${taskInput.value}`,
    createdAt: new Date(),
    isChecked: false,
  };

  if (taskInput.value === "") {
    ErrorMsg.textContent = "❌ You must add a task.";
  }

  if (taskInput.value) {
    ErrorMsg.textContent = "";
    state.unshift(taskObject);
    saveData();
    updateUI();
    taskInput.value = "";
  }
};

// Switch between add "mode" and update "mode"
const switchUpdateUI = (id = "", description = "") => {
  taskInput.value = description;
  cancelEdit.style.display = id !== "" ? "block" : "none";
  form.action = id !== "" ? "update" : "add";
  form.dataset.updateId = id;
  addBtn.textContent = id !== "" ? "Update" : "Add";
};

// Update task that already exist
const updateTask = (taskId) => {
  if (taskInput.value === "") {
    ErrorMsg.textContent = "❌ You must update your task.";
    switchUpdateUI(id, description);
  }

  if (taskInput.value) {
    ErrorMsg.textContent = "";
    const taskState = state.find((task) => task.id === taskId);

    if (taskInput.value === taskState.description) {
      ErrorMsg.textContent = "❌ You did NOT update your task.";
    }

    if (taskInput.value !== taskState.description) {
      ErrorMsg.textContent = "";
      taskState.description = taskInput.value;
      switchUpdateUI();
      saveData();
      updateUI();
    }
  }
};

// Delete task
const handleRemove = (taskId) => {
  const indexOfTask = state.findIndex(({ id }) => id === taskId);
  state.splice(indexOfTask, 1);
  saveData();
  updateUI();
};

// Check or uncheck task
const handleCheck = (taskId) => {
  console.log("taskId", taskId);
  const indexOfTask = state.findIndex(({ id }) => id === taskId);
  state[indexOfTask].isChecked = !state[indexOfTask].isChecked;
  saveData();
  updateUI();
};

// Modify task
const handleModify = (taskId) => {
  const indexOfTask = state.findIndex(({ id }) => id === taskId);
  const task = state[indexOfTask];
  switchUpdateUI(task.id, task.description);
};

// Show task in UI
const updateUI = () => {
  listContainer.innerHTML = "";

  state.forEach(({ id, description, isChecked }) => {
    listContainer.innerHTML += `
  <li>
  
    <div class='radio ${
      isChecked ? "checked" : ""
    }' onclick="handleCheck('${id}')">${description}</div>
    <button id='deleteItem' class='deleteItem' onclick="handleRemove('${id}')">
      x
    </button>
    <button class="editIcon" onclick="handleModify('${id}')">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
          />
        </svg>
    </button>
  </li>
  `;
  });
};

// Quit update "mode"
const handleCancelEdit = (e) => {
  e.preventDefault();
  ErrorMsg.textContent = "";
  switchUpdateUI();
};

// Handle add or update of a task
const handleSubmit = (e) => {
  e.preventDefault();
  if (e.target.action.includes("/add")) {
    addTask();
  } else if (e.target.action.includes("/update")) {
    updateTask(e.target.dataset.updateId);
  }
};

// Initialize function
const init = () => {
  state.length && updateUI();
  cancelEdit.addEventListener("click", handleCancelEdit);
  form.addEventListener("submit", handleSubmit);
};

init();
