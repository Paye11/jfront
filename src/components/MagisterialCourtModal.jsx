import React, { useState, useEffect } from "react";

const MagisterialCourtModal = ({ show, onClose, onSave, initialData, circuitCourts }) => {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [parentCircuit, setParentCircuit] = useState("");

  useEffect(() => {
    if (show) {
      if (initialData) {
        setName(initialData.name || "");
        setLocation(initialData.location || "");
        setParentCircuit(initialData.circuitCourtId || initialData.circuitId || "");
      } else {
        setName("");
        setLocation("");
        setParentCircuit("");
      }
    }
  }, [initialData, show]);

  if (!show) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !parentCircuit) return;

    onSave({
      ...initialData, // ✅ keep _id for edit mode
      name: name.trim(),
      location: location.trim(),
      circuitId: parentCircuit,
      circuitName: circuitCourts.find((c) => c._id === parentCircuit)?.name || "",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-4 sm:p-6 transform transition-all duration-300 scale-100 opacity-100">
        <h2 className="text-lg sm:text-xl font-bold mb-4 text-gray-800">
          {initialData ? "Edit Magisterial Court" : "Add New Magisterial Court"}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Court Name"
            className="border border-gray-300 rounded-xl px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-400 transition"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Court Location (Optional)"
            className="border border-gray-300 rounded-xl px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-400 transition"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />

          <select
            className="border border-gray-300 rounded-xl px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-400 transition"
            value={parentCircuit}
            onChange={(e) => setParentCircuit(e.target.value)}
            required
          >
            <option value="">Select Parent Circuit Court</option>
            {circuitCourts.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>

          <div className="flex flex-col sm:flex-row justify-end gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-100 transition w-full sm:w-auto"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-green-500 text-white hover:bg-green-600 transition w-full sm:w-auto"
            >
              {initialData ? "Save Changes" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MagisterialCourtModal;
