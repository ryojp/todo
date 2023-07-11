# Dockerized Todo App with CI/CD

A simple Todo app with React + Node.js + MongoDB written in TypeScript.  
The frontend, the api server, and the database are all dockerized, and they are combined using Docker-Compose or Kubernetes.  
This repository also hosts configuration files for GitHub Actions such as

- run `npm test` for pull-requests
- create a preview page in Okteto Cloud
- deploy the stable code in `main` branch on merging pull-requests

## How to run (using Makefile)

Makefile provides shortcuts for development commands.

- `make` to start a dev environment after building images
- `make down` to stop the dev environment
- `make test` to create test containers with hot-reload
- `make test_single` to run tests and quit (useful for continuous integration)

After the dev environment starts up, the frontend client listens requests at `http://localhost:3000` and the API server accepts requests at `http://localhost:4000`.


## Production Deployment

### Option 1: Docker-Compose

#### Starting
```sh
cp .env.dev .env.prod
vim .env.prod  # set secure passwords
docker compose -f docker-compose-prod.yml --env-file .env.prod up --build
```

After this, please visit https://localhost (self-signed certificate is created by `docker-compose-prod.yml`, so don't be surprised if prompted a certificate warning)

#### Stopping
```sh
docker compose -f docker-compose-prod.yml down
```


### Option 2: Kubernetes

1. Create MongoDB-related secret:
   ```sh
   cp .env.dev .env
   vim .env  # set secure passwords
   kubectl create ns todo
   kubectl -n todo create secret generic todosecret --from-env-file .env
   ```

2. Install NGINX Ingress Controller
   ```sh
   helm upgrade --install ingress-nginx ingress-nginx --repo https://kubernetes.github.io/ingress-nginx --namespace ingress-nginx --create-namespace
   ```

3. Apply Kubernetes configuration files:
   ```sh
   kubectl apply -f k8s/
   ```

4. Visit [https://localhost](https://localhost) and you will be redirected to the login page if success.

5. Cleanup:
   ```sh
   kubectl delete ns todo
   ```


## Load Testing
You can use [k6](https://github.com/grafana/k6) to test loads.  
The official installation manual is [here](https://github.com/grafana/k6#install)

After installation, please visit https://localhost and create a new user with username `loadtester` with the password of your choice.

Examples:
- GET /
```sh
k6 run --insecure-skip-tls-verify --vus
 100 --duration 2s -e BASE_URL=https://localhost -e SLEEP=0.1 k6/test.js
```
- POST /api/auth/login
```sh
k6 run --insecure-skip-tls-verify --vus
 100 --duration 2s -e BASE_URL=https://localhost -e TODOPASS=Pass0 -
e MODE=login -e SLEEP=0.5 k6/test.js
```


## Chore
### How to update packages

1. Start the containers
  ```sh
  make
  ```

2. Get inside `nodejs` container
  ```sh
  docker compose -f docker-compose-dev.yml exec -it nodejs sh
  ```

3. Update `package.json`
  ```sh
  npx npm-check-updates -u
  ```

4. Update `package-lock.json`
  ```sh
  npm i
  ```

5. Exit from `nodejs` container and run tests
  ```sh
  make down
  make test_single
  ```
