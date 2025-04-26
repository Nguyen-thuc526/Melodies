import { Layout, Menu } from 'antd';
import {
    HomeOutlined,
    LoginOutlined,
    UserAddOutlined,
    UserOutlined,
    PlayCircleOutlined,
    BookOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import melodiesLogo from '../assets/image/Melodies.png';

const { Sider } = Layout;

function Sidebar({ collapsed, setCollapsed }) {
    return (
        <Sider
            collapsible
            collapsed={collapsed}
            trigger={null}
            style={{
                position: 'fixed',
                left: 0,
                top: 0,
                bottom: 0,
                height: '100vh',
                zIndex: 1000,
                background: '#001529',
            }}
        >
            <div
                style={{
                    textAlign: 'center',
                    padding: 10,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
                onClick={() => setCollapsed(!collapsed)}
            >
                <img
                    src={melodiesLogo}
                    alt="Melodies Logo"
                    style={{ width: 40, height: 40, borderRadius: '100%' }}
                />
                {!collapsed && (
                    <span
                        style={{
                            fontSize: '24px',
                            fontWeight: 'bold',
                            background:
                                'linear-gradient(to right, #EE10B0, #0E9EEFEB)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            marginLeft: 10,
                        }}
                    >
                        Melodies
                    </span>
                )}
            </div>
            <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
                <Menu.Item key="1" icon={<HomeOutlined />}>
                    <Link to="/">Home</Link>
                </Menu.Item>
                <Menu.Item key="2" icon={<PlayCircleOutlined />}>
                    <Link to="/discover">Discover</Link>
                </Menu.Item>
                <Menu.Item key="3" icon={< BookOutlined />}>
                    <Link to="/album">Album</Link>
                </Menu.Item>
                <Menu.Item key="4" icon={< BookOutlined />}>
                    <Link to="/artist">Artist</Link>
                </Menu.Item>
            </Menu>
        </Sider>
    );
}

export default Sidebar;
