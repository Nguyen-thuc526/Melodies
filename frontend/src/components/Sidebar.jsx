'use client';

import { Layout, Menu, theme } from 'antd';
import {
    HomeOutlined,
    PlayCircleOutlined,
    BookOutlined,
    UserOutlined,
    UnorderedListOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import melodiesLogo from '../assets/image/Melodies.png';
import '../assets/css/SideBar.css';

const { Sider } = Layout;

const menuItems = [
    {
        key: '1',
        icon: <HomeOutlined />,
        label: <Link to="/">Home</Link>,
    },

    {
        key: '2',
        icon: <BookOutlined />,
        label: <Link to="/album">Trending</Link>,
    },
    {
        key: '3',
        icon: <UnorderedListOutlined />,
        label: <Link to="/playlist">Playlist</Link>,
    },
];

function Sidebar({ collapsed, setCollapsed }) {
    const [activeKey, setActiveKey] = useState('1');
    const { token } = theme.useToken();

    // Custom color palette
    const colors = {
        menuBg: 'bg-transparent',
        menuText: 'text-gray-300',
        menuHover: 'hover:text-pink-400',
        menuActive: 'text-pink-500',
        logoGradient: 'bg-gradient-to-r from-pink-500 to-cyan-400',
    };

    // Handle route changes to update active menu item
    useEffect(() => {
        const path = window.location.pathname;
        if (path === '/') setActiveKey('1');
        else if (path === '/discover') setActiveKey('2');
        else if (path === '/album') setActiveKey('3');
        else if (path === '/playlist') setActiveKey('4');
    }, []);

    const siderStyle = {
        background: 'transparent',
    };

    const menuStyle = {
        background: 'transparent',
        borderRight: 0,
    };

    const getMenuItemClassName = (key) => {
        return `transition-all duration-200 ${colors.menuText} ${activeKey === key ? colors.menuActive : colors.menuHover}`;
    };

    return (
        <div
            style={{ backgroundColor: '#121212' }}
            className={`h-screen fixed left-0 top-0 z-50`}
        >
            <Sider
                collapsible
                collapsed={collapsed}
                onCollapse={setCollapsed}
                trigger={null} // Remove default trigger
                width={220}
                collapsedWidth={80}
                style={siderStyle}
                className="h-full shadow-lg shadow-purple-900/20"
            >
                {/* Logo Section */}
                <div
                    className="flex items-center justify-center py-6 cursor-pointer transition-all duration-300"
                    onClick={() => setCollapsed(!collapsed)}
                >
                    <div className="relative flex items-center">
                        <img
                            src={melodiesLogo || '/placeholder.svg'}
                            alt="Melodies Logo"
                            className="w-10 h-10 rounded-full border-2 border-purple-400 shadow-md"
                        />

                        {!collapsed && (
                            <div className="ml-3 flex items-center">
                                <span
                                    className={`text-2xl font-bold ${colors.logoGradient} bg-clip-text text-transparent`}
                                >
                                    Melodies
                                </span>
                                {/* Toggle icon */}
                            </div>
                        )}
                    </div>
                </div>

                {/* Custom Menu */}
                <Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={[activeKey]}
                    style={menuStyle}
                    className="mt-4"
                    items={menuItems.map((item) => ({
                        ...item,
                        className: getMenuItemClassName(item.key),
                        label: (
                            <Link
                                to={item.label.props.to}
                                className="flex items-center"
                                onClick={() => setActiveKey(item.key)}
                            >
                                {item.label.props.children}
                            </Link>
                        ),
                    }))}
                />

                {/* Bottom section - could add user profile or settings here */}
            </Sider>
        </div>
    );
}

export default Sidebar;
