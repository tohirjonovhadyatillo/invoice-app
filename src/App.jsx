import Center from './components/Center';
import Header from './components/Header';
import { AnimatePresence } from 'framer-motion';
import { Routes, Route, useLocation } from 'react-router-dom';
import InvoiceInfo from './components/InvoiceInfo';
import { deleteInvoiceAPI, fetchInvoices } from './redux/invoiceSlice';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { Toaster } from 'sonner';

function App() {
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchInvoices());
  }, [dispatch]);

  const onDelete = (id) => {
    dispatch(deleteInvoiceAPI(id));
  };

  return (
    <div className='dark:bg-[#141625] duration-300 min-h-screen bg-[#f8f8fb]'>
      <Toaster richColors position="top-right" />
      <Header />
      <AnimatePresence mode='wait'>
        <Routes location={location} key={location.pathname}>
          <Route path='/' element={<Center />} />
          <Route path='/invoice/:id' element={<InvoiceInfo onDelete={onDelete} />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;