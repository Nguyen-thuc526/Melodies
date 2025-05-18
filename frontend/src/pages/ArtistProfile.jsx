import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { fetchArtistInfomation } from '../store/action/artistAction';
import { formatDistanceToNow } from 'date-fns';
import {
    Button,
    Table,
    Card,
    Divider,
    Avatar,
    Space,
    Tag,
    Typography,
    Row,
    Col,
    Statistic,
    Spin,
} from 'antd';
import {
    PlayCircleOutlined,
    PauseCircleOutlined,
    UserOutlined,
    HeartOutlined,
    ShareAltOutlined,
    MoreOutlined,
    ClockCircleOutlined,
    SoundOutlined,
    RetweetOutlined,
} from '@ant-design/icons';
import '../assets/css/ArtistProfile.css';

const { Title, Text, Paragraph } = Typography;

const ArtistProfile = () => {
    const { id } = useParams();
    const [artistInfo, setArtistInfo] = useState(null);
    const [error, setError] = useState(null);
    const [currentSongIndex, setCurrentSongIndex] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(new Audio());

    useEffect(() => {
        const getArtistInfo = async () => {
            try {
                const response = await fetchArtistInfomation(id);
                setArtistInfo(response?.data);
            } catch (err) {
                console.error(
                    'Failed to fetch artist info:',
                    err.response?.data?.message || err.message
                );
                setError(err);
            }
        };

        if (id) {
            getArtistInfo();
        }

        return () => {
            audioRef.current.pause();
        };
    }, [id]);

    useEffect(() => {
        const audio = audioRef.current;

        const handleEnded = () => {
            playNextSong();
        };

        audio.addEventListener('ended', handleEnded);

        return () => {
            audio.removeEventListener('ended', handleEnded);
        };
    }, [artistInfo]);

    useEffect(() => {
        if (currentSongIndex !== null && artistInfo?.songs) {
            const song = artistInfo.songs[currentSongIndex];
            if (song?.audioUrl) {
                audioRef.current.src = song.audioUrl;
                if (isPlaying) {
                    audioRef.current
                        .play()
                        .catch((err) =>
                            console.error('Error playing audio:', err)
                        );
                }
            }
        }
    }, [currentSongIndex, artistInfo, isPlaying]);

    const playSong = (index) => {
        if (currentSongIndex === index && isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            setCurrentSongIndex(index);
            setIsPlaying(true);
            if (currentSongIndex === index) {
                audioRef.current
                    .play()
                    .catch((err) => console.error('Error playing audio:', err));
            }
        }
    };

    const playAllSongs = () => {
        if (artistInfo?.songs?.length > 0) {
            if (isPlaying) {
                audioRef.current.pause();
                setIsPlaying(false);
            } else {
                const newIndex =
                    currentSongIndex !== null ? currentSongIndex : 0;
                setCurrentSongIndex(newIndex);
                setIsPlaying(true);
            }
        }
    };

    const playNextSong = () => {
        if (artistInfo?.songs?.length > 0 && currentSongIndex !== null) {
            const nextIndex = (currentSongIndex + 1) % artistInfo.songs.length;
            setCurrentSongIndex(nextIndex);
            setIsPlaying(true);
        }
    };

    const shufflePlay = () => {
        if (artistInfo?.songs?.length > 0) {
            const randomIndex = Math.floor(
                Math.random() * artistInfo.songs.length
            );
            setCurrentSongIndex(randomIndex);
            setIsPlaying(true);
        }
    };

    const userDetail = artistInfo?.userDetail || {};
    const songs = artistInfo?.songs || [];

    const formatDuration = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const genreCounts = songs.reduce((acc, song) => {
        acc[song.genre] = (acc[song.genre] || 0) + 1;
        return acc;
    }, {});

    const totalDuration = songs.reduce(
        (total, song) => total + song.duration,
        0
    );
    const totalMinutes = Math.floor(totalDuration / 60);

    const lastUpdated = userDetail?.updatedAt
        ? formatDistanceToNow(new Date(userDetail.updatedAt), {
              addSuffix: true,
          })
        : 'N/A';

    const columns = [
        {
            title: '#',
            dataIndex: 'index',
            key: 'index',
            width: 50,
            render: (_, __, index) => (
                <div className="flex items-center">
                    {currentSongIndex === index && isPlaying ? (
                        <SoundOutlined className="text-pink-500 animate-pulse" />
                    ) : (
                        index + 1
                    )}
                </div>
            ),
        },
        {
            title: '',
            key: 'play',
            width: 50,
            render: (_, __, index) => (
                <Button
                    type="text"
                    icon={
                        currentSongIndex === index && isPlaying ? (
                            <PauseCircleOutlined />
                        ) : (
                            <PlayCircleOutlined />
                        )
                    }
                    size="small"
                    onClick={(e) => {
                        e.stopPropagation();
                        playSong(index);
                    }}
                    className="text-gray-400 hover:text-pink-500"
                />
            ),
        },
        {
            title: 'TITLE',
            dataIndex: 'title',
            key: 'title',
            render: (title, _, index) => (
                <Text
                    style={{
                        color: currentSongIndex === index ? '#FF69B4' : 'white',
                        fontWeight:
                            currentSongIndex === index ? 'bold' : 'normal',
                    }}
                >
                    {title}
                </Text>
            ),
        },
        {
            title: 'GENRE',
            dataIndex: 'genre',
            key: 'genre',
            responsive: ['md'],
            render: (genre, _, index) => (
                <Text
                    style={{
                        color: currentSongIndex === index ? '#FF69B4' : 'white',
                    }}
                >
                    {genre}
                </Text>
            ),
        },
        {
            title: <ClockCircleOutlined />,
            dataIndex: 'duration',
            key: 'duration',
            width: 80,
            align: 'center',
            responsive: ['md'],
            render: (duration, _, index) => (
                <Text
                    style={{
                        color: currentSongIndex === index ? '#FF69B4' : 'white',
                    }}
                >
                    {formatDuration(duration)}
                </Text>
            ),
        },
    ];

    if (!artistInfo) {
        return (
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.4)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 9999,
                }}
            >
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#231829]" style={{ color: 'white' }}>
            {/* Artist Header */}
            <div className="relative">
                {/* Gradient overlay for header */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#3d2c4e] to-[#231829] opacity-70" />

                <div className="container mx-auto px-4 pt-16 pb-8 relative z-10">
                    <Row gutter={[24, 24]} align="bottom">
                        <Col
                            xs={24}
                            md={6}
                            className="flex justify-center md:justify-start"
                        >
                            <Avatar
                                src={userDetail.profileImage}
                                size={180}
                                icon={<UserOutlined />}
                                className="border-4 border-[#3d2c4e] shadow-xl"
                            />
                        </Col>
                        <Col
                            xs={24}
                            md={18}
                            className="text-center md:text-left"
                        >
                            <Tag color="purple-inverse" className="mb-2">
                                ARTIST
                            </Tag>
                            <Title
                                level={1}
                                style={{ color: 'white' }}
                                className="m-0 mb-2"
                            >
                                {userDetail.fullName}
                            </Title>
                            <Space
                                split={
                                    <Divider
                                        type="vertical"
                                        className="bg-gray-600"
                                    />
                                }
                                className="text-gray-300 text-sm"
                            >
                                <Text className="text-gray-300 flex items-center">
                                    <UserOutlined className="mr-1" />{' '}
                                    {userDetail.location}
                                </Text>
                                <Text className="text-gray-300 flex items-center">
                                    <SoundOutlined className="mr-1" />{' '}
                                    {songs.length} songs
                                </Text>
                                <Text className="text-gray-300">
                                    Updated {lastUpdated}
                                </Text>
                            </Space>
                        </Col>
                    </Row>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="container mx-auto px-4 py-4">
                <Space wrap>
                    <Button
                        type="primary"
                        icon={
                            isPlaying ? (
                                <PauseCircleOutlined />
                            ) : (
                                <PlayCircleOutlined />
                            )
                        }
                        size="large"
                        onClick={playAllSongs}
                        className="bg-pink-500 hover:bg-pink-600 border-0 rounded-full px-6"
                    >
                        {isPlaying ? 'Pause' : 'Play'}
                    </Button>
                </Space>
            </div>

            {/* Artist Bio */}
            <div className="container mx-auto px-4 py-6">
                <Card className="bg-[#2a1e32] border-0 rounded-xl">
                    <Title
                        level={4}
                        style={{ color: 'white' }}
                        className="mb-3"
                    >
                        About
                    </Title>
                    <Paragraph className="text-gray-300">
                        {userDetail.bio}
                    </Paragraph>

                    <Row gutter={[16, 16]} className="mt-6">
                        <Col xs={24} md={8}>
                            <Card className="bg-[#342339] border-0 rounded-lg">
                                <Statistic
                                    title={
                                        <Text className="text-gray-400">
                                            Location
                                        </Text>
                                    }
                                    value={userDetail.location}
                                    valueStyle={{ color: 'white' }}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} md={8}>
                            <Card className="bg-[#342339] border-0 rounded-lg">
                                <Statistic
                                    title={
                                        <Text className="text-gray-400">
                                            Genres
                                        </Text>
                                    }
                                    value={Object.keys(genreCounts).join(', ')}
                                    valueStyle={{ color: 'white' }}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} md={8}>
                            <Card className="bg-[#342339] border-0 rounded-lg">
                                <Statistic
                                    title={
                                        <Text className="text-gray-400">
                                            Total Listening Time
                                        </Text>
                                    }
                                    value={`${totalMinutes} minutes`}
                                    valueStyle={{ color: 'white' }}
                                />
                            </Card>
                        </Col>
                    </Row>
                </Card>
            </div>

            {/* Now Playing Section (visible when a song is playing) */}
            {currentSongIndex !== null && (
                <div className="container mx-auto px-4 py-2">
                    <Card className="bg-[#342339] border-0 rounded-xl">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Button
                                    type="primary"
                                    shape="circle"
                                    icon={
                                        isPlaying ? (
                                            <PauseCircleOutlined />
                                        ) : (
                                            <PlayCircleOutlined />
                                        )
                                    }
                                    onClick={playAllSongs}
                                    className="bg-pink-500 hover:bg-pink-600 border-0"
                                />
                                <div>
                                    <Text
                                        strong
                                        style={{ color: '#FF69B4' }}
                                        className="block"
                                    >
                                        Now Playing:{' '}
                                        {songs[currentSongIndex]?.title}
                                    </Text>
                                    <Text className="text-gray-400">
                                        {songs[currentSongIndex]?.genre}
                                    </Text>
                                </div>
                            </div>
                            <Button
                                type="text"
                                icon={<RetweetOutlined />}
                                onClick={playNextSong}
                                className="text-gray-400 hover:text-white"
                            >
                                Next
                            </Button>
                        </div>
                    </Card>
                </div>
            )}

            {/* Songs Section */}
            <div className="container mx-auto px-4 py-6">
                <div className="flex items-center justify-between mb-4">
                    <Title level={2} style={{ color: 'white' }} className="m-0">
                        Popular Songs
                    </Title>
                    <Button
                        type="text"
                        icon={<RetweetOutlined />}
                        onClick={shufflePlay}
                        className="text-gray-400 hover:text-white"
                    >
                        Shuffle Play
                    </Button>
                </div>

                <Card className="bg-[#2a1e32] border-0 rounded-xl">
                    <Table
                        dataSource={songs}
                        columns={columns}
                        rowKey="_id"
                        pagination={false}
                        className="artist-songs-table"
                        size="middle"
                        style={{
                            backgroundColor: '#2a1e32',
                        }}
                        onRow={(record, index) => ({
                            onClick: () => playSong(index),
                            className:
                                currentSongIndex === index
                                    ? 'bg-[#342339] hover:bg-[#3d2c4e]'
                                    : 'hover:bg-[#342339]',
                            style: { cursor: 'pointer' },
                        })}
                    />
                </Card>
            </div>

            {/* Genre Breakdown */}
            <div className="container mx-auto px-4 py-6">
                <Title level={2} style={{ color: 'white' }} className="mb-4">
                    Genre Breakdown
                </Title>
                <Row gutter={[16, 16]}>
                    {Object.entries(genreCounts).map(([genre, count]) => (
                        <Col xs={24} md={12} key={genre}>
                            <Card className="bg-[#2a1e32] border-0 rounded-xl">
                                <div className="flex items-center gap-4">
                                    <Avatar
                                        size={48}
                                        icon={<SoundOutlined />}
                                        className="bg-[#3d2c4e]"
                                    />
                                    <div>
                                        <Text
                                            strong
                                            style={{ color: 'white' }}
                                            className="block"
                                        >
                                            {genre}
                                        </Text>
                                        <Text className="text-gray-400">
                                            {count} songs
                                        </Text>
                                    </div>
                                </div>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </div>

            {/* Footer */}
            <div className="container mx-auto px-4 py-8">
                <Divider className="bg-[#3d2c4e]" />
                <div className="text-center text-gray-500 text-sm">
                    © 2025 Music Platform • Artist Profile
                </div>
            </div>
        </div>
    );
};

export default ArtistProfile;
