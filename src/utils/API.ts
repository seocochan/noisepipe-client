import axios from 'axios';
import { ILoginRequest, ISignupReqeust } from 'payloads';
import { ACCESS_TOKEN } from 'values';

interface IRequestHeaders {
  'Content-Type': string;
  Authorization?: string;
}

interface IRequestOptions {
  url: string;
  method: 'get' | 'post' | 'put' | 'delete';
  data?: any;
}

const req = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL
});

const request = async (options: IRequestOptions) => {
  let headers: IRequestHeaders = { 'Content-Type': 'application/json' };

  const token = localStorage.getItem(ACCESS_TOKEN);
  if (token) {
    headers = { ...headers, Authorization: `Bearer ${token}` };
  }

  try {
    const res = await req({ headers, ...options });
    return res;
  } catch (error) {
    return Promise.reject(error);
  }
};

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

export const checkUsernameAvailability = (username: string) => {
  return request({
    url: `/users/checkUsernameAvailability?username=${username}`,
    method: 'get'
  });
};

export const checkEmailAvailability = (email: string) => {
  return request({
    url: `/users/checkEmailAvailability?email=${email}`,
    method: 'get'
  });
};

export const getUserProfile = (username: string) => {
  return request({ url: `/users/${username}`, method: 'get' });
};
