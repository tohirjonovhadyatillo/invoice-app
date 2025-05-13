import { useEffect, useState } from "react";
import { AnimatePresence, motion, useAnimation } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import {
  selectFilteredInvoices,
  selectInvoiceStatus,
  fetchInvoices,
  setInvoiceFilter,
} from "../redux/invoiceSlice";
import InvoiceCard from "./InvoiceCard";
import CreateInvoice from "./CreateInvoice";
import loadingBin from "../assets/misterBin.gif";
import iDontKnow from "../assets/iDontKnow.jpg";

const STATUS_OPTIONS = [
  { value: "paid", label: "Paid" },
  { value: "pending", label: "Pending" },
  { value: "draft", label: "Draft" },
];

function Center() {
  const location = useLocation();
  const controls = useAnimation();
  const dispatch = useDispatch();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [openCreateInvoice, setOpenCreateInvoice] = useState(false);

  const invoices = useSelector(selectFilteredInvoices);
  const status = useSelector(selectInvoiceStatus);
  const currentFilter = useSelector((state) => state.invoices.filter);

  useEffect(() => {
    dispatch(fetchInvoices());
  }, [dispatch]);

  useEffect(() => {
    controls.start({
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20,
      },
    });
  }, [controls]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isDropdownOpen &&
        event.target.closest(".filter-dropdown") === null &&
        event.target.closest(".filter-trigger") === null
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDropdownOpen]);

  const dropdownVariants = {
    open: {
      opacity: 1,
      height: "auto",
      transition: { duration: 0.2, ease: "easeOut" },
    },
    close: {
      opacity: 0,
      height: 0,
      transition: { duration: 0.2, ease: "easeIn" },
    },
  };

  const handleFilterChange = (filterValue) => {
    dispatch(setInvoiceFilter(currentFilter === filterValue ? null : filterValue));
    setIsDropdownOpen(false);
  };

  const getFilterDisplayText = () => {
    if (!currentFilter) return "Filter by status";
    const selectedOption = STATUS_OPTIONS.find(opt => opt.value === currentFilter);
    return selectedOption ? `Filter: ${selectedOption.label}` : "Filter by status";
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600 dark:text-gray-300 flex flex-col items-center gap-10">
          <img src={loadingBin} alt="Loading..." className="w-8/12" />
          <h2>LOADING...</h2>
        </div>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-red-600 dark:text-red-400">
          <img src={iDontKnow} alt="Error occurred" />
          <p>Error loading invoices. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dark:bg-[#141625] bg-[#f8f8fb]">
      <div className="scrollbar-hide duration-300 min-h-screen py-[34px] px-2 md:px-8 lg:px-12 lg:py-[72px]">
        <motion.div
          key={location.pathname}
          initial={{ x: "0" }}
          animate={{ x: 0 }}
          exit={{ x: "-150%" }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl flex flex-col mx-auto my-auto"
        >

          <div className="min-w-full max-h-[64px] flex items-center justify-between mb-8">
            <div>
              <h1 className="lg:text-4xl md:text-2xl text-xl dark:text-white tracking-wide font-semibold">
                Invoices
              </h1>
              <p className="text-gray-500 font-light">
                {invoices.length === 0
                  ? "No invoices"
                  : `There are ${invoices.length} invoice${invoices.length !== 1 ? "s" : ""}`}
              </p>
            </div>

            <div className="flex items-center gap-4">

              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="filter-trigger flex items-center gap-2 dark:text-white font-medium hover:opacity-80 transition-opacity"
                  aria-haspopup="true"
                  aria-expanded={isDropdownOpen}
                >
                  <span className="hidden md:inline">{getFilterDisplayText()}</span>
                  <span className="md:hidden">Filter</span>
                  <motion.span
                    animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </motion.span>
                </button>

                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      variants={dropdownVariants}
                      initial="close"
                      animate="open"
                      exit="close"
                      className="filter-dropdown absolute right-0 mt-2 w-48 bg-white dark:bg-[#252945] shadow-lg rounded-md z-50 overflow-hidden border border-gray-200 dark:border-[#1e2139]"
                    >
                      {STATUS_OPTIONS.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => handleFilterChange(option.value)}
                          className={`w-full text-left px-4 py-2 text-sm transition-colors duration-200
                            ${
                              currentFilter === option.value
                                ? "bg-[#f0ebff] dark:bg-[#7c5dfa]/20 text-[#7c5dfa] font-semibold"
                                : "hover:bg-gray-100 dark:hover:bg-[#1e2139] text-gray-700 dark:text-white"
                            }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button
                onClick={() => setOpenCreateInvoice(true)}
                className="hover:opacity-80 flex items-center gap-2 py-2 px-4 bg-[#7c5dfa] rounded-full transition-opacity"
                aria-label="Create new invoice"
              >
                <div className="bg-white rounded-full p-2">
                  <svg
                    className="w-4 h-4 text-[#7c5dfa]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </div>
                <span className="md:inline hidden text-white font-semibold">
                  New Invoice
                </span>
                <span className="md:hidden inline text-white font-semibold">
                  New
                </span>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {invoices.length > 0 ? (
              invoices.map((invoice, index) => (
                <motion.div
                  key={invoice.id}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: { delay: index * 0.05, duration: 0.3 },
                  }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.2 }}
                >
                  <InvoiceCard invoice={invoice} />
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center mt-20 text-center"
              >
                <img
                  src={iDontKnow}
                  alt="No invoices"
                  className="w-64 h-64 object-contain"
                />
                <h2 className="text-2xl font-bold mt-8 dark:text-white">
                  No Invoices Found
                </h2>
                <p className="text-gray-500 mt-4 max-w-md">
                  {currentFilter
                    ? `No invoices match the ${currentFilter} filter. Try changing the filter or create a new invoice.`
                    : "Create an invoice by clicking the New Invoice button to get started"}
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {openCreateInvoice && (
          <CreateInvoice
            openCreateInvoice={openCreateInvoice}
            setOpenCreateInvoice={setOpenCreateInvoice}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default Center;