import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, message } from 'antd';
import { startRecording, startScan, stopScan, updateVisitStatus } from '../../store/scanSlice';
import { createVisit } from '../../store/createVisitSlice';
import { fetchAllVisits } from '../../store/allVisitSlice';
import FormModal from './Create/FormModal';
import QRModal from './Create/QRModal';
import ScanModal from './Validate/ScanModal';
import ActionsCard from './ActionsCard';
import SearchVisitForm from './SearchVisit';

const ActionsPage = () => {
  const role = useSelector((state) => state.user.user.role);
  const { visitas, loadingVisits } = useSelector((state) => state.allVisits);
  const [open, setOpen] = useState(false);
  const [openScan, setOpenScan] = useState(false);
  const [visit, setVisit] = useState(null);
  const [hasVehicle, setHasVehicle] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.createVisit);
  const { visitData } = useSelector((state) => state.scan);
  const [openSearch, setOpenSearch] = useState(false);
  const showModal = () => setOpen(true);

  const handleCreateVisit = async (values) => {
    try {
      const result = await dispatch(createVisit(values)).unwrap();
      if (result) {
        setVisit(result);
        setOpen(false);
        message.success('Visita creada exitosamente');
      }
    } catch (error) {
      message.error(error.message || 'Error al crear visita');
    }
  };
  const handleSelectVisit = (visit, action) => {
    if(action == 'modify'){
      setSelectedVisit(visit);
      setOpenModify(true);
    }
    else {
      setVisit(visit)
    }
  };
  useEffect(() => {
    setIsButtonDisabled(!visitData);
  }, [visitData]);

  const actions = [
    {
      title: 'Generar Nueva Visita',
      description: 'Crea un nuevo registro de visita.',
      icon: 'PlusOutlined',
      action: showModal,
    },
    {
      title: 'Regenerar QR',
      description: 'Regenera el código de acceso a una vsisita',
      icon: 'undoOutlined',
      action: () => {
        setOpenSearch(true);
        dispatch(fetchAllVisits());
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
    }] : []),
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