IMAGE_NAME=frontend-app

CONTAINER_NAME=frontend-app-container

PORT=3000

build:
	docker build -t $(IMAGE_NAME) .

run:
	docker run -d -p 8080:80 --name $(CONTAINER_NAME) $(IMAGE_NAME)

stop:
	docker stop $(CONTAINER_NAME)
	docker rm $(CONTAINER_NAME)

clean:
	docker rmi $(IMAGE_NAME)
