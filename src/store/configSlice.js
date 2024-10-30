// usersSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const urlBase = `${import.meta.env.VITE_BACKEND_URL}/api/v1/user`;

// Thunk para eliminar usuario
export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${urlBase}/${id}`, {
        withCredentials: true,
      });
      return { id, message: response.data.message }; // Devolver el ID del usuario eliminado y mensaje
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error desconocido'); // Asegurarse de que se maneje un error desconocido
    }
  }
);
// Thunk para obtener todos los usuarios (solo para Administradores)
export const fetchAllUsers = createAsyncThunk(
  "users/fetchAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${urlBase}/all`, { withCredentials: true });
      return response.data; // Devolver la lista de usuarios
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchUser = createAsyncThunk(
  "users/fetchUsers",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${urlBase}/profile`, { withCredentials: true });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateUser = createAsyncThunk(
  "users/updateUser",
  async ({ id, data }, { rejectWithValue }) => {
    console.log(data)
    try {
      const endpoint = `${urlBase}/${id}`;
      const response = await axios.patch(endpoint, data, { withCredentials: true });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);


const configSlice = createSlice({
  name: "config",
  initialState: {
    users: [],
    user: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch All Users (Admin)
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload; // Asignar todos los usuarios al estado
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Error al obtener los usuarios';
      })

      // Fetch Single User or All Users based on Role
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        if (action.meta.arg === 'Admin') {
          state.users = action.payload;
        } else {
          state.user = action.payload;
        }
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Error al obtener datos';
      })

      // Update User
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        if (action.meta.arg.id) {
          state.users = state.users.map(user => user.id === action.meta.arg.id ? action.payload : user);
        } else {
          state.user = action.payload;
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Error al actualizar datos';
      })

      // Delete User
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter(user => user.id !== action.payload.id);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Error al eliminar usuario';
      });
  },
});

export default configSlice.reducer;
