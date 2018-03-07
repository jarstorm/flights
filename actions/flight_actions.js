import axios from 'axios';
import qs from 'qs';

import {
  FETCH_FLIGHTS
} from './types';

const FLIGHTS_ROOT_URL = 'https://public-api.adsbexchange.com/VirtualRadar/AircraftList.json?';
const FLIGHTS_QUERY_PARAMS = {
  fDstL: 0,
  fDstU: 100
};

const buildFlightsUrl = (latitude, longitude) => {
  const query = qs.stringify({ ...FLIGHTS_QUERY_PARAMS, lat: latitude, lng: longitude });
  return `${FLIGHTS_ROOT_URL}${query}`;
};


export const fetchFlights = (region) => async (dispatch) => {
  try {
    const url = buildFlightsUrl(region.latitude, region.longitude);
    let {data} = await axios.get(url);
    dispatch({ type: FETCH_FLIGHTS, payload: data.acList });
  } catch(e) {
    console.error(e);
  }
};
