import { applyMiddleware, combineReducers, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import thunkMiddleware, { ThunkAction } from 'redux-thunk';
import { StateType } from 'typesafe-actions';

import authReducer, { AuthAction } from './modules/auth';
import collectionReducer, { CollectionAction } from './modules/collection';
import itemReducer, { ItemAction } from './modules/item';
import mainReducer, { MainAction } from './modules/main';
import playerReducer, { PlayerAction } from './modules/player';
import searchReducer, { SearchAction } from './modules/search';
import userLibraryReducer, { UserLibraryAction } from './modules/userLibrary';

const rootReducer = combineReducers({
  auth: authReducer,
  collection: collectionReducer,
  item: itemReducer,
  main: mainReducer,
  player: playerReducer,
  search: searchReducer,
  userLibrary: userLibraryReducer
});
const composeEnhancers = composeWithDevTools({});
const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunkMiddleware))
);

export type RootState = StateType<typeof rootReducer>;
export type RootAction =
  | AuthAction
  | CollectionAction
  | ItemAction
  | MainAction
  | PlayerAction
  | SearchAction
  | UserLibraryAction;
export type ThunkResult<R> = ThunkAction<R, any, undefined, any>;

export default store;
