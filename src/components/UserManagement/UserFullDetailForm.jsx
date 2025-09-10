import React, { useState } from "react";
import Select from "react-select";

export default function UserFullDetailForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: null,
    isActive: { label: "Active", value: true },
  });

  const [errors, setErrors] = useState({});

  // Validation
  const validate = () => {
    const err = {};
    if (!form.name.trim()) err.name = "User name is required";
    if (!form.email.trim()) err.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) err.email = "Invalid email format";
    if (!form.phone.trim()) err.phone = "Phone number is required";
    if (!form.role) err.role = "Role is required";
    if (!form.isActive) err.isActive = "Please select status";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  // Handle submit
  const handleSubmit = () => {
    if (!validate()) return;

    const payload = {
      id: Date.now(),
      name: form.name,
      email: form.email,
      phone: form.phone,
      role: form.role.value,
      isActive: form.isActive.value,
    };

    console.log("User added:", payload);

    setForm({
      name: "",
      email: "",
      phone: "",
      role: null,
      isActive: { label: "Active", value: true },
    });
    setErrors({});
    alert("User added successfully!");
  };

  // Reusable input
  const renderInput = (label, key, type = "text") => (
    <div>
      <label className="block mb-1 text-sm font-medium text-[var(--secondary)] dark:text-gray-300">
        {label}
      </label>
      <input
        type={type}
        value={form[key]}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        className={`w-full px-4 py-2 text-sm rounded-md border ${
          errors[key] ? "border-red-500" : "border-gray-300"
        } dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500`}
      />
      {errors[key] && <p className="text-red-500 text-sm">{errors[key]}</p>}
    </div>
  );

  const statusOptions = [
    { label: "Active", value: true },
    { label: "Inactive", value: false },
  ];

  const roleOptions = [
    { value: "Front Desk Executive", label: "Front Desk Executive" },
    { value: "Engineer", label: "Engineer" },
    { value: "Support Staff", label: "Support Staff" },
    { value: "Manager", label: "Manager" },
  ];

  return (
    <div className="mx-auto overflow-x-auto h-[calc(100vh-100px)] custom-scrollbar bg-white dark:bg-gray-900 p-6 rounded-lg text-black ">
      <h2 className="text-2xl font-semibold text-purple-700 mb-6">Add User Details</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderInput("Full Name", "name")}
        {renderInput("Email", "email", "email")}
        {renderInput("Phone Number", "phone")}

        {/* Role Dropdown */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            Role
          </label>
          <Select
            options={roleOptions}
            value={form.role}
            onChange={(selectedOption) => setForm({ ...form, role: selectedOption })}
            placeholder="Select role"
            className="text-sm"
          />
          {errors.role && <p className="text-red-500 text-sm">{errors.role}</p>}
        </div>

        {/* Active Status Select */}
        <div>
          <label className="block mb-1 text-sm font-medium text-[var(--secondary)] dark:text-gray-300">
            Active Status
          </label>
          <Select
            options={statusOptions}
            value={form.isActive}
            onChange={(selectedOption) =>
              setForm({ ...form, isActive: selectedOption })
            }
            className="text-sm"
          />
          {errors.isActive && (
            <p className="text-red-500 text-sm">{errors.isActive}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end mt-8">
        <button
          onClick={handleSubmit}
          className="bg-[var(--primary)] hover:bg-[var(--third)] text-white font-semibold px-6 py-2 rounded-md transition-all duration-200"
        >
          Add User
        </button>
      </div>
    </div>
  );
}
