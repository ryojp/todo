DOCKER_COMPOSE_CONF = docker-compose-dev.yml
ENV = .env.dev

up_build:
	docker-compose -f $(DOCKER_COMPOSE_CONF) --env-file $(ENV) up -d --build

up:
	docker-compose -f $(DOCKER_COMPOSE_CONF) --env-file $(ENV) up -d

down:
	docker-compose -f $(DOCKER_COMPOSE_CONF) --env-file $(ENV) down
