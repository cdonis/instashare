import React from 'react';
import { Avatar, Menu, Spin } from 'antd';
import { useModel } from 'umi';

import { LogoutOutlined } from '@ant-design/icons';

import HeaderDropdown from '../../HeaderDropdown';
import styles from '../index.less';

export type GlobalHeaderRightProps = {
  menu?: boolean;
  showUserName?: boolean;
};

const AvatarDropdown: React.FC<GlobalHeaderRightProps> = ({ menu, showUserName }) => {
    const { initialState, setInitialState } = useModel('@@initialState');

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
        <Menu className={styles.menu} selectedKeys={[]}>
        <Menu.Item key="logout">
            <LogoutOutlined />
            Logout
        </Menu.Item>
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
