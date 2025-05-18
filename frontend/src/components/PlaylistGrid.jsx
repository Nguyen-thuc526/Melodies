import React from 'react';
import { Typography, Row, Col } from 'antd';
import PlaylistCard from './PlaylistCard';

const { Title } = Typography;

function PlaylistGrid({ playlists, onPlayPlaylist, onDelete }) {
    return (
        <div className="bg-[#231829] min-h-screen p-6">
            <Title level={2} className="!text-white mb-6">
                Your Playlists
            </Title>

            <Row gutter={[16, 16]}>
                {playlists.map((playlist) => (
                    <Col
                        key={playlist._id}
                        xs={24}
                        sm={12}
                        md={8}
                        lg={6}
                        xl={4.8}
                    >
                        <PlaylistCard
                            playlist={playlist}
                            onPlay={onPlayPlaylist}
                            onDelete={onDelete}
                        />
                    </Col>
                ))}
            </Row>
        </div>
    );
}

export default PlaylistGrid;
