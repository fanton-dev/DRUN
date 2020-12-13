import {v4 as uuidv4} from 'uuid';
import buildValidator from './validator';

const validator = buildValidator(uuidv4);

export default validator;
