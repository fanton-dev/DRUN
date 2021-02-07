import {DroneExport} from '../../../core/@types/global';
import {exportToNormalEntity} from '../../../core/entities/utilities';
import droneApi from '../interfaces/drone-api';
import deliveriesDatabase from '../interfaces/deliveries-database';
import sharedQueue from '../../../core/interfaces/shared-queue';
import buildConnectDrone from './connect-drone';
import buildDisconnectDrone from './disconnect-drone';
import buildCreateDelivery from './create-delivery';
import buildCompleteDelivery from './complete-delivery';

const connectedDronesList: Array<DroneExport> = [];

const connectDrone = buildConnectDrone({
  sharedQueue,
  connectedDronesList,
  exportToNormalEntity,
});

const disconnectDrone = buildDisconnectDrone({
  sharedQueue,
  connectedDronesList,
});

const createDelivery = buildCreateDelivery({
  droneApi,
  sharedQueue,
  connectedDronesList,
  deliveriesDatabase,
  exportToNormalEntity,
});

const completeDelivery = buildCompleteDelivery({
  sharedQueue,
  connectedDronesList,
  deliveriesDatabase,
  exportToNormalEntity,
});

const ordersService = Object.freeze({
  connectDrone: connectDrone,
  disconnectDrone: disconnectDrone,
  createDelivery: createDelivery,
  completeDelivery: completeDelivery,
});

export default ordersService;
export {connectDrone, disconnectDrone, createDelivery, completeDelivery};
