import { createStore } from 'redux';

const defaultState = { };

function navigator( state = defaultState, action ) {

  return state;

}

let uiState = createStore( navigator );

export default uiState
