"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import * as XLSX from "xlsx";

export default function AddItemPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    quantity: "",
  });

  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [excelData, setExcelData] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔍 Fetch suggestions from backend
  const fetchSuggestions = async (query: string) => {
    if (query.length < 1) {
      setSuggestions([]);
      return;
    }

    try {
      const res = await fetch(`/api/item/suggestions?q=${query}`);
      const data = await res.json();
      setSuggestions(data.items || []);
    } catch {
      setSuggestions([]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "name") {
      fetchSuggestions(value);
      setShowSuggestions(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/item/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Item created successfully!");
        setFormData({ name: "", description: "", quantity: "" });
      } else {
        setMessage(`❌ ${data.message}`);
      }
    } catch {
      setMessage("⚠️ Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  // 📦 Handle Excel upload
  const handleExcelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet);
      setExcelData(jsonData);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleBulkUpload = async () => {
    if (excelData.length === 0) {
      setMessage("⚠️ Please upload a valid Excel sheet first.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/item/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: excelData }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(`✅ ${data.count} items added successfully!`);
        setExcelData([]);
      } else {
        setMessage(`❌ ${data.message}`);
      }
    } catch {
      setMessage("⚠️ Error uploading items.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-black to-gray-900 text-gray-200 flex items-center justify-center p-4 sm:p-6">
      {/* 🔘 Cute Monitor Button (Top Right) */}
      <button
        onClick={() => router.push("/monitor")}
        className="absolute top-4 right-4 bg-gray-800 hover:bg-gray-700 text-sm sm:text-base px-3 py-1.5 rounded-lg border border-gray-700 shadow-md text-gray-200 transition-all duration-200"
      >
        📊 Monitor
      </button>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-lg p-6 sm:p-8 w-full max-w-lg sm:max-w-2xl space-y-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-100">
          🧾 Manage Items
        </h1>

        {/* --- Manual Add Form --- */}
        <form onSubmit={handleSubmit} className="space-y-4 relative">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-300 mb-2">Add Item Manually</h2>

          {/* 🧠 Item Name with Suggestions */}
          <div className="relative">
            <label className="block text-sm mb-1 text-gray-400">Item Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onFocus={() => formData.name && setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              placeholder="Enter item name"
              className="w-full p-2 sm:p-2.5 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 text-sm sm:text-base"
              required
            />

            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <ul className="absolute z-10 w-full bg-gray-800 border border-gray-700 rounded-md mt-1 max-h-40 overflow-y-auto shadow-lg">
                {suggestions.map((item) => (
                  <li
                    key={item.id}
                    onClick={() => {
                      setFormData({
                        name: item.name,
                        description: item.description,
                        quantity: String(item.quantity),
                      });
                      setShowSuggestions(false);
                    }}
                    className="px-3 py-2 text-sm text-gray-200 hover:bg-gray-700 cursor-pointer"
                  >
                    {item.name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-400">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter item description"
              rows={3}
              className="w-full p-2 sm:p-2.5 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 text-sm sm:text-base"
              required
            ></textarea>
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-400">Quantity</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              placeholder="Enter quantity"
              className="w-full p-2 sm:p-2.5 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 text-sm sm:text-base"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-700 hover:bg-gray-600 p-2 sm:p-2.5 rounded-md text-white text-sm sm:text-base transition disabled:opacity-50"
          >
            {loading ? "Adding..." : "Add Item"}
          </button>
        </form>

        {/* --- Excel Upload Section --- */}
        <div className="border-t border-gray-700 pt-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-300 mb-4">
            📦 Bulk Upload via Excel
          </h2>
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleExcelUpload}
            className="block w-full text-sm sm:text-base text-gray-400 file:mr-4 file:py-2 file:px-3 sm:file:px-4 file:rounded-md file:border-0 file:font-semibold file:bg-gray-700 file:text-white hover:file:bg-gray-600"
          />

          {excelData.length > 0 && (
            <p className="text-sm text-gray-400 mt-2">
              Loaded <span className="text-green-400 font-semibold">{excelData.length}</span> rows
              from Excel.
            </p>
          )}

          <button
            onClick={handleBulkUpload}
            disabled={loading || excelData.length === 0}
            className="mt-4 w-full bg-gray-700 hover:bg-gray-600 p-2 sm:p-2.5 rounded-md text-white text-sm sm:text-base transition disabled:opacity-50"
          >
            {loading ? "Uploading..." : "Upload All Items"}
          </button>
        </div>

        {message && (
          <p
            className={`text-center text-sm sm:text-base ${
              message.startsWith("✅") ? "text-green-400" : "text-red-400"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
