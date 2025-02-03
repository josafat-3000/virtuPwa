import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Row, Col, message } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import logo from '../../../assets/virtu.png';
import './Reset.css';

const { Title } = Typography;

const ResetPasswordForm = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { token } = useParams();
  const navigate = useNavigate();
  const url_reset = `${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/reset`;

  const handleReset = async () => {
    if (password !== confirmPassword) {
      message.error('Las contraseñas no coinciden');
      return;
    }
    try {
      console.log("token",token)
      await axios.post(url_reset, { token, password });
      message.success('Contraseña restablecida con éxito');
      navigate('/login');
    } catch (error) {
      message.error('Error al restablecer la contraseña');
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
          <Title level={4}>Restablecer Contraseña</Title>
          <Form onFinish={handleReset} className="login-form">
            <Form.Item name="password" rules={[{ required: true, message: 'Introduce una nueva contraseña' }]}> 
              <Input.Password prefix={<LockOutlined />} placeholder="Nueva contraseña" size="large" value={password} onChange={(e) => setPassword(e.target.value)} />
            </Form.Item>
            <Form.Item name="confirmPassword" rules={[{ required: true, message: 'Confirma tu nueva contraseña' }]}> 
              <Input.Password prefix={<LockOutlined />} placeholder="Confirmar contraseña" size="large" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" className="login-button" size="large">Restablecer</Button>
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

const ConfirmAccountForm = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { token } = useParams();
  const navigate = useNavigate();
  const url_confirm = `${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/confirm`;

  const handleReset = async () => {
    if (password !== confirmPassword) {
      message.error('Las contraseñas no coinciden');
      return;
    }
    try {
      await axios.post(url_confirm, { token, password });
      message.success('Contraseña restablecida con éxito');
      navigate('/login');
    } catch (error) {
      message.error('Error al restablecer la contraseña');
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
          <Title level={4}>Confirmar cuenta y establecer contraseña</Title>
          <Form onFinish={handleReset} className="login-form">
            <Form.Item name="password" rules={[{ required: true, message: 'Introduce una nueva contraseña' }]}> 
              <Input.Password prefix={<LockOutlined />} placeholder="Nueva contraseña" size="large" value={password} onChange={(e) => setPassword(e.target.value)} />
            </Form.Item>
            <Form.Item name="confirmPassword" rules={[{ required: true, message: 'Confirma tu nueva contraseña' }]}> 
              <Input.Password prefix={<LockOutlined />} placeholder="Confirmar contraseña" size="large" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" className="login-button" size="large">Restablecer</Button>
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export { ResetPasswordForm, ConfirmAccountForm };
