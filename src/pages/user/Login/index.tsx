import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { message } from 'antd';
import React, { useState } from 'react';
import ProForm, { ProFormText } from '@ant-design/pro-form';
import { Link, history, useModel } from 'umi';
import Footer from '@/components/Footer';
import { login, updatePassword } from '@/services/instashare/auth';

import styles from './index.less';
import { handleCatchErrorForm } from '@/utils/utils';

/** 
 * Redirects to the location indicated by the query params "redirect" 
 */
const goto = () => {
  if (!history) return;
  setTimeout(() => {
    const { search } = history.location;
    let { redirect } = search as unknown as { redirect: string | undefined };
    redirect = (redirect && redirect === 'changepasswd') ? undefined : redirect
    history.push(redirect || '/');
  }, 10);
};

const Login: React.FC = () => {
  const [submitting, setSubmitting] = useState(false);
  const { initialState, setInitialState } = useModel('@@initialState');

  const handleSubmit = async (values: API.LoginParams & {newPassword: string; confirmPassword: string}) => {
    setSubmitting(true);
    if (type === 'login') {
        try {
            // Sign in
            const result: API.LoginResult = await login({ ...values });
            
            // Store token in local storage
            localStorage.setItem('token', result.token || '');

            message.success('Successful login');

            // Set user information in global state
            setInitialState({
                ...initialState,
                currentUser: {
                    id:   result.user_id,
                    name: result.name,
                },
            });

            // Redirects
            goto();
            return;

        } catch (error: any) {
            if (error.data && error.data.errorMessage)
                message.error(`Login failed. ${error.data.errorMessage}`);
        }

    } else {
        try {
            await updatePassword({ 
                email: values.email,
                password: values.password,
                n_password: values.newPassword,
                c_password: values.confirmPassword
            });
            message.success('Password successful updated');
            history.replace({pathname: '/user/login'});     

        } catch (error: any) {
            handleCatchErrorForm(error);
        }
    }

    setSubmitting(false);
  };

  const { search } = history ? history.location : { search: {redirect: undefined} };
  const { redirect } = search as { redirect: string | undefined };
  const type = (redirect && redirect === 'changepasswd') ? 'changepasswd' : 'login';

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.top}>
          <div className={styles.header}>
            <Link to="/">
              <img alt="logo" className={styles.logo} src="/logo.png" />
            </Link>
          </div>
        </div>

        <div className={styles.main}>
          <ProForm
            initialValues={{
              autoLogin: true,
            }}
            submitter={{
              searchConfig: {
                submitText: (type === 'login') ? 'Sign in' : 'Change password',
              },
              render: (_, dom) => dom.pop(),
              submitButtonProps: {
                loading: submitting,
                size: 'large',
                style: {
                  width: '100%',
                },
              },
            }}
            onFinish={async (values) => {
              handleSubmit(values as API.LoginParams & {newPassword: string; confirmPassword: string});
            }}
          >
            <>
              <ProFormText
                name="email"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined className={styles.prefixIcon} />,
                }}
                placeholder="Email"
                rules={[
                  {
                    required: true,
                    message: 'Required value',
                  },
                ]}
              />
              <ProFormText.Password
                name="password"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className={styles.prefixIcon} />,
                }}
                placeholder='Current password'
                rules={[
                  {
                    required: true,
                    message: 'Required value',
                  },
                ]}
              />
            </>
            { (type === 'changepasswd') &&
              <>
                <ProFormText.Password
                  name="newPassword"
                  fieldProps={{
                    size: 'large',
                    prefix: <LockOutlined className={styles.prefixIcon} />,
                  }}
                  placeholder='New password'
                  rules={[
                    {
                      required: true,
                      message: 'Required value',
                    },
                    {
                      type: 'string',
                    },
                    {
                      min: 8,
                      message: 'Please, minimun 8 characters',
                    },
                    {
                      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%*?&])[A-Za-z\d@#$!%*?&]{8,}$/,
                      message: 'Must includes: one number, one upper case, one lower case and one special character',
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        const password = getFieldValue('password');
                        if (
                          password != value ||
                          (value === '' && !password) ||
                          (!value && password === '')
                        ) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('New password must be different from the old one'));
                      },
                    }),                                
                  ]}
                />
                <ProFormText.Password
                  name="confirmPassword"
                  fieldProps={{
                    size: 'large',
                    prefix: <LockOutlined className={styles.prefixIcon} />,
                  }}                  
                  placeholder='Confirm your password'
                  dependencies={['newPassword']}
                  hasFeedback
                  rules={[
                    {
                      required: true,                     
                      message: 'Required value',
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        const password = getFieldValue('newPassword');
                        if (
                          password === value ||
                          (value === '' && !password) ||
                          (!value && password === '')
                        ) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('Must match new password'));
                      },
                    }),
                  ]}
                />                
              </>         
            }
            <div style={{ marginBottom: 24 }}>
              <a>
                Forget your password ?
              </a>
            </div>
          </ProForm>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;