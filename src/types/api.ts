export interface UserSignupRequest {
  access_token: string;
  email: string;
  name: string;
  picture?: string;
  account_type: 'seller' | 'logistics' | 'consumer';
  private_key: string;
  address: string;
}

export interface UserSignupResponse {
  message: string;
  token: string;
}

export interface CheckUserRequest {
  email: string;
}

export interface CheckUserResponse {
  exists: boolean;
  address?: string;
  private_key?: string;
  public_key?: string;
}

export interface ApiError {
  error: string;
}