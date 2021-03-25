import validator from '@core/validator';
import crypto from 'crypto';
import {v4 as uuidv4} from 'uuid';
import buildMakeUser from './user';

const makeUser = buildMakeUser({
  validator: validator,
  generateIdentifier: uuidv4,
  generateToken: () => crypto.randomBytes(64).toString('hex'),
});

export default makeUser;
