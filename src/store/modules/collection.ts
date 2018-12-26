import { AxiosError } from 'axios';
import produce from 'immer';
import { ICollectionResponse, ICommentResponse, IItemResponse } from 'payloads';
import { ThunkResult } from 'store';
import { action as createAction, ActionType } from 'typesafe-actions';
import * as CollectionAPI from 'utils/api/collection';
import * as Utils from 'utils/common';

// action types
const LOAD_COLLECTION_PENDING = 'collection/LOAD_COLLECTION_PENDING';
const LOAD_COLLECTION_SUCCESS = 'collection/LOAD_COLLECTION_SUCCESS';
const LOAD_COLLECTION_FAILURE = 'collection/LOAD_COLLECTION_FAILURE';
const LOAD_ITEMS_PENDING = 'collection/LOAD_ITEMS_PENDING';
const LOAD_ITEMS_SUCCESS = 'collection/LOAD_ITEMS_SUCCESS';
const LOAD_ITEMS_FAILURE = 'collection/LOAD_ITEMS_FAILURE';
const UPDATE_ITEM_POSITION_PENDING = 'collection/UPDATE_ITEM_POSITION_PENDING';
const UPDATE_ITEM_POSITION_SUCCESS = 'collection/UPDATE_ITEM_POSITION_SUCCESS';
const UPDATE_ITEM_POSITION_FAILURE = 'collection/UPDATE_ITEM_POSITION_FAILURE';

// action creators
export const actions = {
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
    createAction(UPDATE_ITEM_POSITION_FAILURE, error)

  // TODO: loadComments: ICommentResponse[]
};
export type CollectionAction = ActionType<typeof actions>;

// state
export interface CollectionState {
  collection: ICollectionResponse | null;
  items: IItemResponse[] | null;
  comments: ICommentResponse[] | null;
}
const initialState: CollectionState = {
  collection: null,
  items: null,
  comments: null
};

// reducer
export default produce<CollectionState, CollectionAction>((draft, action) => {
  switch (action.type) {
    case LOAD_COLLECTION_PENDING:
      draft.collection = null;
      return;
    case LOAD_COLLECTION_SUCCESS:
      draft.collection = action.payload;
      return;
    case LOAD_COLLECTION_FAILURE:
      console.log(action.payload);
      return;
    case LOAD_ITEMS_PENDING:
      draft.items = null;
      return;
    case LOAD_ITEMS_SUCCESS:
      draft.items = action.payload;
      return;
    case LOAD_ITEMS_FAILURE:
      console.log(action.payload);
      return;
    case UPDATE_ITEM_POSITION_PENDING:
      // do nothing
      return;
    case UPDATE_ITEM_POSITION_SUCCESS:
      draft.items = action.payload;
      return;
    case UPDATE_ITEM_POSITION_FAILURE:
      console.log(action.payload);
      return;
  }
}, initialState);