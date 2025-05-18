import api from '../../config/axios';

export const getAllArtistRequest = () =>
    api.get('/api/artist-requests').then((res) => res.data.data);

export const changeArtistRequestStatus = (id, status) =>
    api.patch(`/api/artist-requests/${id}`, { status }).then((res) => res.data);
