// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/** Get current user data GET /api/admin/auth/current-user */
export async function currentUser(options?: { [key: string]: any }) {
  return request<API.CurrentUser>('/api/admin/auth/current-user', {
    method: 'GET',
    ...(options || {}),
  });
}

/** Update current user password PUT /api/auth/changePassword */
export async function updatePassword(
  body: API.UpdatePasswordFields,
  options?: { [key: string]: any },
) {
  return request<any>('/api/admin/auth/change-password', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** Sign up user POST /api/admin/auth/signup */
export async function signUp(body: API.SignUpParams, options?: { [key: string]: any }) {
  return request<API.LoginResult>('/api/admin/auth/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** Sign in POST /api/admin/auth/login */
export async function login(body: API.LoginParams, options?: { [key: string]: any }) {
  return request<API.LoginResult>('/api/admin/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** Logout POST /api/admin/auth/logout */
export async function logout(options?: { [key: string]: any }) {
  return request<any>('/api/admin/auth/logout', {
    method: 'POST',
    ...(options || {}),
  });
}

/** Refreshes access token POST /api/admin/auth/refresh-token */
export async function refreshAccessToken(options?: { [key: string]: any }) {
  return request<API.LoginResult>('/api/admin/auth/refresh-token', {
    method: 'POST',
    ...(options || {}),
  });
}
