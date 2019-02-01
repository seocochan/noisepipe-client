import { ILoginRequest, ISignupReqeust } from 'payloads';
import request from 'utils/api';

export const login = (loginRequest: ILoginRequest) => {
  return request({ url: '/auth/signin', method: 'post', data: loginRequest });
};

export const signup = (signupRequest: ISignupReqeust) => {
  return request({ url: '/auth/signup', method: 'post', data: signupRequest });
};
