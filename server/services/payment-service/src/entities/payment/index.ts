import {v4 as uuidv4} from 'uuid';
import buildCreatePayment from './payment';
import validator from '../../../../core/entities/validator';

const createPayment = buildCreatePayment({
  validator: validator,
  generateIdentifier: uuidv4,
});

export default createPayment;
