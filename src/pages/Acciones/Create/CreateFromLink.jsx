import React, { useState } from 'react';
import { useParams } from 'react-router-dom'; // Importa useParams
import { Form, Input, Button, Card, Typography, Row, Col, Checkbox, message } from 'antd';
import { useDispatch } from 'react-redux';
import { CalendarOutlined } from '@ant-design/icons';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import logo from '../../../assets/virtu.png';
import TextField from '@mui/material/TextField';
import dayjs from 'dayjs';
import QRModal from './QRModal'; // Importar el mismo QRModal que usa ActionsPage
import { createVisit } from '../../../store/createFromLinkSlice';
import './Register.css';

const { Title, Text } = Typography;

const RegisterForm = () => {
	const { token } = useParams(); // Extrae el token de la URL
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [visit, setVisit] = useState(null);
  const [hasVehicle, setHasVehicle] = useState(false);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      const result = await dispatch(createVisit({values,token})).unwrap();
      if (result) {
        setVisit(result.data.visit);
        message.success('Visita creada exitosamente');
				console.log(visit)
      }
    } catch (error) {
      message.error(error.message || 'Error al crear visita');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Row justify="center" align="middle" className="register-container">
        <Col xs={22} sm={18} md={12} lg={10} xl={8}>
          <Card className="register-card">
            <div className="register-logo">
              <img src={logo} alt="Logo" className="logo-image" />
              <CalendarOutlined className="user-icon" />
            </div>
            <Title level={4} className="register-title">
              Formulario de visita
            </Title>
            <Text className="register-title">
              Por favor, completa los detalles para validar tu información
            </Text>

            <Form form={form} layout="vertical" initialValues={{ vehicle: false }}>
              <Form.Item
                name="visitor_name"
                label="Nombre del Visitante"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>

              <Form.Item name="visitor_company" label="Compañía del Visitante">
                <Input />
              </Form.Item>

              <Form.Item name="visit_reason" label="Motivo de la Visita">
                <Input />
              </Form.Item>

              <Form.Item name="visit_material" label="Materiales de la Visita">
                <Input />
              </Form.Item>

              <Form.Item name="vehicle" valuePropName="checked">
                <Checkbox onChange={(e) => setHasVehicle(e.target.checked)}>
                  ¿Trae Vehículo?
                </Checkbox>
              </Form.Item>

              {hasVehicle && (
                <>
                  <Form.Item
                    name="vehicle_model"
                    label="Modelo del Vehículo"
                    rules={[{ required: true }]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    name="vehicle_plate"
                    label="Placa del Vehículo"
                    rules={[{ required: true }]}
                  >
                    <Input />
                  </Form.Item>
                </>
              )}

              <Form.Item
                name="visit_date"
                label="Fecha de la Visita"
                rules={[{ required: true }]}
              >
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    label="Fecha y hora"
                    value={selectedDate}
                    onChange={(newValue) => {
                      setSelectedDate(newValue);
                      form.setFieldsValue({ visit_date: newValue });
                    }}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
              </Form.Item>
              
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="register-button"
                  size="large"
                  loading={loading}
                  onClick={handleRegister}
                >
                  Registrarse
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>

      {/* Modal QR - Igual que en ActionsPage */}
      {visit && (
        <QRModal
          visit={visit}
          onClose={() => {
            setVisit(null);
            form.resetFields();
            setSelectedDate(dayjs());
            setHasVehicle(false);
          }}
          loading={loading}
        />
      )}
    </>
  );
};

export default RegisterForm;