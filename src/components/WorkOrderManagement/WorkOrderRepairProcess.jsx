import React, { useState } from "react";
import Select from "react-select";
import { FaPlus, FaMinus, FaSearch } from "react-icons/fa";

// 🔧 Mock part lookup function
const mockPartLookup = (partId) => {
  const parts = {
    P001: { name: "Charging Port", description: "Original charging port", replacedBy: "Engineer A", replacementDate: "2025-06-28", quality: "1", unitPrice: 450, quantity: 1 },
    P002: { name: "Battery", description: "High capacity battery", replacedBy: "Engineer B", replacementDate: "2025-06-28", quality: "2", unitPrice: 750, quantity: 1 },
    P003: { name: "Display Screen", description: "AMOLED screen", replacedBy: "Engineer C", replacementDate: "2025-06-28", quality: "3", unitPrice: 1500, quantity: 1 },
  };
  return parts[partId] || null;
};

export default function WorkOrderRepairProcess() {
  const [parts, setParts] = useState([{ partId: "", data: { quantity: 1, unitPrice: 0, name: "", description: "" } }]);
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
    updated[index].data = part || { quantity: 1, unitPrice: 0, name: "", description: "" };
    setParts(updated);
  };

  const addPartField = () => setParts([...parts, { partId: "", data: { quantity: 1, unitPrice: 0, name: "", description: "" } }]);
  const removePartField = (index) => setParts(parts.filter((_, i) => i !== index));

  // Calculate total cost
  const totalCost = parts.reduce((acc, p) => acc + (p.data.unitPrice || 0) * (p.data.quantity || 0), 0);

  return (
    <div className="space-y-6 py-0 bg-white rounded h-full overflow-y-auto custom-scrollbar p-4">
      {/* Engineer Diagnose Info */}
      <section className="space-y-4">
        <h3 className="px-2 py-2 font-semibold text-[var(--primary)] border-b dark:border-gray-700">
          Engineer Diagnose Info
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SelectField label="Resolution Method" options={["Hardware", "Software"]} selected={resolutionMethod} setSelected={setResolutionMethod} />
          <SelectField label="Malfunction Category" options={["Replaced Part","Re-fix","Dust clean","Battery Activation","Software update"]} selected={malfunctionCategory} setSelected={setMalfunctionCategory} />
        </div>
      </section>

      {/* Parts Replacement Table */}
      <section className="space-y-4 mt-5">
        <h3 className="px-2 py-2 font-semibold text-[var(--primary)] border-b dark:border-gray-700">
          Parts Replacement Info
        </h3>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 text-sm text-left border-collapse">
            <thead className="bg-gray-100">
              <tr>
                {["Part ID","Name","Description","Quantity","Cost","Actions"].map((col) => (
                  <th key={col} className="border border-gray-300 px-2 py-1 text-black">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {parts.map((partEntry, index) => (
                <tr key={index} className="bg-white">
                  {/* Part ID + Fetch */}
                  <td className="border border-gray-300 px-2 py-1 flex items-center gap-1">
                    <input
                      type="text"
                      placeholder="P001"
                      value={partEntry.partId}
                      onChange={(e) => handlePartIdChange(index, e.target.value)}
                      className="border border-black text-black rounded px-1 py-0.5 w-full"
                    />
                    <button
                      type="button"
                      onClick={() => fetchPartDetails(index)}
                      className="bg-[var(--secondary)] hover:bg-[var(--primary)] text-white w-6 h-6 rounded flex items-center justify-center"
                      title="Fetch Part Details"
                    >
                      <FaSearch className="text-xs"/>
                    </button>
                  </td>

                  {/* Name & Description - disabled */}
                  {["name","description"].map((field) => (
                    <td key={field} className="border border-gray-300 px-2 py-1">
                      <input
                        type="text"
                        value={partEntry.data?.[field] || ""}
                        readOnly
                        className="border border-[var(--secondary)] text-black rounded px-1 py-0.5 w-full bg-gray-100"
                      />
                    </td>
                  ))}

                  {/* Quantity with buttons */}
                  <td className="border border-gray-300 px-2 py-1">
                    <div className="flex items-center gap-1 justify-center">
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...parts];
                          updated[index].data.quantity = Math.max(1, (updated[index].data.quantity || 1) - 1);
                          setParts(updated);
                        }}
                        className="bg-red-500 hover:bg-red-600 text-white w-6 h-6 rounded flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!partEntry.partId}
                      >
                        <FaMinus className="text-xs"/>
                      </button>
                      <input
                        type="number"
                        min="1"
                        value={partEntry.data?.quantity || 1}
                        readOnly
                        className="border text-center border-[var(--secondary)] text-black rounded px-1 py-0.5 w-12 bg-gray-100"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...parts];
                          updated[index].data.quantity = (updated[index].data.quantity || 1) + 1;
                          setParts(updated);
                        }}
                        className="bg-green-600 hover:bg-green-700 text-white w-6 h-6 rounded flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!partEntry.partId}
                      >
                        <FaPlus className="text-xs"/>
                      </button>
                    </div>
                  </td>

                  {/* Cost Column */}
                  <td className="border border-gray-300 px-2 py-1 text-right text-black">
                    ₹{(partEntry.data?.unitPrice || 0) * (partEntry.data?.quantity || 0)}
                  </td>

                  {/* Actions */}
                  <td className="border border-gray-300 px-2 py-1 flex gap-1">
                    {parts.length > 1 && (
                      <button
                        onClick={() => removePartField(index)}
                        className="bg-red-500 hover:bg-red-600 text-white w-6 h-6 rounded flex items-center justify-center"
                      >
                        <FaMinus className="text-xs"/>
                      </button>
                    )}
                    {index === parts.length - 1 && (
                      <button
                        onClick={addPartField}
                        className="bg-green-600 hover:bg-green-700 text-white w-6 h-6 rounded flex items-center justify-center"
                      >
                        <FaPlus className="text-xs"/>
                      </button>
                    )}
                  </td>
                </tr>
              ))}

              {/* Total Cost Row */}
              <tr className="bg-gray-100 font-semibold">
                <td colSpan={4} className="border border-gray-300 px-2 py-1 text-right text-black">Total Cost</td>
                <td className="border border-gray-300 px-2 py-1 text-right text-black">₹{totalCost}</td>
                <td className="border border-gray-300 px-2 py-1"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Final Remarks */}
      <section className="space-y-4 mt-5">
        <h3 className="px-2 py-2 font-semibold text-[var(--primary)] border-b dark:border-gray-700">Final Remarks</h3>
        <textarea rows="4" placeholder="Enter any final remarks" className="border p-2 w-full rounded border-[var(--secondary)] text-black" />
      </section>

      {/* Buttons */}
      <div className="flex justify-end gap-4 mt-6">
        <button type="button" className="bg-[var(--secondary)] text-white px-6 py-2 rounded shadow-md" onClick={() => alert("Saved successfully!")}>Save</button>
        <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded shadow-md">Submit</button>
      </div>
    </div>
  );
}

// — Reusable Select Field —
function SelectField({ label, options, selected, setSelected }) {
  const formattedOptions = options.map((opt) => (typeof opt === "string" ? { value: opt, label: opt } : opt));
  return (
    <div>
      <label className="block text-sm font-medium text-[var(--secondary)] mb-1">{label}</label>
      <Select
        options={formattedOptions}
        value={selected}
        onChange={setSelected}
        placeholder={`Select ${label}`}
        className="text-black"
        classNamePrefix="react-select"
        styles={{
          control: (base) => ({ ...base, borderColor: "#d1d5db", borderRadius: "0.375rem", padding: "2px" }),
          menu: (base) => ({ ...base, zIndex: 9999 }),
        }}
      />
    </div>
  );
}
