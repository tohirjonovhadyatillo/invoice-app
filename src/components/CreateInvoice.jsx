import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import AddItem from "./AddItem";
import { v4 as uuidv4 } from "uuid";
import { useDispatch, useSelector } from "react-redux";
import { addInvoiceAPI, updateInvoiceAPI } from "../redux/invoiceSlice";
import { toast } from "sonner";

function CreateInvoice({ setOpenCreateInvoice, invoice, type }) {
  const dispatch = useDispatch();
  const status = useSelector((state) => state.invoices.status);

  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [isValidatorActive, setIsValidatorActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const deliveryTimes = [
    { text: "Next 1 day", value: 1 },
    { text: "Next 7 day", value: 7 },
    { text: "Next 14 day", value: 14 },
    { text: "Next 30 day", value: 30 },
  ];

  const [formData, setFormData] = useState({
    senderStreet: "",
    senderCity: "",
    senderPostCode: "",
    senderCountry: "",
    clientName: "",
    clientEmail: "",
    clientStreet: "",
    clientCity: "",
    clientPostCode: "",
    clientCountry: "",
    description: "",
    paymentTerms: deliveryTimes[0].value,
    items: [
      {
        name: "",
        quantity: 1,
        price: 0,
        total: 0,
        id: uuidv4(),
      },
    ],
  });

  useEffect(() => {
    if (type === "edit" && isFirstLoad && invoice) {
      const updatedItems = invoice?.items?.map((obj, index) => ({
        ...obj,
        id: obj.id || uuidv4(),
      })) || [
        {
          name: "",
          quantity: 1,
          price: 0,
          total: 0,
          id: uuidv4(),
        },
      ];

      setFormData({
        senderStreet: invoice?.senderAddress?.street || "",
        senderCity: invoice?.senderAddress?.city || "",
        senderPostCode: invoice?.senderAddress?.postCode || "",
        senderCountry: invoice?.senderAddress?.country || "",
        clientName: invoice?.clientName || "",
        clientEmail: invoice?.clientEmail || "",
        clientStreet: invoice?.clientAddress?.street || "",
        clientCity: invoice?.clientAddress?.city || "",
        clientPostCode: invoice?.clientAddress?.postCode || "",
        clientCountry: invoice?.clientAddress?.country || "",
        description: invoice?.description || "",
        paymentTerms: invoice?.paymentTerms || deliveryTimes[0].value,
        items: updatedItems,
      });
      setIsFirstLoad(false);
    }
  }, [type, invoice, isFirstLoad, deliveryTimes]);

  const onDeleteItem = (id) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((el) => el.id !== id),
    }));
  };

  const handleItemChange = (id, e) => {
    const updatedItems = formData.items.map((item) => {
      if (item.id === id) {
        const updatedItem = {
          ...item,
          [e.target.name]:
            e.target.name === "quantity" || e.target.name === "price"
              ? Number(e.target.value)
              : e.target.value,
        };

        if (e.target.name === "quantity" || e.target.name === "price") {
          updatedItem.total =
            Number(updatedItem.quantity) * Number(updatedItem.price);
        }

        return updatedItem;
      }
      return item;
    });

    setFormData((prev) => ({
      ...prev,
      items: updatedItems,
    }));
  };

  const addNewItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          name: "",
          quantity: 1,
          price: 0,
          total: 0,
          id: uuidv4(),
        },
      ],
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    setIsValidatorActive(true);
    setSubmitError(null);
    setIsSubmitting(true);

    const invoiceData = {
      description: formData.description,
      paymentTerms: formData.paymentTerms,
      clientName: formData.clientName,
      clientEmail: formData.clientEmail,
      senderAddress: {
        street: formData.senderStreet,
        city: formData.senderCity,
        postCode: formData.senderPostCode,
        country: formData.senderCountry,
      },
      clientAddress: {
        street: formData.clientStreet,
        city: formData.clientCity,
        postCode: formData.clientPostCode,
        country: formData.clientCountry,
      },
      items: formData.items,
      status: type === "edit" ? invoice?.status || "pending" : "pending",
    };

    try {
      if (type === "edit" && invoice?.id) {
        await dispatch(
          updateInvoiceAPI({
            id: invoice.id,
            invoiceData,
          })
        ).unwrap();
        toast.success("Invoice successfully updated!");
      } else {
        await dispatch(addInvoiceAPI(invoiceData)).unwrap();
        toast.success("Invoice successfully created!");
      }
      setOpenCreateInvoice(false);
    } catch (error) {
      setSubmitError(error.message || "Failed to save invoice");
      toast.error(submitError);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      onClick={(e) => {
        if (e.target !== e.currentTarget) return;
        setOpenCreateInvoice(false);
      }}
      className="fixed top-0 bottom-0 left-0 right-0 bg-[#000005be]"
    >
      <motion.div
        key="createInvoice-sidebar"
        initial={{ x: -500, opacity: 0 }}
        animate={{
          opacity: 1,
          x: 0,
          transition: {
            type: "spring",
            stiffness: 300,
            damping: 40,
            duration: 0.4,
          },
        }}
        exit={{ x: -700, transition: { duration: 0.2 } }}
        className="scrollbar-hide flex flex-col dark:text-white dark:bg-[#141625] bg-white md:pl-[150px] py-16 px-6 h-screen md:w-[768px] md:rounded-r-3xl"
      >
        <h1 className="font-semibold dark:text-white text-3xl">
          {type === "edit" ? "Edit" : "Create"} Invoice
        </h1>

        {submitError && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
            {submitError}
          </div>
        )}

        <div className="overflow-y-scroll scrollbar-hide my-14">
          <h1 className="text-[#7c5dfa] mb-4 font-medium">Bill From</h1>

          <div className="grid grid-cols-3 mx-1 space-y-4">
            <div className="flex flex-col col-span-3">
              <label className="text-gray-400 font-light">Street Address</label>
              <input
                name="senderStreet"
                value={formData.senderStreet}
                onChange={handleInputChange}
                type="text"
                className="dark:bg-[#1e2139] py-2 px-4 border-[.2px] rounded-lg focus:outline-purple-400 border-gray-300 focus:outline-none dark:border-gray-800"
              />
            </div>

            <div className="flex flex-col mr-4 col-span-1">
              <label className="text-gray-400 font-light">City</label>
              <input
                name="senderCity"
                type="text"
                value={formData.senderCity}
                onChange={handleInputChange}
                className="dark:bg-[#1e2139] py-2 px-4 border-[.2px] focus:outline-none rounded-lg focus:outline-purple-400 border-gray-300 dark:border-gray-800"
              />
            </div>

            <div className="flex flex-col mr-4 col-span-1">
              <label className="text-gray-400 font-light">Post Code</label>
              <input
                name="senderPostCode"
                type="text"
                value={formData.senderPostCode}
                onChange={handleInputChange}
                className="dark:bg-[#1e2139] py-2 px-4 border-[.2px] rounded-lg focus:outline-none focus:outline-purple-400 border-gray-300 dark:border-gray-800"
              />
            </div>

            <div className="flex flex-col col-span-1">
              <label className="text-gray-400 font-light">Country</label>
              <input
                name="senderCountry"
                type="text"
                value={formData.senderCountry}
                onChange={handleInputChange}
                className="dark:bg-[#1e2139] py-2 px-4 border-[.2px] focus:outline-none rounded-lg focus:outline-purple-400 border-gray-300 dark:border-gray-800"
              />
            </div>
          </div>

          <h1 className="text-[#7c5dfa] my-4 mt-10 font-medium">Bill To</h1>

          <div className="grid grid-cols-3 mx-1 space-y-4">
            <div className="flex flex-col col-span-3">
              <label className="text-gray-400 font-light">Client Name</label>
              <input
                name="clientName"
                type="text"
                value={formData.clientName}
                onChange={handleInputChange}
                className="dark:bg-[#1e2139] py-2 px-4 border-[.2px] rounded-lg focus:outline-purple-400 border-gray-300 focus:outline-none dark:border-gray-800"
              />
            </div>

            <div className="flex flex-col col-span-3">
              <label className="text-gray-400 font-light">Client Email</label>
              <input
                name="clientEmail"
                type="text"
                value={formData.clientEmail}
                onChange={handleInputChange}
                className="dark:bg-[#1e2139] py-2 px-4 border-[.2px] rounded-lg focus:outline-purple-400 border-gray-300 focus:outline-none dark:border-gray-800"
              />
            </div>

            <div className="flex flex-col col-span-3">
              <label className="text-gray-400 font-light">Street Address</label>
              <input
                name="clientStreet"
                type="text"
                value={formData.clientStreet}
                onChange={handleInputChange}
                className="dark:bg-[#1e2139] py-2 px-4 border-[.2px] rounded-lg focus:outline-purple-400 border-gray-300 focus:outline-none dark:border-gray-800"
              />
            </div>

            <div className="flex flex-col mr-4 col-span-1">
              <label className="text-gray-400 font-light">City</label>
              <input
                name="clientCity"
                type="text"
                value={formData.clientCity}
                onChange={handleInputChange}
                className="dark:bg-[#1e2139] py-2 px-4 border-[.2px] rounded-lg focus:outline-purple-400 border-gray-300 focus:outline-none dark:border-gray-800"
              />
            </div>

            <div className="flex flex-col mr-4 col-span-1">
              <label className="text-gray-400 font-light">Post Code</label>
              <input
                name="clientPostCode"
                type="text"
                value={formData.clientPostCode}
                onChange={handleInputChange}
                className="dark:bg-[#1e2139] py-2 px-4 border-[.2px] rounded-lg focus:outline-purple-400 border-gray-300 focus:outline-none dark:border-gray-800"
              />
            </div>

            <div className="flex flex-col col-span-1">
              <label className="text-gray-400 font-light">Country</label>
              <input
                name="clientCountry"
                type="text"
                value={formData.clientCountry}
                onChange={handleInputChange}
                className="dark:bg-[#1e2139] py-2 px-4 border-[.2px] rounded-lg focus:outline-purple-400 border-gray-300 focus:outline-none dark:border-gray-800"
              />
            </div>
          </div>

          <div className="grid mx-1 grid-cols-2 mt-8">
            <div className="flex flex-col">
              <label className="text-gray-400 font-light">Invoice Date</label>
              <input
                type="date"
                disabled={type === "edit"}
                className="dark:bg-[#1e2139] py-2 px-4 border-[.2px] rounded-lg focus:outline-purple-400 border-gray-300 focus:outline-none dark:border-gray-800 dark:text-white mr-4"
              />
            </div>

            <div className="mx-auto w-full">
              <label className="text-gray-400 font-light">Payment Terms</label>
              <select
                name="paymentTerms"
                value={formData.paymentTerms}
                onChange={handleInputChange}
                className="appearance-none w-full py-2 px-4 border-[.2px] rounded-lg focus:outline-none dark:bg-[#1e2139] dark:text-white dark:border-gray-800 focus:outline-purple-400 border-gray-300 select-status"
              >
                {deliveryTimes.map((time, index) => (
                  <option key={index} value={time.value}>
                    {time.text}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mx-1 mt-4 flex flex-col">
            <label className="text-gray-400 font-light">Description</label>
            <input
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              type="text"
              className="dark:bg-[#1e2139] py-2 px-4 border-[.2px] rounded-lg focus:outline-none focus:outline-purple-400 border-gray-300 dark:border-gray-800 dark:text-white"
            />
          </div>

          <h2 className="text-2xl text-gray-500 mt-10">Item List</h2>

          {formData.items.map((itemDetails) => (
            <div
              key={itemDetails.id}
              className="border-b pb-2 border-gray-300 mb-4"
            >
              <AddItem
                handleItemChange={handleItemChange}
                onDelete={onDeleteItem}
                itemDetails={itemDetails}
              />
            </div>
          ))}

          <button
            onClick={addNewItem}
            className="bg-gray-200 hover:opacity-80 mx-auto py-2 items-center dark:text-white dark:bg-[#252945] justify-center rounded-xl w-full mt-6"
          >
            + Add New Item
          </button>
        </div>

        <div className="flex justify-between">
          <div>
            <button
              onClick={() => setOpenCreateInvoice(false)}
              className="bg-gray-200 hover:opacity-80 mx-auto py-4 items-center dark:text-white dark:bg-[#252945] justify-center px-8 rounded-full"
            >
              Discard
            </button>
          </div>

          <div>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`text-white hover:opacity-80 mx-auto py-4 items-center bg-[#7c5dfa] justify-center px-8 rounded-full ${
                isSubmitting ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? "Saving..." : "Save & Send"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default CreateInvoice;
