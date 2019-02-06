import { ILoginRequest, IPasswordUpdateRequest, ISignupReqeust } from 'payloads';
import request from 'utils/api';

export const login = (data: ILoginRequest) => {
  return request({ url: '/auth/signin', method: 'post', data });
};

export const signup = (data: ISignupReqeust) => {
  return request({ url: '/auth/signup', method: 'post', data });
};

export const updatePassword = (data: IPasswordUpdateRequest) => {
  return request<void>({ url: '/auth/updatePassword', method: 'post', data });
};
