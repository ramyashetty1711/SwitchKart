import React, { useState } from "react";
import StoreAdditionForm from "./StoreAdditionForm";
import StoreCredentialForm from "./StoreCredentialForm";

export default function StoreFormTabs() {
  const [activeTab, setActiveTab] = useState("addStore");

  return (
    <div className="grid lg:grid-cols-[12rem_1fr] grid-rows-[auto_1fr] lg:grid-rows-1 border rounded-lg overflow-x-auto max-h-[63vh] custom-scrollbar mt-2 dark:bg-gray-800">
      {/* Tabs (top on mobile, left on desktop) */}
      <div className="flex lg:flex-col gap-1 dark:bg-gray-900 bg-purple-100 p-5 border-b lg:border-b-0 lg:border-r dark:border-gray-700">
        <button
          className={`w-full p-3 text-sm font-medium text-left transition-all ${
            activeTab === "addStore"
              ? "bg-purple-600 text-white"
              : "hover:bg-purple-200 dark:hover:bg-gray-700 text-gray-800 dark:text-white"
          }`}
          onClick={() => setActiveTab("addStore")}
        >
          Add Store
        </button>
        <button
          className={`w-full p-3 text-sm font-medium text-left transition-all ${
            activeTab === "createCredentials"
              ? "bg-purple-600 text-white"
              : "hover:bg-purple-200 dark:hover:bg-gray-700 text-gray-800 dark:text-white"
          }`}
          onClick={() => setActiveTab("createCredentials")}
        >
          Create Credentials
        </button>
      </div>

      {/* Content */}
      <div className=" text-gray-800 dark:text-white">
        {activeTab === "addStore" && <StoreAdditionForm />}
        {activeTab === "createCredentials" && <StoreCredentialForm />}
      </div>
    </div>
  );
}
