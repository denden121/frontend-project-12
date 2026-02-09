.PHONY: build start

build:
	cd frontend && npm run build

start:
	npx start-server -s ./frontend/dist
