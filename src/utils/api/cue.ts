import { ICueRequest, ICueResponse } from 'payloads';
import request from 'utils/api';

export const createCue = (itemId: number, data: ICueRequest) => {
  return request<ICueResponse>({
    url: `/items/${itemId}/cues`,
    method: 'post',
    data
  });
};

export const getCuesByItem = (itemId: number) => {
  return request<ICueResponse[]>({
    url: `/items/${itemId}/cues`,
    method: 'get'
  });
};

export const updateCueById = (cueId: number, data: ICueRequest) => {
  return request<ICueResponse>({
    url: `/cues/${cueId}`,
    method: 'put',
    data
  });
};

export const removeCueById = (cueId: number) => {
  return request<void>({
    url: `/cues/${cueId}`,
    method: 'delete'
  });
};
