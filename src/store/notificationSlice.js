import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Estado inicial
const initialState = {
  notifications: [], // Notificaciones obtenidas
  loading: false, // Estado de carga
  error: null, // Error en caso de fallo
};

// Thunk para obtener las notificaciones desde el servidor
export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications', 
  async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/notifications`,{ withCredentials: true }); // Endpoint para obtener las notificaciones
      return response.data; // Devolver las notificaciones desde la respuesta
    } catch (error) {
      console.error('Error al obtener las notificaciones:', error);
      throw new Error('Error al obtener las notificaciones'); // Lanza el error para manejarlo en el extraReducers
    }
  }
);

// Thunk para enviar una nueva notificación al servidor
export const sendNotification = createAsyncThunk(
  'notifications/sendNotification',
  async (message) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/notifications`, { message },{ withCredentials: true }); // Enviar la notificación al servidor
      return response.data; // Devolver la respuesta si es necesario
    } catch (error) {
      console.error('Error al enviar la notificación:', error);
      throw new Error('Error al enviar la notificación'); // Lanza el error para manejarlo en el extraReducers
    }
  }
);

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    // Acción local para agregar una notificación (si la notificación ya está disponible localmente)
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload); // Añadir notificación al inicio
    },
  },
  extraReducers: (builder) => {
    // Gestionar el estado del thunk `fetchNotifications`
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true; // Cambia el estado a cargando cuando se comienza a obtener las notificaciones
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false; // Deja de cargar cuando las notificaciones se obtienen correctamente
        state.notifications = action.payload; // Guarda las notificaciones obtenidas desde el servidor
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false; // Deja de cargar si ocurre un error
        state.error = action.error.message; // Guarda el error
      });

    // Gestionar el estado del thunk `sendNotification`
    builder
      .addCase(sendNotification.pending, (state) => {
        state.loading = true; // Cambia el estado a cargando cuando se comienza a enviar la notificación
      })
      .addCase(sendNotification.fulfilled, (state, action) => {
        state.loading = false; // Deja de cargar cuando la notificación se envía correctamente
        // Puedes hacer algo con la respuesta si es necesario
      })
      .addCase(sendNotification.rejected, (state, action) => {
        state.loading = false; // Deja de cargar si ocurre un error
        state.error = action.error.message; // Guarda el error
      });
  },
});

export const { addNotification } = notificationsSlice.actions;

// Exportar los thunks (solo se exportan aquí una vez)


// Exportar el reducer para agregarlo al store
export default notificationsSlice.reducer;
