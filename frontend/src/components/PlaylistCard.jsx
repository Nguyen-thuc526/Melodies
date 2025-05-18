import React, { useState } from 'react';
import { Card, Typography, Dropdown } from 'antd';
import {
    CustomerServiceOutlined,
    PlayCircleFilled,
    MoreOutlined,
} from '@ant-design/icons';
import { formatDistanceToNow } from 'date-fns';
import {
    deletePlaylist,
    deleteSongFromPlaylist,
} from '../store/action/userAction';

const { Title, Text } = Typography;

const textEllipsis = {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
};

export default function PlaylistCard({ playlist, onPlay, onDelete }) {
    const [isHovered, setIsHovered] = useState(false);

    const getGradient = (name) => {
        const hash = name.split('').reduce((acc, char) => {
            return char.charCodeAt(0) + ((acc << 5) - acc);
        }, 0);

        const hue1 = Math.abs(hash % 360);
        const hue2 = (hue1 + 40) % 360;

        return `linear-gradient(135deg, hsl(${hue1}, 70%, 50%), hsl(${hue2}, 70%, 30%))`;
    };

    const formattedDate = formatDistanceToNow(new Date(playlist.updatedAt), {
        addSuffix: true,
    });
    const handleDelete = async (id) => {
        const response = await deletePlaylist(id);
        console.log(response);

        if (onDelete) {
            onDelete(id);
        }
    };
    const items = [
        {
            key: '1',
            label: 'Rename',
        },
        {
            key: '2',
            label: <span className="text-red-400">Delete</span>,
            onClick: () => handleDelete(playlist._id),
        },
    ];

    return (
        <Card
            className="overflow-hidden border-0 bg-[#2c1e34] hover:shadow-lg transition-all duration-300"
            styles={{
                body: {
                    padding: 0,
                },
            }}
        >
            <div
                className="relative"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div
                    className="h-40 w-full"
                    style={{
                        background: getGradient(playlist.name),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    {!isHovered && (
                        <div className="flex flex-col items-center justify-center text-white">
                            <CustomerServiceOutlined className="text-4xl mb-2 opacity-80" />
                            <span className="text-lg font-bold">
                                {playlist.name.charAt(0).toUpperCase()}
                            </span>
                        </div>
                    )}
                </div>

                <div
                    className="absolute inset-0 bg-black/20 flex items-center justify-center transition-opacity duration-300"
                    style={{ opacity: isHovered ? 1 : 0 }}
                >
                    <PlayCircleFilled
                        className="text-6xl text-emerald-500 cursor-pointer hover:scale-105 transition-transform"
                        onClick={() => onPlay?.(playlist)}
                    />
                </div>
            </div>

            <div className="p-4">
                <div className="flex items-start justify-between">
                    <div>
                        <div
                            style={{
                                ...textEllipsis,
                                color: 'white',
                                fontWeight: 'bold',
                                fontSize: 18,
                                marginBottom: 4,
                                cursor: 'pointer',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.textDecoration =
                                    'underline';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.textDecoration = 'none';
                            }}
                            onClick={() => onPlay?.(playlist)}
                        >
                            {playlist.name}
                        </div>
                        <Title
                            level={5}
                            className="!text-white !m-0 truncate"
                        ></Title>
                        <Text className="text-sm text-gray-400">
                            {playlist.songs.length}{' '}
                            {playlist.songs.length === 1 ? 'song' : 'songs'}
                        </Text>
                    </div>
                    <Dropdown
                        menu={{ items }}
                        placement="bottomRight"
                        trigger={['click']}
                        overlayClassName="bg-[#2c1e34]"
                    >
                        <MoreOutlined className="text-gray-400 text-xl cursor-pointer hover:bg-white/10 rounded-full p-1" />
                    </Dropdown>
                </div>
            </div>

            <div className="px-4 pb-4 text-xs text-gray-500">
                Updated {formattedDate}
            </div>
        </Card>
    );
}
