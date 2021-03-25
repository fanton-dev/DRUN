import moment from 'moment';
import {validate as uuidValidate} from 'uuid';
import buildValidator from './validator';

const validator = buildValidator({uuidValidate, moment});

export default validator;
