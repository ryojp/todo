# Todo App
A simple Todo app with React.js + Node.js + MongoDB.  
Demo is available at [https://todo.keikr.com](https://todo.keikr.com)  

## How to Run (Using Makefile)
Makefile provides shortcuts for development commands.
- `make` or `make up_build` to start a dev environment after building images.
- `make up` to start a dev environment *without* building images.
- `make down` to stop the dev environment.

After the dev environment starts up, the frontend client listens requests at `http://localhost:8080` and the API server accepts requests at `http://localhost:5001`.

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

## Deployment
### Using Docker-Compose
Once you have prepared environment variables used in `docker-compose-prod.yml` (through target service's VAR option or `.env` file), you are ready to start the production-ready server with `docker-compose -f docker-compose-prod.yml up --build`.  
Major differences from the dev version are:
- No bind mounts (because hot-reload is unnecessary in production).
- No test containers.

### Using Kubernetes
0. Build Docker images and push them to the Docker Hub (`make build` would do this).
1. Create MongoDB-related secret with: `kubectl create secret generic mongoinfo --from-env-file {env_file_name}`
2. Install NGINX Ingress Controller with `kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.3.1/deploy/static/provider/cloud/deploy.yaml`
    - Installation instruction is available [here](https://kubernetes.github.io/ingress-nginx/deploy/).
    - Some cloud platforms (such as [Okteto Cloud](https://www.okteto.com/)) have their own Ingress controller, so installation on such platforms is not required.
3. Apply Kubernetes configuration files with: `kubectl apply -f k8s/`.

#### Deployment on [Okteto Cloud](https://www.okteto.com/)
Step-by-step instructions are as follows.
- Install Okteto CLI (see [here](https://www.okteto.com/docs/getting-started/)).
- Select the proper okteto context: `okteto context use https://cloud.okteto.com --namespace {{namespace_name}}`.
- Download Kubernetes credentials (see [here](https://www.okteto.com/docs/cloud/credentials/)) and store it to `~/.kube/config`.
- Export `KUBECONFIG` variable: `export KUBECONFIG=$HOME/okteto-kube.config:${KUBECONFIG:-$HOME/.kube/config}`.
- Run `okteto kubeconfig`.
    - This allows you to use your `kubectl` command in your terminal to manipulate k8s on Okteto.
- Create MongoDB-related secret with: `kubectl create secret generic mongoinfo --from-env-file {env_file_name}`.
- Run `okteto deploy`.
