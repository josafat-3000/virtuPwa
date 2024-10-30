import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, Typography, Space, Spin, Avatar, Row, Col } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { fetchUser } from '../../store/configSlice';

const { Title, Text } = Typography;

const ProfilePage = () => {
  const dispatch = useDispatch();
  const currentUserId = useSelector((state) => state.user.user.id);
  const { user } = useSelector((state) => state.config);


  useEffect(() => {
    if (currentUserId) {
      console.log("Fetching user data for ID:", currentUserId);
      dispatch(fetchUser(currentUserId));
    }
  }, [dispatch, currentUserId]);

  return (
    <div style={{ margin: '0 auto', padding: '20px' }}>
      <Title level={2}>Información Personal</Title>
      {user && (
        <Card bordered={false} style={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
          <Row gutter={16} align="middle">
            <Col xs={24} sm={8} style={{ textAlign: 'center' }}>
              <Avatar size={120} icon={<UserOutlined />} />
            </Col>
            <Col xs={24} sm={16}>
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <Text><strong>Nombre:</strong>      {user.name}</Text>
                <Text><strong>Correo:</strong>     {user.email}</Text>
                <Text><strong>Rol:</strong>      {user.role_id === 1 ? 'Admin' :
                  user.role_id === 3 ? 'Guard' :
                    'User'}</Text>
                <Text><strong>ID:</strong>        {user.id}</Text>
                <Text><strong>Teléfono:</strong>     {user.phone || 'N/A'}</Text>
              </Space>
            </Col>
          </Row>
        </Card>
      )}
    </div>
  );
};

export default ProfilePage;
