# ![Langtrace](./images/banner-light.png#gh-light-mode-only) ![Langtrace](./images/banner-dark.png#gh-dark-mode-only)

<div align="center">

![GitHub License](https://img.shields.io/github/license/CapgeminiInventUK/langtrace?style=flat-square)

</div>
<div align="center">
   <div>
      <a href="https://github.com/CapgeminiInventUK/langtrace/issues/new?labels=bug">
         <strong>Report Bug</strong>
      </a> ·
      <a href="https://github.com/CapgeminiInventUK/langtrace/discussions/new?category=ideas">
         <strong>Ideas</strong>
      </a> ·
      <a href="https://discord.gg/VH95CUQHqH">
         <strong>Discord</strong>
      </a> 
   </div>
</div>

## Contents
- [Overview](#overview)
- [Current Features](#current-features)
- [Running Modes](#running-modes)
- [Setup MongoDB Atlas](#setup-mongodb-atlas)
- [Running Services](#running-services)
- [Running Services (development)](#running-services-development)

## Overview

Langtrace is an LLM tracing tool that consumes the data from Langchain and saves the data to
MongoDB allowing for easy querying and visualization of the data through either the UI or MongoDB
Atlas Charts.

It is built using Next.js, Node.js 20, Typescript and MongoDB Atlas.

## Current Features

- Ingests trace data from Langchain/Langsmith
- Handles feedback creation and updating
- UI to view trace data
- UI authentication providers (Github, Microsoft AD)
- MongoDB Trigger to add token usage data to the trace data

### Limitations

- Assumes all project names set in LANGCHAIN_PROJECT are URL safe, as they are used in the URL
    - No need to register projects, they are automatically created when data is ingested
- No API key required for ingestion or querying

## Running Modes

Langtrace can be run in two modes: [Full Mode](#full-mode) and [Headless Mode](#headless-mode). Full mode runs the UI 
and APIs together.

Headless mode runs the ingestion api only

### Full Mode

This will start 3 services:

- UI
- Langtrace API (backend for the UI)
- Ingest Server

![](./images/full-mode.png)

### Headless Mode

This will start 1 service:

- Ingest Server

It's assumed to view data you will use MongoDB Atlas Charts

![](./images/headless-mode.png)

## Setup MongoDB Atlas

- [Create/Provision cluster in MongoDB Atlas](#createprovision-cluster-in-mongodb-atlas)
- [Setup Functions for automated token usage data](#setup-functions-for-automated-token-usage-data)

### Create/Provision cluster in MongoDB Atlas

- Create/Provision cluster in [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Create a database in the cluster and set LANGTRACE_MONGODB_DB_NAME to the name of the database
  in the .env file in /server. Example langtrace
- Create a collection in the database and set LANGTRACE_TRACES_MONGODB_COLLECTION_NAME to the name
  of the collection
  in the .env file in /server. Example traces
- Create a readWrite user for the trace collection and setup a connection string for that user on
  LANGTRACE_INGEST_MONGODB_URI
- Create a readOnly user for the trace collection and setup a connection string for that user on
  LANGTRACE_API_MONGODB_URI

### Setup Functions for automated token usage data

> MongoDB Atlas required for this feature. If you are using MongoDB outside of Atlas you will
> need to handle the updates seperately.

Example of a function to add token usage data to the trace data in ./functions/token-usage.js

Create a trigger in MongoDB Atlas to run the function on the traces collection (
LANGTRACE_TRACES_MONGODB_COLLECTION_NAME)

- In the MongoDB Atlas UI, navigate to Triggers
- Create a new trigger
- Select the cluster and database
- Select the collection
- Set Operation Type to Insert and Update
- In advanced settings set the following:
    - Match Expression:
    ```json
    {
      "fullDocument.run_type": "llm",
      "fullDocument.end_time": {
        "$exists": true,
        "$ne": null
      },
      "fullDocument.extra.tokens": {
        "$exists": false
      },
      "fullDocument.outputs.generations": {
        "$exists": true,
        "$ne": null
      },
      "fullDocument.inputs.messages": {
        "$exists": true,
        "$ne": null
      }
    }   
    ```

    - Project Expression:
    ```json
    {
      "fullDocument.end_time": 1,
      "fullDocument.run_type": 1,
      "fullDocument.outputs.generations": 1,
      "fullDocument.extra.invocation_params.model": 1,
      "fullDocument.inputs.messages": 1,
      "ns.coll": 1,
      "documentKey._id": 1,
      "operationType": 1
    }
    ```
- Got to function and select the function you created and paste the code from the function file
  ./functions/token-usage.js

## Running Services

- [Prerequisites](#prerequisites)
- [Configuration](#configuration)
- [Running via Docker](#running-via-docker)

### Prerequisites

- MongoDB (some features like token usage currently depends on MongoDB Atlas)
  see [Setup MongoDB](#setup-mongodb-atlas)
- Langchain application (see [Langchain Configuration](#langchain-configuration))
- Docker & Docker Compose

### Configuration

- In ./ui copy .env.example to .env and set the values
- In ./server copy .env.example to .env and set the values

#### Langchain Configuration

> Note: Langtrace is currently configured to use the `langsmith-sdk`.

- Add Langsmith dependency to your Langchain app
    - `pip install langsmith` or `npm i langsmith`
- Add the following VARs to your Langchain app
    - `LANGCHAIN_TRACING_V2` - set to `true`
    - `LANGCHAIN_ENDPOINT` - the URL of your Langtrace API
    - `LANGCHAIN_PROJECT` - the name of your project

### Running via Docker

#### Options

- [Full Mode](#docker-compose---full-mode)
- [Headless Mode](#docker-compose---headless-mode)

##### Docker Compose - Full Mode

```bash
docker-compose up --build -f docker-compose.full.yml
```

##### Docker Compose - Headless Mode

```bash
docker-compose up --build -f docker-compose.headless.yml
```

## Running Services (development)

- [Prerequisites](#development-prerequisites)
- [Configuration](#development-configuration)
- [Running the UI](#running-the-ui)
- [Running the Services](#running-the-services)

### Development Prerequisites

- Node.js (tested on 20)
- MongoDB (some features like token usage currently depends on MongoDB Atlas)
  see [Setup MongoDB](#setup-mongodb-atlas)
- Langchain application (see [Langchain Configuration](#langchain-configuration))

### Development Configuration

- In ./ui copy .env.example to .env and set the values
- In ./server copy .env.example to .env and set the values

### Running the UI

Navigate to the UI service directory:

```bash
cd ui
```

Install the dependencies:

```bash
npm install
```

Start the service:

```bash
npm start
```

### Running the Services

Both servers are within the `server` directory. You will need to start both servers in order to run
the application. There are two entry points for the servers.

```bash
cd server
```

Install the dependencies:

```bash
npm install
```

##### Ingest Server

Make sure you have navigated to the folder and installed the dependencies as described above.

Start server:

```bash
npm run start:ingestor
```

##### Langtrace API

Make sure you have navigated to the folder and installed the dependencies as described above.

Start server:

```bash
npm run start:langtrace

```

