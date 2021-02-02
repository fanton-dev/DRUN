import {v4 as uuidv4} from 'uuid';
import buildMakePayment from './payment';
import validator from '../../../../core/entities/validator';

const makePayment = buildMakePayment({
  validator: validator,
  generateIdentifier: uuidv4,
});

export default makePayment;
