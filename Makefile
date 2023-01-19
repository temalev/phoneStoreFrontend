build:
	docker build -t pavelg1307/phonestorefront .
run:
	docker run --rm -d -p 8080:8080 --name phonestorefront pavelg1307/phonestorefront