import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Checkbox } from 'antd';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import TextField from '@mui/material/TextField';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';

const EditVisitForm = ({ open, onOk, onCancel, visit }) => {
  const [form] = Form.useForm();
  const loading = useSelector((state) => state.visits.loading);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [hasVehicle, setHasVehicle] = useState(false);

  // Precargar el formulario cuando hay datos
  useEffect(() => {
    if (visit && open) {
      form.setFieldsValue({
        visitor_name: visit.visitor_name,
        visitor_company: visit.visitor_company,
        visit_reason: visit.visit_reason,
        visit_material: visit.visit_material,
        vehicle: visit.vehicle,
        vehicle_model: visit.vehicle_model,
        vehicle_plate: visit.vehicle_plate,
        visit_date: dayjs(visit.visit_date),
      });
      setHasVehicle(visit.vehicle);
    }
  }, [visit, open, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onOk(values);  // Pasar los datos del formulario a la función padre
    } catch (error) {
      console.error('Error de validación:', error);
    }
  };

  return (
    <Modal
      title="Editar Visita"
      open={open}
      onOk={handleSubmit}
      onCancel={onCancel}
      width={700}
      destroyOnClose

    >
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <Form form={form} layout="vertical">
          <Form.Item name="visitor_name" label="Nombre del Visitante" rules={[{ required: true }]}>
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
            <Checkbox onChange={(e) => setHasVehicle(e.target.checked)}>¿Trae Vehículo?</Checkbox>
          </Form.Item>

          {hasVehicle && (
            <>
              <Form.Item name="vehicle_model" label="Modelo del Vehículo" rules={[{ required: true }]}>
                <Input />
              </Form.Item>

              <Form.Item name="vehicle_plate" label="Placa del Vehículo" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </>
          )}

          <Form.Item name="visit_date" label="Fecha de la Visita" rules={[{ required: true }]}>
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
      )}
    </Modal>
  );
};

export default EditVisitForm;