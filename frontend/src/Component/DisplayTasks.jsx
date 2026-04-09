import { useEffect, useState } from "react";
import CheckTime from "./CheckTime";
import { getAuthHeaders } from "../utils/auth";

export default function DisplayTasks() {
  const [tasks, setTasks] = useState([]);
  const [formData, setFormData] = useState({ text: "", deadline: "", category: "", customCategory: "", });

  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ type: "", msg: "" });

  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [editTime, setEditTime] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editCustomCategory, setEditCustomCategory] = useState("");

  const showToast = (type, msg) => {
    setToast({ type, msg });
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => setToast({ type: "", msg: "" }), 2200);
  };

  const loadTasks = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/tasks", {
        headers: getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        showToast("error", data.error || "Could not load tasks.");
        setTasks([]);
        return;
      }

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
      deadline: formData.deadline || null,
      category: formData.category === "other" ? formData.customCategory : formData.category,
    };

    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: getAuthHeaders(true),
        body: JSON.stringify(newTask),
      });

      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        showToast("error", result.error || "Could not create task.");
        return;
      }

      setFormData({ text: "", deadline: "", category: "", customCategory: "", });
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
      const response = await fetch(`/api/tasks/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

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
    setEditTime(task.deadline ? String(task.deadline).slice(0, 10) : "");
    // If category is one of the predefined ones:
    if (task.category === "work" || task.category === "school" || task.category === "") {
      setEditCategory(task.category);
      setEditCustomCategory("");
    } else {
      // Otherwise it's a custom category
      setEditCategory("other");
      setEditCustomCategory(task.category);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText("");
    setEditTime("");
    setEditCategory("");
    setEditCustomCategory("");
  };

  const saveEdit = async (taskId) => {
    if (!editText.trim()) {
      showToast("error", "Task text cannot be empty.");
      return;
    }

    const updatedCategory = editCategory === "other" ? editCustomCategory : editCategory;

    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: getAuthHeaders(true),
        body: JSON.stringify({
          text: editText.trim(),
          deadline: editTime || null,
          category: updatedCategory,
        }),
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
      <h2>Your Tasks!</h2>
      <p style={{ color: "rgba(255,255,255,0.65)", marginTop: 0 }}>
        Add tasks and manage them with full CRUD (Create, Read, Update, Delete).
      </p>

      <form onSubmit={handleAddTask}>
        <div className="row">
          <label htmlFor="task-name" className="acc">Task Name</label>
          <input
            id="task-name"
            className="input"
            type="text"
            name="text"
            placeholder="What do you need to do?"
            value={formData.text}
            onChange={handleChange}
          />

          <label htmlFor="task-date" className="acc">Date</label>
          <input
            id="task-date"
            className="input"
            type="date"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
          />

          <label htmlFor="select-cate" className="acc">Seleact Category</label>
          <select
            id="select-cate"
            className="input"
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="">Select category</option>
            <option value="work">Work</option>
            <option value="school">School</option>
            <option value="other">Other…</option>
          </select>

          {formData.category === "other" && (
            <input
              className="input"
              type="text"
              placeholder="Custom category"
              value={formData.customCategory}
              onChange={(e) =>
                setFormData((p) => ({ ...p, customCategory: e.target.value }))
              }
            />
          )}

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

                    <input
                      className="input"
                      type="date"
                      value={editTime}
                      onChange={(e) => setEditTime(e.target.value)}
                    />

                    <select
                      className="input"
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value)}
                    >
                      <option value="">Select category</option>
                      <option value="Work">Work</option>
                      <option value="School">School</option>
                      <option value="Personal">Personal</option>
                      <option value="Other">Other...</option>
                    </select>

                    {editCategory === "Other" && (
                      <input
                        className="input"
                        type="text"
                        placeholder="Custom category"
                        value={editCustomCategory}
                        onChange={(e) => setEditCustomCategory(e.target.value)}
                      />
                    )}
                  </>
                ) : (
                  <p className="taskTitle">{task.text}</p>
                )}

                <div className="taskMeta">
                  <span className="badge">
                    Category: {task.category || "None"}
                  </span>
                </div>

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