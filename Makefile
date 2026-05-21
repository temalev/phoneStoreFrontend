SHELL := /bin/bash

# === Config ===
DOCKER_USER    := pavelg1307
PROD_IMAGE     := $(DOCKER_USER)/phonestorefront
ALPHA_IMAGE    := $(DOCKER_USER)/phonestorefrontalpha
PROD_BRANCH    := master
ALPHA_BRANCH   := dev

SSH_HOST       := ovz1.j30625302.zbedz.vps.myjino.ru
SSH_PORT       := 49279
SSH_USER       := root
SSH_COMMON     := -o ServerAliveInterval=30 -o ServerAliveCountMax=120
SSH            := ssh -p $(SSH_PORT) $(SSH_COMMON) $(SSH_USER)@$(SSH_HOST)
SCP            := scp -P $(SSH_PORT) $(SSH_COMMON)
COMPOSE_DIR    := /root

PROD_PORT      := 8000
ALPHA_PORT     := 7000

# Сервер на amd64; на ARM-машинах (M1/M2 Mac) docker build по умолчанию
# собирает arm64 — образ не запустится на сервере. Принудительно amd64.
PLATFORM       := linux/amd64

# === Help ===
.PHONY: help
help:
	@echo "Targets:"
	@echo "  make deploy        — собрать origin/$(PROD_BRANCH) локально, передать на сервер, перезапустить прод"
	@echo "  make deploy-alpha  — собрать origin/$(ALPHA_BRANCH) локально, передать на сервер, перезапустить альфу"
	@echo "  make build         — локальный docker build из текущего состояния"
	@echo "  make run           — локально запустить контейнер на :80"
	@echo "  make logs-prod     — tail логи прод-контейнера на сервере"
	@echo "  make logs-alpha    — tail логи альфа-контейнера на сервере"
	@echo "  make status        — проверка состояния прод/альфа"

# === Local build (existing) ===
.PHONY: build run
build:
	docker build -t $(PROD_IMAGE) .

run:
	docker run --rm -d -p 80:3000 --name phonestorefront $(PROD_IMAGE)

# === Prod deploy ===
# Стратегия: npm install + nuxt build выполняются локально (нативно для CPU
# хоста — на M-Mac arm64 это быстро). В Docker-образ копируется только
# готовая .output/ через Dockerfile.runtime, поэтому RUN-шагов нет и QEMU
# не задействуется. --platform linux/amd64 нужен только для тэгирования
# и подтягивания amd64-варианта базового node:18-alpine.
.PHONY: deploy
deploy: _fetch
	@COMMIT=$$(git rev-parse --short origin/$(PROD_BRANCH)) && \
	BUILD_DIR=$$(mktemp -d -t phsf-build-XXXXXX) && \
	TARBALL=/tmp/phonestorefront-$$COMMIT.tar.gz && \
	trap "git worktree remove --force $$BUILD_DIR >/dev/null 2>&1 || rm -rf $$BUILD_DIR" EXIT && \
	echo "==> Worktree origin/$(PROD_BRANCH) ($$COMMIT) → $$BUILD_DIR" && \
	git worktree add --detach $$BUILD_DIR origin/$(PROD_BRANCH) >/dev/null && \
	cp $(CURDIR)/Dockerfile.runtime $$BUILD_DIR/ && \
	cd $$BUILD_DIR && \
	echo "==> npm ci" && npm ci --no-audit --no-fund --silent && \
	echo "==> nuxt build (native)" && npm run build && \
	echo "==> docker build --platform $(PLATFORM) (no QEMU, only COPY)" && \
	docker build --platform $(PLATFORM) -f Dockerfile.runtime -t $(PROD_IMAGE):latest -t $(PROD_IMAGE):$$COMMIT . && \
	cd $(CURDIR) && \
	echo "==> docker save → $$TARBALL" && \
	docker save $(PROD_IMAGE):latest $(PROD_IMAGE):$$COMMIT | gzip > $$TARBALL && \
	echo "    size: $$(du -h $$TARBALL | cut -f1)" && \
	echo "==> SCP to $(SSH_HOST)" && \
	$(SCP) $$TARBALL $(SSH_USER)@$(SSH_HOST):/tmp/ && \
	echo "==> docker load + recreate on server" && \
	$(SSH) "docker load < $$TARBALL && rm $$TARBALL && cd $(COMPOSE_DIR) && docker compose -f docker-compose.prod.yml up -d --no-deps frontend" && \
	rm -f $$TARBALL && \
	echo "==> Health check" && sleep 3 && \
	$(SSH) 'curl -sI --max-time 10 http://127.0.0.1:$(PROD_PORT)/ | head -1' && \
	echo "✅ Прод задеплоен: $(PROD_IMAGE):$$COMMIT"

# === Alpha deploy ===
.PHONY: deploy-alpha
deploy-alpha: _fetch
	@COMMIT=$$(git rev-parse --short origin/$(ALPHA_BRANCH)) && \
	BUILD_DIR=$$(mktemp -d -t phsf-build-XXXXXX) && \
	TARBALL=/tmp/phonestorefrontalpha-$$COMMIT.tar.gz && \
	trap "git worktree remove --force $$BUILD_DIR >/dev/null 2>&1 || rm -rf $$BUILD_DIR" EXIT && \
	echo "==> Worktree origin/$(ALPHA_BRANCH) ($$COMMIT) → $$BUILD_DIR" && \
	git worktree add --detach $$BUILD_DIR origin/$(ALPHA_BRANCH) >/dev/null && \
	cp $(CURDIR)/Dockerfile.runtime $$BUILD_DIR/ && \
	cd $$BUILD_DIR && \
	echo "==> npm ci" && npm ci --no-audit --no-fund --silent && \
	echo "==> nuxt build (native)" && npm run build && \
	echo "==> docker build --platform $(PLATFORM) (no QEMU, only COPY)" && \
	docker build --platform $(PLATFORM) -f Dockerfile.runtime -t $(ALPHA_IMAGE):latest -t $(ALPHA_IMAGE):$$COMMIT . && \
	cd $(CURDIR) && \
	echo "==> docker save → $$TARBALL" && \
	docker save $(ALPHA_IMAGE):latest $(ALPHA_IMAGE):$$COMMIT | gzip > $$TARBALL && \
	echo "    size: $$(du -h $$TARBALL | cut -f1)" && \
	echo "==> SCP to $(SSH_HOST)" && \
	$(SCP) $$TARBALL $(SSH_USER)@$(SSH_HOST):/tmp/ && \
	echo "==> docker load + recreate on server" && \
	$(SSH) "docker load < $$TARBALL && rm $$TARBALL && cd $(COMPOSE_DIR) && docker compose -f docker-compose.alpha.yml up -d --no-deps frontendalpha" && \
	rm -f $$TARBALL && \
	echo "==> Health check" && sleep 3 && \
	$(SSH) 'curl -sI --max-time 10 http://127.0.0.1:$(ALPHA_PORT)/ | head -1' && \
	echo "✅ Альфа задеплоена: $(ALPHA_IMAGE):$$COMMIT"

# === Observability ===
.PHONY: logs-prod logs-alpha status
logs-prod:
	$(SSH) 'docker logs phonestorefront --tail 100 -f'

logs-alpha:
	$(SSH) 'docker logs phonestorefrontalpha --tail 100 -f'

status:
	@echo "=== Prod ==="
	@$(SSH) 'docker inspect phonestorefront --format "Image: {{.Image}}\nStatus: {{.State.Status}}\nStarted: {{.State.StartedAt}}"'
	@curl -sI --max-time 10 https://xn----jtbnc0ao.xn--p1ai/ | head -1
	@echo "=== Alpha ==="
	@$(SSH) 'docker inspect phonestorefrontalpha --format "Image: {{.Image}}\nStatus: {{.State.Status}}\nStarted: {{.State.StartedAt}}"'
	@curl -sI --max-time 10 https://alpha.xn----jtbnc0ao.xn--p1ai/ | head -1

# === Helpers ===
.PHONY: _fetch
_fetch:
	@echo "==> git fetch origin..."
	@git fetch origin --quiet
