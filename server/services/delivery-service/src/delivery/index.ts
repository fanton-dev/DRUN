
import validator from '@core/validator';
import {v4 as uuidv4} from 'uuid';
import buildDelivery from './delivery';

const makeDelivery = buildDelivery({
  validator: validator,
  generateIdentifier: uuidv4,
});

export default makeDelivery;
