import { useEffect, useState } from "react";
import CheckTime from "./CheckTime";
import { getAuthHeaders } from "../utils/auth";
import "../css/App.css";

export default function SearchTask({ tasks, onRefresh }) {
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

  const startEdit = (task) => {
    setEditingId(task.id);
    setEditText(task.text);
    setEditTime(task.deadline || "");
    setEditCategory(task.category || "");
    setEditCustomCategory("");
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const saveEdit = async (id) => {
    const finalCategory = editCategory === "Other" ? editCustomCategory : editCategory;
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          text: editText, 
          deadline: editTime, 
          category: finalCategory 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setEditingId(null);
        showToast("success", "Task updated successfully!");
        if (onRefresh) onRefresh(); // Tells parent to update the search results
      } else {
        showToast("error", data.error || "Update failed.");
      }
    } catch (err) {
      showToast("error", "Server error.");
    }
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        showToast("success", "Task deleted!");
        if (onRefresh) onRefresh();
      } else {
        showToast("error", "Failed to delete.");
      }
    } catch (err) {
      showToast("error", "Server error.");
    }
  };

  if (!tasks || tasks.length === 0) {
    return (
      <div className="card">
        <p style={{ color: "white" }}>No results found.</p>
      </div>
    );
  }

  return (
    <div className="card">
      {toast.msg && <div className={`toast ${toast.type}`}>{toast.msg}</div>}
      
      <h2 className="brandTitle">Search Results</h2>
      
      <ul className="taskList">
        {tasks.map((task) => (
          <li className="taskItem" key={task.id}>
            <div className="taskContent">
              {editingId === task.id ? (
                <div className="editGroup">
                  <input
                    className="input"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                  />
                  
                  <input
                    type="datetime-local"
                    className="input"
                    value={editTime}
                    onChange={(e) => setEditTime(e.target.value)}
                  />

                  <select
                    className="input"
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                  >
                    <option value="">Select Category</option>
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
                </div>
              ) : (
                <>
                  <p className="taskTitle">{task.text}</p>
                  <div className="taskMeta">
                    <span className="badge">{task.category || "General"}</span>
                    {task.deadline && (
                      <span className="badge">
                        Due: <CheckTime time={task.deadline} />
                      </span>
                    )}
                  </div>
                </>
              )}
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
    </div>
  );
}