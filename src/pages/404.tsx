import { Button, Result } from 'antd';
import React from 'react';
import { history } from 'umi';

const NoFoundPage: React.FC = () => (
  <Result
    status="404"
    title="404"
    subTitle="Sorry, requested page is not found."
    extra={
      <Button type="primary" onClick={() => history.push('/')}>
        Go home
      </Button>
    }
  />
);

export default NoFoundPage;
