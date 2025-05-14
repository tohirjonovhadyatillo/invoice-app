import Center from './components/Center';
import Header from './components/Header';
import { AnimatePresence } from 'framer-motion';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import InvoiceInfo from './components/InvoiceInfo';
import { deleteInvoiceAPI, fetchInvoices } from './redux/invoiceSlice';
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { Toaster } from 'sonner';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase/firebase';
import Login from './components/Login';
import Register from './components/Register';

function App() {
  const location = useLocation();
  const dispatch = useDispatch();
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoadingAuth(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) dispatch(fetchInvoices());
  }, [dispatch, user]);

  const onDelete = (id) => {
    dispatch(deleteInvoiceAPI(id));
  };


  return (
    <div className='dark:bg-[#141625] duration-300 min-h-screen bg-[#f8f8fb]'>
      <Toaster richColors position="top-right" />
      {user && <Header />}

      <AnimatePresence mode='wait'>
        <Routes location={location} key={location.pathname}>
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
          <Route path="/" element={user ? <Center /> : <Navigate to="/login" />} />
          <Route path="/invoice/:id" element={user ? <InvoiceInfo onDelete={onDelete} /> : <Navigate to="/login" />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;
