# Project Management System API

## Prerequisites

-   Node.js: Ensure that Node.js is installed on your machine. You can download it from [here](https://nodejs.org).

## Install Project Dependency Packages

```
npm install
```

## Configuration

create server_config.json file in root directory and save it. Inside that file, add the desired configuration values in the format KEY:VALUE.

-   Configuration Options

    | Configuration Key | Description                          |
    | ----------------- | ------------------------------------ |
    | PORT              | The port number on which project run |

## Compile Project

Once you are in the project's root directory, you can use the tsc command with the --watch flag to enable automatic recompilation when changes are detected. Run the following command

```
tsc --watch

```

## Run Project

-   on local machine run during development

    ```
    nodemon dist/src/main.js
    ```

-   on server after development

    ```
    node src/main.js
    ```
