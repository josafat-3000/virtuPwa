import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, message } from 'antd';
import { startRecording, startScan, stopScan, updateVisitStatus } from '../../store/scanSlice';
import { fetchAllVisits } from '../../store/allVisitSlice';
import { fetchAllUploads } from '../../store/AllUploadsSlice'
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

const ActionsPage = () => {
  const dispatch = useDispatch();
  const role = useSelector((state) => state.user.user.role);
  const { visitas, loadingVisits } = useSelector((state) => state.allVisits);
  const { uploads, loadingUploads } = useSelector((state)=> state.allUploads)
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
    if (action == 'modify') {
      setSelectedVisit(visit);
      setOpenModify(true);
    }
    else {
      setVisit(visit)
    }
  };

  const handleSelectUpload = (upload) => {
    setUpload(upload.id)
    setOpenSearchDoc(false)
    setOpenDocValidate(true)
  };

  const handleEditVisit = async (data) => {
    try {
      console.log(data, 'vyvyvdata')
      // Verificar si la visita ya está en progreso (check-in realizado)
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

  const handleValidate = () => {
    console.log(upload)
    // Aquí manejas tu lógica de validación y llamada a la API
    console.log('Validando documento...');
    // Luego puedes cerrar el modal
    setOpenDocValidate(false);
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
        setOpenSearch(true);
        dispatch(fetchAllVisits());
      },
    },
    {
      title: 'Editar detalles de una visita',
      description: 'Modifica los detalles de un registro',
      icon: 'EditOutlined',
      action: () => {
        setOpenSearch(true);
      },
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
        onOk={handleSelectVisit}
        onCancel={() => setOpenSearch(false)}
        visits={visitas}
        loading={loadingVisits}
      />

      <SearchDocumentForm
        open={openSearchDoc}
        onOk={handleSelectUpload}
        onCancel={() => setOpenSearchDoc(false)}
        uploads={uploads}
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
        folderName={upload}
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
        onValidate={() => {
          if (visitData?.id) dispatch(updateVisitStatus({ id: visitData.id }));
          dispatch(stopScan());
          setOpenScan(false);
        }}
        disabled={isButtonDisabled}
        loading={loading}
      />
    </div>
  );
};

export default ActionsPage;