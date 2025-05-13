import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchInvoices,
  getInvoiceById,
  selectInvoiceById,
  selectInvoiceError,
  selectInvoiceStatus,
  updateStatusAPI,
} from "../redux/invoiceSlice";
import PaidStatus from "./PaidStatus";
import leftArrow from "../assets/icon-arrow-left.svg";
import DeleteModal from "./DeleteModal";
import CreateInvoice from "./CreateInvoice";
import formatDate from "../functions/formatDate";
import { toast } from 'sonner';


function InvoiceInfo({ onDelete }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const invoice = useSelector(selectInvoiceById);
  const error = useSelector(selectInvoiceError);
  const status = useSelector(selectInvoiceStatus);

  useEffect(() => {
    if (id) {
      dispatch(fetchInvoices()).then(() => {
        dispatch(getInvoiceById({ id }));
      });
    }
  }, [id, dispatch]);

  const onMakePaidClick = () => {
    dispatch(updateStatusAPI({ id: invoice.id, status: "Paid" })).then(() => {
      dispatch(getInvoiceById({ id: invoice.id }));
    });
  };

  const onDeleteButtonClick = () => {
    navigate("/");
    setIsDeleteModalOpen(false);
    onDelete(invoice.id);
  };

  const formatNumber = (num) => {
    const number = Number(num);
    return isNaN(number) ? "0.00" : number.toFixed(2);
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#f8f8fb] dark:bg-[#141625] px-4 py-8 flex flex-col space-y-6 max-w-3xl mx-auto animate-pulse">
        <div className="h-6 w-24 bg-gray-300 dark:bg-[#1e2139] rounded"></div>
        <div className="h-12 bg-gray-300 dark:bg-[#1e2139] rounded w-full"></div>
        <div className="h-72 bg-gray-300 dark:bg-[#1e2139] rounded w-full"></div>
        <div className="h-16 bg-gray-300 dark:bg-[#1e2139] rounded w-full"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-red-600 dark:text-red-400">{error}</div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-500 text-xl mb-4">Invoice not found</p>
        <p className="text-gray-500">Invoice ID: {id}</p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div>
      <motion.div
        key="invoice-info"
        initial={{ x: 0 }}
        animate={{ x: 0 }}
        exit={{ x: "200%" }}
        transition={{ duration: 0.5 }}
        className="dark:bg-[#141625] mx-auto duration-300 min-h-screen bg-[#f8f8fb] py-[34px] px-2 md:px-8 lg:px-12 max-w-3xl lg:py-[72px]"
      >
        <div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-4 group dark:text-white font-thin"
          >
            <img src={leftArrow} alt="Go back" />
            <p className="group-hover:opacity-80">Go back</p>
          </button>

          <div className="mt-8 rounded-lg w-full flex items-center justify-between px-6 py-6 bg-white dark:bg-[#1e2139]">
            <div className="flex space-x-2 justify-between md:justify-start md:w-auto w-full items-center">
              <h1 className="text-gray-600 dark:text-gray-400">Status</h1>
              <PaidStatus type={invoice.status} />
            </div>
            <div className="md:block hidden">
              <button
                onClick={() => setIsEditOpen(true)}
                className="text-[#7e88c3] text-center dark:bg-[#252945] hover:opacity-80 bg-slate-100 p-3 px-7 rounded-full"
              >
                Edit
              </button>
              <button
                onClick={() => setIsDeleteModalOpen(true)}
                className="ml-3 text-center text-white bg-red-500 hover:opacity-80 p-3 px-7 rounded-full"
              >
                Delete
              </button>
              {invoice.status === "Pending" && (
                <button
                  onClick={onMakePaidClick}
                  className="ml-3 text-center text-white bg-[#7c5dfa] hover:opacity-80 p-3 px-7 rounded-full"
                >
                  Mark as Paid
                </button>
              )}
            </div>
          </div>

          <div className="mt-4 rounded-lg w-full px-6 py-6 bg-white dark:bg-[#1e2139]">
            <div className="flex flex-col md:flex-row items-start justify-between w-full">
              <div>
                <h1 className="font-semibold dark:text-white text-xl">
                  <span className="text-[#7e88c3]">#</span>
                  {invoice.id}
                </h1>
                <p className="text-sm text-gray-500">{invoice.clientName}</p>
              </div>
              <div className="mt-4 md:mt-0 text-left text-gray-400 text-sm md:text-right felx flex-col items-center">
                <p>{invoice?.senderAddress?.street}</p>
                <p>{invoice?.senderAddress?.city}</p>
                <p>{invoice?.senderAddress?.postCode}</p>
                <p>{invoice?.senderAddress?.country}</p>
              </div>
            </div>

            <div className="mt-10 grid grid-cols-2 w-full md:grid-cols-3">
              <div className="flex flex-col justify-between">
                <div>
                  <h3 className="text-gray-400 font-thin">Invoice Date</h3>
                  <h1 className="text-lg font-semibold dark:text-white">
                    {formatDate(invoice.createdAt)}
                  </h1>
                </div>
                <div>
                  <h3 className="text-gray-400 font-thin">Payment Due</h3>
                  <h1 className="dark:text-white text-lg font-semibold">
                    {formatDate(invoice.paymentDue)}
                  </h1>
                </div>
              </div>

              <div>
                <p className="text-gray-400 font-thin">Bill to</p>
                <h1 className="dark:text-white text-lg font-semibold">
                  {invoice.clientName}
                </h1>
                <p className="text-gray-400 font-thin">
                  {invoice?.clientAddress?.street}
                </p>
                <p className="text-gray-400 font-thin">
                  {invoice?.clientAddress?.city}
                </p>
                <p className="text-gray-400 font-thin">
                  {invoice?.clientAddress?.postCode}
                </p>
                <p className="text-gray-400 font-thin">
                  {invoice?.clientAddress?.country}
                </p>
              </div>

              <div className="mt-8 md:mt-0">
                <p className="text-gray-400 font-thin">Sent to</p>
                <h1 className="dark:text-white text-lg font-semibold">
                  {invoice.clientEmail}
                </h1>
              </div>
            </div>

            <div className="hidden sm:block mt-10 bg-[#f9fafe] dark:bg-[#252945] rounded-lg rounded-b-none p-6">
              <div className="grid grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-gray-400 font-thin">Item Name</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-400 font-thin">Qty.</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-400 font-thin">Price</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-400 font-thin">Total</p>
                </div>
              </div>

              {Array.isArray(invoice?.items) && invoice.items.length > 0 ? (
                invoice.items.map((item, index) => (
                  <div key={index} className="grid grid-cols-4 gap-4 mb-4">
                    <div>
                      <h1 className="dark:text-white text-base font-semibold">
                        {item?.name}
                      </h1>
                    </div>
                    <div className="text-right">
                      <h1 className="dark:text-white text-base font-semibold">
                        {item?.quantity}
                      </h1>
                    </div>
                    <div className="text-right">
                      <h1 className="dark:text-white text-base font-semibold">
                        £{formatNumber(item?.price)}
                      </h1>
                    </div>
                    <div className="text-right">
                      <h1 className="dark:text-white text-base font-semibold">
                        £{formatNumber(item?.total)}
                      </h1>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400">No items found or loading...</p>
              )}
            </div>

            <div className="sm:hidden mt-10 bg-[#f9fafe] dark:bg-[#252945] rounded-lg rounded-b-none space-y-4 p-6">
              {invoice?.items?.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between text-lg dark:text-white"
                >
                  <div>
                    <h1>{item.name}</h1>
                    <p className="text-gray-400">
                      {item.quantity} x £{formatNumber(item.price)}
                    </p>
                  </div>
                  <h1>£{formatNumber(item?.total)}</h1>
                </div>
              ))}
            </div>

            <div className="p-6 font-semibold text-white rounded-lg rounded-t-none justify-between flex dark:bg-[#0C0E16] bg-gray-700">
              <h3 className="text-xl">Amount Due</h3>
              <h1 className="text-3xl">£{formatNumber(invoice?.total)}</h1>
            </div>
          </div>
        </div>

        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-[#1e2139] p-4 flex justify-between shadow-lg">
          <button
            onClick={() => setIsEditOpen(true)}
            className="text-[#7e88c3] dark:bg-[#252945] bg-slate-100 p-3 px-5 rounded-full"
          >
            Edit
          </button>
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="text-white bg-red-500 p-3 px-5 rounded-full"
          >
            Delete
          </button>
          {invoice.status === "Pending" && (
            <button
              onClick={() => {
                onMakePaidClick(invoice.id);
                toast.success(`Invoice ${invoice.id} marked as Paid`);
              }}
              className="text-white bg-[#7c5dfa] p-3 px-5 rounded-full"
            >
              Mark Paid
            </button>
          )}
        </div>
      </motion.div>

      {isDeleteModalOpen && (
        <DeleteModal
          onDeleteButtonClick={onDeleteButtonClick}
          setIsDeleteModalOpen={setIsDeleteModalOpen}
          id={invoice.id}
        />
      )}

      <AnimatePresence>
        {isEditOpen && (
          <CreateInvoice
            invoice={invoice}
            type="edit"
            setOpenCreateInvoice={setIsEditOpen}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default InvoiceInfo;
