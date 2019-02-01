import { ICollectionRequest, ICollectionResponse, ICollectionSummary, IPagedResponse } from 'payloads';
import request from 'utils/api';

export const loadCollection = (collectionId: number) => {
  return request<ICollectionResponse>({
    url: `/collections/${collectionId}`,
    method: 'get'
  });
};

export const createCollection = (
  username: string,
  data: ICollectionRequest
) => {
  return request<ICollectionResponse>({
    url: `/users/${username}/collections`,
    method: 'post',
    data
  });
};

export const updateCollection = (
  collectionId: number,
  data: ICollectionRequest
) => {
  return request<ICollectionResponse>({
    url: `/collections/${collectionId}`,
    method: 'put',
    data
  });
};

export const removeCollection = (collectionId: number) => {
  return request<void>({
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

export const updateItemPosition = (itemId: number, position: number) => {
  return request<void>({
    url: `/items/${itemId}/position`,
    method: 'put',
    data: position
  });
};

export const loadCollections = (
  username: string,
  size: number,
  offsetId?: number
) => {
  return request<IPagedResponse<ICollectionSummary>>({
    url: `/users/${username}/collections?${
      offsetId ? `offsetId=${offsetId}&` : ''
    }size=${size}`,
    method: 'get'
  });
};

export const createBookmark = (collectionId: number) => {
  return request<void>({
    url: `/collections/${collectionId}/bookmarks`,
    method: 'post'
  });
};

export const removeBookmark = (collectionId: number) => {
  return request<void>({
    url: `/collections/${collectionId}/bookmarks`,
    method: 'delete'
  });
};

export const getCollectionsBookmarkedByUser = (
  username: string,
  size: number,
  offsetId?: number
) => {
  return request<IPagedResponse<ICollectionSummary>>({
    url: `/users/${username}/bookmarks?${
      offsetId ? `offsetId=${offsetId}&` : ''
    }size=${size}`,
    method: 'get'
  });
};

export const searchCollections = (q: string, page: number, size: number) => {
  return request<IPagedResponse<ICollectionSummary>>({
    url: `/collections?q=${q}&page=${page}&size=${size}`,
    method: 'get'
  });
};
