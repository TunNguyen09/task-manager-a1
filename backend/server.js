require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const Task = require("./models/Task");
const User = require("./models/User");
const authRoutes = require("./routes/auth");
const authMiddleware = require("./middleware/authMiddleware");

const app = express();
const PORT = process.env.PORT || 8080;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/task_manager";

const http = require('http');
const { Server } = require('socket.io');
const server = http.createServer(app);

//socket io
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", 
    methods: ["GET", "POST"]
  }
});
io.on('connection', (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on('set_mode', (data) => {
    // Broadcast to everyone
    io.emit('set_mode_cl', data);
  });

  socket.on('disconnect', () => {
    console.log('User Disconnected', socket.id);
  });
});


app.use(cors());
app.use(express.json());

mongoose.connect(MONGO_URI);

const db = mongoose.connection;
db.on("error", () => {
  console.log("Error connecting to database");
});
db.once("open", () => {
  console.log("Database connected");
});

app.get("/", (req, res) => {
  res.send("Backend is running. Try /api/tasks or /api/auth");
});

// Auth routes
app.use("/api/auth", authRoutes);

/*
  OPTIONAL SEED ROUTE FOR TESTING
  Use this once if you want a demo user quickly.
*/
app.post("/api/setup/demo-user", async (req, res) => {
  try {
    const existing = await User.findOne({ email: "demo@example.com" });
    if (existing) {
      return res.status(200).json({ message: "Demo user already exists" });
    }

    const bcrypt = require("bcryptjs");
    const hashedPassword = await bcrypt.hash("password123", 10);

    const user = new User({
      username: "demo",
      email: "demo@example.com",
      password: hashedPassword,
    });

    await user.save();

    res.status(201).json({ message: "Demo user created" });
  } catch (error) {
    res.status(500).json({ error: "Failed to create demo user" });
  }
});

/**************** TASK ROUTES - PROTECTED ****************/

// Get only logged-in user's tasks
app.get("/api/tasks", authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.userId }).sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

// Get one task only if it belongs to logged-in user
app.get("/api/tasks/:id", authMiddleware, async (req, res) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    return res.status(400).json({ error: "Invalid task id" });
  }

  try {
    const task = await Task.findOne({ id, userId: req.user.userId });

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch task" });
  }
});

// Create task for logged-in user
app.post("/api/tasks", authMiddleware, async (req, res) => {
  const { text, deadline, completed, category } = req.body;

  if (!text || !text.trim()) {
    return res.status(400).json({ error: "Task text is required" });
  }

  try {
    const newTask = new Task({
      id: Date.now(),
      text: text.trim(),
      deadline: deadline ? new Date(deadline).toISOString() : null,
      completed: completed ?? false,
      category: category || "",
      userId: req.user.userId,
    });

    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (error) {
    res.status(500).json({ error: "Failed to create task" });
  }
});

// Update task only if it belongs to logged-in user
app.patch("/api/tasks/:id", authMiddleware, async (req, res) => {
  const id = Number(req.params.id);
  const { text, deadline, completed, category } = req.body;

  if (Number.isNaN(id)) {
    return res.status(400).json({ error: "Invalid task id" });
  }

  if (text === undefined && deadline === undefined && completed === undefined) {
    return res.status(400).json({ error: "No update fields provided" });
  }

  const updates = {};

  if (text !== undefined) updates.text = text.trim();
  if (deadline !== undefined) {
    updates.deadline = deadline ? new Date(deadline).toISOString() : null;
  }
  if (completed !== undefined) {
    updates.completed = completed;
  }
  if (category !== undefined) updates.category = category;

  try {
    const updatedTask = await Task.findOneAndUpdate(
      { id, userId: req.user.userId },
      updates,
      { after: true, runValidators: true } //mongoose warning, new update here, change 'new' to 'after'
    );

    if (!updatedTask) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: "Failed to update task" });
  }
});

// Delete task only if it belongs to logged-in user
app.delete("/api/tasks/:id", authMiddleware, async (req, res) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    return res.status(400).json({ error: "Invalid task id" });
  }

  try {
    const deletedTask = await Task.findOneAndDelete({
      id,
      userId: req.user.userId,
    });

    if (!deletedTask) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.status(200).json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete task" });
  }
});

// Search tasks if it belongs to logged-in user
app.get("/api/search", authMiddleware, async (req, res) => {
  const { text, category } = req.query;

  const query = {
    userId: req.user.userId
  };

  // Search by task title
  if (text) {
    query.text = { $regex: text, $options: "i" }; // case-insensitive
  }

  // Search by category
  if (category) {
    query.category = { $regex: category, $options: "i" };
  }

  try {
    const tasks = await Task.find(query);
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: "Search failed" });
  }
});

// 404
app.use((req, res) => {
  res.status(404).send("Page not found");
});

//io
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

// app.listen(PORT, () => {
//   console.log(`Server running at http://localhost:${PORT}`);
// });
