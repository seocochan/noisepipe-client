import { applyMiddleware, combineReducers, createStore } from 'redux';
import thunkMiddleware, { ThunkAction } from 'redux-thunk';
import { StateType } from 'typesafe-actions';

import authReducer, { AuthAction } from './modules/auth';
import baseReducer, { BaseAction } from './modules/base';
import collectionReducer, { CollectionAction } from './modules/collection';

const rootReducer = combineReducers({
  auth: authReducer,
  base: baseReducer,
  collection: collectionReducer
});
const store = createStore(rootReducer, applyMiddleware(thunkMiddleware));

export type RootState = StateType<typeof rootReducer>;
export type RootAction = AuthAction | BaseAction | CollectionAction;
export type ThunkResult<R> = ThunkAction<R, any, undefined, any>;

export default store;
