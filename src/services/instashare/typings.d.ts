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
    password: string;
    n_password: string;
    c_password: string;
  };

  type SignUpParams = {
    email: string;
    name?: string;
    password: string;
    c_password: string;
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

  type File = {
    id?: number;
    name?: string;
    md5?: string;
    status?: string;
    size?: number;
    created_at?: string;
    updated_at?: string;
    user_id?: number;
  };

  type FilesList = {
    data?: File[];
    /** Number of elements */
    total?: number;
    success?: boolean;
  };
}
