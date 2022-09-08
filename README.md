# Todo App
A simple Todo app with React.js + Express.js + MongoDB.  

## How to Run (Using Makefile)
Makefile provides shortcuts for development commands.
- `make` or `make up_build` to start a dev environment after building images.
- `make up` to start a dev environment *without* building images.
- `make down` to stop the dev environment.

After the dev environment starts up, the frontend client listens requests at `http://localhost` (port 80) and the API server accepts requests on port 5000.

## Development using VSCode Remote Containers Extension
For VSCode users, Remote Containers extension is very useful.
It provides full VSCode features (e.g., autocompletion) inside the container as it normally does.
For this, `.devcontainer/` directory contains a set of example configurations you might use.
After you copy the files in that directory (and remove `.example` extension) and make some changes as you want, you will hopefully be able to select `Reopen in Container` option from the command palette.  
It automatically starts the containers using `docker-compose-dev.yml` and sets up a bind mounting for the project root folder in `/workspace` inside the container.

To enable autocompletion for the installed npm packages, you need to open the container's folder.
Example files `.devcontainer/devcontainer.json.example` and `.devcontainer/docker-compose.yml.example` assume you do your work inside the `frontend` container, so after `Reopen in Container` you can `Open Folder` and select `/frontend` directory.
This is because `/frontend` directory is where all the source codes are placed (and bind-mounted) in `frontend/Dockerfile.dev`.

Other containers can be used similarly.
For example, to work on `api` container, you need to replace `frontend` with `api` in files in `.devcontainer/` and then `Open Folder` to select `/api` directory.

## Production
### Using Docker-Compose
Once you have prepared environment variables used in `docker-compose.yml` (through target service's VAR option or `.env` file), you are ready to start the production-ready server with `docker-compose up --build`.  
Major differences from the dev version are:
- No bind mounts (because hot-reload is unnecessary in production).
- No `frontend-test` container.
