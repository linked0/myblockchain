# RESTful Web API with Node.js Framework

This project is to build a site having RESTful web APIs with Node.js framework that will interfaces with the private blockchain.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

The followings are prerequisites for running this application.

* Node.js: You can install nodejs with [Installing Node.js via package manager](https://nodejs.org/ko/download/package-manager/)

### Getting source files from the github
```
git clone https://github.com/linked0/myblockchain.git
```

### Running the application

Use NPM to install project dependencies and run the application.

```
cd t1-project-3
npm install
node index.js
```

## Running the tests

Here are instructions for tesing the application.

### GET Block Endpoint

```
GET /block/:BLOCK_HEIGHT
```
Request example using curl
```
curl http://localhost:8999/block/10
```
Response example
```
{"hash":"4945e8ce8e05bde9ee67b8fde8c72276844c8f0c1615159ecf27b8d10dbd6646","height":10,"body":"Hyunjae","time":"1537362294","previousBlockHash":"353d0d9d7a1c8d2351a735a21c0a073db96afcf5f9891166311a578135e4fcd9"}
```

### POST Block Endpoint
```
POST /block
```
Request example using curl
```
curl -X POST -H "Content-Type: application/json" -d '{"body": "New Test Block 27th September"}' http://localhost:8999/block
```
Response example
```
{"hash":"6e6d93240594aaa976afe5eee53592d81945fe9ab90f8e68019c25044d3fd1c5","height":42,"body":"New Test Block 27th September","time":"1538052971","previousBlockHash":"0507e3a617519326ebec72f7965dcdd2ec8d9c266c4b6454c7528e7943192c2d"}
```