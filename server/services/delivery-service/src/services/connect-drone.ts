
import {DroneExport} from '@core/@types/entity-exports';
import {DroneModel} from '@core/@types/models';
import {SharedQueue} from '@core/@types/shared-queue';
import makeDrone from '@src/drone';
import config from 'config';

/**
 * Connects a new drone to the server.
 *
 * @export
 * @param {{
 *     sharedQueue: SharedQueue,
 *     connectedDronesList: Array<DroneExport>,
 *   }} {
 *   sharedQueue,
 *   connectedDronesList,
 * } - dependency injection
 * @return {Function}
 */
export default function buildConnectDrone({
  sharedQueue,
  connectedDronesList,
}: {
    sharedQueue: SharedQueue;
    connectedDronesList: Array<DroneExport>;
  }): ({}) => any {
  return async function connectDrone(droneInfo: DroneModel) {
    let drone: DroneExport;

    // Emitting an 'DRONE_DENIED' event in shared queue on invalid request
    try {
      // Verifying whether the same drone is not trying to connect again
      if (connectedDronesList.find(
          (i) => i.getSource().getIp() === droneInfo.source.ip,
      )) {
        throw new Error('Drone is already connected.');
      }
      // Creating drone entity
      drone = makeDrone(droneInfo);
      connectedDronesList.push(drone);
    } catch (e) {
      sharedQueue.emit([
        config.get('INBOUND_LOGGER_SERVICE_QUEUE'),
      ], {
        subject: 'DRONE_DENIED',
        body: {error: e.message},
      });
      throw e;
    }

    // Notifying the logger service on success
    sharedQueue.emit([
      config.get('INBOUND_LOGGER_SERVICE_QUEUE'),
    ], {
      subject: 'DRONE_CONNECTED',
      body: {id: drone.getId(), droneInfo},
    });
  };
}
