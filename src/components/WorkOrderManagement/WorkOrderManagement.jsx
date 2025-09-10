import React, { useState } from "react";
import WOData from "./WorkOrderData.json";
import { FaEye, FaEdit } from "react-icons/fa";
import Modal from "../Common/Modal";
import { CiFilter } from "react-icons/ci";
import Select from "react-select";
import JobFormWrap from "./JobFormWrap";
import { Tab } from "@headlessui/react";
import WorkOrderRepairProcess from "./WorkOrderRepairProcess";
import RepairedForm from "./RepairedForm";
import WorkAssignment from "./WorkAssignment";
import { useLocalUserData } from "../Common/UseLocalData";
import { APPURL } from "../Common/AppUrl";
import { getData, getUserRoles } from "../Common/UseFetch";
import { useQuery } from "@tanstack/react-query";

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
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [showTable, setShowTable] = useState(true);
  const SessionData = useLocalUserData();
  const userRoles = getUserRoles();

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
        (!filters.job_sheet_no ||
          item.job_sheet_no
            ?.toLowerCase()
            .includes(filters.job_sheet_no.toLowerCase())) &&
        (!filters.phone_number ||
          item.phone_number
            ?.toLowerCase()
            .includes(filters.phone_number.toLowerCase())) &&
        (!filters.imei_number ||
          item.imei_number
            ?.toLowerCase()
            .includes(filters.imei_number.toLowerCase())) &&
        (!filters.submission_category ||
          item.submission_category === filters.submission_category) &&
        (!filters.repair_category ||
          item.repair_category === filters.repair_category) &&
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

  const {
  data: jobsheet,
  refetch: refetchData,
  isLoading: DataLoading,
} = useQuery({
  queryKey: ["jobsheet"],
  queryFn: () =>
    getData(APPURL.jobSheet, {
      headers: { Authorization: `Token ${SessionData.token}` },
    }),
  enabled: !!SessionData.token,
  staleTime: 60 * 1000,
  cacheTime: 5 * 60 * 1000,
});

  
  return (
    <div className="w-full h-full p-4 bg-white dark:bg-black rounded-lg">
      <div className="flex justify-between flex-wrap gap-2 items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          Work Orders
        </h2>
        <div className="flex gap-2">
          {showTable && (
            <button
              onClick={() => setIsFilterModalOpen(true)}
              className="bg-[var(--primary)] text-white px-4 py-2 rounded hover:bg-[var(--third)]"
              title="Filter"
            >
              <CiFilter className="text-[20px]" />
            </button>
          )}
          {/* Add button only for role 3 */}
          {userRoles.includes(3) && (
            <button
              onClick={() => setShowTable((prev) => !prev)}
              className={`flex items-center gap-2 px-4 py-2 rounded text-white ${
                showTable
                  ? "bg-[var(--primary)] hover:bg-[var(--third)]"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {showTable ? "Add" : "Close"}
            </button>
          )}
        </div>
      </div>

      {showTable ? (
        <div className="overflow-x-auto h-[calc(100vh-200px)] custom-scrollbar">
          <table className="min-w-full table-auto border-collapse border border-gray-200 rounded-lg text-sm md:text-base">
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
                <tr
                  key={index}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <td className="px-6 py-3 text-left">{index + 1}</td>
                  <td className="px-6 py-3 text-left">{val.job_sheet_no || "N/A"}</td>
                  <td className="px-6 py-3 text-left">{val.status || "N/A"}</td>
                  <td className="px-6 py-3 text-left">{val.phone_number || "N/A"}</td>
                  <td className="px-6 py-3 text-left">{formatDateTime(val.receiving_time)}</td>
                  <td className="px-6 py-3 flex gap-2">
                    <button
                      className="p-2 rounded-full bg-purple-100 text-[var(--primary)] dark:text-white border border-[var(--primary)] hover:bg-[var(--primary)] hover:text-white"
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
          <JobFormWrap />
        </div>
      )}

      {/* View Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setEditingField(null);
        }}
        title={
          <h2 className="text-lg font-semibold text-[var(--primary)]">
            Work Order Details
          </h2>
        }
        size="5xl"
      >
        {selectedWorkOrder && (
          <div className="w-full space-y-6 max-h-[75vh] overflow-y-auto">
            {/* Customer & Address Details */}
            <TwoColumnEditableTable
              data={[
                ["Full Name", selectedWorkOrder.full_name, "full_name"],
                ["Contact Number", selectedWorkOrder.contact_no, "contact_no"],
                ["Alternate Number", selectedWorkOrder.alternate_no, "alternate_no"],
                ["Mail ID", selectedWorkOrder.mail_id, "mail_id"],
                ["Communication Channel", selectedWorkOrder.comm_channel, "comm_channel"],
                ["Address Line", selectedWorkOrder.address_line, "address_line"],
                ["City", selectedWorkOrder.city, "city"],
                ["State", selectedWorkOrder.state, "state"],
                ["Pincode", selectedWorkOrder.pincode, "pincode"],
              ]}
              editingField={editingField}
              setEditingField={setEditingField}
              editValue={editValue}
              setEditValue={setEditValue}
              selectedWorkOrder={selectedWorkOrder}
              setSelectedWorkOrder={setSelectedWorkOrder}
              title="Customer & Address Details"
              userRoles={userRoles}
            />

            {/* Tabs */}
            <Tab.Group>
              <Tab.List className="flex space-x-2 border-b border-gray-300 dark:border-gray-700 mb-4">
                <Tab
                  className={({ selected }) =>
                    `px-4 py-2 rounded-t-lg font-medium ${
                      selected
                        ? "bg-[var(--primary)] text-white"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                    }`
                  }
                >
                  Handset Details
                </Tab>

                {userRoles.includes(2) && (
                  <Tab
                    className={({ selected }) =>
                      `px-4 py-2 rounded-t-lg font-medium ${
                        selected
                          ? "bg-[var(--primary)] text-white"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                      }`
                    }
                  >
                    Engineer Diagnostics
                  </Tab>
                )}

                {(userRoles.includes(1) || userRoles.includes(3)) && (
                  <Tab
                    className={({ selected }) =>
                      `px-4 py-2 rounded-t-lg font-medium ${
                        selected
                          ? "bg-[var(--primary)] text-white"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                      }`
                    }
                  >
                    Handover Information
                  </Tab>
                )}
              </Tab.List>

              <Tab.Panels>
                {/* Handset Details */}
                <Tab.Panel>
                  <TwoColumnEditableTable
                    data={[
                      ["IMEI", selectedWorkOrder.imei, "imei"],
                      ["RAM", selectedWorkOrder.ram, "ram"],
                      ["Invoice No", selectedWorkOrder.invoice_no, "invoice_no"],
                      ["Model", selectedWorkOrder.model, "model"],
                      ["Color", selectedWorkOrder.color, "color"],
                      ["Activation Date", selectedWorkOrder.activation_date, "activation_date"],
                      ["Date of Purchase", selectedWorkOrder.dop, "dop"],
                      ["Warranty Status", selectedWorkOrder.warranty_status, "warranty_status"],
                      ["Remarks", selectedWorkOrder.remarks, "remarks"],
                    ]}
                    editingField={editingField}
                    setEditingField={setEditingField}
                    editValue={editValue}
                    setEditValue={setEditValue}
                    selectedWorkOrder={selectedWorkOrder}
                    setSelectedWorkOrder={setSelectedWorkOrder}
                    title="Handset Details"
                    userRoles={userRoles}
                  />

                  {/* WorkAssignment only for role 3 */}
                  {userRoles.includes(3) && <WorkAssignment />}
                </Tab.Panel>

                {/* Engineer Diagnostics only for role 2 */}
                {userRoles.includes(2) && (
                  <Tab.Panel>
                    <div className="bg-white dark:bg-gray-900 border rounded-lg p-2">
                      <WorkOrderRepairProcess />
                    </div>
                  </Tab.Panel>
                )}

                {/* Handover Information only for roles 1 & 3 */}
                {(userRoles.includes(1) || userRoles.includes(3)) && (
                  <Tab.Panel>
                    <div className="bg-white dark:bg-gray-900 border rounded-lg p-2">
                      <RepairedForm />
                    </div>
                  </Tab.Panel>
                )}
              </Tab.Panels>
            </Tab.Group>
          </div>
        )}
      </Modal>

      {/* Filter Modal */}
      <Modal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        size="4xl"
        title={
          <h2 className="text-lg font-semibold text-[var(--primary)]">
            Filter Work Orders
          </h2>
        }
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
              { value: "Not Received", label: "Not Received" },
              { value: "In Repair", label: "In Repair" },
              { value: "Repaired", label: "Repaired" },
              { value: "Handover", label: "Handover" },
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
            className="bg-[var(--primary)] text-white px-4 py-2 rounded hover:bg-[var(--primary)]"
          >
            Search
          </button>
          <button
            onClick={() => {
              handleReset();
              setIsFilterModalOpen(false);
            }}
            className="bg-[var(--secondary)] text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Reset
          </button>
        </div>
      </Modal>
    </div>
  );
}

// Two-column editable table component
function TwoColumnEditableTable({
  data,
  editingField,
  setEditingField,
  editValue,
  setEditValue,
  selectedWorkOrder,
  setSelectedWorkOrder,
  title,
  userRoles,
}) {
  return (
    <div className="bg-white dark:bg-gray-900 border rounded-lg mb-4 p-2">
      <h3 className="px-2 py-2 font-semibold text-[var(--primary)] border-b dark:border-gray-700">
        {title}
      </h3>
      <table className="w-full text-sm text-gray-700 dark:text-gray-300">
        <tbody>
          {data
            .reduce((rows, field, idx, arr) => {
              if (idx % 2 === 0) rows.push(arr.slice(idx, idx + 2)); // 2 per row
              return rows;
            }, [])
            .map((pair, rowIdx) => (
              <tr
                key={rowIdx}
                className={rowIdx % 2 === 0 ? "bg-gray-50 dark:bg-gray-800" : ""}
              >
                {pair.map(([label, value, field], colIdx) => (
                  <React.Fragment key={colIdx}>
                    <td className="px-4 py-2 font-medium w-1/4">{label}</td>
                    <td className="px-4 py-2 w-1/4">
                      {editingField === field ? (
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="w-full px-2 py-1 border rounded text-black"
                        />
                      ) : (
                        value || "Not Available"
                      )}
                    </td>
                    <td className="px-4 py-2 w-12">
                      {userRoles.includes(1) &&
                        (editingField === field ? (
                          <button
                            onClick={() => {
                              const updated = { ...selectedWorkOrder, [field]: editValue };
                              setSelectedWorkOrder(updated);
                              setEditingField(null);
                            }}
                            className="text-green-600 font-semibold"
                          >
                            Save
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setEditingField(field);
                              setEditValue(typeof value === "string" ? value : "");
                            }}
                            className="text-[var(--secondary)] hover:text-gray-800"
                          >
                            <FaEdit size={14} />
                          </button>
                        ))}
                    </td>
                  </React.Fragment>
                ))}
                {pair.length < 2 && (
                  <>
                    <td className="px-4 py-2 w-1/4"></td>
                    <td className="px-4 py-2 w-1/4"></td>
                    <td className="px-4 py-2 w-12"></td>
                  </>
                )}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
