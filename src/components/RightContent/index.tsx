import React from 'react';
import { useModel, SelectLang} from 'umi';
import { Space} from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';

import Avatar from './components/AvatarDropdown';
import styles from './index.less';

export type SiderTheme = 'light' | 'dark';

const GlobalHeaderRight: React.FC = () => {
  const { initialState } = useModel('@@initialState');

  if (!initialState || !initialState.settings) return null;

  const { navTheme, layout } = initialState.settings;
  let className = styles.right;

  if ((navTheme === 'dark' && layout === 'top') || layout === 'mix') {
    className = `${styles.right}  ${styles.dark}`;
  }

  return (
    <Space className={className}>
      <span
        className={styles.action}
        onClick={() => {
          // Load help in modal
        }}
      >
        <QuestionCircleOutlined />
      </span>
      <Avatar menu showUserName={true}/>
      <SelectLang className={styles.action} />
    </Space>
  );
};
export default GlobalHeaderRight;
