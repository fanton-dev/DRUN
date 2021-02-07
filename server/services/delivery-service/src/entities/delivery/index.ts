import {v4 as uuidv4} from 'uuid';
import buildMakeDelivery from './delivery';
import validator from '../../../../core/entities/validator';
import {exportToNormalEntity} from '../../../../core/entities/utilities';

const makeDelivery = buildMakeDelivery({
  validator: validator,
  generateIdentifier: uuidv4,
  exportToNormalEntity: exportToNormalEntity,
});

export default makeDelivery;
