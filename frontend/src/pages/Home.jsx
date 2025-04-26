import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Typography, Button, Layout, Menu, List, Avatar, Space, Divider, Input, Carousel } from 'antd';
import { PlayCircleOutlined, HeartOutlined, UserOutlined, HomeOutlined, SearchOutlined, PlaySquareOutlined, LogoutOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import authService from '../services/authService';
import UserMenu from '../components/UserMenu';

const { Header, Content } = Layout;
const { Title, Text, Paragraph } = Typography;

const Home = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(authService.isAuthenticated());

  useEffect(() => {
    const handleAuthChange = () => {
      setIsAuthenticated(authService.isAuthenticated());
    };

    window.addEventListener('authChange', handleAuthChange);

    return () => {
      window.removeEventListener('authChange', handleAuthChange);
    };
  }, []);

  // Sample data for different sections
  const weeklyTopSongs = [
    { id: 1, title: 'Song 1', artist: 'Artist 1', cover: 'https://picsum.photos/200' },
    { id: 2, title: 'Song 2', artist: 'Artist 2', cover: 'https://picsum.photos/200' },
    { id: 3, title: 'Song 3', artist: 'Artist 3', cover: 'https://picsum.photos/200' },
    { id: 4, title: 'Song 4', artist: 'Artist 4', cover: 'https://picsum.photos/200' },
  ];

  const newReleases = [
    { id: 1, title: 'New Song 1', artist: 'Artist 1', cover: 'https://picsum.photos/200' },
    { id: 2, title: 'New Song 2', artist: 'Artist 2', cover: 'https://picsum.photos/200' },
    { id: 3, title: 'New Song 3', artist: 'Artist 3', cover: 'https://picsum.photos/200' },
    { id: 4, title: 'New Song 4', artist: 'Artist 4', cover: 'https://picsum.photos/200' },
  ];

  const trendingSongs = [
    { rank: 1, title: 'Sicko Mode', artist: 'Travis Scott', date: 'Nov 28, 2023', duration: '2:42' },
    { rank: 2, title: 'Skyfall Beats', artist: 'Imagine Dragons', date: 'Oct 15, 2023', duration: '3:15' },
    { rank: 3, title: 'Greedy', artist: 'Tate McRae', date: 'Dec 01, 2023', duration: '2:11' },
    { rank: 4, title: 'Lovin On Me', artist: 'Jack Harlow', date: 'Dec 05, 2023', duration: '2:18' },
    { rank: 5, title: 'Paint The Town Red', artist: 'Doja Cat', date: 'Dec 10, 2023', duration: '3:51' },
    { rank: 6, title: 'Dance On Night', artist: 'Dua Lipa', date: 'May 27, 2023', duration: '2:56' },
    { rank: 7, title: 'Water', artist: 'Tyla', date: 'Dec 15, 2023', duration: '3:20' },
  ];

  const popularArtists = [
    { name: 'Eminem', avatar: 'https://picsum.photos/100' },
    { name: 'Imagine Dragons', avatar: 'https://picsum.photos/100' },
    { name: 'Adele', avatar: 'https://picsum.photos/100' },
    { name: 'Lana Del Rey', avatar: 'https://picsum.photos/100' },
    { name: 'Harry Styles', avatar: 'https://picsum.photos/100' },
    { name: 'Billie Eilish', avatar: 'https://picsum.photos/100' },
  ];

  const musicVideos = [
    { title: 'Gossip', artist: 'Måneskin', cover: 'https://picsum.photos/200' },
    { title: 'Shape of You', artist: 'Ed Sheeran', cover: 'https://picsum.photos/200' },
    { title: 'Someone Like You', artist: 'Adele', cover: 'https://picsum.photos/200' },
  ];

  const topAlbums = [
    { title: 'Meteora', artist: 'Linkin Park', cover: 'https://picsum.photos/200' },
    { title: 'Midnight Marauders', artist: 'A Tribe Called Quest', cover: 'https://picsum.photos/200' },
    { title: 'Evermore', artist: 'Taylor Swift', cover: 'https://picsum.photos/200' },
    { title: 'Born To Die', artist: 'Lana Del Rey', cover: 'https://picsum.photos/200' },
  ];

  const moodPlaylists = [
    { title: 'Sad Songs', cover: 'https://picsum.photos/200' },
    { title: 'Chill Songs', cover: 'https://picsum.photos/200' },
    { title: 'Workout Songs', cover: 'https://picsum.photos/200' },
    { title: 'Love Playlists', cover: 'https://picsum.photos/200' },
    { title: 'Happy Tunes', cover: 'https://picsum.photos/200' },
  ];

  const renderSongCard = (item) => (
    <Card
      hoverable
      cover={<img alt={item.title} src={item.cover} />}
      style={{ width: 200, margin: '0 15px' }}
    >
      <Card.Meta title={item.title} description={item.artist} />
    </Card>
  );

  return (
    <Layout style={{ minHeight: '100vh', background: '#1a1221' }}>
      <Layout style={{ background: '#1a1221' }}>
        {/* Header */}
        <Header style={{ 
          background: '#412C3A', 
          padding: '0 24px',
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center'
        }}>
          
        </Header>

        {/* Main Content */}
        <Content style={{ padding: '24px', background: '#1a1221' }}>
          {/* Hero Section */}
          <Carousel autoplay>
            <div>
              <Card
                style={{ width: '100%', height: 300, background: '#412C3A' }}
                cover={<img alt="Billie Eilish" src="https://picsum.photos/1200/300" />}
              >
                <Card.Meta
                  title={<Typography.Title level={2} style={{ color: 'white', margin: 0 }}>Featured Artist: Billie Eilish</Typography.Title>}
                  description={<Typography.Text style={{ color: '#B4A7AE' }}>Latest album out now</Typography.Text>}
                />
              </Card>
            </div>
          </Carousel>

          {/* Weekly Top Songs */}
          <Title level={3} style={{ color: 'white', marginBottom: '20px' }}>
            Weekly Top Songs
          </Title>
          <Row gutter={[16, 16]}>
            {weeklyTopSongs.map((song) => (
              <Col xs={24} sm={12} md={6} key={song.id}>
                {renderSongCard(song)}
              </Col>
            ))}
            <Col xs={24} style={{ textAlign: 'right' }}>
              <Button type="link" style={{ color: '#ff1f9c' }}>View All</Button>
            </Col>
          </Row>

          {/* New Release Songs */}
          <Title level={3} style={{ color: 'white', marginTop: '40px', marginBottom: '20px' }}>
            New Release Songs
          </Title>
          <Row gutter={[16, 16]}>
            {newReleases.map((song) => (
              <Col xs={24} sm={12} md={6} key={song.id}>
                {renderSongCard(song)}
              </Col>
            ))}
            <Col xs={24} style={{ textAlign: 'right' }}>
              <Button type="link" style={{ color: '#ff1f9c' }}>View All</Button>
            </Col>
          </Row>

          {/* Trending Songs */}
          <Title level={3} style={{ color: 'white', marginTop: '40px', marginBottom: '20px' }}>
            Trending Songs
          </Title>
          <List
            itemLayout="horizontal"
            dataSource={trendingSongs}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <Button type="link" icon={<HeartOutlined />} style={{ color: '#ff1f9c' }} />,
                  <Text style={{ color: 'white' }}>{item.duration}</Text>,
                ]}
                style={{ background: '#3d2a3a', padding: '10px', borderRadius: '8px', marginBottom: '8px' }}
              >
                <List.Item.Meta
                  avatar={<Text style={{ color: 'white', fontSize: '18px' }}>{item.rank}</Text>}
                  title={<span style={{ color: 'white' }}>{item.title}</span>}
                  description={
                    <div>
                      <Text style={{ color: 'rgba(255, 255, 255, 0.7)' }}>{item.artist}</Text>
                      <br />
                      <Text style={{ color: 'rgba(255, 255, 255, 0.5)' }}>{item.date}</Text>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <Button type="primary" style={{ background: '#ff1f9c', border: 'none', borderRadius: '20px' }}>
              + View All
            </Button>
          </div>

          {/* Popular Artists */}
          <Title level={3} style={{ color: 'white', marginTop: '40px', marginBottom: '20px' }}>
            Popular Artists
          </Title>
          <Row gutter={[16, 16]}>
            {popularArtists.map((artist) => (
              <Col xs={24} sm={12} md={4} key={artist.name}>
                <div style={{ textAlign: 'center' }}>
                  <Avatar size={100} src={artist.avatar} />
                  <div style={{ marginTop: '10px' }}>
                    <Text style={{ color: 'white' }}>{artist.name}</Text>
                  </div>
                </div>
              </Col>
            ))}
            <Col xs={24} style={{ textAlign: 'right' }}>
              <Button type="link" style={{ color: '#ff1f9c' }}>View All</Button>
            </Col>
          </Row>

          {/* Music Videos */}
          <Title level={3} style={{ color: 'white', marginTop: '40px', marginBottom: '20px' }}>
            Music Videos
          </Title>
          <Row gutter={[16, 16]}>
            {musicVideos.map((video) => (
              <Col xs={24} sm={12} md={8} key={video.title}>
                <Card
                  hoverable
                  cover={<img alt={video.title} src={video.cover} />}
                  style={{ background: '#3d2a3a', border: 'none' }}
                  bodyStyle={{ padding: '10px' }}
                >
                  <Card.Meta
                    title={<span style={{ color: 'white' }}>{video.title}</span>}
                    description={<span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>{video.artist}</span>}
                  />
                </Card>
              </Col>
            ))}
            <Col xs={24} style={{ textAlign: 'right' }}>
              <Button type="link" style={{ color: '#ff1f9c' }}>View All</Button>
            </Col>
          </Row>

          {/* Top Albums */}
          <Title level={3} style={{ color: 'white', marginTop: '40px', marginBottom: '20px' }}>
            Top Albums
          </Title>
          <Row gutter={[16, 16]}>
            {topAlbums.map((album) => (
              <Col xs={24} sm={12} md={6} key={album.title}>
                <Card
                  hoverable
                  cover={<img alt={album.title} src={album.cover} />}
                  style={{ background: '#3d2a3a', border: 'none' }}
                  bodyStyle={{ padding: '10px' }}
                >
                  <Card.Meta
                    title={<span style={{ color: 'white' }}>{album.title}</span>}
                    description={<span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>{album.artist}</span>}
                  />
                </Card>
              </Col>
            ))}
            <Col xs={24} style={{ textAlign: 'right' }}>
              <Button type="link" style={{ color: '#ff1f9c' }}>View All</Button>
            </Col>
          </Row>

          {/* Mood Playlists */}
          <Title level={3} style={{ color: 'white', marginTop: '40px', marginBottom: '20px' }}>
            Mood Playlists
          </Title>
          <Row gutter={[16, 16]}>
            {moodPlaylists.map((playlist) => (
              <Col xs={24} sm={12} md={6} key={playlist.title}>
                <Card
                  hoverable
                  cover={<img alt={playlist.title} src={playlist.cover} />}
                  style={{ background: '#3d2a3a', border: 'none' }}
                  bodyStyle={{ padding: '10px' }}
                >
                  <Card.Meta
                    title={<span style={{ color: 'white' }}>{playlist.title}</span>}
                  />
                </Card>
              </Col>
            ))}
            <Col xs={24} style={{ textAlign: 'right' }}>
              <Button type="link" style={{ color: '#ff1f9c' }}>View All</Button>
            </Col>
          </Row>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Home;