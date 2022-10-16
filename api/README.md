# Todo RESTful API
Sign up and login are required before you can acccess resource-related APIs.  

# Testing APIs with `curl`
## Sign up
- `curl -XPOST -d '{"username":"user","password":"pass"}' -H "Content-Type: application/json" http://localhost:5001/signup`
    - This command issues a JSON POST request to `localhost:5001/signup`
    - The API server creates a user entry in Users database.
    - If there is an error (e.g., duplicate username), the error is returned as JSON.

## Log in (and receive a cookie)
- `curl -XPOST -c ./cookie -d '{"username":"user","password":"pass"}' -H "Content-Type: application/json" http://localhost:5001/login`
    - This command, if authentication succeeds, returns a cookie containing JWT and stores it in `./cookie`
    - With this cookie, the subseqent API requests to create/update/delete a task are permitted.

## Task-related APIs
- List tasks
    - `curl -b ./cookie http://localhost:5001/tasks`
- Create a new task
    - `curl -XPOST -b ./cookie -d '{"name":"New Task"}' -H "Content-Type: application/json" http://localhost:5001/tasks`
- Update an existing task
    - `curl -XPUT -b ./cookie -d '{"name":"New Task Name"}' -H "Content-Type: application/json" http://localhost:5001/tasks/:taskId`
        - Substitute `:taskId` with the real task id obtained from either `List tasks` or `Create a new task` results.
- Delete an existing task
    - `curl -XDELETE -b ./cookie http://localhost:5001/tasks/:taskId`
        - Substitute `:taskId` with the real task id obtained from either `List tasks` or `Create a new task` results.
