import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, message, notification } from 'antd';
import { startRecording, startScan, stopScan, updateVisitStatus } from '../../store/scanSlice';
import { fetchAllVisits } from '../../store/allVisitSlice';
import { fetchAllUploads } from '../../store/AllUploadsSlice';
import { patchVisitById } from '../../store/singleVisitSlice';
import { createVisit } from '../../store/createVisitSlice';
import FormModal from './Create/FormModal';
import QRModal from './Create/QRModal';
import ScanModal from './Validate/ScanModal';
import ActionsCard from './ActionsCard';
import SearchVisitForm from './SearchVisit';
import SearchDocumentForm from './DocValidate/SearchDocument';
import EditVisitForm from './Modify/ModifyModal';
import LinkModal from './LinkModal';
import DocumentValidationModal from './DocValidate/DocValidate';
import { fetchVisitLink } from '../../store/visitLinkSlice';
import axios from 'axios';

const ActionsPage = () => {
  const dispatch = useDispatch();
  const role = useSelector((state) => state.user.user.role);
  const { visitas, loadingVisits } = useSelector((state) => state.allVisits);
  const { uploads, loadingUploads } = useSelector((state) => state.allUploads);
  const filteredUploads = uploads.filter((upload) => upload.visit !== undefined && upload.visit !== null && !upload.visit.validated);
  const [open, setOpen] = useState(false);
  const [openScan, setOpenScan] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);
  const [openSearchDoc, setOpenSearchDoc] = useState(false);
  const [openModify, setOpenModify] = useState(false);
  const [openDocValidate, setOpenDocValidate] = useState(false);
  const [visit, setVisit] = useState(null);
  const [upload, setUpload] = useState(null);
  const [hasVehicle, setHasVehicle] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [openLinkModal, setOpenLinkModal] = useState(false);
  const { loading } = useSelector((state) => state.createVisit);
  const { visitData } = useSelector((state) => state.scan);
  const { link } = useSelector((state) => state.link);
  const [currentActionFlag, setCurrentActionFlag] = useState(null);


  // Cargar visitas al montar el componente
  useEffect(() => {
    dispatch(fetchAllVisits());
  }, [dispatch]);

  useEffect(() => {
    setIsButtonDisabled(!visitData);
  }, [visitData]);

  const handleCreateVisit = async (values) => {
    try {
      const result = await dispatch(createVisit(values)).unwrap();
      if (result) {
        setVisit(result);
        setOpen(false);
        message.success('Visita creada exitosamente');
        // Actualizar lista de visitas después de crear una nueva
        dispatch(fetchAllVisits());
      }
    } catch (error) {
      message.error(error.message || 'Error al crear visita');
    }
  };

  const handleSelectVisit = (visit, action) => {
    if (action === 'modify') {
      setSelectedVisit(visit);
      setOpenModify(true);
    } else if (action === 'regenerateQR') {
      setVisit(visit);
    }
  };

  const handleSelectUpload = (upload) => {
    setUpload(upload)
    setOpenSearchDoc(false)
    setOpenDocValidate(true)
  };

  const handleEditVisit = async (data) => {
    try {
      if (selectedVisit?.status === 'in_progress') {
        message.warning('No se puede editar una visita que ya ha realizado check-in');
        return;
      }

      // Verificar si la visita ya está completada
      if (selectedVisit?.status === 'completed') {
        message.warning('No se puede editar una visita ya completada');
        return;
      }

      // Despachar la acción para cargar los datos de la visita
      const result = await dispatch(patchVisitById({ id: selectedVisit?.id, values: data })).unwrap();

      if (result) {
        message.success('Datos de visita cargados correctamente');
      }

      setOpenModify(false);
      setOpenSearch(false)
    } catch (error) {
      console.error('Error al cargar visita:', error);
      message.error(error.message || 'Error al cargar los datos de la visita');
    }
  };

  const handleValidate = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/docs/validate/${upload.id}`);
      setVisit(upload.visit);
      setOpenDocValidate(false);
    } catch (error) {
      console.error('Validation failed:', error);
      message.error('Validation failed. Please try again.');
    }
  };

  const actions = [
    {
      title: 'Generar Nueva Visita',
      description: 'Crea un nuevo registro de visita.',
      icon: 'PlusOutlined',
      action: () => setOpen(true),
    },
    {
      title: 'Regenerar QR',
      description: 'Regenera el código de acceso a una visita',
      icon: 'undoOutlined',
      action: () => {
        setCurrentActionFlag('regenerateQR'); // Set the flag
        setOpenSearch(true);
        dispatch(fetchAllVisits());
      },
      flag: 'regenerateQR',
    },
    {
      title: 'Editar detalles de una visita',
      description: 'Modifica los detalles de un registro',
      icon: 'EditOutlined',
      action: () => {
        setCurrentActionFlag('modify'); // Set the flag
        setOpenSearch(true);
      },
      flag: 'modify',
    },
    ...(role != '2' ? [{
      title: 'Validar Visita',
      description: 'Verifica y confirma la visita.',
      icon: 'CheckCircleOutlined',
      action: () => {
        setOpenScan(true);
        dispatch(startScan());
        dispatch(startRecording());
      },
    },
    {
      title: 'Link de Visita',
      description: 'Crea un formulario de registro.',
      icon: 'PlusOutlined',
      action: () => {
        setOpenLinkModal(true)
        dispatch(fetchVisitLink())
      }
    },
    {
      title: 'Validación de documentos',
      description: 'Crea un formulario para la validación de documentos.',
      icon: 'PlusOutlined',
      action: () => {
        setOpenSearchDoc(true)
        dispatch(fetchAllUploads())
      }
    }
    ] : []),
  ];

  return (
    <div>
      <Row gutter={[16, 16]}>
        {actions.map((action, index) => (
          <Col xs={24} sm={12} md={12} lg={12} key={index}>
            <ActionsCard action={action} />
          </Col>
        ))}
      </Row>

      <FormModal
        open={open}
        onOk={handleCreateVisit}
        onCancel={() => setOpen(false)}
        hasVehicle={hasVehicle}
        setHasVehicle={setHasVehicle}
      />

      <SearchVisitForm
        open={openSearch}
        onOk={(visit) => {
          console.log(currentActionFlag); // Debugging
          handleSelectVisit(visit, currentActionFlag); // Use the dynamic flag
        }}
        onCancel={() => setOpenSearch(false)}
        visits={visitas}
        loading={loadingVisits}
      />

      <SearchDocumentForm
        open={openSearchDoc}
        onOk={handleSelectUpload}
        onCancel={() => setOpenSearchDoc(false)}
        uploads={filteredUploads}
        loading={loadingUploads}
      />

      <LinkModal
        open={openLinkModal}
        onOk={() => setOpenLinkModal(false)}
        generatedUrl={`${import.meta.env.VITE_FRONTEND_URL}/visit/${link}`}
      />

      <EditVisitForm
        open={openModify}
        onOk={handleEditVisit}
        onCancel={() => setOpenModify(false)}
        visit={selectedVisit}
      />

      <DocumentValidationModal
        open={openDocValidate}
        onClose={() => setOpenDocValidate(false)}
        onValidate={handleValidate}
        visitInfo={upload?.visit}
        folderName={upload?.id}
      />

      {visit && (
        <QRModal
          visit={visit}
          onClose={() => setVisit(null)}
          loading={loading}
        />
      )}

      <ScanModal
        open={openScan}
        onClose={() => {
          setOpenScan(false);
          dispatch(stopScan());
        }}
        onValidate={async () => {
          console.log('onValidate triggered, visitData:', visitData);
          if (!visitData?.id) {
            message.warning('Por favor escanea un código QR válido primero.');
            return;
          }

          // Dispatch and inspect the returned action to reliably handle both fulfilled and rejected
          dispatch(updateVisitStatus({ id: visitData.id }))
            .then((action) => {
              console.log('updateVisitStatus action:', action);
              // action may be {type: 'scan/updateVisitStatus/fulfilled', payload: ...}
              if (action && action.type && action.type.endsWith('/fulfilled')) {
                const res = action.payload;
                const msg = (res && (res.message || res.detail)) || 'Visita validada correctamente';
                notification.success({ message: 'Visita validada', description: msg, duration: 6 });
                dispatch(stopScan());
                setOpenScan(false);
              } else if (action) {
                // Rejected action
                const payload = action.payload || action.error || 'Error desconocido';
                const extractErrorMessage = (e) => {
                  if (!e) return 'Error desconocido';
                  if (typeof e === 'string') return e;
                  if (e.message) return e.message;
                  if (e.detail) return e.detail;
                  if (e.error) return (typeof e.error === 'string' ? e.error : e.error.message || JSON.stringify(e.error));
                  if (e.errors) return Array.isArray(e.errors) ? e.errors.map(x => x.message || x).join('; ') : JSON.stringify(e.errors);
                  try { return JSON.stringify(e); } catch(ex) { return String(e); }
                };
                const msg = extractErrorMessage(payload);
                console.error('Validation rejected payload:', payload);
                notification.error({ message: 'Error al validar visita', description: msg, duration: 0 });
              } else {
                // No action object returned — unexpected
                console.error('updateVisitStatus returned no action');
                notification.error({ message: 'Error al validar visita', description: 'Respuesta inesperada del servidor', duration: 0 });
              }
            })
            .catch((dispatchError) => {
              // Shouldn't normally reach here, but handle unexpected errors
              console.error('Dispatch failed:', dispatchError);
              const msg = (dispatchError && (dispatchError.message || String(dispatchError))) || 'Error desconocido';
              notification.error({ message: 'Error al validar visita', description: msg, duration: 0 });
            });
        }}
        disabled={isButtonDisabled}
        loading={loading}
      />
    </div>
  );
};

export default ActionsPage;