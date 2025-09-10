import React, { useState } from "react";
import Select from "react-select";

export default function StoreFullDetailForm({ onAddStore }) {
  const [form, setForm] = useState({
    name: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    phone: "",
    timing: "",
    mapLink: "",
    isActive: { label: "Active", value: true },
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const err = {};
    if (!form.name.trim()) err.name = "Store name is required";
    if (!form.street.trim()) err.street = "Street address is required";
    if (!form.city.trim()) err.city = "City is required";
    if (!form.state.trim()) err.state = "State is required";
    if (!form.postalCode.trim()) err.postalCode = "Postal code is required";
    if (!form.country.trim()) err.country = "Country is required";
    if (!form.phone.trim()) err.phone = "Phone number is required";
    if (!form.timing.trim()) err.timing = "Store timing is required";
    if (!form.mapLink.trim()) err.mapLink = "Google Maps link is required";
    if (!form.isActive) err.isActive = "Please select store status";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const payload = {
      id: Date.now(),
      name: form.name,
      phone: form.phone,
      timing: form.timing,
      mapLink: form.mapLink,
      isActive: form.isActive.value,
      address: {
        street: form.street,
        city: form.city,
        state: form.state,
        postalCode: form.postalCode,
        country: form.country,
      },
    };

    onAddStore(payload);

    setForm({
      name: "",
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
      phone: "",
      timing: "",
      mapLink: "",
      isActive: { label: "Active", value: true },
    });

    setErrors({});
    alert("Store added successfully!");
  };

  const renderInput = (label, key, type = "text") => (
    <div>
      <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
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

  return (
    <div className="mx-auto  overflow-x-auto max-h-[65vh] custom-scrollbar bg-white dark:bg-gray-900 p-4 rounded-lg text-black">
      <h2 className="text-2xl font-semibold text-purple-700 mb-6">Add Store Details</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderInput("Store Name", "name")}
        {renderInput("Phone Number", "phone")}
        {renderInput("Store Timings", "timing")}
        {renderInput("Street Address", "street")}
        {renderInput("City", "city")}
        {renderInput("State", "state")}
        {renderInput("Postal Code", "postalCode")}
        {renderInput("Country", "country")}
        {renderInput("Google Maps Link", "mapLink")}

        {/* Active Status Select */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Active Status</label>
          <Select
            options={statusOptions}
            value={form.isActive}
            onChange={(selectedOption) => setForm({ ...form, isActive: selectedOption })}
            className="text-sm"
          />
          {errors.isActive && <p className="text-red-500 text-sm">{errors.isActive}</p>}
        </div>
      </div>

      <div className="flex justify-end mt-8">
        <button
          onClick={handleSubmit}
          className="bg-[var(--primary)] hover:bg-[var(--third)] text-white font-semibold px-6 py-2 rounded-md transition-all duration-200"
        >
          Add Store
        </button>
      </div>
    </div>
  );
}
