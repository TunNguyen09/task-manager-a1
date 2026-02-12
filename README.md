# Group 35
- Overview: We are building a Task Manager web app, where users can view, add, and delete tasks. In the future this project can be extened further by adding user accounts and authentication (each user will have their own task list and that task list will be saved on the database). We will implement a persistent storage lie MongoDB/MySQL, and richer task features such as **due dates, priorities, categories/tags, search/filter/sort**. It can also be expanded with more input validation and security protections, improving the UI with responsive design.

- Documentation:
    - Functions:
        - View tasks
        - Add tasks
        - Edit tasks
        - Delete tasks, with error prevention
    - How to run:
        - Start server with npm start
        - Go to http://localhost:3000
        - index.html page should be displayed with an Example task
        - Home page, Add task, and About page can be reached from the top navagation bar
        - Tasks can be edited and deleted using the buttons

- Reflection:
For this assignment, we built a multi-page *Task Manager* web application using Node.js and Express. The app allows users to view tasks, add new tasks, and delete tasks. The data is stored on the server using a JSON object, and the frontend communicates with the server using GET, POST, and DELETE requests.

One of the main successes of this project was getting the client and server to communicate correctly using the REST API. It was satisfying to see tasks update in real time when they were added or deleted. We also successfully created multiple pages and connected them with navigation, which helped us understand how routing works in Express.

One challenge we faced was making sure all parts of the application worked together smoothly, especially connecting the frontend JavaScript to the backend API. Debugging small issues like incorrect routes or request handling took some time, but it helped us better understand how web applications function.

Overall, this project helped us learn how the client-server model works and gave us practical experience building a simple web application from scratch.
