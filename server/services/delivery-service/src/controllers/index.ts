import notFound from '@core/controllers/not-found';
import {completeDelivery, connectDrone, disconnectDrone} from '@src/services';
import makeDeleteDrone from './delete-drone';
import makePostCompleteDelivery from './post-complete-delivery';
import makePostDrone from './post-drone';

const postDrone = makePostDrone({connectDrone});
const deleteDrone = makeDeleteDrone({disconnectDrone});
const postCompleteDelivery = makePostCompleteDelivery({completeDelivery});

const orderController = Object.freeze({
  postDrone,
  deleteDrone,
  postCompleteDelivery,
  notFound,
});

export default orderController;
export {postDrone, deleteDrone, postCompleteDelivery, notFound};
