import {
  FETCH_FLIGHTS,
  SELECTED_FLIGHT
} from '../actions/types';

const INITIAL_STATE = {
  results: [],
  selectedFlight: null
};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_FLIGHTS:
      return {...state, results: action.payload};
    case SELECTED_FLIGHT:
      return {...state, selectedFlight: action.payload};
    default:
      return state;
  }
}
