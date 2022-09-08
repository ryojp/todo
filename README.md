# Todo App
A simple Todo app with React.js + Express.js + MongoDB.  

## How to Run (Using Makefile)
Makefile provides shortcuts for development commands.
- `make` or `make up_build` to start a dev environment after building images.
- `make up` to start a dev environment *without* building images.
- `make down` to stop the dev environment.

## Development
For VSCode users, Remote Containers extension is very useful especially when you add packages through `npm install`.
It also provides autocompletion inside the container, if an extension is installed.
For this, `.devcontainer/` directory contains a set of example configurations you might use.
After you remove the `.example` extension (and make some changes as you want), you will hopefully be able to select `Reopen in Container` option from the command palette.  
It automatically starts the containers using `docker-compose-dev.yml`.
