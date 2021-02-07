import {
  Delivery,
  DeliveryDatabaseController,
  DeliveryExport,
  DroneApi,
  DroneExport,
  SharedQueue,
} from '../../../core/@types/global';
import config from '../../../core/config';
import makeDelivery from '../entities/delivery';

/**
 * Crates a new delivery and forwards it to a free drone.
 *
 * @export
 * @param {{
 *   droneApi: DroneApi,
 *   sharedQueue: SharedQueue,
 *   connectedDronesList: Array<DroneExport>,
 *   deliveriesDatabase: DeliveryDatabaseController,
 *   exportToNormalEntity: Function,
 * }} {
 *   droneApi,
 *   sharedQueue,
 *   connectedDronesList,
 *   deliveriesDatabase,
 *   exportToNormalEntity
 * } - dependency injection
 * @return {Function} - delivery creation function
 */
export default function buildCreateDelivery({
  droneApi,
  sharedQueue,
  connectedDronesList,
  deliveriesDatabase,
  exportToNormalEntity,
}: {
    droneApi: DroneApi,
    sharedQueue: SharedQueue;
    connectedDronesList: Array<DroneExport>;
    deliveriesDatabase: DeliveryDatabaseController;
    exportToNormalEntity<T extends Object, U extends Object>(object: T): U;
  }): Function {
  return async function createDelivery(deliveryInfo: Delivery) {
    let delivery: DeliveryExport;
    let normalizedDelivery: Delivery;

    // Emitting an 'DELIVERY_DENIED' event in shared queue on invalid request
    try {
      // Finding a free drone and throwing an error if there are none
      const drone = connectedDronesList.find((i) => !i.getIsBusy());
      if (!drone) {
        throw new Error('No free drones available.');
      }

      // Creating new delivery entity
      delivery = {drone: drone, ...makeDelivery(deliveryInfo)};
      normalizedDelivery = exportToNormalEntity(delivery);

      // Sending delivery task to drone
      droneApi.sendDeliveryTask(drone.getSource(), normalizedDelivery);
      drone.markAsBusy();

      // Storing order in the database
      deliveriesDatabase.insert(normalizedDelivery);
    } catch (e) {
      sharedQueue.emit([
        config.inboundLoggerServiceQueue,
      ], {
        subject: 'DELIVERY_DECLINED',
        body: {orderId: deliveryInfo.orderId, error: e.message},
      });
      return;
    }

    // Notifying the logger service on success
    sharedQueue.emit([
      config.inboundLoggerServiceQueue,
    ], {
      subject: 'DELIVERY_ACCEPTED',
      body: exportToNormalEntity(delivery),
    });
  };
}
