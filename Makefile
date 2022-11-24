DOCKER_COMPOSE_CONF = docker-compose-dev.yml
DOCKER_USER = keikekke
APP_NAME = todo
GIT_SHA = $(shell git rev-parse HEAD)

dev:
	docker compose -f $(DOCKER_COMPOSE_CONF) --profile dev up --remove-orphans -d --build

down:
	docker compose -f $(DOCKER_COMPOSE_CONF) --profile all down

test:
	docker compose -f $(DOCKER_COMPOSE_CONF) --profile test up --remove-orphans -d --build

clean:
	docker compose -f $(DOCKER_COMPOSE_CONF) --profile all down --volumes

build:
	docker build -t $(DOCKER_USER)/$(APP_NAME)-api -t $(DOCKER_USER)/$(APP_NAME)-api:$(GIT_SHA) api; \
	docker push $(DOCKER_USER)/$(APP_NAME)-api; \
	docker push $(DOCKER_USER)/$(APP_NAME)-api:$(GIT_SHA); \
	docker build -t $(DOCKER_USER)/$(APP_NAME)-frontend -t $(DOCKER_USER)/$(APP_NAME)-frontend:$(GIT_SHA) frontend
	docker push $(DOCKER_USER)/$(APP_NAME)-frontend
	docker push $(DOCKER_USER)/$(APP_NAME)-frontend:$(GIT_SHA)

deploy:
	kubectl apply -f k8s
	kubectl set image deployment/api-deployment api=$(DOCKER_USER)/$(APP_NAME)-api:$(GIT_SHA)
	kubectl set image deployment/frontend-deployment frontend=$(DOCKER_USER)/$(APP_NAME)-frontend:$(GIT_SHA)
