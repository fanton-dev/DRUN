import {v4 as uuidv4} from 'uuid';
import buildCreatePayment from './payment';
import validator from '../validator';

const createPayment = buildCreatePayment(validator, uuidv4);

export default createPayment;
