"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function TakeItemPage() {
  const [items, setItems] = useState<any[]>([]);
  const [selectedItem, setSelectedItem] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState<any>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    fetch("/api/allitems")
      .then((res) => res.json())
      .then((data) => setItems(data))
      .catch(() => setItems([]));

    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => setUser(data?.user || null))
      .catch(() => setUser(null));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem || !quantity) return alert("Please select item and quantity");
    setLoading(true);
    setMessage("");

    const res = await fetch("/api/takeitem", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId: selectedItem, quantity: Number(quantity) }),
    });

    const data = await res.json();
    setMessage(data.message);

    if (res.ok) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 1500);
      setSelectedItem("");
      setQuantity(1);
    }

    setLoading(false);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-black to-gray-900 text-gray-200 flex items-center justify-center px-4 py-8 sm:px-8">
      {/* ✅ Animated success checkmark */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/60 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="bg-gray-800 rounded-full p-6 border-2 border-green-500 shadow-lg"
            >
              <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="w-16 h-16 text-green-500"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.6 }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </motion.svg>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ✅ Main Card */}
      <div
        className="
          bg-gray-900 border border-gray-800 rounded-2xl shadow-lg 
          p-6 sm:p-8 
          w-full max-w-sm sm:max-w-md md:max-w-lg
          transition-all
        "
      >
        <h1 className="text-xl sm:text-2xl font-semibold text-center mb-3">
          {user ? `Hey, ${user.name?.split(" ")[0]} 👋` : "Take an Item 🧾"}
        </h1>
        <p className="text-center text-gray-400 text-sm sm:text-base mb-6">
          What are you picking today?
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Select Item</label>
            <select
              value={selectedItem}
              onChange={(e) => setSelectedItem(e.target.value)}
              className="w-full bg-gray-800 text-gray-200 border border-gray-700 rounded-md p-2 sm:p-2.5 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              <option value="">-- Choose an item --</option>
              {items.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} (Available: {item.quantity})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Quantity</label>
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full bg-gray-800 text-gray-200 border border-gray-700 rounded-md p-2 sm:p-2.5 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="
              w-full bg-cyan-600 hover:bg-cyan-500 
              py-2 sm:py-2.5 rounded-md 
              text-sm sm:text-base 
              font-medium text-white 
              transition disabled:opacity-50
            "
          >
            {loading ? "Processing..." : "Take Item"}
          </button>
        </form>

        {message && (
          <div
            className={`mt-5 text-center text-sm sm:text-base font-medium px-4 py-2 rounded-lg transition-all duration-300
              ${
                /success/i.test(message)
                  ? "bg-green-900/30 text-green-400 border border-green-600"
                  : "bg-red-900/30 text-red-400 border border-red-600"
              }`}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
