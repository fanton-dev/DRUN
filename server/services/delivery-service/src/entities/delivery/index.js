import {v4 as uuidv4} from 'uuid';
import buildCreateDelivery from './delivery';
import validator from '../validator';

const createDelivery = buildCreateDelivery(validator, uuidv4);

export default createDelivery;
