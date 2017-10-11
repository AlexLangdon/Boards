# Boards

A note-taking web app made with Angular 4, Express, SQL and Material design libraries. 
Frontend tested with Karma, Mocha and Chai.

#### Functionality:
-	Add tags and categorise notes into boards
-	Standard create, read, update, delete operations for notes, tags and boards
-	Apply a filter to only show notes that have a certain tag/board
-	Change note colours
-	Drag + drop notes
-	Material design styling

*Note - See the dev branch for unimplemented components such as notes with list items*

![Boards Screenshot](/boards1.jpg?raw=true "Boards Screenshot")

## Running locally

To run locally requires setting up and running the frontend, database and API servers as given below. It is recommended to have npm and Node version 8 installed beforehand.

### Frontend

1. Navigate to the `frontend` directory
2. Run `npm install` to install packages
3. Run `npm start` for the frontend dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Database

1. Ensure MySQL server version 5.7.19 or higher is installed
2. Import the `dbDump.sql` file containing the "boards" database into the local server instance
3. Run the SQL server on port 3300

### API

1. Navigate to the `api` directory
2. Run `npm install` to install packages
3. Adjust the SQL database password and any other parameters in `config/default.json`
4. Run `npm start` for the api server which will connect to the SQL database