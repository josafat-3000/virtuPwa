import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
const url_visits = `${import.meta.env.VITE_BACKEND_URL}/api/v1/visits/updaye`;

export const patchVisitById = createAsyncThunk('visits/fetchVisitById', async ({ id, values }) => {
  console.log("akjdaskndsad")
    const response = await axios.patch(`${url_visits}/${id}`,values,{ withCredentials: true }); // Asegúrate de que el endpoint sea correcto
    return response.data;
  });

  const singleVisitSlice = createSlice({
    name: 'Visit',
    initialState: {
      visita: [],
      loadingVisit: false,
      errorVisit: null,
    },
    reducers: {},
    extraReducers: (builder) => {
      builder
      .addCase(patchVisitById.pending, (state) => {
        state.loading = true;
      })
      .addCase(patchVisitById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedVisit = action.payload;
      })
      .addCase(patchVisitById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
    },
  });
  export default singleVisitSlice.reducer;  
