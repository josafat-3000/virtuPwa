import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './pages/Auth/Login/Login'; // Asegúrate de que la ruta sea correcta
// import './App.css'; // Archivo de estilos globales, si tienes uno
import Dashboard from './pages/Dashboard/Dashboard';
import ProtectedRoute from "./components/Protected";
import MainLayout from './components/Layout/MainLayout/MainLayout';
import Registros from './pages/Registros/Registros';
import AccionsPage from './pages/Acciones/Acciones';
import ProfilePage from './pages/Profile/Profile';
import Configuracion from './pages/Configuracion/Configuracion';
import Forgot from './pages/Auth/ForgotPassword/Forgot';
const App = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            <ProtectedRoute redirectAuthenticatedTo="/">
              <LoginForm />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/forgot"
          element={
            <ProtectedRoute redirectAuthenticatedTo="/">
              <Forgot />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard></Dashboard>} />
          <Route path='/registros' element={<Registros></Registros>} />
          <Route path='/acciones' element={<AccionsPage />} />
          <Route path='/perfil' element={<ProfilePage></ProfilePage>} />
          <Route path='/configuracion' element={<Configuracion></Configuracion>} />

        </Route>
      </Routes>
    </Router>

  );
};

export default App;
