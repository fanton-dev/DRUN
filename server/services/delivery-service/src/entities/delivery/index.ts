import {v4 as uuidv4} from 'uuid';
import buildCreateDelivery from './delivery';
import validator from '../../../../core/entities/validator';
import {exportToNormalEntity} from '../../../../core/entities/utilities';

const createDelivery = buildCreateDelivery({
  validator: validator,
  generateIdentifier: uuidv4,
  exportToNormalEntity: exportToNormalEntity,
});

export default createDelivery;
