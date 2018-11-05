import { applyMiddleware, combineReducers, createStore } from 'redux';
import thunkMiddleware, { ThunkAction } from 'redux-thunk';
import { StateType } from 'typesafe-actions';

import authReducer, { AuthAction } from './modules/auth';

const rootReducer = combineReducers({
  auth: authReducer
});
const store = createStore(rootReducer, applyMiddleware(thunkMiddleware));

export type RootState = StateType<typeof rootReducer>;
export type RootAction = AuthAction;
export type ThunkResult<R> = ThunkAction<R, any, undefined, any>;

export default store;
