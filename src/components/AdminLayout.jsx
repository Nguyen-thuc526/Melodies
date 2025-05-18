import { Layout, Menu } from 'antd';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';

const { Header, Sider, Content } = Layout;

const AdminLayout = () => {
    return (
        <Layout style={{ minHeight: '100vh' }}>
            <AdminSidebar />
            <Content style={{ padding: '24px', background: '#f0f2f5' }}>
                <Outlet />
            </Content>
        </Layout>
    );
};

export default AdminLayout;
