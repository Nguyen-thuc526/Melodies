import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Layout } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { useSelector } from 'react-redux';

import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import AppFooter from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './components/AdminLayout';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import ArtistRegistration from './pages/ArtistRegistration';
import Album from './pages/Album';
import ArtistDashboard from './pages/ArtistDashboard';
import ArtistRequest from './components/ArtistRequest';
import SongDetails from './pages/SongDetails';
import PlaylistsWithProvider from './pages/Playlist';
import PlaylistDetail from './pages/PlaylistDetail';
import ArtistProfile from './pages/ArtistProfile';
import AlbumDetails from './pages/AlbumDetails';

function App() {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <Router>
            <Routes>
                {/* Main Layout */}
                <Route
                    path="/*"
                    element={
                        <Layout style={{ minHeight: '100vh' }}>
                            <Sidebar
                                collapsed={collapsed}
                                setCollapsed={setCollapsed}
                            />
                            <Layout
                                style={{
                                    marginLeft: collapsed ? 80 : 220,
                                    transition: 'margin-left 0.2s',
                                }}
                            >
                                <Navbar />
                                <Content style={{ background: '#231829' }}>
                                    <Routes>
                                        <Route index element={<Home />} />
                                        <Route
                                            path="login"
                                            element={<Login />}
                                        />
                                        <Route
                                            path="register"
                                            element={<Register />}
                                        />
                                        <Route
                                            element={
                                                <ProtectedRoute
                                                    allowedRoles={[
                                                        'listener',
                                                        'artist',
                                                        'admin',
                                                    ]}
                                                />
                                            }
                                        >
                                            <Route
                                                path="profile"
                                                element={<Profile />}
                                            />
                                            <Route
                                                path="album"
                                                element={<Album />}
                                            />
                                            <Route
                                                path="song-detail/:id"
                                                element={<SongDetails />}
                                            />
                                            <Route
                                                path="playlist"
                                                element={
                                                    <PlaylistsWithProvider />
                                                }
                                            />
                                            <Route
                                                path="playlist/:id"
                                                element={<PlaylistDetail />}
                                            />
                                            <Route
                                                path="artist-profile/:id"
                                                element={<ArtistProfile />}
                                            />
                                        </Route>
                                        <Route
                                            element={
                                                <ProtectedRoute
                                                    allowedRoles={['listener']}
                                                />
                                            }
                                        >
                                            <Route
                                                path="artist-registration"
                                                element={<ArtistRegistration />}
                                            />
                                        </Route>
                                        <Route
                                            element={
                                                <ProtectedRoute
                                                    allowedRoles={['artist']}
                                                />
                                            }
                                        >
                                            <Route
                                                path="artist-dashboard"
                                                element={<ArtistDashboard />}
                                            />
                                            <Route
                                                path="artist-album/:id"
                                                element={<AlbumDetails />}
                                            />
                                        </Route>
                                    </Routes>
                                </Content>
                                <AppFooter />
                            </Layout>
                        </Layout>
                    }
                />

                {/* Admin Layout */}
                <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                    <Route path="/admin/*" element={<AdminLayout />}>
                        <Route
                            path="artist-request"
                            element={<ArtistRequest />}
                        />
                    </Route>
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
