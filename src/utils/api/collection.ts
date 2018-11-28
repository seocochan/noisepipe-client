import request from 'utils/api';

export const loadCollection = (collectionId: number) => {
  return request({
    url: `/collections/${collectionId}`,
    method: 'get'
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
