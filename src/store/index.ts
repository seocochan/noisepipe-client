import { applyMiddleware, combineReducers, createStore } from 'redux';
import thunkMiddleware, { ThunkAction } from 'redux-thunk';
import { StateType } from 'typesafe-actions';

import authReducer, { AuthAction } from './modules/auth';
import baseReducer, { BaseAction } from './modules/base';
import collectionReducer, { CollectionAction } from './modules/collection';
import playerReducer, { PlayerAction } from './modules/player';

const rootReducer = combineReducers({
  auth: authReducer,
  base: baseReducer,
  collection: collectionReducer,
  player: playerReducer
});
const store = createStore(rootReducer, applyMiddleware(thunkMiddleware));

export type RootState = StateType<typeof rootReducer>;
export type RootAction =
  | AuthAction
  | BaseAction
  | CollectionAction
  | PlayerAction;
export type ThunkResult<R> = ThunkAction<R, any, undefined, any>;

export default store;
