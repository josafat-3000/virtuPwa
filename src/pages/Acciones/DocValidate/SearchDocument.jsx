import React, { useState, useEffect } from 'react';
import { Modal, Form, Select, Spin } from 'antd';

const { Option } = Select;

const SearchDocumentForm = ({ open, onOk, onCancel, uploads, loading = false }) => {
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
  const formatVisitText = (upload) => {
    return `${upload.id}`
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
              const fullVisit = uploads.find(v => v.id === value);
              console.log('Visita seleccionada:', fullVisit);
              setSelectedVisit(fullVisit);
            }}
            loading={loading}
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {uploads?.map((upload) => (
              <Option 
                key={upload.id} 
                value={upload.id} // ← Solo pasamos el ID como valor
              >
                {formatVisitText(upload)}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default SearchDocumentForm;