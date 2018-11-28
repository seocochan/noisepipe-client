import axios from 'axios';
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

export default request;
