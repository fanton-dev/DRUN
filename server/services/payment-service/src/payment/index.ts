import validator from '@core/validator';
import {v4 as uuidv4} from 'uuid';
import buildMakePayment from './payment';

const makePayment = buildMakePayment({
  validator: validator,
  generateIdentifier: uuidv4,
});

export default makePayment;
