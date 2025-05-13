import { configureStore } from "@reduxjs/toolkit";
import invoiceReducer from "./invoiceSlice";
import filterReducer from "./filterSlice";

export const store = configureStore({
  reducer: {
    invoices: invoiceReducer,
    filter: filterReducer,
  },
});

export default store;
