"use client"

import { useState } from "react"
import { Form, Input, Button, Typography, Upload, Card, Space, message, ConfigProvider } from "antd"
import { UserOutlined, MailOutlined, PhoneOutlined, UploadOutlined } from "@ant-design/icons"

const { Title, Paragraph } = Typography
const { TextArea } = Input

// Updated themeColors to match the Login component
const themeColors = {
  primary: "#ff1f9c", // Pink from Login button gradient
  secondary: "#ff4db2", // Secondary pink from Login gradient
  success: "#33b1ff", // Blue from Sign Up button
  background: "linear-gradient(135deg, #1a1221 0%, #2D1F31 100%)", // Background gradient from Login
  cardBackground: "linear-gradient(135deg, #3d2a3a 0%, #4d3649 100%)", // Card gradient from Login
  textPrimary: "#FFFFFF", // White text from Login
  textSecondary: "rgba(255, 255, 255, 0.9)", // Slightly muted white from Login
  inputBackground: "rgba(91, 73, 89, 0.7)", // Input background from Login
  border: "rgba(255, 31, 156, 0.3)", // Border color from Login inputs
}

const ArtistProfileForm = () => {
  const [form] = Form.useForm()
  const [imageUrl, setImageUrl] = useState(null)

  const onFinish = (values) => {
    console.log("Form submitted:", { ...values, profileImage: imageUrl })
    message.success("Thông tin nghệ sĩ đã được lưu thành công!")
  }

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png"
    if (!isJpgOrPng) message.error("Bạn chỉ có thể tải lên file JPG/PNG!")
    const isLt2M = file.size / 1024 / 1024 < 2
    if (!isLt2M) message.error("Hình ảnh phải nhỏ hơn 2MB!")
    return isJpgOrPng && isLt2M
  }

  const handleChange = (info) => {
    if (info.file.status === "done") {
      getBase64(info.file.originFileObj, (url) => setImageUrl(url))
    }
  }

  const getBase64 = (img, callback) => {
    const reader = new FileReader()
    reader.addEventListener("load", () => callback(reader.result))
    reader.readAsDataURL(img)
  }

  const uploadButton = (
    <div style={{ padding: 8 }}>
      <UploadOutlined style={{ color: themeColors.primary, fontSize: 24 }} />
      <div style={{ marginTop: 12, color: themeColors.textSecondary, fontSize: 14 }}>
        Tải ảnh lên
      </div>
    </div>
  )

  const dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => onSuccess("ok"), 0)
  }

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: themeColors.primary,
          colorSuccess: themeColors.success,
          colorInfo: themeColors.primary,
          colorWarning: themeColors.secondary,
          colorBgContainer: "transparent", // Use gradient from cardBackground
          colorTextBase: themeColors.textPrimary,
          colorBorder: themeColors.border,
          fontSize: 16,
          borderRadius: 24, // Match Login's rounded corners
        },
        components: {
          Card: {
            boxShadow: "0 10px 30px rgba(0,0,0,0.4), 0 0 20px rgba(255, 31, 156, 0.15)", // Match Login shadow
          },
          Input: {
            colorBgContainer: themeColors.inputBackground,
            colorTextPlaceholder: "rgba(255, 255, 255, 0.8)", // Match Login placeholder
            paddingBlock: 12,
            paddingInline: 16,
            hoverBorderColor: themeColors.primary,
          },
          Button: {
            defaultBg: "linear-gradient(135deg, #ff1f9c 0%, #ff4db2 100%)", // Match Login button gradient
            defaultColor: "#FFFFFF",
            paddingBlock: 12,
          },
          Form: {
            labelFontSize: 16,
            verticalLabelPadding: "0 0 8px",
          },
        },
      }}
    >
      <div style={{ 
        background: themeColors.background, 
        padding: "60px 20px", 
        minHeight: "100vh" 
      }}>
        <Card
          style={{
            maxWidth: 900,
            margin: "0 auto",
            padding: "32px",
            borderRadius: "24px",
            background: themeColors.cardBackground,
            border: "none",
            overflow: "hidden",
          }}
        >
          <Space direction="vertical" size={32} style={{ width: "100%" }}>
            <div>
              <Title 
                level={2} 
                style={{ 
                  textAlign: "center", 
                  color: themeColors.primary,
                  marginBottom: 8,
                  fontWeight: "bold",
                  textShadow: "0 0 10px rgba(255, 31, 156, 0.5)", // Match Login title glow
                }}
              >
                Thông Tin Nghệ Sĩ
              </Title>
              <Paragraph 
                style={{ 
                  textAlign: "center", 
                  color: themeColors.textSecondary,
                  fontSize: 16
                }}
              >
                Vui lòng điền đầy đủ thông tin để hoàn tất hồ sơ nghệ sĩ của bạn
              </Paragraph>
            </div>

            <Form 
              form={form} 
              layout="vertical" 
              onFinish={onFinish} 
              requiredMark={false}
            >
              <Form.Item
                name="artistName"
                label={<span style={{ color: themeColors.textPrimary, fontWeight: 500 }}>
                  Tên nghệ sĩ (hoặc nghệ danh)
                </span>}
                rules={[{ required: true, message: "Vui lòng nhập tên nghệ sĩ!" }]}
              >
                <Input
                  prefix={<UserOutlined style={{ color: "rgba(255, 255, 255, 0.8)" }} />}
                  placeholder="Nhập tên nghệ sĩ hoặc nghệ danh của bạn"
                  size="large"
                  style={{ height: "56px", borderRadius: "24px" }} // Match Login input style
                />
              </Form.Item>

              <Form.Item
                name="email"
                label={<span style={{ color: themeColors.textPrimary, fontWeight: 500 }}>
                  Email liên hệ
                </span>}
                rules={[
                  { required: true, message: "Vui lòng nhập email!" },
                  { type: "email", message: "Email không hợp lệ!" },
                ]}
              >
                <Input
                  prefix={<MailOutlined style={{ color: "rgba(255, 255, 255, 0.8)" }} />}
                  placeholder="Nhập email liên hệ"
                  size="large"
                  style={{ height: "56px", borderRadius: "24px" }}
                />
              </Form.Item>

              <Form.Item
                name="phone"
                label={<span style={{ color: themeColors.textPrimary, fontWeight: 500 }}>
                  Số điện thoại
                </span>}
                rules={[
                  { required: true, message: "Vui lòng nhập số điện thoại!" },
                  { pattern: /^[0-9]{10,11}$/, message: "Số điện thoại không hợp lệ!" },
                ]}
              >
                <Input
                  prefix={<PhoneOutlined style={{ color: "rgba(255, 255, 255, 0.8)" }} />}
                  placeholder="Nhập số điện thoại"
                  size="large"
                  style={{ height: "56px", borderRadius: "24px" }}
                />
              </Form.Item>

              <Form.Item
                name="description"
                label={<span style={{ color: themeColors.textPrimary, fontWeight: 500 }}>
                  Mô tả ngắn về nghệ sĩ
                </span>}
                rules={[{ required: true, message: "Vui lòng nhập mô tả về bạn!" }]}
                extra={<span style={{ color: themeColors.textSecondary, fontSize: 14 }}>
                  Giới thiệu bản thân, phong cách âm nhạc, thể loại theo đuổi
                </span>}
              >
                <TextArea
                  placeholder="Giới thiệu bản thân, phong cách âm nhạc, thể loại theo đuổi..."
                  rows={6}
                  showCount
                  maxLength={500}
                  style={{ borderRadius: "16px" }}
                />
              </Form.Item>

              <Form.Item
                name="profileImage"
                label={<span style={{ color: themeColors.textPrimary, fontWeight: 500 }}>
                  Ảnh đại diện hoặc ảnh nghệ sĩ
                </span>}
                extra={<span style={{ color: themeColors.textSecondary, fontSize: 14 }}>
                  Hỗ trợ định dạng: JPG, PNG. Kích thước tối đa: 2MB
                </span>}
              >
                <Upload
                  name="avatar"
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                  customRequest={dummyRequest}
                  beforeUpload={beforeUpload}
                  onChange={handleChange}
                >
                  {imageUrl ? (
                    <img src={imageUrl} alt="avatar" style={{ width: "100%", borderRadius: 8 }} />
                  ) : (
                    uploadButton
                  )}
                </Upload>
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  block
                  style={{
                    height: "52px",
                    borderRadius: "24px",
                    background: "linear-gradient(135deg, #ff1f9c 0%, #ff4db2 100%)", // Match Login button
                    border: "none",
                    fontSize: 16,
                    fontWeight: 500,
                    boxShadow: "0 0 20px rgba(255, 31, 156, 0.3)", // Add subtle glow
                  }}
                >
                  Lưu Thông Tin
                </Button>
              </Form.Item>
            </Form>
          </Space>
        </Card>
      </div>
    </ConfigProvider>
  )
}

export default ArtistProfileForm