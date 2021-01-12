import {v4 as uuidv4} from 'uuid';
import buildMakeOrder from './order';
import validator from '../../../../core/entities/validator';

const makeOrder = buildMakeOrder({
  validator: validator,
  generateIdentifier: uuidv4,
});

export default makeOrder;
