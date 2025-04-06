import React, { useState } from 'react';
import { Modal, Form, Input, Checkbox } from 'antd';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import TextField from '@mui/material/TextField';
import dayjs from 'dayjs';

const Generate = ({ open, onOk, onCancel, hasVehicle, setHasVehicle }) => {
  const [form] = Form.useForm();
  const [selectedDate, setSelectedDate] = useState(dayjs());

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onOk(values);
      form.resetFields();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  return (
    <Modal
      title="Generar Nueva Visita"
      open={open}
      centered
      onOk={handleSubmit}
      onCancel={onCancel}
      destroyOnClose
    >
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
      </Form>
    </Modal>
  );
};

export default Generate;