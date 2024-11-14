import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Row, Col, message } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import './LoginForm.css';
import logo from '../../../assets/virtu.png';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../../store/userSlice';

const { Title } = Typography;

const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.user.loading);
  const error = useSelector((state) => state.user.error);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  const handleSignIn = async () => {
    try {
      await dispatch(loginUser({ email, password })).unwrap();
      setEmail('');
      setPassword('');
      navigate('/');
    } catch (err) {
      message.error({
        content: 'Error al iniciar sesión',
        duration: 3, // Duración en segundos antes de que desaparezca
        className: 'login-error-message',
      });
    }
  };

  return (
    <Row justify="center" align="middle" className="login-container">
      <Col xs={22} sm={18} md={12} lg={10} xl={8}>
        <Card className="login-card">
          <div className="login-logo">
            <img src={logo} alt="Logo" className="logo-image" />
            <LockOutlined className="lock-icon" />
          </div>
          <Title level={4} className="register-title">
            Inicia sesión
          </Title>
          <Typography.Text className="register-title">
            Por favor, introduce tus datos
          </Typography.Text>
          <Form
            name="login"
            initialValues={{ remember: true }}
            onFinish={handleSignIn}
            className="login-form"
          >
            <Form.Item
              name="email"
              rules={[{ required: true, message: 'Por favor, introduce tu correo electrónico' }]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Correo electrónico"
                size="large"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Por favor, introduce tu contraseña' }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Contraseña"
                size="large"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Item>
            <Form.Item className="login-remember">
              <Link to="/forgot" className="login-forgot">¿Olvidaste tu contraseña?</Link>
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="login-button"
                size="large"
                loading={loading}
                style={{
                  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)'
                }}
              >
                {loading ? 'Iniciando sesión' : 'Iniciar Sesión'}
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export default LoginForm;
