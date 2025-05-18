'use client';

import { useEffect, useState } from 'react';
import {
    Layout,
    Typography,
    List,
    Avatar,
    Button,
    ConfigProvider,
    message,
    theme,
} from 'antd';
import {
    ArrowLeftOutlined,
    PlayCircleFilled,
    HeartOutlined,
    MoreOutlined,
} from '@ant-design/icons';
import { getTrendingSongs } from '../store/action/userAction';
import HoverPlayButton from '../components/HoverPlayButton';

const { Header, Content } = Layout;
const { Title, Text } = Typography;

export default function Album() {
    const [trendingSongs, setTrendingSongs] = useState([]);
    const [trendingLoading, setTrendingLoading] = useState(true);
    const { defaultAlgorithm, darkAlgorithm } = theme;

    const formatDuration = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    };
    const getTotalDuration = (songs) => {
        const totalSeconds = songs
            .slice(0, 10)
            .reduce((sum, song) => sum + (Number(song.duration) || 0), 0);

        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        const pad = (n) => String(n).padStart(2, '0');

        if (hours > 0) {
            return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
        } else {
            return `${pad(minutes)}:${pad(seconds)}`;
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-EN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    useEffect(() => {
        const fetchTrendingSongs = async () => {
            setTrendingLoading(true);
            try {
                const data = await getTrendingSongs();
                setTrendingSongs(data.data);
            } catch (err) {
                console.error('Error fetching trending songs:', err);
                message.error(
                    'Failed to load trending songs. Please try again later.'
                );
            } finally {
                setTrendingLoading(false);
            }
        };

        fetchTrendingSongs();
    }, []);

    return (
        <ConfigProvider
            theme={{
                algorithm: darkAlgorithm,
                token: {
                    colorPrimary: '#ff1f9c',
                    colorSuccess: '#33b1ff',
                    borderRadius: 16,
                },
            }}
        >
            <div className="min-h-screen bg-gradient-to-br from-[#1a1221] to-[#2D1F31]">
                <Content className="px-4 md:px-8 pb-20">
                    <div className="flex flex-col md:flex-row items-start gap-6 py-6">
                        <div className="relative w-[150px] h-[150px] md:w-[180px] md:h-[180px] overflow-hidden rounded-2xl shadow-xl group cursor-pointer">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#3d2a3a] to-[#4d3649] group-hover:from-[#4d3649] group-hover:to-[#5d465a] transition-all duration-300"></div>

                            <div className="absolute top-4 left-4 font-bold text-white text-shadow z-10">
                                TRENDING
                                <br />
                                MUSIC
                            </div>

                            <img
                                alt="trending music"
                                src="/trend.jpg"
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                            />

                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                <PlayCircleFilled className="text-white text-5xl opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-90 group-hover:scale-100" />
                            </div>
                        </div>

                        <div className="flex-1">
                            <h1 className="text-3xl md:text-4xl font-bold text-white m-0 drop-shadow-glow">
                                Trending songs{' '}
                                <span className="text-[#ff1f9c]">mix</span>
                            </h1>
                            <p className="text-white/90 mt-3 max-w-2xl">
                                Fresh, viral, and unmissable — these are the
                                tracks everyone's playing. Explore the sounds
                                defining today's music culture.
                            </p>
                            <div className="flex flex-wrap items-center gap-4 mt-6">
                                <span className="text-white/90">
                                    {trendingSongs.length} songs
                                </span>
                                <span className="text-white/90">
                                    {getTotalDuration(trendingSongs)}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 rounded-2xl overflow-hidden bg-gradient-to-br from-[#3d2a3a]/90 to-[#4d3649]/90 backdrop-blur-sm shadow-2xl border border-[#ff1f9c]/20">
                        <div className="grid grid-cols-12 px-4 py-3 border-b border-[#ff1f9c]/30 text-white/80 text-sm font-medium">
                            <div className="col-span-1">#</div>
                            <div className="col-span-4 ">Title</div>
                            <div className="col-span-3 hidden md:block ml-[50px]">
                                Release Date
                            </div>
                            <div className="col-span-2 hidden md:block ml-[35px]">
                                Genre
                            </div>
                            <div className="col-span-1 text-right md:text-left ml-[20px]">
                                Time
                            </div>
                        </div>

                        <List
                            loading={trendingLoading}
                            dataSource={trendingSongs}
                            renderItem={(item, index) => (
                                <List.Item
                                    key={item._id}
                                    className="border-b border-[#ff1f9c]/20 hover:bg-white/5 transition-colors duration-200 px-4 py-2"
                                    actions={[
                                        <HeartOutlined
                                            key="heart"
                                            className="text-white/70 hover:text-[#ff1f9c] transition-colors duration-200"
                                        />,
                                        <MoreOutlined
                                            key="more"
                                            className="text-white/70 hover:text-white transition-colors duration-200"
                                        />,
                                    ]}
                                >
                                    <div className="grid grid-cols-12 w-full items-center">
                                        <div className="col-span-1 flex items-center">
                                            <HoverPlayButton
                                                index={index + 1}
                                                audioUrl={item.audioUrl}
                                            />
                                        </div>
                                        <div className="col-span-5">
                                            <div className="flex items-center gap-3">
                                                <Avatar
                                                    shape="square"
                                                    size={40}
                                                    src={item.coverImage}
                                                    className="rounded-lg border border-[#ff1f9c]/30 shadow-sm"
                                                />
                                                <div>
                                                    <div className="font-medium text-white truncate max-w-[200px] md:max-w-none">
                                                        {item.title}
                                                    </div>
                                                    <div className="text-white/70 text-xs">
                                                        {item.artist.username}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-span-3 text-white/70 hidden md:block">
                                            {formatDate(item.releaseDate)}
                                        </div>
                                        <div className="col-span-2 text-white/70 hidden md:block">
                                            {item.genre}
                                        </div>
                                        <div className="col-span-1 text-white/70 text-right md:text-left">
                                            {formatDuration(item.duration)}
                                        </div>
                                    </div>
                                </List.Item>
                            )}
                        />
                    </div>
                    <div style={{ margin: '100px' }}></div>
                </Content>
            </div>
        </ConfigProvider>
    );
}
