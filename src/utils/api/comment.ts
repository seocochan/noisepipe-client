import { ICommentRequest, ICommentResponse, ICommentSummary, IPagedResponse } from 'payloads';
import request from 'utils/api';

export const createComment = (collectionId: number, data: ICommentRequest) => {
  return request<ICommentResponse>({
    url: `/collections/${collectionId}/comments`,
    method: 'post',
    data,
  });
};

export const updateCommentById = (commentId: number, data: ICommentRequest) => {
  return request<ICommentResponse>({
    url: `/comments/${commentId}`,
    method: 'put',
    data,
  });
};

export const removeCommentById = (commentId: number) => {
  return request<ICommentResponse>({
    url: `/comments/${commentId}`,
    method: 'delete',
  });
};

export const getCommentsByCollection = (collectionId: number) => {
  return request<ICommentResponse[]>({
    url: `/collections/${collectionId}/comments`,
    method: 'get',
  });
};

export const getCommentReplies = (collectionId: number, commentId: number) => {
  return request<ICommentResponse[]>({
    url: `/collections/${collectionId}/comments/${commentId}/replies`,
    method: 'get',
  });
};

export const getCommentsByUser = (username: string, size: number, offsetId?: number) => {
  return request<IPagedResponse<ICommentSummary>>({
    url: `/users/${username}/comments?${offsetId ? `offsetId=${offsetId}&` : ''}size=${size}`,
    method: 'get',
  });
};
