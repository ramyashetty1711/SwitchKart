import React, { useState } from "react";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import Modal from "../Common/Modal";
import Select from "react-select";
import { getUserRoles } from "../Common/UseFetch";

// Sample employee data
const initialUsers = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    role: "Front Desk Executive",
    store: "Store A",
    phone: "9876543210",
    isActive: true,
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    role: "Engineer",
    store: "Store B",
    phone: "9123456789",
    isActive: false,
  },
];

export default function UserManagement() {
  const userRoles = getUserRoles(); // array of role IDs
  const [users, setUsers] = useState(initialUsers);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [editValue, setEditValue] = useState("");

  // Dropdown options
  const roleOptions = [
    { value: "Front Desk Executive", label: "Front Desk Executive" },
    { value: "Engineer", label: "Engineer" },
    { value: "Support Staff", label: "Support Staff" },
  ];

  const storeOptions = [
    { value: "Store A", label: "Store A" },
    { value: "Store B", label: "Store B" },
    { value: "Store C", label: "Store C" },
  ];

  const statusOptions = [
    { value: true, label: "Active" },
    { value: false, label: "Inactive" },
  ];

  // Handlers
  const handleView = (user) => {
    setSelectedUser(user);
    setIsViewModalOpen(true);
  };

  const handleDelete = (user) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    setUsers((prev) => prev.filter((u) => u.id !== selectedUser.id));
    setIsDeleteModalOpen(false);
  };

  return (
    <div className="w-full h-full p-4 bg-white dark:bg-gray-900 rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          User Management
        </h2>
      </div>

      {/* User Table */}
      <div className="overflow-x-auto max-h-[65vh] custom-scrollbar mt-2">
        <table className="min-w-full table-auto border-collapse border border-gray-200 shadow-md rounded-lg overflow-hidden">
          <thead className="bg-purple-100 text-[var(--primary)] dark:text-gray-100 sticky top-0 z-10">
            <tr>
              <th className="px-4 py-2 text-left font-medium">S.No</th>
              <th className="px-4 py-2 text-left font-medium">Name</th>
              <th className="px-4 py-2 text-left font-medium">Email</th>
              <th className="px-4 py-2 text-left font-medium">Role</th>
              <th className="px-4 py-2 text-left font-medium">Store</th>
              <th className="px-4 py-2 text-left font-medium">Status</th>
              <th className="px-4 py-2 text-left font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200">
            {users.map((user, index) => (
              <tr
                key={user.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">{user.name}</td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2">{user.role}</td>
                <td className="px-4 py-2">{user.store}</td>
                <td className="px-4 py-2">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      user.isActive
                        ? "bg-green-100 text-green-700 dark:bg-green-700 dark:text-white"
                        : "bg-red-100 text-red-700 dark:bg-red-700 dark:text-white"
                    }`}
                  >
                    {user.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-2 flex gap-2">
                  <button
                    title="View"
                    className="p-2 rounded-full bg-purple-100 text-[var(--primary)] border border-[var(--primary)] hover:bg-[var(--third)] hover:text-white transition-all"
                    onClick={() => handleView(user)}
                  >
                    <FaEye size={16} />
                  </button>
                  {userRoles.includes(1) && (
                    <button
                      title="Delete"
                      className="p-2 rounded-full bg-red-100 text-red-700 border border-red-400 hover:bg-red-600 hover:text-white transition-all"
                      onClick={() => handleDelete(user)}
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

      {/* View Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={
          userRoles.includes(1)
            ? () => {
                setIsViewModalOpen(false);
                setEditingField(null);
              }
            : undefined
        }
        title={
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-[var(--primary)]">
              User Details
            </h2>
            {userRoles.includes(1) && (
              <button
                onClick={() => {
                  setIsViewModalOpen(false);
                  setEditingField(null);
                }}
                className="text-red-600 hover:text-red-800 font-semibold text-sm"
              >
                Exit
              </button>
            )}
          </div>
        }
        size="xl"
      >
        {selectedUser && (
          <div className="space-y-6 max-h-[70vh] overflow-y-auto px-1">
            {[
              {
                title: "Basic Info",
                rows: [
                  ["Name", selectedUser.name, "name"],
                  ["Email", selectedUser.email, "email"],
                  ["Phone", selectedUser.phone || "Not Available", "phone"],
                  ["Role", selectedUser.role, "role"],
                  ["Store", selectedUser.store, "store"],
                  ["Status", selectedUser.isActive, "isActive"],
                ],
              },
            ].map((section, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg shadow-md"
              >
                <div className="bg-purple-100 px-4 py-2 rounded-t-lg flex justify-between items-center">
                  <h3 className="text-md font-semibold text-[var(--primary)] dark:text-white">
                    {section.title}
                  </h3>
                </div>
                <table className="w-full text-sm">
                  <tbody>
                    {section.rows.map(([label, value, field], i) => (
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
                          {editingField === field && userRoles.includes(1) ? (
                            field === "role" ? (
                              <Select
                                options={roleOptions}
                                value={roleOptions.find(
                                  (opt) => opt.value === editValue
                                )}
                                onChange={(selected) =>
                                  setEditValue(selected.value)
                                }
                              />
                            ) : field === "store" ? (
                              <Select
                                options={storeOptions}
                                value={storeOptions.find(
                                  (opt) => opt.value === editValue
                                )}
                                onChange={(selected) =>
                                  setEditValue(selected.value)
                                }
                              />
                            ) : field === "isActive" ? (
                              <Select
                                options={statusOptions}
                                value={statusOptions.find(
                                  (opt) => opt.value === editValue
                                )}
                                onChange={(selected) =>
                                  setEditValue(selected.value)
                                }
                              />
                            ) : (
                              <input
                                type="text"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                className="w-full px-2 py-1 border border-gray-300 rounded"
                              />
                            )
                          ) : field === "isActive" ? (
                            value ? "Active" : "Inactive"
                          ) : (
                            value
                          )}
                        </td>
                        <td className="py-2 px-4 text-right border-t border-gray-200 dark:border-gray-700 w-10">
                          {userRoles.includes(1) &&
                            (editingField === field ? (
                              <button
                                onClick={() => {
                                  const updatedUser = {
                                    ...selectedUser,
                                    [field]:
                                      field === "isActive"
                                        ? editValue
                                        : editValue,
                                  };
                                  setSelectedUser(updatedUser);
                                  setUsers((prev) =>
                                    prev.map((u) =>
                                      u.id === updatedUser.id
                                        ? updatedUser
                                        : u
                                    )
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
                                  setEditValue(
                                    field === "isActive" ? value : value
                                  );
                                }}
                                className="text-[var(--secondary)] hover:text-gray-800"
                              >
                                <FaEdit size={14} />
                              </button>
                            ))}
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

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title={
          <h2 className="text-lg font-semibold text-red-600">
            Confirm Deletion
          </h2>
        }
      >
        <div className="text-gray-800 dark:text-gray-100 p-4">
          <p>
            Are you sure you want to delete{" "}
            <strong>{selectedUser?.name}</strong>?
          </p>
          <div className="mt-6 flex justify-end gap-4">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white rounded hover:bg-gray-400 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            {userRoles.includes(1) && (
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Confirm Delete
              </button>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}
