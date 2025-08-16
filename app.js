const inputBox = document.getElementById("input-box");
const dateInput = document.getElementById("date");
const timeInput = document.getElementById("time");
const listContainer = document.getElementById("list-container");
const todoApp = document.getElementById("todoApp");
const progress = document.getElementById("progress");


let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

//Add Task Function
function addTask() {
  if (inputBox.value == '' || dateInput.value == '' || timeInput.value == '') {
    alert("You must fill all fields!");
    return;
  }

  const task = {
    text : inputBox.value,
    date: dateInput.value,
    time: timeInput.value,
    completed: false
  };

  tasks.push(task);
  saveTasks();
  updateList();

  inputBox.value = "";
  dateInput.value = "";
  timeInput.value = "";
}


//keyboard enter button
document.addEventListener("keydown", function(event){
    if(event.key === "Enter"){
        addTask();
    }
})

//Update list
function updateList() {
  listContainer.innerHTML = "";

  const filteredTasks = tasks.filter(task => {
    if (currentFilter === "all") return true;
    if (currentFilter === "completed") return task.completed;
    if (currentFilter === "incomplete") return !task.completed;
  });

  filteredTasks.forEach((task, index) => {
    const li = document.createElement("li");
    if (task.completed) li.classList.add("checked");

    li.innerHTML = `${task.text}  :  [${task.date}  :  ${task.time}]`;

    //Toggle Completion
    li.addEventListener("click", () => {
      task.completed = !task.completed;
      saveTasks();
      updateList();
    });

    //Delete Button
    const delSpan = document.createElement("span");
    delSpan.innerHTML = "\u00d7";
    delSpan.addEventListener("click", (e) => {
      e.stopPropagation(); // Prevent triggering toggle
      li.classList.add("fade-out");
      setTimeout(() => {
        tasks.splice(index, 1);
        saveTasks();
        updateList();
      },300);
    });
    
    //Edit Button
    const editBtn = document.createElement("button");
    editBtn.className="editBtn";
    editBtn.textContent = "✏️";
    editBtn.style.marginLeft = "10px";
    editBtn.title = "Edit Task";
    editBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const newText = prompt("Edit your task :", task.text);
      const newDate = prompt("Edit date (YYYY-MM-DD):",task.date )
      const newTime = prompt("Edit time (HH:MM):", task.time)

      if(newText && newDate && newTime){
        task.text = newText.trim();
        task.date = newDate;
        task.time = newTime;
        saveTasks();
        updateList();
      }
    });
    li.appendChild(delSpan)
    li.appendChild(editBtn);
    listContainer.appendChild(li);
  });
  updateProgress();
}

//progress Bar

function updateProgress(){
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const percent = total ? (completed/total) *100 : 0;
    progress.style.width = `${percent}%`;

}

//Reminders
setInterval(() => {
  const now = new Date();
  tasks.forEach(task => {
    const taskTime = new Date(`${task.date}T${task.time}`);
    const diff = taskTime - now;
    if(diff >0 && diff<60000 && !task.alerted){
      alert(`Reminder: Task "${task.text}" is due soon! `);
      task.alerted = true;
      saveTasks();
    }
  });
}, 60000);

// Filter Buttons
document.getElementById("filterAll").addEventListener("click", () => {
  currentFilter = "all";
  updateList();
});

document.getElementById("filterCompleted").addEventListener("click", () => {
  currentFilter = "completed";
  updateList();
});

document.getElementById("filterIncomplete").addEventListener("click", () => {
  currentFilter = "incomplete";
  updateList();
});


function setActiveFilter(id) {
  document.querySelectorAll('.filterBtn').forEach(btn => btn.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

document.getElementById("filterAll").addEventListener("click", () => {
  currentFilter = "all";
  setActiveFilter("filterAll");
  updateList();
});



// Dark mode toggle
document.getElementById("toggleDark").addEventListener("click", () => {
    todoApp.classList.toggle("dark-mode");
});

// Enter key support
document.addEventListener("keydown", e => {
    if (e.key === "Enter") addTask();
});

updateList();

// Save & Load
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  updateList();
}

loadTasks();
