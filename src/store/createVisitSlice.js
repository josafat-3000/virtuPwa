import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const url_create_visit = `${import.meta.env.VITE_BACKEND_URL}/api/v1/visits`;

export const createVisit = createAsyncThunk('accessLogs/fetchCreateVisits', async (data) => {
    const response = await axios.post(url_create_visit,data,{ withCredentials: true });  
    return response.data;
  });

  const visitSlice = createSlice({
    name: 'visits',
    initialState: {
      visit: null,
      loading: false,
      error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(createVisit.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(createVisit.fulfilled, (state, action) => {
          state.loading = false;
          state.visit = action.payload;
          state.error = null;
        })
        .addCase(createVisit.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        });
    },
  });
  
  export default visitSlice.reducer;