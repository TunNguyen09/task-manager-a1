import { useEffect, useState } from "react";
import CheckTime from "./CheckTime";

export default function DisplayTasks() {
  const [tasks, setTasks] = useState([]);
  const [formData, setFormData] = useState({ text: "", deadline: "" });

  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ type: "", msg: "" });

  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  const showToast = (type, msg) => {
    setToast({ type, msg });
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => setToast({ type: "", msg: "" }), 2200);
  };

  const loadTasks = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/tasks");
      const data = await response.json();
      setTasks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      showToast("error", "Could not load tasks (server offline?)");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleChange = (e) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleAddTask = async (e) => {
    e.preventDefault();

    if (!formData.text.trim()) {
      showToast("error", "Task text is required.");
      return;
    }

    const newTask = {
      text: formData.text.trim(),
      deadline: formData.deadline ? new Date(formData.deadline) : null,
    };

    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTask),
      });

      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        showToast("error", result.error || "Could not create task.");
        return;
      }

      setFormData({ text: "", deadline: "" });
      showToast("success", "Task added!");
      await loadTasks();
    } catch (err) {
      console.error(err);
      showToast("error", "Could not connect to server.");
    }
  };

  const handleDeleteTask = async (id) => {
    const ok = window.confirm("Delete this task?");
    if (!ok) return;

    try {
      const response = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        showToast("error", result.error || "Could not delete task.");
        return;
      }
      showToast("success", "Task deleted.");
      await loadTasks();
    } catch (err) {
      console.error(err);
      showToast("error", "Could not connect to server.");
    }
  };

  const startEdit = (task) => {
    setEditingId(task.id);
    setEditText(task.text || "");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  const saveEdit = async (taskId) => {
    if (!editText.trim()) {
      showToast("error", "Task text cannot be empty.");
      return;
    }

    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: editText.trim() }),
      });

      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        showToast("error", result.error || "Could not update task.");
        return;
      }

      showToast("success", "Task updated.");
      cancelEdit();
      await loadTasks();
    } catch (err) {
      console.error(err);
      showToast("error", "Could not connect to server.");
    }
  };

  return (
    <div className="card">
      <h2>Home</h2>
      <p style={{ color: "rgba(255,255,255,0.65)", marginTop: 0 }}>
        Add tasks and manage them with full CRUD (Create, Read, Update, Delete).
      </p>

      <form onSubmit={handleAddTask}>
        <div className="row">
          <input
            className="input"
            type="text"
            name="text"
            placeholder="What do you need to do?"
            value={formData.text}
            onChange={handleChange}
          />
          <input
            className="input"
            type="date"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
          />
          <button className="btn btnPrimary" type="submit">
            Add
          </button>
        </div>

        {toast.msg ? (
          <div className={`toast ${toast.type}`}>{toast.msg}</div>
        ) : null}
      </form>

      <div style={{ marginTop: 16 }}>
        <span className="badge">
          {loading ? "Loading…" : `${tasks.length} task(s)`}
        </span>
      </div>

      {loading ? (
        <div className="toast">Loading tasks…</div>
      ) : tasks.length === 0 ? (
        <div className="toast">No tasks yet — add your first one!</div>
      ) : (
        <ul className="taskList">
          {tasks.map((task) => (
            <li className="taskItem" key={task.id}>
              <div>
                {editingId === task.id ? (
                  <>
                    <p className="taskTitle" style={{ marginBottom: 8 }}>
                      Editing
                    </p>
                    <input
                      className="input"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      placeholder="Update task text"
                    />
                  </>
                ) : (
                  <p className="taskTitle">{task.text}</p>
                )}

                <div className="taskMeta">
                  <span className="badge">
                    Due: <CheckTime time={task.deadline} />
                  </span>
                </div>
              </div>

              <div style={{ display: "flex", gap: 8, alignItems: "start" }}>
                {editingId === task.id ? (
                  <>
                    <button className="btn btnPrimary" onClick={() => saveEdit(task.id)} type="button">
                      Save
                    </button>
                    <button className="btn" onClick={cancelEdit} type="button">
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button className="btn" onClick={() => startEdit(task)} type="button">
                      Edit
                    </button>
                    <button className="btn btnDanger" onClick={() => handleDeleteTask(task.id)} type="button">
                      Delete
                    </button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
