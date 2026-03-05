import '../App.css';

function AddTask() {

    return(
        <>
            <h1>Add a Task</h1>

            <nav>
                <a href="/">Home</a> |
                <a href="/add">Add Task</a> |
                <a href="/about">About</a>
            </nav>

            <form id="task-form">
                <label htmlFor="task-input">Task:</label><br/>
                <input type="text" id="task-input" required/>
                <label htmlFor="task-date">When is it due?</label>
                <input type="date" id="task-date" required/>
                <br/><br/>
                <button type="submit">Add Task</button>
            </form>

            <p id="message"></p>
        
        </>
    );
}

export default AddTask;