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
            console.error('Error loading books: ', error);
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
            <h2>List of current tasks</h2>
            {tasks.map(task => {
                return (
                    <div key={task.id}>
                        {task.text}<br/>
                        <CheckTime time={task.time}/>
                    </div>
                );
            })}
        </>
    )
};

export default DisplayTasks;