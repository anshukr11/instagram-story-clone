# News Aggregator Docker Setup

Welcome to the News Aggregator project! This project is a web application that aggregates news articles from various sources and displays them in a clean, easy-to-read format.

## Running the Application with Docker

To run the application using Docker, follow these steps:

1. Pull the Docker image from Docker Hub:

   ```bash
   docker pull devanshu11/news-aggregator
2. Run a Docker container based on the pulled image:
   ```bash
    docker run -d -p 8080:3000 your-username/news-aggregator
  This command runs the Docker container in detached mode (-d), exposing port 3000 of the container to port 8080 on your local machine (-p 8080:3000). Adjust the port mapping as needed.

3. Open your web browser and navigate to http://localhost:8080 to view the application.
   


