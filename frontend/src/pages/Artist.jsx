'use client';

import { useState } from 'react';
import {
    Form,
    Input,
    Button,
    Typography,
    Upload,
    Card,
    Space,
    message,
    ConfigProvider,
} from 'antd';
import {
    UserOutlined,
    MailOutlined,
    PhoneOutlined,
    UploadOutlined,
} from '@ant-design/icons';

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

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

const ArtistProfileForm = () => {
    const [form] = Form.useForm();
    const [imageUrl, setImageUrl] = useState(null);

    const onFinish = (values) => {
        console.log('Form submitted:', { ...values, profileImage: imageUrl });
        message.success('Artist profile saved successfully!');
    };

    const beforeUpload = (file) => {
        const isJpgOrPng =
            file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) message.error('You can only upload JPG/PNG files!');
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) message.error('Image must be smaller than 2MB!');
        return isJpgOrPng && isLt2M;
    };

    const handleChange = (info) => {
        if (info.file.status === 'done') {
            getBase64(info.file.originFileObj, (url) => setImageUrl(url));
        }
    };

    const getBase64 = (img, callback) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    };

    const uploadButton = (
        <div style={{ padding: 8 }}>
            <UploadOutlined
                style={{ color: themeColors.primary, fontSize: 24 }}
            />
            <div
                style={{
                    marginTop: 12,
                    color: themeColors.textSecondary,
                    fontSize: 14,
                }}
            >
                Upload Image
            </div>
        </div>
    );

    const dummyRequest = ({ file, onSuccess }) => {
        setTimeout(() => onSuccess('ok'), 0);
    };

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
                                        2MB
                                    </span>
                                }
                            >
                                <Upload
                                    name="avatar"
                                    listType="picture-card"
                                    className="avatar-uploader"
                                    showUploadList={false}
                                    customRequest={dummyRequest}
                                    beforeUpload={beforeUpload}
                                    onChange={handleChange}
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

export default ArtistProfileForm;
