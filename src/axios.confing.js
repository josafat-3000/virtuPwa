// src/axiosConfig.js
import axios from 'axios';
import { logoutUser, clearUser } from './store/userSlice'; // Ajusta el path a tu userSlice
import store from './store'; // Ajusta el path a tu store

// Configura el interceptor de Axios para detectar expiración de sesión
axios.interceptors.response.use(
  (response) => {
    return response; // Devuelve la respuesta normal si todo está bien
  },
  (error) => {
    console.log(error)
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Si obtenemos un error de autenticación, limpiar el estado y desloguear
      store.dispatch(logoutUser()); // Llamada a la acción de logout en Redux
      store.dispatch(clearUser());  // Limpia el estado del usuario en Redux
      sessionStorage.clear();       // Limpia el sessionStorage si es necesario
      //window.location.href = '/login'; // Redirige al login
    }
    return Promise.reject(error);
  }
);

export default axios;
