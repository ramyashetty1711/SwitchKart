import React, { useState } from "react";

// Mock employee list
const employees = [
  { id: 1, name: "Alice Johnson" },
  { id: 2, name: "Bob Smith" },
  { id: 3, name: "Charlie Brown" },
];

export default function WorkAssignment() {
  const [assignedTo, setAssignedTo] = useState("");
  const [task, setTask] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Assigned Work:", { assignedTo, task, startDate, endDate });
    alert("Work assigned. Check console for details.");
    // Reset form
    setAssignedTo("");
    setTask("");
    setStartDate("");
    setEndDate("");
  };

  return (
    <div className="space-y-6 p-6 bg-white rounded h-full overflow-y-auto custom-scrollbar">
      <form onSubmit={handleSubmit}>
        <section className="space-y-4">
          <h3 className="px-2 py-2 font-semibold text-[var(--primary)] border-b dark:border-gray-700">
            Assign Work
          </h3>

          {/* Dropdown for Employee */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="assignedTo"
                className="block text-sm font-medium text-black mb-1"
              >
                Assign To *
              </label>
              <select
                id="assignedTo"
                name="assignedTo"
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                required
                className="w-full border border-[var(--secondary)] rounded px-3 py-2 text-black"
              >
                <option value="">Select Employee</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.name}>
                    {emp.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Task Description */}
            <div className="md:col-span-3">
              <label
                htmlFor="task"
                className="block text-sm font-medium text-black mb-1"
              >
                Task Details *
              </label>
              <textarea
                id="task"
                name="task"
                rows={4}
                value={task}
                onChange={(e) => setTask(e.target.value)}
                required
                className="w-full border border-[var(--secondary)] rounded px-3 py-2 text-black"
              ></textarea>
            </div>

            {/* Start Date */}
            <div>
              <label
                htmlFor="startDate"
                className="block text-sm font-medium text-black mb-1"
              >
                Start Date *
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                className="border p-2 w-full rounded border-[var(--secondary)] text-black"
              />
            </div>

            {/* End Date */}
            <div>
              <label
                htmlFor="endDate"
                className="block text-sm font-medium text-black mb-1"
              >
                End Date *
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
                className="border p-2 w-full rounded border-[var(--secondary)] text-black"
              />
            </div>
          </div>
        </section>

        {/* Buttons */}
        <div className="flex justify-end gap-4 mt-6">
          <button
            type="button"
            onClick={() => {
              console.log("Saved Draft:", { assignedTo, task, startDate, endDate });
              alert("Draft saved. Check console.");
            }}
            className="bg-[var(--secondary)] text-white px-6 py-2 rounded shadow-md"
          >
            Save
          </button>
          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-2 rounded shadow-md"
          >
            Assign
          </button>
        </div>
      </form>
    </div>
  );
}
