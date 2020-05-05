import {
  IItemPostRequest,
  IItemPutRequest,
  IItemResponse,
  IItemSummary,
  IMediaDataResponse,
  IPagedResponse,
} from 'payloads';
import { Provider } from 'types';
import request from 'utils/api';

export const getMediaData = (sourceUrl: string, sourceProvider: Provider) => {
  return request<IMediaDataResponse>({
    url: `/media?url=${encodeURIComponent(sourceUrl)}&provider=${sourceProvider}`,
    method: 'get',
  });
};

export const updateItem = (itemId: number, data: IItemPutRequest) => {
  return request<IItemResponse>({
    url: `/items/${itemId}`,
    method: 'put',
    data,
  });
};

export const createItem = (collectionId: number, data: IItemPostRequest) => {
  return request<IItemResponse>({
    url: `/collections/${collectionId}/items`,
    method: 'post',
    data,
  });
};

export const removeItem = (itemId: number) => {
  return request<void>({
    url: `/items/${itemId}`,
    method: 'delete',
  });
};

export const searchItems = (q: string, page: number, size: number) => {
  return request<IPagedResponse<IItemSummary>>({
    url: `/items?q=${q}&page=${page}&size=${size}`,
    method: 'get',
  });
};
