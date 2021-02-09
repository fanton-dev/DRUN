import {v4 as uuidv4} from 'uuid';
import buildMakeUser from './user';
import validator from '../../../../core/entities/validator';

const makeUser = buildMakeUser({
  validator: validator,
  generateIdentifier: uuidv4,
});

export default makeUser;
