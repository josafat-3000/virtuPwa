import React, { useState, useRef,useEffect } from 'react';
import { QRCode, Card, Button, Row, Col, Modal, Form, Input, Checkbox, message } from 'antd';
import Validate from './Validate/ValidateModal';
import { useDispatch, useSelector } from 'react-redux';
import { startRecording, startScan, stopScan, updateVisitStatus } from '../../store/scanSlice';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import TextField from '@mui/material/TextField';
import dayjs from 'dayjs';

import {
  PlusOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { createVisit } from '../../store/createVisitSlice';  // Ajusta el path correctamente

const ActionsPage = () => {
  const [open, setOpen] = useState(false);
  const [openScan, setOpenScan] = useState(false);
  const [visitId, setVisitId] = useState(null);
  const [form] = Form.useForm();
  const [hasVehicle, setHasVehicle] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const dispatch = useDispatch();
  const qrRef = useRef();
  const [selectedDate, setSelectedDate] = useState(dayjs());

  async function handleShare() {
    try {
      const originalCanvas = qrRef.current.querySelector("canvas");
      const margin = 20; // Ajusta el tamaño del margen
      const width = originalCanvas.width + margin * 2; // Ancho total con margen
      const height = originalCanvas.height + margin * 2; // Alto total con margen
  
      // Crear un nuevo canvas
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext("2d");
  
      // Llenar el fondo del nuevo canvas
      context.fillStyle = "white"; // Color de fondo
      context.fillRect(0, 0, width, height);
  
      // Dibujar el canvas original en el nuevo canvas con margen
      context.drawImage(originalCanvas, margin, margin);
  
      // Obtener la URL de la imagen del nuevo canvas
      const qrImageURL = canvas.toDataURL("image/png");
  
      if (navigator.share) {
        await navigator.share({
          title: 'Código QR',
          text: 'Mira este código QR generado:',
          files: [
            new File([await (await fetch(qrImageURL)).blob()], 'qr-code.png', { type: 'image/png' })
          ],
        });
        console.log('Compartido exitosamente');
      } else {
        console.log('Web Share API no soportada en este navegador.');
      }
    } catch (error) {
      console.error('Error al compartir:', error);
    }
  }
  
  function doDownload(url, fileName) {
    const a = document.createElement('a');
    a.download = fileName;
    a.href = url;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
  
  // Función para descargar el código QR desde el canvas
  const downloadCanvasQRCode = () => {
    const originalCanvas = document.getElementById('myqrcode')?.querySelector('canvas');
    if (originalCanvas) {
      const margin = 20; // Ajusta el tamaño del margen
      const width = originalCanvas.width + margin * 2; // Ancho total con margen
      const height = originalCanvas.height + margin * 2; // Alto total con margen
  
      // Crear un nuevo canvas
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext('2d');
  
      // Llenar el fondo del nuevo canvas
      context.fillStyle = 'white'; // Color de fondo
      context.fillRect(0, 0, width, height);
  
      // Dibujar el canvas original en el nuevo canvas con margen
      context.drawImage(originalCanvas, margin, margin);
  
      const url = canvas.toDataURL();
      doDownload(url, 'QRCode.png');
    } else {
      console.error('No se pudo encontrar el canvas del código QR.');
    }
  };
  const { loading, visit } = useSelector((state) => state.createVisit);
  const { visitData } = useSelector((state) => state.scan);


  const showModal = () => {
    setOpen(true);
  };

  const handleOk = async () => {
    try {
        const values = await form.validateFields(); // Obtener los datos del formulario
        
        // Despachar la acción de crear visita y capturar el resultado
        const result = await dispatch(createVisit(values)).unwrap();
        
        // Asegúrate de que el resultado tenga un id válido
        if (result && result.id) {
            setVisitId(result.id); // Usa el id del resultado
            setOpen(false);
            form.resetFields();  // Resetear formulario tras éxito
            message.success('Visita creada exitosamente');
        } else {
            message.error('Error: la visita creada no tiene un ID válido');
        }
        
    } catch (error) {
        console.error('Error al crear visita:', error);
        message.error('Error al crear visita');
    }
};


  const handleCancel = () => {
    setOpen(false);
    form.resetFields();
    setHasVehicle(false);
  };

  const handleVehicleChange = (e) => {
    setHasVehicle(e.target.checked);
  };



  const actions = [
    {
      title: 'Generar Nueva Visita',
      description: 'Crea un nuevo registro de visita.',
      icon: <PlusOutlined />,
      action: () => showModal(),
    },
    {
      title: 'Validar Visita',
      description: 'Verifica y confirma la visita.',
      icon: <CheckCircleOutlined />,
      action: () => {
        setOpenScan(true);
        dispatch(startScan());
        dispatch(startRecording());
      },
    }
  ];
  // Efecto para habilitar o deshabilitar el botón cuando cambia el estado de visitData
  useEffect(() => {
    if (visitData) {
      setIsButtonDisabled(false);  // Habilitar el botón si visitData.visitData está definido
    } else {
      setIsButtonDisabled(true);   // Deshabilitar si no está definido
    }
  }, [visitData]); // Monitorea los cambios en visitData
  return (
    <div style={{ padding: '24px' }}>
      <Row gutter={[16, 16]}>
        {actions.map((action, index) => (
          <Col
            xs={24}
            sm={12}
            md={12}
            lg={12}
            key={index}
          >
            <Card
              title={action.title}
              bordered={false}
              style={{
                textAlign: 'center',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                maxWidth: '600px',
                margin: '0 auto',
                padding: '16px',
              }}
            >
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div style={{ marginBottom: '16px' }}>
                  {action.description}
                </div>
                <Button
                  type="primary"
                  onClick={action.action}
                  icon={action.icon}
                  style={{ width: '100%', marginTop: 'auto' }}
                >
                  {action.title}
                </Button>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
      <Modal
        title="Generar Nueva Visita"
        open={open}
        centered
        onOk={handleOk}
        confirmLoading={loading} // Indicador de carga en el botón
        onCancel={handleCancel}
      >
        <Form
          form={form}
          layout="vertical"
          name="visitForm"
          initialValues={{
            vehicle: false,
            status: 'pending',
          }}
        >
          <Form.Item
            name="visitor_name"
            label="Nombre del Visitante"
            rules={[{ required: true, message: 'Por favor, introduce el nombre del visitante' }]}
          >
            <Input placeholder="Nombre del Visitante" />
          </Form.Item>

          <Form.Item
            name="visitor_company"
            label="Compañía del Visitante"
          >
            <Input placeholder="Compañía del Visitante" />
          </Form.Item>

          <Form.Item
            name="visit_reason"
            label="Motivo de la Visita"
          >
            <Input placeholder="Motivo de la Visita" />
          </Form.Item>

          <Form.Item
            name="visit_material"
            label="Materiales de la Visita"
          >
            <Input placeholder="Materiales de la Visita" />
          </Form.Item>

          <Form.Item
            name="vehicle"
            valuePropName="checked"
            label="¿Trae Vehículo?"
          >
            <Checkbox onChange={handleVehicleChange}>¿Trae Vehículo?</Checkbox>
          </Form.Item>

          {hasVehicle && (
            <>
              <Form.Item
                name="vehicle_model"
                label="Modelo del Vehículo"
                rules={[{ required: hasVehicle, message: 'Por favor, introduce el modelo del vehículo' }]}
              >
                <Input placeholder="Modelo del Vehículo" />
              </Form.Item>

              <Form.Item
                name="vehicle_plate"
                label="Placa del Vehículo"
                rules={[{ required: hasVehicle, message: 'Por favor, introduce la placa del vehículo' }]}
              >
                <Input placeholder="Placa del Vehículo" />
              </Form.Item>
            </>
          )}

          <Form.Item
            name="visit_date"
            label="Fecha de la Visita"
            rules={[{ required: true, message: 'Por favor, selecciona la fecha de la visita' }]}
          >
            <LocalizationProvider dateAdapter={AdapterDayjs}>
           <DateTimePicker
        label="Fecha y hora"
        value={selectedDate}
        onChange={setSelectedDate}
        renderInput={(params) => <TextField {...params} />}
      />
      </LocalizationProvider>
          </Form.Item>
        </Form>
      </Modal>
      {visitId && (
        <Modal
          title="Código QR de la Visita"
          open={visitId !== null}
          centered
          onCancel={() => setVisitId(null)}
          footer={[
            <Button key="close" onClick={() => setVisitId(null)}>
              Cerrar
            </Button>,
            <Button key="share" type="primary" loading={loading} onClick={handleShare}>
              Compartir
            </Button>,
            <Button key="donwload" type="primary" loading={loading} onClick={downloadCanvasQRCode}>
              Descargar
            </Button>
          ]}

        >
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '200px', // O ajusta la altura según necesites
            textAlign: 'center',
            padding: '50px',
            backgroundColor: 'white'
          }}
            ref={qrRef}>
            <QRCode style={{margin:'20px',padding:'10px'}}id="myqrcode" value={visitId.toString()} />  {/* Render the QR code with the visit ID */}
          </div>

        </Modal>
      )}

      <Modal
        title="Escanear código QR"
        open={openScan}
        centered
        onCancel={() => {
          setOpenScan(false);
          dispatch(stopScan());}}
        confirmLoading={loading} // Indicador de carga en el botón
        footer={[
          <Button key="close" onClick={() => {
            setOpenScan(false);
            dispatch(stopScan());
          }}>
            Cerrar
          </Button>,
          <Button key="validate" type="primary" disabled={isButtonDisabled}  // Usa el estado para habilitar o deshabilitar el botón
            onClick={() => {
              if (visitData && visitData.id) {
                dispatch(updateVisitStatus({ id: visitData.id }));
              }
              dispatch(stopScan());
              setOpenScan(false);
            }}
          >
            Validar
          </Button>,
        ]}
      >
        <Validate />
      </Modal>

    </div>
  );
};

export default ActionsPage;
