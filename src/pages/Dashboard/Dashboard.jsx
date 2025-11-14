import React, { useEffect } from 'react';
import { Button } from 'antd';
import { KeyOutlined } from '@ant-design/icons';
import { EyeOutlined, ClockCircleOutlined, LogoutOutlined } from '@ant-design/icons';
import { Card, Statistic, Row, Col, Typography } from 'antd';
import QuickAccionsPage from '../Acciones/QuickActions.jsx';
import { useSelector, useDispatch } from 'react-redux';
import { fetchVisitStats } from '../../store/visitSlice.js'
import './Dashboard.css';
const { Title, Text } = Typography;

const Dashboard = () => {
  const user = useSelector((state) => state.user.user.name);
  const role = useSelector((state) => state.user.user.role);
  const { pending, in_progress } = useSelector((state) => state.visits);
  const dispatch = useDispatch();

  useEffect(() => {
    if (role != '2') {
      dispatch(fetchVisitStats());
    }
  }, [dispatch, role]);
  // Condicional para mostrar las tarjetas solo si el rol no es "user"
  const displayRelevantInfo = role != '2';
  return (
    <div style={{ margin: '0px' }}>
      {user && (
        <Title level={3}>Bienvenido, {user}</Title>
      )}

      <div style={{ marginTop: '16px', marginBottom: '16px' }}>
        <Title level={4}>Acciones rápidas</Title>
        <QuickAccionsPage />
      </div>
      {displayRelevantInfo && (
        <>
          <Title level={4}>Información Relevante</Title>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={12} lg={8}>
              <DashboardCard
                icon={
                  <EyeOutlined
                    style={{
                      color: "white",
                      backgroundColor: "#026A9F",
                      borderRadius: 20,
                      fontSize: 24,
                      padding: 8,
                    }}
                  />
                }
                title={"Visitas presentes"}
                value={in_progress}
              />
            </Col>

            <Col xs={24} sm={12} md={12} lg={8}>
              <DashboardCard
                icon={
                  <ClockCircleOutlined
                    style={{
                      color: "white",
                      backgroundColor: "#026A9F",
                      borderRadius: 20,
                      fontSize: 24,
                      padding: 8,
                    }}
                  />
                }
                title={"Visitas esperadas"}
                value={pending}
              />
            </Col>

            <Col xs={24} sm={12} md={12} lg={8}>
              <DashboardCard
                icon={
                  <LogoutOutlined
                    style={{
                      color: "white",
                      backgroundColor: "#026A9F",
                      borderRadius: 20,
                      fontSize: 24,
                      padding: 8,
                    }}
                  />
                }
                title={"Salidas"}
                value={0} // Ajusta este valor según sea necesario
              />
            </Col>
          </Row>
        </>
      )}
      <Button
        type="primary"
        shape="round"
        icon={<KeyOutlined />}
        size="large"
        onClick={() => {
          // Acción del botón
          console.log('Botón flotante clicado');
        }}
        style={{
          position: 'fixed',
          bottom: '40px',
          right: '40px',
          zIndex: '1000',
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.5',
          backgroundColor: '#4CAF50', color: '#fff',
        }}
      >Llave móvil</Button>
    </div >
  );
};

const DashboardCard = ({ title, value, icon }) => {
  return (
    <Card
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        borderRadius: '10px',
        boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.2)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {icon}
        <Statistic title={title} value={value} style={{ marginLeft: 16 }} />
      </div>
    </Card>
  );
};


export default Dashboard;
