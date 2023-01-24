# Dockerized Todo App with CI/CD

A simple Todo app with React + Node.js + MongoDB written in TypeScript.  
The frontend, the api server, and the database are all dockerized, and they are combined using Docker-Compose or Kubernetes.  
This repository also hosts configuration files for GitHub Actions such as

- run `npm test` for pull-requests
- create a preview page in Okteto Cloud
- deploy the stable code in `main` branch on merging pull-requests

## How to Run (using Makefile)

Makefile provides shortcuts for development commands.

- `make` to start a dev environment after building images
- `make down` to stop the dev environment
- `make test` to create test containers with hot-reload
- `make test_single` to run tests and quit (useful for continuous integration)

After the dev environment starts up, the frontend client listens requests at `http://localhost:3000` and the API server accepts requests at `http://localhost:4000`.

## Deployment

### Using Docker-Compose

After copying `.env.dev` to `.env.prod` and modifying the content, you can start the production-ready server with `docker compose -f docker-compose-prod.yml --env-file .env.prod up --build`
To stop the server, run `docker compose -f docker-compose-prod.yml down`

Alternatively, if you name your environment file as `.env`, you can omit `--env-file .env` as this is the default filename docker expects.

One pitfall is that the docker volume for MongoDB (`mongo_data`) is shared between `docker-compose-dev.yml` and `docker-compose-prod.yml`.  
So, if you have run `make` to start up the develpment environment before, you have to set the same DB environments as before to connect to the MongoDB.  
Or, if you are okay to re-create the volume, run `make clean` to clean up the volume and run `docker compose -f docker-compose-prod.yml --env-file .env.prod up --build` to start up the production server.  
Likewise, if you want to delete the MongoDB volume when you stop the production server, run `docker compose -f docker-compose-prod.yml down --volumes`

### Using Kubernetes

0. Build Docker images and push them to the Docker Hub (`make build` would do this).
1. Create MongoDB-related secret with: `kubectl create secret generic mongoinfo --from-env-file {env_file_name}`
   - For an example env file, see `.env.dev` file.
2. Install NGINX Ingress Controller with `kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.3.1/deploy/static/provider/cloud/deploy.yaml`
   - Installation instruction is available [here](https://kubernetes.github.io/ingress-nginx/deploy/).
   - Some cloud platforms (such as [Okteto Cloud](https://www.okteto.com/)) have their own Ingress controller, so installation on such platforms is not required.
3. Apply Kubernetes configuration files with: `kubectl apply -f k8s/`.

#### Deployment onto [Okteto Cloud](https://www.okteto.com/)

Step-by-step instructions are as follows.

- Install Okteto CLI (see [here](https://www.okteto.com/docs/getting-started/)).
- Select the proper okteto context: `okteto context use https://cloud.okteto.com --namespace {{namespace_name}}`.
- Download Kubernetes credentials (see [here](https://www.okteto.com/docs/cloud/credentials/)) and store it to `~/.kube/config`.
- Export `KUBECONFIG` variable: `export KUBECONFIG=$HOME/okteto-kube.config:${KUBECONFIG:-$HOME/.kube/config}`.
- Run `okteto kubeconfig`.
  - This allows you to use your `kubectl` command in your terminal to manipulate k8s on Okteto.
- Create MongoDB-related secret with: `kubectl create secret generic mongoinfo --from-env-file {env_file_name}`.
  - For an example env file, see `.env.dev` file.
- Run `okteto deploy`.
