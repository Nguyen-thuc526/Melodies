import api from '../../config/axios';
import { setUserProfile, setUserProfileError } from '../slice/userProfileSlice';
export const updateUserProfile = async (formValues) => {
    try {
        const res = await api.put('/api/user/me/detail', {
            userId: formValues.userId,
            fullName: formValues.fullName,
            dateOfBirth: formValues.dateOfBirth,
            bio: formValues.bio,
            location: formValues.location,
            profileImage: formValues.profileImage,
        });
        const { success, user } = res.data;
        if (success) {
            setUserProfile(user);
        }
        return user;
    } catch (err) {
        console.error('Update profile error:', err);
        throw err.response?.data || { message: 'Unknown error occurred' };
    }
};

export const fetchCurrentUserProfile = async () => {
    try {
        const res = await api.get('/api/user/me/detail');
        const { success, data } = res.data;
        if (success) {
            setUserProfile(data);
        }
        return data;
    } catch (err) {
        setUserProfileError(
            err.response?.data?.message || 'Failed to fetch profile data'
        );
    }
};

export const getSongDetail = async (id) => {
    const response = await api.get(`api/songs/${id}`);
    return response;
};
export const getSongGenres = async () => {
    const response = await api.get(`api/songs/genres`);
    return response.data;
};

export const getTrendingSongs = async () => {
    const response = await api.get('api/songs/trending');
    return response.data;
};

export const likeSongs = async (id) => {
    const response = await api.post(`api/songs/${id}/like`);
    return response.data;
};

export const commentSongs = async (id, data) => {
    const response = await api.post(`api/songs/${id}/comments`, { text: data });
    return response.data;
};

export const getPlaylist = async () => {
    const response = await api.get(`/api/playlists/mine`);
    return response.data;
};

export const addSongFromPlaylist = async (id, songId) => {
    const response = await api.post(`/api/playlists/${id}/add-song`, {
        songId: songId,
    });
    return response.data;
};

export const deleteSongFromPlaylist = async (id, songId) => {
    const response = await api.post(`/api/playlists/${id}/remove-song`, {
        songId: songId,
    });
    return response.data;
};

export const deletePlaylist = async (id) => {
    const response = await api.delete(`/api/playlists/${id}`);
    return response.data;
};

export const getAllArtist = async () => {
    const response = await api.get(`/api/user/artists`);
    return response.data;
};
