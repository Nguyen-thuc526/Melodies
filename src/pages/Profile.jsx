import { useState, useEffect } from 'react';
import {
    Card,
    Button,
    message,
    Input,
    DatePicker,
    Form,
    Avatar,
    Upload,
    Spin,
    Typography,
    Divider,
    Row,
    Space,
} from 'antd';
import {
    UploadOutlined,
    EditOutlined,
    SaveOutlined,
    UserOutlined,
    EnvironmentOutlined,
    CalendarOutlined,
    InfoCircleOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import axios from 'axios';
import * as Yup from 'yup';
import { Formik } from 'formik';
import {
    fetchCurrentUserProfile,
    updateUserProfile,
} from '../store/action/userAction';
import { fetchArtistInfomation } from '../store/action/artistAction';
import { useSelector } from 'react-redux';

const { Title, Text, Paragraph } = Typography;

const datePickerStyle = `
  .custom-date-picker-dropdown .ant-picker-panel-container {
    background-color: #2c1e36;
  }
  .custom-date-picker-dropdown .ant-picker-content th,
  .custom-date-picker-dropdown .ant-picker-content td {
    color: white;
  }
  .custom-date-picker-dropdown .ant-picker-header {
    color: white;
    border-bottom: 1px solid #3d2a4a;
  }
  .custom-date-picker-dropdown .ant-picker-header button {
    color: white;
  }
  .custom-date-picker-dropdown .ant-picker-cell:hover .ant-picker-cell-inner {
    background: #3d2a4a;
  }
  .custom-date-picker-dropdown .ant-picker-cell-in-view.ant-picker-cell-selected .ant-picker-cell-inner {
    background: #4c338f;
  }
  .custom-date-picker-dropdown .ant-picker-footer {
    border-top: 1px solid #3d2a4a;
  }
  .custom-date-picker-dropdown .ant-picker-today-btn {
    color: #a280ff;
  }
`;

const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const [fileList, setFileList] = useState([]);
    const [messageApi, contextHolder] = message.useMessage();
    const [artist, setArtist] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const currentUser = useSelector((state) => state.auth.user);

    useEffect(() => {
        const fetchUserDetail = async () => {
            try {
                setLoading(true);
                const res = await fetchCurrentUserProfile();
                setUser(res);

                if (currentUser?.role === 'artist') {
                    const res = await fetchArtistInfomation(currentUser._id);
                    setArtist(res.data);
                }
            } catch (error) {
                console.error('Error fetching user details:', error);
                messageApi.error('Failed to load profile data');
            } finally {
                setLoading(false);
            }
        };

        fetchUserDetail();
    }, [messageApi, currentUser]);

    const validationSchema = Yup.object({
        fullName: Yup.string().required('Full name is required'),
        dateOfBirth: Yup.date().required('Date of birth is required'),
        location: Yup.string().required('Location is required'),
        bio: Yup.string().required('Bio is required'),
    });

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            const payload = {
                userId: user.id,
                fullName: values.fullName,
                dateOfBirth: values.dateOfBirth?.toISOString() || '',
                bio: values.bio,
                location: values.location,
                profileImage: profileImage?.url || '',
            };

            await updateUserProfile(payload);
            messageApi.success('Profile updated successfully');
            setEditMode(false);

            // Refresh user data
            const updatedUser = await fetchCurrentUserProfile();
            setUser(updatedUser);
        } catch (error) {
            messageApi.error(error.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = async ({ file }) => {
        if (file && file.type.startsWith('image/')) {
            setFileList([file]);
            try {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('upload_preset', 'nguyen');
                formData.append('cloud_name', 'drzrib7ut');

                const response = await axios.post(
                    'https://api.cloudinary.com/v1_1/drzrib7ut/image/upload',
                    formData
                );

                if (response.data.secure_url) {
                    setProfileImage({ url: response.data.secure_url });
                    messageApi.success('Image uploaded successfully');
                } else {
                    messageApi.error('Failed to upload image');
                }
            } catch (error) {
                messageApi.error('Failed to upload image to Cloudinary');
            }
        } else {
            messageApi.error('Please upload a valid image.');
        }
    };

    const handleRemoveImage = () => {
        setProfileImage(null);
        setFileList([]);
    };

    const toggleEditMode = () => {
        setEditMode(!editMode);
    };

    const previewImageUrl = profileImage
        ? profileImage.url
        : user?.profileImage || '/placeholder.svg?height=100&width=100';

    if (loading && !user) {
        return (
            <div
                className="flex justify-center items-center h-screen"
                style={{ backgroundColor: '#231829' }}
            >
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div
            className="max-w-3xl mx-auto py-8 px-4"
            style={{ backgroundColor: '#231829', minHeight: '100vh' }}
        >
            {contextHolder}
            <style>{datePickerStyle}</style>

            <Card
                className="bg-[#231829] border-[#3d2a4a] shadow-lg"
                title={
                    <div className="flex justify-between items-center">
                        <Title
                            level={3}
                            style={{ color: 'white' }}
                            className="text-white m-0"
                        >
                            Profile
                        </Title>
                        <Button
                            type="primary"
                            icon={
                                editMode ? <SaveOutlined /> : <EditOutlined />
                            }
                            onClick={toggleEditMode}
                            className={
                                editMode
                                    ? 'bg-purple-600 hover:bg-purple-700'
                                    : 'bg-purple-600 hover:bg-purple-700'
                            }
                        >
                            {editMode ? 'View Profile' : 'Edit Profile'}
                        </Button>
                    </div>
                }
            >
                <Formik
                    initialValues={{
                        fullName: user?.fullName || '',
                        dateOfBirth: user?.dateOfBirth
                            ? moment(user?.dateOfBirth)
                            : null,
                        location: user?.location || '',
                        bio: user?.bio || '',
                    }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                    enableReinitialize
                >
                    {({
                        values,
                        errors,
                        touched,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        setFieldValue,
                    }) => (
                        <Form
                            layout="vertical"
                            onFinish={handleSubmit}
                            className="w-full"
                        >
                            <div className="flex flex-col md:flex-row gap-8 mb-6">
                                <div className="flex flex-col items-center">
                                    <Avatar
                                        src={previewImageUrl}
                                        size={120}
                                        className="mb-4 border-2 border-purple-500"
                                    />

                                    {editMode && (
                                        <div className="w-full">
                                            <Upload
                                                beforeUpload={() => false}
                                                showUploadList={true}
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                fileList={fileList}
                                                className="upload-list-inline"
                                            >
                                                <Button
                                                    icon={<UploadOutlined />}
                                                    className="bg-purple-500 hover:bg-purple-600 border-purple-600 text-white"
                                                >
                                                    Change Photo
                                                </Button>
                                            </Upload>
                                            {profileImage && (
                                                <Button
                                                    type="link"
                                                    onClick={handleRemoveImage}
                                                    className="mt-2 text-red-400 hover:text-red-300"
                                                >
                                                    Remove
                                                </Button>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1">
                                    {!editMode ? (
                                        <div className="space-y-4">
                                            <div>
                                                <Title
                                                    level={4}
                                                    style={{ color: 'white' }}
                                                    className="text-white m-0 flex items-center"
                                                >
                                                    <UserOutlined className="mr-2" />{' '}
                                                    {user?.fullName ||
                                                        'No name provided'}
                                                </Title>
                                            </div>

                                            <div>
                                                <Text className="text-gray-400 flex items-center">
                                                    <CalendarOutlined className="mr-2" />
                                                    {user?.dateOfBirth
                                                        ? moment(
                                                              user.dateOfBirth
                                                          ).format(
                                                              'MMMM D, YYYY'
                                                          )
                                                        : 'No date of birth provided'}
                                                </Text>
                                            </div>

                                            <div>
                                                <Text className="text-gray-400 flex items-center">
                                                    <EnvironmentOutlined className="mr-2" />
                                                    {user?.location ||
                                                        'No location provided'}
                                                </Text>
                                            </div>

                                            <Divider className="bg-[#3d2a4a] my-4" />

                                            <div>
                                                <Title
                                                    level={5}
                                                    style={{ color: 'white' }}
                                                    className="text-white mb-2 flex items-center"
                                                >
                                                    <InfoCircleOutlined className="mr-2" />{' '}
                                                    Bio
                                                </Title>
                                                <Paragraph className="text-gray-300">
                                                    {user?.bio ||
                                                        'No bio provided'}
                                                </Paragraph>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <Form.Item
                                                label={
                                                    <span className="text-white">
                                                        Full Name
                                                    </span>
                                                }
                                                validateStatus={
                                                    errors.fullName &&
                                                    touched.fullName
                                                        ? 'error'
                                                        : ''
                                                }
                                                help={
                                                    errors.fullName &&
                                                    touched.fullName
                                                        ? errors.fullName
                                                        : ''
                                                }
                                            >
                                                <Input
                                                    name="fullName"
                                                    value={values.fullName}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    className="bg-[#2a1f33] text-white border-gray-600"
                                                    prefix={
                                                        <UserOutlined className="text-gray-400" />
                                                    }
                                                />
                                            </Form.Item>

                                            <Form.Item
                                                label={
                                                    <span className="text-white">
                                                        Date of Birth
                                                    </span>
                                                }
                                                validateStatus={
                                                    errors.dateOfBirth &&
                                                    touched.dateOfBirth
                                                        ? 'error'
                                                        : ''
                                                }
                                                help={
                                                    errors.dateOfBirth &&
                                                    touched.dateOfBirth
                                                        ? errors.dateOfBirth
                                                        : ''
                                                }
                                            >
                                                <DatePicker
                                                    name="dateOfBirth"
                                                    value={values.dateOfBirth}
                                                    onChange={(date) =>
                                                        setFieldValue(
                                                            'dateOfBirth',
                                                            date
                                                        )
                                                    }
                                                    format="YYYY-MM-DD"
                                                    className="w-full bg-[#2a1f33] text-white border-gray-600"
                                                    getPopupContainer={(
                                                        trigger
                                                    ) => trigger.parentNode}
                                                    style={{ width: '100%' }}
                                                    classNames={{
                                                        popup: {
                                                            root: 'custom-date-picker-dropdown',
                                                        },
                                                    }}
                                                    styles={{
                                                        popup: {
                                                            root: {
                                                                backgroundColor:
                                                                    '#2c1e36',
                                                            },
                                                        },
                                                    }}
                                                />
                                            </Form.Item>

                                            <Form.Item
                                                label={
                                                    <span className="text-white">
                                                        Location
                                                    </span>
                                                }
                                                validateStatus={
                                                    errors.location &&
                                                    touched.location
                                                        ? 'error'
                                                        : ''
                                                }
                                                help={
                                                    errors.location &&
                                                    touched.location
                                                        ? errors.location
                                                        : ''
                                                }
                                            >
                                                <Input
                                                    name="location"
                                                    value={values.location}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    className="bg-[#2a1f33] text-white border-gray-600"
                                                    prefix={
                                                        <EnvironmentOutlined className="text-gray-400" />
                                                    }
                                                />
                                            </Form.Item>

                                            <Form.Item
                                                label={
                                                    <span className="text-white">
                                                        Bio
                                                    </span>
                                                }
                                                validateStatus={
                                                    errors.bio && touched.bio
                                                        ? 'error'
                                                        : ''
                                                }
                                                help={
                                                    errors.bio && touched.bio
                                                        ? errors.bio
                                                        : ''
                                                }
                                            >
                                                <Input.TextArea
                                                    name="bio"
                                                    value={values.bio}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    rows={4}
                                                    className="bg-[#2a1f33] text-white border-gray-600 resize-none"
                                                />
                                            </Form.Item>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {editMode && (
                                <Row justify="end">
                                    <Space>
                                        <Button
                                            onClick={() => setEditMode(false)}
                                            className="border-[#3d2a4a] text-white hover:text-white hover:border-purple-500"
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            loading={loading}
                                            className="bg-purple-600 hover:bg-purple-700 border-purple-700"
                                            icon={<SaveOutlined />}
                                        >
                                            Save Changes
                                        </Button>
                                    </Space>
                                </Row>
                            )}
                        </Form>
                    )}
                </Formik>
            </Card>
        </div>
    );
};

export default Profile;
