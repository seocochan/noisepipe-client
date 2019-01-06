import ReactPlayer from 'react-player';

import produce from 'immer';
import { IItemResponse } from 'payloads';
import { action as createAction, ActionType } from 'typesafe-actions';

// action types
const INITIALIZE = 'player/INITIALIZE';
const SET_DURATION = 'player/SET_DURATION';
const SET_REF = 'player/SET_REF';
const SET_CURRENT_ITEM = 'player/SET_CURRENT_ITEM';
const PLAY = 'player/PLAY';
const PAUSE = 'player/PAUSE';
const STOP = 'player/STOP';
const UPDATE_PROGRESS = 'player/UPDATE_PROGRESS';
const SET_DRAWER_VISIBLE = 'player/SET_DRAWER_VISIBLE';

// action creators
export const actions = {
  initialize: () => createAction(INITIALIZE),
  setDuration: (duration: number) => createAction(SET_DURATION, { duration }),
  setRef: (ref: any | null) => createAction(SET_REF, { ref }),
  setCurrentItem: (item: IItemResponse | null) =>
    createAction(SET_CURRENT_ITEM, { item }),
  play: () => createAction(PLAY),
  pause: () => createAction(PAUSE),
  stop: () => createAction(STOP),
  updateProgress: (played: number, playedSeconds: number) =>
    createAction(UPDATE_PROGRESS, { played, playedSeconds }),
  setDrawerVisible: (visible: boolean) =>
    createAction(SET_DRAWER_VISIBLE, { visible })
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
  drawer: {
    visible: boolean;
  };
}
const initialState: PlayerState = {
  ref: null,
  currentItem: null,
  status: { playing: false, duration: 0, played: 0, playedSeconds: 0 },
  drawer: { visible: false }
};

// reducer
export default produce<PlayerState, PlayerAction>((draft, action) => {
  switch (action.type) {
    case INITIALIZE: {
      draft.status.played = 0;
      draft.status.playedSeconds = 0;
      return;
    }
    case SET_DURATION: {
      draft.status.duration = action.payload.duration;
      return;
    }
    case SET_REF: {
      draft.ref = action.payload.ref;
      return;
    }
    case SET_CURRENT_ITEM: {
      draft.currentItem = action.payload.item;
      draft.status.played = 0;
      draft.status.playedSeconds = 0;
      return;
    }
    case PLAY: {
      draft.status.playing = true;
      return;
    }
    case PAUSE: {
      draft.status.playing = false;
      return;
    }
    case STOP: {
      draft.currentItem = null;
      draft.status = {
        playing: false,
        duration: 0,
        played: 0,
        playedSeconds: 0
      };
      return;
    }
    case UPDATE_PROGRESS: {
      const { played, playedSeconds } = action.payload;
      draft.status.played = played;
      draft.status.playedSeconds = playedSeconds;
      return;
    }
    case SET_DRAWER_VISIBLE: {
      draft.drawer.visible = action.payload.visible;
      return;
    }
  }
}, initialState);
