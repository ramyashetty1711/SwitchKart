import React, { useState, useRef } from "react";

export default function RepairedForm() {
  const [formData, setFormData] = useState({
    submissionCategory: "",
    customerPhone: "",
    handoverTo: "",
    receivingDate: "",
    handoverPhone: "",
    paymentMethod: "",
    remarks: "",
  });

  const [otp, setOtp] = useState(["", "", "", ""]);
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [error, setError] = useState("");
  const [verified, setVerified] = useState(false);

  const inputRefs = useRef([]);

  // Generate 4-digit OTP
  const generateOtp = () => {
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(otp);
    setVerified(false);
    setError("");
    setOtp(["", "", "", ""]);
    inputRefs.current[0]?.focus();
    alert(`OTP Generated: ${otp}`); // simulate sending OTP
  };

  const resendOtp = () => {
    generateOtp();
    setError("New OTP sent!");
  };

  const handleOtpChange = (value, index) => {
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 3) inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const verifyOtp = () => {
    const enteredOtp = otp.join("");
    if (enteredOtp === generatedOtp) {
      setVerified(true);
      setError("✅ OTP Verified Successfully!");
    } else {
      setVerified(false);
      setError("❌ Incorrect OTP. Please try again.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!verified) {
      setError("⚠️ Please verify the OTP before submitting.");
      return;
    }
    setError("");
    console.log("Handover Form Submitted:", { ...formData, otp: otp.join("") });
    alert("✅ Form submitted successfully with verified OTP!");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 p-6 bg-white rounded h-full overflow-y-auto custom-scrollbar"
    >
      <h2 className="px-2 py-2 font-semibold text-[var(--primary)] border-b dark:border-gray-700">
        Repaired Handover Form
      </h2>

      {/* Grid for input fields */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SelectField
          label="Submission Category"
          name="submissionCategory"
          value={formData.submissionCategory}
          onChange={handleChange}
          options={["Walk-in", "Pick-up", "Courier"]}
        />
        {/* <InputField
          label="Customer Phone No"
          name="customerPhone"
          value={formData.customerPhone}
          onChange={handleChange}
          placeholder="Enter Customer Phone No"
        /> */}
        <InputField
          label="Handover To (Name)"
          name="handoverTo"
          value={formData.handoverTo}
          onChange={handleChange}
          placeholder="Person receiving the device"
        />
        <InputField
          label="Receiving Date"
          name="receivingDate"
          value={formData.receivingDate}
          onChange={handleChange}
          type="date"
        />
        <InputField
          label="Handover Phone No"
          name="handoverPhone"
          value={formData.handoverPhone}
          onChange={handleChange}
          placeholder="Phone number of person receiving"
        />
        <SelectField
          label="Payment Method"
          name="paymentMethod"
          value={formData.paymentMethod}
          onChange={handleChange}
          options={["Cash", "UPI", "Card", "Not Applicable"]}
        />
      </div>

      {/* Remarks Section */}
      <TextAreaField
        label="Remarks"
        name="remarks"
        value={formData.remarks}
        onChange={handleChange}
        placeholder="Additional notes or signature"
      />

      {/* OTP Section */}
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <label className="block text-sm font-medium text-[var(--secondary)] mb-3">
          OTP Verification
        </label>

        <div className="flex gap-3 mb-4 justify-center">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleOtpChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              ref={(el) => (inputRefs.current[index] = el)}
              className="w-14 h-14 text-center text-lg border border-[var(--secondary)] rounded-lg focus:border-[var(--primary)] focus:outline-none font-bold tracking-widest bg-white text-black dark:text-white"
            />
          ))}
        </div>

        <div className="flex gap-3 justify-center">
          <button
            type="button"
            onClick={generateOtp}
            className="bg-[var(--primary)] text-white px-5 py-2 rounded shadow-md hover:opacity-90 transition"
          >
            Generate
          </button>
          <button
            type="button"
            onClick={resendOtp}
            className="bg-[var(--secondary)] text-white px-5 py-2 rounded shadow-md hover:opacity-90 transition"
          >
            Resend
          </button>
          <button
            type="button"
            onClick={verifyOtp}
            className="bg-green-600 text-white px-5 py-2 rounded shadow-md hover:opacity-90 transition"
          >
            Verify
          </button>
        </div>

        {error && (
          <p
            className={`mt-2 text-center text-sm ${
              verified ? "text-green-600" : "text-red-500"
            }`}
          >
            {error}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex justify-end gap-4 mt-6">
        <button
          type="button"
          className="bg-[var(--secondary)] text-white px-6 py-2 rounded shadow-md hover:opacity-90 transition"
          onClick={() => alert("Saved successfully!")}
        >
          Save
        </button>
        <button
          type="submit"
          className="bg-[var(--primary)] text-white px-6 py-2 rounded shadow-md hover:opacity-90 transition"
        >
          Handover
        </button>
      </div>
    </form>
  );
}

// Reusable Input Field
function InputField({ label, name, value, onChange, placeholder, type = "text" }) {
  return (
    <div>
      <label className="block text-sm font-medium text-[var(--secondary)] mb-1">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full border border-[var(--secondary)] rounded px-3 py-2 text-black"
      />
    </div>
  );
}

// Reusable TextArea Field
function TextAreaField({ label, name, value, onChange, placeholder }) {
  return (
    <div>
      <label className="block text-sm font-medium text-[var(--secondary)] mb-1">
        {label}
      </label>
      <textarea
        name={name}
        rows="3"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full border border-[var(--secondary)] rounded px-3 py-2 text-black"
      />
    </div>
  );
}

// Reusable Select Field
function SelectField({ label, name, value, onChange, options }) {
  return (
    <div>
      <label className="block text-sm font-medium text-[var(--secondary)] mb-1">
        {label}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border border-[var(--secondary)] rounded px-3 py-2 text-black"
      >
        <option value="" disabled>
          Select {label}
        </option>
        {options.map((opt, idx) => (
          <option key={idx} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
