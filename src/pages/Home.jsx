import React, { useState, useEffect, useRef } from 'react';
import {
    Card,
    Row,
    Col,
    Typography,
    Layout,
    Carousel,
    Spin,
    Button,
    message,
    Collapse,
    Table,
    Avatar,
} from 'antd';
import { useNavigate } from 'react-router-dom';
import { getAllAlbum, getAllSongArtist } from '../store/action/artistAction';
import {
    getAllArtist,
    getSongGenres,
    getTrendingSongs,
} from '../store/action/userAction';
import {
    PlayCircleFilled,
    PlayCircleOutlined,
    RightOutlined,
    UserOutlined,
} from '@ant-design/icons';
import Meta from 'antd/es/card/Meta';
const { Panel } = Collapse;

const { Content } = Layout;
const { Title, Text } = Typography;
const imageStyle = {
    borderRadius: 4,
    height: 200,
    objectFit: 'cover',
};
const styles = {
    layout: {
        background: 'linear-gradient(135deg, #1a1221 0%, #2D1F31 100%)', // Background gradient from Login
        minHeight: '100vh',
    },
    header: {
        background: 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 24px',
        height: 'auto',
    },
    searchInput: {
        width: 250,
        borderRadius: 24, // Match Login's rounded corners
        background: 'rgba(91, 73, 89, 0.7)', // Input background from Login
        border: '1px solid rgba(255, 31, 156, 0.3)', // Border from Login
        color: '#FFFFFF',
    },
    content: {
        padding: '0 50px',
        marginTop: 20,
    },
    sectionTitle: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        color: '#FFFFFF', // White text from Login
        margin: 0,
        textShadow: '0 0 10px rgba(255, 31, 156, 0.5)', // Glow effect from Login
    },
    highlight: {
        color: '#ff1f9c', // Primary pink from Login
    },
    viewAllBtn: {
        color: 'rgba(255, 255, 255, 0.9)', // Muted white from Login
        display: 'flex',
        alignItems: 'center',
        fontWeight: 500,
    },
    genreCard: {
        width: '100%',
        height: 180,
        borderRadius: 24, // Match Login's rounded corners
        overflow: 'hidden',
        position: 'relative',
        border: 'none',
        background: 'linear-gradient(135deg, #3d2a3a 0%, #4d3649 100%)', // Card gradient from Login
        boxShadow:
            '0 10px 30px rgba(0,0,0,0.4), 0 0 20px rgba(255, 31, 156, 0.15)', // Shadow from Login
    },
    cardCover: {
        height: '100%',
        width: '100%',
        objectFit: 'cover',
    },
    cardOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        background:
            'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)',
        padding: '30px 16px 16px',
        color: '#FFFFFF',
    },
    playlistMeta: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    count: {
        color: '#ff4db2', // Secondary pink from Login
        fontSize: 12,
    },
    artistCard: {
        textAlign: 'center',
        background: 'transparent',
        border: 'none',
    },
    artistAvatar: {
        width: '100%',
        height: 'auto',
        marginBottom: 8,
        borderRadius: '50%', // Circular avatar like Login
        border: '2px solid rgba(255, 31, 156, 0.3)', // Border from Login
    },
    artistName: {
        color: '#FFFFFF', // White text from Login
        fontSize: 14,
    },
    footer: {
        background: 'rgba(0, 0, 0, 0.3)',
        color: '#FFFFFF',
        textAlign: 'center',
        padding: '24px 50px',
        marginTop: 60,
    },
};
const textEllipsis = {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
};
const Home = () => {
    const navigate = useNavigate();
    const songsRef = useRef(null); // Reference to scroll into view

    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 6,
        total: 0,
    });
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [genres, setGenres] = useState([]);
    const [genresLoading, setGenresLoading] = useState(true);

    const [albums, setAlbums] = useState([]);

    const [albumPage, setAlbumPage] = useState(1);
    const [albumTotal, setAlbumTotal] = useState(0);
    const [artists, setArtists] = useState(null);

    const [hoveredAlbum, setHoveredAlbum] = useState(null);

    const limit = 6;

    console.log((artists))

    useEffect(() => {
        const fetchAlbums = async () => {
            setLoading(true);
            try {
                const data = await getAllAlbum({ page: albumPage, limit });
                console.log(data.data);
                setAlbums((prevAlbums) =>
                    albumPage === 1
                        ? data.data || []
                        : [...prevAlbums, ...data.data]
                );
                setAlbumTotal(data.total || 0);
            } catch (err) {
                console.error('Failed to fetch albums:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchAlbums();
    }, [albumPage]);

    useEffect(() => {
        const fetchArtists = async () => {
            try {
                const response = await getAllArtist();
                setArtists(response.data);
            } catch (error) {
                console.error('Failed to fetch artists:', error);
            }
        };

        fetchArtists();
    }, []);

    const handleExploreClick = () => {
        songsRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleShowDetail = (id) => {
        navigate(`/song-detail/${id}`);
    };

    useEffect(() => {
        const { current, pageSize } = pagination;
        setLoading(true);

        getAllSongArtist(current, pageSize)
            .then((data) => {
                setSongs((prevSongs) =>
                    current === 1 ? data.data : [...prevSongs, ...data.data]
                );
                setPagination((prev) => ({
                    ...prev,
                    total: data.pagination.total,
                }));
            })
            .catch((err) => {
                console.error('Error fetching songs:', err);
                message.error('Failed to load songs. Please try again later.');
            })
            .finally(() => setLoading(false));
    }, [pagination.current, pagination.pageSize]);

    // Fetch genres
    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const response = await getSongGenres();
                setGenres(response?.data);
                setGenresLoading(false);
            } catch (error) {
                console.error('Error fetching song genres:', error);
                message.error('Failed to load genres. Please try again later.');
                setGenresLoading(false);
            }
        };

        fetchGenres();
    }, []);

    return (
        <Layout style={{ minHeight: '100vh', background: '#1a1221' }}>
            <Layout style={{ background: '#231829' }}>
                <Content style={{ padding: 24 }}>
                    <div className="relative h-[70vh] w-full rounded-2xl overflow-hidden shadow-xl">
                        <img
                            src="/carousel.jpg"
                            alt="Hero"
                            className="w-full h-full object-cover"
                        />

                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center p-8">
                            <div className="text-white text-center max-w-2xl">
                                <h2 className="text-4xl sm:text-5xl font-bold mb-4">
                                    Stream Music That Moves You
                                </h2>
                                <p className="text-pink-200 text-xl">
                                    Discover new artists, albums, and live
                                    experiences
                                </p>
                                <button
                                    onClick={handleExploreClick}
                                    className="mt-6 px-6 py-3 bg-pink-600 text-white rounded-full hover:bg-pink-700 transition duration-300"
                                >
                                    Explore Now
                                </button>
                            </div>
                        </div>
                    </div>

                    <Title
                        ref={songsRef}
                        level={2}
                        style={{ color: 'white', marginTop: 24 }}
                    >
                        Songs
                    </Title>

                    {loading ? (
                        <Spin
                            size="large"
                            style={{ display: 'block', margin: 'auto' }}
                        />
                    ) : (
                        <Row gutter={[16, 16]}>
                            {songs.map((song) => (
                                <Col xs={24} sm={12} md={8} key={song._id}>
                                    <Card
                                        hoverable
                                        cover={
                                            song.coverImage ? (
                                                <img
                                                    alt="cover"
                                                    src={song.coverImage}
                                                    style={imageStyle}
                                                />
                                            ) : (
                                                <div
                                                    style={{
                                                        height: 200,
                                                        backgroundColor:
                                                            '#f0f0f0',
                                                        borderRadius: 8,
                                                        textAlign: 'center',
                                                        lineHeight: '200px',
                                                    }}
                                                >
                                                    No Cover Image
                                                </div>
                                            )
                                        }
                                        style={{
                                            borderRadius: 4,
                                            padding: 8,
                                            backgroundColor: 'transparent',
                                            color: '#b3b3b3',
                                        }}
                                        styles={{ body: { padding: 3 } }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.backgroundColor =
                                                '#523749';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.backgroundColor =
                                                'transparent';
                                        }}
                                        variant="borderless"
                                    >
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
                                                e.currentTarget.style.textDecoration =
                                                    'none';
                                            }}
                                            onClick={() =>
                                                handleShowDetail(song?._id)
                                            }
                                        >
                                            {song.title}
                                        </div>

                                        <div
                                            style={{
                                                ...textEllipsis,
                                                color: '#B3B3B3',
                                                fontSize: 14,
                                                marginBottom: 8,
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.textDecoration =
                                                    'underline';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.textDecoration =
                                                    'none';
                                            }}
                                            onClick={() =>
                                                navigate(
                                                    `/artist-profile/${song?.artist?._id}`
                                                )
                                            }
                                        >
                                            {song.artist.username}
                                        </div>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    )}
                    {pagination.current * pagination.pageSize <
                        pagination.total && (
                            <div className="text-center mt-4">
                                <Button
                                    onClick={() =>
                                        setPagination((prev) => ({
                                            ...prev,
                                            current: prev.current + 1,
                                        }))
                                    }
                                    type="primary"
                                    className="bg-[#523749] hover:bg-[#6a4b60] border-none font-semibold rounded-md px-6 py-2 transition-all duration-200 shadow-md"
                                >
                                    View More
                                </Button>
                            </div>
                        )}

                    <div style={{ marginBottom: 40, marginTop: '40px' }}>
                        <div style={styles.sectionTitle}>
                            <Title level={3} style={styles.title}>
                                Popular{' '}
                                <span style={styles.highlight}>Artists</span>
                            </Title>
                            <Button type="text" style={styles.viewAllBtn}>
                                View All <RightOutlined />
                            </Button>
                        </div>

                        <Row
                            gutter={[24, 24]}
                            justify="left"   
                            align="left"       // Vertically centers the items inside the row
                        >
                            {artists?.map((artist) => (
                                <Col
                                    xs={12} sm={8} md={6} lg={4} xl={3} // Adjust columns for better responsive centering
                                    key={artist._id}
                                    style={{ display: 'flex', justifyContent: 'center' }} // centers each card inside the column
                                >
                                    <div className="transform transition-transform duration-300 hover:scale-105 hover:shadow-lg rounded-md cursor-pointer">
                                        <Card
                                            style={styles.artistCard}
                                            bodyStyle={{
                                                color: 'white',
                                                padding: '8px 0',
                                                textAlign: 'center',  // center text inside Card Meta
                                            }}
                                        >
                                            <img
                                                src={artist.profileImage}
                                                alt={artist.stageName}
                                                className="w-[100px] h-[100px] rounded-full object-cover border border-blue-500 mx-auto"
                                            />
                                            <Meta
                                                title={
                                                    <Text
                                                        onClick={() =>
                                                            navigate(`/artist-profile/${artist._id}`)
                                                        }
                                                        style={styles.artistName}
                                                    >
                                                        {artist.stageName || artist.username}
                                                    </Text>
                                                }
                                                style={{ marginTop: 8, textAlign: 'center' }}
                                            />
                                        </Card>
                                    </div>
                                </Col>
                            ))}
                        </Row>

                    </div>
                    <div style={{ marginBottom: 40, marginTop: '40px' }}>
                        <div style={styles.sectionTitle}>
                            <Title level={3} style={styles.title}>
                                Featured{' '}
                                <span style={styles.highlight}>Albums</span>
                            </Title>
                        </div>

                        {loading && albumPage === 1 ? (
                            <Spin
                                size="large"
                                style={{ display: 'block', margin: 'auto' }}
                            />
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                                {albums.map((album, index) => (
                                    <div
                                        key={album?._id || index}
                                        className="group relative cursor-pointer"
                                        onMouseEnter={() =>
                                            setHoveredAlbum(album?._id)
                                        }
                                        onMouseLeave={() =>
                                            setHoveredAlbum(null)
                                        }
                                    >
                                        <Card
                                            variant="borderless"
                                            className="bg-[#2a1e31] hover:bg-[#3a2a43] transition-all duration-300 shadow-none"
                                            styles={{ body: { padding: 0 } }}
                                            onClick={() =>
                                                navigate(
                                                    `/artist-album/${album?._id}`
                                                )
                                            }
                                        >
                                            <div className="p-3">
                                                <div className="relative aspect-square mb-3 bg-[#1a1a1a] rounded-md overflow-hidden">
                                                    {album?.coverImage ? (
                                                        <img
                                                            src={
                                                                album.coverImage ||
                                                                '/placeholder.svg'
                                                            }
                                                            alt={`${album?.title || 'Album'} cover`}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <span className="text-gray-500">
                                                                No cover
                                                            </span>
                                                        </div>
                                                    )}
                                                    {hoveredAlbum ===
                                                        album?._id && (
                                                            <div className="absolute bottom-2 right-2 transform transition-transform duration-300 translate-y-0 opacity-100">
                                                                <PlayCircleFilled className="text-[#ff1694] text-4xl hover:text-[#ff4db2] cursor-pointer shadow-lg" />
                                                            </div>
                                                        )}
                                                </div>
                                                <div className="px-1">
                                                    <div className="px-1">
                                                        <h3 className="font-semibold text-white truncate group-hover:text-[#ff1493] transition-colors">
                                                            {album?.title ||
                                                                'Untitled'}
                                                        </h3>
                                                        <p className="text-gray-400 text-sm truncate">
                                                            {album?.artist
                                                                ?.username ||
                                                                'Unknown Artist'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    </div>
                                ))}
                            </div>
                        )}

                        {albumPage * limit < albumTotal && (
                            <div className="text-center mt-4">
                                <Button
                                    onClick={() =>
                                        setAlbumPage((prev) => prev + 1)
                                    }
                                    type="primary"
                                    className="bg-[#523749] hover:bg-[#6a4b60] border-none font-semibold rounded-md px-6 py-2 transition-all duration-200 shadow-md"
                                >
                                    View More Albums
                                </Button>
                            </div>
                        )}
                    </div>
                    <div style={{ margin: '200px' }}></div>
                </Content>
            </Layout>
        </Layout>
    );
};

export default Home;
