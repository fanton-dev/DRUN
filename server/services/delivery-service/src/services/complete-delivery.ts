import {DroneExport} from '@core/@types/entity-exports';
import {SharedQueue} from '@core/@types/shared-queue';
import config from 'config';

/**
 * Marks a delivery as complete drone.
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
export default function buildCompleteDelivery({
  sharedQueue,
  connectedDronesList,
}: {
    sharedQueue: SharedQueue;
    connectedDronesList: Array<DroneExport>;
  }): (deliveryId: string, droneIp: string) => any {
  return async function completeDelivery(deliveryId: string, droneIp: string) {
    // Emitting an 'DELIVERY_FAILED' event in shared queue on invalid request
    try {
      // Finding the drone in the array of drones
      const drone = connectedDronesList.find(
          (i) => i.getSource().getIp() === droneIp,
      );
      if (!drone) {
        throw new Error('Drone IP not found on the server.');
      }

      // Freeing the drone
      drone.markAsNotBusy();

      // To-do update order in the database
    } catch (e) {
      sharedQueue.emit([
        config.inboundLoggerServiceQueue,
      ], {
        subject: 'DELIVERY_FAILED',
        body: {orderId: deliveryId, error: e.message},
      });
      throw e;
    }

    // Notifying the logger service on success
    sharedQueue.emit([
      config.inboundLoggerServiceQueue,
    ], {
      subject: 'DELIVERY_COMPLETE',
      body: {orderId: deliveryId},
    });
  };
}
