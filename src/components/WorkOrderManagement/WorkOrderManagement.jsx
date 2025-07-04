import React, { useState } from "react";
import WOData from "./WorkOrderData.json";
import { FaEye, FaEdit, FaPlus } from "react-icons/fa";
import Modal from "../Common/Modal";
import { CiFilter } from "react-icons/ci";
import DynamicDeviceForm from "./WorksheetForm";
import Select from "react-select";
import JobFormWrap from "./JobFormWrap";


export default function WorkOrderManagement() {
  const [storeData, setStoreData] = useState(WOData);
  const [filteredData, setFilteredData] = useState(WOData);
  const [editingField, setEditingField] = useState(null);
const [editValue, setEditValue] = useState("");
  const [filters, setFilters] = useState({
    job_sheet_no: "",
    phone_number: "",
    imei_number: "",
    submission_category: "",
    repair_category: "",
    status: "",
  });

  const [selectedWorkOrder, setSelectedWorkOrder] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [showTable, setShowTable] = useState(true); // Toggle between table and form

  const handleEdit = (order) => {
    setSelectedWorkOrder({ ...order });
    setIsEditModalOpen(true);
  };

  const handleEditSave = () => {
    setStoreData((prev) =>
      prev.map((order) =>
        order.id === selectedWorkOrder.id ? selectedWorkOrder : order
      )
    );
    setIsEditModalOpen(false);
  };

  const formatDateTime = (datetime) => {
    return datetime
      ? new Date(datetime).toLocaleString("en-IN", {
          dateStyle: "medium",
          timeStyle: "short",
        })
      : "N/A";
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleSearch = () => {
    const filtered = storeData.filter((item) => {
      return (
        (!filters.job_sheet_no || item.job_sheet_no?.toLowerCase().includes(filters.job_sheet_no.toLowerCase())) &&
        (!filters.phone_number || item.phone_number?.toLowerCase().includes(filters.phone_number.toLowerCase())) &&
        (!filters.imei_number || item.imei_number?.toLowerCase().includes(filters.imei_number.toLowerCase())) &&
        (!filters.submission_category || item.submission_category === filters.submission_category) &&
        (!filters.repair_category || item.repair_category === filters.repair_category) &&
        (!filters.status || item.status === filters.status)
      );
    });
    setFilteredData(filtered);
  };

  const handleReset = () => {
    setFilters({
      job_sheet_no: "",
      phone_number: "",
      imei_number: "",
      submission_category: "",
      repair_category: "",
      status: "",
    });
    setFilteredData(storeData);
  };

  return (
    <div className="w-full h-full p-4 bg-white dark:bg-black rounded-lg">
      <div className="flex justify-between flex-wrap gap-2 items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Work Orders</h2>
        <div className="flex gap-2">
          {showTable && (
            <button
              onClick={() => setIsFilterModalOpen(true)}
              className="bg-[var(--secondary)] text-white px-4 py-2 rounded hover:bg-[var(--primary)]"
              title="Filter"
            >
              <CiFilter className="text-[20px] " />
            </button>
          )}
          <button
            onClick={() => setShowTable((prev) => !prev)}
            className={`flex items-center gap-2 px-4 py-2 rounded shadow text-white ${
              showTable ? "bg-[var(--secondary)] hover:bg-[var(--primary)]" : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {showTable ? <><FaPlus /> Add</> : "Close"}
          </button>
        </div>
      </div>

      {showTable ? (
        <div className="overflow-x-auto max-h-[68vh] custom-scrollbar">
          <table className="min-w-full table-auto border-collapse border border-gray-200 shadow-md rounded-lg text-sm md:text-base">
  <thead className="bg-purple-100 dark:bg-[var(--primary)] text-[var(--primary)] dark:text-gray-200 sticky top-0 z-10">
    <tr>
      <th className="px-6 py-3 text-left">S.No</th>
      <th className="px-6 py-3 text-left">Job Sheet Number</th>
      <th className="px-6 py-3 text-left">Status</th>
      <th className="px-6 py-3 text-left">Phone Number</th>
      <th className="px-6 py-3 text-left">Receiving Time</th>
      <th className="px-6 py-3 text-left">Actions</th>
    </tr>
  </thead>
  <tbody className="divide-y divide-gray-200 bg-white dark:bg-gray-900 dark:text-gray-300 text-gray-700">
    {filteredData.map((val, index) => (
      <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
        <td className="px-6 py-3 text-left">{index + 1}</td>
        <td className="px-6 py-3 text-left">{val.job_sheet_no || "N/A"}</td>
        <td className="px-6 py-3 text-left">{val.status || "N/A"}</td>
        <td className="px-6 py-3 text-left">{val.phone_number || "N/A"}</td>
        <td className="px-6 py-3 text-left">{formatDateTime(val.receiving_time)}</td>
        <td className="px-6 py-3 flex gap-2">
          <button
            className="p-2 rounded-full bg-purple-100 text-[var(--primary)] dark:bg-[var(--primary)] dark:text-white border border-purple-400 hover:bg-[var(--secondary)] hover:text-white"
            onClick={() => {
              setSelectedWorkOrder(val);
              setIsViewModalOpen(true);
            }}
          >
            <FaEye />
          </button>
         
        </td>
      </tr>
    ))}
  </tbody>
</table>

        </div>
      ) : (
        <div className="h-[67vh] rounded-lg">
         <JobFormWrap/>
        </div>
      )}

      {/* View Modal */}
    

<Modal
  isOpen={isViewModalOpen}
  onClose={() => {
    setIsViewModalOpen(false);
    setEditingField(null);
  }}
  title={<h2 className="text-lg font-semibold text-[var(--primary)]">Work Order Details</h2>}
  size="xl"
>
  {selectedWorkOrder && (
    <div className="space-y-6 max-h-[70vh] overflow-y-auto px-1">
      {[
        {
          title: "Job Info",
          rows: [
            ["Job Sheet Number", selectedWorkOrder.job_sheet_no, "job_sheet_no", "text"],
            ["Category of Job Sheet", selectedWorkOrder.category_of_jobsheet, "category_of_jobsheet", "text"],
            ["Submission Category", selectedWorkOrder.submission_category, "submission_category", "select", ["Walk-In", "Pickup", "Courier"]],
            ["Repair Category", selectedWorkOrder.repair_category, "repair_category", "select", ["Software", "Hardware", "Replacement"]],
            ["Status", selectedWorkOrder.status, "status", "select", ["Received", "In Progress", "Completed", "Delivered", "Closed"]],
            ["RVS Status", selectedWorkOrder.rvs_status, "rvs_status", "text"],
          ],
        },
        {
          title: "Customer Info",
          rows: [
            ["Phone Number", selectedWorkOrder.phone_number, "phone_number", "text"],
            ["IMEI Number", selectedWorkOrder.imei_number, "imei_number", "text"],
          ],
        },
        {
          title: "Additional Info",
          rows: [
            ["Receiving Time", formatDateTime(selectedWorkOrder.receiving_time), "receiving_time", "text"],
            ["Invoice Number", selectedWorkOrder.invoice_no, "invoice_no", "text"],
            ["Handle Method", selectedWorkOrder.handle_method, "handle_method", "text"],
            ["Source of Creation", selectedWorkOrder.source_of_creation, "source_of_creation", "text"],
          ],
        },
      ].map((section, idx) => (
        <div
          key={idx}
          className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg shadow-md"
        >
          <div className="bg-purple-100 dark:bg-[var(--primary)] px-4 py-2 rounded-t-lg flex justify-between items-center">
            <h3 className="text-md font-semibold text-[var(--primary)] dark:text-white">{section.title}</h3>
          </div>
          <table className="w-full text-sm">
            <tbody>
              {section.rows.map(([label, value, field, type, options = []], i) => (
                <tr
                  key={i}
                  className={
                    i % 2 === 0
                      ? "bg-gray-50 dark:bg-gray-800"
                      : "bg-white dark:bg-gray-900"
                  }
                >
                  <td className="py-2 px-4 font-medium text-gray-600 dark:text-gray-300 border-t border-gray-200 dark:border-gray-700 w-1/3">
                    {label}
                  </td>
                  <td className="py-2 px-4 text-gray-800 dark:text-gray-100 border-t border-gray-200 dark:border-gray-700">
                    {editingField === field ? (
                      type === "select" ? (
                        <Select
                          className="text-black"
                          defaultValue={{ label: selectedWorkOrder[field], value: selectedWorkOrder[field] }}
                          options={options.map((opt) => ({
                            label: opt,
                            value: opt,
                          }))}
                          onChange={(selected) => setEditValue(selected.value)}
                        />
                      ) : (
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-black"
                        />
                      )
                    ) : (
                      value || "Not Available"
                    )}
                  </td>
                  <td className="py-2 px-4 text-right border-t border-gray-200 dark:border-gray-700 w-10">
                    {editingField === field ? (
                      <button
                        onClick={() => {
                          const updated = { ...selectedWorkOrder, [field]: editValue };
                          setSelectedWorkOrder(updated);
                          setEditingField(null);
                        }}
                        className="text-green-600 hover:text-green-800 font-semibold text-sm"
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        title={`Edit ${label}`}
                        onClick={() => {
                          setEditingField(field);
                          setEditValue(
                            typeof value === "string" ? value : ""
                          );
                        }}
                        className="text-yellow-600 hover:text-yellow-800"
                      >
                        <FaEdit size={14} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  )}
</Modal>


     
      <Modal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        size="4xl"
        title={<h2 className="text-lg font-semibold text-[var(--primary)]">Filter Work Orders</h2>}
      >
        <div className="grid md:grid-cols-3 gap-4">
          <input
            name="job_sheet_no"
            value={filters.job_sheet_no}
            onChange={handleInputChange}
            className="p-2 border rounded w-full text-black"
            placeholder="Job Sheet Number"
          />
          <input
            name="phone_number"
            value={filters.phone_number}
            onChange={handleInputChange}
            className="p-2 border rounded w-full text-black"
            placeholder="Phone Number"
          />
          <input
            name="imei_number"
            value={filters.imei_number}
            onChange={handleInputChange}
            className="p-2 border rounded w-full text-black"
            placeholder="IMEI Number"
          />
          <Select
            options={[
              { value: "", label: "All Submission Categories" },
              { value: "Walk-In", label: "Walk-In" },
              { value: "Pickup", label: "Pickup" },
              { value: "Courier", label: "Courier" },
            ]}
            value={{
              value: filters.submission_category,
              label: filters.submission_category || "All Submission Categories",
            }}
            onChange={(selected) =>
              setFilters({ ...filters, submission_category: selected.value })
            }
            className="text-black"
          />
          <Select
            options={[
              { value: "", label: "All Repair Categories" },
              { value: "Software", label: "Software" },
              { value: "Hardware", label: "Hardware" },
              { value: "Replacement", label: "Replacement" },
            ]}
            value={{
              value: filters.repair_category,
              label: filters.repair_category || "All Repair Categories",
            }}
            onChange={(selected) =>
              setFilters({ ...filters, repair_category: selected.value })
            }
            className="text-black"
          />
          <Select
            options={[
              { value: "", label: "All Statuses" },
              { value: "Received", label: "Received" },
              { value: "In Progress", label: "In Progress" },
              { value: "Completed", label: "Completed" },
              { value: "Delivered", label: "Delivered" },
              { value: "Closed", label: "Closed" },
            ]}
            value={{
              value: filters.status,
              label: filters.status || "All Statuses",
            }}
            onChange={(selected) =>
              setFilters({ ...filters, status: selected.value })
            }
            className="text-black"
          />
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={() => {
              handleSearch();
              setIsFilterModalOpen(false);
            }}
            className="bg-[var(--secondary)] text-white px-4 py-2 rounded hover:bg-[var(--primary)]"
          >
            Search
          </button>
          <button
            onClick={() => {
              handleReset();
              setIsFilterModalOpen(false);
            }}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Reset
          </button>
        </div>
      </Modal>
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div>
      <p className="text-sm font-medium">{label}</p>
      <p className="text-base">{value || "N/A"}</p>
    </div>
  );
}
