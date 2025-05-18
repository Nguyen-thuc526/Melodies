import React from 'react';
import { useParams } from 'react-router-dom';
import {
    Card,
    Typography,
    Button,
    Row,
    Col,
    Divider,
    Image,
    Rate,
    Tag,
    message,
} from 'antd';
import {
    ShoppingCartOutlined,
    PlayCircleOutlined,
    HeartOutlined,
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const fakeProductData = {
    id: 1,
    title: 'Lời nói dối chân thật',
    artist: 'Tlinh',
    description:
        'Bài hát gây nghiện với phong cách hiện đại pha chút R&B. Tlinh mang lại cảm xúc sâu sắc trong từng câu hát.',
    price: 1.99,
    cover: 'https://i.ytimg.com/vi/koRbmP0BbNk/hq720.jpg',
    genre: 'R&B / Pop',
    releaseDate: '2024-12-15',
    rating: 4.5,
};

const ProductDetails = () => {
    const { id } = useParams(); // Dùng khi có router để lấy ID
    const product = fakeProductData; // Thay bằng fetch từ backend nếu có

    const handleAddToCart = () => {
        message.success(`Đã thêm "${product.title}" vào giỏ hàng!`);
    };

    return (
        <div
            style={{
                background: '#1a1221',
                minHeight: '100vh',
                padding: '40px',
            }}
        >
            <Row gutter={[32, 32]}>
                <Col xs={24} md={10}>
                    <Image
                        src={product.cover}
                        alt={product.title}
                        width="100%"
                        height="auto"
                        style={{ borderRadius: 16 }}
                        preview={false}
                    />
                </Col>

                <Col xs={24} md={14}>
                    <Card
                        style={{
                            background: '#3d2a3a',
                            border: 'none',
                            borderRadius: 16,
                        }}
                        bodyStyle={{ color: 'white' }}
                    >
                        <Title level={2} style={{ color: 'white' }}>
                            {product.title}
                        </Title>
                        <Text style={{ color: '#ff99cc', fontSize: '16px' }}>
                            by {product.artist}
                        </Text>
                        <Divider style={{ background: '#5a3b5f' }} />

                        <Paragraph style={{ color: 'rgba(255,255,255,0.85)' }}>
                            {product.description}
                        </Paragraph>

                        <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
                            <Col span={12}>
                                <Text style={{ color: '#bbb' }}>Genre:</Text>
                                <br />
                                <Tag color="magenta">{product.genre}</Tag>
                            </Col>
                            <Col span={12}>
                                <Text style={{ color: '#bbb' }}>Release:</Text>
                                <br />
                                <Text style={{ color: 'white' }}>
                                    {product.releaseDate}
                                </Text>
                            </Col>
                        </Row>

                        <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
                            <Col span={12}>
                                <Text style={{ color: '#bbb' }}>Rating:</Text>
                                <br />
                                <Rate
                                    disabled
                                    allowHalf
                                    defaultValue={product.rating}
                                />
                            </Col>
                            <Col span={12}>
                                <Text style={{ color: '#bbb' }}>Price:</Text>
                                <br />
                                <Title
                                    level={3}
                                    style={{ color: '#ff4fa2', margin: 0 }}
                                >
                                    ${product.price}
                                </Title>
                            </Col>
                        </Row>

                        <Row gutter={16} style={{ marginTop: 30 }}>
                            <Col>
                                <Button
                                    icon={<PlayCircleOutlined />}
                                    type="primary"
                                    style={{
                                        background: '#ff1f9c',
                                        border: 'none',
                                        borderRadius: 20,
                                    }}
                                >
                                    Play Now
                                </Button>
                            </Col>
                            <Col>
                                <Button
                                    icon={<ShoppingCartOutlined />}
                                    onClick={handleAddToCart}
                                    style={{ borderRadius: 20 }}
                                >
                                    Add to Cart
                                </Button>
                            </Col>
                            <Col>
                                <Button
                                    shape="circle"
                                    icon={<HeartOutlined />}
                                />
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default ProductDetails;
