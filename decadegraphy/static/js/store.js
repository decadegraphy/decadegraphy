import {createStore, applyMiddleware, compose} from 'redux';
import reducer from './reducer';

const store = createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

const dispatch = store.dispatch;

export {
  dispatch as default,
  store
};
