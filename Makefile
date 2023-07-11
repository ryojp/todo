DOCKER_USER = ryojpn
APP_NAME = todo
GIT_SHA = $(shell git rev-parse HEAD)
DOCKER_COMPOSE = docker compose

dev:
	$(DOCKER_COMPOSE) -f docker-compose-dev.yml up --remove-orphans -d --build

down:
	$(DOCKER_COMPOSE) -f docker-compose-dev.yml down --timeout 2

test:
	$(DOCKER_COMPOSE) -f docker-compose-dev.yml -f docker-compose-test.yml up --remove-orphans -d --build
	@echo ""
	@echo "Test containers with hot-reload created!"
	@echo "Run:"
	@echo "  docker compose -f docker-compose-dev.yml logs -f frontend"
	@echo "  docker compose -f docker-compose-dev.yml logs -f nodejs"

test_single:
	$(DOCKER_COMPOSE) -f docker-compose-dev.yml -f docker-compose-test-single.yml up --remove-orphans -d --build
	$(DOCKER_COMPOSE) -f docker-compose-dev.yml exec -T frontend npm test -- --watchAll=false
	$(DOCKER_COMPOSE) -f docker-compose-dev.yml exec -T nodejs npm test -- --watchAll=false
	$(DOCKER_COMPOSE) -f docker-compose-dev.yml -f docker-compose-test-single.yml down --timeout 2

clean:
	$(DOCKER_COMPOSE) -f docker-compose-dev.yml down --volumes
	$(DOCKER_COMPOSE) -f docker-compose-dev.yml -f docker-compose-test.yml down --volumes

buildx:
	docker buildx build --push --platform=linux/amd64,linux/arm64 -t $(DOCKER_USER)/$(APP_NAME)-api -t $(DOCKER_USER)/$(APP_NAME)-api:$(GIT_SHA) backend/nodejs
	docker build --push --target todo-frontend-builder -t $(DOCKER_USER)/$(APP_NAME)-frontend-builder -t $(DOCKER_USER)/$(APP_NAME)-frontend-builder:$(GIT_SHA) frontend/
	docker buildx build --push --target production --platform=linux/amd64,linux/arm64 -t $(DOCKER_USER)/$(APP_NAME)-frontend -t $(DOCKER_USER)/$(APP_NAME)-frontend:$(GIT_SHA) frontend

build:
	docker build --push -t $(DOCKER_USER)/$(APP_NAME)-api -t $(DOCKER_USER)/$(APP_NAME)-api:$(GIT_SHA) backend/nodejs
	docker build --push  -t $(DOCKER_USER)/$(APP_NAME)-frontend -t $(DOCKER_USER)/$(APP_NAME)-frontend:$(GIT_SHA) frontend

deploy:
	kubectl apply -f k8s
	kubectl set image deployment/api-deployment api=$(DOCKER_USER)/$(APP_NAME)-api:$(GIT_SHA)
	kubectl set image deployment/frontend-deployment frontend=$(DOCKER_USER)/$(APP_NAME)-frontend:$(GIT_SHA)
