import { Button, Result } from 'antd';
import React from 'react';
import { history, FormattedMessage } from 'umi';

const DeniedPage: React.FC = () => (
  <Result
    status="403"
    title="403"
    subTitle={
      <FormattedMessage
        id="pages.403.subtitle.accessDenied"
        defaultMessage="Sorry, you are not allowed to access this page."
      />
    }
    extra={
      <Button type="primary" onClick={() => history.push('/')}>
        Go home
      </Button>
    }
  />
);

export default DeniedPage;
