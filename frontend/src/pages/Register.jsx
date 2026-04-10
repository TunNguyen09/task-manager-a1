import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { saveAuthData } from "../utils/auth";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.username || !formData.email || !formData.password || !formData.password2) {
      setError("Please fill in all fields.");
      return;
    }

    if (formData.password != formData.password2) {
      setError("Password does not match.");
      return
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Registration failed.");
        setLoading(false);
        return;
      }
      
      saveAuthData(data.token, data.user);


      setSuccess("Account created successfully.");

      setTimeout(() => {
        navigate("/");
        window.location.reload();
      }, 1000);
    } catch (err) {
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="pageShell">
      <div className="logRes">
        <h1>Create Account</h1>
        <p className="muted">Register to start managing your own tasks.</p>

        <form onSubmit={handleSubmit} className="formStack">
          <label htmlFor="register-username" className="acc">Username</label>
          <input
            id="register-username"
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
          />

          <label htmlFor="register-email" className="acc">Email</label>
          <input
            id="register-email"
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />

          <label htmlFor="register-password" className="acc">Password</label>
          <input
            id="register-password"
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />

          <label htmlFor="register-retype-password" className="acc">Retype password</label>
          <input
            id="register-retype-password"
            type="password"
            name="password2"
            placeholder="Type your password again"
            value={formData.password2}
            onChange={handleChange}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        {error && <p className="errorText">{error}</p>}
        {success && <p className="successText">{success}</p>}

        <p className="muted">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}