const express = require("express");
const path = require("path");
const cors = require("cors");
const app = express();
const { default: mongoose } = require('mongoose');
const Task = require("./models/Task");

const PORT = 8080;
const DB_HOST = 'localhost';
const DB_PORT = 27017;

app.use(cors());

//db connect
const dbURL = `mongodb://${DB_HOST}:${DB_PORT}/task_manager`;
mongoose.connect(dbURL);

const db = mongoose.connection;
db.on('error', function(e) {
  console.log('error connecting');
});
db.on('open', function() {
  console.log('db connected');
})

// Middleware
// app.use(express.json());
// app.use(express.urlencoded())

// JSON data 
let tasks = [
  { id: 1, text: "Example task", deadline: Date.now() },
  { id: 2, text: "Example task 2", deadline: null },
];

async function addExampleTasks(){
  const taskCount = await Task.countDocuments();

  if(taskCount === 0){
    console.log('Adding example tasks...');
    tasks.forEach(task => {
      const newTask = new Task(task);
      newTask.save()
        .then(() => console.log('task added'))
        .catch(err => console.error('error adding task: ',task.id));
    });
  }else{
    console.log('Tasks exist');
    return;
  }
};
addExampleTasks();

app.get("/", (req, res) => {
  res.send("Backend is running. Try /api/tasks");
});

// REST API
// Display list of tasks
// app.get("/api/tasks", (req, res) => {
//   res.json(tasks);
//   console.log(tasks);
// });

/****************MONGODB CRUD******************/

//mongo read
app.get('/api/tasks', async(req, res) => {
    const tasks = await Task.find({});
    res.status(200).json(tasks);
});

//mongodb create
app.post('/api/tasks', express.json(), async(req, res) => {
    const newTask = req.body;
    if (newTask && newTask.text) {

        const newTask2 = new Task({
            id: Date.now(),
            text: newTask.text,
            deadline: newTask.deadline ? new Date(newTask.deadline).toISOString(): null
        });
        const savedTask = await newTask2.save();
        res.status(201).json(savedTask);
    } else {
        console.log('error ', newTask);
        res.status(400).json({ error: "Invalid task data" });
    }
});

/**********************************************/

// // Adding new task
// app.post("/api/tasks", (req, res) => {
//   const { text, time } = req.body;
//   if (!text) {
//     return res.status(400).json({ error: "Task text required" });
//   }

//   const newTask = {
//     id: Date.now(),
//     text,
//     time: time ? new Date(time).toISOString(): null
//   };
  
//   console.log(newTask);
  
//   tasks.push(newTask);
//   res.status(201).json(newTask);
// });

// // Deleting task
// app.delete("/api/tasks/:id", (req, res) => {
//   const id = Number(req.params.id);
//   const index = tasks.findIndex(t => t.id === id);

//   if (index === -1) {
//     return res.status(404).json({ error: "Task not found" });
//   }

//   tasks.splice(index, 1);
//   res.status(200).json({ message: "Task deleted" });
// });

// // Updating task
// app.patch("/api/tasks/:id", (req, res) => {
//   console.log("PATCH request received");

//   const id = Number(req.params.id);
//   const index = tasks.findIndex(t => t.id === id);
//   const task = req.body;
//   tasks[index].text = task.text;
//   res.status(200).json(tasks[index]);
  
// })

// 404 handler
app.use((req, res) => {
  res.status(404).send("Page not found");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
