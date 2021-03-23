import config from 'config';
import {createConnection, getRepository} from 'typeorm';
import User from './entities/user';

export const initConnection = async () => {
  return await createConnection({
    entities: [User],
    type: 'postgres',
    host: <string> config.get('POSTGRES_HOST_USERS_SERVICE'),
    username: <string> config.get('POSTGRES_USER'),
    password: <string> config.get('POSTGRES_PASSWORD'),
    database: <string> config.get('POSTGRES_DB'),
  });
};

export const getUsersRepository = () => getRepository(User);

const database = Object.freeze({
  getUsersRepository,
});

export default database;
