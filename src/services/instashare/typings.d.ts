// @ts-ignore
/* eslint-disable */

declare namespace API {
  type PageParams = {
    current?: number;
    pageSize?: number;
  };

  type ErrorResponse = {
    /** Error code */
    errorCode: string;
    /** Error description*/
    errorMessage?: string;
    /** Successful request ? */
    success?: boolean;
    data?: any;
  };

  type CurrentUser = {
    id: number;
    name: string;
    email?: string;
  };

  type UpdatePasswordFields = {
    email?: string;
    password?: string;
    n_password?: string;
    c_password?: string;
  };

  type LoginParams = {
    email: string;
    password: string;
  };

  type LoginResult = {
    user_id: number;
    name: string;
    token: string;
  };
}
