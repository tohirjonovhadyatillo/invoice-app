import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchInvoices = createAsyncThunk(
  'invoices/fetchInvoices',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_BASE_URL);
      return response.data.data.map(invoice => ({
        ...invoice,
        id: invoice.id.toString() // Ensure ID is always string
      }));
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const addInvoiceAPI = createAsyncThunk(
  'invoices/addInvoice',
  async (invoiceData, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_BASE_URL, invoiceData);
      return {
        ...response.data,
        id: response.data.id.toString()
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateInvoiceAPI = createAsyncThunk(
  'invoices/updateInvoice',
  async ({ id, invoiceData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/${id}`, invoiceData);
      return {
        ...response.data,
        id: response.data.id.toString()
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteInvoiceAPI = createAsyncThunk(
  'invoices/deleteInvoice',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_BASE_URL}/${id}`);
      return id.toString();
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateStatusAPI = createAsyncThunk(
  'invoices/updateStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`${API_BASE_URL}/${id}`, { status });
      return {
        ...response.data,
        id: response.data.id.toString()
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


const invoiceSlice = createSlice({
  name: "invoices",
  initialState: {
    data: [],
    selectedInvoice: null,
    status: 'idle',
    error: null,
    lastFetch: null,
    filter: null
  },
  reducers: {
    getInvoiceById: (state, action) => {
      const searchId = action.payload.id.toString();
      state.selectedInvoice = state.data.find(item => 
        item.id.toString() === searchId
      ) || null;
      
      if (!state.selectedInvoice) {
        state.error = `Invoice with ID ${action.payload.id} not found`;
      } else {
        state.error = null;
      }
    },
    clearInvoiceError: (state) => {
      state.error = null;
    },
    resetInvoiceState: (state) => {
      state.data = [];
      state.selectedInvoice = null;
      state.status = 'idle';
      state.error = null;
      state.lastFetch = null;
      state.filter = null;
    },
    setInvoiceFilter: (state, action) => {
      state.filter = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInvoices.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchInvoices.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload || [];
        state.lastFetch = new Date().toISOString();
      })
      .addCase(fetchInvoices.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(addInvoiceAPI.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addInvoiceAPI.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data.push(action.payload);
      })
      .addCase(addInvoiceAPI.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(updateInvoiceAPI.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateInvoiceAPI.fulfilled, (state, action) => {
        const index = state.data.findIndex(inv => inv.id === action.payload.id);
        if (index !== -1) {
          state.data[index] = action.payload;
        }
        state.status = "succeeded";
      })
      .addCase(updateInvoiceAPI.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(deleteInvoiceAPI.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteInvoiceAPI.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = state.data.filter(inv => inv.id !== action.payload);
      })
      .addCase(deleteInvoiceAPI.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(updateStatusAPI.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateStatusAPI.fulfilled, (state, action) => {
        const index = state.data.findIndex(inv => inv.id === action.payload.id);
        if (index !== -1) {
          state.data[index].status = action.payload.status;
        }
        state.status = "succeeded";
      })
      .addCase(updateStatusAPI.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  }
});

export const { 
  getInvoiceById, 
  clearInvoiceError, 
  resetInvoiceState, 
  setInvoiceFilter
} = invoiceSlice.actions;

export const selectAllInvoices = (state) => state.invoices.data;
export const selectInvoiceById = (state) => state.invoices.selectedInvoice;
export const selectInvoiceStatus = (state) => state.invoices.status;
export const selectInvoiceError = (state) => state.invoices.error;
export const selectLastFetchTime = (state) => state.invoices.lastFetch;
export const selectInvoiceFilter = (state) => state.invoices.filter;

export const selectFilteredInvoices = (state) => {
  const { data, filter } = state.invoices;
  if (!filter) return data;
  return data.filter(invoice => invoice.status === filter);
};

export default invoiceSlice.reducer;