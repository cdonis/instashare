import { history } from 'umi';
import type { Settings as LayoutSettings } from '@ant-design/pro-layout';
import { PageLoading } from '@ant-design/pro-layout';

import { currentUser as queryCurrentUser} from './services/tratos-2/auth';

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
        const currentUser = await queryCurrentUser();
        return (currentUser) ? currentUser : undefined;
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

