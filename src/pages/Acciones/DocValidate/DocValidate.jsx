import React, { useState, useEffect } from 'react';
import { Modal, Button, Spin, Image, Row, Col } from 'antd';

const ValidateDocumentsModal = ({ open, onClose, folderName, onValidate }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log(folderName)
    if (open && folderName) {
      setLoading(true);
      fetch(`http://localhost:3000/api/v1/docs/${folderName}`)
        .then(res => res.json())
        .then(data => setImages(data))
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
