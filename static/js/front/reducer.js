import { combineReducers } from 'redux'
import { fromJS } from 'immutable'

const defaultState = fromJS({
  isModalOpen: false
})

function modalReducer (state = defaultState, action) {
console.log(action)
  return state.set('isModalOpen', !state.get('isModalOpen'))
}

export default combineReducers({
  modals: modalReducer
})
