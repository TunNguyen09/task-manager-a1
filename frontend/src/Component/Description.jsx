import { useState } from 'react';
import '../App.css';

function Desc() {

    return(
        <>
        <h1>About This App</h1>

        <nav>
        <a href="/">Home</a> |
        <a href="/add">Add Task</a> |
        <a href="/about">About</a>
        </nav>

        <p>
        This is a simple Task Manager web app built for our CPS 630 assignment. 
        It allows users to view tasks, add new ones, and delete tasks from the list.
        </p>  
        
        </>
    );
}

export default Desc;