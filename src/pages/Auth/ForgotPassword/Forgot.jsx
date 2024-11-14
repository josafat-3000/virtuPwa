// src/pages/Auth/ForgotPassword/Forgot.js
import React from 'react';
import { Form, Input, Button, Card, Typography, message, Row, Col } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom'; // Importa el Link
import './Forgot.css'; // Estilos específicos para esta página

const { Title } = Typography;

const ForgotPassword = () => {
  const onFinish = async (values) => {
    try {
      // Reemplaza con tu endpoint para la recuperación de contraseña
      await axios.post('/api/v1/auth/recover-password', { email: values.email });
      message.success('Enlace de recuperación enviado a tu correo electrónico');
    } catch (error) {
      message.error('Hubo un problema al enviar el enlace de recuperación');
    }
  };

  return (
    <Row justify="center" align="middle" className="forgot-password-container">
      <Col xs={22} sm={18} md={12} lg={10} xl={8}>
        <Card className="forgot-password-card">
          <Title level={4} className="forgot-password-title">
            Recuperar Contraseña
          </Title>
          <Typography.Text className="forgot-password-description">
            Por favor, introduce tu correo electrónico para recibir un enlace de recuperación.
          </Typography.Text>
          <Form
            name="forgot_password"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            className="forgot-password-form"
          >
            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Por favor ingresa tu correo electrónico' },
                { type: 'email', message: 'El correo electrónico no es válido' }
              ]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="Correo electrónico"
                size="large"
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="forgot-password-button"
                size="large"
                style={{
                  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)'
                }}
              >
                Enviar enlace de recuperación
              </Button>
            </Form.Item>
          </Form>
          <Typography.Text className="forgot-password-login-link">
            <Link to="/login">Regresar al inicio de sesión</Link>
          </Typography.Text>
        </Card>
      </Col>
    </Row>
  );
};

export default ForgotPassword;
