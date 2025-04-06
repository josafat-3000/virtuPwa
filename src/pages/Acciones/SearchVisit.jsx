import React, { useState, useEffect } from 'react';
import { Modal, Form, Select, Spin } from 'antd';

const { Option } = Select;

const SearchVisitForm = ({ open, onOk, onCancel, visits, loading = false }) => {
  const [form] = Form.useForm();
  const [selectedVisit, setSelectedVisit] = useState(null);

  useEffect(() => {
    if (open) {
      form.resetFields();
      setSelectedVisit(null);
    }
  }, [open, form]);

  const handleSubmit = async () => {
    try {
      await form.validateFields();
      onOk(selectedVisit);
    } catch (error) {
      console.error('Error al validar:', error);
    }
  };

  // Función para formatear el texto de visualización
  const formatVisitText = (visit) => {
    return `${visit.visitor_name || 'Sin nombre'} - ${
      visit.visit_reason || 'Sin motivo'
    } (${
      visit.visit_date 
        ? new Date(visit.visit_date).toLocaleDateString() 
        : 'Sin fecha'
    })`;
  };

  return (
    <Modal
      title="Seleccionar Visita"
      open={open}
      centered
      onOk={handleSubmit}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      okButtonProps={{ disabled: !selectedVisit }}
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="visit"
          label="Selecciona una visita"
          rules={[{ required: true, message: 'Debes seleccionar una visita' }]}
        >
          <Select
            placeholder={loading ? "Cargando visitas..." : "Selecciona una visita"}
            onChange={(value) => {
              // Encuentra la visita completa basada en el ID seleccionado
              const fullVisit = visits.find(v => v.id === value);
              setSelectedVisit(fullVisit);
            }}
            loading={loading}
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {visits?.map((visit) => (
              <Option 
                key={visit.id} 
                value={visit.id} // ← Solo pasamos el ID como valor
              >
                {formatVisitText(visit)}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default SearchVisitForm;