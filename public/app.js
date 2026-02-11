
async function loadTasks() {
  const list = document.getElementById("task-list");
  if (!list) return; // Only run on pages that have the task list

  list.innerHTML = "";

  try {
    const res = await fetch("/api/tasks");
    const tasks = await res.json();

    if (tasks.length === 0) {
      const li = document.createElement("li");
      li.textContent = "No tasks yet.";
      list.appendChild(li);
      return;
    }

    tasks.forEach(task => {
      const li = document.createElement("li");
      li.id = "li"+task.id;
      // li.textContent = task.text + " ";

      const name = document.createElement("span");
      name.id = "sp"+task.id;
      name.textContent = task.text;

      const editbtn = document.createElement("button");
      editbtn.id = "eb"+task.id;
      editbtn.textContent = "Edit";

      editbtn.addEventListener("click", async (e) => {
        e.preventDefault();
        task.edit = false;
        await editTask(task.id);
        //loadTasks(); // refresh list
      });
      
      const btn = document.createElement("button");
      btn.textContent = "Delete";
      btn.addEventListener("click", async () => {
        await deleteTask(task.id);
        loadTasks(); // refresh list
      });

      li.appendChild(name);
      li.appendChild(editbtn);
      li.appendChild(btn);
      list.appendChild(li);
    });
  } catch (err) {
    const li = document.createElement("li");
    li.textContent = "Error loading tasks.";
    list.appendChild(li);
  }
}

// Helper: delete, edit
async function deleteTask(id) {
  try {
    if(confirm("Delete this task?")){
      await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    }
  } catch (err) {
    console.error("Error deleting task:", err);
  }
}

async function editTask(id){
  const name = document.querySelector("#sp"+id);
  const task = {};
  let text = prompt("Edit task", name.textContent);
  if (text!=null) {
    task.text = text;
  } else {
    task.text = name.textContent;
  }
  console.log(text);

  try {
    const response = await fetch(`/api/tasks/${id}`, { 
      method: "PATCH",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task)
    });
    const result = await response.json();
        if (response.status === 200) {
            // alert('Task updated successfully!');
            loadTasks();
        } else {
            alert('Error: ' + result.error);
        }
  } catch (err) {
    console.error("Error editing task:", err);
  }
}

// Handle: add 
function setupAddForm() {
  const form = document.getElementById("task-form");
  if (!form) return; // Only run on add page

  const input = document.getElementById("task-input");
  const message = document.getElementById("message");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const text = input.value.trim();
    if (!text) return;

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text })
      });

      if (res.ok) {
        input.value = "";
        message.textContent = "Task added!";
      } else {
        message.textContent = "Could not add task.";
      }
    } catch (err) {
      message.textContent = "Error adding task.";
    }
  });
}

// Run on page load
loadTasks();
setupAddForm();
