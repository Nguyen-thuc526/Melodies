import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload as UploadIcon, Lock, Globe } from 'lucide-react';
import {
    Button,
    Card,
    Form,
    Input,
    Select,
    Switch,
    Upload,
    message,
    Space,
    Typography,
} from 'antd';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

export default function MusicUploadPage() {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [isArtist, setIsArtist] = useState(false);
    const [coverImagePreview, setCoverImagePreview] = useState(null);
    const [coverImageFile, setCoverImageFile] = useState(null);
    const [audioFile, setAudioFile] = useState(null);
    const [isPublic, setIsPublic] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Mock user data - Thay bằng dữ liệu thực từ hệ thống xác thực của bạn
    const mockUser = {
        id: 'user123',
        name: 'User Name',
        role: 'artist', // Thay đổi thành "listener" để kiểm tra quyền truy cập
    };

    useEffect(() => {
        setIsArtist(mockUser.role === 'artist');
    }, []);

    const handleSubmit = async (values) => {
        if (!audioFile || !coverImageFile) {
            message.error('Vui lòng tải lên file nhạc và ảnh bìa!');
            return;
        }

        setIsSubmitting(true);

        try {
            const formData = new FormData();
            formData.append('title', values.title);
            formData.append('genre', values.genre);
            formData.append('audioFile', audioFile);
            formData.append('coverImage', coverImageFile);
            formData.append('lyrics', values.lyrics || '');
            formData.append('isPublic', isPublic.toString());

            console.log('Form data to submit:', {
                title: values.title,
                genre: values.genre,
                audioFile,
                coverImageFile,
                lyrics: values.lyrics,
                isPublic,
            });

            // Thay bằng API thực của bạn
            // const response = await fetch("/api/upload", {
            //   method: "POST",
            //   body: formData,
            // });
            // if (!response.ok) throw new Error("Upload failed");

            message.success('Bài hát đã được tải lên!');
            form.resetFields();
            setCoverImageFile(null);
            setCoverImagePreview(null);
            setAudioFile(null);
        } catch (error) {
            console.error('Upload error:', error);
            message.error('Không thể tải lên bài hát!');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRegisterArtist = () => {
        navigate('/artist-registration');
    };

    const audioUploadProps = {
        beforeUpload: (file) => {
            if (!file.type.startsWith('audio/')) {
                message.error(
                    'Chỉ hỗ trợ file âm thanh (MP3, WAV, FLAC, v.v.)!'
                );
                return Upload.LIST_IGNORE;
            }
            if (file.size / 1024 / 1024 >= 50) {
                message.error('File nhạc tối đa 50MB!');
                return Upload.LIST_IGNORE;
            }
            setAudioFile(file);
            message.success(`${file.name} đã được chọn`);
            return false; // Ngăn upload tự động
        },
        maxCount: 1,
        showUploadList: false,
    };

    const imageUploadProps = {
        beforeUpload: (file) => {
            const isValidType = ['image/jpeg', 'image/png'].includes(file.type);
            if (!isValidType) {
                message.error('Chỉ chấp nhận JPG hoặc PNG!');
                return Upload.LIST_IGNORE;
            }
            if (file.size / 1024 / 1024 >= 2) {
                message.error('Ảnh bìa tối đa 2勠2MB!');
                return Upload.LIST_IGNORE;
            }
            setCoverImageFile(file);
            const reader = new FileReader();
            reader.onload = () => {
                if (typeof reader.result === 'string') {
                    setCoverImagePreview(reader.result);
                }
            };
            reader.readAsDataURL(file);
            message.success('Ảnh bìa đã được chọn');
            return false; // Ngăn upload tự động
        },
        maxCount: 1,
        showUploadList: false,
    };

    // Kiểm tra quyền truy cập
    if (!isArtist) {
        return (
            <div
                style={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#1a1221',
                    padding: 16,
                }}
            >
                <Card
                    style={{
                        background: '#3d2a3a',
                        maxWidth: 400,
                        width: '100%',
                        textAlign: 'center',
                        border: 'none',
                    }}
                >
                    <Title
                        level={2}
                        style={{ color: '#ff1f9c', marginBottom: 16 }}
                    >
                        Bạn cần đăng ký làm nghệ sĩ
                    </Title>
                    <Text
                        style={{
                            color: 'rgba(255,255,255,0.8)',
                            marginBottom: 24,
                            display: 'block',
                        }}
                    >
                        Bạn cần đăng ký làm nghệ sĩ để tải lên nhạc.
                    </Text>
                    <Button
                        type="primary"
                        shape="round"
                        onClick={handleRegisterArtist}
                        style={{
                            background: '#ff1f9c',
                            borderColor: '#ff1f9c',
                        }}
                    >
                        Đăng ký nghệ sĩ ngay
                    </Button>
                </Card>
            </div>
        );
    }

    // Giao diện upload nhạc (chỉ hiển thị nếu user là "artist")
    return (
        <div
            style={{
                minHeight: '100vh',
                padding: '24px',
                background:
                    'linear-gradient(to bottom right, #1a1221, #2D1F31)',
            }}
        >
            <Card
                style={{
                    maxWidth: 800,
                    margin: '0 auto',
                    background: '#3d2a3a',
                    border: 'none',
                }}
            >
                <Title
                    level={2}
                    style={{
                        color: '#ff1f9c',
                        textAlign: 'center',
                        marginBottom: 32,
                    }}
                >
                    Tải Lên Bài Hát
                </Title>

                <Form form={form} onFinish={handleSubmit} layout="vertical">
                    {/* Chọn file nhạc */}
                    <Form.Item
                        label={
                            <span style={{ color: '#fff' }}>
                                Chọn file nhạc *
                            </span>
                        }
                    >
                        <Upload {...audioUploadProps}>
                            <Button
                                style={{
                                    background: 'rgba(91,73,89,0.7)',
                                    color: '#fff',
                                    border: 'none',
                                }}
                            >
                                Chọn file nhạc (MP3, WAV, FLAC, v.v.)
                            </Button>
                        </Upload>
                        {audioFile && (
                            <Text style={{ color: 'rgba(255,255,255,0.7)' }}>
                                Đã chọn: {audioFile.name}
                            </Text>
                        )}
                    </Form.Item>

                    {/* Nhập tiêu đề bài hát */}
                    <Form.Item
                        name="title"
                        label={
                            <span style={{ color: '#fff' }}>
                                Tiêu đề bài hát *
                            </span>
                        }
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập tiêu đề!',
                            },
                        ]}
                    >
                        <Input
                            placeholder="Nhập tiêu đề bài hát"
                            style={{
                                background: 'rgba(91,73,89,0.7)',
                                color: '#fff',
                                border: 'none',
                            }}
                        />
                    </Form.Item>

                    {/* Chọn thể loại nhạc */}
                    <Form.Item
                        name="genre"
                        label={
                            <span style={{ color: '#fff' }}>
                                Thể loại nhạc *
                            </span>
                        }
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng chọn thể loại!',
                            },
                        ]}
                    >
                        <Select
                            placeholder="Chọn thể loại (Pop, Rock, EDM, Rap, v.v.)"
                            style={{ background: 'rgba(91,73,89,0.7)' }}
                        >
                            <Option value="pop">Pop</Option>
                            <Option value="rock">Rock</Option>
                            <Option value="edm">EDM</Option>
                            <Option value="rap">Rap</Option>
                            <Option value="jazz">Jazz</Option>
                            <Option value="other">Khác</Option>
                        </Select>
                    </Form.Item>

                    {/* Upload ảnh bìa */}
                    <Form.Item
                        label={
                            <span style={{ color: '#fff' }}>
                                Ảnh bìa (JPG, PNG) *
                            </span>
                        }
                    >
                        <Upload {...imageUploadProps}>
                            <Button
                                style={{
                                    background: 'rgba(91,73,89,0.7)',
                                    color: '#fff',
                                    border: 'none',
                                }}
                            >
                                Chọn ảnh bìa
                            </Button>
                        </Upload>
                        {coverImagePreview && (
                            <img
                                src={coverImagePreview}
                                alt="preview"
                                style={{
                                    width: 200,
                                    height: 200,
                                    objectFit: 'cover',
                                    marginTop: 16,
                                    borderRadius: 8,
                                }}
                            />
                        )}
                    </Form.Item>

                    {/* Nhập lời bài hát */}
                    <Form.Item
                        name="lyrics"
                        label={
                            <span style={{ color: '#fff' }}>
                                Lời bài hát (nếu có)
                            </span>
                        }
                    >
                        <TextArea
                            rows={4}
                            placeholder="Nhập lời bài hát"
                            style={{
                                background: 'rgba(91,73,89,0.7)',
                                color: '#fff',
                                border: 'none',
                            }}
                        />
                    </Form.Item>

                    {/* Tùy chọn chế độ: Công khai / Riêng tư */}
                    <Form.Item
                        label={<span style={{ color: '#fff' }}>Chế độ</span>}
                    >
                        <Space>
                            <Switch checked={isPublic} onChange={setIsPublic} />
                            <span style={{ color: '#fff' }}>
                                {isPublic ? (
                                    <>
                                        <Globe
                                            size={16}
                                            style={{
                                                display: 'inline',
                                                marginRight: 4,
                                            }}
                                        />{' '}
                                        Công khai
                                    </>
                                ) : (
                                    <>
                                        <Lock
                                            size={16}
                                            style={{
                                                display: 'inline',
                                                marginRight: 4,
                                            }}
                                        />{' '}
                                        Riêng tư
                                    </>
                                )}
                            </span>
                        </Space>
                    </Form.Item>

                    {/* Nút Tải lên */}
                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={isSubmitting}
                            icon={<UploadIcon size={20} />}
                            style={{
                                background:
                                    'linear-gradient(to right, #ff1f9c, #ff4db2)',
                                border: 'none',
                                borderRadius: 999,
                            }}
                        >
                            {isSubmitting ? 'Đang tải lên...' : 'Tải lên'}
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
}
