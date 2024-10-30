import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Table, Spin, Alert } from 'antd';
import {LoadingOutlined} from '@ant-design/icons';
import { BrowserMultiFormatReader } from '@zxing/library';
import { setScanResult, checkVisit, cleanScan, stopRecording, startRecording } from '../../../store/scanSlice';
import 'antd/dist/reset.css';
import './Validate.css';

function Validate() {
  const dispatch = useDispatch();
  const isScanning = useSelector((state) => state.scan.isScanning);
  const isRecording = useSelector((state) => state.scan.isRecording);
  const scanResult = useSelector((state) => state.scan.scanResult);
  const loading = useSelector((state) => state.scan.loading);
  const error = useSelector((state) => state.scan.error);
  const visitData = useSelector((state) => state.scan.visitData);

  const [codeReader, setCodeReader] = useState(null);

  // Efecto para inicializar y reiniciar el lector QR
  useEffect(() => {
    if (isRecording&&isScanning) {
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
  }, [isRecording,isScanning ,codeReader]);

  // Efecto para manejar el resultado del escaneo
  useEffect(() => {
    if (scanResult) {
      dispatch(checkVisit(scanResult)).then(({ payload }) => {
        dispatch(stopRecording());
        if (payload) {
          // Aquí puedes actualizar el estado de la visita
        }
      });
    }
  }, [scanResult]);

  // Efecto para limpiar los datos cuando el modal se cierra
  useEffect(() => {
    if (!isScanning) {
      dispatch(cleanScan());
      handleStopScan();
    }
  }, [isScanning]);

  // Reinicia el escáner
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

  // Detiene el escaneo y limpia el lector
  const handleStopScan = () => {
    if (codeReader) {
      codeReader.reset();
      setCodeReader(null);  // Reinicia el lector al cerrarse el modal
      console.log("Escaneo detenido y video parado");
    }
  };

  // Definición de columnas para la tabla
  const columns = [
    {
      title: 'ID de Visita',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Nombre del Visitante',
      dataIndex: 'visitor_name',
      key: 'visitor_name',
    },
    {
      title: 'Compañía',
      dataIndex: 'visitor_company',
      key: 'visitor_company',
    },
    {
      title: 'Razón de la Visita',
      dataIndex: 'visit_reason',
      key: 'visit_reason',
    },
    {
      title: 'Estado',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Fecha de Visita',
      dataIndex: 'visit_date',
      key: 'visit_date',
    },
  ];

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
            <div className="scan-line" /> {/* Línea animada */}
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
          <Table
            dataSource={[visitData]} // Asegúrate de que visitData sea un objeto; lo envolvemos en un array
            columns={columns}
            rowKey="id" // Si tienes un ID único, úsalo como key
            pagination={false} // Desactiva la paginación si solo es una fila
            scroll={{ x: 'max-content' }} // Ajusta el contenido horizontalmente y permite desplazamiento vertical
            style={{
              backgroundColor: '#f0f2f5',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              minWidth: '100%', // Asegúrate de que la tabla ocupe el ancho del contenedor
            }}
          />
        </div>
      )}
    </>
  );
}

export default Validate;
