import React from 'react';
import { Slider, Space, Button, Typography } from 'antd';
import {
    PlayCircleOutlined,
    PauseCircleOutlined,
    StepBackwardOutlined,
    StepForwardOutlined,
    HeartOutlined,
} from '@ant-design/icons';
import { useAudioPlayer } from '../contexts/AudioPlayerContext';

const { Text } = Typography;

const MusicPlayerBar = () => {
    const { currentSong, isPlaying, playSong, pauseSong, audioRef } =
        useAudioPlayer();
    const [currentTime, setCurrentTime] = React.useState(0);
    const [duration, setDuration] = React.useState(0);

    React.useEffect(() => {
        if (currentSong) {
            const audio = audioRef.current;

            const handleLoadedMetadata = () => {
                setDuration(audio.duration);
            };

            const handleTimeUpdate = () => {
                setCurrentTime(audio.currentTime);
            };

            audio.addEventListener('loadedmetadata', handleLoadedMetadata);
            audio.addEventListener('timeupdate', handleTimeUpdate);

            return () => {
                audio.removeEventListener(
                    'loadedmetadata',
                    handleLoadedMetadata
                );
                audio.removeEventListener('timeupdate', handleTimeUpdate);
            };
        }
    }, [currentSong, audioRef]);

    const handlePlayPause = () => {
        if (isPlaying) {
            pauseSong();
        } else {
            playSong(currentSong);
        }
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    if (!currentSong) return null;

    return (
        <div className="w-full h-20 bg-[#3d2a3a] flex items-center justify-between px-5 border-t border-[#ff1f9c]">
            {/* Song Info */}
            <div className="flex items-center w-[30%]">
                <img
                    src={currentSong.cover}
                    alt={currentSong.title}
                    className="w-12 h-12 rounded mr-3"
                />
                <div>
                    <Text className="text-white block">
                        {currentSong.title}
                    </Text>
                    <Text className="text-white/70">{currentSong.artist}</Text>
                </div>
            </div>
            {/* Player Controls */}
            <div className="w-[40%] text-center">
                <Space>
                    <Button
                        type="text"
                        icon={<StepBackwardOutlined />}
                        className="text-white"
                    />
                    <Button
                        type="text"
                        icon={
                            isPlaying ? (
                                <PauseCircleOutlined />
                            ) : (
                                <PlayCircleOutlined />
                            )
                        }
                        className="text-white text-2xl"
                        onClick={handlePlayPause}
                    />
                    <Button
                        type="text"
                        icon={<StepForwardOutlined />}
                        className="text-white"
                    />
                </Space>
                <div className="mt-2">
                    <Slider
                        value={currentTime}
                        max={duration}
                        onChange={(value) => {
                            setCurrentTime(value);
                            audioRef.current.currentTime = value;
                        }}
                        className="w-full"
                    />
                    <div className="flex justify-between text-white">
                        <Text>{formatTime(currentTime)}</Text>
                        <Text>{formatTime(duration)}</Text>
                    </div>
                </div>
            </div>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi
            quaerat esse cupiditate exercitationem labore architecto, at debitis
            accusamus tenetur est distinctio in ab fugit eaque consequuntur,
            voluptatibus, inventore quod iste?
            {/* Right Controls */}
            <div className="w-[30%] text-right">
                <Button
                    type="text"
                    icon={<HeartOutlined />}
                    className="text-white"
                />
            </div>
        </div>
    );
};

export default MusicPlayerBar;
