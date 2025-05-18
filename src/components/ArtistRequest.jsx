import React, { useEffect, useState } from 'react';
import {
    getAllArtistRequest,
    changeArtistRequestStatus,
} from '../store/action/adminAction';
import {
    Table,
    Avatar,
    Button,
    Tag,
    Space,
    message,
    Typography,
    Card,
} from 'antd';

const { Title } = Typography;

const ArtistRequest = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArtistRequests = async () => {
            try {
                const data = await getAllArtistRequest();
                setRequests(data);
            } catch (error) {
                console.error('Error fetching artist requests:', error);
                message.error('Failed to fetch artist requests');
            } finally {
                setLoading(false);
            }
        };
        fetchArtistRequests();
    }, []);

    const handleConfirm = async (id) => {
        try {
            // Update artist request status to 'approved'
            const response = await changeArtistRequestStatus(id, 'approved');
            // Check if the response is successful
            if (response.success) {
                // Update the status and other details in the table after confirming
                setRequests((prevRequests) =>
                    prevRequests.map((request) =>
                        request._id === id
                            ? {
                                  ...request,
                                  status: response.data.status,
                                  ...response.data,
                              }
                            : request
                    )
                );
                message.success(response.message); // Show success message
            } else {
                message.error('Failed to confirm artist');
            }
        } catch (error) {
            message.error('Failed to confirm artist');
        }
    };

    const handleReject = async (id) => {
        try {
            // Update artist request status to 'rejected'
            const response = await changeArtistRequestStatus(id, 'rejected');
            // Check if the response is successful
            if (response.success) {
                // Update the status and other details in the table after rejecting
                setRequests((prevRequests) =>
                    prevRequests.map((request) =>
                        request._id === id
                            ? {
                                  ...request,
                                  status: response.data.status,
                                  ...response.data,
                              }
                            : request
                    )
                );
                message.warning(response.message);
            } else {
                message.error('Failed to reject artist');
            }
        } catch (error) {
            message.error('Failed to reject artist');
        }
    };

    const columns = [
        {
            title: 'Profile',
            dataIndex: 'profileImageUrl',
            key: 'profileImageUrl',
            render: (url) => <Avatar src={url} size="large" />,
        },
        {
            title: 'Stage Name',
            dataIndex: 'stageName',
            key: 'stageName',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag
                    color={
                        status === 'approved'
                            ? 'green'
                            : status === 'pending'
                              ? 'orange'
                              : 'red'
                    }
                >
                    {status.toUpperCase()}
                </Tag>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleConfirm(record._id)}
                        disabled={record.status === 'approved'}
                    >
                        Confirm
                    </Button>
                    <Button
                        danger
                        onClick={() => handleReject(record._id)}
                        disabled={record.status === 'rejected'}
                    >
                        Reject
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Card style={{ width: '100%', maxWidth: 1200 }}>
                <Title
                    level={2}
                    style={{ textAlign: 'center', marginBottom: '2rem' }}
                >
                    Artist Requests
                </Title>
                <Table
                    columns={columns}
                    dataSource={requests}
                    rowKey="_id"
                    loading={loading}
                    bordered
                />
            </Card>
        </div>
    );
};

export default ArtistRequest;
