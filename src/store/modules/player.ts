import ReactPlayer from 'react-player';

import produce from 'immer';
import { IItemResponse } from 'payloads';
import { ThunkResult } from 'store';
import { Provider } from 'types';
import { action as createAction, ActionType } from 'typesafe-actions';

// action types
const INITIALIZE = 'player/INITIALIZE';
const INITIALIZE_PLAYER = 'player/INITIALIZE_PLAYER';
const CLOSE = 'player/CLOSE';
const SET_DURATION = 'player/SET_DURATION';
const SET_REF = 'player/SET_REF';
const SET_ITEM = 'player/SET_ITEM';
const PLAY = 'player/PLAY';
const PAUSE = 'player/PAUSE';
const STOP = 'player/STOP';
const UPDATE_PROGRESS = 'player/UPDATE_PROGRESS';
const SET_DRAWER_VISIBLE = 'player/SET_DRAWER_VISIBLE';
const SET_LOADING = 'player/SET_LOADING';

// action creators
export const actions = {
  initialize: () => createAction(INITIALIZE),
  initializePlayer: (target: Provider) =>
    createAction(INITIALIZE_PLAYER, { target }),
  close: () => createAction(CLOSE),
  setDuration: (target: Provider, duration: number) =>
    createAction(SET_DURATION, { target, duration }),
  setRef: (target: Provider, ref: any | null) =>
    createAction(SET_REF, { target, ref }),
  setItem: (target: Provider, item: IItemResponse | null) =>
    createAction(SET_ITEM, { target, item }),
  play: (target: Provider) => createAction(PLAY, { target }),
  pause: (target: Provider) => createAction(PAUSE, { target }),
  stop: (target: Provider) => createAction(STOP, { target }),
  updateProgress: (target: Provider, played: number, playedSeconds: number) =>
    createAction(UPDATE_PROGRESS, { target, played, playedSeconds }),
  setDrawerVisible: (visible: boolean) =>
    createAction(SET_DRAWER_VISIBLE, { visible }),
  stopOthers: (target: Provider): ThunkResult<void> => dispatch => {
    Object.keys(Provider).forEach(key => {
      const otherTarget = Provider[key];
      if (otherTarget !== target) {
        dispatch(actions.stop(otherTarget as Provider));
      }
    });
  },
  playNextOrPrev: (target: Provider, isNext = true): ThunkResult<void> => (
    dispatch,
    getState
  ) => {
    const currentItem = getState().player[target].item as IItemResponse | null;
    if (!currentItem) {
      return;
    }
    const items = getState().collection.items as IItemResponse[] | null;
    if (!items || items.length === 0) {
      return;
    }
    const currentIndex = items.findIndex(item => item.id === currentItem.id);
    if (currentIndex === -1) {
      return;
    }
    if (isNext && currentIndex === items.length - 1) {
      return;
    }
    if (!isNext && currentIndex === 0) {
      return;
    }

    const followingItem = items[currentIndex + (isNext ? 1 : -1)];
    const followingTarget = followingItem.sourceProvider;
    dispatch(actions.stopOthers(followingTarget));
    dispatch(actions.setItem(followingTarget, followingItem));
  },
  setLoading: (loading: boolean) => createAction(SET_LOADING, { loading })
};
export type PlayerAction = ActionType<typeof actions>;

// state
interface Player {
  ref: ReactPlayer | null;
  item: IItemResponse | null;
  status: {
    playing: boolean;
    duration: number;
    played: number;
    playedSeconds: number;
  };
}
const playerInitialState: Player = {
  ref: null,
  item: null,
  status: { playing: false, duration: 0, played: 0, playedSeconds: 0 }
};
export interface PlayerState {
  [Provider.Youtube]: Player;
  [Provider.Soundcloud]: Player;
  currentTarget: Provider | null;
  loading: boolean;
  drawer: {
    visible: boolean;
  };
}
const initialState: PlayerState = {
  [Provider.Youtube]: playerInitialState,
  [Provider.Soundcloud]: playerInitialState,
  currentTarget: null,
  loading: true,
  drawer: { visible: false }
};

// reducer
export default produce<PlayerState, PlayerAction>((draft, action) => {
  switch (action.type) {
    case INITIALIZE: {
      return initialState;
    }
    case CLOSE: {
      // Initialize states except Player.ref and drawer.visible
      draft[Provider.Youtube].item = playerInitialState.item;
      draft[Provider.Youtube].status = playerInitialState.status;
      draft[Provider.Soundcloud].item = playerInitialState.item;
      draft[Provider.Soundcloud].status = playerInitialState.status;
      draft.currentTarget = initialState.currentTarget;
      draft.drawer.visible = false;
      return;
    }
    case INITIALIZE_PLAYER: {
      const { target } = action.payload;
      draft[target].status.played = 0;
      draft[target].status.playedSeconds = 0;
      return;
    }
    case SET_DURATION: {
      const { target, duration } = action.payload;
      draft[target].status.duration = duration;
      return;
    }
    case SET_REF: {
      const { target, ref } = action.payload;
      draft[target].ref = ref;
      return;
    }
    case SET_ITEM: {
      const { target, item } = action.payload;
      if (!draft.currentTarget) {
        // If drawer's never been rendered yet after initializing,
        // open it to prevent AudioContext issue.
        draft.drawer.visible = true;
      }
      draft.loading = true; // will be set to false at onReady()
      draft.currentTarget = target;
      draft[target].item = item;
      draft[target].status.played = 0;
      draft[target].status.playedSeconds = 0;
      return;
    }
    case PLAY: {
      const { target } = action.payload;
      draft[target].status.playing = true;
      return;
    }
    case PAUSE: {
      const { target } = action.payload;
      draft[target].status.playing = false;
      return;
    }
    case STOP: {
      const { target } = action.payload;
      draft[target].item = null;
      draft[target].status = {
        playing: false,
        duration: 0,
        played: 0,
        playedSeconds: 0
      };
      return;
    }
    case UPDATE_PROGRESS: {
      const { target, played, playedSeconds } = action.payload;
      draft[target].status.played = played;
      draft[target].status.playedSeconds = playedSeconds;
      return;
    }
    case SET_LOADING: {
      draft.loading = action.payload.loading;
      return;
    }
    case SET_DRAWER_VISIBLE: {
      draft.drawer.visible = action.payload.visible;
      return;
    }
  }
}, initialState);
