DOCKER_USER = ryojpn
APP_NAME = todo
GIT_SHA = $(shell git rev-parse HEAD)
DOCKER_COMPOSE = docker-compose

dev:
	$(DOCKER_COMPOSE) -f docker-compose-dev.yml --profile dev up --remove-orphans -d --build

down:
	$(DOCKER_COMPOSE) -f docker-compose-dev.yml --profile all down --timeout 2

test:
	$(DOCKER_COMPOSE) -f docker-compose-dev.yml --profile test up --remove-orphans -d --build

all:
	$(DOCKER_COMPOSE) -f docker-compose-dev.yml --profile all up --remove-orphans -d --build

test_single:
	$(DOCKER_COMPOSE) -f docker-compose-dev.yml --profile test -f docker-compose-test-single.yml up --remove-orphans -d --build
	$(DOCKER_COMPOSE) -f docker-compose-dev.yml exec -T frontend-test npm test -- --watchAll=false
	$(DOCKER_COMPOSE) -f docker-compose-dev.yml exec -T api-test npm test -- --watchAll=false
	$(DOCKER_COMPOSE) -f docker-compose-dev.yml --profile test -f docker-compose-test-single.yml down --timeout 2

clean:
	$(DOCKER_COMPOSE) -f docker-compose-dev.yml --profile all down --volumes

buildx:
	docker buildx build --push --platform=linux/amd64,linux/arm64 -t $(DOCKER_USER)/$(APP_NAME)-api -t $(DOCKER_USER)/$(APP_NAME)-api:$(GIT_SHA) api
	docker buildx build --push --platform=linux/amd64,linux/arm64 -t $(DOCKER_USER)/$(APP_NAME)-frontend -t $(DOCKER_USER)/$(APP_NAME)-frontend:$(GIT_SHA) frontend

build:
	docker build --push -t $(DOCKER_USER)/$(APP_NAME)-api -t $(DOCKER_USER)/$(APP_NAME)-api:$(GIT_SHA) api
	docker build --push  -t $(DOCKER_USER)/$(APP_NAME)-frontend -t $(DOCKER_USER)/$(APP_NAME)-frontend:$(GIT_SHA) frontend

deploy:
	kubectl apply -f k8s
	kubectl set image deployment/api-deployment api=$(DOCKER_USER)/$(APP_NAME)-api:$(GIT_SHA)
	kubectl set image deployment/frontend-deployment frontend=$(DOCKER_USER)/$(APP_NAME)-frontend:$(GIT_SHA)
