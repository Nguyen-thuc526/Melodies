import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
    addSongFromPlaylist,
    commentSongs,
    getPlaylist,
    getSongDetail,
    likeSongs,
} from '../store/action/userAction';
import {
    Typography,
    Spin,
    Input,
    Avatar,
    List,
    Form,
    Divider,
    Button,
    Progress,
    Tooltip,
    message,
    Card,
    Skeleton,
    Tag,
    ConfigProvider,
    theme,
    Slider,
    Modal,
} from 'antd';
import {
    PlayCircleFilled,
    HeartFilled,
    HeartOutlined,
    MessageOutlined,
    EyeOutlined,
    PauseCircleFilled,
    SendOutlined,
    UserOutlined,
    CalendarOutlined,
    ClockCircleOutlined,
    SoundOutlined,
    SaveOutlined,
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const SongDetails = () => {
    const { id } = useParams();
    const [songDetail, setSongDetail] = useState(null);
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isAudioReady, setIsAudioReady] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [comments, setComments] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [likingInProgress, setLikingInProgress] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [loading, setLoading] = useState(true);
    const [messageApi, contextHolder] = message.useMessage();
    const [volume, setVolume] = useState(1);
    const [playlist, setPlaylist] = useState([]);
    const [showPlaylistDropdown, setShowPlaylistDropdown] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleVolumeChange = (value) => {
        setVolume(value);
        if (audioRef.current) {
            audioRef.current.volume = value;
        }
    };
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    const handleAddSong = async (playlistId, songId) => {
        try {
            await addSongFromPlaylist(playlistId, songId);
            await messageApi.success('Song added to playlist.');
            fetchPlaylist();
        } catch (error) {
            messageApi.error(
                error.response?.data?.message ||
                    'Failed to add song due to server error.'
            );
        }
    };

    // Audio player controls
    const handleAudioCanPlayThrough = () => {
        setIsAudioReady(true);
        setDuration(audioRef.current.duration);
    };

    const handleTimeUpdate = () => {
        setCurrentTime(audioRef.current.currentTime);
    };

    const handleProgressChange = (value) => {
        if (audioRef.current) {
            audioRef.current.currentTime = (value / 100) * duration;
        }
    };
    const fetchPlaylist = async () => {
        setLoading(true);
        try {
            const data = await getPlaylist();
            setPlaylist(data.data);
        } catch (error) {
            message.error('Failed to load playlist.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlaylist();
    }, []);
    const handlePlayClick = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    // Data fetching
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await getSongDetail(id);
                setSongDetail(res.data.data);
                setComments(res.data.data.comments || []);
                setTimeout(() => setLoading(false), 500); // Add slight delay for smoother transition
            } catch (error) {
                console.error('Failed to fetch song details:', error);
                messageApi.error('Failed to load song details');
                setLoading(false);
            }
        };

        if (id) {
            fetchData();
        }
    }, [id, messageApi]);

    useEffect(() => {
        if (songDetail) {
            const currentUserId = localStorage.getItem('userId');
            const hasLiked = songDetail.likes.some(
                (like) => like.userId === currentUserId
            );

            setIsLiked(hasLiked);
            setLikeCount(songDetail.likes.length);
        }
    }, [songDetail]);

    // Comment handling
    const handleCommentSubmit = async () => {
        if (!commentText.trim()) return;

        setSubmitting(true);
        try {
            const response = await commentSongs(id, commentText);

            if (response.comments) {
                setComments(response.comments);
            } else {
                // Fallback if API doesn't return updated comments
                setComments([
                    ...comments,
                    {
                        id: Date.now().toString(),
                        text: commentText,
                        user: { username: 'You', avatar: null },
                        createdAt: new Date().toISOString(),
                    },
                ]);
            }

            setCommentText('');
            messageApi.success('Comment posted successfully');
        } catch (error) {
            console.error('Failed to post comment:', error);
            messageApi.error('Failed to post comment');
        } finally {
            setSubmitting(false);
        }
    };

    // Like handling
    const handleLike = async () => {
        if (likingInProgress) return;

        setLikingInProgress(true);

        // Optimistic UI update
        setIsLiked(!isLiked);
        setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));

        try {
            // Special handling when like count is 1
            if (likeCount === 1) {
                await likeSongs(id);
            } else {
                await likeSongs(id);
            }

            // Success message
            messageApi.success(
                isLiked ? 'Removed from favorites' : 'Added to favorites'
            );
        } catch (error) {
            console.error('Failed to like song:', error);

            // Revert optimistic update on error
            setIsLiked(!isLiked);
            setLikeCount((prev) => (isLiked ? prev + 1 : prev - 1));
            messageApi.error('Failed to update like status');
        } finally {
            setLikingInProgress(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-gradient-to-b from-[#1E1E2E] to-[#0F0F17] min-h-screen p-4 md:p-10 text-white">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Skeleton.Image
                            active
                            className="w-full h-[400px] rounded-2xl"
                        />
                        <div className="space-y-6">
                            <Skeleton
                                active
                                paragraph={{ rows: 1 }}
                                title={{
                                    width: '80%',
                                    style: { height: '40px' },
                                }}
                            />
                            <Skeleton
                                active
                                paragraph={{ rows: 1 }}
                                title={{ width: '50%' }}
                            />
                            <Skeleton.Button
                                active
                                size="large"
                                shape="round"
                                block
                                className="mt-4"
                            />
                            <Skeleton active paragraph={{ rows: 4 }} />
                        </div>
                    </div>
                    <div className="mt-12">
                        <Skeleton active paragraph={{ rows: 6 }} />
                    </div>
                </div>
            </div>
        );
    }

    if (!songDetail) {
        return (
            <div className="flex items-center justify-center h-screen bg-[#1E1E2E] text-white">
                <Spin size="large" />
            </div>
        );
    }

    return (
        <ConfigProvider
            theme={{
                algorithm: theme.darkAlgorithm,
                token: {
                    colorPrimary: '#BB6AA6',
                    borderRadius: 8,
                },
                components: {
                    Button: {
                        colorPrimaryHover: '#9B4C8B',
                    },
                },
            }}
        >
            {contextHolder}
            <div className="bg-gradient-to-b from-[#1E1E2E] to-[#0F0F17] min-h-screen p-4 md:p-10 text-white">
                <div className="max-w-7xl mx-auto">
                    {/* Song Header Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                        <div className="w-full group relative">
                            <div className="overflow-hidden rounded-2xl shadow-[0_0_30px_rgba(155,76,139,0.3)] transition-all duration-500 hover:shadow-[0_0_40px_rgba(155,76,139,0.5)]">
                                <img
                                    src={
                                        songDetail.coverImage ||
                                        '/placeholder.svg?height=500&width=500'
                                    }
                                    alt={`${songDetail.title} cover art`}
                                    className="w-full object-cover rounded-2xl transition-transform duration-700 group-hover:scale-105"
                                    style={{ aspectRatio: '1/1' }}
                                />
                            </div>

                            {/* Floating play button on image */}
                            <button
                                onClick={handlePlayClick}
                                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/50 backdrop-blur-md text-white rounded-full p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-[#9B4C8B]/80 hover:scale-110"
                                aria-label={isPlaying ? 'Pause' : 'Play'}
                            >
                                {isPlaying ? (
                                    <PauseCircleFilled className="text-4xl" />
                                ) : (
                                    <PlayCircleFilled className="text-4xl" />
                                )}
                            </button>
                        </div>

                        <div className="flex flex-col h-full ">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <Tag
                                        color="#9B4C8B"
                                        className="uppercase text-xs font-bold tracking-wider"
                                    >
                                        {songDetail.genre}
                                    </Tag>
                                    <Text className="text-gray-400 text-sm">
                                        <CalendarOutlined className="mr-1" />
                                        {new Date(
                                            songDetail.releaseDate
                                        ).toLocaleDateString()}
                                    </Text>
                                </div>

                                <Title
                                    level={1}
                                    className="!text-white text-3xl md:text-4xl lg:text-5xl font-bold mb-2 leading-tight"
                                >
                                    {songDetail.title}
                                </Title>

                                <Text className="text-gray-300 text-lg block mb-4">
                                    By{' '}
                                    <span className="text-[#BB6AA6] hover:underline cursor-pointer">
                                        {songDetail.artist.username}
                                    </span>
                                </Text>

                                <div className="flex flex-wrap items-center gap-4 mb-6 text-sm">
                                    <Tooltip title="Plays">
                                        <div className="flex items-center gap-1 text-gray-300">
                                            <EyeOutlined />{' '}
                                            {songDetail.plays.toLocaleString()}
                                        </div>
                                    </Tooltip>

                                    <Tooltip title="Likes">
                                        <div className="flex items-center gap-1 text-gray-300">
                                            <HeartOutlined />{' '}
                                            {likeCount.toLocaleString()}
                                        </div>
                                    </Tooltip>

                                    <Tooltip title="Comments">
                                        <div className="flex items-center gap-1 text-gray-300">
                                            <MessageOutlined />{' '}
                                            {comments.length.toLocaleString()}
                                        </div>
                                    </Tooltip>

                                    <Tooltip title="Duration">
                                        <div className="flex items-center gap-1 text-gray-300">
                                            <ClockCircleOutlined />{' '}
                                            {formatTime(duration)}
                                        </div>
                                    </Tooltip>
                                </div>

                                {/* Audio Player */}
                                <div className="bg-[#2A2331]/80 backdrop-blur-sm rounded-xl p-4 mb-6">
                                    <audio
                                        ref={audioRef}
                                        className="hidden"
                                        onCanPlayThrough={
                                            handleAudioCanPlayThrough
                                        }
                                        onTimeUpdate={handleTimeUpdate}
                                        onEnded={() => setIsPlaying(false)}
                                    >
                                        <source
                                            src={songDetail.audioUrl}
                                            type="audio/mp3"
                                        />
                                        Your browser does not support the audio
                                        element.
                                    </audio>

                                    <div className="flex items-center gap-4 mb-3">
                                        <button
                                            onClick={handlePlayClick}
                                            disabled={!isAudioReady}
                                            className={`flex-shrink-0 text-3xl text-white hover:text-[#BB6AA6] transition-colors ${!isAudioReady ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            aria-label={
                                                isPlaying ? 'Pause' : 'Play'
                                            }
                                        >
                                            {isPlaying ? (
                                                <PauseCircleFilled />
                                            ) : (
                                                <PlayCircleFilled />
                                            )}
                                        </button>

                                        <div className="flex-grow">
                                            <div className="flex justify-between text-xs text-gray-400 mb-1">
                                                <span>
                                                    {formatTime(currentTime)}
                                                </span>
                                                <span>
                                                    {formatTime(duration)}
                                                </span>
                                            </div>
                                            <Progress
                                                percent={
                                                    (currentTime / duration) *
                                                        100 || 0
                                                }
                                                showInfo={false}
                                                strokeColor="#BB6AA6"
                                                trailColor="#3A3241"
                                                className="custom-progress"
                                                onChange={handleProgressChange}
                                            />
                                        </div>

                                        <div className="flex items-center gap-2 w-32 pt-[22px]">
                                            <SoundOutlined className="text-xl text-gray-300 hover:text-white" />
                                            <Slider
                                                min={0}
                                                max={1}
                                                step={0.01}
                                                value={volume}
                                                onChange={handleVolumeChange}
                                                className="w-full"
                                                tooltip={{ open: false }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-6">
                                <Button
                                    type={isLiked ? 'primary' : 'default'}
                                    onClick={handleLike}
                                    loading={likingInProgress}
                                    icon={
                                        isLiked ? (
                                            <HeartFilled />
                                        ) : (
                                            <HeartOutlined />
                                        )
                                    }
                                    size="large"
                                    className={`${isLiked ? 'bg-[#9B4C8B] border-[#9B4C8B]' : 'border-gray-600 text-white'} rounded-lg hover:bg-[#BB6AA6] hover:border-[#BB6AA6] hover:text-white transition-all`}
                                >
                                    {isLiked ? 'Liked' : 'Like'}
                                </Button>

                                <Button
                                    icon={<MessageOutlined />}
                                    size="large"
                                    className="border-gray-600 text-white rounded-lg hover:bg-[#BB6AA6] hover:border-[#BB6AA6] hover:text-white transition-all"
                                    onClick={() =>
                                        document
                                            .getElementById('comments-section')
                                            .scrollIntoView({
                                                behavior: 'smooth',
                                            })
                                    }
                                >
                                    Comment
                                </Button>

                                <Button
                                    icon={<SaveOutlined />}
                                    size="large"
                                    className="border-gray-600 text-white rounded-lg hover:bg-[#BB6AA6] hover:border-[#BB6AA6] hover:text-white transition-all"
                                    onClick={() => setIsModalVisible(true)}
                                >
                                    Save
                                </Button>
                            </div>

                            {/* Playlist Dropdown */}
                            {showPlaylistDropdown && (
                                <Card className="bg-[#2A2331]/80 backdrop-blur-sm border-gray-700 rounded-xl mb-6 animate-fadeIn">
                                    <div className="flex justify-between items-center mb-3">
                                        <Text className="text-white font-medium">
                                            Add to playlist
                                        </Text>
                                        <Button
                                            type="text"
                                            className="text-gray-400 hover:text-white p-0"
                                            onClick={() =>
                                                setShowPlaylistDropdown(false)
                                            }
                                        >
                                            ×
                                        </Button>
                                    </div>

                                    {loading ? (
                                        <Skeleton
                                            active
                                            paragraph={{ rows: 2 }}
                                        />
                                    ) : playlist.length > 0 ? (
                                        <List
                                            dataSource={playlist}
                                            renderItem={(item) => (
                                                <List.Item
                                                    className="border-b border-gray-700 last:border-0 py-2 hover:bg-[#3A3241]/50 rounded-md px-2 transition-colors"
                                                    onClick={() => {
                                                        handleAddSong(id);
                                                        setShowPlaylistDropdown(
                                                            false
                                                        );
                                                        messageApi.success(
                                                            `Added to ${item.name}`
                                                        );
                                                    }}
                                                >
                                                    <div className="flex items-center gap-3 cursor-pointer w-full">
                                                        <div className="w-10 h-10 bg-[#3A3241] rounded-md flex items-center justify-center">
                                                            <SaveOutlined className="text-[#BB6AA6]" />
                                                        </div>
                                                        <div>
                                                            <Text className="text-white block">
                                                                {item.name}
                                                            </Text>
                                                            <Text className="text-gray-400 text-xs">
                                                                {item.songCount ||
                                                                    0}{' '}
                                                                songs
                                                            </Text>
                                                        </div>
                                                    </div>
                                                </List.Item>
                                            )}
                                        />
                                    ) : (
                                        <div className="text-center py-4">
                                            <Text className="text-gray-400">
                                                No playlists found
                                            </Text>
                                        </div>
                                    )}
                                </Card>
                            )}
                        </div>
                    </div>

                    {/* Comments Section */}
                    <div id="comments-section" className="mt-16 scroll-mt-8">
                        <Divider className="border-gray-700 mb-8">
                            <Title
                                level={3}
                                className="!text-white !m-0 flex items-center"
                            >
                                <MessageOutlined className="mr-2 text-[#BB6AA6]" />
                                Comments{' '}
                                <span className="text-gray-400 ml-2">
                                    ({comments.length})
                                </span>
                            </Title>
                        </Divider>

                        {/* Comment Form */}
                        <Card className="bg-[#2A2331]/80 backdrop-blur-sm border-gray-700 rounded-xl mb-8">
                            <div className="flex items-start gap-4">
                                <Avatar
                                    size={46}
                                    icon={<UserOutlined />}
                                    className="bg-gradient-to-r from-[#9B4C8B] to-[#BB6AA6] flex-shrink-0"
                                />
                                <div className="flex-1">
                                    <Form.Item className="mb-3">
                                        <TextArea
                                            rows={3}
                                            value={commentText}
                                            onChange={(e) =>
                                                setCommentText(e.target.value)
                                            }
                                            placeholder="Share your thoughts about this track..."
                                            className="bg-[#3A3241] border-gray-700 text-white resize-none"
                                            maxLength={500}
                                        />
                                    </Form.Item>
                                    <div className="flex justify-between items-center">
                                        <Text className="text-gray-400 text-xs">
                                            {commentText.length}/500 characters
                                        </Text>
                                        <Button
                                            type="primary"
                                            onClick={handleCommentSubmit}
                                            loading={submitting}
                                            icon={<SendOutlined />}
                                            className="bg-[#9B4C8B] hover:bg-[#BB6AA6] border-none"
                                        >
                                            Post Comment
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Comments List */}
                        {comments.length > 0 ? (
                            <List
                                className="space-y-4"
                                itemLayout="horizontal"
                                dataSource={comments}
                                renderItem={(comment, index) => (
                                    <Card
                                        key={comment.id || index}
                                        className="bg-[#2A2331]/60 backdrop-blur-sm border-gray-700 rounded-xl hover:border-gray-500 transition-colors mb-4"
                                    >
                                        <div className="flex items-start gap-4">
                                            <Avatar
                                                size={46}
                                                src={comment.user?.avatar}
                                                icon={
                                                    !comment.user?.avatar && (
                                                        <UserOutlined />
                                                    )
                                                }
                                                className="bg-gradient-to-r from-[#9B4C8B] to-[#BB6AA6] flex-shrink-0"
                                            />
                                            <div className="flex-1">
                                                <div className="flex justify-between items-center mb-2">
                                                    <div>
                                                        <Text
                                                            strong
                                                            className="text-white text-base"
                                                        >
                                                            {comment.user
                                                                ?.username ||
                                                                'Anonymous'}
                                                        </Text>
                                                        {comment.user
                                                            ?.isArtist && (
                                                            <Tag
                                                                color="#BB6AA6"
                                                                className="ml-2 text-xs"
                                                            >
                                                                Artist
                                                            </Tag>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Text className="text-gray-400 text-xs">
                                                            {new Date(
                                                                comment.createdAt
                                                            ).toLocaleDateString()}{' '}
                                                            {new Date(
                                                                comment.createdAt
                                                            ).toLocaleTimeString(
                                                                [],
                                                                {
                                                                    hour: '2-digit',
                                                                    minute: '2-digit',
                                                                }
                                                            )}
                                                        </Text>
                                                    </div>
                                                </div>
                                                <Paragraph className="text-gray-300 mb-2 whitespace-pre-line">
                                                    {comment.text}
                                                </Paragraph>
                                            </div>
                                        </div>
                                    </Card>
                                )}
                            />
                        ) : (
                            <Card className="bg-[#2A2331]/60 backdrop-blur-sm border-gray-700 rounded-xl text-center py-8">
                                <div className="flex flex-col items-center justify-center">
                                    <MessageOutlined className="text-4xl text-gray-500 mb-4" />
                                    <Title
                                        level={4}
                                        className="!text-gray-300 !m-0 mb-2"
                                    >
                                        No comments yet
                                    </Title>
                                    <Text className="text-gray-400">
                                        Be the first to share your thoughts
                                        about this track!
                                    </Text>
                                </div>
                            </Card>
                        )}
                    </div>
                </div>
                <Modal
                    title="Add to playlist"
                    open={isModalVisible}
                    onCancel={() => setIsModalVisible(false)}
                    footer={null}
                    centered
                    styles={{
                        body: { backgroundColor: '#2A2331', color: 'white' },
                    }}
                    closable={true}
                >
                    {loading ? (
                        <Skeleton active paragraph={{ rows: 2 }} />
                    ) : playlist.length > 0 ? (
                        <List
                            dataSource={playlist}
                            renderItem={(item) => (
                                <List.Item
                                    className="border-b border-gray-700 last:border-0 py-2 hover:bg-[#3A3241]/50 rounded-md px-2 cursor-pointer transition-colors"
                                    onClick={() => {
                                        handleAddSong(item._id, id);
                                        setIsModalVisible(false);
                                    }}
                                >
                                    <div className="flex items-center gap-3 w-full">
                                        <div className="w-10 h-10 bg-[#3A3241] rounded-md flex items-center justify-center">
                                            <SaveOutlined className="text-[#BB6AA6]" />
                                        </div>
                                        <div>
                                            <Text className="text-white block">
                                                {item.name}
                                            </Text>
                                            <Text className="text-gray-400 text-xs">
                                                {item.songs?.length || 0} songs
                                            </Text>
                                        </div>
                                    </div>
                                </List.Item>
                            )}
                        />
                    ) : (
                        <div className="text-center py-4">
                            <Text className="text-gray-400">
                                No playlists found
                            </Text>
                        </div>
                    )}
                </Modal>
            </div>

            {/* Custom CSS for progress bar */}
            <style>{`
        .custom-progress .ant-progress-inner {
          overflow: hidden;
          border-radius: 4px;
        }
        
        .custom-progress:hover .ant-progress-bg {
          background-color: #D88BC4 !important;
        }
        
        .ant-progress-bg {
          transition: all 0.3s ease;
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
        </ConfigProvider>
    );
};

export default SongDetails;
