# Group 35
- Overview: We are building a Task Manager web app, where users can view, add, and delete tasks. In the future this project can be extened further by adding user accounts and authentication (each user will have their own task list and that task list will be saved on the database). We will implement a persistent storage. It can also be expanded with more input validation and security protections.

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
    - Structure:
        - \pages
            - about.html
            - add.html
            - index.html
        - \public
            - app.js
            - style.css
        - server.js