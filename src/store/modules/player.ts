import ReactPlayer from 'react-player';

import produce from 'immer';
import { IItemResponse } from 'payloads';
import { action as createAction, ActionType } from 'typesafe-actions';

// action types
const INITIALIZE = 'player/INITIALIZE';
const SET_REF = 'player/SET_REF';
const SET_CURRENT_ITEM = 'player/SET_CURRENT_ITEM';
const PLAY = 'player/PLAY';
const PAUSE = 'player/PAUSE';
const STOP = 'player/STOP';
const UPDATE_PROGRESS = 'player/UPDATE_PROGRESS';

// action creators
export const actions = {
  initialize: (duration: number) => createAction(INITIALIZE, { duration }),
  setRef: (ref: any | null) => createAction(SET_REF, { ref }),
  setCurrentItem: (item: IItemResponse | null) =>
    createAction(SET_CURRENT_ITEM, { item }),
  play: () => createAction(PLAY),
  pause: () => createAction(PAUSE),
  stop: () => createAction(STOP),
  updateProgress: (played: number, playedSeconds: number) =>
    createAction(UPDATE_PROGRESS, { played, playedSeconds })
};
export type PlayerAction = ActionType<typeof actions>;

// state
export interface PlayerState {
  ref: ReactPlayer | null;
  currentItem: IItemResponse | null;
  status: {
    playing: boolean;
    duration: number;
    played: number;
    playedSeconds: number;
  };
}
const initialState: PlayerState = {
  ref: null,
  currentItem: null,
  status: { playing: false, duration: 0, played: 0, playedSeconds: 0 }
};

// reducer
export default produce<PlayerState, PlayerAction>((draft, action) => {
  switch (action.type) {
    case INITIALIZE:
      draft.status.duration = action.payload.duration;
      draft.status.played = 0;
      draft.status.playedSeconds = 0;
      return;
    case SET_REF:
      draft.ref = action.payload.ref;
      return;
    case SET_CURRENT_ITEM:
      draft.currentItem = action.payload.item;
      draft.status.played = 0; // @
      draft.status.playedSeconds = 0; // @
      return;
    case PLAY:
      draft.status.playing = true;
      return;
    case PAUSE:
      draft.status.playing = false;
      return;
    case STOP:
      draft.currentItem = null;
      draft.status = {
        playing: false,
        duration: 0,
        played: 0,
        playedSeconds: 0
      };
      return;
    case UPDATE_PROGRESS:
      draft.status.played = action.payload.played;
      draft.status.playedSeconds = action.payload.playedSeconds;
      return;
  }
}, initialState);