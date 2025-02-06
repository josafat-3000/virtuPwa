import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const url_register = `${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/register`;

// **Thunk para registrar un solo usuario**
export const registerUser = createAsyncThunk(
  "user/register",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(url_register, data, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error desconocido");
    }
  }
);

// **Thunk para registrar múltiples usuarios**
export const registerUsersBulk = createAsyncThunk(
  "user/registerBulk",
  async (usersData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${url_register}/bulk`, usersData, {
        withCredentials: true,
      });
      return response.data; // Suponemos que el backend devuelve la lista de usuarios registrados
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error en el registro masivo");
    }
  }
);

// **Slice para manejar el estado del registro**
const registerSlice = createSlice({
  name: "register",
  initialState: {
    loading: false,
    error: null,
    success: null,
    users: [], // Lista de usuarios registrados (para registro masivo)
  },
  reducers: {},

  extraReducers: (builder) => {
    builder
      // **Registro Individual**
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.success =
          "Registro exitoso. Por favor, revisa tu correo electrónico para la confirmación.";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Error en el registro. Por favor, intenta nuevamente.";
      })

      // **Registro Masivo**
      .addCase(registerUsersBulk.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(registerUsersBulk.fulfilled, (state, action) => {
        state.loading = false;
        state.success = "Usuarios registrados exitosamente.";
      })
      .addCase(registerUsersBulk.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Error en el registro masivo. Intenta nuevamente.";
      });
  },
});

export default registerSlice.reducer;
