import React, { useState } from "react";
import Select from "react-select";

// Mock employee list
const employees = [
  { id: 1, name: "Alice Johnson" },
  { id: 2, name: "Bob Smith" },
  { id: 3, name: "Charlie Brown" },
];

// Convert to react-select options
const employeeOptions = employees.map((emp) => ({
  value: emp.name,
  label: emp.name,
}));

export default function WorkAssignment() {
  const [assignedTo, setAssignedTo] = useState(null);
  const [task, setTask] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Assigned Work:", { assignedTo, task });
    alert("Work assigned. Check console for details.");
    setAssignedTo(null);
    setTask("");
  };

  return (
    <div className="p-4 bg-white rounded">
      <form onSubmit={handleSubmit} className="space-y-3">
        <h3 className="px-4 py-2 font-semibold text-[var(--primary)] border-b dark:border-gray-700">
          Assign Work
        </h3>

        {/* Row: Employee + Task in the same line */}
        <div className="flex flex-col md:flex-row gap-2">
          {/* Employee Select */}
          <div className="flex-1 space-y-1">
            <label className="text-sm font-medium">Assign To *</label>
            <Select
              options={employeeOptions}
              value={assignedTo}
              onChange={(selected) => setAssignedTo(selected)}
              placeholder="Select Employee"
              className="text-black"
            />
          </div>

          {/* Task Input */}
          <div className="flex-1 space-y-1">
            <label className="text-sm font-medium">Task / Remarks *</label>
            <input
              type="text"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              required
              className="w-full border border-[var(--secondary)] rounded px-2 py-1 text-black"
              placeholder="Enter task or remarks"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2 mt-2">
          <button
            type="button"
            onClick={() => {
              console.log("Saved Draft:", { assignedTo, task });
              alert("Draft saved. Check console.");
            }}
            className="bg-[var(--secondary)] text-white px-4 py-1 rounded text-sm"
          >
            Save
          </button>
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-1 rounded text-sm"
          >
            Assign
          </button>
        </div>
      </form>
    </div>
  );
}
