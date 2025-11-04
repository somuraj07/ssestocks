"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import { Edit, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminMonitorPage() {
  const [data, setData] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>({});
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [newQuantity, setNewQuantity] = useState<number>(0);

  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    const res = await fetch("/api/items");
    const json = await res.json();
    setData(json.items || []);
    setSummary(json.summary || {});
    setLoading(false);
  }

  async function handleUpdateQuantity(id: string) {
    if (newQuantity < 0) return alert("Quantity cannot be negative");
    const res = await fetch(`/api/item/update`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, quantity: newQuantity }),
    });
    if (res.ok) {
      await fetchData();
      setEditingItem(null);
      setNewQuantity(0);
    }
  }

  const filtered = data.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchesDate = dateFilter ? item.createdAt.startsWith(dateFilter) : true;
    return matchesSearch && matchesDate;
  });

  const chartData = filtered.map((i) => ({
    name: i.name,
    taken: i.takenQuantity,
  }));

  return (
    <div className="relative min-h-screen bg-black text-gray-100 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">📊 Inventory Monitor Dashboard</h1>

        {/* Add Item Button - Desktop Only */}
        <button
          onClick={() => router.push("/itemcreate")}
          className="hidden sm:flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-md text-sm font-medium transition-all shadow-md active:scale-95"
        >
          <Plus size={18} />
          Add Item
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Items", value: summary.totalItems },
          { label: "Total Stock", value: summary.totalStock },
          { label: "Total Taken", value: summary.totalTaken },
          {
            label: "Available Stock",
            value:
              summary.totalAvailable > 0
                ? `+${summary.totalAvailable}`
                : summary.totalAvailable ?? 0,
          },
        ].map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900 p-4 rounded-xl border border-gray-700 shadow-md text-center"
          >
            <h2 className="text-sm sm:text-lg text-gray-400">{card.label}</h2>
            <p className="text-xl sm:text-2xl font-semibold text-white">{card.value ?? 0}</p>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6 items-center justify-between">
        <input
          type="text"
          placeholder="🔍 Search by item name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-sm text-white w-full sm:w-64"
        />
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-sm text-white w-full sm:w-auto"
        />
      </div>

      {/* Chart */}
      <div className="bg-gray-900 p-4 rounded-xl border border-gray-700 mb-8">
        <h2 className="text-lg mb-2 text-gray-300 font-semibold">📈 Most Taken Items</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" stroke="#888" />
            <YAxis />
            <Tooltip
              contentStyle={{ backgroundColor: "#1f2937", border: "none" }}
              labelStyle={{ color: "#fff" }}
            />
            <Bar dataKey="taken" fill="#22d3ee" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-gray-900 border border-gray-800 rounded-xl shadow-lg">
        <table className="w-full text-sm">
          <thead className="bg-gray-800 text-gray-400 uppercase text-xs">
            <tr>
              <th className="p-3 text-left">Item</th>
              <th className="p-3 text-left">Total</th>
              <th className="p-3 text-left">Taken</th>
              <th className="p-3 text-left">Available</th>
              <th className="p-3 text-left">Taken By</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-500">
                  Loading data...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-500">
                  No items found
                </td>
              </tr>
            ) : (
              filtered.map((item) => (
                <tr key={item.id} className="border-t border-gray-800 hover:bg-gray-800/60">
                  <td className="p-3 font-medium text-white">{item.name}</td>
                  <td className="p-3">{item.totalQuantity}</td>
                  <td className="p-3 text-rose-400">{item.takenQuantity}</td>
                  <td className="p-3 text-emerald-400">
                    {item.availableQuantity > 0 ? `+${item.availableQuantity}` : item.availableQuantity}
                  </td>
                  <td className="p-3">
                    <ul className="space-y-1">
                      {item.takenBy.map((u: any, idx: number) => (
                        <li key={idx} className="text-xs text-gray-300">
                          {u.userName} - {u.quantity} pcs
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="p-3">
                    {editingItem === item.id ? (
                      <div className="flex gap-2 items-center">
                        <input
                          type="number"
                          className="w-20 bg-gray-800 border border-gray-700 rounded-md px-2 py-1 text-sm text-white"
                          value={newQuantity}
                          onChange={(e) => setNewQuantity(Number(e.target.value))}
                        />
                        <button
                          onClick={() => handleUpdateQuantity(item.id)}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white px-2 py-1 rounded-md text-xs"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingItem(null)}
                          className="bg-gray-700 px-2 py-1 rounded-md text-xs"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setEditingItem(item.id);
                          setNewQuantity(item.totalQuantity);
                        }}
                        className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300"
                      >
                        <Edit size={14} /> Edit
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Floating Add Button for Mobile Only */}
      <button
        onClick={() => router.push("/itemcreate")}
        className="sm:hidden fixed bottom-6 right-6 bg-cyan-600 hover:bg-cyan-500 text-white p-4 rounded-full shadow-lg transition-all duration-300 active:scale-95"
      >
        <Plus size={22} />
      </button>
    </div>
  );
}
