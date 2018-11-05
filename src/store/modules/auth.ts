import produce from 'immer';
import { ICurrentUserResponse } from 'payloads';
import { ThunkResult } from 'store';
import { action as createAction, ActionType } from 'typesafe-actions';
import * as API from 'utils/API';

// action types
const GET_CURRENT_USER_PENDING = 'auth/GET_CURRENT_USER_PENDING';
const GET_CURRENT_USER_SUCCESS = 'auth/GET_CURRENT_USER_SUCCESS';
const GET_CURRENT_USER_FAILURE = 'auth/GET_CURRENT_USER_FAILURE';
const LOGOUT = 'auth/LOGOUT';

// action creators
export const actions = {
  getCurrentUserPending: () => createAction(GET_CURRENT_USER_PENDING),
  getCurrentUserSuccess: (user: ICurrentUserResponse) =>
    createAction(GET_CURRENT_USER_SUCCESS, user),
  getCurrentUserFailure: () => createAction(GET_CURRENT_USER_FAILURE),
  getCurrnetUser: (): ThunkResult<Promise<void>> => async dispatch => {
    dispatch(actions.getCurrentUserPending());
    try {
      const res = await API.getCurrentUser();
      dispatch(actions.getCurrentUserSuccess(res.data));
    } catch (error) {
      dispatch(actions.getCurrentUserFailure());
    }
  },
  logout: () => createAction(LOGOUT)
};
export type AuthAction = ActionType<typeof actions>;

// state
export interface AuthState {
  currentUser?: ICurrentUserResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
const initialState: AuthState = {
  currentUser: null,
  isAuthenticated: false,
  isLoading: false
};

// reducer
export default produce<AuthState, AuthAction>((draft, action) => {
  switch (action.type) {
    case GET_CURRENT_USER_PENDING:
      draft.isLoading = true;
      return;
    case GET_CURRENT_USER_SUCCESS:
      draft.currentUser = action.payload;
      draft.isAuthenticated = true;
      draft.isLoading = false;
      return;
    case GET_CURRENT_USER_FAILURE:
      draft.isLoading = false;
      return;
    case LOGOUT:
      draft.currentUser = null;
      draft.isAuthenticated = false;
  }
}, initialState);
