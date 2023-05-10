build-web:
	cd web && npm i && npm run build

build-api:
	cd api && npm i

deploy: build-web build-api
	firebase deploy

start-web:
	cd web && npm start