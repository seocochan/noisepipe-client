import { AxiosResponse } from 'axios';
import { ICollectionRequest, ICollectionResponse, ICollectionSummary, IPagedResponse } from 'payloads';
import request from 'utils/api';

export const loadCollection = (collectionId: number) => {
  return request({
    url: `/collections/${collectionId}`,
    method: 'get'
  });
};

export const createCollection = (
  username: string,
  data: ICollectionRequest
): Promise<AxiosResponse<ICollectionResponse>> => {
  return request({
    url: `/users/${username}/collections`,
    method: 'post',
    data
  });
};

export const updateCollection = (
  collectionId: number,
  data: ICollectionRequest
): Promise<AxiosResponse<ICollectionResponse>> => {
  return request({
    url: `/collections/${collectionId}`,
    method: 'put',
    data
  });
};

export const removeCollection = (collectionId: number) => {
  return request({
    url: `/collections/${collectionId}`,
    method: 'delete'
  });
};

export const loadItems = (collectionId: number, page = 0, size = 100) => {
  return request({
    url: `/collections/${collectionId}/items?page=${page}&size=${size}`,
    method: 'get'
  });
};

export const updateItemPosition = (itemId: number, position: number) => {
  return request({
    url: `/items/${itemId}/position`,
    method: 'put',
    data: position
  });
};

export const loadCollections = (
  username: string,
  page: number,
  size: number
): Promise<AxiosResponse<IPagedResponse<ICollectionSummary>>> => {
  return request({
    url: `/users/${username}/collections?page=${page}&size=${size}`,
    method: 'get'
  });
};
