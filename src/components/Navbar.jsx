'use client';

import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Avatar,
    Button,
    Dropdown,
    Input,
    Popconfirm,
    Space,
    Spin,
    Typography,
    Badge,
    List,
    Modal,
} from 'antd';
import {
    ExclamationCircleOutlined,
    LogoutOutlined,
    SearchOutlined,
    UserAddOutlined,
    UserOutlined,
    BellOutlined,
    HomeOutlined,
    HeartOutlined,
    CloseOutlined,
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slice/authSlice';
import '../assets/css/navbar.css';
import SearchComponent from './SearchComponent';
import { searchEngine } from '../store/action/artistAction';

const { Text } = Typography;

const Navbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, status, error } = useSelector((state) => state.auth);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [searchResults, setSearchResults] = useState(null);
    const [searchMessage, setSearchMessage] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);

    useEffect(() => {
        if (searchResults) {
            setIsModalVisible(true);
        } else {
            setIsModalVisible(false);
        }
    }, [searchResults]);

    // Close modal handler
    const handleCloseModal = () => {
        setIsModalVisible(false);
        setSearchResults(null);
    };


    useEffect(() => {
        if (user) setIsLoggedIn(true);
        else setIsLoggedIn(false);

        const handleScroll = () => {
            const offset = window.scrollY;
            if (offset > 10) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [user]);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const handleProfileClick = () => {
        navigate('/profile');
    };

    const handleSearch = async ({ title, artist, genre }) => {
        try {
            const response = await searchEngine(title, artist, genre);
            if (response.success) {
                setSearchResults(response.data.songs);
                setSearchMessage(response.message);
            } else {
                setSearchResults(null);
                setSearchMessage('No results found');
            }
            console.log('Search results:', response);
        } catch (error) {
            setSearchResults(null);
            setSearchMessage('Search failed. Please try again.');
            console.error('Search failed:', error);
        }
    };
    const dropdownItems = [
        {
            key: 'profile',
            icon: <UserOutlined style={{ color: '#e835c2' }} />,
            label: 'Profile',
            onClick: handleProfileClick,
        },
        ...(user?.role === 'artist'
            ? [
                {
                    key: 'artist-profile',
                    icon: <UserOutlined style={{ color: '#e835c2' }} />,
                    label: 'Artist Profile',
                    onClick: () => navigate(`/artist-profile/${user?._id}`),
                },
                {
                    key: 'albums-songs',
                    icon: <HeartOutlined style={{ color: '#e835c2' }} />,
                    label: 'Albums & Songs',
                    onClick: () => navigate('/artist-dashboard'),
                },
                { type: 'divider' },
            ]
            : []),
        {
            key: 'logout',
            icon: <LogoutOutlined style={{ color: '#e835c2' }} />,
            label: 'Logout',
            onClick: handleLogout,
        },
    ];

    const navLinks = [
        {
            key: 'home',
            icon: <HomeOutlined />,
            label: 'Home',
            onClick: () => navigate('/'),
        },
        {
            key: 'playlist',
            icon: <HeartOutlined />,
            label: 'Playlist',
            onClick: () => navigate('/playlist'),
        },
    ];

    if (status === 'loading') {
        return (
            <div className="flex justify-center items-center h-full">
                <Spin size="large" />
            </div>
        );
    }

    if (error) {
        return <p className="text-red-500 text-center mt-4">Error: {error}</p>;
    }

    return (
        <nav
            className={`w-full transition-all duration-300 ${scrolled ? 'shadow-lg py-2' : 'py-4'
                }`}
            style={{
                background: 'linear-gradient(to right, #231829, #5B4959)',
                zIndex: 10,
            }}
        >
            <div className="container mx-auto px-4 flex justify-between items-center">
                <div className="flex items-center">
                    {isLoggedIn && (
                        <div className="hidden md:flex space-x-6">
                            {navLinks.map((link) => (
                                <Button
                                    key={link.key}
                                    type="text"
                                    icon={link.icon}
                                    onClick={link.onClick}
                                    className="text-white hover:text-pink-300 transition-colors"
                                >
                                    {link.label}
                                </Button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex items-center space-x-4">
                    <SearchComponent onSearch={handleSearch} />

                    <Space size="large">
                        {!isLoggedIn ? (
                            <div className="flex space-x-2">
                                <Link to="/login">
                                    <Button
                                        type="default"
                                        className="rounded-full px-6 border-pink-400 text-white hover:text-white hover:border-pink-300 hover:shadow-lg transition-all"
                                        style={{
                                            background:
                                                'rgba(232, 53, 194, 0.2)',
                                            backdropFilter: 'blur(4px)',
                                            border: '1px solid rgba(232, 53, 194, 0.5)',
                                        }}
                                    >
                                        Login
                                    </Button>
                                </Link>
                                <Link to="/register">
                                    <Button
                                        type="primary"
                                        className="rounded-full px-6 hover:shadow-lg transition-all"
                                        style={{
                                            background:
                                                'linear-gradient(45deg, #e835c2, #6e44ff)',
                                            border: 'none',
                                            boxShadow:
                                                '0 0 10px rgba(232, 53, 194, 0.5)',
                                        }}
                                    >
                                        Register
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                {user?.role !== 'artist' ? (
                                    <Popconfirm
                                        title="Are you sure you want to request an artist?"
                                        icon={
                                            <ExclamationCircleOutlined
                                                style={{ color: '#faad14' }}
                                            />
                                        }
                                        onConfirm={() =>
                                            navigate('/artist-registration')
                                        }
                                        okText="Yes"
                                        cancelText="No"
                                    >
                                        <Button
                                            type="primary"
                                            className="rounded-full px-4 hover:shadow-lg transition-all"
                                            style={{
                                                background:
                                                    'linear-gradient(45deg, #e835c2, #6e44ff)',
                                                border: 'none',
                                                boxShadow:
                                                    '0 0 10px rgba(232, 53, 194, 0.5)',
                                            }}
                                            icon={<UserAddOutlined />}
                                        >
                                            Become an Artist
                                        </Button>
                                    </Popconfirm>
                                ) : (
                                    <Button
                                        type="primary"
                                        onClick={() =>
                                            navigate('/artist-dashboard')
                                        }
                                        className="rounded-full px-4 hover:shadow-lg transition-all"
                                        style={{
                                            background:
                                                'linear-gradient(45deg, #6e44ff, #b892ff)',
                                            border: 'none',
                                            boxShadow:
                                                '0 0 10px rgba(110, 68, 255, 0.5)',
                                        }}
                                        icon={<UserOutlined />}
                                    >
                                        Artist Dashboard
                                    </Button>
                                )}

                                <Dropdown
                                    menu={{ items: dropdownItems }}
                                    trigger={['hover']}
                                    placement="bottomRight"
                                    className="dropdown-menu"
                                    overlayStyle={{
                                        minWidth: '150px',
                                        background: '#231829',
                                        borderRadius: '12px',
                                        boxShadow:
                                            '0 6px 16px rgba(0, 0, 0, 0.5)',
                                        border: '1px solid rgba(232, 53, 194, 0.3)',
                                    }}
                                >
                                    <div className="flex items-center cursor-pointer">
                                        <Avatar
                                            src={user?.profileImage || null}
                                            icon={
                                                !user?.profileImage && (
                                                    <UserOutlined />
                                                )
                                            }
                                            style={{
                                                backgroundColor:
                                                    !user?.profileImage
                                                        ? '#e835c2'
                                                        : undefined,
                                                border: '2px solid rgba(255, 255, 255, 0.6)',
                                            }}
                                            size={40}
                                        />
                                        <div className="ml-2 hidden md:block">
                                            <Text
                                                style={{
                                                    color: 'white',
                                                    fontWeight: 'bold',
                                                }}
                                            >
                                                {user?.username}
                                            </Text>
                                            <div className="flex items-center">
                                                <div
                                                    className="w-2 h-2 rounded-full mr-1"
                                                    style={{
                                                        backgroundColor:
                                                            '#4CAF50',
                                                    }}
                                                />
                                                <Text
                                                    style={{
                                                        color: 'rgba(255, 255, 255, 0.7)',
                                                        fontSize: '12px',
                                                    }}
                                                >
                                                    Online
                                                </Text>
                                            </div>
                                        </div>
                                    </div>
                                </Dropdown>
                            </div>
                        )}
                    </Space>
                </div>
            </div>
            <Modal
                open={isModalVisible}
                onCancel={handleCloseModal}
                footer={null}
                width={600}

                style={{ top: 50 }}
                styles={{
                    body: {
                        backgroundColor: '#231829',
                        color: 'white',
                        maxHeight: '70vh',
                        overflowY: 'auto',
                        borderRadius: '12px',
                    },
                    mask: {
                        backgroundColor: 'rgba(0, 0, 0, 0.85)'
                    }
                }}
                closeIcon={<CloseOutlined style={{ color: 'white' }} />}
            >
                <h2 style={{ color: '#e835c2', marginBottom: 16 }}>Search Results</h2>

                {searchResults && searchResults.length > 0 ? (
                    <List
                        dataSource={searchResults}
                        renderItem={(item) => (
                            <List.Item
                                key={item._id}
                                style={{
                                    backgroundColor: '#35294d',
                                    marginBottom: 8,
                                    borderRadius: 8,
                                    cursor: 'pointer',
                                    padding: 10
                                }}
                                onClick={() => {
                                    navigate(`/song-detail//${item._id}`);
                                    handleCloseModal();
                                }}
                            >
                                <List.Item.Meta
                                    title={
                                        <span style={{ color: '#fff' }}>{item.title}</span>
                                    }
                                    description={
                                        <span style={{ color: '#bbb' }}>
                                            {item.artist.username}
                                        </span>
                                    }
                                />
                            </List.Item>
                        )}
                    />
                ) : (
                    <p style={{ color: '#bbb' }}>{searchMessage || 'No results found.'}</p>
                )}
            </Modal>
        </nav>
    );
};

export default Navbar;
