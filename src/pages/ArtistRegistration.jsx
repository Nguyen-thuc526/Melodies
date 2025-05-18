import React, { useState } from 'react';
import {
    Form,
    Input,
    Button,
    Upload,
    message,
    Card,
    Typography,
    Space,
    ConfigProvider,
} from 'antd';
import {
    UploadOutlined,
    UserOutlined,
    MailOutlined,
    PhoneOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import api from '../config/axios';

// Mock themeColors (replace with your real theme or import from theme file)
const themeColors = {
    primary: '#ff1f9c',
    secondary: '#ff4db2',
    success: '#33b1ff',
    background: 'linear-gradient(135deg, #1a1221 0%, #2D1F31 100%)',
    cardBackground: 'linear-gradient(135deg, #3d2a3a 0%, #4d3649 100%)',
    textPrimary: '#FFFFFF',
    textSecondary: 'rgba(255, 255, 255, 0.9)',
    inputBackground: 'rgba(91, 73, 89, 0.7)',
    border: 'rgba(255, 31, 156, 0.3)',
};

const { TextArea } = Input;
const { Title, Paragraph } = Typography;

const ArtistRegistration = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);
    const navigate = useNavigate();

    const onFinish = async (values) => {
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append('stageName', values.artistName);
            formData.append('email', values.email);
            formData.append('phone', values.phone);
            formData.append('bio', values.description);
            if (imageFile) {
                formData.append('profileImage', imageFile);
            }

            const response = await api.post('/api/artist-requests', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.success) {
                message.success(
                    'Registration successful! Your request is under review.'
                );
                navigate('/');
            }
        } catch (error) {
            message.error(
                error.response?.data?.message ||
                    'An error occurred during registration.'
            );
        } finally {
            setLoading(false);
        }
    };

    const beforeUpload = (file) => {
        const isImage = file.type.startsWith('image/');
        if (!isImage) {
            message.error('You can only upload image files!');
            return false;
        }
        const isLt5M = file.size / 1024 / 1024 < 5;
        if (!isLt5M) {
            message.error('Image must be smaller than 5MB!');
            return false;
        }
        setImageFile(file);
        const reader = new FileReader();
        reader.onload = (e) => setImageUrl(e.target.result);
        reader.readAsDataURL(file);
        return false; // Prevent auto-upload
    };

    const dummyRequest = ({ onSuccess }) => {
        setTimeout(() => onSuccess('ok'), 0);
    };

    const uploadButton = (
        <div>
            <UploadOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: themeColors.primary,
                    colorSuccess: themeColors.success,
                    colorInfo: themeColors.primary,
                    colorWarning: themeColors.secondary,
                    colorBgContainer: 'transparent',
                    colorTextBase: themeColors.textPrimary,
                    colorBorder: themeColors.border,
                    fontSize: 16,
                    borderRadius: 24,
                },
                components: {
                    Card: {
                        boxShadow:
                            '0 10px 30px rgba(0,0,0,0.4), 0 0 20px rgba(255, 31, 156, 0.15)',
                    },
                    Input: {
                        colorBgContainer: themeColors.inputBackground,
                        colorTextPlaceholder: 'rgba(255, 255, 255, 0.8)',
                        paddingBlock: 12,
                        paddingInline: 16,
                        hoverBorderColor: themeColors.primary,
                    },
                    Button: {
                        defaultBg:
                            'linear-gradient(135deg, #ff1f9c 0%, #ff4db2 100%)',
                        defaultColor: '#FFFFFF',
                        paddingBlock: 12,
                    },
                    Form: {
                        labelFontSize: 16,
                        verticalLabelPadding: '0 0 8px',
                    },
                },
            }}
        >
            <div
                style={{
                    background: themeColors.background,
                    padding: '60px 20px',
                    minHeight: '100vh',
                }}
            >
                <Card
                    style={{
                        maxWidth: 900,
                        margin: '0 auto',
                        padding: '32px',
                        borderRadius: '24px',
                        background: themeColors.cardBackground,
                        border: 'none',
                        overflow: 'hidden',
                    }}
                >
                    <Space
                        direction="vertical"
                        size={32}
                        style={{ width: '100%' }}
                    >
                        <div>
                            <Title
                                level={2}
                                style={{
                                    textAlign: 'center',
                                    color: themeColors.primary,
                                    marginBottom: 8,
                                    fontWeight: 'bold',
                                    textShadow:
                                        '0 0 10px rgba(255, 31, 156, 0.5)',
                                }}
                            >
                                Artist Profile
                            </Title>
                            <Paragraph
                                style={{
                                    textAlign: 'center',
                                    color: themeColors.textSecondary,
                                    fontSize: 16,
                                }}
                            >
                                Please complete your artist profile to proceed
                            </Paragraph>
                        </div>

                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={onFinish}
                            requiredMark={false}
                        >
                            <Form.Item
                                name="artistName"
                                label={
                                    <span
                                        style={{
                                            color: themeColors.textPrimary,
                                            fontWeight: 500,
                                        }}
                                    >
                                        Artist Name or Stage Name
                                    </span>
                                }
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            'Please enter your artist name!',
                                    },
                                ]}
                            >
                                <Input
                                    prefix={
                                        <UserOutlined
                                            style={{
                                                color: 'rgba(255, 255, 255, 0.8)',
                                            }}
                                        />
                                    }
                                    placeholder="Enter your artist or stage name"
                                    size="large"
                                    style={{
                                        height: '56px',
                                        borderRadius: '24px',
                                    }}
                                />
                            </Form.Item>

                            <Form.Item
                                name="email"
                                label={
                                    <span
                                        style={{
                                            color: themeColors.textPrimary,
                                            fontWeight: 500,
                                        }}
                                    >
                                        Contact Email
                                    </span>
                                }
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please enter your email!',
                                    },
                                    {
                                        type: 'email',
                                        message: 'Invalid email address!',
                                    },
                                ]}
                            >
                                <Input
                                    prefix={
                                        <MailOutlined
                                            style={{
                                                color: 'rgba(255, 255, 255, 0.8)',
                                            }}
                                        />
                                    }
                                    placeholder="Enter your email address"
                                    size="large"
                                    style={{
                                        height: '56px',
                                        borderRadius: '24px',
                                    }}
                                />
                            </Form.Item>

                            <Form.Item
                                name="phone"
                                label={
                                    <span
                                        style={{
                                            color: themeColors.textPrimary,
                                            fontWeight: 500,
                                        }}
                                    >
                                        Phone Number
                                    </span>
                                }
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            'Please enter your phone number!',
                                    },
                                    {
                                        pattern: /^[0-9]{10,11}$/,
                                        message: 'Invalid phone number!',
                                    },
                                ]}
                            >
                                <Input
                                    prefix={
                                        <PhoneOutlined
                                            style={{
                                                color: 'rgba(255, 255, 255, 0.8)',
                                            }}
                                        />
                                    }
                                    placeholder="Enter your phone number"
                                    size="large"
                                    style={{
                                        height: '56px',
                                        borderRadius: '24px',
                                    }}
                                />
                            </Form.Item>

                            <Form.Item
                                name="description"
                                label={
                                    <span
                                        style={{
                                            color: themeColors.textPrimary,
                                            fontWeight: 500,
                                        }}
                                    >
                                        Short Artist Bio
                                    </span>
                                }
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            'Please enter a short artist bio!',
                                    },
                                ]}
                                extra={
                                    <span
                                        style={{
                                            color: themeColors.textSecondary,
                                            fontSize: 14,
                                        }}
                                    >
                                        Introduce yourself, your music style,
                                        and your genre
                                    </span>
                                }
                            >
                                <TextArea
                                    placeholder="Tell us about yourself, your music style, and preferred genre..."
                                    rows={6}
                                    showCount
                                    maxLength={500}
                                    style={{ borderRadius: '16px' }}
                                />
                            </Form.Item>

                            <Form.Item
                                name="profileImage"
                                label={
                                    <span
                                        style={{
                                            color: themeColors.textPrimary,
                                            fontWeight: 500,
                                        }}
                                    >
                                        Profile Picture
                                    </span>
                                }
                                extra={
                                    <span
                                        style={{
                                            color: themeColors.textSecondary,
                                            fontSize: 14,
                                        }}
                                    >
                                        Supported formats: JPG, PNG. Max size:
                                        5MB
                                    </span>
                                }
                            >
                                <Upload
                                    name="avatar"
                                    listType="picture-card"
                                    showUploadList={false}
                                    customRequest={dummyRequest}
                                    beforeUpload={beforeUpload}
                                >
                                    {imageUrl ? (
                                        <img
                                            src={imageUrl}
                                            alt="avatar"
                                            style={{
                                                width: '100%',
                                                borderRadius: 8,
                                            }}
                                        />
                                    ) : (
                                        uploadButton
                                    )}
                                </Upload>
                            </Form.Item>

                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    size="large"
                                    block
                                    loading={loading}
                                    style={{
                                        height: '52px',
                                        borderRadius: '24px',
                                        background:
                                            'linear-gradient(135deg, #ff1f9c 0%, #ff4db2 100%)',
                                        border: 'none',
                                        fontSize: 16,
                                        fontWeight: 500,
                                        boxShadow:
                                            '0 0 20px rgba(255, 31, 156, 0.3)',
                                    }}
                                >
                                    Save Profile
                                </Button>
                            </Form.Item>
                        </Form>
                    </Space>
                </Card>
            </div>
        </ConfigProvider>
    );
};

export default ArtistRegistration;
