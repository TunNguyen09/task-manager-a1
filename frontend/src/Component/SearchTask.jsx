import { useState } from "react";
import { getAuthHeaders } from "../utils/auth";

export default function SearchTask({ onResults }) {
    const [formData, setFormData] = useState({
        text: "",
        category: ""
    });

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

    const query = new URLSearchParams();

    if (formData.text.trim()) query.append("text", formData.text.trim());
    if (formData.category.trim()) query.append("category", formData.category.trim());

    try {
        const response = await fetch(`/api/tasks/search?${query.toString()}`, {
            method: "GET",
            headers: getAuthHeaders(false),
        });

        const result = await response.json();

        if (!response.ok) {
            showToast("error", result.error || "Search failed.");
            return;
        }

        onResults(result);
        showToast("success", "Search complete!");
        } catch (err) {
        console.error(err);
        showToast("error", "Could not connect to server.");
        }
    };

    return (
        <div className="card">
            <h2>Search Tasks</h2>

            <form onSubmit={handleSubmit}>
                <div className="row">
                <input
                    className="input"
                    type="text"
                    name="text"
                    placeholder="Search by task name"
                    value={formData.text}
                    onChange={handleChange}
                />
                </div>

                <div className="row" style={{ marginTop: 12 }}>
                <input
                    className="input"
                    type="text"
                    name="category"
                    placeholder="Search by category (e.g., work)"
                    value={formData.category}
                    onChange={handleChange}
                />

                <button className="btn btnPrimary" type="submit">
                    Search
                </button>
                </div>

                {toast.msg ? <div className={`toast ${toast.type}`}>{toast.msg}</div> : null}
            </form>
        </div>
);
}
