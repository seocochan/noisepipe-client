import { AxiosResponse } from 'axios';
import { ILoginRequest, ISignupReqeust, IUserIdentityAvailability } from 'payloads';
import request from 'utils/api';
import { ACCESS_TOKEN } from 'values';

export const login = (loginRequest: ILoginRequest) => {
  return request({ url: '/auth/signin', method: 'post', data: loginRequest });
};

export const getCurrentUser = () => {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject('액세스 토큰이 없습니다');
  }
  return request({ url: '/users/me', method: 'get' });
};

export const signup = (signupRequest: ISignupReqeust) => {
  return request({ url: '/auth/signup', method: 'post', data: signupRequest });
};

export const checkUsernameAvailability = (
  username: string
): Promise<AxiosResponse<IUserIdentityAvailability>> => {
  return request({
    url: `/users/checkUsernameAvailability?username=${username}`,
    method: 'get'
  });
};

export const getUserProfile = (username: string) => {
  return request({ url: `/users/${username}`, method: 'get' });
};
