import { useState, useRef } from 'react';
import { PlayCircleOutlined, PauseCircleOutlined } from '@ant-design/icons';

export default function HoverPlayButton({ index, audioUrl }) {
    const [isHovered, setIsHovered] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(new Audio(audioUrl));

    const handlePlay = () => {
        if (!isPlaying) {
            audioRef.current.play();
        } else {
            audioRef.current.pause();
        }
        setIsPlaying(!isPlaying);
    };

    return (
        <div
            className="flex items-center justify-center w-8 h-8 relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {isHovered || isPlaying ? (
                <button
                    onClick={handlePlay}
                    className="text-xl text-white/90 hover:text-[#ff1f9c] transition-colors duration-200 flex items-center justify-center"
                >
                    {isPlaying ? (
                        <PauseCircleOutlined />
                    ) : (
                        <PlayCircleOutlined />
                    )}
                </button>
            ) : (
                <span className="text-white/70">{index}</span>
            )}
        </div>
    );
}
