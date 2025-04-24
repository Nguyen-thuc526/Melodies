import { Layout, Row, Col, Typography, Divider, Space, Button } from 'antd';
import { FacebookOutlined, TwitterOutlined, InstagramOutlined, YoutubeOutlined } from '@ant-design/icons';

const { Footer } = Layout;
const { Title, Text } = Typography;

const AppFooter = () => {
  return (
    <Footer
      style={{
        background: '#2D1F31',
        color: 'white',
        padding: '60px 24px',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      <Row gutter={[24, 24]} align="top">
        {/* About Section */}
        <Col xs={24} md={6}>
          <Title
            level={4}
            style={{
              color: '#ff1f9c',
              marginBottom: '16px',
              textShadow: '0 0 5px rgba(255, 31, 156, 0.5)',
            }}
          >
            About
          </Title>
          <Text
            style={{
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '18px',
              lineHeight: '1.8',
            }}
          >
            Melodies is a website that has been created for music lovers. Now it is one of the most famous music platforms. You can listen to and download songs for free.
          </Text>
        </Col>

        {/* Melodies Section */}
        <Col xs={24} md={6}>
          <Title
            level={4}
            style={{
              color: '#ff1f9c',
              marginBottom: '16px',
              textShadow: '0 0 5px rgba(255, 31, 156, 0.5)',
            }}
          >
            Melodies
          </Title>
          <div>
            {['Songs', 'Radio', 'Podcast', 'Trends'].map((item) => (
              <Button
                key={item}
                type="link"
                style={{
                  color: 'white',
                  display: 'block',
                  padding: '4px 0',
                  fontSize: '18px',
                  transition: 'color 0.3s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#ff1f9c')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'white')}
              >
                {item}
              </Button>
            ))}
          </div>
        </Col>

        {/* Access Section */}
        <Col xs={24} md={6}>
          <Title
            level={4}
            style={{
              color: '#ff1f9c',
              marginBottom: '16px',
              textShadow: '0 0 5px rgba(255, 31, 156, 0.5)',
            }}
          >
            Access
          </Title>
          <div>
            {['Explore', 'Artists', 'Playlists'].map((item) => (
              <Button
                key={item}
                type="link"
                style={{
                  color: 'white',
                  display: 'block',
                  padding: '4px 0',
                  fontSize: '18px',
                  transition: 'color 0.3s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#ff1f9c')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'white')}
              >
                {item}
              </Button>
            ))}
          </div>
        </Col>

        {/* Contact Section */}
        <Col xs={24} md={6}>
          <Title
            level={4}
            style={{
              color: '#ff1f9c',
              marginBottom: '16px',
              textShadow: '0 0 5px rgba(255, 31, 156, 0.5)',
            }}
          >
            Contact
          </Title>
          <div>
            {['About', 'Policy', 'Social Media', 'Support'].map((item) => (
              <Button
                key={item}
                type="link"
                style={{
                  color: 'white',
                  display: 'block',
                  padding: '4px 0',
                  fontSize: '18px',
                  transition: 'color 0.3s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#ff1f9c')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'white')}
              >
                {item}
              </Button>
            ))}
          </div>
          {/* Social Media Icons */}
          <Space style={{ marginTop: '16px' }}>
            <Button
              type="link"
              icon={<FacebookOutlined />}
              style={{ color: 'white', fontSize: '20px' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#ff1f9c')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'white')}
            />
            <Button
              type="link"
              icon={<TwitterOutlined />}
              style={{ color: 'white', fontSize: '20px' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#ff1f9c')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'white')}
            />
            <Button
              type="link"
              icon={<InstagramOutlined />}
              style={{ color: 'white', fontSize: '20px' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#ff1f9c')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'white')}
            />
            <Button
              type="link"
              icon={<YoutubeOutlined />}
              style={{ color: 'white', fontSize: '20px' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#ff1f9c')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'white')}
            />
          </Space>
        </Col>
      </Row>

      {/* Divider */}
      <Divider style={{ background: 'rgba(255, 255, 255, 0.1)', margin: '22px 0' }} />

      {/* Copyright Notice */}
      <div style={{ textAlign: 'center' }}>
        <Text style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '18px' }}>
          Melodies © 2025
        </Text>
      </div>
    </Footer>
  );
};

export default AppFooter;