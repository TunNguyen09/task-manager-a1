import { useState } from "react";
import { getAuthHeaders } from "./utils/auth";
import SearchTask from "./Component/SearchTask";

export default function SearchView() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [otherCategory, setOtherCategory] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    const params = new URLSearchParams();
    if (query) params.append("text", query);
    if (category && category !== "Other") {
      params.append("category", category);
    } else if (category === "Other" && otherCategory) {
      params.append("category", otherCategory);
    }

    const response = await fetch(`/api/search?${params.toString()}`, {
      headers: getAuthHeaders(),
    });

    const data = await response.json();

    setResults(data);
  };

  return (
    <div className="card">
      <h2>Search Tasks</h2>

      <div className="row">
        <input
          className="input"
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
          <option value="Work">Work</option>
          <option value="School">School</option>
          <option value="Personal">Personal</option>
          <option value="Other">Other...</option>
        </select>

        {category === "Other" && (
          <input
            className="input"
            type="text"
            placeholder="Custom category"
            value={otherCategory}
            onChange={(e) => setOtherCategory(e.target.value)}
          />
        )}

        <button className="btn btnPrimary" onClick={handleSearch}>
          Search
        </button>
        
        <SearchTask tasks={results} />
      </div>
    </div>
  );
}