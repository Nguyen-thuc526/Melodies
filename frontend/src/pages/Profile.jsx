import React from 'react';
import { Card, Descriptions, Button } from 'antd';
import authService from '../services/authService';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();

  if (!currentUser) {
    navigate('/login');
    return null;
  }

  return (
    <div className="container mx-auto p-4">
      <Card title="User Profile" className="max-w-2xl mx-auto">
        <Descriptions column={1}>
          <Descriptions.Item label="Username">{currentUser.username}</Descriptions.Item>
          <Descriptions.Item label="Email">{currentUser.email}</Descriptions.Item>
        </Descriptions>
        <div className="mt-4">
          <Button type="primary" onClick={() => navigate('/')}>
            Back to Home
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Profile; 