import { useState } from 'react';
import '../App.css';

function AddTask({ onTaskAdded }) {
    const [formData, setFormData] = useState({
        text: '',
        deadline: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const newTask = {
            text: formData.text,
            deadline: formData.deadline ? new Date(formData.deadline): null
        };

        try {
        const response = await fetch('/api/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newTask)
        });
        const result = await response.json();
        
        if (response.status === 201) {
            alert('Task added successfully!');
            setFormData({ text: '', deadline: '' }); // Reset form
            if (onTaskAdded) onTaskAdded(); // Refresh the task list
        } else {
            alert('Error: ' + result.error);
        }
        } catch (error) {
        console.error('Error adding task:', error);
        }
  };

    const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

    return(
        <>
            <h1>Add a Task</h1>

            <nav>
                <a href="/">Home</a> |
                <a href="/add">Add Task</a> |
                <a href="/about">About</a>
            </nav>

            <form id="task-form" onSubmit={handleSubmit}>
                <label htmlFor="task-input">Task:</label><br/>
                <input type="text" id="task-input" name='text' value={formData.text} onChange={handleChange} required/>
                <label htmlFor="task-date">When is it due?</label>
                <input type="date" id="task-date" name='deadline' value={formData.deadline} onChange={handleChange} />
                <br/><br/>
                <button type="submit">Add Task</button>
            </form>

            <p id="message"></p>
        
        </>
    );
}

export default AddTask;