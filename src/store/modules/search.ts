import produce from 'immer';
import { ICollectionSummary, IItemSummary, IPagedResponse, IUserProfile } from 'payloads';
import { ThunkResult } from 'store';
import { action as createAction, ActionType } from 'typesafe-actions';
import * as CollectionAPI from 'utils/api/collection';
import * as ItemAPI from 'utils/api/item';
import * as UserAPI from 'utils/api/user';
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from 'values';

// action types
const INITIALIZE = 'search/INITIALIZE';
const LOAD_COLLECTIONS_SUCCESS = 'search/LOAD_COLLECTIONS_SUCCESS';
const LOAD_MORE_COLLECTIONS = 'search/LOAD_MORE_COLLECTIONS';
const LOAD_ITEMS_SUCCESS = 'search/LOAD_ITEMS_SUCCESS';
const LOAD_MORE_ITEMS = 'search/LOAD_MORE_ITEMS';
const LOAD_USERS_SUCCESS = 'search/LOAD_USERS_SUCCESS';
const LOAD_MORE_USERS = 'search/LOAD_MORE_USERS';

// action creators
export const actions = {
  initialize: () => createAction(INITIALIZE),
  loadCollections: (
    q: string,
    page = DEFAULT_PAGE_NUMBER,
    size = DEFAULT_PAGE_SIZE,
    loadMore = false,
  ): ThunkResult<Promise<void>> => async (dispatch) => {
    try {
      const res = await CollectionAPI.searchCollections(q, page, size);
      loadMore ? dispatch(actions.loadMoreCollections(res.data)) : dispatch(actions.loadCollectionsSuccess(res.data));
    } catch (error) {
      throw error;
    }
  },
  loadCollectionsSuccess: (collections: IPagedResponse<ICollectionSummary>) =>
    createAction(LOAD_COLLECTIONS_SUCCESS, { collections }),
  loadMoreCollections: (collections: IPagedResponse<ICollectionSummary>) =>
    createAction(LOAD_MORE_COLLECTIONS, { collections }),
  loadItems: (
    q: string,
    page = DEFAULT_PAGE_NUMBER,
    size = DEFAULT_PAGE_SIZE,
    loadMore = false,
  ): ThunkResult<Promise<void>> => async (dispatch) => {
    try {
      const res = await ItemAPI.searchItems(q, page, size);
      loadMore ? dispatch(actions.loadMoreItems(res.data)) : dispatch(actions.loadItemsSuccess(res.data));
    } catch (error) {
      throw error;
    }
  },
  loadItemsSuccess: (items: IPagedResponse<IItemSummary>) => createAction(LOAD_ITEMS_SUCCESS, { items }),
  loadMoreItems: (items: IPagedResponse<IItemSummary>) => createAction(LOAD_MORE_ITEMS, { items }),
  loadUsers: (
    q: string,
    page = DEFAULT_PAGE_NUMBER,
    size = DEFAULT_PAGE_SIZE,
    loadMore = false,
  ): ThunkResult<Promise<void>> => async (dispatch) => {
    try {
      const res = await UserAPI.searchUsers(q, page, size);
      loadMore ? dispatch(actions.loadMoreUsers(res.data)) : dispatch(actions.loadUsersSuccess(res.data));
    } catch (error) {
      throw error;
    }
  },
  loadUsersSuccess: (users: IPagedResponse<IUserProfile>) => createAction(LOAD_USERS_SUCCESS, { users }),
  loadMoreUsers: (users: IPagedResponse<IUserProfile>) => createAction(LOAD_MORE_USERS, { users }),
  createBookmark: (collectionId: number): ThunkResult<Promise<void>> => async () => {
    try {
      await CollectionAPI.createBookmark(collectionId);
    } catch (error) {
      throw error;
    }
  },
  removeBookmark: (collectionId: number): ThunkResult<Promise<void>> => async () => {
    try {
      await CollectionAPI.removeBookmark(collectionId);
    } catch (error) {
      throw error;
    }
  },
};
export type SearchAction = ActionType<typeof actions>;

// state
export interface SearchState {
  collections: IPagedResponse<ICollectionSummary> | null;
  items: IPagedResponse<IItemSummary> | null;
  users: IPagedResponse<IUserProfile> | null;
}
const initialState: SearchState = {
  collections: null,
  items: null,
  users: null,
};

// reducer
export default produce<SearchState, SearchAction>((draft, action) => {
  switch (action.type) {
    case INITIALIZE: {
      return initialState;
    }
    case LOAD_COLLECTIONS_SUCCESS: {
      draft.collections = action.payload.collections;
      return;
    }
    case LOAD_MORE_COLLECTIONS: {
      const { collections } = action.payload;
      if (!draft.collections) {
        draft.collections = collections;
        return;
      }
      const previousContent = draft.collections.content;
      draft.collections = collections;
      draft.collections.content = [...previousContent, ...collections.content];
      return;
    }
    case LOAD_ITEMS_SUCCESS: {
      draft.items = action.payload.items;
      return;
    }
    case LOAD_MORE_ITEMS: {
      const { items } = action.payload;
      if (!draft.items) {
        draft.items = items;
        return;
      }
      const previousContent = draft.items.content;
      draft.items = items;
      draft.items.content = [...previousContent, ...items.content];
      return;
    }
    case LOAD_USERS_SUCCESS: {
      draft.users = action.payload.users;
      return;
    }
    case LOAD_MORE_USERS: {
      const { users } = action.payload;
      if (!draft.users) {
        draft.users = users;
        return;
      }
      const previousContent = draft.users.content;
      draft.users = users;
      draft.users.content = [...previousContent, ...users.content];
      return;
    }
  }
}, initialState);
