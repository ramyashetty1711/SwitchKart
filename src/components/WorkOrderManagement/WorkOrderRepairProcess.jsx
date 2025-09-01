import React, { useState } from "react";
import Select from "react-select";
import { FaPlus, FaMinus, FaSearch } from "react-icons/fa";

// 🔧 Mock part lookup function
const mockPartLookup = (partId) => {
  const parts = {
    P001: {
      name: "Charging Port",
      description: "Original charging port",
      replacedBy: "Engineer A",
      replacementDate: "2025-06-28",
      quality: "High",
      cost: "₹450",
    },
    P002: {
      name: "Battery",
      description: "High capacity battery",
      replacedBy: "Engineer B",
      replacementDate: "2025-06-28",
      quality: "Medium",
      cost: "₹750",
    },
    P003: {
      name: "Display Screen",
      description: "AMOLED screen",
      replacedBy: "Engineer C",
      replacementDate: "2025-06-28",
      quality: "High",
      cost: "₹1,500",
    },
  };
  return parts[partId] || null;
};

export default function WorkOrderRepairProcess() {
  const [parts, setParts] = useState([{ partId: "", data: {} }]);
  const [resolutionMethod, setResolutionMethod] = useState(null);
  const [malfunctionCategory, setMalfunctionCategory] = useState(null);

  const handlePartIdChange = (index, value) => {
    const updated = [...parts];
    updated[index].partId = value;
    setParts(updated);
  };

  const fetchPartDetails = (index) => {
    const part = mockPartLookup(parts[index].partId);
    const updated = [...parts];
    updated[index].data = part || {};
    setParts(updated);
  };

  const addPartField = () => {
    setParts([...parts, { partId: "", data: {} }]);
  };

  const removePartField = (index) => {
    setParts(parts.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6 px-6 py-0 bg-white rounded h-full overflow-y-auto custom-scrollbar">
      {/* Job Sheet Info */}
      {/* <section className="space-y-4">
        <h3 className="text-xl font-bold text-[var(--primary)] border-b pb-2">
          Job Sheet Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField label="Job Sheet Number" />
          <DisplayField label="Problem Title" value="Battery not charging" />
          <DisplayField
            label="Remarks"
            multiline
            value="Customer reported intermittent charging issue. Initial inspection shows corrosion on port."
          />
        </div>
      </section> */}

      {/* Diagnose Info */}
      <section className="space-y-4 mt-5">
        <h3 className="px-2 py-2 font-semibold text-[var(--primary)] border-b dark:border-gray-700">
          Engineer Diagnose Info
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SelectField
            label="Resolution Method"
            options={["Hardware", "Software"]}
            selected={resolutionMethod}
            setSelected={setResolutionMethod}
          />
          <SelectField
            label="Malfunction Category"
            options={[
              "Replaced Part",
              "Re-fix",
              "Dust clean",
              "Battery Activation",
              "Software update",
            ]}
            selected={malfunctionCategory}
            setSelected={setMalfunctionCategory}
          />
        </div>
      </section>

      {/* Parts Replacement */}
      <section className="space-y-4 mt-5">
        <h3 className="px-2 py-2 font-semibold text-[var(--primary)] border-b dark:border-gray-700">
          Parts Replacement Info
        </h3>
        {parts.map((partEntry, index) => (
          <div
            key={index}
            className="p-4 mb-6 bg-gray-50 rounded border shadow-sm"
          >
            <div className="flex items-end gap-3 mb-4">
              <div className="flex-grow">
                <label className="block text-sm font-medium text-[var(--secondary)] mb-1">
                  Part ID
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. P001"
                    className="border p-2 w-full rounded text-black"
                    value={partEntry.partId}
                    onChange={(e) => handlePartIdChange(index, e.target.value)}
                  />
                  {/* Uniform Buttons */}
                  <button
                    type="button"
                    onClick={() => fetchPartDetails(index)}
                    className="bg-[var(--secondary)] hover:bg-[var(--primary)] text-white flex items-center justify-center w-10 h-10 rounded"
                    title="Fetch Part Details"
                  >
                    <FaSearch />
                  </button>
                  {parts.length > 1 && (
                    <button
                      onClick={() => removePartField(index)}
                      className="bg-red-500 hover:bg-red-600 text-white flex items-center justify-center w-10 h-10 rounded"
                    >
                      <FaMinus />
                    </button>
                  )}
                  {index === parts.length - 1 && (
                    <button
                      onClick={addPartField}
                      className="bg-green-600 hover:bg-green-700 text-white flex items-center justify-center w-10 h-10 rounded"
                    >
                      <FaPlus />
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                "name",
                "description",
                "replacedBy",
                "replacementDate",
                "quality",
                "cost",
              ].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-[var(--secondary)] mb-1 capitalize">
                    {field.replace(/([A-Z])/g, " $1")}
                  </label>
                  <input
                    type={field === "replacementDate" ? "date" : "text"}
                    value={partEntry.data?.[field] || ""}
                    onChange={(e) => {
                      const updated = [...parts];
                      updated[index].data = {
                        ...updated[index].data,
                        [field]: e.target.value,
                      };
                      setParts(updated);
                    }}
                    placeholder={`Enter ${field}`}
                    className="border p-2 w-full rounded text-black"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Final Remarks */}
      <section className="space-y-4 mt-5">
        <h3 className="px-2 py-2 font-semibold text-[var(--primary)] border-b dark:border-gray-700">
          Final Remarks
        </h3>
        <textarea
          rows="4"
          placeholder="Enter any final remarks"
          className="border p-2 w-full rounded border-[var(--secondary)] text-black"
        />
      </section>

      {/* Buttons */}
      <div className="flex justify-end gap-4 mt-6">
        <button
          type="button"
          className="bg-[var(--secondary)] text-white px-6 py-2 rounded shadow-md"
          onClick={() => alert("Saved successfully!")}
        >
          Save
        </button>
        <button
          type="submit"
          className="bg-green-600 text-white px-6 py-2 rounded shadow-md"
        >
          Submit
        </button>
      </div>
    </div>
  );
}

// — Reusable Components —
function InputField({ label, type = "text" }) {
  return (
    <div>
      <label className="block text-sm font-medium text-[var(--secondary)] mb-1">
        {label}
      </label>
      <input
        type={type}
        placeholder={label}
        className="border p-2 w-full rounded border-[var(--secondary)] text-black"
      />
    </div>
  );
}

function DisplayField({ label, value, multiline = false }) {
  return (
    <div className={multiline ? "md:col-span-2" : ""}>
      <label className="block text-sm font-medium text-[var(--secondary)] mb-1">
        {label}
      </label>
      <div
        className={`border p-2 w-full rounded border-[var(--secondary)] text-black bg-gray-100 ${
          multiline ? "min-h-[6rem]" : ""
        }`}
      >
        {value}
      </div>
    </div>
  );
}

function SelectField({ label, options, selected, setSelected }) {
  const formattedOptions = options.map((opt) =>
    typeof opt === "string" ? { value: opt, label: opt } : opt
  );

  return (
    <div>
      <label className="block text-sm font-medium text-[var(--secondary)] mb-1">
        {label}
      </label>
      <Select
        options={formattedOptions}
        value={selected}
        onChange={setSelected}
        placeholder={`Select ${label}`}
        className="text-black"
        classNamePrefix="react-select"
        styles={{
          control: (base) => ({
            ...base,
            borderColor: "#d1d5db",
            borderRadius: "0.375rem",
            padding: "2px",
          }),
          menu: (base) => ({
            ...base,
            zIndex: 9999,
          }),
        }}
      />
    </div>
  );
}
