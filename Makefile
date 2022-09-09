DOCKER_COMPOSE_CONF = docker-compose-dev.yml
DOCKER_USER = keikekke
APP_NAME = todo
GIT_SHA = `git rev-parse HEAD`

up_build:
	docker-compose -f $(DOCKER_COMPOSE_CONF) up -d --build

up:
	docker-compose -f $(DOCKER_COMPOSE_CONF) up -d

down:
	docker-compose -f $(DOCKER_COMPOSE_CONF) down

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
