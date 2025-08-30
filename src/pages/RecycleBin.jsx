import React, { useEffect, useState } from "react";
import { getRecycleBin, restoreFromRecycleBin, permanentlyDelete } from "../apis/api";
import { toast } from "react-toastify";
import { RotateCcw, Trash2, Building, Users, Scale, Home } from "lucide-react";

const RecycleBin = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    fetchRecycleBin();
  }, []);

  const fetchRecycleBin = async () => {
    try {
      setLoading(true);
      const res = await getRecycleBin();
      if (res && res.success) {
        setItems(res.items || []);
      } else if (Array.isArray(res)) {
        setItems(res);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load recycle bin");
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (item) => {
    if (!window.confirm(`Are you sure you want to restore this ${item.entityType}?`)) return;
    try {
      const res = await restoreFromRecycleBin(item._id);
      if (res && res.success) {
        setItems(items.filter(i => i._id !== item._id));
        toast.success(res.message || "Item restored successfully");
      }
    } catch (err) {
      toast.error(err.message || "Error restoring item");
    }
  };

  const handlePermanentDelete = async (item) => {
    if (!window.confirm(`Are you sure you want to permanently delete this ${item.entityType}? This action cannot be undone.`)) return;
    try {
      const res = await permanentlyDelete(item._id);
      if (res && res.success) {
        setItems(items.filter(i => i._id !== item._id));
        toast.success(res.message || "Item permanently deleted");
      }
    } catch (err) {
      toast.error(err.message || "Error deleting item");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const filteredItems = items.filter(item => {
    if (activeTab === "all") return true;
    if (activeTab === "staff") return item.entityType === "staff";
    if (activeTab === "circuit") return item.entityType === "court" && item.data.type === "circuit";
    if (activeTab === "magisterial") return item.entityType === "court" && item.data.type === "magisterial";
    if (activeTab === "department") return item.entityType === "court" && item.data.type === "department";
    return false;
  });

  const countByType = {
    all: items.length,
    staff: items.filter(item => item.entityType === "staff").length,
    circuit: items.filter(item => item.entityType === "court" && item.data.type === "circuit").length,
    magisterial: items.filter(item => item.entityType === "court" && item.data.type === "magisterial").length,
    department: items.filter(item => item.entityType === "court" && item.data.type === "department").length,
  };

  const getEntityIcon = (type) => {
    switch (type) {
      case "staff": return <Users size={18} />;
      case "circuit": return <Scale size={18} />;
      case "magisterial": return <Building size={18} />;
      case "department": return <Home size={18} />;
      default: return <Building size={18} />;
    }
  };

  const getEntityDisplayName = (item) => {
    if (item.entityType === "staff") return "Staff";
    if (item.entityType === "court") {
      return item.data.type === "circuit"
        ? "Circuit Court"
        : item.data.type === "magisterial"
        ? "Magisterial Court"
        : "Department";
    }
    return "Unknown";
  };

  // Skeleton Loader Row
  const SkeletonRow = () => (
    <tr className="animate-pulse">
      {Array.from({ length: 5 }).map((_, i) => (
        <td key={i} className="px-6 py-4">
          <div className="h-4 bg-gray-200 rounded w-24"></div>
        </td>
      ))}
    </tr>
  );

  const renderTable = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead className="bg-gray-50 hidden md:table-header-group">
          <tr>
            {["Type", "Name", "Deleted By", "Deleted At", "Actions"].map((h) => (
              <th
                key={h}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {loading ? (
            <>
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
            </>
          ) : filteredItems.length ? (
            filteredItems.map((item) => (
              <tr
                key={item._id}
                className="hover:bg-gray-50 transition-colors block md:table-row"
              >
                {/* Mobile-first card style */}
                <td className="px-6 py-4 block md:table-cell">
                  <div className="flex items-center gap-2 font-medium text-gray-900">
                    {getEntityIcon(item.entityType === "court" ? item.data.type : item.entityType)}
                    {getEntityDisplayName(item)}
                  </div>
                  <div className="md:hidden text-sm text-gray-600 mt-1">
                    Deleted by {item.deletedBy?.name || item.deletedBy || "System"}
                  </div>
                </td>
                <td className="px-6 py-4 hidden md:table-cell">
                  <div className="font-medium text-gray-900">{item.data.name}</div>
                  {item.entityType === "staff" && (
                    <div className="text-sm text-gray-500">{item.data.position}</div>
                  )}
                </td>
                <td className="px-6 py-4 hidden md:table-cell">
                  {item.deletedBy?.name || item.deletedBy || "System"}
                </td>
                <td className="px-6 py-4 hidden md:table-cell">{formatDate(item.deletedAt)}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleRestore(item)}
                      className="text-green-600 hover:text-green-800 p-1 rounded-lg hover:bg-green-50"
                      title="Restore"
                    >
                      <RotateCcw size={18} />
                    </button>
                    <button
                      onClick={() => handlePermanentDelete(item)}
                      className="text-red-600 hover:text-red-800 p-1 rounded-lg hover:bg-red-50"
                      title="Permanently delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                <p className="text-lg font-medium">No items found</p>
                <p className="text-sm">No {activeTab === "all" ? "" : activeTab + " "}items in recycle bin</p>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  const tabs = [
    { id: "all", name: "All", count: countByType.all },
    { id: "staff", name: "Staff", count: countByType.staff },
    { id: "circuit", name: "Circuit Courts", count: countByType.circuit },
    { id: "magisterial", name: "Magisterial Courts", count: countByType.magisterial },
    { id: "department", name: "Departments", count: countByType.department },
  ];

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-2">
        <h2 className="text-xl font-bold">Recycle Bin</h2>
        <span className="text-sm text-gray-600">
          {items.length} item{items.length !== 1 ? "s" : ""} in recycle bin
        </span>
      </div>

      {/* Tabs */}
      <div className="mb-6 overflow-x-auto">
        <div className="border-b border-gray-200 min-w-max">
          <nav className="-mb-px flex space-x-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-purple-600 text-purple-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.name}
                {tab.count > 0 && (
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      activeTab === tab.id
                        ? "bg-purple-100 text-purple-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
        {renderTable()}
      </div>
    </div>
  );
};

export default RecycleBin;
