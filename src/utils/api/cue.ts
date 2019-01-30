import { AxiosResponse } from 'axios';
import { ICueRequest, ICueResponse } from 'payloads';
import request from 'utils/api';

export const createCue = (
  itemId: number,
  data: ICueRequest
): Promise<AxiosResponse<ICueResponse>> => {
  return request({
    url: `/items/${itemId}/cues`,
    method: 'post',
    data
  });
};

export const getCuesByItem = (
  itemId: number
): Promise<AxiosResponse<ICueResponse[]>> => {
  return request({
    url: `/items/${itemId}/cues`,
    method: 'get'
  });
};

export const updateCueById = (
  cueId: number,
  data: ICueRequest
): Promise<AxiosResponse<ICueResponse>> => {
  return request({
    url: `/cues/${cueId}`,
    method: 'put',
    data
  });
};

export const removeCueById = (cueId: number): Promise<AxiosResponse<void>> => {
  return request({
    url: `/cues/${cueId}`,
    method: 'delete'
  });
};
