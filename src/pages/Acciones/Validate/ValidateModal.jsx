import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Card, Row, Col, Spin, Alert, Tag} from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { BrowserMultiFormatReader } from '@zxing/library';
import { setScanResult, checkVisit, cleanScan, stopRecording, startRecording } from '../../../store/scanSlice';
import 'antd/dist/reset.css';
import './Validate.css';

import { Form, Input, Button } from 'antd';

function Validate() {
  const dispatch = useDispatch();
  const isScanning = useSelector((state) => state.scan.isScanning);
  const isRecording = useSelector((state) => state.scan.isRecording);
  const scanResult = useSelector((state) => state.scan.scanResult);
  const loading = useSelector((state) => state.scan.loading);
  const error = useSelector((state) => state.scan.error);
  const visitData = useSelector((state) => state.scan.visitData);

  const [codeReader, setCodeReader] = useState(null);
  const [alertInfo, setAlertInfo] = useState({ message: '', type: '', visible: false });
  useEffect(() => {
    if (isRecording && isScanning) {
      if (!codeReader) {
        const reader = new BrowserMultiFormatReader();
        setCodeReader(reader);
      }
      handleScan();
    } else {
      handleStopScan();
    }

    return () => {
      handleStopScan();
    };
  }, [isRecording, isScanning, codeReader]);

  useEffect(() => {
    if (scanResult) {
      dispatch(checkVisit(scanResult)).then(({ payload }) => {
        dispatch(stopRecording());
        if (payload.status==='completed') {
          setAlertInfo({
          message: 'Error al validar información, visita completada previamente.',
          type: 'error',
          visible: true,
        });
        }
      });
    }
  }, [scanResult]);

  useEffect(() => {
    if (!isScanning) {
      dispatch(cleanScan());
      handleStopScan();
    }
  }, [isScanning]);

  const handleScan = () => {
    if (codeReader) {
      codeReader.decodeFromVideoDevice(null, 'video', (result, error) => {
        if (result) {
          dispatch(setScanResult(result.text));
        }
        if (error) {
          console.log(error);
        }
      });
    }
  };

  const handleStopScan = () => {
    if (codeReader) {
      codeReader.reset();
      setCodeReader(null);
      console.log("Escaneo detenido y video parado");
    }
  };

  // Función para obtener el color según el estado
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'orange'; // Naranja para "Pendiente"
      case 'in_progress':
        return 'blue'; // Azul para "En Progreso"
      case 'completed':
        return 'green'; // Verde para "Completado"
      default:
        return 'gray'; // Gris para el caso por defecto
    }
  };
const closeAlert = () => setAlertInfo({ ...alertInfo, visible: false });
return (
    <>
      {isScanning && isRecording && (
        <>
          <div className="scanner-container">
            <video id="video" className="scanner" />
            <div className="corner top-left" />
            <div className="corner top-right" />
            <div className="corner bottom-left" />
            <div className="corner bottom-right" />
            <div className="scan-line" />
          </div>
          <Spin style={{ marginTop: '20px' }} indicator={<LoadingOutlined spin />} size="large" />
        </>
      )}

      {scanResult && (
        <div style={{ marginTop: "20px" }}>
          <strong>Resultado:</strong> {scanResult}
        </div>
      )}

      {error && (
        <Alert message="Error" description={error?.message || 'Error desconocido'} type="error" showIcon />
      )}

      {visitData && (
        <div style={{ marginTop: "20px", maxWidth: '100%', overflowX: 'auto' }}>
          <Card
            style={{
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              borderRadius: '8px',
              backgroundColor: '#fff',
              padding: '20px'
            }}
            title={`Visita ID: ${visitData.id}`}
          >
            <Form layout="vertical">
              <Row gutter={[16, 16]}>
                {/* Columna para los campos y sus valores */}
                <Col span={10}>
                  <strong>Nombre del Visitante:</strong>
                </Col>
                <Col span={14}>
                  <Input value={visitData.visitor_name} readOnly />
                </Col>
                <Col span={10}>
                  <strong>Empresa:</strong>
                </Col>
                <Col span={14}>
                  <Input value={visitData.visitor_company} readOnly />
                </Col>
                <Col span={10}>
                  <strong>Razón de la Visita:</strong>
                </Col>
                <Col span={14}>
                  <Input value={visitData.visit_reason} readOnly />
                </Col>
                <Col span={10}>
                  <strong>Estado:</strong>
                </Col>
                <Col span={14}>
                  <Tag color={getStatusColor(visitData.status)}>
                    {visitData.status === 'pending' ? 'Pendiente' :
                     visitData.status === 'in_progress' ? 'En Progreso' :
                     'Completado'}
                  </Tag>
                </Col>
                <Col span={10}>
                  <strong>Fecha de la Visita:</strong>
                </Col>
                <Col span={14}>
                  <Input value={new Date(visitData.visit_date).toLocaleString()} readOnly />
                </Col>
              </Row>
            </Form>
          </Card>
        </div>
        
      )}
      {alertInfo.visible && (
        <Alert
          message={alertInfo.message}
          type={alertInfo.type}
          closable
          onClose={closeAlert}
          style={{ marginBottom: '16px' }}
        />
      )}
    </>
  );
}

export default Validate;