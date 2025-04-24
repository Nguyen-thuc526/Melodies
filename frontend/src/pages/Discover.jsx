import { Layout, Typography, Card, Row, Col, Input, Button, Avatar, Space } from "antd"
import { SearchOutlined, UserOutlined, RightOutlined } from "@ant-design/icons"

const { Header, Content, Footer } = Layout
const { Title, Text, Paragraph } = Typography
const { Meta } = Card

// Sample data
const genres = [
  { id: 1, title: "Rap Tracks", cover: "/placeholder.svg?height=200&width=200" },
  { id: 2, title: "Pop Tracks", cover: "/placeholder.svg?height=200&width=200" },
  { id: 3, title: "Rock Tracks", cover: "/placeholder.svg?height=200&width=200" },
  { id: 4, title: "Classic Tracks", cover: "/placeholder.svg?height=200&width=200" },
]

const playlists = [
  { id: 1, title: "Sad Songs", subtitle: "Sad Playlist", count: 24, cover: "/placeholder.svg?height=200&width=200" },
  { id: 2, title: "Chill Songs", subtitle: "Chill Playlist", count: 32, cover: "/placeholder.svg?height=200&width=200" },
  { id: 3, title: "Workout Songs", subtitle: "Workout Songs", count: 18, cover: "/placeholder.svg?height=200&width=200" },
  { id: 4, title:-
    "Love Songs", subtitle: "Love Playlist", count: 27, cover: "/placeholder.svg?height=200&width=200" },
  { id: 5, title: "Happy Songs", subtitle: "Happy Songs", count: 30, cover: "/placeholder.svg?height=200&width=200" },
]

const artists = [
  { id: 1, name: "Eminem", avatar: "/placeholder.svg?height=150&width=150" },
  { id: 2, name: "Imagine Dragons", avatar: "/placeholder.svg?height=150&width=150" },
  { id: 3, name: "Adele", avatar: "/placeholder.svg?height=150&width=150" },
  { id: 4, name: "Lana Del Rey", avatar: "/placeholder.svg?height=150&width=150" },
  { id: 5, name: "Harry Styles", avatar: "/placeholder.svg?height=150&width=150" },
  { id: 6, name: "Billie Eilish", avatar: "/placeholder.svg?height=150&width=150" },
]

// Updated styles to match Login and ArtistProfileForm
const styles = {
  layout: {
    background: "linear-gradient(135deg, #1a1221 0%, #2D1F31 100%)", // Background gradient from Login
    minHeight: "100vh",
  },
  header: {
    background: "transparent",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 24px",
    height: "auto",
  },
  searchInput: {
    width: 250,
    borderRadius: 24, // Match Login's rounded corners
    background: "rgba(91, 73, 89, 0.7)", // Input background from Login
    border: "1px solid rgba(255, 31, 156, 0.3)", // Border from Login
    color: "#FFFFFF",
  },
  content: {
    padding: "0 50px",
    marginTop: 20,
  },
  sectionTitle: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    color: "#FFFFFF", // White text from Login
    margin: 0,
    textShadow: "0 0 10px rgba(255, 31, 156, 0.5)", // Glow effect from Login
  },
  highlight: {
    color: "#ff1f9c", // Primary pink from Login
  },
  viewAllBtn: {
    color: "rgba(255, 255, 255, 0.9)", // Muted white from Login
    display: "flex",
    alignItems: "center",
    fontWeight: 500,
  },
  genreCard: {
    width: "100%",
    height: 180,
    borderRadius: 24, // Match Login's rounded corners
    overflow: "hidden",
    position: "relative",
    border: "none",
    background: "linear-gradient(135deg, #3d2a3a 0%, #4d3649 100%)", // Card gradient from Login
    boxShadow: "0 10px 30px rgba(0,0,0,0.4), 0 0 20px rgba(255, 31, 156, 0.15)", // Shadow from Login
  },
  cardCover: {
    height: "100%",
    width: "100%",
    objectFit: "cover",
  },
  cardOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)",
    padding: "30px 16px 16px",
    color: "#FFFFFF",
  },
  playlistMeta: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  count: {
    color: "#ff4db2", // Secondary pink from Login
    fontSize: 12,
  },
  artistCard: {
    textAlign: "center",
    background: "transparent",
    border: "none",
  },
  artistAvatar: {
    width: "100%",
    height: "auto",
    marginBottom: 8,
    borderRadius: "50%", // Circular avatar like Login
    border: "2px solid rgba(255, 31, 156, 0.3)", // Border from Login
  },
  artistName: {
    color: "#FFFFFF", // White text from Login
    fontSize: 14,
  },
  footer: {
    background: "rgba(0, 0, 0, 0.3)",
    color: "#FFFFFF",
    textAlign: "center",
    padding: "24px 50px",
    marginTop: 60,
  },
}

const DiscoverPage = () => {
  return (
    <Layout style={styles.layout}>
      <Content style={styles.content}>
        {/* Music Genres Section */}
        <div style={{ marginBottom: 40 }}>
          <div style={styles.sectionTitle}>
            <Title level={3} style={styles.title}>
              Music <span style={styles.highlight}>Genres</span>
            </Title>
            <Button type="text" style={styles.viewAllBtn}>
              View All <RightOutlined />
            </Button>
          </div>

          <Row gutter={[16, 16]}>
            {genres.map((genre) => (
              <Col xs={12} sm={12} md={6} key={genre.id}>
                <Card
                  style={styles.genreCard}
                  cover={<img alt={genre.title} src={genre.cover || "/placeholder.svg"} style={styles.cardCover} />}
                  bodyStyle={{ padding: 0 }}
                  hoverable
                >
                  <div style={styles.cardOverlay}>
                    <Text strong style={{ color: "#FFFFFF" }}>
                      {genre.title}
                    </Text>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        {/* Mood Playlists Section */}
        <div style={{ marginBottom: 40 }}>
          <div style={styles.sectionTitle}>
            <Title level={3} style={styles.title}>
              Mood <span style={styles.highlight}>Playlists</span>
            </Title>
            <Button type="text" style={styles.viewAllBtn}>
              View All <RightOutlined />
            </Button>
          </div>

          <Row gutter={[16, 16]}>
            {playlists.map((playlist) => (
              <Col xs={12} sm={12} md={6} lg={4.8} key={playlist.id}>
                <Card
                  style={styles.genreCard}
                  cover={
                    <img alt={playlist.title} src={playlist.cover || "/placeholder.svg"} style={styles.cardCover} />
                  }
                  bodyStyle={{ padding: 0 }}
                  hoverable
                >
                  <div style={styles.cardOverlay}>
                    <Text strong style={{ color: "#FFFFFF", display: "block" }}>
                      {playlist.title}
                    </Text>
                    <div style={styles.playlistMeta}>
                      <Text style={{ color: "rgba(255, 255, 255, 0.7)", fontSize: 12 }}>{playlist.subtitle}</Text>
                      <Text style={styles.count}>{playlist.count}</Text>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        {/* Popular Artists Section */}
        <div style={{ marginBottom: 40 }}>
          <div style={styles.sectionTitle}>
            <Title level={3} style={styles.title}>
              Popular <span style={styles.highlight}>Artists</span>
            </Title>
            <Button type="text" style={styles.viewAllBtn}>
              View All <RightOutlined />
            </Button>
          </div>

          <Row gutter={[24, 24]}>
            {artists.map((artist) => (
              <Col xs={8} sm={6} md={4} key={artist.id}>
                <Card style={styles.artistCard} bodyStyle={{ padding: "8px 0" }}>
                  <Avatar src={artist.avatar} size={100} style={styles.artistAvatar} icon={<UserOutlined />} />
                  <Meta title={<Text style={styles.artistName}>{artist.name}</Text>} style={{ marginTop: 8 }} />
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </Content>
    </Layout>
  )
}

export default DiscoverPage