# Todo RESTful API

Sign up and login are required before you can acccess resource-related APIs.

# Testing APIs with `curl`

## Sign up

- `curl -XPOST -H "Content-Type: application/json" -d '{"username":"user","password":"pass"}' http://localhost:4000/auth/signup`
  - This command issues a JSON POST request to `localhost:4000/signup`
  - The API server creates a user entry in Users database
  - If there is an error (e.g., duplicate username), the error is returned as JSON

## Log in (and receive a cookie)

- `curl -XPOST -H "Content-Type: application/json" -d '{"username":"user","password":"pass"}' http://localhost:4000/auth/login`
  - This command, if authentication succeeds, returns a cookie containing JWT and returns the `token`
  - With this token, the subseqent API requests to create/update/delete a task are permitted

## Task-related APIs

- List tasks
  - `curl -H "Authorization: Bearer {{your_token}}" -H "Content-Type: application/json" http://localhost:4000/tasks`
- Create a new task
  - `curl -XPOST -H "Authorization: Bearer {{your_token}}" -H "Content-Type: application/json" -d '{"name":"Do Exercise"}' http://localhost:4000/tasks`
- Update an existing task
  - `curl -XPUT -H "Authorization: Bearer {{your_token}}" -H "Content-Type: application/json" -d '{"name":"Learn Yoga"}' http://localhost:4000/tasks/:taskId`
    - Substitute `:taskId` with the real task id obtained from either `List tasks` or `Create a new task` results.
- Delete an existing task
  - `curl -XDELETE -H "Authorization: Bearer {{your_token}}" -H "Content-Type: application/json" http://localhost:4000/tasks/:taskId`
    - Substitute `:taskId` with the real task id obtained from either `List tasks` or `Create a new task` results.
