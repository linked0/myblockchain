# RESTful Web API with Node.js Framework

This project is to build a site having RESTful web APIs with Node.js framework that will interfaces with the private blockchain.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

The followings are prerequisites for running this application.

* Node.js: You can install nodejs with [Installing Node.js via package manager](https://nodejs.org/ko/download/package-manager/)

### Node.js RESTful framework
- [Hapi.js](https://hapijs.com/)

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

## Endpoint Description

Here are instructions for tesing the application.

### Address Validation Request
#### Endpoint
```
http://localhost:8000/requestValidation
```
#### Method
```
POST
```
#### Parameters
```
address: A bitcoin address
```
#### Request example using curl
```
curl -X POST http://localhost:8000/requestValidation \
    -H 'Content-Type:application/json' \
    -d '{"address":"1PXFZA9BSvGf244bPEhc1NWpezPtJejtGP"}'
```


### Message Validation

#### Endpoint
```
http://localhost:8000//message-signature/validate
```
#### Method
```
POST
```
#### Parameters
```
address: A bitcoin address
signature: A signed message by the electrum wallet
```
#### Request example using curl
```
curl -X POST http://localhost:8000/message-signature/validate \
    -H 'Content-Type: application/json' \
    -H 'cache-control: no-cache' \
    -d '{"address":"1PXFZA9BSvGf244bPEhc1NWpezPtJejtGP", "signature":"H57n5GinMvrhnVj1f+7LgS42+7lm6do8r0acSLMmirQoKIZmMO9ScQDk5hrRw7E18w9tO+qgLQJ0E9DWIo9ZKew="}'
```

### Block

#### Endpoint
```
http://localhost:8000/block
```
#### Method
```
POST
```
#### Parameters
```
address: A bitcoin address
star: Containing dec, ra and story (max 500 bytes)
```
#### Request example using curl
```
curl -X POST http://localhost:8000/block \
    -H 'Content-Type: application/json' \
    -d '{"address": "1PXFZA9BSvGf244bPEhc1NWpezPtJejtGP", "star": {"ra": "16h 29m 1.0s", "dec": "-26° 29'\'' 24.9", "story": "This my star"}}'
```

### Star Block by Hash

#### Endpoint
```
http://localhost:8000/stars/hash:[HASH]
```
#### Method
```
GET
```
#### Parameters
```
hash: The hash of the block to be requested
```
#### Request example using curl
```
curl -X GET http://localhost:8000/stars/hash:f3ac7a034d6169eab241e5c9e7bfc8293c98484493bfb577c5b125963a3b804a
```

### Star Block by Address

#### Endpoint
```
http://localhost:8000/stars/address:[ADDRESS]
```
#### Method
```
GET
```
#### Parameters
```
hash: The address of the block to be requested
```
#### Request example using curl
```
curl -X GET http://localhost:8000/stars/address:1PXFZA9BSvGf244bPEhc1NWpezPtJejtGP
```

### Star Block by Height

#### Endpoint
```
http://localhost:8000/block/[HEIGHT]
```
#### Method
```
GET
```
#### Parameters
```
height: The height of the block to be requested
```
#### Request example using curl
```
curl -X GET http://localhost:8000/block/1