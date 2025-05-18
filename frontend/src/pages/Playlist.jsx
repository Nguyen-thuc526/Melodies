'use client';

import { useEffect, useState } from 'react';
import { Spin, Button, Modal, Input, Form, message } from 'antd';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import { getPlaylist } from '../store/action/userAction';

import PlaylistGrid from '../components/PlaylistGrid';
import { useNavigate } from 'react-router-dom';
import '../assets/css/Playlist.css';
import { createPlaylist } from '../store/action/artistAction';

function Playlist() {
    const [playlist, setPlaylist] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [creating, setCreating] = useState(false);
    const navigate = useNavigate();

    const handlePlayPlaylist = (playlist) => {
        navigate(`/playlist/${playlist._id}`, { state: { playlist } });
    };

    const handleDelete = (id) => {
        setPlaylist((prev) => prev.filter((p) => p._id !== id));
    };

    const fetchPlaylists = async () => {
        try {
            setLoading(true);
            const data = await getPlaylist();
            setPlaylist(data.data);
            setError(null);
        } catch (err) {
            console.error(err);
            setError('Failed to fetch playlists');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlaylists();
    }, []);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        form.resetFields();
        setIsModalOpen(false);
    };

    const handleCreatePlaylist = async (values) => {
        try {
            setCreating(true);
            const response = await createPlaylist({
                name: values.playlistName,
            });

            if (response && response.success) {
                message.success('Playlist created successfully!');
                form.resetFields();
                setIsModalOpen(false);
                fetchPlaylists();
            } else {
                throw new Error(
                    response?.message || 'Failed to create playlist'
                );
            }
        } catch (err) {
            console.error('Error creating playlist:', err);
            message.error(err.message || 'Failed to create playlist');
        } finally {
            setCreating(false);
        }
    };

    if (loading && !playlist) {
        return (
            <Spin
                size="large"
                style={{ display: 'block', margin: 'auto', marginTop: '20%' }}
            />
        );
    }

    if (error && !playlist) {
        return <div className="text-center text-red-500">{error}</div>;
    }

    return (
        <div className="container mx-auto px-4 py-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-white">
                    Your Playlists
                </h1>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={showModal}
                    className="rounded-full hover:shadow-lg transition-all"
                    style={{
                        background: 'linear-gradient(45deg, #e835c2, #6e44ff)',
                        border: 'none',
                        boxShadow: '0 0 10px rgba(232, 53, 194, 0.5)',
                    }}
                >
                    Create Playlist
                </Button>
            </div>

            {loading && playlist ? (
                <div className="flex justify-center my-8">
                    <Spin size="large" />
                </div>
            ) : (
                <>
                    {playlist && playlist.length > 0 ? (
                        <PlaylistGrid
                            playlists={playlist}
                            onPlayPlaylist={handlePlayPlaylist}
                            onDelete={handleDelete}
                        />
                    ) : (
                        <div className="text-center py-12 bg-[#2c1e36] rounded-lg">
                            <p className="text-white bg-[#2c1e36] text-lg mb-4">
                                You don't have any playlists yet
                            </p>
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={showModal}
                                className="rounded-full hover:shadow-lg transition-all"
                                style={{
                                    background:
                                        'linear-gradient(45deg, #e835c2, #6e44ff)',
                                    border: 'none',
                                }}
                            >
                                Create Your First Playlist
                            </Button>
                        </div>
                    )}
                </>
            )}

            <Modal
                title="Create New Playlist"
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
                centered
                className="playlist-modal"
                styles={{
                    header: {
                        background: '#231829',
                        color: 'white',
                        borderBottom: '1px solid rgba(232, 53, 194, 0.3)',
                    },
                    body: {
                        background: '#231829',
                        padding: '20px',
                    },
                    mask: {
                        backdropFilter: 'blur(4px)',
                        background: 'rgba(0, 0, 0, 0.6)',
                    },
                    content: {
                        background: '#231829',
                        borderRadius: '12px',
                        boxShadow: '0 0 20px rgba(232, 53, 194, 0.3)',
                        border: '1px solid rgba(232, 53, 194, 0.3)',
                    },
                }}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleCreatePlaylist}
                    className="mt-4"
                >
                    <Form.Item
                        name="playlistName"
                        label={
                            <span className="text-white">Playlist Name</span>
                        }
                        rules={[
                            {
                                required: true,
                                message: 'Please enter a playlist name',
                            },
                            {
                                min: 3,
                                message:
                                    'Playlist name must be at least 3 characters',
                            },
                            {
                                max: 50,
                                message:
                                    'Playlist name cannot exceed 50 characters',
                            },
                        ]}
                    >
                        <Input
                            placeholder="Enter playlist name"
                            className="bg-[#2c1e36] text-white border-[#e835c250] focus:border-[#e835c2] hover:border-[#e835c2]"
                            style={{ borderRadius: '8px' }}
                        />
                    </Form.Item>

                    <div className="flex justify-end gap-3 mt-6">
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={creating}
                            icon={creating ? <LoadingOutlined /> : null}
                            className="rounded-lg hover:shadow-lg transition-all"
                            style={{
                                background:
                                    'linear-gradient(45deg, #e835c2, #6e44ff)',
                                border: 'none',
                            }}
                        >
                            Create
                        </Button>
                    </div>
                </Form>
            </Modal>
        </div>
    );
}

export default Playlist;
