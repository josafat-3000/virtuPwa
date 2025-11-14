import React, { useState, useEffect } from 'react';
import { Modal, Input, Button, Spin, message } from 'antd';
import { CopyOutlined } from '@ant-design/icons';

const AccessLinkModal = ({ open, onOk, loading = false, generatedUrl }) => {
  const [url, setUrl] = useState('');

  useEffect(() => {
    if (open) {
      setUrl(generatedUrl || '');  // Usa la URL generada pasada como prop
    }
  }, [open, generatedUrl]);

  const handleCopy = () => {
    if (url) {
      navigator.clipboard.writeText(url);  // Copia la URL al portapapeles
      message.success('URL copiada al portapapeles');
    }
  };

  return (
    <Modal
      title="Link de Acceso Generado"
      open={open}
      centered
      onOk={onOk}
      onCancel={onOk}
      okButtonProps={{ disabled: !url }}
      destroyOnClose
      footer={[
        <Button 
          key="submit" 
          type="primary" 
          onClick={onOk} 
          disabled={loading || !url}
        >
          {loading ? <Spin size="small" /> : 'Aceptar'}
        </Button>,
      ]}
    >
      <div>
        <div style={{ marginBottom: 16 }}>
          <strong>URL de acceso:</strong>
        </div>
        <Input
          value={url}
          readOnly
          style={{ width: '100%', marginBottom: 16 }}
        />
        <Button 
          icon={<CopyOutlined />} 
          onClick={handleCopy} 
          disabled={!url}
        >
          Copiar URL
        </Button>
      </div>
    </Modal>
  );
};

export default AccessLinkModal;
