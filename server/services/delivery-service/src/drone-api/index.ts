import axios from 'axios';
import buildDroneApi from './drone-api';

const droneApi = buildDroneApi({requestLibrary: axios});

export default droneApi;
