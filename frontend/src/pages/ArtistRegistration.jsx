import React, { useState } from 'react';
import { Form, Input, Button, Upload, message, Card } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const { TextArea } = Input;

const ArtistRegistration = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('artistName', values.artistName);
      formData.append('email', values.email);
      formData.append('phone', values.phone);
      formData.append('shortDescription', values.shortDescription);
      formData.append('biography', values.biography);
      if (imageFile) {
        formData.append('profileImage', imageFile);
      }

      const response = await axios.post('http://localhost:5000/api/artist-requests', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data.success) {
        message.success('Đăng ký thành công! Yêu cầu của bạn đang được xem xét.');
        navigate('/');
      }
    } catch (error) {
      message.error(error.response?.data?.message || 'Có lỗi xảy ra khi đăng ký');
    } finally {
      setLoading(false);
    }
  };

  const beforeUpload = (file) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('Bạn chỉ có thể tải lên file ảnh!');
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('Ảnh phải nhỏ hơn 5MB!');
    }
    if (isImage && isLt5M) {
      setImageFile(file);
    }
    return false; // Prevent auto upload
  };

  return (
    <div className="min-h-screen bg-[#2A1D25] py-8">
      <Card 
        title={<h2 className="text-2xl text-center text-white">Đăng ký trở thành Nghệ sĩ</h2>}
        className="max-w-2xl mx-auto"
        style={{ background: '#412C3A', borderColor: '#5B4959' }}
        headStyle={{ borderBottom: '1px solid #5B4959' }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          requiredMark={false}
        >
          <Form.Item
            name="artistName"
            label={<span className="text-white">Tên nghệ sĩ (hoặc nghệ danh)</span>}
            rules={[{ required: true, message: 'Vui lòng nhập tên nghệ sĩ' }]}
          >
            <Input className="bg-[#2A1D25] text-white border-[#5B4959]" />
          </Form.Item>

          <Form.Item
            name="email"
            label={<span className="text-white">Email liên hệ</span>}
            rules={[
              { required: true, message: 'Vui lòng nhập email' },
              { type: 'email', message: 'Email không hợp lệ' }
            ]}
          >
            <Input className="bg-[#2A1D25] text-white border-[#5B4959]" />
          </Form.Item>

          <Form.Item
            name="phone"
            label={<span className="text-white">Số điện thoại</span>}
            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
          >
            <Input className="bg-[#2A1D25] text-white border-[#5B4959]" />
          </Form.Item>

          <Form.Item
            name="shortDescription"
            label={<span className="text-white">Mô tả ngắn về nghệ sĩ</span>}
            rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
          >
            <TextArea 
              className="bg-[#2A1D25] text-white border-[#5B4959]"
              showCount 
              maxLength={500} 
              rows={4}
            />
          </Form.Item>

          <Form.Item
            name="biography"
            label={<span className="text-white">Giới thiệu chi tiết</span>}
            rules={[{ required: true, message: 'Vui lòng nhập giới thiệu' }]}
          >
            <TextArea 
              className="bg-[#2A1D25] text-white border-[#5B4959]"
              rows={6}
            />
          </Form.Item>

          <Form.Item
            label={<span className="text-white">Ảnh đại diện</span>}
            required
          >
            <Upload
              beforeUpload={beforeUpload}
              maxCount={1}
              listType="picture"
              accept="image/*"
            >
              <Button icon={<UploadOutlined />} className="bg-[#2A1D25] text-white border-[#5B4959]">
                Tải ảnh lên
              </Button>
            </Upload>
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              className="w-full bg-[#ff6b81] hover:bg-[#ff4757] border-none"
            >
              {loading ? 'Đang xử lý...' : 'Gửi đăng ký'}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default ArtistRegistration; 