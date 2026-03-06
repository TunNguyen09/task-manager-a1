export default function AboutView() {
  return (
    <div className="card">
      <h2>About</h2>
      <p style={{ color: "rgba(255,255,255,0.75)", lineHeight: "1.7" }}>
        This Task Manager is a MERN stack web application built with React, Vite,
        Node.js, Express, MongoDB, and Mongoose.
      </p>
      <p style={{ color: "rgba(255,255,255,0.75)", lineHeight: "1.7" }}>
        It allows users to create, view, update, and delete tasks through a REST API.
        The project demonstrates full CRUD functionality and communication between
        the frontend, backend, and database.
      </p>
      <p style={{ color: "rgba(255,255,255,0.75)", lineHeight: "1.7" }}>
        In the future, this app could be extended with user accounts, task categories,
        reminders, and deployment to the cloud.
      </p>
    </div>
  );
}
