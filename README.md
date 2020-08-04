# Simple API

## You'll need Node.js v14.7.0 and Docker

## tested on macOS

### first, create a .env file with content from .env.sample

## endpoints

### /auth/register

fullName: string;

email: string;

password: string;

### /auth/login:

password: string;
email: string;

### /documents

with auth cookie ex:
Authorization=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywiaWF0IjoxNTk2NTQ1MzUyLCJleHAiOjE1OTY1NDg5NTJ9.1kpdh9qWkkCsBvv8RVnuOCFIRSiZcN57rQaTbbczCu0; Path=/; Domain=localhost; Expires=Wed, 04 Aug 2021 12:47:14 GMT;

birthdate: string;

cpf: string;

rg: string;

To serve locally

```
npm install
docker-compose up -d
npm start
```

to run unit tests

```
npm install
npm test
```
