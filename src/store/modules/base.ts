import produce from 'immer';
import { IItemResponse } from 'payloads';
import { action as createAction, ActionType } from 'typesafe-actions';

// action types
const SHOW_ITEM_PANEL = 'base/SHOW_ITEM_PANEL';
const HIDE_ITEM_PANEL = 'base/HIDE_ITEM_PANEL';

// action creators
export const actions = {
  showItemPanel: (item: IItemResponse | null) =>
    createAction(SHOW_ITEM_PANEL, { item }),
  hideItemPanel: () => createAction(HIDE_ITEM_PANEL)
};
export type BaseAction = ActionType<typeof actions>;

// state
export interface BaseState {
  itemPanel: { collapsed: boolean; item: IItemResponse | null };
}
const initialState: BaseState = {
  itemPanel: { collapsed: true, item: null }
};

// reducer
export default produce<BaseState, BaseAction>((draft, action) => {
  switch (action.type) {
    case SHOW_ITEM_PANEL:
      draft.itemPanel.collapsed = false;
      draft.itemPanel.item = action.payload.item;
      return;
    case HIDE_ITEM_PANEL:
      draft.itemPanel.collapsed = true;
      draft.itemPanel.item = null;
      return;
  }
}, initialState);
