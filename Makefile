build:
	docker build -t pavelg1307/phonestorefront .
run:
	docker run --rm -d -p 80:3000 --name phonestorefront pavelg1307/phonestorefront