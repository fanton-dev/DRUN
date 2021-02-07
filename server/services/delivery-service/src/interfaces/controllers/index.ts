import {connectDrone, disconnectDrone, completeDelivery} from '../../usecases';
import makePostDrone from './post-drone';
import makeDeleteDrone from './delete-drone';
import notFound from '../../../../core/interfaces/controllers/not-found';
import makePostCompleteDelivery from './post-complete-delivery';

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
