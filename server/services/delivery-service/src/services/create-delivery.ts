import {DroneApi} from '@core/@types/drone-api';
import {DeliveryExport, DroneExport} from '@core/@types/entity-exports';
import {DeliveryModel} from '@core/@types/models';
import {SharedQueue} from '@core/@types/shared-queue';
import makeDelivery from '@src/delivery';
import config from 'config';

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
}: {
    droneApi: DroneApi,
    sharedQueue: SharedQueue;
    connectedDronesList: Array<DroneExport>;
  }): Function {
  return async function createDelivery(deliveryInfo: DeliveryModel) {
    let delivery: DeliveryExport;

    // Emitting an 'DELIVERY_DENIED' event in shared queue on invalid request
    try {
      // Finding a free drone and throwing an error if there are none
      const drone = connectedDronesList.find((i) => !i.getIsBusy());
      if (!drone) {
        throw new Error('No free drones available.');
      }

      // Creating new delivery entity
      delivery = makeDelivery(deliveryInfo);
      delivery.setDrone(drone);

      // Sending delivery task to drone
      droneApi.sendDeliveryTask(drone.getSource(), {
        orderId: delivery.getOrderId(),
        senderLocation: {
          latitude: delivery.getSenderLocation().getLatitude(),
          longitude: delivery.getSenderLocation().getLongitude(),
        },
        receiverLocation: {
          latitude: delivery.getReceiverLocation().getLatitude(),
          longitude: delivery.getReceiverLocation().getLongitude(),
        },
      });
      drone.markAsBusy();
    } catch (e) {
      sharedQueue.emit([
        config.get('INBOUND_LOGGER_SERVICE_QUEUE'),
      ], {
        subject: 'DELIVERY_DECLINED',
        body: {orderId: deliveryInfo.orderId, error: e.message},
      });
      return;
    }

    // Notifying the logger service on success
    sharedQueue.emit([
      config.get('INBOUND_LOGGER_SERVICE_QUEUE'),
    ], {
      subject: 'DELIVERY_ACCEPTED',
      body: {id: delivery.getId(), ...deliveryInfo},
    });
  };
}
