import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-layout';

export default () => (
  <DefaultFooter
    copyright="2022. InstaShare"
    links={[
      {
        key: 'github',
        title: <GithubOutlined />,
        href: 'https://github.com/cdonis/instashare',
        blankTarget: true,
      },
      {
        key: 'instashare',
        title: 'InstaShare CE',
        href: 'https://www.instsharece.com',
        blankTarget: true,
      },
    ]}
  />
);
