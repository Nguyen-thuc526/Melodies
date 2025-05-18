import api from '../../config/axios';

export const createSongArtist = (formData) => {
    return api.post('/api/songs', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const getAllSongArtist = (
    page = 1,
    limit = 10,
    genre = '',
    search = '',
    sort = '-createdAt'
) => {
    return api
        .get('api/songs', {
            params: { page, limit, genre, search, sort },
        })
        .then((res) => res.data);
};

export const getSongByArtist = async () => {
    const response = await api.get('/api/songs/my-song');
    return response.data;
};

export const createPlaylist = async (name) => {
    const response = await api.post('/api/playlists', name);
    return response.data;
};

export const fetchArtistInfomation = async (id) => {
    const response = await api.get(`/api/user/artists/${id}`);
    return response.data;
};

export const getAllAlbum = async ({
    page = 1,
    limit = 12,
    genre,
    search,
    sort = '-createdAt',
} = {}) => {
    const params = new URLSearchParams();

    if (page) params.append('page', page);
    if (limit) params.append('limit', limit);
    if (genre) params.append('genre', genre);
    if (search) params.append('search', search);
    if (sort) params.append('sort', sort);

    const response = await api.get(`/api/albums?${params.toString()}`);
    return response.data;
};

export const createAlbum = async (formData) => {
    const response = await api.post('/api/albums', formData);
    return response.data;
};

export const getAlbumDetail = async (id) => {
    const response = await api.get(`/api/albums/${id}`);
    return response.data.data;
};

export const addSongToAlbum = async (id, songId) => {
    const response = await api.post(`/api/albums/${id}/songs`, {
        songId: songId,
    });
    return response.data;
};


export const searchEngine = async (title, artist, genre, page = 1, limit = 10) => {
    const params = {};

    if (title) params.title = title;
    if (artist) params.artist = artist;
    if (genre) params.genre = genre;
    params.page = page;
    params.limit = limit;

    const response = await api.get('/api/songs/search', { params });
    return response.data;
};