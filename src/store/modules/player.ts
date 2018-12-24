import produce from 'immer';
import { IItemResponse } from 'payloads';
import { action as createAction, ActionType } from 'typesafe-actions';

// action types
const SET_CURRENT_ITEM = 'player/SET_CURRENT_ITEM';
const PLAY = 'player/PLAY';
const PAUSE = 'player/PAUSE';
const STOP = 'player/STOP';
// const UPDATE_TIME = 'player/UPDATE_TIME';

// action creators
export const actions = {
  setItem: (item: IItemResponse | null) =>
    createAction(SET_CURRENT_ITEM, { item }),
  play: () => createAction(PLAY),
  pause: () => createAction(PAUSE),
  stop: () => createAction(STOP)
};
export type PlayerAction = ActionType<typeof actions>;

// state
export interface PlayerState {
  currentItem: IItemResponse | null;
  status: { playing: boolean; playedTime: number };
}
const initialState: PlayerState = {
  currentItem: null,
  status: { playing: false, playedTime: 0 }
};

// reducer
export default produce<PlayerState, PlayerAction>((draft, action) => {
  switch (action.type) {
    case SET_CURRENT_ITEM:
      draft.currentItem = action.payload.item;
      return;
    case PLAY:
      draft.status.playing = true;
      return;
    case PAUSE:
      draft.status.playing = false;
      return;
    case STOP:
      draft.currentItem = null;
      draft.status.playing = false;
      return;
  }
}, initialState);
