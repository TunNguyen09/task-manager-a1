import { useState, useEffect } from 'react';
import CheckTime from './CheckTime';

function DisplayTasks() {
    const [tasks, setTask] = useState([]);

    const loadTasks = async () => {
        try {
            const response = await fetch('/api/tasks');
            const data = await response.json();
            setTask(data);
        } catch(error) {
            console.error('Error loading tasks: ', error);
        }
    };

    const handleDeleteTask = async (id) => {
        if (!window.confirm('Delete this task?')) {
            return;
        }

        try {
            const response = await fetch(`/api/tasks/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                const result = await response.json();
                alert('Error: ' + (result.error || 'Could not delete task'));
                return;
            }

            await loadTasks();
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    const handleEditTask = async (task) => {
        const updatedText = window.prompt('Edit task text:', task.text);

        if (updatedText === null) {
            return;
        }

        if (!updatedText.trim()) {
            alert('Task text cannot be empty');
            return;
        }

        try {
            const response = await fetch(`/api/tasks/${task.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: updatedText })
            });

            if (!response.ok) {
                const result = await response.json();
                alert('Error: ' + (result.error || 'Could not update task'));
                return;
            }

            await loadTasks();
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    useEffect(() => {
        loadTasks();
    }, []);

    return (
        <>
            <h1>Task Manager</h1>

            <nav>
                <a href="/">Home</a> |
                <a href="/add.html">Add Task</a> |
                <a href="/about.html">About</a>
            </nav>

            <h2>List of current tasks</h2>
            {tasks.length === 0 ? (
                <div id='task-list'>
                    <p>No tasks currently</p>
                </div>
            ) : (
            <ol>
            {tasks.map(task => {
                return (
                    <div key={task.id}>
                        <li style={{textAlign: 'left'}}>
                        {task.text}
                        <span style={{color: 'red'}}> Due: </span>
                        <CheckTime time={task.deadline}/>
                        <button onClick={() => handleEditTask(task)} style={{marginLeft: '12px'}}>Edit</button>
                        <button onClick={() => handleDeleteTask(task.id)} style={{marginLeft: '8px'}}>Delete</button>
                        </li>
                    </div>
                );
            })}
            </ol>
            )}
        </>
    )
};

export default DisplayTasks;
