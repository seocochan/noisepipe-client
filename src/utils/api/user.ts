import { AxiosResponse } from 'axios';
import { IPagedResponse, IUserIdentityAvailability, IUserProfile, IUserSummary } from 'payloads';
import request from 'utils/api';
import { ACCESS_TOKEN } from 'values';

export const getCurrentUser = (): Promise<AxiosResponse<IUserSummary>> => {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject('액세스 토큰이 없습니다');
  }
  return request({ url: '/users/me', method: 'get' });
};

export const checkUsernameAvailability = (
  username: string
): Promise<AxiosResponse<IUserIdentityAvailability>> => {
  return request({
    url: `/users/checkUsernameAvailability?username=${username}`,
    method: 'get'
  });
};

export const getUserProfile = (
  username: string
): Promise<AxiosResponse<IUserProfile>> => {
  return request({ url: `/users/${username}`, method: 'get' });
};

export const searchUsers = (
  q: string,
  page: number,
  size: number
): Promise<AxiosResponse<IPagedResponse<IUserProfile>>> => {
  return request({
    url: `/users?q=${q}&page=${page}&size=${size}`,
    method: 'get'
  });
};
