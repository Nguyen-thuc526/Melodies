"use client"

import { useState } from "react"
import { Layout, Typography, List, Avatar, Button, Row, Col, Card, ConfigProvider } from "antd"
import {
  ArrowLeftOutlined,
  PlayCircleFilled,
  HeartOutlined,
  MoreOutlined,
} from "@ant-design/icons"

const { Header, Content } = Layout
const { Title, Text } = Typography

const Album = () => {
  const [songs] = useState([
    { id: 1, title: "Sorfeore", artist: "The Neighborhood", releaseDate: "Nov 4, 2023", album: "Hard to Imagine Neighbourhood Ever Changing", duration: "3:26", liked: false },
    { id: 2, title: "Skyfall Beats", artist: "Skyfall", releaseDate: "Oct 26, 2023", album: "nightmares", duration: "2:45", liked: false },
    { id: 3, title: "Greedy", artist: "Tate McRae", releaseDate: "Nov 30, 2023", album: "Greedy", duration: "2:13", liked: false },
    { id: 4, title: "Lovin On me", artist: "Jack Harlow", releaseDate: "Dec 15, 2023", album: "Lovin On me", duration: "2:18", liked: false },
    { id: 5, title: "pain the town red", artist: "Doja Cat", releaseDate: "Dec 29, 2023", album: "Paint The Town Red", duration: "3:51", liked: false },
    { id: 6, title: "Dancin On Night", artist: "Charli XCX", releaseDate: "May 27, 2023", album: "Dance The Night (From Barbie Movie)", duration: "2:56", liked: false },
    { id: 7, title: "Water", artist: "Tyla", releaseDate: "Oct 21, 2023", album: "Water", duration: "3:20", liked: false },
    { id: 8, title: "Push your limits", artist: "Charli XCX", releaseDate: "Jan 2, 2024", album: "Push your limits", duration: "2:24", liked: false },
    { id: 9, title: "Houdini", artist: "Dua Lipa", releaseDate: "Dec 13, 2023", album: "Houdini", duration: "3:05", liked: false },
    { id: 10, title: "Lala", artist: "Myke Towers", releaseDate: "Nov 20, 2023", album: "La vida es una", duration: "3:17", liked: false },
    { id: 11, title: "I Wanna Be Yours", artist: "Arctic Monkeys", releaseDate: "Sep 5, 2023", album: "AM", duration: "3:03", liked: false },
    { id: 12, title: "Paradise", artist: "Coldplay", releaseDate: "Jul 5, 2023", album: "Paradise", duration: "3:30", liked: false },
    { id: 13, title: "As It Was", artist: "Harry Styles", releaseDate: "Sep 14, 2022", album: "As It Was", duration: "2:47", liked: false },
    { id: 14, title: "Another Love", artist: "Tom Odell", releaseDate: "Dec 19, 2013", album: "Another Love", duration: "4:06", liked: false },
    { id: 15, title: "Daylight", artist: "David Kushner", releaseDate: "Jul 14, 2022", album: "Daylight", duration: "3:32", liked: false },
    { id: 16, title: "Beggin", artist: "Måneskin", releaseDate: "Feb 27, 2017", album: "Chosen", duration: "3:31", liked: false },
    { id: 17, title: "What Was I Made For", artist: "Billie Eilish", releaseDate: "Sep 5, 2023", album: "What Was I Made For", duration: "3:42", liked: false },
    { id: 18, title: "Daddy Issues", artist: "The Neighbourhood", releaseDate: "Aug 21, 2015", album: "Wiped out!", duration: "4:20", liked: false },
    { id: 19, title: "Rolling In The Deep", artist: "Adele", releaseDate: "Jan 5, 2011", album: "Adele 21", duration: "3:48", liked: false },
    { id: 20, title: "Oneshot", artist: "Offset", releaseDate: "Dec 14, 2023", album: "Toca Donda", duration: "3:15", liked: false },
  ])

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#ff1f9c",
          colorSuccess: "#33b1ff",
          colorTextBase: "#FFFFFF",
          colorBorder: "rgba(255, 31, 156, 0.3)",
          borderRadius: 24,
        },
        components: {
          Card: {
            boxShadow: "0 10px 30px rgba(0,0,0,0.4), 0 0 20px rgba(255, 31, 156, 0.15)",
            colorBgContainer: "transparent",
          },
          Button: {
            defaultBg: "linear-gradient(135deg, #ff1f9c 0%, #ff4db2 100%)",
            defaultColor: "#FFFFFF",
          },
          List: {
            colorBgContainer: "transparent",
            itemPadding: "6px 20px", // Reduce padding between list items
          },
        },
      }}
    >
      <Layout style={{ minHeight: "100vh", background: "linear-gradient(135deg, #1a1221 0%, #2D1F31 100%)" }}>
        <Header
          style={{
            background: "transparent",
            padding: "10px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Button type="text" icon={<ArrowLeftOutlined />} style={{ color: "#FFFFFF", fontSize: "20px" }} />
          <div>
            <Button type="text" style={{ color: "rgba(255, 255, 255, 0.9)" }}>Share</Button>
            <Button type="text" style={{ color: "rgba(255, 255, 255, 0.9)" }}>About</Button>
            <Button type="text" style={{ color: "rgba(255, 255, 255, 0.9)" }}>Premium</Button>
            <Avatar style={{ marginLeft: "10px", background: "linear-gradient(135deg, #ff1f9c 0%, #ff4db2 100%)" }}>
              U
            </Avatar>
          </div>
        </Header>

        <Content style={{ padding: "0 20px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", padding: "20px 0" }}>
            <Card
              style={{
                width: 150,
                height: 150,
                marginRight: 20,
                overflow: "hidden",
                borderRadius: 24,
                background: "linear-gradient(135deg, #3d2a3a 0%, #4d3649 100%)",
                border: "none",
              }}
              cover={
                <div style={{ position: "relative", height: "100%" }}>
                  <div
                    style={{
                      position: "absolute",
                      top: 10,
                      left: 10,
                      color: "#FFFFFF",
                      fontWeight: "bold",
                      textShadow: "0 0 10px rgba(255, 31, 156, 0.5)",
                    }}
                  >
                    TRENDING
                    <br />
                    MUSIC
                  </div>
                  <img
                    alt="trending music"
                    src="/placeholder.svg?height=150&width=150"
                    style={{ position: "absolute", bottom: 0, right: 0, width: "70%", height: "auto" }}
                  />
                </div>
              }
            />
            <div>
              <Title
                level={2}
                style={{
                  color: "#FFFFFF",
                  margin: 0,
                  textShadow: "0 0 10px rgba(255, 31, 156, 0.5)",
                }}
              >
                Trending songs <span style={{ color: "#ff1f9c" }}>mix</span>
              </Title>
              <Text style={{ color: "rgba(255, 255, 255, 0.9)", display: "block", marginTop: 10 }}>
                tate mcrae, nightmares, the neighborhood,
                <br />
                doja cat and ...
              </Text>
              <div style={{ display: "flex", alignItems: "center", marginTop: 20 }}>
                <Text style={{ color: "rgba(255, 255, 255, 0.9)", marginRight: 20 }}>20 songs</Text>
                <Text style={{ color: "rgba(255, 255, 255, 0.9)" }}>1h 36m</Text>
                <Button
                  type="primary"
                  style={{
                    marginLeft: "auto",
                    borderRadius: "24px",
                    boxShadow: "0 0 20px rgba(255, 31, 156, 0.3)",
                  }}
                >
                  Play All <PlayCircleFilled style={{ marginLeft: 5, fontSize: 18 }} />
                </Button>
              </div>
            </div>
          </div>

          <div
            style={{
              background: "linear-gradient(135deg, #3d2a3a 0%, #4d3649 100%)",
              borderRadius: "24px",
              marginTop: "20px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.4), 0 0 20px rgba(255, 31, 156, 0.15)",
            }}
          >
            <Row
  style={{
    padding: "10px 20px",
    borderBottom: "1px solid rgba(255, 31, 156, 0.3)",
    color: "#FFFFFF",
  }}
>
  <Col span={2}>#</Col>
  <Col span={6}>Title</Col>
  <Col span={6}>Release Date</Col>
  <Col span={5}>Album</Col>
  <Col span={1}>Time</Col> {/* Điều chỉnh lại số span để khớp */}
</Row>

            <List
              dataSource={songs}
              renderItem={(item, index) => (
                <List.Item
                  key={item.id}
                  style={{
                    padding: "6px 20px", // Reduced padding to shorten row height
                    borderBottom: "1px solid rgba(255, 31, 156, 0.3)",
                    minHeight: "auto", // Ensure no extra height
                  }}
                  actions={[
                    <HeartOutlined key="heart" style={{ color: "rgba(255, 255, 255, 0.9)", fontSize: 16 }} />,
                    <MoreOutlined key="more" style={{ color: "rgba(255, 255, 255, 0.9)", fontSize: 16 }} />,
                  ]}
                >
                  <Row style={{ width: "100%", alignItems: "center" }}>
                    <Col span={1} style={{ color: "#FFFFFF" }}>
                      {index + 1}
                    </Col>
                    <Col span={8}>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <Avatar
                          shape="square"
                          size={32} // Reduced size for tighter spacing
                          src={`/placeholder.svg?height=32&width=32`}
                          style={{ borderRadius: "8px", border: "1px solid rgba(255, 31, 156, 0.3)" }}
                        />
                        <div style={{ marginLeft: 8 }}>
                          <Text style={{ color: "#FFFFFF", display: "block" }}>{item.title}</Text>
                          <Text style={{ color: "rgba(255, 255, 255, 0.7)", fontSize: 12 }}>{item.artist}</Text>
                        </div>
                      </div>
                    </Col>
                    <Col span={5} style={{ color: "rgba(255, 255, 255, 0.7)" }}>
                      {item.releaseDate}
                    </Col>
                    <Col span={6} style={{ color: "rgba(255, 255, 255, 0.7)" }}>
                      {item.album}
                    </Col>
                    <Col span={4} style={{ color: "rgba(255, 255, 255, 0.7)" }}>
                      {item.duration}
                    </Col>
                  </Row>
                </List.Item>
              )}
            />
          </div>
        </Content>
      </Layout>
    </ConfigProvider>
  )
}

export default Album