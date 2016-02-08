run:
	npm run-script start-dev

test:
	npm run-script test-inf

build:
	docker build -t "ksjogo/ontoaut" .

publish: build
	docker push "ksjogo/ontoaut"
