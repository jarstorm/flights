import {
  FETCH_FLIGHTS
} from '../actions/types';

const INITIAL_STATE = {
  results: []
};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_FLIGHTS:
      return {results: action.payload};
    default:
      return state;
  }
}
