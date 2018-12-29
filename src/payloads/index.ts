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
  usernameOrEmail: string;
  password: string;
}
export interface ISignupReqeust {
  name: string;
  email: string;
  username: string;
  password: string;
}
export interface IUserSummary {
  id: number;
  username: string;
  name: string;
}
export interface IUserProfileResponse extends IUserSummary {
  joinedAt: string;
  pollCount: number;
  voteCount: number;
}

// collection
export interface ICollectionResponse {
  id: number;
  title: string;
  description: string;
  createdBy: IUserSummary;
  tags: string[];
  bookmarks: number;
  isBookmarked: boolean;
}
export interface ICollectionSummary {
  id: number;
  title: string;
  description: string;
  items: number;
  createdBy: IUserSummary;
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
  sourceProvider: string;
}
export interface IItemPutRequest {
  title: string;
  description: string; // | null
  tags: string[];
}
export interface IItemResponse {
  id: number;
  title: string;
  description: string; // | null
  sourceUrl: string;
  sourceProvider: string;
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
