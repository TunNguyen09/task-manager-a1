import { useState } from "react";
import { getAuthHeaders } from "../utils/auth";
import SearchTask from "../components/SearchTask";

export default function SearchView() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    setLoading(true);
    setError("");

    const params = new URLSearchParams();
    if (query.trim()) params.append("text", query.trim());
    if (category.trim()) params.append("category", category.trim());

    try {
      const response = await fetch(`/api/tasks/search?${params.toString()}`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setError(data.error || "Search failed");
        setResults([]);
        return;
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      console.error(err);
      setError("Could not connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>Search Tasks</h2>

      <div className="row">
        <input
          className="input"
          type="text"
          placeholder="Search by task name..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <select
          className="input"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All categories</option>
          <option value="work">Work</option>
          <option value="school">School</option>
          <option value="other">Other…</option>
        </select>

        <button className="btn btnPrimary" onClick={handleSearch}>
          Search
        </button>
      </div>

      {loading && <p style={{ color: "white" }}>Searching…</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ marginTop: 20 }}>
        {results.length === 0 && !loading && (
          <p style={{ color: "white" }}>No results found.</p>
        )}

        {results.map((task) => (
          <SearchTask key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}
