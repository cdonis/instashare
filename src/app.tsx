import { RequestConfig, RunTimeLayoutConfig, history } from 'umi';
//import { request as requestUmi } from 'umi';

import type { RequestInterceptor, ResponseError } from 'umi-request';

import { Modal, notification } from 'antd';
//import { cloneDeep, merge } from 'lodash';
import { stringify } from 'querystring';

import type { Settings as LayoutSettings } from '@ant-design/pro-layout';
import { PageLoading } from '@ant-design/pro-layout';

import RightContent from '@/components/RightContent';
import Footer from '@/components/Footer';

import { currentUser as queryCurrentUser } from './services/instashare/auth';
import Page403 from './pages/403';

const loginPath = '/user/login';

/** Loading page for getting user information */
export const initialStateConfig = {
  loading: <PageLoading />,
};

/** Plugin-initial-state configuration */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.CurrentUser;
  fetchUserInfo?: (redirect?: boolean) => Promise<API.CurrentUser | undefined>;
}> {
    const fetchUserInfo = async (redirect: boolean = true) => {
        try {
            return await queryCurrentUser();
        } catch (error: any) {
            Modal.error({
                centered: true,
                width: 'lg',
                title: 'Error trying to get user information',
                content: 'You must be logged to proceed. Please, sign-in',
                okText: 'OK'
            });

            const { pathname } = history.location;
            if (window.location.pathname !== '/user/login') {
                history.replace({
                    pathname: '/user/login',
                    search: stringify({
                        redirect: pathname,
                    }),
                });
            }
        }
        return undefined;
    };

    // If not login page, initialState must includes current user information (currentUser)
    if (history.location.pathname !== loginPath) {
        const currentUser = await fetchUserInfo();
        return {
            fetchUserInfo,
            currentUser,
            settings: {},
        };
    }

    // If login page, initialState must includes function to get current user information (fetchUserInfo)
    return {
        fetchUserInfo,
        settings: {},
    };
}

// Plugin-layout configuration
export const layout: RunTimeLayoutConfig = ({ initialState }) => {
    return {
        rightContentRender: () => <RightContent />,
        footerRender: () => (history.location.pathname === loginPath) ? <Footer /> : undefined,
        onPageChange: () => {
            // If not signin, redirect to login page
            const { location } = history;
            if (!initialState?.currentUser && location.pathname !== loginPath) {
                history.push(loginPath);
            }
        },
        disableContentMargin: false,
        menuHeaderRender: undefined,
        unAccessible: <Page403 />,        // Custom 403 page
        ...initialState?.settings,
    };
};

const codeMessage = {
  200: 'Data processed successfully.',
  201: 'Data created or modified correctly.',
  202: 'Request has been successfully queue for asynchronous processing.',
  204: 'Data successfully removed.',
  400: 'Wrong data request.',
  401: 'User authentification error.',
  403: 'Denied access.',
  404: 'Requested resource not found.',
  405: 'Request method not allowed.',
  406: 'Request format not available.',
  409: 'Requested resource constrains conflict',
  410: 'Requested resource was removed.',
  422: 'Data validation error when creating the resource.',
  500: 'Internal server error.',
  502: 'Gateway error.',
  503: 'Service not available.',
  504: 'Gateway out of time.',
};

/** 
 * Exception controller
 * @see https://beta-pro.ant.design/docs/request-cn
 */
const errorHandler = (error: ResponseError) => {
    const { response } = error;
    if (response && response.status) {
        const errorText = codeMessage[response.status] || response.statusText;
        const { status, url } = response;

        if (![422].includes(status))
            notification.error({
                message: `Error requesting data ${status}: ${url}`,
                description: errorText,
            });
    }

    if (!response) {
        notification.error({
            description: 'Network problem detected, no connection with server.',
            message: 'Network problem',
        });
    }

    throw error;
};

// Request interceptor to add authentication token
const authRequestInterceptor: RequestInterceptor = (url, options) => {
    return {
        url,
        options: {
            ...options, 
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        }
    };
};

// Plugin-request configuration
export const request: RequestConfig = {
    prefix: 'http://localhost',
    errorHandler,
    requestInterceptors: [authRequestInterceptor],
};
