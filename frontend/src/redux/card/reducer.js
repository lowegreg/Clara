import { Map } from 'immutable';
import cardActions from './actions';


const initState = new Map({

});

export default function cardReducer(state = initState, action) {
  switch (action.type) {
    case cardActions.CHANGE_CARDS:
      return state.set('cards', action.cards);
    default:
      return state;
  }
}
