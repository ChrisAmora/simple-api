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
