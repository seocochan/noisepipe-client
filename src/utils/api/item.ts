import { AxiosResponse } from 'axios';
import { IItemPutRequest, IItemResponse } from 'payloads';
import request from 'utils/api';

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
