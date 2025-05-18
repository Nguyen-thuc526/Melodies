import React from 'react';
import { Button } from 'antd';
import { PlayCircleOutlined, PauseCircleOutlined } from '@ant-design/icons';
import { useAudioPlayer } from '../contexts/AudioPlayerContext';

const PlayButton = ({ song }) => {
    const { currentSong, isPlaying, playSong } = useAudioPlayer();
    const isCurrentSong = currentSong?.id === song.id;

    return (
        <Button
            type="primary"
            icon={
                isCurrentSong && isPlaying ? (
                    <PauseCircleOutlined />
                ) : (
                    <PlayCircleOutlined />
                )
            }
            onClick={() => playSong(song)}
            style={{
                background: '#ff1f9c',
                border: 'none',
                borderRadius: '20px',
            }}
        >
            {isCurrentSong && isPlaying ? 'Pause' : 'Play'}
        </Button>
    );
};

export default PlayButton;
