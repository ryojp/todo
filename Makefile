DOCKER_COMPOSE_CONF = docker-compose-dev.yml

up_build:
	docker-compose -f $(DOCKER_COMPOSE_CONF) up -d --build

up:
	docker-compose -f $(DOCKER_COMPOSE_CONF) up -d

down:
	docker-compose -f $(DOCKER_COMPOSE_CONF) down
