import produce from 'immer';
import { IItemPutRequest, IItemResponse } from 'payloads';
import { ThunkResult } from 'store';
import { action as createAction, ActionType } from 'typesafe-actions';
import * as ItemAPI from 'utils/api/item';

import { actions as CollectionActions } from './collection';

// action types
const SHOW_PANEL = 'item/SHOW_PANEL';
const HIDE_PANEL = 'item/HIDE_PANEL';
const SET_ITEM = 'item/SET_ITEM';
const UPDATE_ITEM_SUCCESS = 'item/UPDATE_ITEM_SUCCESS';

// action creators
export const actions = {
  showPanel: () => createAction(SHOW_PANEL),
  hidePanel: () => createAction(HIDE_PANEL),
  setItem: (item: IItemResponse | null) => createAction(SET_ITEM, { item }),
  updateItem: (
    itemId: number,
    data: IItemPutRequest
  ): ThunkResult<Promise<void>> => async dispatch => {
    try {
      const res = await ItemAPI.updateItem(itemId, data);
      dispatch(actions.updateItemSuccess(res.data));
      dispatch(CollectionActions.updateItem(itemId, data));
    } catch (error) {
      throw error;
    }
  },
  updateItemSuccess: (item: IItemResponse) =>
    createAction(UPDATE_ITEM_SUCCESS, { item })
};
export type ItemAction = ActionType<typeof actions>;

// state
export interface ItemState {
  itemPanel: { collapsed: boolean };
  item: IItemResponse | null;
  // cues: ICueResponse[];
}
const initialState: ItemState = {
  itemPanel: { collapsed: true },
  item: null
};

// reducer
export default produce<ItemState, ItemAction>((draft, action) => {
  switch (action.type) {
    case SHOW_PANEL: {
      draft.itemPanel.collapsed = false;
      return;
    }
    case HIDE_PANEL: {
      draft.itemPanel.collapsed = true;
      return;
    }
    case SET_ITEM: {
      draft.item = action.payload.item;
      return;
    }
    case UPDATE_ITEM_SUCCESS: {
      draft.item = action.payload.item;
      return;
    }
  }
}, initialState);
