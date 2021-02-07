import {
  DeliveryDatabaseController,
  DeliveryExport,
  DroneExport,
  SharedQueue,
} from '../../../core/@types/global';
import config from '../../../core/config';
import makeDelivery from '../entities/delivery';

/**
 * Marks a delivery as complete drone.
 *
 * @export
 * @param {{
 *   sharedQueue: SharedQueue,
 *   connectedDronesList: Array<DroneExport>,
 *   deliveriesDatabase: DeliveryDatabaseController,
 *   exportToNormalEntity: Function
 *  }} {
 *   sharedQueue,
 *   connectedDronesList,
 *   deliveriesDatabase,
 *   exportToNormalEntity
 * } - dependency injection
 * @return {Function}
 */
export default function buildCompleteDelivery({
  sharedQueue,
  connectedDronesList,
  deliveriesDatabase,
}: {
    sharedQueue: SharedQueue;
    connectedDronesList: Array<DroneExport>;
    deliveriesDatabase: DeliveryDatabaseController;
    exportToNormalEntity<T extends Object, U extends Object>(object: T): U;
  }): Function {
  return async function completeDelivery(deliveryId: string, droneIp: string) {
    const delivery = makeDelivery(deliveriesDatabase.findById(deliveryId));

    // Emitting an 'DELIVERY_FAILED' event in shared queue on invalid request
    try {
      // Finding the delivery in the database and marking it as completed
      delivery.markAsCompleted();
      deliveriesDatabase.updateCompletedOn(
          deliveryId,
          delivery.getCompletedOn(),
      );

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
        body: {orderId: delivery.getOrderId(), error: e.message},
      });
      throw e;
    }

    // Notifying the logger service on success
    sharedQueue.emit([
      config.inboundLoggerServiceQueue,
    ], {
      subject: 'DELIVERY_COMPLETE',
      body: {orderId: delivery.getOrderId()},
    });
  };
}
