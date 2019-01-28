import produce from 'immer';
import { ICollectionSummary, ICommentRequest, ICommentResponse, ICommentSummary, IPagedResponse } from 'payloads';
import { ThunkResult } from 'store';
import { action as createAction, ActionType } from 'typesafe-actions';
import * as CollectionAPI from 'utils/api/collection';
import * as CommentAPI from 'utils/api/comment';
import { DEFAULT_PAGE_SIZE } from 'values';

// action types
const INITIALIZE = 'userLibrary/INITIALIZE';
const LOAD_COLLECTIONS_SUCCESS = 'userLibrary/LOAD_COLLECTIONS_SUCCESS';
const LOAD_MORE_COLLECTIONS = 'userLibrary/LOAD_MORE_COLLECTIONS';
const LOAD_BOOKMARKED_COLLECTIONS_SUCCESS =
  'userLibrary/LOAD_BOOKMARKED_COLLECTIONS_SUCCESS';
const LOAD_MORE_BOOKMARKED_COLLECTIONS =
  'userLibrary/LOAD_MORE_BOOKMARKED_COLLECTIONS';
const REMOVE_BOOKMARK_SUCCESS = 'userLibrary/REMOVE_BOOKMARK_SUCCESS';
const LOAD_COMMENTS_SUCCESS = 'userLibrary/LOAD_COMMENTS_SUCCESS';
const LOAD_MORE_COMMENTS = 'userLibrary/LOAD_MORE_COMMENTS';
const UPDATE_COMMENT_SUCCESS = 'userLibrary/UPDATE_COMMENT_SUCCESS';
const REMOVE_COMMENT_SUCCESS = 'userLibrary/REMOVE_COMMENT_SUCCESS';

// action creators
export const actions = {
  initialize: () => createAction(INITIALIZE),
  loadCollections: (
    username: string,
    offsetId?: number,
    size = DEFAULT_PAGE_SIZE,
    loadMore = false
  ): ThunkResult<Promise<void>> => async dispatch => {
    try {
      const res = await CollectionAPI.loadCollections(username, size, offsetId);
      loadMore
        ? dispatch(actions.loadMoreCollections(res.data))
        : dispatch(actions.loadCollectionsSuccess(res.data));
    } catch (error) {
      if (loadMore) {
        // if error occurs while load more, init pagination
        dispatch(actions.loadCollections(username));
      }
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
    collectionId: number,
    index?: number
  ): ThunkResult<Promise<void>> => async dispatch => {
    try {
      await CollectionAPI.removeBookmark(collectionId);
      if (index !== undefined) {
        dispatch(actions.removeBookmarkSuccess(index));
      }
    } catch (error) {
      throw error;
    }
  },
  removeBookmarkSuccess: (index: number) =>
    createAction(REMOVE_BOOKMARK_SUCCESS, { index }),
  loadBookmarkedCollections: (
    username: string,
    offsetId?: number,
    size = DEFAULT_PAGE_SIZE,
    loadMore = false
  ): ThunkResult<Promise<void>> => async dispatch => {
    try {
      const res = await CollectionAPI.getCollectionsBookmarkedByUser(
        username,
        size,
        offsetId
      );
      loadMore
        ? dispatch(actions.loadMoreBookmarkedCollections(res.data))
        : dispatch(actions.loadBookmarkedCollectionsSuccess(res.data));
    } catch (error) {
      if (loadMore) {
        // if error occurs while load more, init pagination
        dispatch(actions.loadBookmarkedCollections(username));
      }
      throw error;
    }
  },
  loadBookmarkedCollectionsSuccess: (
    collections: IPagedResponse<ICollectionSummary>
  ) => createAction(LOAD_BOOKMARKED_COLLECTIONS_SUCCESS, { collections }),
  loadMoreBookmarkedCollections: (
    collections: IPagedResponse<ICollectionSummary>
  ) => createAction(LOAD_MORE_BOOKMARKED_COLLECTIONS, { collections }),
  loadComments: (
    username: string,
    offsetId?: number,
    size = DEFAULT_PAGE_SIZE,
    loadMore = false
  ): ThunkResult<Promise<void>> => async dispatch => {
    try {
      const res = await CommentAPI.getCommentsByUser(username, size, offsetId);
      loadMore
        ? dispatch(actions.loadMoreComments(res.data))
        : dispatch(actions.loadCommentsSuccess(res.data));
    } catch (error) {
      if (loadMore) {
        // if error occurs while load more, init pagination
        dispatch(actions.loadComments(username));
      }
      throw error;
    }
  },
  loadCommentsSuccess: (comments: IPagedResponse<ICommentSummary>) =>
    createAction(LOAD_COMMENTS_SUCCESS, { comments }),
  loadMoreComments: (comments: IPagedResponse<ICommentSummary>) =>
    createAction(LOAD_MORE_COMMENTS, { comments }),
  updateComment: (
    commentId: number,
    data: ICommentRequest
  ): ThunkResult<Promise<void>> => async dispatch => {
    try {
      const res = await CommentAPI.updateCommentById(commentId, data);
      await dispatch(actions.updateCommentsSuccess(res.data));
    } catch (error) {
      throw error;
    }
  },
  updateCommentsSuccess: (comment: ICommentResponse) =>
    createAction(UPDATE_COMMENT_SUCCESS, { comment }),
  removeComment: (
    commentId: number
  ): ThunkResult<Promise<void>> => async dispatch => {
    try {
      await CommentAPI.removeCommentById(commentId);
      await dispatch(actions.removeCommentsSuccess(commentId));
    } catch (error) {
      throw error;
    }
  },
  removeCommentsSuccess: (commentId: number) =>
    createAction(REMOVE_COMMENT_SUCCESS, { commentId })
};
export type UserLibraryAction = ActionType<typeof actions>;

// state
export interface UserLibraryState {
  collections: IPagedResponse<ICollectionSummary> | null;
  bookmarks: IPagedResponse<ICollectionSummary> | null;
  comments: IPagedResponse<ICommentSummary> | null;
}
const initialState: UserLibraryState = {
  collections: null,
  bookmarks: null,
  comments: null
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
    case REMOVE_BOOKMARK_SUCCESS: {
      if (!draft.bookmarks) {
        return;
      }
      draft.bookmarks.content.splice(action.payload.index, 1);
      draft.bookmarks.totalElements--;
      return;
    }
    case LOAD_COMMENTS_SUCCESS: {
      draft.comments = action.payload.comments;
      return;
    }
    case LOAD_MORE_COMMENTS: {
      const { comments } = action.payload;
      if (!draft.comments) {
        draft.comments = comments;
        return;
      }
      const previousContent = draft.comments.content;
      draft.comments = comments;
      draft.comments.content = [...previousContent, ...comments.content];
      return;
    }
    case UPDATE_COMMENT_SUCCESS: {
      const { comment: updatedComment } = action.payload;
      if (!draft.comments) {
        return;
      }
      const index = draft.comments.content.findIndex(
        comment => comment.id === updatedComment.id
      );
      if (index === -1) {
        return;
      }
      draft.comments.content[index].text = updatedComment.text;
      return;
    }
    case REMOVE_COMMENT_SUCCESS: {
      const { commentId } = action.payload;
      if (!draft.comments) {
        return;
      }
      const index = draft.comments.content.findIndex(
        comment => comment.id === commentId
      );
      if (index === -1) {
        return;
      }
      draft.comments.content.splice(index, 1);
      draft.comments.totalElements--;

      return;
    }
  }
}, initialState);
