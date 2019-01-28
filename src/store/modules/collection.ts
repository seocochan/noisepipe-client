import { AxiosError } from 'axios';
import produce from 'immer';
import {
  ICollectionRequest,
  ICollectionResponse,
  ICommentRequest,
  ICommentResponse,
  IItemPutRequest,
  IItemResponse
} from 'payloads';
import { ThunkResult } from 'store';
import { Provider } from 'types';
import { action as createAction, ActionType } from 'typesafe-actions';
import * as CollectionAPI from 'utils/api/collection';
import * as CommentAPI from 'utils/api/comment';
import * as ItemAPI from 'utils/api/item';
import * as Utils from 'utils/common';

// action types
const INITIALIZE = 'collection/INITIALIZE';
const LOAD_COLLECTION_PENDING = 'collection/LOAD_COLLECTION_PENDING';
const LOAD_COLLECTION_SUCCESS = 'collection/LOAD_COLLECTION_SUCCESS';
const LOAD_COLLECTION_FAILURE = 'collection/LOAD_COLLECTION_FAILURE';
const LOAD_ITEMS_PENDING = 'collection/LOAD_ITEMS_PENDING';
const LOAD_ITEMS_SUCCESS = 'collection/LOAD_ITEMS_SUCCESS';
const LOAD_ITEMS_FAILURE = 'collection/LOAD_ITEMS_FAILURE';
const UPDATE_COLLECTION_SUCCESS = 'collection/UPDATE_COLLECTION_SUCCESS';
const UPDATE_ITEM_POSITION_PENDING = 'collection/UPDATE_ITEM_POSITION_PENDING';
const UPDATE_ITEM_POSITION_SUCCESS = 'collection/UPDATE_ITEM_POSITION_SUCCESS';
const UPDATE_ITEM_POSITION_FAILURE = 'collection/UPDATE_ITEM_POSITION_FAILURE';
const UPDATE_ITEM = 'collection/UPDATE_ITEM';
const ADD_ITEM_SUCCESS = 'collection/ADD_ITEM_SUCCESS';
const REMOVE_ITEM = 'collection/REMOVE_ITEM';
const CREATE_BOOKMARK_SUCCESS = 'collection/CREATE_BOOKMARK_SUCCESS';
const REMOVE_BOOKMARK_SUCCESS = 'collection/REMOVE_BOOKMARK_SUCCESS';
const LOAD_COMMENTS_SUCCESS = 'collection/LOAD_COMMENTS_SUCCESS';
const LOAD_REPLIES_SUCCESS = 'collection/LOAD_REPLIES_SUCCESS';
const CREATE_COMMENT = 'collection/CREATE_COMMENT';
const CREATE_REPLY = 'collection/CREATE_REPLY';
const UPDATE_COMMENT = 'collection/UPDATE_COMMENT';
const UPDATE_REPLY = 'collection/UPDATE_REPLY';
const REMOVE_COMMENT = 'collection/REMOVE_COMMENT';
const REMOVE_REPLY = 'collection/REMOVE_REPLY';

// action creators
export const actions = {
  initialize: () => createAction(INITIALIZE),
  loadCollection: (
    collectionId: number
  ): ThunkResult<Promise<void>> => async dispatch => {
    dispatch(actions.loadCollectionPending());
    try {
      const res = await CollectionAPI.loadCollection(collectionId);
      dispatch(actions.loadCollectionSuccess(res.data));
    } catch (error) {
      dispatch(actions.loadColelctionFailure(error));
      throw error;
    }
  },
  loadCollectionPending: () => createAction(LOAD_COLLECTION_PENDING),
  loadCollectionSuccess: (collection: ICollectionResponse) =>
    createAction(LOAD_COLLECTION_SUCCESS, collection),
  loadColelctionFailure: (error: AxiosError) =>
    createAction(LOAD_COLLECTION_FAILURE, error),
  createCollection: (
    username: string,
    collection: ICollectionRequest
  ): ThunkResult<Promise<void>> => async () => {
    try {
      await CollectionAPI.createCollection(username, collection);
    } catch (error) {
      throw error;
    }
  },
  updateCollection: (
    collectionId: number,
    collection: ICollectionRequest
  ): ThunkResult<Promise<void>> => async dispatch => {
    try {
      const res = await CollectionAPI.updateCollection(
        collectionId,
        collection
      );
      dispatch(actions.loadCollectionSuccess(res.data));
    } catch (error) {
      throw error;
    }
  },
  removeCollection: (
    collectionId: number
  ): ThunkResult<Promise<void>> => async dispatch => {
    try {
      await CollectionAPI.removeCollection(collectionId);
      dispatch(actions.initialize());
    } catch (error) {
      throw error;
    }
  },
  updateCollectionSuccess: (collection: ICollectionResponse) =>
    createAction(UPDATE_COLLECTION_SUCCESS, { collection }),
  loadItems: (
    collectionId: number
  ): ThunkResult<Promise<void>> => async dispatch => {
    dispatch(actions.loadItemsPending());
    try {
      const res = await CollectionAPI.loadItems(collectionId);
      dispatch(actions.loadItemsSuccess(res.data.content)); // ignore paged response
    } catch (error) {
      dispatch(actions.loadItemsFailure(error));
      throw error;
    }
  },
  loadItemsPending: () => createAction(LOAD_ITEMS_PENDING),
  loadItemsSuccess: (items: IItemResponse[]) =>
    createAction(LOAD_ITEMS_SUCCESS, items),
  loadItemsFailure: (error: AxiosError) =>
    createAction(LOAD_ITEMS_FAILURE, error),
  updateItemPostion: (
    oldIndex: number,
    newIndex: number
  ): ThunkResult<Promise<void>> => async (dispatch, getState) => {
    dispatch(actions.updateItemPostionPending());
    try {
      const items = getState().collection.items as IItemResponse[];
      const { newItems, newPosition } = Utils.updatePosition(
        items,
        oldIndex,
        newIndex
      );
      dispatch(actions.updateItemPostionSuccess(newItems));
      await CollectionAPI.updateItemPosition(items[oldIndex].id, newPosition);
    } catch (error) {
      dispatch(actions.updateItemPostionFailure(error));
      throw error;
    }
  },
  updateItemPostionPending: () => createAction(UPDATE_ITEM_POSITION_PENDING),
  updateItemPostionSuccess: (items: IItemResponse[]) =>
    createAction(UPDATE_ITEM_POSITION_SUCCESS, items),
  updateItemPostionFailure: (error: AxiosError) =>
    createAction(UPDATE_ITEM_POSITION_FAILURE, error),
  updateItem: (itemId: number, data: IItemPutRequest) =>
    createAction(UPDATE_ITEM, { itemId, data }),
  addItem: (
    collectionId: number,
    title: string,
    sourceUrl: string,
    sourceProvider: Provider
  ): ThunkResult<Promise<void>> => async (dispatch, getState) => {
    const items = getState().collection.items as IItemResponse[];
    const position = Utils.getNewPosition(items);
    try {
      const res = await ItemAPI.createItem(collectionId, {
        title,
        sourceUrl,
        sourceProvider,
        position
      });
      dispatch(actions.addItemSuccess(res.data));
    } catch (error) {
      throw error;
    }
  },
  addItemSuccess: (item: IItemResponse) =>
    createAction(ADD_ITEM_SUCCESS, { item }),
  removeItem: (itemId: number) => createAction(REMOVE_ITEM, { itemId }),
  createBookmark: (
    collectionId: number
  ): ThunkResult<Promise<void>> => async dispatch => {
    try {
      await CollectionAPI.createBookmark(collectionId);
      await dispatch(actions.createBookmarkSuccess());
    } catch (error) {
      throw error;
    }
  },
  createBookmarkSuccess: () => createAction(CREATE_BOOKMARK_SUCCESS),
  removeBookmark: (
    collectionId: number
  ): ThunkResult<Promise<void>> => async dispatch => {
    try {
      await CollectionAPI.removeBookmark(collectionId);
      await dispatch(actions.removeBookmarkSuccess());
    } catch (error) {
      throw error;
    }
  },
  removeBookmarkSuccess: () => createAction(REMOVE_BOOKMARK_SUCCESS),
  loadComments: (
    collectionId: number
  ): ThunkResult<Promise<void>> => async dispatch => {
    try {
      const res = await CommentAPI.getCommentsByCollection(collectionId);
      await dispatch(actions.loadCommentsSuccess(res.data));
    } catch (error) {
      throw error;
    }
  },
  loadCommentsSuccess: (comments: ICommentResponse[]) =>
    createAction(LOAD_COMMENTS_SUCCESS, { comments }),
  loadReplies: (
    collectionId: number,
    commentId: number
  ): ThunkResult<Promise<void>> => async dispatch => {
    try {
      const res = await CommentAPI.getCommentReplies(collectionId, commentId);
      await dispatch(actions.loadRepliesSuccess(commentId, res.data));
    } catch (error) {
      throw error;
    }
  },
  loadRepliesSuccess: (replyTo: number, replies: ICommentResponse[]) =>
    createAction(LOAD_REPLIES_SUCCESS, { replies }, { replyTo }),
  createCommentOrReply: (
    collectionId: number,
    data: ICommentRequest
  ): ThunkResult<Promise<void>> => async dispatch => {
    try {
      const res = await CommentAPI.createComment(collectionId, data);
      data.replyTo
        ? await dispatch(actions.createReply(res.data, data.replyTo))
        : await dispatch(actions.createComment(res.data));
    } catch (error) {
      throw error;
    }
  },
  createComment: (comment: ICommentResponse) =>
    createAction(CREATE_COMMENT, { comment }),
  createReply: (reply: ICommentResponse, replyTo: number) =>
    createAction(CREATE_REPLY, { reply }, { replyTo }),
  updateCommentOrReply: (
    commentId: number,
    data: ICommentRequest
  ): ThunkResult<Promise<void>> => async dispatch => {
    try {
      const res = await CommentAPI.updateCommentById(commentId, data);
      data.replyTo
        ? await dispatch(actions.updateReply(res.data, data.replyTo))
        : await dispatch(actions.updateComment(res.data));
    } catch (error) {
      throw error;
    }
  },
  updateComment: (comment: ICommentResponse) =>
    createAction(UPDATE_COMMENT, { comment }),
  updateReply: (reply: ICommentResponse, replyTo: number) =>
    createAction(UPDATE_REPLY, { reply }, { replyTo }),
  removeCommentOrReply: (
    commentId: number,
    replyTo?: number
  ): ThunkResult<Promise<void>> => async dispatch => {
    try {
      await CommentAPI.removeCommentById(commentId);
      replyTo
        ? await dispatch(actions.removeReply(commentId, replyTo))
        : await dispatch(actions.removeComment(commentId));
    } catch (error) {
      throw error;
    }
  },
  removeComment: (commentId: number) =>
    createAction(REMOVE_COMMENT, { commentId }),
  removeReply: (replyId: number, replyTo: number) =>
    createAction(REMOVE_REPLY, { replyId }, { replyTo })
};
export type CollectionAction = ActionType<typeof actions>;

// state
export interface CollectionState {
  collection: ICollectionResponse | null;
  items: IItemResponse[] | null;
  comments: ICommentResponse[] | null;
  replies: Map<ICommentResponse['id'], ICommentResponse[]>;
}
const initialState: CollectionState = {
  collection: null,
  items: null,
  comments: null,
  replies: new Map()
};

// reducer
export default produce<CollectionState, CollectionAction>((draft, action) => {
  switch (action.type) {
    case INITIALIZE: {
      return initialState;
    }
    case LOAD_COLLECTION_PENDING: {
      draft.collection = null;
      return;
    }
    case LOAD_COLLECTION_SUCCESS: {
      draft.collection = action.payload;
      return;
    }
    case LOAD_COLLECTION_FAILURE: {
      console.log(action.payload);
      return;
    }
    case LOAD_ITEMS_PENDING: {
      draft.items = null;
      return;
    }
    case LOAD_ITEMS_SUCCESS: {
      draft.items = action.payload;
      return;
    }
    case LOAD_ITEMS_FAILURE: {
      console.log(action.payload);
      return;
    }
    case UPDATE_COLLECTION_SUCCESS: {
      draft.collection = action.payload.collection;
      return;
    }
    case UPDATE_ITEM_POSITION_PENDING: {
      // do nothing
      return;
    }
    case UPDATE_ITEM_POSITION_SUCCESS: {
      draft.items = action.payload;
      return;
    }
    case UPDATE_ITEM_POSITION_FAILURE: {
      console.log(action.payload);
      return;
    }
    case UPDATE_ITEM: {
      if (!draft.items) {
        return;
      }
      const index = draft.items.findIndex(
        item => item.id === action.payload.itemId
      );
      if (index === -1) {
        return;
      }
      const { title, description, tags } = action.payload.data;
      draft.items[index].title = title;
      draft.items[index].description = description;
      draft.items[index].tags = tags;
      return;
    }
    case ADD_ITEM_SUCCESS: {
      if (!draft.items) {
        return;
      }
      draft.items.push(action.payload.item);
      return;
    }
    case REMOVE_ITEM: {
      if (!draft.items) {
        return;
      }
      const index = draft.items.findIndex(
        item => item.id === action.payload.itemId
      );
      if (index === -1) {
        return;
      }
      draft.items.splice(index, 1);
      return;
    }
    case CREATE_BOOKMARK_SUCCESS: {
      if (!draft.collection) {
        return;
      }
      draft.collection.isBookmarked = true;
      draft.collection.bookmarks++;
      return;
    }
    case REMOVE_BOOKMARK_SUCCESS: {
      if (!draft.collection) {
        return;
      }
      draft.collection.isBookmarked = false;
      draft.collection.bookmarks--;
      return;
    }
    case LOAD_COMMENTS_SUCCESS: {
      draft.comments = action.payload.comments;
      return;
    }
    case LOAD_REPLIES_SUCCESS: {
      const replies = new Map(draft.replies);
      replies.set(action.meta.replyTo, action.payload.replies);
      draft.replies = replies;
      return;
    }
    case CREATE_COMMENT: {
      if (!draft.comments || !draft.collection) {
        return;
      }
      draft.comments.push(action.payload.comment);
      draft.collection.comments++;
      return;
    }
    case CREATE_REPLY: {
      const { replyTo } = action.meta;
      if (!draft.comments || !draft.collection) {
        return;
      }
      const parentIndex = draft.comments.findIndex(
        comment => comment.id === replyTo
      );
      draft.comments[parentIndex].replies++;
      draft.collection.comments++;

      const replies = new Map(draft.replies);
      const replyList = replies.get(replyTo);
      if (!replyList) {
        return;
      }
      replyList.push(action.payload.reply);
      replies.set(replyTo, replyList);
      draft.replies = replies;
      return;
    }
    case UPDATE_COMMENT: {
      const { comment: updatedComment } = action.payload;
      if (!draft.comments) {
        return;
      }
      const index = draft.comments.findIndex(
        comment => comment.id === updatedComment.id
      );
      if (index === -1) {
        return;
      }
      draft.comments[index].text = updatedComment.text; // update text only
      return;
    }
    case UPDATE_REPLY: {
      const { reply: updatedReply } = action.payload;
      const { replyTo } = action.meta;
      const replies = new Map(draft.replies);
      const replyList = replies.get(replyTo);
      if (!replyList) {
        return;
      }
      const index = replyList.findIndex(reply => reply.id === updatedReply.id);
      if (index === -1) {
        return;
      }
      replyList[index].text = updatedReply.text; // update text only
      replies.set(replyTo, replyList);
      draft.replies = replies;
      return;
    }
    case REMOVE_COMMENT: {
      const { commentId } = action.payload;
      if (!draft.comments || !draft.collection) {
        return;
      }
      const index = draft.comments.findIndex(
        comment => comment.id === commentId
      );
      if (index === -1) {
        return;
      }
      draft.comments.splice(index, 1);
      draft.collection.comments--;
      return;
    }
    case REMOVE_REPLY: {
      const { replyId } = action.payload;
      const { replyTo } = action.meta;
      if (!draft.comments || !draft.collection) {
        return;
      }
      const parentIndex = draft.comments.findIndex(
        comment => comment.id === replyTo
      );
      draft.comments[parentIndex].replies--;
      draft.collection.comments--;

      const replies = new Map(draft.replies);
      const replyList = replies.get(replyTo);
      if (!replyList) {
        return;
      }
      const index = replyList.findIndex(reply => reply.id === replyId);
      if (index === -1) {
        return;
      }
      replyList.splice(index, 1);
      replies.set(replyTo, replyList);
      draft.replies = replies;
      return;
    }
  }
}, initialState);
