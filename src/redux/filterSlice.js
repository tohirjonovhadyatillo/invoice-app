import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  filter: '',
  invoices: [], 
};

const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setFilter: (state, action) => {
      state.filter = action.payload; 
    },
    setInvoices: (state, action) => {
      state.invoices = action.payload; 
    },
    filterInvoices: (state) => {
      if (state.filter === '') {
        return;
      }

      state.invoices = state.invoices.filter(invoice => invoice.status === state.filter);
    },
  },
});

export const { setFilter, setInvoices, filterInvoices } = filterSlice.actions;
export default filterSlice.reducer;
