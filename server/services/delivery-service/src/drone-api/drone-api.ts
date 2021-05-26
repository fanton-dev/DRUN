import {DroneApi} from '@core/@types/drone-api';
import {SourceExport} from '@core/@types/entity-exports';
import {DeliveryModel} from '@core/@types/models';
import {AxiosStatic} from 'axios';

/**
 * Drone API interactions interface.
 *
 * @export
 * @param {{
 *     requestLibrary: RequestLibrary,
 * }} {
 *     requestLibrary
 * } - dependency injection
 * @return {DroneApi}
 */
export default function makePaymentApi({
  requestLibrary,
}: {
  requestLibrary: AxiosStatic,
}): DroneApi {
  /**
   * Sends information about a delivery task to a given drone.
   *
   * @param {SourceExport} droneSource - drone source ip to send information to
   * @param {Delivery} deliveryInfo - delivery information to be send
   * @return {Promise<any>}
   */
  async function sendDeliveryTask(
      droneSource: SourceExport,
      deliveryInfo: DeliveryModel,
  ): Promise<void> {
    const droneUrl = `http://${droneSource.getIp()}/api/deliveries`;
    try {
      const response = await requestLibrary.post(
          droneUrl,
          deliveryInfo,
      );
      console.log(response.data.url);
      console.log(response.data.explanation);
    } catch (error) {
      console.log(error.response.body);
    }
  }
  return Object.freeze({
    sendDeliveryTask: sendDeliveryTask,
  });
}
