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
export interface IUserIdentityAvailability {
  available: boolean;
}
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
  comments: number;
  bookmarks: number;
  isBookmarked: boolean;
}
export interface ICollectionRequest {
  title: string;
  description: string | null;
  tags: string[];
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
export interface IMediaDataResponse {
  url: string;
  title: string;
}

// cue
export interface ICueRequest {
  seconds: number;
  text?: string;
}
export interface ICueResponse {
  id: number;
  seconds: number;
  text?: string;
  createdAt: Date;
}

// comment
export interface ICommentRequest {
  text: string;
  replyTo?: number;
}
export interface ICommentResponse {
  id: number;
  text: string;
  depth: number;
  replies: number;
  createdBy: IUserSummary;
  createdAt: Date;
}
export interface ICommentSummary {
  id: number;
  text: string;
  collectionId: number;
  collectionTitle: string;
  createdBy: IUserSummary;
  createdAt: Date;
}

// comment
export interface ICommentRequest {
  text: string;
  replyTo?: number;
}
export interface ICommentResponse {
  id: number;
  text: string;
  depth: number;
  replies: number;
  createdBy: IUserSummary;
  createdAt: Date;
}
export interface ICommentSummary {
  id: number;
  text: string;
  collectionId: number;
  collectionTitle: string;
  createdBy: IUserSummary;
  createdAt: Date;
}
