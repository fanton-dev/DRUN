import makeSource from '@core/source';
import validator from '@core/validator';
import {v4 as uuidv4} from 'uuid';
import buildOrder from './order';

const makeOrder = buildOrder({
  validator: validator,
  generateIdentifier: uuidv4,
  makeSource,
});

export default makeOrder;
