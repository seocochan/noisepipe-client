import produce from 'immer';
import { IItemResponse } from 'payloads';
import { action as createAction, ActionType } from 'typesafe-actions';

// action types
const SHOW_PANEL = 'item/SHOW_PANEL';
const HIDE_PANEL = 'item/HIDE_PANEL';
const SET_ITEM = 'item/SET_ITEM';

// action creators
export const actions = {
  showPanel: () => createAction(SHOW_PANEL),
  hidePanel: () => createAction(HIDE_PANEL),
  setItem: (item: IItemResponse | null) => createAction(SET_ITEM, { item })
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
    case SHOW_PANEL:
      draft.itemPanel.collapsed = false;
      return;
    case HIDE_PANEL:
      draft.itemPanel.collapsed = true;
      return;
    case SET_ITEM:
      draft.item = action.payload.item;
      return;
  }
}, initialState);
