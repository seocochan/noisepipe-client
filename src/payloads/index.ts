// common
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
export interface ICurrentUserResponse {
  id: number;
  username: string;
  name: string;
}
export interface IUserProfileResponse extends ICurrentUserResponse {
  joinedAt: string;
  pollCount: number;
  voteCount: number;
}
