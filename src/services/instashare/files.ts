// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/** Get file list having paging, filtering and sorting criterias GET /api/admin/files */
export async function getFilesList(
  params: {
    // query
    /** Paging */
    params?: API.PageParams;
    /** Sorting */
    sort?: any;
    /** Filtering */
    filter?: any;
  },
  options?: { [key: string]: any },
) {
  return request<API.FilesList>('/api/admin/files', {
    method: 'GET',
    params: {
      ...params,
      params: undefined,
      ...params['params'],
    },
    ...(options || {}),
  });
}

/** Upload file POST /api/admin/files */
export async function uploadFile(
  body: {
    /** File to upload */
    file?: any;
  },
  options?: { [key: string]: any },
) {
  return request<any>('/api/admin/files', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** Get file metadata GET /api/admin/files/${param0} */
export async function getFile(
  params: {
    // path
    /** Identificador del contrato */
    id: number;
  },
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.File>(`/api/admin/files/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** Update file's metadata PUT /api/admin/files/${param0} */
export async function updateFile(
  params: {
    // path
    /** File ID */
    id: number;
  },
  body: API.File,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/api/admin/files/${param0}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** Download file GET /api/admin/files/${param0}/download */
export async function downloadFile(
  params: {
    /** File ID */
    id: number;
  },
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/api/admin/files/${param0}/download`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** Remove file DELETE /api/admin/files/${param0} */
export async function removeFile(
  params: {
    // path
    /** File ID */
    id: number;
  },
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/api/admin/files/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}
