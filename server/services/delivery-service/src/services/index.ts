import {DroneExport} from '@core/@types/entity-exports';
import sharedQueue from '@core/shared-queue';
import droneApi from '@src/drone-api';
import buildCompleteDelivery from './complete-delivery';
import buildConnectDrone from './connect-drone';
import buildCreateDelivery from './create-delivery';
import buildDisconnectDrone from './disconnect-drone';

const connectedDronesList: Array<DroneExport> = [];

const connectDrone = buildConnectDrone({
  sharedQueue,
  connectedDronesList,
});

const disconnectDrone = buildDisconnectDrone({
  sharedQueue,
  connectedDronesList,
});

const createDelivery = buildCreateDelivery({
  droneApi,
  sharedQueue,
  connectedDronesList,
});

const completeDelivery = buildCompleteDelivery({
  sharedQueue,
  connectedDronesList,
});

const ordersService = Object.freeze({
  connectDrone: connectDrone,
  disconnectDrone: disconnectDrone,
  createDelivery: createDelivery,
  completeDelivery: completeDelivery,
});

export default ordersService;
export {connectDrone, disconnectDrone, createDelivery, completeDelivery};
