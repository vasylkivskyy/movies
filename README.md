# Movie Project
Welcome to the Movie Project!
## Prerequisites
To run this project locally, you need to have ***Node.js*** installed on your machine.
## Installation
To get started, clone this repository and install the dependencies:
```
git clone https://github.com/vasylkivskyy/movies.git

cd movies

npm install
```
## Usage
To start the server, run the following command:
```
node server
```
The server will start running on ***http://localhost:8050.***
## Endpoints
### Users
- **POST "/api/v1/users"** - create a new user
### Sessions
- **POST "/api/v1/sessions"** - create a new session
### Movies
- **POST "/api/v1/movies"** - create a new movie
- **GET "/api/v1/movies"** - get all movies with filters
- **GET "/api/v1/movies/:id"** - get a movie by ID
- **DELETE "/api/v1/movies/:id"** - delete a movie by ID
- **PATCH "/api/v1/movies/:id"** - update a movie by ID
- **POST "/api/v1/movies/import"** - import movies
### Import Movie
- **GET "/api/v1/send/file"** - HTML page to import a movie
# Docker
You can also run this project using Docker.
### Building the Docker image
To build the Docker image, run the following command:
```
docker build . -t your_super_account/movies
```
### Running the Docker container
To run the Docker container, run the following command:
```
docker run --name movies -p 8000:8050 -e APP_PORT=8050 your_super_account/movies
```
This command will start the container and expose port ***8000*** on your machine. You can access the application by navigating to http://localhost:8000 in your web browser.

If you want to send files through the HTML page, you need to change the port in the following ***form*** element in the ***index.html*** file:
```
<form
  action="http://localhost:8000/api/v1/movies/import"
  method="post"
  enctype="multipart/form-data"
>
```
Change the action attribute from ***http://localhost:8050/api/v1/movies/import*** to ***http://localhost:8000/api/v1/movies/import*** to match the exposed port.
### Contributing
If you'd like to contribute to this project, please fork the repository and submit a pull request.
