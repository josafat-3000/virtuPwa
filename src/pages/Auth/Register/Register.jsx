// import React, { useEffect } from 'react';
// import { Form, Input, Button, Card, Typography, Row, Col } from 'antd';
// import { UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';
// import './Register.css';
// import logo from '../../../assets/virtu.png';
// import { useNavigate } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import { registerUser } from '../../../store/registerSlice.js';

// const { Title } = Typography;

// const RegisterForm = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const { loading, error, success } = useSelector((state) => state.register);

//   const [form] = Form.useForm();

//   useEffect(() => {
//     if (success) {
//       form.resetFields(); // Limpiar el formulario si el registro fue exitoso
//       navigate('/login'); // Redirigir después del registro exitoso
//     }
//   }, [success, navigate, form]);

//   const handleRegister = (values) => {
//     console.log(values)
//     dispatch(registerUser(values));
//   };

//   return (
//     <Row justify="center" align="middle" className="register-container">
//       <Col xs={22} sm={18} md={12} lg={10} xl={8}>
//         <Card className="register-card">
//           <div className="register-logo">
//             <img src={logo} alt="Logo" className="logo-image" />
//             <UserOutlined className="user-icon" />
//           </div>
//           <Title level={4} className="register-title">
//             Crear una Cuenta
//           </Title>
//           <Typography.Text className="register-title">
//             Por favor, completa los detalles para crear tu cuenta
//           </Typography.Text>
//           <Form
//             name="register"
//             form={form}
//             initialValues={{ remember: true }}
//             onFinish={handleRegister}
//             className="register-form"
//           >
//             <Form.Item
//               name="name"
//               rules={[{ required: true, message: 'Por favor, introduce tu nombre de usuario' }]}
//             >
//               <Input
//                 prefix={<UserOutlined />}
//                 placeholder="Nombre de Usuario"
//                 size="large"
//               />
//             </Form.Item>
//             <Form.Item
//               name="email"
//               rules={[{ required: true, type: 'email', message: 'Por favor, introduce un correo electrónico válido' }]}
//             >
//               <Input
//                 prefix={<MailOutlined />}
//                 placeholder="Correo Electrónico"
//                 size="large"
//               />
//             </Form.Item>
//             <Form.Item
//               name="password"
//               rules={[{ required: true, message: 'Por favor, introduce tu contraseña' }]}
//             >
//               <Input.Password
//                 prefix={<LockOutlined />}
//                 placeholder="Contraseña"
//                 size="large"
//               />
//             </Form.Item>
//             {error && (
//               <Typography.Text type="danger" className="register-error">
//                 {error}
//               </Typography.Text>
//             )}
//             {success && (
//               <Typography.Text type="success" className="register-success">
//                 {success}
//               </Typography.Text>
//             )}
//             <Form.Item>
//               <Button
//                 type="primary"
//                 htmlType="submit"
//                 className="register-button"
//                 size="large"
//                 loading={loading}
//               >
//                 {loading ? 'Registrando...' : 'Registrarse'}
//               </Button>
//             </Form.Item>
//           </Form>
//           <Typography.Text className="register-login">
//             ¿Ya tienes una cuenta? <a href="/login">Inicia sesión</a>
//           </Typography.Text>
//         </Card>
//       </Col>
//     </Row>
//   );
// };

// export default RegisterForm;
