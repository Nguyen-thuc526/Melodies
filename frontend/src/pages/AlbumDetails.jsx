'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
    Button,
    Space,
    Table,
    Typography,
    Spin,
    Popconfirm,
    Modal,
    List,
    message,
    Divider,
} from 'antd';
import {
    PlayCircleFilled,
    CustomerServiceOutlined,
    ClockCircleOutlined,
    DeleteOutlined,
    ExclamationCircleOutlined,
} from '@ant-design/icons';
import {
    addSongToAlbum,
    getAlbumDetail,
    getSongByArtist,
} from '../store/action/artistAction';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';

const { Text, Title } = Typography;

const AlbumDetails = () => {
    const { id } = useParams();
    const [album, setAlbum] = useState(null);
    const [loading, setLoading] = useState(true);
    const [mySongs, setMySongs] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const currentUser = useSelector((state) => state.auth.user);
    const isOwner = currentUser?._id === album?.artist?._id;
    // console.log(mySongs)

    useEffect(() => {
        const fetchSongs = async () => {
            try {
                const data = await getSongByArtist();
                setMySongs(data.data);
            } catch (err) {
                console.error('Error fetching artist songs:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchSongs();
    }, []);

    useEffect(() => {
        const fetchAlbumDetail = async () => {
            try {
                setLoading(true);
                const response = await getAlbumDetail(id);
                setAlbum(response);
            } catch (error) {
                console.error('API call failed:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAlbumDetail();
    }, [id]);

    const handlePlay = () => {
        console.log('Playing album');
    };

    const handleDelete = (songId) => {
        console.log('Deleting song:', songId);
    };

    const handleAddSong = async (songId) => {
        try {
            await addSongToAlbum(id, songId);
            message.success('Song added to album!');
            const updatedAlbum = await getAlbumDetail(id);
            setAlbum(updatedAlbum);
        } catch (error) {
            console.error('Failed to add song:', error);
            message.error('Failed to add song');
        }
    };

    const formatDuration = (seconds) => {
        if (!seconds) return '--:--';
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return hrs > 0
            ? `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
            : `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const formattedDate = album?.createdAt
        ? dayjs(album.createdAt).format('MMMM D, YYYY')
        : '';
    const formattedReleaseDate = album?.releaseDate
        ? dayjs(album.releaseDate).format('MMMM D, YYYY')
        : '';
    const songCount = album?.songs?.length || 0;
    const totalDuration =
        album?.songs?.reduce(
            (total, song) => total + (song.duration || 0),
            0
        ) || 0;

    const albumSongIds = album?.songs?.map((song) => song._id) || [];
    const availableSongs = mySongs.filter(
        (song) => !albumSongIds.includes(song._id)
    );
    console.log(availableSongs);
    const columns = [
        {
            title: '#',
            dataIndex: 'index',
            key: 'index',
            width: 50,
            render: (_, __, index) => (
                <Text className="text-gray-400">{index + 1}</Text>
            ),
        },
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            render: (title) => (
                <Space>
                    <Text className="text-white font-medium block">
                        {title || 'Untitled'}
                    </Text>
                </Space>
            ),
        },
        {
            title: 'Artist',
            key: 'artist',
            render: (record) => (
                <Text className="text-gray-300">
                    {album?.artist?.username || 'Unknown Artist'}
                </Text>
            ),
        },
        {
            title: <ClockCircleOutlined />,
            dataIndex: 'duration',
            key: 'duration',
            width: 80,
            render: (duration) => (
                <Text className="text-gray-400">
                    {formatDuration(duration)}
                </Text>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            width: 80,
            render: (_, record) => (
                <Popconfirm
                    title="Are you sure to delete this song?"
                    onConfirm={(e) => {
                        e.stopPropagation();
                        handleDelete(record._id);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    okText="Yes"
                    cancelText="No"
                    icon={
                        <ExclamationCircleOutlined style={{ color: 'red' }} />
                    }
                >
                    <Button
                        type="text"
                        shape="circle"
                        icon={<DeleteOutlined style={{ color: '#ff4d4f' }} />}
                        className="hover:text-red-500"
                        onClick={(e) => e.stopPropagation()}
                    />
                </Popconfirm>
            ),
        },
    ];

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center text-white bg-gradient-to-b from-[#231829] to-[#121212]">
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div className="min-h-screen text-white bg-gradient-to-b from-[#231829] to-[#121212]">
            <div className="max-w-6xl mx-auto p-6">
                {/* Header Section */}
                <div
                    className="rounded-lg mb-8 p-6"
                    style={{ background: 'rgba(0,0,0,0.2)' }}
                >
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                        {album?.coverImage ? (
                            <img
                                src={album.coverImage}
                                alt={album.title}
                                className="h-48 w-48 rounded-md shadow-lg object-cover flex-shrink-0"
                            />
                        ) : (
                            <div className="h-48 w-48 rounded-md shadow-lg flex-shrink-0 bg-gradient-to-br from-purple-700 to-purple-900 flex items-center justify-center">
                                <div className="text-white text-center">
                                    <CustomerServiceOutlined className="text-5xl mb-2 opacity-80" />
                                    <span className="text-xl font-bold">
                                        {album?.title
                                            ?.charAt(0)
                                            .toUpperCase() || 'A'}
                                    </span>
                                </div>
                            </div>
                        )}

                        <div className="flex flex-col justify-end text-center md:text-left">
                            <span style={{ color: 'white' }}>ALBUM</span>
                            <Title
                                style={{ color: 'white' }}
                                level={1}
                                className="text-4xl md:text-6xl font-bold mb-2 leading-tight text-white"
                            >
                                {album?.title || 'Album Title'}
                            </Title>
                            <Text className="text-gray-300 mb-2">
                                {album?.description || 'No description'}
                            </Text>
                            <div className="text-sm text-gray-400 flex flex-wrap items-center gap-2 justify-center md:justify-start">
                                <div>
                                    {album?.artist?.username ||
                                        'Unknown Artist'}
                                </div>
                                <span>•</span>
                                <div>Genre: {album?.genre || 'Unknown'}</div>
                                <span>•</span>
                                <div>Release: {formattedReleaseDate}</div>
                                <span>•</span>
                                <div>{songCount} songs</div>
                                <span>•</span>
                                <div>{formatDuration(totalDuration)}</div>
                            </div>

                            <div className="flex items-center gap-4 mt-6 justify-center md:justify-start">
                                <Button
                                    type="primary"
                                    shape="circle"
                                    size="large"
                                    onClick={handlePlay}
                                    className="bg-green-500 hover:bg-green-400 border-none"
                                    icon={
                                        <PlayCircleFilled
                                            style={{ fontSize: 24 }}
                                        />
                                    }
                                />
                                {isOwner && (
                                    <Button
                                        type="default"
                                        className="text-white border-white hover:border-gray-300 hover:text-gray-300"
                                        onClick={() => setIsModalVisible(true)}
                                    >
                                        + Add Songs
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Song List */}
                <div className="bg-black/20 rounded-lg p-4">
                    {!album?.songs || album.songs.length === 0 ? (
                        <div className="flex justify-center items-center h-64 text-gray-400">
                            <p>No songs in this album yet</p>
                        </div>
                    ) : (
                        <Table
                            dataSource={album.songs}
                            columns={columns}
                            rowKey={(record) =>
                                record._id || Math.random().toString()
                            }
                            pagination={false}
                            className="playlist-table"
                            onRow={(record) => ({
                                onClick: () =>
                                    console.log('Selected song:', record),
                                className:
                                    'hover:bg-white/10 transition-colors cursor-pointer',
                            })}
                        />
                    )}
                </div>
            </div>

            {/* Add Song Modal */}
            <Modal
                title="Add Songs to Album"
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
                centered
                styles={{ body: { backgroundColor: '#231829' } }}
                className="custom-modal"
            >
                {availableSongs.length === 0 ? (
                    <p className="text-white text-center">
                        No available songs to add
                    </p>
                ) : (
                    <List
                        itemLayout="horizontal"
                        dataSource={availableSongs}
                        renderItem={(song, index) => (
                            <>
                                <List.Item
                                    className="p-3  hover:bg-white/10 transition-colors cursor-pointer rounded "
                                    onClick={() => handleAddSong(song._id)}
                                >
                                    <List.Item.Meta
                                        avatar={
                                            song.coverImage ? (
                                                <img
                                                    src={song.coverImage}
                                                    alt={song.title}
                                                    className="h-12 w-12 object-cover rounded"
                                                />
                                            ) : (
                                                <div className="h-12 w-12 rounded bg-purple-700 text-white flex items-center justify-center text-sm font-bold">
                                                    {song.title?.charAt(0) ||
                                                        'S'}
                                                </div>
                                            )
                                        }
                                        title={
                                            <span className="text-white">
                                                {song.title}
                                            </span>
                                        }
                                    />
                                    <span className="text-gray-400 text-sm">
                                        {formatDuration(song.duration)}
                                    </span>
                                </List.Item>
                                {index !== availableSongs.length - 1 && (
                                    <Divider
                                        style={{
                                            margin: '8px 0',
                                            borderColor: '#444',
                                        }}
                                    />
                                )}
                            </>
                        )}
                    />
                )}
            </Modal>

            <style>{`
                .playlist-table .ant-table {
                    background: transparent !important;
                    color: white;
                }
                .playlist-table .ant-table-thead > tr > th {
                    background: transparent !important;
                    color: #a0a0a0 !important;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                    font-size: 12px;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }
                .playlist-table .ant-table-tbody > tr > td {
                    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                    transition: all 0.3s;
                }
                .playlist-table .ant-table-tbody > tr:hover > td {
                    background: rgba(255, 255, 255, 0.1) !important;
                }
                .playlist-table .ant-table-cell {
                    color: white;
                }
                .playlist-table .ant-empty-description {
                    color: white;
                }
                .custom-modal .ant-modal-content {
                    background-color: #231829 !important;
                    border-radius: 1rem;
                }
                .custom-modal .ant-modal-title {
                    color: white !important;
                }
                .custom-modal .ant-modal-close {
                    color: white !important;
                }
            `}</style>
        </div>
    );
};

export default AlbumDetails;
