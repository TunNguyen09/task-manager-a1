import { useState, useEffect } from 'react';
import CheckTime from './CheckTime';

function DisplayTasks({ refreshTrigger }) {
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

    useEffect(() => {
        loadTasks();
    }, [refreshTrigger]);

    if(tasks.length === 0) {
        return (
            <>
                <h2>List of current tasks</h2>
                <div id='task-list'>
                    <p>No tasks currently</p>
                </div>
            </>
        );
    }

    return (
        <>
            <h1>Task Manager</h1>

            <nav>
                <a href="/">Home</a> |
                <a href="/add.html">Add Task</a> |
                <a href="/about.html">About</a>
            </nav>

            <h2>List of current tasks</h2>
            <ol>
            {tasks.map(task => {
                return (
                    <div key={task.id}>
                        <li style={{textAlign: 'left'}}>
                        {task.text}
                        <span style={{color: 'red'}}> Due: </span>
                        <CheckTime time={task.deadline}/>
                        </li>
                    </div>
                );
            })}
            </ol>
        </>
    )
};

export default DisplayTasks;