import {v4 as uuidv4} from 'uuid';
import buildMakeOrder from './order';
import validator from '../validator';

const makeOrder = buildMakeOrder(validator, uuidv4);

export default makeOrder;
