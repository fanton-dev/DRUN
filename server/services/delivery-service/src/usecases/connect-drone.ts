import {
  Drone,
  DroneExport,
  SharedQueue,
} from '../../../core/@types/global';
import config from '../../../core/config';
import makeDrone from '../entities/drone';

/**
 * Connects a new drone to the server.
 *
 * @export
 * @param {{
 *   sharedQueue: SharedQueue,
 *   connectedDronesList: Array<DroneExport>,
 *   exportToNormalEntity: Function,
 * }} {
 *   sharedQueue,
 *   connectedDronesList,
 *   exportToNormalEntity,
 * } - dependency injection
 * @return {Function} - drone connection function
 */
export default function buildConnectDrone({
  sharedQueue,
  connectedDronesList,
  exportToNormalEntity,
}: {
    sharedQueue: SharedQueue;
    connectedDronesList: Array<DroneExport>;
    exportToNormalEntity<T extends Object, U extends Object>(object: T): U;
  }): Function {
  return async function connectDrone(droneInfo: Drone) {
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
        config.inboundLoggerServiceQueue,
      ], {
        subject: 'DRONE_DENIED',
        body: {error: e.message},
      });
      throw e;
    }

    // Notifying the logger service on success
    sharedQueue.emit([
      config.inboundLoggerServiceQueue,
    ], {
      subject: 'DRONE_CONNECTED',
      body: exportToNormalEntity(drone),
    });
  };
}
