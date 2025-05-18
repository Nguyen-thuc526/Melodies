import { Card, Typography, Input, Button, message } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import React from 'react';
import { registerUser } from '../store/action/authAction';

const { Title, Text } = Typography;

const Register = () => {
    const navigate = useNavigate();

    const validationSchema = Yup.object().shape({
        username: Yup.string()
            .required('Please input your username!')
            .min(3, 'Username must be at least 3 characters!'),
        email: Yup.string()
            .email('Invalid email format')
            .required('Please input your email!'),
        password: Yup.string()
            .min(6, 'Password must be at least 6 characters')
            .required('Please input your password!'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Passwords must match')
            .required('Please confirm your password!'),
    });

    const handleSubmit = async (values) => {
        try {
            await registerUser(
                values.username,
                values.email,
                values.password,
                values.confirmPassword
            );
            message.success({
                content: 'Registration successful! Welcome to Melodies.',
                duration: 3,
                style: { marginTop: '20vh' },
            });
            setTimeout(
                () => navigate('/login', { state: { fromRegister: true } }),
                2000
            );
        } catch (error) {
            message.error({
                content:
                    error.response?.data?.message ||
                    'Registration failed. Please try again.',
                duration: 3,
                style: { marginTop: '20vh' },
            });
        }
    };

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #1a1221 0%, #2D1F31 100%)',
                padding: 24,
            }}
        >
            <Card
                style={{
                    width: 400,
                    background:
                        'linear-gradient(135deg, #3d2a3a 0%, #4d3649 100%)',
                    borderRadius: '24px',
                    border: 'none',
                    overflow: 'hidden',
                    boxShadow:
                        '0 10px 30px rgba(0,0,0,0.4), 0 0 20px rgba(255, 31, 156, 0.15)',
                }}
                styles={{ body: { padding: 0 } }}
            >
                <div style={{ padding: '40px 24px 20px', textAlign: 'center' }}>
                    <Title
                        level={3}
                        style={{
                            color: '#ff1f9c',
                            fontWeight: 'bold',
                            textShadow: '0 0 10px rgba(255, 31, 156, 0.5)',
                        }}
                    >
                        Melodies
                    </Title>
                    <Title
                        level={3}
                        style={{
                            color: 'white',
                            margin: 0,
                            fontWeight: 'bold',
                        }}
                    >
                        Create an Account
                    </Title>
                </div>

                <Formik
                    initialValues={{
                        username: '',
                        email: '',
                        password: '',
                        confirmPassword: '',
                    }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting }) => (
                        <Form style={{ padding: '0 24px' }}>
                            {[
                                'username',
                                'email',
                                'password',
                                'confirmPassword',
                            ].map((fieldName, idx) => (
                                <div
                                    key={fieldName}
                                    style={{
                                        marginBottom: idx === 3 ? 24 : 16,
                                    }}
                                >
                                    <Field name={fieldName}>
                                        {({ field }) => {
                                            const icon =
                                                fieldName === 'email' ? (
                                                    <MailOutlined />
                                                ) : fieldName === 'username' ? (
                                                    <UserOutlined />
                                                ) : (
                                                    <LockOutlined />
                                                );
                                            const isPassword =
                                                fieldName.includes('password');
                                            const InputComponent = isPassword
                                                ? Input.Password
                                                : Input;
                                            return (
                                                <InputComponent
                                                    {...field}
                                                    prefix={React.cloneElement(
                                                        icon,
                                                        {
                                                            style: {
                                                                color: 'rgba(255, 255, 255, 0.8)',
                                                            },
                                                        }
                                                    )}
                                                    placeholder={
                                                        fieldName
                                                            .charAt(0)
                                                            .toUpperCase() +
                                                        fieldName
                                                            .slice(1)
                                                            .replace(
                                                                /([A-Z])/g,
                                                                ' $1'
                                                            )
                                                    }
                                                    size="large"
                                                    style={{
                                                        color: 'white',
                                                        backgroundColor:
                                                            'rgba(91, 73, 89, 0.7)',
                                                        borderRadius: '24px',
                                                        height: '56px',
                                                        border: '1px solid rgba(255, 31, 156, 0.3)',
                                                    }}
                                                />
                                            );
                                        }}
                                    </Field>
                                    <ErrorMessage
                                        name={fieldName}
                                        component="div"
                                        style={{
                                            color: '#ff4db2',
                                            fontSize: '12px',
                                            marginTop: 4,
                                        }}
                                    />
                                </div>
                            ))}
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    marginBottom: 24,
                                }}
                            >
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    size="large"
                                    loading={isSubmitting}
                                    style={{
                                        borderRadius: '24px',
                                        background:
                                            'linear-gradient(135deg, #ff1f9c 0%, #ff4db2 100%)',
                                        fontWeight: 'bold',
                                        border: 'none',
                                    }}
                                >
                                    Sign Up
                                </Button>
                            </div>
                        </Form>
                    )}
                </Formik>

                <div
                    style={{
                        background:
                            'linear-gradient(135deg, #332433 0%, #3d2a3a 100%)',
                        padding: '40px 24px 24px',
                        textAlign: 'center',
                    }}
                >
                    <Title
                        level={4}
                        style={{
                            color: 'white',
                            margin: 0,
                            fontWeight: 'bold',
                        }}
                    >
                        Already Have An Account?
                    </Title>
                    <Text
                        style={{
                            color: 'rgba(255, 255, 255, 0.9)',
                            display: 'block',
                            marginBottom: 16,
                            fontSize: '16px',
                        }}
                    >
                        Login Here
                    </Text>
                    <Link to="/login">
                        <Button
                            type="primary"
                            size="large"
                            style={{
                                borderRadius: '24px',
                                background:
                                    'linear-gradient(135deg, #0099ff 0%, #33b1ff 100%)',
                                fontWeight: 'bold',
                                border: 'none',
                            }}
                        >
                            Login
                        </Button>
                    </Link>
                </div>
            </Card>
        </div>
    );
};

export default Register;
