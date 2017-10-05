# Boards

A note taking web app made with Angular 4, Express, SQL and Material design libraries. Tested with Karma, Mocha and Chai.

## Running locally

To run locally requires setting up the frontend, database and API servers as given below. It is recommended to have npm and Node version 8 installed beforehand.

## Frontend

1. Navigate to the `frontend` directory
2. Run `npm install` to install packages
3. Run `npm start` for the frontend dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Database

1. Ensure MySQL server version 5.7.19 or higher is installed
2. Import the dbDump.sql file containing the "boards" database into the local server instance
3. Run the SQL server on port 3300

## API

1. Navigate to the `api` directory
2. Run `npm install` to install packages
3. Adjust the SQL database password and any other parameters in `config/default.json`
4. Run `npm start` for the api server which will connect to the SQL database