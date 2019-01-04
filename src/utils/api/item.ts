import { AxiosResponse } from 'axios';
import { IItemPostRequest, IItemPutRequest, IItemResponse, IMediaDataResponse } from 'payloads';
import { Provider } from 'types';
import request from 'utils/api';

export const getMediaData = (
  sourceUrl: string,
  sourceProvider: Provider
): Promise<AxiosResponse<IMediaDataResponse>> => {
  return request({
    url: `/media?url=${encodeURIComponent(
      sourceUrl
    )}&provider=${sourceProvider}`,
    method: 'get'
  });
};

export const updateItem = (
  itemId: number,
  data: IItemPutRequest
): Promise<AxiosResponse<IItemResponse>> => {
  return request({
    url: `/items/${itemId}`,
    method: 'put',
    data
  });
};

export const createItem = (
  collectionId: number,
  data: IItemPostRequest
): Promise<AxiosResponse<IItemResponse>> => {
  return request({
    url: `/collections/${collectionId}/items`,
    method: 'post',
    data
  });
};

export const removeItem = (itemId: number) => {
  return request({
    url: `/items/${itemId}`,
    method: 'delete'
  });
};