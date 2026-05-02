export interface ProfileUser {
  id: string;
  username: string;
  email: string;
  emailVerifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface GetMeResponse {
  user: ProfileUser;
}

export interface UpdateMeResponse {
  user: ProfileUser;
}

export interface UpdatePasswordResponse {
  user: ProfileUser;
}

export type DeleteMeResponse = void;