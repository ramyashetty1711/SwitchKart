import React, { useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// Mock customer lookup
const mockCustomerLookup = (contact_no) => {
  const data = {
    "9876543210": {
      full_name: "John Doe",
      alternate_no: "9123456789",
      mail_id: "john@example.com",
      comm_channel: "Email",
      address_line1: "123 Main Street",
      address_line2: "Near Park",
      city: "Bangalore",
      state: "Karnataka",
      pincode: "560001",
    },
  };
  return data[contact_no] || null;
};

// Mock device data
const mockDeviceLookup = (imei) => {
  const data = {
    "123456789012345": {
      ram: "6 GB",
      invoice_no: "INV-2023-456",
      model: "Galaxy M13",
      color: "Blue",
      activation_date: "2023-06-15",
      dop: "2023-06-01",
      warranty_status: "In Warranty",
      remarks: "No issues reported",
    },
  };
  return data[imei] || null;
};

const DeviceFields = [
  { key: "ram", display: "RAM" },
  { key: "invoice_no", display: "Invoice No" },
  { key: "model", display: "Model" },
  { key: "color", display: "Color" },
  { key: "activation_date", display: "Activation Date", type: "date" },
  { key: "dop", display: "Date of Purchase", type: "date" },
  { key: "warranty_status", display: "Warranty Status" },
];

export default function DynamicDeviceForm() {
  const [formData, setFormData] = useState({});
  const [notFound, setNotFound] = useState(false);
  const [imeiEmpty, setImeiEmpty] = useState(false);
  const [customerNotFound, setCustomerNotFound] = useState(false);
  const [customerFetched, setCustomerFetched] = useState(false);
  const printRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: "Customer_Issue_Form",
  });

  const handleDownloadPDF = async () => {
    const input = printRef.current;
    if (!input) return;

    const canvas = await html2canvas(input, {
      scale: 2,
      useCORS: true,
    });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("Customer_Issue_Form.pdf");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const fetchCustomerInfo = () => {
    if (!formData.contact_no?.trim()) {
      setCustomerNotFound(true);
      return;
    }
    const customerDetails = mockCustomerLookup(formData.contact_no);
    if (customerDetails) {
      setFormData((prev) => ({
        ...prev,
        ...customerDetails,
      }));
      setCustomerFetched(true);
      setCustomerNotFound(false);
    } else {
      setCustomerNotFound(true);
      setCustomerFetched(false);
    }
  };

  const fetchDeviceInfo = () => {
    if (!formData.imei?.trim()) {
      setImeiEmpty(true);
      setNotFound(false);
      return;
    }
    setImeiEmpty(false);
    const deviceDetails = mockDeviceLookup(formData.imei);
    if (deviceDetails) {
      setFormData((prev) => ({
        ...prev,
        ...deviceDetails,
      }));
      setNotFound(false);
    } else {
      setNotFound(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted:", formData);
    alert("Form Submitted. Check console.");
  };

  return (
    <div className="space-y-6 p-6 bg-white rounded h-[calc(100vh-200px)] overflow-y-auto custom-scrollbar">
      <div ref={printRef}>
        <form onSubmit={handleSubmit}>
          {/* Customer Section */}
          <section className="space-y-4">
            <h3 className="text-xl font-bold text-[var(--primary)] border-b pb-2">
              Customer & Address Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              {/* Contact No */}
              <div>
                <label
                  htmlFor="contact_no"
                  className="block text-sm font-medium text-black mb-1"
                >
                  Contact No *
                </label>
                <input
                  id="contact_no"
                  name="contact_no"
                  value={formData.contact_no || ""}
                  onChange={handleChange}
                  required
                  className="border p-2 w-full rounded border-[var(--secondary)] text-black"
                />
              </div>
              <button
                type="button"
                onClick={fetchCustomerInfo}
                className="bg-[var(--primary)] text-white px-2 py-2 rounded hover:bg-[var(--primary)] h-fit self-end"
              >
                Get Customer Info
              </button>
            </div>
            {customerNotFound && (
              <p className="text-red-500 text-sm">
                No customer found. Please enter details manually.
              </p>
            )}

            {/* Other Customer Fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              {[
                { name: "full_name", label: "Full Name *", required: true },
                { name: "alternate_no", label: "Alternate No" },
                { name: "mail_id", label: "Mail ID *", type: "email", required: true },
                { name: "comm_channel", label: "Communication Channel" },
                { name: "address_line1", label: "Address Line 1 *", required: true },
                { name: "address_line2", label: "Address Line 2" },
                { name: "city", label: "City *", required: true },
                { name: "state", label: "State *", required: true },
                { name: "pincode", label: "Pincode *", required: true },
              ].map(({ name, label, type = "text", required }) => (
                <div key={name}>
                  <label
                    htmlFor={name}
                    className="block text-sm font-medium text-black mb-1"
                  >
                    {label}
                  </label>
                  <input
                    id={name}
                    name={name}
                    type={type}
                    value={formData[name] || ""}
                    onChange={handleChange}
                    required={required}
                    className={`border p-2 w-full rounded border-[var(--secondary)] text-black ${
                      !customerFetched && !customerNotFound
                        ? "bg-gray-100 cursor-not-allowed"
                        : ""
                    }`}
                    disabled={!customerFetched && !customerNotFound}
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Device Info Section */}
          <section className="space-y-4 mt-5">
            <h3 className="text-xl font-bold text-[var(--primary)] border-b pb-2">
              Handset Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div>
                <label
                  htmlFor="imei"
                  className="block text-sm font-medium text-black mb-1"
                >
                  IMEI *
                </label>
                <input
                  id="imei"
                  name="imei"
                  value={formData.imei || ""}
                  onChange={handleChange}
                  className="border p-2 w-full rounded border-[var(--secondary)] text-black"
                  required
                />
              </div>
              <button
                type="button"
                onClick={fetchDeviceInfo}
                className="bg-[var(--primary)] text-white px-2 py-2 rounded hover:bg-[var(--primary)] h-fit self-end"
              >
                Get Device Info
              </button>
            </div>
            {imeiEmpty && (
              <p className="text-red-500 text-sm">Please enter an IMEI.</p>
            )}
            {notFound && (
              <p className="text-red-500 text-sm">No device found for this IMEI.</p>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {DeviceFields.map((field) => (
                <div key={field.key}>
                  <label className="block text-sm font-medium text-black mb-1">
                    {field.display}
                  </label>
                  <input
                    type={field.type || "text"}
                    name={field.key}
                    value={formData[field.key] || ""}
                    readOnly
                    className="border p-2 w-full rounded border-[var(--secondary)] bg-gray-100 text-black cursor-not-allowed"
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Issue Section */}
          <section className="space-y-4 mt-5">
            <h3 className="text-xl font-bold text-[var(--primary)] border-b pb-2">
              Issue Information
            </h3>
            <div>
              <label
                htmlFor="issue_title"
                className="block text-sm font-medium text-black mb-1"
              >
                Issue Title *
              </label>
              <input
                id="issue_title"
                name="issue_title"
                value={formData.issue_title || ""}
                onChange={handleChange}
                className="border p-2 w-full rounded border-[var(--secondary)] text-black "
                required
              />
            </div>
            <div>
              <label
                htmlFor="issue_details"
                className="block text-sm font-medium text-black mb-1"
              >
                Issue Details *
              </label>
              <textarea
                id="issue_details"
                name="issue_details"
                rows={4}
                value={formData.issue_details || ""}
                onChange={handleChange}
                className="border p-2 w-full rounded border-[var(--secondary)] text-black"
                required
              ></textarea>
            </div>
          </section>
        </form>
      </div>

      {/* Button Controls */}
      <div className="flex justify-end gap-4 mt-6">
        <button
          type="button"
          onClick={() => {
            console.log("Saved Data:", formData);
            alert("Form data saved (not submitted). Check console.");
          }}
          className="bg-[var(--secondary)] text-white px-6 py-2 rounded shadow-md"
        >
          Save
        </button>
        <button
          type="submit"
          onClick={handleSubmit}
          className="bg-green-600 text-white px-6 py-2 rounded shadow-md"
        >
          Submit
        </button>
        <button
          type="button"
          onClick={handleDownloadPDF}
          className="bg-[var(--primary)] text-white px-6 py-2 rounded shadow-md"
        >
          Download PDF
        </button>
      </div>
    </div>
  );
}
