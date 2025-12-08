import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { notification } from 'antd';

// Definir la URL del backend
const url_visits = `${import.meta.env.VITE_BACKEND_URL}/api/v1/visits`;

// Acción asincrónica para verificar la visita
export const checkVisit = createAsyncThunk('scan/checkVisit', async (id, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${url_visits}/${id}`, { withCredentials: true });
    if (response.status === 200) {
      return response.data; // Asumiendo que quieres usar los datos para algo
    }
    throw new Error('Visita no encontrada');
  } catch (error) {
    console.log(error)
    return rejectWithValue(error.response ? error.response.data : error.message);
  }
});

// Acción asincrónica para actualizar el estado de la visita
export const updateVisitStatus = createAsyncThunk('scan/updateVisitStatus', async ({id}, { rejectWithValue }) => {
  try {
    const response = await axios.patch(`${url_visits}/${id}`,null,{ withCredentials: true });
    if (response.status === 200) {
      return response.data;
    }
    throw new Error('Error al actualizar el estado de la visita');
  } catch (error) {
    // Detailed logging to help debug why frontend doesn't receive the backend error
    console.error('updateVisitStatus - caught error:', {
      message: error.message,
      responseData: error.response ? error.response.data : undefined,
      status: error.response ? error.response.status : undefined,
      full: error,
    });
    const payload = error.response ? error.response.data : { message: error.message || 'Error desconocido' };
    return rejectWithValue(payload);
  }
});

const scanSlice = createSlice({
  name: 'scan',
  initialState: {
    isScanning: false,
    isRecording: false, // Añadido para el estado de grabación
    scanResult: null,
    loading: false,
    error: null,
    visitData: null, // Para almacenar la visita después de la verificación
  },
  reducers: {
    startScan: (state) => {
      state.isScanning = true;
      state.scanResult = null;
      state.error = null;
    },
    stopScan: (state) => {
      state.isScanning = false;
    },
    startRecording: (state) => {
      state.isRecording = true;
    },
    stopRecording: (state) => {
      state.isRecording = false;
    },
    setScanResult: (state, action) => {
      state.scanResult = action.payload;
    },
    cleanScan(state) {
      // Limpiar el estado del escaneo
      state.scanResult = null;
      state.visitData = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkVisit.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkVisit.fulfilled, (state, action) => {
        state.loading = false;
        state.visitData = action.payload;
      })
      .addCase(checkVisit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateVisitStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateVisitStatus.fulfilled, (state, action) => {
        state.loading = false;
            // Optionally update visitData with response
            if (action.payload) state.visitData = action.payload;
            // Show success notification (in case component handler didn't run)
            try {
              const msg = (action.payload && (action.payload.message || action.payload.detail)) || 'Visita validada correctamente';
              notification.success({ message: 'Visita validada', description: msg, duration: 6 });
            } catch (e) {
              // ignore
            }
      })
      .addCase(updateVisitStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
            // Show detailed backend error as notification (fallback if component doesn't show it)
            try {
              const err = action.payload || action.error || 'Error desconocido';
              const extractErrorMessage = (e) => {
                if (!e) return 'Error desconocido';
                if (typeof e === 'string') return e;
                if (e.message) return e.message;
                if (e.detail) return e.detail;
                if (e.error) return (typeof e.error === 'string' ? e.error : e.error.message || JSON.stringify(e.error));
                if (e.errors) return Array.isArray(e.errors) ? e.errors.map(x => x.message || x).join('; ') : JSON.stringify(e.errors);
                try { return JSON.stringify(e); } catch(ex) { return String(e); }
              };
              const errStr = extractErrorMessage(err);
              notification.error({ message: 'Error al validar visita', description: errStr, duration: 0 });
            } catch (e) {
              // ignore
            }
      });
  },
});

// Exportar las acciones y el reducer
export const { startScan, stopScan, startRecording, stopRecording, setScanResult, cleanScan } = scanSlice.actions;
export default scanSlice.reducer;
