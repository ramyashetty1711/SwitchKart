import React, { useState } from "react";
import { FaDownload, FaFileAlt } from "react-icons/fa";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function ReportManagement() {
  // Sample static report data
  const initialReports = [
    {
      id: 1,
      name: "Monthly Sales Report",
      type: "PDF",
      generatedOn: "2025-09-01",
      size: "1.2 MB",
    },
    {
      id: 2,
      name: "Employee Performance Report",
      type: "Excel",
      generatedOn: "2025-09-02",
      size: "800 KB",
    },
    {
      id: 3,
      name: "Inventory Summary",
      type: "PDF",
      generatedOn: "2025-09-03",
      size: "2 MB",
    },
  ];

  const [reports] = useState(initialReports);
  const [filterDate, setFilterDate] = useState("");

  // Filter by date
  const filteredReports = filterDate
    ? reports.filter((r) => r.generatedOn === filterDate)
    : reports;

  // Download single report as Excel
  const downloadReport = (report) => {
    const worksheet = XLSX.utils.json_to_sheet([report]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, `${report.name}.xlsx`);
  };

  return (
    <div className="w-full h-full p-4 bg-white dark:bg-gray-900 rounded-lg">
      <div className="flex justify-between items-center mb-6 gap-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          Reports Management
        </h2>

        {/* Date filter */}
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="px-3 py-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
        />
      </div>

      <div className="overflow-x-auto max-h-[70vh] custom-scrollbar">
        <table className="min-w-full table-auto border-collapse border border-gray-200 dark:border-gray-700 shadow-md rounded-lg overflow-hidden">
          <thead className="bg-purple-100 text-[var(--primary)] dark:text-gray-100 sticky top-0 z-10">
            <tr>
              <th className="px-4 py-2 text-left font-medium">S.No</th>
              <th className="px-4 py-2 text-left font-medium">Report Name</th>
              <th className="px-4 py-2 text-left font-medium">Generated On</th>
              <th className="px-4 py-2 text-left font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200">
            {filteredReports.length > 0 ? (
              filteredReports.map((report, index) => (
                <tr
                  key={report.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                >
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2 flex items-center gap-2">
                    <FaFileAlt className="text-[var(--primary)]" /> {report.name}
                  </td>
                
                  <td className="px-4 py-2">{report.generatedOn}</td>
                
                  <td className="px-4 py-2 flex gap-2 ">
                    {/* Download icon button */}
                    <button
                      onClick={() => downloadReport(report)}
                      className="p-2 rounded-full bg-[var(--primary)]/10 text-[var(--primary)]   hover:bg-[var(--primary)] hover:text-white transition-all"
                      title="Download Excel"
                    >
                      <FaDownload size={16} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-4 text-gray-500 dark:text-gray-300">
                  No reports found for the selected date.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
