import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
const url_uploads= `${import.meta.env.VITE_BACKEND_URL}/api/v1/docs/uploads`;

export const fetchAllUploads = createAsyncThunk('uploads/fetchAllUploads', async () => {
    const response = await axios.get(url_uploads,{ withCredentials: true }); // Asegúrate de que el endpoint sea correcto
    return response.data;
  });

  const allUploadsSlice = createSlice({
    name: 'allUploads',
    initialState: {
      uploads: [],
      loadingUploads: false,
      errorUploads: null,
    },
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(fetchAllUploads.pending, (state) => {
          state.loadingUploads = true;
          state.errorUploads = null;
        })
        .addCase(fetchAllUploads.fulfilled, (state, action) => {
          state.loadingUploads = false;
          state.uploads = action.payload;
        })
        .addCase(fetchAllUploads.rejected, (state, action) => {
          state.loadingUploads = false;
          state.errorUploads = action.error.message;
        });
    },
  });
  export default allUploadsSlice.reducer;  