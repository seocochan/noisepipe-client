import { AxiosError } from 'axios';
import produce from 'immer';
import { ICollectionResponse, ICommentResponse, IItemPutRequest, IItemResponse } from 'payloads';
import { ThunkResult } from 'store';
import { Provider } from 'types';
import { action as createAction, ActionType } from 'typesafe-actions';
import * as CollectionAPI from 'utils/api/collection';
import * as ItemAPI from 'utils/api/item';
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
const UPDATE_ITEM = 'collection/UPDATE_ITEM';
const ADD_ITEM_SUCESS = 'collection/ADD_ITEM_SUESS';

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
    createAction(ADD_ITEM_SUCESS, { item })
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
    case ADD_ITEM_SUCESS: {
      if (!draft.items) {
        return;
      }
      draft.items.push(action.payload.item);
      return;
    }
  }
}, initialState);
