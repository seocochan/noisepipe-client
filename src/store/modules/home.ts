import produce from 'immer';
import { ICollectionSummary } from 'payloads';
import { ThunkResult } from 'store';
import { action as createAction, ActionType } from 'typesafe-actions';
import * as CollectionAPI from 'utils/api/collection';

// action types
const INITIALIZE = 'home/initialize';
const LOAD_RECENTLY_CREATED_COLLECTIONS_SUCCESS =
  'home/LOAD_RECENTLY_CREATED_COLLECTIONS_SUCCESS';
const LOAD_RECENTLY_UPDATED_COLLECTIONS_SUCCESS =
  'home/LOAD_RECENTLY_UPDATED_COLLECTIONS_SUCCESS';

// action creators
export const actions = {
  initialize: () => createAction(INITIALIZE),
  loadRecentlyCreatedCollections: (): ThunkResult<
    Promise<void>
  > => async dispatch => {
    try {
      const res = await CollectionAPI.getRecentlyCreatedCollections();
      dispatch(actions.loadRecentlyCreatedCollectionsSuccess(res.data));
    } catch (error) {
      throw error;
    }
  },
  loadRecentlyCreatedCollectionsSuccess: (collections: ICollectionSummary[]) =>
    createAction(LOAD_RECENTLY_CREATED_COLLECTIONS_SUCCESS, { collections }),
  loadRecentlyUpdatedCollections: (): ThunkResult<
    Promise<void>
  > => async dispatch => {
    try {
      const res = await CollectionAPI.getRecentlyUpdatedCollections();
      dispatch(actions.loadRecentlyUpdatedCollectionsSuccess(res.data));
    } catch (error) {
      throw error;
    }
  },
  loadRecentlyUpdatedCollectionsSuccess: (collections: ICollectionSummary[]) =>
    createAction(LOAD_RECENTLY_UPDATED_COLLECTIONS_SUCCESS, { collections })
};
export type HomeAction = ActionType<typeof actions>;

// state
export interface HomeState {
  recentlyCreatedCollections: ICollectionSummary[] | null;
  recentlyUpdatedCollections: ICollectionSummary[] | null;
}
const initialState: HomeState = {
  recentlyCreatedCollections: null,
  recentlyUpdatedCollections: null
};

// reducer
export default produce<HomeState, HomeAction>((draft, action) => {
  switch (action.type) {
    case INITIALIZE: {
      return initialState;
    }
    case LOAD_RECENTLY_CREATED_COLLECTIONS_SUCCESS: {
      draft.recentlyCreatedCollections = action.payload.collections;
      return;
    }
    case LOAD_RECENTLY_UPDATED_COLLECTIONS_SUCCESS: {
      draft.recentlyUpdatedCollections = action.payload.collections;
      return;
    }
  }
}, initialState);
