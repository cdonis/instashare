import { Link, history } from 'umi';
import { Result, Button } from 'antd';

const ExceptionPage = (props: { errorCode?: string; errorMessage?: string }) => {
  let { errorCode, errorMessage } = props;

  let title = 'Error';
  let subTitle = '';

  if (!errorCode && !errorMessage && history && history.location && history.location.query) {
    const { query } = history.location;
    errorCode = (query as { errorCode: string; errorMessage: string }).errorCode;
    errorMessage = (query as { errorCode: string; errorMessage: string }).errorMessage;
  }

  const codeMessage = {
    400: 'Wrong data request.',
    401: 'User authentification error.',
    403: 'Denied access.',
    404: 'Requested resource not found.',
    405: 'Request method not allowed.',
    406: 'Reuqest format not available.',
    410: 'Requested resource was removed.',
    422: 'Data validation error when creating the resource.',
    500: 'Internal server error.',
    502: 'Gateway error.',
    503: 'Service not available.',
    504: 'Gateway out of time.',
  };

  const errorText = errorCode ? codeMessage[errorCode] || '' : '';
  title = `${title}${errorCode ? ' ' + errorCode : ''}. ${errorText}`;
  subTitle = errorMessage || '';

  const status = errorCode && (errorCode === '403' || errorCode === '404') ? errorCode : '500';

  return (
    <Result
      status={status}
      title={title}
      style={{
        background: 'none',
      }}
      subTitle={subTitle}
      extra={
        <Link to="/">
          <Button type="primary">Go home</Button>
        </Link>
      }
    />
  );
};

export default ExceptionPage;
