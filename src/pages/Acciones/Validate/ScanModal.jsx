import React from 'react';
import { Modal, Button } from 'antd';
import Validate from './ValidateModal';

const ScanModal = ({ open, onClose, onValidate, disabled, loading }) => (
  <Modal
    title="Escanear código QR"
    open={open}
    centered
    onCancel={onClose}
    footer={[
      <Button key="close" onClick={onClose}>Cerrar</Button>,
      <Button
        key="validate"
        type="primary"
        disabled={disabled}
        loading={loading}
        onClick={onValidate}
      >
        Validar
      </Button>
    ]}
  >
    <Validate />
  </Modal>
);

export default ScanModal;