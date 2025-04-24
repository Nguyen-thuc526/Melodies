import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from 'antd';
import { useState } from 'react';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import AppFooter from './components/Footer';
import DiscoverPage from './pages/Discover';
import Album from './pages/Album';
import ArtistProfileForm from './pages/Artist';
import Profile from './pages/Profile';
import ArtistRegistration from './pages/ArtistRegistration';

const { Content } = Layout;

function App() {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <Router>
            <Layout style={{ minHeight: '100vh' }}>
                <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
                <Layout
                    style={{
                        marginLeft: collapsed ? 80 : 200,
                        transition: 'margin-left 0.2s',
                    }}
                >
                    <Navbar />
                    <Content style={{ padding: '24px', background: '#412C3A' }}>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/discover" element={<DiscoverPage />} />
                            <Route path="/album" element={<Album />} />
                            <Route path="/artist" element={<ArtistProfileForm/>} />
                            <Route path="/artist-registration" element={<ArtistRegistration />} />
                        </Routes>
                    </Content>
                    <AppFooter />
                </Layout>
            </Layout>
        </Router>
    );
}
export default App;
