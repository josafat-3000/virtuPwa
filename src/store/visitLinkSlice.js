// src/redux/visitSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const url_link = `${import.meta.env.VITE_BACKEND_URL}/api/v1/visits/link`

// Thunk para cargar los conteos de visitas desde la API
export const fetchVisitLink = createAsyncThunk('visits/fetchVisitLink', async () => {
  const response = await axios.get(url_link,{ withCredentials: true }); // Asegúrate de que el endpoint sea correcto
  return response.data;
});

const linkSlice = createSlice({
  name: 'link',
  initialState: {
    link:'',
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVisitLink.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVisitLink.fulfilled, (state, action) => {
        state.loading = false;
        state.link = action.payload.link;
      })
      .addCase(fetchVisitLink.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});


export default linkSlice.reducer;


