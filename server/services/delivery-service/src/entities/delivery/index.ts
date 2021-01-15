import {v4 as uuidv4} from 'uuid';
import buildCreateDelivery from './delivery';
import validator from '../../../../core/entities/validator';

const createDelivery = buildCreateDelivery({
  validator: validator,
  generateIdentifier: uuidv4,
});

export default createDelivery;
