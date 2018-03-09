import axios from 'axios';
import qs from 'qs';

import {
  FETCH_FLIGHTS,
  SELECTED_FLIGHT
} from './types';

const FLIGHTS_ROOT_URL = 'https://public-api.adsbexchange.com/VirtualRadar/AircraftList.json?';
const FLIGHTS_QUERY_PARAMS = {
  fDstL: 0,
  fDstU: 100
};

const buildFlightsUrl = (latitude, longitude, longitudeDelta) => {
  let zoom = Math.round(Math.log(360 / longitudeDelta) / Math.LN2); 
  const metersPerPx = 156543.03392 * Math.cos(latitude * Math.PI / 180) / Math.pow(2, zoom);
  const query = qs.stringify({ ...FLIGHTS_QUERY_PARAMS, lat: latitude, lng: longitude, fDstU: metersPerPx/4 });
  return `${FLIGHTS_ROOT_URL}${query}`;
};


export const fetchFlights = (region) => async (dispatch) => {
  if (region.longitude !== 0 && region.latitude !== 0) {
    try {
      const url = buildFlightsUrl(region.latitude, region.longitude, region.longitudeDelta);
      let {data} = await axios.get(url);
      dispatch({ type: FETCH_FLIGHTS, payload: data.acList });
    } catch(e) {
      console.error(e);
    }
  } 
};

export const selectFlight = (flight) => (dispatch) => {
  dispatch({ type: SELECTED_FLIGHT, payload: flight });
};