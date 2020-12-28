import {validate as uuidValidate} from 'uuid';
import moment from 'moment';
import buildValidator from './validator';

const validator = buildValidator(uuidValidate, moment);

export default validator;
