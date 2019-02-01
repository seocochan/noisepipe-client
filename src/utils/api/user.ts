import { IPagedResponse, IUserIdentityAvailability, IUserProfile, IUserSummary } from 'payloads';
import request from 'utils/api';
import { ACCESS_TOKEN } from 'values';

export const getCurrentUser = () => {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject('액세스 토큰이 없습니다');
  }
  return request<IUserSummary>({ url: '/users/me', method: 'get' });
};

export const checkUsernameAvailability = (username: string) => {
  return request<IUserIdentityAvailability>({
    url: `/users/checkUsernameAvailability?username=${username}`,
    method: 'get'
  });
};

export const getUserProfile = (username: string) => {
  return request<IUserProfile>({ url: `/users/${username}`, method: 'get' });
};

export const searchUsers = (q: string, page: number, size: number) => {
  return request<IPagedResponse<IUserProfile>>({
    url: `/users?q=${q}&page=${page}&size=${size}`,
    method: 'get'
  });
};
