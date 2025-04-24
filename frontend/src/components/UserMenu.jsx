import React from 'react';
import { Dropdown, Avatar } from 'antd';
import { UserOutlined, LogoutOutlined, ProfileOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import authService from '../services/authService';

const UserMenu = () => {
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    window.dispatchEvent(new Event('authChange'));
    message.success('Logged out successfully');
    navigate('/login');
  };

  const items = [
    {
      key: 'profile',
      icon: <ProfileOutlined />,
      label: 'Profile',
      onClick: () => navigate('/profile')
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout
    }
  ];

  return (
    <Dropdown menu={{ items }} placement="bottomRight">
      <Avatar 
        icon={<UserOutlined />} 
        style={{ 
          backgroundColor: '#5B4959',
          cursor: 'pointer',
          marginLeft: '16px'
        }}
      />
    </Dropdown>
  );
};

export default UserMenu; 