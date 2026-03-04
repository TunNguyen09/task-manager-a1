const express = require("express");
const path = require("path");
const cors = require("cors");
const app = express();

const PORT = 8080;

app.use(cors());

// Middleware
app.use(express.json());
app.use(express.urlencoded())

// JSON data 
let tasks = [
  { id: 1, text: "Example task", time: Date.now() },
  { id: 2, text: "Example task 2", time: Date.now() },
];

app.get("/", (req, res) => {
  res.send("Backend is running. Try /api/tasks");
});

// REST API
// Display list of tasks
app.get("/api/tasks", (req, res) => {
  res.json(tasks);
  console.log(tasks);
});

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
