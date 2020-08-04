import 'dotenv/config';
import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { App } from './app';
import { AuthenticationController } from './authentication/authentication.controller';
import * as config from './ormconfig';

(async () => {
  try {
    const connection = await createConnection(config);
    await connection.runMigrations();
  } catch (error) {
    console.log('Error connecting to the database', error);
    return error;
  }
  const app = new App([new AuthenticationController()]);
  app.listen();
})();
