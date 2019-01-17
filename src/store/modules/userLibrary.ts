import produce from 'immer';
import { ICollectionSummary, IPagedResponse } from 'payloads';
import { ThunkResult } from 'store';
import { action as createAction, ActionType } from 'typesafe-actions';
import * as CollectionAPI from 'utils/api/collection';
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from 'values';

// action types
const INITIALIZE = 'userLibrary/INITIALIZE';
const LOAD_COLLECTIONS_SUCCESS = 'userLibrary/LOAD_COLLECTIONS_SUCCESS';
const LOAD_MORE_COLLECTIONS = 'userLibrary/LOAD_MORE_COLLECTIONS';
const LOAD_BOOKMARKED_COLLECTIONS_SUCCESS =
  'userLibrary/LOAD_BOOKMARKED_COLLECTIONS_SUCCESS';
const LOAD_MORE_BOOKMARKED_COLLECTIONS =
  'userLibrary/LOAD_MORE_BOOKMARKED_COLLECTIONS';

// action creators
export const actions = {
  initialize: () => createAction(INITIALIZE),
  loadCollections: (
    username: string,
    page = DEFAULT_PAGE_NUMBER,
    size = DEFAULT_PAGE_SIZE,
    loadMore = false
  ): ThunkResult<Promise<void>> => async dispatch => {
    try {
      const res = await CollectionAPI.loadCollections(username, page, size);
      loadMore
        ? dispatch(actions.loadMoreCollections(res.data))
        : dispatch(actions.loadCollectionsSuccess(res.data));
    } catch (error) {
      throw error;
    }
  },
  loadCollectionsSuccess: (collections: IPagedResponse<ICollectionSummary>) =>
    createAction(LOAD_COLLECTIONS_SUCCESS, { collections }),
  loadMoreCollections: (collections: IPagedResponse<ICollectionSummary>) =>
    createAction(LOAD_MORE_COLLECTIONS, { collections }),
  createBookmark: (
    collectionId: number
  ): ThunkResult<Promise<void>> => async () => {
    try {
      await CollectionAPI.createBookmark(collectionId);
    } catch (error) {
      throw error;
    }
  },
  removeBookmark: (
    collectionId: number
  ): ThunkResult<Promise<void>> => async () => {
    try {
      await CollectionAPI.removeBookmark(collectionId);
    } catch (error) {
      throw error;
    }
  },
  loadBookmarkedCollections: (
    username: string,
    page = DEFAULT_PAGE_NUMBER,
    size = DEFAULT_PAGE_SIZE,
    loadMore = false
  ): ThunkResult<Promise<void>> => async dispatch => {
    try {
      const res = await CollectionAPI.getCollectionsBookmarkedByUser(
        username,
        page,
        size
      );
      loadMore
        ? dispatch(actions.loadMoreBookmarkedCollections(res.data))
        : dispatch(actions.loadBookmarkedCollectionsSuccess(res.data));
    } catch (error) {
      throw error;
    }
  },
  loadBookmarkedCollectionsSuccess: (
    collections: IPagedResponse<ICollectionSummary>
  ) => createAction(LOAD_BOOKMARKED_COLLECTIONS_SUCCESS, { collections }),
  loadMoreBookmarkedCollections: (
    collections: IPagedResponse<ICollectionSummary>
  ) => createAction(LOAD_MORE_BOOKMARKED_COLLECTIONS, { collections })
};
export type UserLibraryAction = ActionType<typeof actions>;

// state
export interface UserLibraryState {
  collections: IPagedResponse<ICollectionSummary> | null;
  bookmarks: IPagedResponse<ICollectionSummary> | null;
  // comments:
}
const initialState: UserLibraryState = {
  collections: null,
  bookmarks: null
};

// reducer
export default produce<UserLibraryState, UserLibraryAction>((draft, action) => {
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
    case LOAD_BOOKMARKED_COLLECTIONS_SUCCESS: {
      draft.bookmarks = action.payload.collections;
      return;
    }
    case LOAD_MORE_BOOKMARKED_COLLECTIONS: {
      const { collections } = action.payload;
      if (!draft.bookmarks) {
        draft.bookmarks = collections;
        return;
      }
      const previousContent = draft.bookmarks.content;
      draft.bookmarks = collections;
      draft.bookmarks.content = [...previousContent, ...collections.content];
      return;
    }
  }
}, initialState);
