import produce from 'immer';
import { ICollectionSummary, IPagedResponse } from 'payloads';
import { ThunkResult } from 'store';
import { action as createAction, ActionType } from 'typesafe-actions';
import * as CollectionAPI from 'utils/api/collection';
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from 'values';

// action types
const INITIALIZE = 'userLibrary/INITIALIZE';
const LOAD_COLLECTIONS_SUCCESS = 'userLibrary/LOAD_COLLECTIONS_SUCCESS';

// action creators
export const actions = {
  initialize: () => createAction(INITIALIZE),
  loadCollections: (
    username: string,
    page = DEFAULT_PAGE_NUMBER,
    size = DEFAULT_PAGE_SIZE
  ): ThunkResult<Promise<void>> => async dispatch => {
    try {
      const res = await CollectionAPI.loadCollections(username, page, size);
      dispatch(actions.loadCollectionsSuccess(res.data));
    } catch (error) {
      throw error;
    }
  },
  loadCollectionsSuccess: (collections: IPagedResponse<ICollectionSummary>) =>
    createAction(LOAD_COLLECTIONS_SUCCESS, { collections })
};
export type UserLibraryAction = ActionType<typeof actions>;

// state
export interface UserLibraryState {
  collections: IPagedResponse<ICollectionSummary> | null;
  // bookmarks: ,
  // comments:
}
const initialState: UserLibraryState = {
  collections: null
};

// reducer
export default produce<UserLibraryState, UserLibraryAction>((draft, action) => {
  switch (action.type) {
    case INITIALIZE: {
      return initialState;
    }
    case LOAD_COLLECTIONS_SUCCESS: {
      draft.collections = action.payload.collections;
      // load more
      // draft.collections!.content = [...draft.collections!.content, ...action.payload.collections.content];
      return;
    }
  }
}, initialState);
