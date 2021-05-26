import makeSource from '@core/source';
import validator from '@core/validator';
import {v4 as uuidv4} from 'uuid';
import buildDrone from './drone';

const makeDrone = buildDrone({
  validator: validator,
  generateIdentifier: uuidv4,
  makeSource: makeSource,
});

export default makeDrone;
