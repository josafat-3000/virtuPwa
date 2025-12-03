import React, { useState, useEffect } from 'react';
import { Modal, Button, Spin, Image, Row, Col, Typography } from 'antd';
import axios from 'axios';

const { Title, Text } = Typography;

const ValidateDocumentsModal = ({ open, onClose, folderName, onValidate, visitInfo }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && folderName) {
      setLoading(true);
      axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/docs/${folderName}`)
        .then(res => setImages(res.data))
        .catch(() => setImages([]))
        .finally(() => setLoading(false));
    }
  }, [open, folderName]);

  return (
    <Modal
      title="Validar Documentos"
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancelar
        </Button>,
        <Button key="validate" type="primary" onClick={onValidate}>
          Validar
        </Button>,
      ]}
      width={800}
    >
      {visitInfo && (
        <div style={{ marginBottom: '16px', padding: '16px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
          <Title level={4} style={{ marginBottom: '16px' }}>Información de la Visita</Title>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              <tr>
                <td style={{ padding: '8px', fontWeight: 'bold', borderBottom: '1px solid #ddd' }}>Nombre:</td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{visitInfo.visitor_name}</td>
              </tr>
              <tr>
                <td style={{ padding: '8px', fontWeight: 'bold', borderBottom: '1px solid #ddd' }}>Razón:</td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{visitInfo.visit_reason}</td>
              </tr>
              <tr>
                <td style={{ padding: '8px', fontWeight: 'bold', borderBottom: '1px solid #ddd' }}>Fecha:</td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{new Date(visitInfo.visit_date).toLocaleString('es-ES', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
})}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {loading ? (
        <Spin />
      ) : (
        <Row gutter={[16, 16]}>
          {images.map((img, idx) => (
            <Col key={idx} span={12}>
              <Image src={img.base64} alt={img.name} width="100%" />
            </Col>
          ))}
        </Row>
      )}
    </Modal>
  );
};

export default ValidateDocumentsModal;
