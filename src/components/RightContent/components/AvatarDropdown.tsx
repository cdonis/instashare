import React, { useCallback } from 'react';
import { Avatar, Menu, message, Spin } from 'antd';
import { history, useModel } from 'umi';
import { stringify } from 'querystring';

import { LogoutOutlined, SafetyCertificateOutlined } from '@ant-design/icons';

import { logout } from '@/services/instashare/auth';
import HeaderDropdown from '../../HeaderDropdown';
import styles from '../index.less';

export type GlobalHeaderRightProps = {
  menu?: boolean;
  showUserName?: boolean;
};

/**
 * Logout and save current URL
 */
const loginOut = async () => {
    try {
        await logout();
        const { query = {}, pathname } = history.location;
        const { redirect } = query;
        
        // Note: There may be security issues, please note
        if (window.location.pathname !== '/user/login' && !redirect) {
            history.replace({
                pathname: '/user/login',
                search: stringify({
                    redirect: pathname,
                }),
            });
        }
        
    } catch (error) {
        message.error('Logout failed, please try again');
    }
};

const AvatarDropdown: React.FC<GlobalHeaderRightProps> = ({ menu, showUserName }) => {
    const { initialState, setInitialState } = useModel('@@initialState');

    const onMenuClick: any = useCallback(
        async (event: {
        key: React.Key;
        keyPath: React.Key[];
        item: React.ReactInstance;
        domEvent: React.MouseEvent<HTMLElement>;
        }) => {
            const { key } = event;
            switch (key) {
                case 'logout':
                    if (initialState) {
                        await loginOut();
                        setInitialState({ ...initialState, currentUser: undefined });
                    }
                    break;
                default:
                    history.push(`/`);
            }
        },
        [initialState, setInitialState],
    );

    const loading = (
        <span className={`${styles.action} ${styles.account}`}>
            <Spin
                size="small"
                style={{
                    marginLeft: 8,
                    marginRight: 8,
                }}
            />
        </span>
    );

    if (!initialState) return loading;

    const { currentUser } = initialState;
    if (!currentUser || !currentUser.name) return loading;

    const menuHeaderDropdown = (
        <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
            { menu && <Menu.Item key="profile"><SafetyCertificateOutlined />User profile</Menu.Item> }
            { menu && <Menu.Divider /> }
            <Menu.Item key="logout"><LogoutOutlined />Logout</Menu.Item>
        </Menu>
    );

    const initials = currentUser.name.trim().substring(0, 1).toUpperCase();

    return (<>
        <HeaderDropdown overlay={menuHeaderDropdown}>
            <span className={`${styles.action} ${styles.account}`}>
            <Avatar size="small" className={styles.avatar}>
                {initials}
            </Avatar>
            { showUserName && <span className={`${styles.name} anticon`}>{currentUser.name}</span> }
            </span>
        </HeaderDropdown>
    </>);
};

export default AvatarDropdown;
