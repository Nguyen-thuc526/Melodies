'use client';

import { useEffect, useState } from 'react';
import {
    Button,
    Typography,
    Modal,
    Form,
    Input,
    Select,
    Upload,
    Spin,
    message,
    ConfigProvider,
    theme,
    Card,
    Skeleton,
    DatePicker,
} from 'antd';
import {
    PlusOutlined,
    UploadOutlined,
    LoadingOutlined,
    PlayCircleFilled,
} from '@ant-design/icons';
import {
    createSongArtist,
    getAllAlbum,
    getSongByArtist,
    createAlbum,
    fetchArtistInfomation,
} from '../store/action/artistAction';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;
const { Option } = Select;

const pinkTheme = {
    token: {
        colorPrimary: '#ff1493',
        colorLink: '#ff1493',
        colorLinkHover: '#ff69b4',
        colorBgContainer: '#231829',
        colorBgElevated: '#2c1e34',
        colorBorder: '#3a2a45',
        colorText: '#ffffff',
        colorTextSecondary: '#b3b3b3',
        borderRadius: 8,
    },
    algorithm: theme.darkAlgorithm,
};

const genreOptions = [
    'Pop',
    'Rock',
    'Hip-Hop',
    'R&B',
    'Electronic',
    'Classical',
    'Jazz',
    'Country',
    'Folk',
    'Blues',
    'Metal',
    'Indie',
    'K-Pop',
    'V-Pop',
    'World Music',
];

const extractAudioDuration = (file) => {
    return new Promise((resolve, reject) => {
        const audio = new Audio();
        audio.src = URL.createObjectURL(file);
        audio.addEventListener('loadedmetadata', () => {
            resolve(Math.floor(audio.duration));
        });
        audio.addEventListener('error', () => {
            reject('Failed to load audio file.');
        });
    });
};

const ArtistDashboard = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAlbumModalOpen, setIsAlbumModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [albumForm] = Form.useForm();
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(true);
    const currentUser = useSelector((state) => state.auth?.user);
    const [hoveredAlbum, setHoveredAlbum] = useState(null);
    const [albums, setAlbums] = useState([]);

    useEffect(() => {
        const fetchAlbums = async () => {
            try {
                const data = await fetchArtistInfomation(currentUser._id);
                setAlbums(data?.data?.albums || []);
            } catch (error) {
                console.error('Failed to fetch albums:', error);
                setAlbums([]);
            } finally {
                setLoading(false);
            }
        };
        fetchAlbums();
    }, []);

    useEffect(() => {
        setLoading(true);
        getSongByArtist()
            .then((data) => {
                setSongs(data?.data || []);
            })
            .catch((err) => {
                console.error('Error fetching songs:', err);
                message.error('Failed to load songs.');
                setSongs([]);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const handleCreateSong = () => setIsModalOpen(true);

    const navigate = useNavigate();

    const handleCancel = () => {
        form.resetFields();
        setIsModalOpen(false);
    };

    const handleAlbumCancel = () => {
        albumForm.resetFields();
        setIsAlbumModalOpen(false);
    };

    const handleFinish = async (values) => {
        if (!values.audioFile?.length || !values.coverImage?.length) {
            message.error('Please upload both MP3 and Image files.');
            return;
        }

        const mp3File = values.audioFile[0].originFileObj;
        const imageFile = values.coverImage[0].originFileObj;

        try {
            const duration = await extractAudioDuration(mp3File);
            const rawPayload = new FormData();
            rawPayload.append('title', values.title);
            rawPayload.append('genre', values.genre);
            rawPayload.append('description', values.description);
            rawPayload.append('duration', duration.toString());
            rawPayload.append('audioFile', mp3File);
            rawPayload.append('coverImage', imageFile);

            await createSongArtist(rawPayload);
            message.success('Song created!');
            handleCancel();

            const data = await getSongByArtist();
            setSongs(data?.data || []);
        } catch (error) {
            console.error(error);
            message.error('Failed to create song. Please try again.');
        }
    };

    const handleAlbumFinish = async (values) => {
        if (!values.coverImage?.length) {
            message.error('Please upload a cover image.');
            return;
        }

        const imageFile = values.coverImage[0].originFileObj;

        try {
            const rawPayload = new FormData();
            rawPayload.append('title', values.title);
            rawPayload.append('genre', values.genre);
            rawPayload.append('description', values.description);
            rawPayload.append(
                'releaseDate',
                values.releaseDate.format('YYYY-MM-DD')
            );
            rawPayload.append('coverImage', imageFile);

            await createAlbum(rawPayload);
            message.success('Album created!');
            handleAlbumCancel();

            // Refresh albums list
            const data = await getAllAlbum();
            setAlbums(data?.data || []);
        } catch (error) {
            console.error(error);
            message.error('Failed to create album. Please try again.');
        }
    };

    const handleShowDetail = (id) => {
        window.location.href = `/song-detail/${id}`;
    };

    const handleCreateAlbum = () => {
        setIsAlbumModalOpen(true);
    };

    if (loading) {
        return (
            <div
                className="flex items-center justify-center h-screen"
                style={{ backgroundColor: '#231829' }}
            >
                <Spin
                    indicator={
                        <LoadingOutlined
                            style={{ fontSize: 40, color: '#ff1493' }}
                            spin
                        />
                    }
                />
            </div>
        );
    }

    return (
        <ConfigProvider theme={pinkTheme}>
            <div
                className="min-h-screen flex flex-col"
                style={{ backgroundColor: '#231829' }}
            >
                <div className="flex-1">
                    <div className="p-8">
                        <div className="mb-6 flex justify-between items-center flex-wrap gap-4">
                            <div>
                                <Title
                                    level={4}
                                    style={{
                                        color: '#ffffff',
                                        marginBottom: 4,
                                    }}
                                >
                                    Your Songs
                                </Title>
                                <Text
                                    style={{ color: '#b0b0b0', fontSize: 12 }}
                                >
                                    Manage and explore your music collection
                                </Text>
                            </div>
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={handleCreateSong}
                                className="bg-[#ff1493] hover:bg-[#ff69b4] border-none shadow-md shadow-pink-500/30 transition-all duration-300"
                                size="middle"
                            >
                                Create Song
                            </Button>
                        </div>

                        {Array.isArray(songs) && songs.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-[50vh] text-center">
                                <div className="rounded-full bg-[#2c1e34] p-6 mb-4">
                                    <UploadOutlined className="text-4xl text-[#ff1493]" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2 text-white">
                                    No songs yet
                                </h3>
                                <p className="text-gray-400 mb-4 max-w-md">
                                    Start creating your music collection by
                                    uploading your first song.
                                </p>
                                <Button
                                    type="primary"
                                    icon={<PlusOutlined />}
                                    onClick={handleCreateSong}
                                    className="bg-[#ff1493] hover:bg-[#ff69b4] border-none"
                                >
                                    Create Your First Song
                                </Button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                                {songs.map((song) => (
                                    <div
                                        key={song?._id || song.id}
                                        className="group cursor-pointer"
                                        onClick={() =>
                                            handleShowDetail(song?._id)
                                        }
                                    >
                                        <div className="relative overflow-hidden rounded-lg aspect-square mb-3">
                                            {song?.coverImage ? (
                                                <img
                                                    alt={
                                                        song?.title ||
                                                        'Untitled'
                                                    }
                                                    src={
                                                        song.coverImage ||
                                                        '/placeholder.svg'
                                                    }
                                                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                    crossOrigin="anonymous"
                                                />
                                            ) : (
                                                <div className="h-full w-full bg-[#2c1e34] flex items-center justify-center">
                                                    <p className="text-gray-400">
                                                        No Cover
                                                    </p>
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                                <PlayCircleFilled className="text-5xl text-[#ff1493] opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300" />
                                            </div>
                                        </div>
                                        <div className="px-1">
                                            <h3 className="font-semibold text-white truncate group-hover:text-[#ff1493] transition-colors">
                                                {song?.title || 'Untitled'}
                                            </h3>
                                            <p className="text-gray-400 text-sm truncate">
                                                {currentUser?.username ||
                                                    'Unknown Artist'}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="container mx-auto mt-10 ">
                            <div className="mb-6 flex justify-between items-center flex-wrap gap-4">
                                <div>
                                    <Title
                                        level={4}
                                        className="mb-6 text-white font-bold"
                                    >
                                        Albums
                                    </Title>
                                    <Text
                                        style={{
                                            color: '#b0b0b0',
                                            fontSize: 12,
                                        }}
                                    >
                                        Manage and explore your Album collection
                                    </Text>
                                </div>
                                <Button
                                    type="primary"
                                    icon={<PlusOutlined />}
                                    onClick={handleCreateAlbum}
                                    className="bg-[#ff1493] hover:bg-[#ff69b4] border-none shadow-md shadow-pink-500/30 transition-all duration-300"
                                    size="middle"
                                >
                                    Create Album
                                </Button>
                            </div>

                            {loading ? (
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                                    {[...Array(10)].map((_, index) => (
                                        <Card
                                            key={index}
                                            variant="borderless"
                                            className="bg-[#2a1e31] shadow-none"
                                            bodyStyle={{ padding: 0 }}
                                        >
                                            <div className="p-3">
                                                <Skeleton.Image
                                                    active
                                                    className="w-full aspect-square"
                                                />
                                                <Skeleton
                                                    active
                                                    paragraph={{ rows: 1 }}
                                                    className="mt-3"
                                                />
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            ) : Array.isArray(albums) && albums.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-[30vh] text-center">
                                    <div className="rounded-full bg-[#2c1e34] p-6 mb-4">
                                        <UploadOutlined className="text-4xl text-[#ff1493]" />
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2 text-white">
                                        No albums yet
                                    </h3>
                                    <p className="text-gray-400 mb-4 max-w-md">
                                        Start creating your album collection by
                                        creating your first album.
                                    </p>
                                    <Button
                                        type="primary"
                                        icon={<PlusOutlined />}
                                        onClick={handleCreateAlbum}
                                        className="bg-[#ff1493] hover:bg-[#ff69b4] border-none"
                                    >
                                        Create Your First Album
                                    </Button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                                    {albums.map((album, index) => (
                                        <div
                                            key={album?._id || index}
                                            className="group relative cursor-pointer"
                                            onMouseEnter={() =>
                                                setHoveredAlbum(album?._id)
                                            }
                                            onMouseLeave={() =>
                                                setHoveredAlbum(null)
                                            }
                                        >
                                            <Card
                                                variant="borderless"
                                                className="bg-[#2a1e31] hover:bg-[#3a2a43] transition-all duration-300 shadow-none"
                                                styles={{
                                                    body: { padding: 0 },
                                                }}
                                                onClick={() =>
                                                    navigate(
                                                        `/artist-album/${album?._id}`
                                                    )
                                                }
                                            >
                                                <div className="p-3">
                                                    <div className="relative aspect-square mb-3 bg-[#1a1a1a] rounded-md overflow-hidden">
                                                        {album?.coverImage ? (
                                                            <img
                                                                src={
                                                                    album.coverImage ||
                                                                    '/placeholder.svg'
                                                                }
                                                                alt={`${album?.title || 'Album'} cover`}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center">
                                                                <span className="text-gray-500">
                                                                    No cover
                                                                </span>
                                                            </div>
                                                        )}
                                                        {hoveredAlbum ===
                                                            (album?._id ||
                                                                album?.id) && (
                                                            <div className="absolute bottom-2 right-2 transform transition-transform duration-300 translate-y-0 opacity-100">
                                                                <PlayCircleFilled className="text-[#ff1694] text-4xl hover:text-[#ff4db2] cursor-pointer shadow-lg" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="px-1">
                                                        <div className="px-1">
                                                            <h3 className="font-semibold text-white truncate group-hover:text-[#ff1493] transition-colors">
                                                                {album?.title ||
                                                                    'Untitled'}
                                                            </h3>
                                                            <p className="text-gray-400 text-sm truncate">
                                                                {currentUser?.username ||
                                                                    'Unknown Artist'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Card>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Create Song Modal */}
            <Modal
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
                destroyOnHidden
                className="spotify-modal"
                width={500}
                centered
                title={
                    <div className="text-center text-[#ff1493] text-xl font-semibold">
                        Create New Song
                    </div>
                }
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleFinish}
                    className="text-white mt-4"
                >
                    <Form.Item
                        label="Title"
                        name="title"
                        rules={[
                            { required: true, message: 'Please enter a title' },
                        ]}
                    >
                        <Input className="bg-[#2c1e34] border-[#3a2a45] text-white" />
                    </Form.Item>

                    <Form.Item
                        label="Genre"
                        name="genre"
                        rules={[
                            {
                                required: true,
                                message: 'Please select a genre',
                            },
                        ]}
                    >
                        <Select
                            placeholder="Select genre"
                            className="text-white"
                        >
                            {genreOptions.map((genre) => (
                                <Option key={genre} value={genre}>
                                    {genre}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Description"
                        name="description"
                        rules={[
                            {
                                required: true,
                                message: 'Please enter a description',
                            },
                        ]}
                    >
                        <Input.TextArea
                            rows={3}
                            className="bg-[#2c1e34] border-[#3a2a45] text-white"
                        />
                    </Form.Item>

                    <Form.Item
                        label="MP3 File"
                        name="audioFile"
                        valuePropName="fileList"
                        getValueFromEvent={(e) =>
                            Array.isArray(e) ? e : e?.fileList || []
                        }
                        rules={[
                            {
                                required: true,
                                message: 'Please upload an MP3 file',
                            },
                        ]}
                    >
                        <Upload
                            beforeUpload={() => false}
                            accept=".mp3"
                            className="upload-pink"
                        >
                            <Button
                                icon={<UploadOutlined />}
                                className="bg-[#2c1e34] text-white border-[#3a2a45] hover:text-[#ff1493] hover:border-[#ff1493]"
                            >
                                Upload MP3
                            </Button>
                        </Upload>
                    </Form.Item>

                    <Form.Item
                        label="Cover Image"
                        name="coverImage"
                        valuePropName="fileList"
                        getValueFromEvent={(e) =>
                            Array.isArray(e) ? e : e?.fileList || []
                        }
                        rules={[
                            {
                                required: true,
                                message: 'Please upload an image',
                            },
                        ]}
                    >
                        <Upload
                            beforeUpload={() => false}
                            accept=".jpg,.jpeg,.png"
                            className="upload-pink"
                        >
                            <Button
                                icon={<UploadOutlined />}
                                className="bg-[#2c1e34] text-white border-[#3a2a45] hover:text-[#ff1493] hover:border-[#ff1493]"
                            >
                                Upload Image
                            </Button>
                        </Upload>
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                            className="bg-[#ff1493] hover:bg-[#ff69b4] h-10 text-white border-none"
                        >
                            Create Song
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Create Album Modal */}
            <Modal
                open={isAlbumModalOpen}
                onCancel={handleAlbumCancel}
                footer={null}
                destroyOnHidden
                className="spotify-modal"
                width={500}
                centered
                title={
                    <div className="text-center text-[#ff1493] text-xl font-semibold">
                        Create New Album
                    </div>
                }
            >
                <Form
                    form={albumForm}
                    layout="vertical"
                    onFinish={handleAlbumFinish}
                    className="text-white mt-4"
                >
                    <Form.Item
                        label="Title"
                        name="title"
                        rules={[
                            { required: true, message: 'Please enter a title' },
                        ]}
                    >
                        <Input className="bg-[#2c1e34] border-[#3a2a45] text-white" />
                    </Form.Item>

                    <Form.Item
                        label="Genre"
                        name="genre"
                        rules={[
                            {
                                required: true,
                                message: 'Please select a genre',
                            },
                        ]}
                    >
                        <Select
                            placeholder="Select genre"
                            className="text-white"
                        >
                            {genreOptions.map((genre) => (
                                <Option key={genre} value={genre}>
                                    {genre}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Description"
                        name="description"
                        rules={[
                            {
                                required: true,
                                message: 'Please enter a description',
                            },
                        ]}
                    >
                        <Input.TextArea
                            rows={3}
                            className="bg-[#2c1e34] border-[#3a2a45] text-white"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Release Date"
                        name="releaseDate"
                        rules={[
                            {
                                required: true,
                                message: 'Please select a release date',
                            },
                        ]}
                    >
                        <DatePicker
                            className="w-full bg-[#2c1e34] border-[#3a2a45] text-white"
                            placeholder="Select release date"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Cover Image"
                        name="coverImage"
                        valuePropName="fileList"
                        getValueFromEvent={(e) =>
                            Array.isArray(e) ? e : e?.fileList || []
                        }
                        rules={[
                            {
                                required: true,
                                message: 'Please upload an image',
                            },
                        ]}
                    >
                        <Upload
                            beforeUpload={() => false}
                            accept=".jpg,.jpeg,.png"
                            className="upload-pink"
                            listType="picture-card"
                        >
                            <div className="flex flex-col items-center justify-center">
                                <UploadOutlined className="text-lg mb-1" />
                                <div className="text-xs">Upload</div>
                            </div>
                        </Upload>
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                            className="bg-[#ff1493] hover:bg-[#ff69b4] h-10 text-white border-none"
                        >
                            Create Album
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </ConfigProvider>
    );
};

export default ArtistDashboard;
