import { AxiosResponse } from 'axios';
import { ICommentRequest, ICommentResponse } from 'payloads';
import request from 'utils/api';

export const createComment = (
  collectionId: number,
  data: ICommentRequest
): Promise<AxiosResponse<ICommentResponse>> => {
  return request({
    url: `/collections/${collectionId}/comments`,
    method: 'post',
    data
  });
};

export const updateCommentById = (
  commentId: number,
  data: ICommentRequest
): Promise<AxiosResponse<ICommentResponse>> => {
  return request({
    url: `/comments/${commentId}`,
    method: 'put',
    data
  });
};

export const removeCommentById = (
  commentId: number
): Promise<AxiosResponse<ICommentResponse>> => {
  return request({
    url: `/comments/${commentId}`,
    method: 'delete'
  });
};

export const getCommentsByCollection = (
  collectionId: number
): Promise<AxiosResponse<ICommentResponse[]>> => {
  return request({
    url: `/collections/${collectionId}/comments`,
    method: 'get'
  });
};

export const getCommentReplies = (
  collectionId: number,
  commentId: number
): Promise<AxiosResponse<ICommentResponse[]>> => {
  return request({
    url: `/collections/${collectionId}/comments/${commentId}/replies`,
    method: 'get'
  });
};
