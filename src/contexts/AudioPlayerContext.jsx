import React, { createContext, useState, useRef, useContext } from 'react';

const AudioPlayerContext = createContext();

export const AudioPlayerProvider = ({ children }) => {
    const [currentSong, setCurrentSong] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(new Audio());

    const playSong = (song) => {
        console.log('Playing song:', song);
        if (currentSong?.id === song.id) {
            // If clicking the same song, toggle play/pause
            if (isPlaying) {
                audioRef.current.pause();
                setIsPlaying(false);
            } else {
                audioRef.current.play();
                setIsPlaying(true);
            }
        } else {
            // If clicking a different song, play the new song
            setCurrentSong(song);
            audioRef.current.src = song.filePath;
            audioRef.current.play();
            setIsPlaying(true);
        }
    };

    const pauseSong = () => {
        console.log('Pausing song');
        audioRef.current.pause();
        setIsPlaying(false);
    };

    const value = {
        currentSong,
        isPlaying,
        playSong,
        pauseSong,
        audioRef,
    };

    return (
        <AudioPlayerContext.Provider value={value}>
            {children}
        </AudioPlayerContext.Provider>
    );
};

export const useAudioPlayer = () => {
    const context = useContext(AudioPlayerContext);
    if (!context) {
        throw new Error(
            'useAudioPlayer must be used within an AudioPlayerProvider'
        );
    }
    return context;
};
