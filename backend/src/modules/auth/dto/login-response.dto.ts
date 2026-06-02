export type LoginResponseDto = {
  accessToken: string;
  refreshToken: string;
  tokenType: 'Bearer';
  expiresIn: string;
  user: {
    id: string;
    username: string;
    email: string;
    roles: string[];
    permissions: string[];
  };
};
