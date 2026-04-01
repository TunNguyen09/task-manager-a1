import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import DisplayTasks from "./Component/DisplayTasks";
import AddTask from "./Component/AddTask";
import AboutView from "./aboutView";
import "./css/App.css";
import Register from "./pages/Register";
import Login from "./pages/Login";
import { clearAuthData, isLoggedIn } from "./utils/auth";

function Layout({ children }) {
  function handleLogout() {
    clearAuthData();
    window.location.href = "/login";
  }

  return (
    <div className="appShell">
      <header className="appHeader">
        <div className="brand">
          <div className="brandLogo">✓</div>
          <div>
            <h1 className="brandTitle">Task Manager</h1>
            <p className="brandSub">Simple MERN CRUD app</p>
          </div>
        </div>

        <nav className="nav">
          <NavLink to="/" end className={({ isActive }) => `navLink ${isActive ? "active" : ""}`}>
            Home
          </NavLink>

          <NavLink to="/add" className={({ isActive }) => `navLink ${isActive ? "active" : ""}`}>
            Add Task
          </NavLink>

          <NavLink to="/about" className={({ isActive }) => `navLink ${isActive ? "active" : ""}`}>
            About
          </NavLink>

          {!isLoggedIn() ? (
            <>
              <NavLink to="/register" className={({ isActive }) => `navLink ${isActive ? "active" : ""}`}>
                Register
              </NavLink>
              <NavLink to="/login" className={({ isActive }) => `navLink ${isActive ? "active" : ""}`}>
                Login
              </NavLink>
            </>
          ) : (
            <button className="btn" onClick={handleLogout} type="button">
              Logout
            </button>
          )}
        </nav>
      </header>

      <main className="container">{children}</main>

      <footer className="footer">MERN Task Manager • React + Vite • Express • MongoDB</footer>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<DisplayTasks />} />
          <Route path="/add" element={<AddTask />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/about"
            element={
              AboutView ? (
                <AboutView />
              ) : (
                <div className="card">
                  <h2>About</h2>
                  <p>This app demonstrates a MERN stack task manager with full CRUD operations.</p>
                </div>
              )
            }
          />
          <Route
            path="*"
            element={
              <div className="card">
                <h2>404</h2>
                <p>Page not found.</p>
              </div>
            }
          />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}