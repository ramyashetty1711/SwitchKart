import React, { useState } from "react";
import { FaEye, FaTrash, FaEdit } from "react-icons/fa";
import Modal from "../Common/Modal";
import Select from "react-select";
import StoreAdditionForm from "./StoreAdditionForm";
import { getUserRoles } from "../Common/UseFetch";

// Sample store data
const initialStores = [
  {
    id: 1,
    name: "Switch Kart - MG Road",
    address: "123 MG Road, Bengaluru, Karnataka - 560001",
    isActive: true,
    phone: "080-12345678",
    email: "mgroad@switchkart.com",
    manager: "Rajesh Kumar",
    established: "2018-04-15",
    gstNumber: "29ABCDE1234F1Z5",
    storeType: "Retail Outlet",
    staffCount: 15,
    services: ["Repair", "Sales", "Pickup"],
    customersServed: 12000,
    avgServiceTime: "30 mins",
    rating: 4.5,
    timing: "9 AM - 9 PM",
    mapLink: "https://maps.google.com/?q=Switch+Kart+MG+Road",
  },
  {
    id: 2,
    name: "Switch Kart - T Nagar",
    address: "45 North Usman Road, Chennai, Tamil Nadu - 600017",
    isActive: true,
    phone: "044-23456789",
    email: "tnagar@switchkart.com",
    manager: "S. Ramya",
    established: "2017-11-05",
    gstNumber: "33ABCDE1234F1Z5",
    storeType: "Franchise",
    staffCount: 12,
    services: ["Sales", "Service"],
    customersServed: 9500,
    avgServiceTime: "35 mins",
    rating: 4.2,
    timing: "10 AM - 8 PM",
    mapLink: "https://maps.google.com/?q=Switch+Kart+T+Nagar",
  },
];

export default function StoreManagement() {
  const userRoles = getUserRoles();
  const [storeData, setStoreData] = useState(initialStores);
  const [selectedStore, setSelectedStore] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [editValue, setEditValue] = useState("");

  const statusOptions = [
    { value: true, label: "Active" },
    { value: false, label: "Inactive" },
  ];

  const storeTypeOptions = [
    { value: "Retail Outlet", label: "Retail Outlet" },
    { value: "Warehouse", label: "Warehouse" },
    { value: "Franchise", label: "Franchise" },
  ];

  // Handlers
  const handleView = (store) => {
    setSelectedStore(store);
    setIsViewModalOpen(true);
  };

  const handleDelete = (store) => {
    setSelectedStore(store);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    setStoreData((prev) => prev.filter((s) => s.id !== selectedStore.id));
    setIsDeleteModalOpen(false);
  };

  const handleAddStore = (newStore) => {
    const newId = Math.max(...storeData.map((s) => s.id)) + 1;
    setStoreData((prev) => [...prev, { id: newId, ...newStore }]);
    setShowAddForm(false);
  };

  // Editable field renderer
  const renderEditableField = (field, value) => {
    if (editingField === field && userRoles.includes(1)) {
      if (field === "isActive") {
        return (
          <Select
            options={statusOptions}
            value={statusOptions.find((opt) => opt.value === editValue)}
            onChange={(selected) => setEditValue(selected.value)}
          />
        );
      } else if (field === "storeType") {
        return (
          <Select
            options={storeTypeOptions}
            value={storeTypeOptions.find((opt) => opt.value === editValue)}
            onChange={(selected) => setEditValue(selected.value)}
          />
        );
      } else if (field === "services") {
        return (
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="w-full px-2 py-1 border border-gray-300 rounded"
          />
        );
      } else {
        return (
          <input
            type={
              field === "rating" || field === "staffCount" || field === "customersServed"
                ? "number"
                : "text"
            }
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="w-full px-2 py-1 border border-gray-300 rounded"
          />
        );
      }
    } else {
      if (field === "isActive") return value ? "Active" : "Inactive";
      if (field === "services") return value.join(", ");
      return value;
    }
  };

  return (
    <div className="w-full h-full p-4 bg-white dark:bg-gray-900 rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          Store Management
        </h2>
       {userRoles.includes(1) && (
         <button
          onClick={() => setShowAddForm(!showAddForm)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
            showAddForm
              ? "bg-red-600 text-white hover:bg-red-700"
              : "bg-[var(--primary)] text-white hover:bg-[var(--third)]"
          }`}
        >
          {showAddForm ? "Close" : "Add Store"}
        </button>
       )}
      </div>

      {showAddForm && (
        <div className="mb-6">
          <StoreAdditionForm onAddStore={handleAddStore} />
        </div>
      )}

      {!showAddForm && (
        <div className="overflow-x-auto max-h-[65vh] custom-scrollbar mt-2">
          <table className="min-w-full table-auto border-collapse border border-gray-200 shadow-md rounded-lg overflow-hidden">
            <thead className="bg-purple-100 text-[var(--primary)] dark:text-gray-100 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-2 text-left font-medium">S.No</th>
                <th className="px-4 py-2 text-left font-medium">Store Name</th>
                <th className="px-4 py-2 text-left font-medium">Address</th>
                <th className="px-4 py-2 text-left font-medium">Status</th>
                <th className="px-4 py-2 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200">
              {storeData.map((store, index) => (
                <tr
                  key={store.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{store.name}</td>
                  <td className="px-4 py-2">{store.address}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                        store.isActive
                          ? "bg-green-100 text-green-700 dark:bg-green-700 dark:text-white"
                          : "bg-red-100 text-red-700 dark:bg-red-700 dark:text-white"
                      }`}
                    >
                      {store.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-2 flex gap-2">
                    <button
                      title="View"
                      className="p-2 rounded-full bg-purple-100 text-[var(--primary)] border border-[var(--primary)] hover:bg-[var(--third)] hover:text-white transition-all"
                      onClick={() => handleView(store)}
                    >
                      <FaEye size={16} />
                    </button>
                    {userRoles.includes(1) && (
                      <button
                        title="Delete"
                        className="p-2 rounded-full bg-red-100 text-red-700 border border-red-400 hover:bg-red-600 hover:text-white transition-all"
                        onClick={() => handleDelete(store)}
                      >
                        <FaTrash size={16} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* View Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={userRoles.includes(1) ? () => { setIsViewModalOpen(false); setEditingField(null); } : undefined}
        title={
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-[var(--primary)]">Store Details</h2>
            
          </div>
        }
        size="xl"
      >
        {selectedStore && (
          <div className="space-y-6 max-h-[70vh] overflow-y-auto px-1">
            <div className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg shadow-md">
              <div className="bg-purple-100 px-4 py-2 rounded-t-lg flex justify-between items-center">
                <h3 className="text-md font-semibold text-[var(--primary)] dark:text-white">
                  Basic Info
                </h3>
              </div>
              <table className="w-full text-sm">
                <tbody>
                  {[
                    ["Store Name", selectedStore.name, "name"],
                    ["Address", selectedStore.address, "address"],
                    ["Status", selectedStore.isActive, "isActive"],
                    ["Phone", selectedStore.phone, "phone"],
                    ["Email", selectedStore.email, "email"],
                    ["Manager", selectedStore.manager, "manager"],
                    ["Established", selectedStore.established, "established"],
                    ["GST Number", selectedStore.gstNumber, "gstNumber"],
                    ["Store Type", selectedStore.storeType, "storeType"],
                    ["Staff Count", selectedStore.staffCount, "staffCount"],
                    ["Services", selectedStore.services, "services"],
                    ["Customers Served", selectedStore.customersServed, "customersServed"],
                    ["Avg Service Time", selectedStore.avgServiceTime, "avgServiceTime"],
                    ["Rating", selectedStore.rating, "rating"],
                    ["Timing", selectedStore.timing, "timing"],
                    ["Map Link", selectedStore.mapLink, "mapLink"],
                  ].map(([label, value, field], i) => (
                    <tr
                      key={i}
                      className={i % 2 === 0 ? "bg-gray-50 dark:bg-gray-800" : "bg-white dark:bg-gray-900"}
                    >
                      <td className="py-2 px-4 font-medium text-gray-600 dark:text-gray-300 border-t border-gray-200 dark:border-gray-700 w-1/3">
                        {label}
                      </td>
                      <td className="py-2 px-4 text-gray-800 dark:text-gray-100 border-t border-gray-200 dark:border-gray-700">
                        {renderEditableField(field, value)}
                      </td>
                      <td className="py-2 px-4 text-right border-t border-gray-200 dark:border-gray-700 w-10">
                        {userRoles.includes(1) && (
                          editingField === field ? (
                            <button
                              onClick={() => {
                                const updatedStore = {
                                  ...selectedStore,
                                  [field]: field === "services" ? editValue.split(",").map(s => s.trim()) : editValue
                                };
                                setSelectedStore(updatedStore);
                                setStoreData((prev) =>
                                  prev.map((s) => (s.id === updatedStore.id ? updatedStore : s))
                                );
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
                                setEditValue(field === "services" ? value.join(", ") : value);
                              }}
                              className="text-[var(--secondary)] hover:text-gray-800"
                            >
                              <FaEdit size={14} />
                            </button>
                          )
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title={<h2 className="text-lg font-semibold text-red-600">Confirm Deletion</h2>}
      >
        <div className="text-gray-800 dark:text-gray-100 p-4">
          <p>Are you sure you want to delete <strong>{selectedStore?.name}</strong>?</p>
          <div className="mt-6 flex justify-end gap-4">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white rounded hover:bg-gray-400 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmDelete}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Confirm Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
