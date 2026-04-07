# Group 35
- Overview: We are building a Task Manager web app, where users can view, add, and delete tasks. Not only that user can adjust their due date for the task too. In the future this project can be extened further by adding user accounts and authentication (each user will have their own task list and that task list will be saved on the database). We will implement a  richer task features such as **priorities, categories/tags, search/filter/sort**. It can also be expanded with more input validation and security protections, improving the UI with responsive design.

- Documentation:
    - Functions:
        - View tasks and display when task is due
        - Add tasks
        - Edit tasks and deadline
        - Delete tasks, with error prevention
        - Search tasks
        - Log in/Register with authentication
        - Real-time communication through theme change (dark/light mode)
    - How to run:
        - Start server in the back end folder with npm run start
        - Go to http://localhost:8080
        - Start react in front end server with npm run dev
        - It will start at http://locoalhost:5173
        - App.jsx should be displayed with an Example task
        - Home page, Add task, and About page can be reached from the top navagation bar
        - Tasks can be edited and deleted using the buttons

- Reflection: For this assignment, we built a multi-page *Task Manager* web application using Node.js, Express, MongoDB as our back end and React+Vite as our front end. The app allows users to view tasks, add new tasks, and delete tasks. The data is stored on the database MongoDB, and the frontend communicates with the server using GET, POST, and DELETE requests. One of the main successes of this project was getting the client and server to communicate correctly using the REST API. It was satisfying to see tasks update in real time when they were added or deleted. We also successfully created multiple pages and connected them with react router, which helped us understand how routing works. One challenge we faced was making sure all parts of the application worked together smoothly, especially connecting the MongoDB database to store our data. Debugging small issues like incorrect routes or request handling as well as styling pages took some time, but it helped us better understand how web applications function. Overall, this project helped us learn how the client-server model works and gave us practical experience building a simple web application using MERN tech stack.
