import { useState } from "react";
import { getAuthHeaders } from "../utils/auth";

export default function AddTask() {
  const [formData, setFormData] = useState({ text: "", deadline: "", category:"", customCategory: "", });
  const [toast, setToast] = useState({ type: "", msg: "" });

  const showToast = (type, msg) => {
    setToast({ type, msg });
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => setToast({ type: "", msg: "" }), 2200);
  };

  const handleChange = (e) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.text.trim()) {
      showToast("error", "Task text is required.");
      return;
    }

    const finalCategory =
      formData.category === "Other"
        ? formData.customCategory
        : formData.category;

    const newTask = {
      text: formData.text.trim(),
      deadline: formData.deadline || null,
      category: finalCategory || "",
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
    } catch (err) {
      console.error(err);
      showToast("error", "Could not connect to server.");
    }
  };

  return (
    <div className="card">
      <h2>Add Task</h2>
      <p style={{ color: "rgba(255,255,255,0.65)", marginTop: 0 }}>
        Create a new task and optionally set a deadline.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="row">
          <label htmlFor="task-title" className="acc">Task title</label>
          <input
            id="task-title"
            className="input"
            type="text"
            name="text"
            placeholder="Task title (e.g., Submit MERN assignment)"
            value={formData.text}
            onChange={handleChange}
          />

          <label htmlFor="deadline-input" className="acc">Deadline</label>
          <input
            id="deadline-input"
            className="input"
            type="date"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
          />

          <label htmlFor="category-select" className="acc">Select Category</label>
          <select
              id="category-select"
              className="input"
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="">Select category</option>
              <option value="Work">Work</option>
              <option value="School">School</option>
              <option value="Personal">Personal</option>
              <option value="Other">Other...</option>
            </select>

            {formData.category === "Other" && (
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
              Create Task
            </button>
        </div>

        {toast.msg ? <div className={`toast ${toast.type}`}>{toast.msg}</div> : null}
      </form>
    </div>
  );
}
