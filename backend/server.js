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
app.use(express.json());

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
    try {
      const tasks = await Task.find({});
      res.status(200).json(tasks);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch tasks' });
    }
});

//mongo read one
app.get('/api/tasks/:id', async (req, res) => {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({ error: 'Invalid task id' });
    }

    try {
      const task = await Task.findOne({ id });

      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }

      res.status(200).json(task);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch task' });
    }
});

//mongodb create
app.post('/api/tasks', async(req, res) => {
    const newTask = req.body;
    if (newTask && newTask.text) {
        try {
          const newTask2 = new Task({
              id: Date.now(),
              text: newTask.text,
              deadline: newTask.deadline ? new Date(newTask.deadline).toISOString(): null
          });
          const savedTask = await newTask2.save();
          res.status(201).json(savedTask);
        } catch (error) {
          res.status(500).json({ error: 'Failed to create task' });
        }
    } else {
        console.log('error ', newTask);
        res.status(400).json({ error: "Invalid task data" });
    }
});

//mongodb update
app.patch('/api/tasks/:id', async (req, res) => {
    const id = Number(req.params.id);
    const { text, deadline } = req.body;

    if (Number.isNaN(id)) {
      return res.status(400).json({ error: 'Invalid task id' });
    }

    if (text === undefined && deadline === undefined) {
      return res.status(400).json({ error: 'No update fields provided' });
    }

    const updates = {};
    if (text !== undefined) updates.text = text;
    if (deadline !== undefined) {
      updates.deadline = deadline ? new Date(deadline).toISOString() : null;
    }

    try {
      const updatedTask = await Task.findOneAndUpdate(
        { id },
        updates,
        { returnDocument: 'after', runValidators: true }
      );

      if (!updatedTask) {
        return res.status(404).json({ error: 'Task not found' });
      }

      res.status(200).json(updatedTask);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update task' });
    }
});

//mongodb delete
app.delete('/api/tasks/:id', async (req, res) => {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({ error: 'Invalid task id' });
    }

    try {
      const deletedTask = await Task.findOneAndDelete({ id });

      if (!deletedTask) {
        return res.status(404).json({ error: 'Task not found' });
      }

      res.status(200).json({ message: 'Task deleted' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete task' });
    }
});

// 404 handler
app.use((req, res) => {
  res.status(404).send("Page not found");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
