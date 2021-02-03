import {connectDrone, disconnectDrone} from '../../usecases';
import makePostDrone from './post-drone';
import makeDeleteDrone from './delete-drone';
import notFound from './not-found';

const postDrone = makePostDrone({connectDrone});
const deleteDrone = makeDeleteDrone({disconnectDrone});

const orderController = Object.freeze({
  postDrone,
  deleteDrone,
  notFound,
});

export default orderController;
export {postDrone, deleteDrone, notFound};
