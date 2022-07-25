import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, message, Modal } from 'antd';
import React, { useState } from 'react';
import ProForm, { ProFormText } from '@ant-design/pro-form';
import { Link, history, useModel } from 'umi';
import Footer from '@/components/Footer';
import { login, signUp, updatePassword } from '@/services/instashare/auth';

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
    const { search } = history ? history.location : { search: {redirect: undefined} };
    const { redirect } = search as { redirect: string | undefined };
    
    const [submitting, setSubmitting] = useState(false);
    const [type, setType] = useState<string | undefined>((redirect) ? redirect : undefined);
    const { initialState, setInitialState } = useModel('@@initialState');

    const handleSubmit = async (values: API.LoginParams & {name?: string; newPassword: string; confirmPassword: string}) => {
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

        } else if (type === 'changepasswd') {
            try {
                await updatePassword({
                    password: values.password,
                    n_password: values.newPassword,
                    c_password: values.confirmPassword
                });
                message.success('Password successful updated');
                history.replace({pathname: '/user/login'});     

            } catch (error: any) {
                handleCatchErrorForm(error);
            }
        } else {
            try {
                const result: API.LoginResult = await signUp({
                    email: values.email,
                    name: values.name || values.email,
                    password: values.newPassword,
                    c_password: values.confirmPassword
                });
                localStorage.setItem('token', result.token || '');
                Modal.info({
                    centered: true,
                    width: 'lg',
                    title: 'Welcome',
                    content: <span style={{ whiteSpace: 'pre-line' }}>{
                        `Congratulations !!!, you has successful registered with InstaShare.\n
                        Now you can start using and sharing files with our community.`
                    }</span>,
                  });
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
                //history.replace({pathname: '/'});     

            } catch (error: any) {
                handleCatchErrorForm(error);
            }
        }

        setSubmitting(false);
    };

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
                        submitText: (type === 'login') ? 'Sign in' : (type === 'changepasswd') ? 'Change password' : 'Sign up',
                    },
                    render: (_, dom) => dom.pop(),
                    submitButtonProps: {
                        loading: submitting,
                        size: 'large',
                        style: {
                        width: '100%',
                        borderRadius: '5px',
                        },
                    },
                }}
                onFinish={async (values) => {
                    if (!type) { 
                        setType('signup')
                        return false
                    } else  
                        handleSubmit(values as API.LoginParams & {newPassword: string; confirmPassword: string});
                }}
            >
                <>
                    { type !== 'changepasswd' &&
                        <div style={{ marginBottom: 10, color: 'white' }}>
                            { (type !== 'login') ? `Already registered ?` : `Want to sign up ? `}
                            <Button type='link' onClick={() => setType((type !== 'login') ? 'login' : undefined)}>
                                <span style={{color: "white", textDecoration: "underline"}}>{(type !== 'login') ? 'Sign in' : 'Sign up'}</span>
                            </Button>
                        </div>
                    }

                    { type && ['changepasswd', 'login', 'signup'].includes(type) &&
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
                    }
                    { type === 'signup' &&
                        <ProFormText
                            name="name"
                            fieldProps={{size: 'large'}}
                            placeholder="Name"
                            rules={[
                                { required: true, message: 'Required value' },
                                {
                                    pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
                                    message: 'Please, only letters',
                                },
                            ]}
                        />                    
                    }
                    { type && ['changepasswd', 'login'].includes(type) &&
                        <ProFormText.Password
                            name="password"
                            fieldProps={{
                                size: 'large',
                                prefix: <LockOutlined className={styles.prefixIcon} />,
                            }}
                            placeholder='Password'
                            rules={[
                            {
                                required: true,
                                message: 'Required value',
                            },
                            ]}
                        />
                    }
                    { type && ['changepasswd', 'signup'].includes(type) &&
                        <>
                            <ProFormText.Password
                                name="newPassword"
                                fieldProps={{
                                    size: 'large',
                                    prefix: <LockOutlined className={styles.prefixIcon} />,
                                }}
                                placeholder='New password'
                                rules={[
                                    { required: true, message: 'Required value' },
                                    { type: 'string' },
                                    { min: 8, message: 'Please, minimun 8 characters' },
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
                                    { required: true, message: 'Required value' },
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
                </>
            </ProForm>
            </div>
        </div>
        <Footer />
        </div>
    );
};

export default Login;