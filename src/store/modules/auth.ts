import { AxiosError } from 'axios';
import produce from 'immer';
import { IPasswordUpdateRequest, ISignupReqeust, IUserSummary } from 'payloads';
import { ThunkResult } from 'store';
import { action as createAction, ActionType } from 'typesafe-actions';
import * as AuthAPI from 'utils/api/auth';
import * as UserAPI from 'utils/api/user';

// action types
const GET_CURRENT_USER_PENDING = 'auth/GET_CURRENT_USER_PENDING';
const GET_CURRENT_USER_SUCCESS = 'auth/GET_CURRENT_USER_SUCCESS';
const GET_CURRENT_USER_FAILURE = 'auth/GET_CURRENT_USER_FAILURE';
const LOGOUT = 'auth/LOGOUT';

// action creators
export const actions = {
  signup: (data: ISignupReqeust): ThunkResult<Promise<void>> => async () => {
    try {
      await AuthAPI.signup(data);
    } catch (error) {
      throw error;
    }
  },
  getCurrentUserPending: () => createAction(GET_CURRENT_USER_PENDING),
  getCurrentUserSuccess: (user: IUserSummary) => createAction(GET_CURRENT_USER_SUCCESS, user),
  getCurrentUserFailure: (error: AxiosError) => createAction(GET_CURRENT_USER_FAILURE, error),
  getCurrnetUser: (): ThunkResult<Promise<void>> => async (dispatch) => {
    dispatch(actions.getCurrentUserPending());
    try {
      const res = await UserAPI.getCurrentUser();
      dispatch(actions.getCurrentUserSuccess(res.data));
    } catch (error) {
      dispatch(actions.getCurrentUserFailure(error));
      throw error;
    }
  },
  logout: () => createAction(LOGOUT),
  updatePassword: (data: IPasswordUpdateRequest): ThunkResult<Promise<void>> => async () => {
    try {
      await AuthAPI.updatePassword(data);
    } catch (error) {
      throw error;
    }
  },
};
export type AuthAction = ActionType<typeof actions>;

// state
export interface AuthState {
  currentUser?: IUserSummary | null;
  isLoading: boolean;
}
const initialState: AuthState = {
  currentUser: null,
  isLoading: true,
};

// reducer
export default produce<AuthState, AuthAction>((draft, action) => {
  switch (action.type) {
    case GET_CURRENT_USER_PENDING: {
      draft.isLoading = true;
      return;
    }
    case GET_CURRENT_USER_SUCCESS: {
      draft.currentUser = action.payload;
      draft.isLoading = false;
      return;
    }
    case GET_CURRENT_USER_FAILURE: {
      draft.isLoading = false;
      return;
    }
    case LOGOUT: {
      draft.currentUser = null;
      return;
    }
  }
}, initialState);
