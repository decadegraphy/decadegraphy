import { combineReducers } from 'redux'
import campaignsReducer from './Campaign/reducer'

const reducers = combineReducers({
  campaigns: campaignsReducer
})

export default reducers
