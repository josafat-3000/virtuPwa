import React, { useState } from 'react';
import { Modal, Form, Input, Checkbox, message } from 'antd';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import TextField from '@mui/material/TextField';
import dayjs from 'dayjs';
import { useDispatch } from 'react-redux';
import { createVisit } from '../../store/createVisitSlice';

const VisitForm = ({ open, setOpen, setVisitId, loading }) => {
  const [form] = Form.useForm();
  const [hasVehicle, setHasVehicle] = useState(false);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const dispatch = useDispatch();

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const result = await dispatch(createVisit(values)).unwrap();
      if (result?.id) {
        setVisitId(result.id);
        setOpen(false);
        form.resetFields();
        message.success('Visita creada exitosamente');
      } else {
        message.error('Error: la visita creada no tiene un ID válido');
      }
    } catch {
      message.error('Error al crear visita');
    }
  };

  const handleCancel = () => {
    setOpen(false);
    form.resetFields();
    setHasVehicle(false);
  };

  return (
    <Modal
      title="Generar Nueva Visita"
      open={open}
      onOk={handleOk}
      confirmLoading={loading}
      onCancel={handleCancel}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="visitor_name" label="Nombre del Visitante" rules={[{ required: true }]}>
          <Input placeholder="Nombre del Visitante" />
        </Form.Item>
        {/* Otros campos */}
      </Form>
    </Modal>
  );
};

export default VisitForm;
