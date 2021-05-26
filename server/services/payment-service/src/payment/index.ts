import validator from '@core/validator';
import {v4 as uuidv4} from 'uuid';
import buildPayment from './payment';

const makePayment = buildPayment({
  validator: validator,
  generateIdentifier: uuidv4,
});

export default makePayment;
