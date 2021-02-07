import axios from 'axios';
import makeDroneApi from './drone-api';

const droneApi = makeDroneApi({requestLibrary: axios});

export default droneApi;
