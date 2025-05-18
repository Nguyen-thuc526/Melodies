import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { format } from 'date-fns';
import {
    PlayCircleFilled,
    HeartOutlined,
    HeartFilled,
    ClockCircleOutlined,
    CustomerServiceOutlined,
    ExclamationCircleOutlined,
    DeleteOutlined,
} from '@ant-design/icons';
import {
    Button,
    Table,
    Typography,
    Space,
    Spin,
    message,
    Popconfirm,
} from 'antd';
import {
    deleteSongFromPlaylist,
    getSongDetail,
} from '../store/action/userAction';

const { Title, Text } = Typography;

export default function PlaylistDetail() {
    const location = useLocation();
    const playlist = location.state?.playlist;
    const [isFavorite, setIsFavorite] = useState(false);
    const [enrichedSongs, setEnrichedSongs] = useState([]);
    const [currentSongIndex, setCurrentSongIndex] = useState(null);
    const audioRef = useRef(null);

    const handleDelete = async (songId) => {
        try {
            if (playlist) {
                await deleteSongFromPlaylist(playlist._id, songId);
                message.success('Song removed from playlist.');
                setEnrichedSongs((prevSongs) =>
                    prevSongs.filter((song) => song._id !== songId)
                );
            }
        } catch (error) {
            message.error(
                error.response?.data?.message ||
                    'Failed to remove song due to server error.'
            );
        }
    };

    useEffect(() => {
        const fetchSongDetails = async () => {
            if (!playlist?.songs?.length) return;

            const promises = playlist.songs.map(async (song) => {
                try {
                    const res = await getSongDetail(song._id);
                    return res.data.data;
                } catch (err) {
                    console.error(`Error fetching song ${song._id}`, err);
                    return song;
                }
            });

            const detailedSongs = await Promise.all(promises);
            setEnrichedSongs(detailedSongs);
        };

        fetchSongDetails();
    }, [playlist]);

    useEffect(() => {
        if (
            currentSongIndex !== null &&
            enrichedSongs[currentSongIndex]?.audioUrl
        ) {
            const audio = new Audio(enrichedSongs[currentSongIndex].audioUrl);
            audioRef.current = audio;

            audio.play().catch((err) => console.error('Playback failed', err));

            audio.onended = () => {
                if (currentSongIndex + 1 < enrichedSongs.length) {
                    setCurrentSongIndex(currentSongIndex + 1);
                } else {
                    setCurrentSongIndex(null);
                }
            };

            return () => {
                audio.pause();
            };
        }
    }, [currentSongIndex]);

    if (!playlist) {
        return (
            <div
                style={{ backgroundColor: '#2c1e36' }}
                className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#231829] to-[#121212]"
            >
                No playlist data found.
            </div>
        );
    }

    const getGradient = (name) => {
        const hash = name.split('').reduce((acc, char) => {
            return char.charCodeAt(0) + ((acc << 5) - acc);
        }, 0);

        const hue1 = Math.abs(hash % 360);
        const hue2 = (hue1 + 40) % 360;

        return `linear-gradient(135deg, hsl(${hue1}, 70%, 50%), hsl(${hue2}, 70%, 30%))`;
    };

    const formattedDate = format(new Date(playlist.createdAt), 'yyyy');
    const songCount = enrichedSongs.length;
    const totalDuration = enrichedSongs.reduce(
        (total, song) => total + (song.duration || 0),
        0
    );

    const handlePlay = () => {
        if (enrichedSongs.length > 0) {
            setCurrentSongIndex(0);
        }
    };

    const toggleFavorite = () => {
        setIsFavorite(!isFavorite);
    };

    const formatDuration = (seconds) => {
        if (!seconds) return '--:--';
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return hrs > 0
            ? `${hrs}:${mins.toString().padStart(2, '0')}:${secs
                  .toString()
                  .padStart(2, '0')}`
            : `${mins}:${secs.toString().padStart(2, '0')}`;
    };

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
                    {record.artist?.username || 'Unknown Artist'}
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

    return (
        <div className="min-h-screen text-white bg-gradient-to-b from-[#231829] to-[#121212]">
            <div className="max-w-6xl mx-auto p-6">
                {/* Header Section */}
                <div
                    className="rounded-lg mb-8 p-6"
                    style={{ background: 'rgba(0,0,0,0.2)' }}
                >
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                        <div
                            className="h-48 w-48 rounded-md shadow-lg flex-shrink-0"
                            style={{
                                background: getGradient(playlist.name),
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <div className="flex flex-col items-center justify-center text-white">
                                <CustomerServiceOutlined className="text-5xl mb-2 opacity-80" />
                                <span className="text-xl font-bold">
                                    {playlist.name.charAt(0).toUpperCase()}
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-col justify-end text-center md:text-left">
                            <span style={{ color: 'white' }}>PLAYLIST</span>
                            <Title
                                level={1}
                                style={{ color: 'white' }}
                                className=" text-4xl md:text-6xl font-bold mb-2 leading-tight"
                            >
                                {playlist.name}
                            </Title>
                            <div className="text-sm text-gray-400 flex flex-wrap items-center gap-2 justify-center md:justify-start">
                                <Text className="text-gray-400">
                                    Created {formattedDate}
                                </Text>
                                <span>•</span>
                                <Text className="text-gray-400">
                                    {songCount} songs
                                </Text>
                                <span>•</span>
                                <Text className="text-gray-400">
                                    {formatDuration(totalDuration)}
                                </Text>
                            </div>

                            <div className="flex items-center gap-4 mt-6 justify-center md:justify-start">
                                <Button
                                    type="primary"
                                    shape="circle"
                                    size="large"
                                    onClick={handlePlay}
                                    className="bg-green-500 hover:bg-green-400 border-none flex items-center justify-center"
                                    icon={
                                        <PlayCircleFilled
                                            style={{ fontSize: 24 }}
                                        />
                                    }
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Song List */}
                {!enrichedSongs || enrichedSongs.length === 0 ? (
                    <div className="flex justify-center items-center h-64 text-gray-400">
                        <p>No songs in this playlist yet</p>
                    </div>
                ) : (
                    <div className="bg-black/20 rounded-lg p-4">
                        <Table
                            dataSource={enrichedSongs}
                            columns={columns}
                            rowKey={(record) =>
                                record._id || Math.random().toString()
                            }
                            pagination={false}
                            className="playlist-table"
                            onRow={(record) => ({
                                onClick: () => {
                                    const index = enrichedSongs.findIndex(
                                        (s) => s._id === record._id
                                    );
                                    setCurrentSongIndex(index);
                                },
                                className:
                                    'hover:bg-white/10 transition-colors cursor-pointer',
                            })}
                        />
                    </div>
                )}
            </div>

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
                    
            `}</style>
        </div>
    );
}
