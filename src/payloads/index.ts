import { Provider } from 'types';

// common
export interface IPagedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

// auth & user
export interface ILoginRequest {
  username: string;
  password: string;
}
export interface ISignupReqeust {
  username: string;
  password: string;
}
export interface IUserSummary {
  id: number;
  username: string;
}
export interface IUserProfileResponse extends IUserSummary {
  joinedAt: string;
}

// collection
export interface ICollectionSummary {
  id: number;
  title: string;
  items: number;
  tags: string[];
  createdBy: IUserSummary;
  createdAt: Date;
}
export interface ICollectionResponse extends ICollectionSummary {
  description: string | null;
  bookmarks: number;
  isBookmarked: boolean;
}
export interface ICollectionRequest {
  title: string;
  description: string | null;
  tags: string[];
}
export interface ICommentResponse {
  id: number;
  text: string;
  depth: number;
  collection: ICollectionSummary;
  createdBy: IUserSummary;
}

// item
export interface IItemPostRequest {
  title: string;
  sourceUrl: string;
  sourceProvider: Provider;
  position: number;
}
export interface IItemPutRequest {
  title: string;
  description: string | null;
  tags: string[];
}
export interface IItemResponse {
  id: number;
  title: string;
  description: string | null;
  sourceUrl: string;
  sourceProvider: Provider;
  tags: string[];
  position: number;
  createdBy: number;
  collectionId: number;
  createdAt: Date;
  updatedAt: Date;
}
export interface ICueResponse {
  id: number;
  seconds: number;
  name?: string;
  createdAt: Date;
}
export interface IMediaDataResponse {
  url: string;
  title: string;
}
