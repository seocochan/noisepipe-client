import produce from 'immer';
import { ICueRequest, ICueResponse, IItemPutRequest, IItemResponse } from 'payloads';
import { ThunkResult } from 'store';
import { Tab } from 'types';
import { action as createAction, ActionType } from 'typesafe-actions';
import * as CueAPI from 'utils/api/cue';
import * as ItemAPI from 'utils/api/item';

import { actions as CollectionActions } from './collection';

// action types
const INITIALIZE = 'item/INITIALIZE';
const CLEAR = 'item/CLEAR';
const SHOW_PANEL = 'item/SHOW_PANEL';
const HIDE_PANEL = 'item/HIDE_PANEL';
const CHANGE_TAB = 'item/CHANGE_TAB';
const SET_ITEM = 'item/SET_ITEM';
const UPDATE_ITEM_SUCCESS = 'item/UPDATE_ITEM_SUCCESS';
const LOAD_CUES_SUCCESS = 'item/LOAD_CUES_SUCCESS';

// action creators
export const actions = {
  initialize: () => createAction(INITIALIZE),
  clear: () => createAction(CLEAR),
  showPanel: () => createAction(SHOW_PANEL),
  hidePanel: () => createAction(HIDE_PANEL),
  changeTab: (tab: Tab) => createAction(CHANGE_TAB, { tab }),
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
    createAction(UPDATE_ITEM_SUCCESS, { item }),
  removeItem: (
    itemId: number
  ): ThunkResult<Promise<void>> => async dispatch => {
    try {
      await ItemAPI.removeItem(itemId);
      dispatch(actions.initialize());
      dispatch(CollectionActions.removeItem(itemId));
    } catch (error) {
      throw error;
    }
  },
  loadCues: (itemId: number): ThunkResult<Promise<void>> => async dispatch => {
    try {
      const res = await CueAPI.getCuesByItem(itemId);
      dispatch(actions.loadCuesSuccess(res.data));
    } catch (error) {
      throw error;
    }
  },
  loadCuesSuccess: (cues: ICueResponse[]) =>
    createAction(LOAD_CUES_SUCCESS, { cues }),
  createCue: (
    itemId: number,
    data: ICueRequest
  ): ThunkResult<Promise<void>> => async dispatch => {
    try {
      await CueAPI.createCue(itemId, data); // ignore res.data
      await dispatch(actions.loadCues(itemId)); // re-load cues
    } catch (error) {
      throw error;
    }
  },
  updateCue: (
    cueId: number,
    data: ICueRequest
  ): ThunkResult<Promise<void>> => async (dispatch, getState) => {
    try {
      const item = getState().item.item as IItemResponse;
      await CueAPI.updateCueById(cueId, data); // ignore res.data
      await dispatch(actions.loadCues(item.id)); // re-load cues
    } catch (error) {
      throw error;
    }
  },
  removeCue: (cueId: number): ThunkResult<Promise<void>> => async (
    dispatch,
    getState
  ) => {
    try {
      const item = getState().item.item as IItemResponse;
      await CueAPI.removeCueById(cueId);
      await dispatch(actions.loadCues(item.id)); // re-load cues
    } catch (error) {
      throw error;
    }
  }
};
export type ItemAction = ActionType<typeof actions>;

// state
export interface ItemState {
  itemPanel: { collapsed: boolean; tab: Tab };
  item: IItemResponse | null;
  cues: ICueResponse[] | null;
}
const initialState: ItemState = {
  itemPanel: { collapsed: true, tab: Tab.Viewer },
  item: null,
  cues: null
};

// reducer
export default produce<ItemState, ItemAction>((draft, action) => {
  switch (action.type) {
    case INITIALIZE: {
      return initialState;
    }
    case CLEAR: {
      draft.item = null;
      draft.cues = null;
    }
    case SHOW_PANEL: {
      draft.itemPanel.collapsed = false;
      return;
    }
    case HIDE_PANEL: {
      draft.itemPanel.collapsed = true;
      return;
    }
    case CHANGE_TAB: {
      draft.itemPanel.tab = action.payload.tab;
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
    case LOAD_CUES_SUCCESS: {
      draft.cues = action.payload.cues;
      return;
    }
  }
}, initialState);
