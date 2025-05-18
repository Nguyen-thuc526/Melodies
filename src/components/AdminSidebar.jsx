import React from 'react';
import { Layout, Menu, Button } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slice/authSlice';

const { Sider } = Layout;

const items = [
    {
        key: '1',
        icon: <UserOutlined />,
        label: <Link to="/admin/artist-request">Artist Requests</Link>,
    },
];

const AdminSidebar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth?.user);

    if (!user) {
        navigate('/login');
        return null;
    }

    const handleLogout = async () => {
        await dispatch(logout());
        navigate('/login');
    };

    return (
        <Sider
            width={250}
            style={{ background: '#5B4959', minHeight: '100vh' }}
        >
            <div
                style={{
                    color: '#fff',
                    padding: '1rem',
                    fontSize: '1.5rem',
                    textAlign: 'center',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <span>Hello Admin</span>
                <Button
                    type="primary"
                    danger
                    icon={<LogoutOutlined />}
                    shape="circle"
                    onClick={handleLogout}
                />
            </div>
            <Menu
                theme="dark"
                mode="inline"
                defaultSelectedKeys={['1']}
                style={{ background: '#5B4959' }}
                items={items}
            />
        </Sider>
    );
};

export default AdminSidebar;
