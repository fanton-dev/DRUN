import {SourceExport} from './entity-exports';
import {DeliveryModel} from './models';

/**
 * Drone API object structure.
 *
 * @export
 * @interface DroneApi
 */
export interface DroneApi {
  sendDeliveryTask(
    droneSource: SourceExport,
    deliveryInfo: DeliveryModel,
  ): Promise<void>;
}
