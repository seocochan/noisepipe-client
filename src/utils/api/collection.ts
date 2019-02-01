import { AxiosResponse } from 'axios';
import { ICollectionRequest, ICollectionResponse, ICollectionSummary, IPagedResponse } from 'payloads';
import request from 'utils/api';

export const loadCollection = (
  collectionId: number
): Promise<AxiosResponse<ICollectionResponse>> => {
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

export const removeCollection = (
  collectionId: number
): Promise<AxiosResponse<void>> => {
  return request({
    url: `/collections/${collectionId}`,
    method: 'delete'
  });
};

// FIXME: remove pagination
export const loadItems = (collectionId: number, page = 0, size = 100) => {
  return request({
    url: `/collections/${collectionId}/items?page=${page}&size=${size}`,
    method: 'get'
  });
};

export const updateItemPosition = (
  itemId: number,
  position: number
): Promise<AxiosResponse<void>> => {
  return request({
    url: `/items/${itemId}/position`,
    method: 'put',
    data: position
  });
};

export const loadCollections = (
  username: string,
  size: number,
  offsetId?: number
): Promise<AxiosResponse<IPagedResponse<ICollectionSummary>>> => {
  return request({
    url: `/users/${username}/collections?${
      offsetId ? `offsetId=${offsetId}&` : ''
    }size=${size}`,
    method: 'get'
  });
};

export const createBookmark = (
  collectionId: number
): Promise<AxiosResponse<void>> => {
  return request({
    url: `/collections/${collectionId}/bookmarks`,
    method: 'post'
  });
};

export const removeBookmark = (
  collectionId: number
): Promise<AxiosResponse<void>> => {
  return request({
    url: `/collections/${collectionId}/bookmarks`,
    method: 'delete'
  });
};

export const getCollectionsBookmarkedByUser = (
  username: string,
  size: number,
  offsetId?: number
): Promise<AxiosResponse<IPagedResponse<ICollectionSummary>>> => {
  return request({
    url: `/users/${username}/bookmarks?${
      offsetId ? `offsetId=${offsetId}&` : ''
    }size=${size}`,
    method: 'get'
  });
};

export const searchCollections = (
  q: string,
  page: number,
  size: number
): Promise<AxiosResponse<IPagedResponse<ICollectionSummary>>> => {
  return request({
    url: `/collections?q=${q}&page=${page}&size=${size}`,
    method: 'get'
  });
};
