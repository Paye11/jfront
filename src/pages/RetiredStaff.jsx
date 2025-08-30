import React, { useEffect, useState } from "react";
import StaffModal from "../components/StaffModal";
import {
  getRetiredStaff,
  getMagisterialCourts,
  getCircuitCourts,
  getDepartments,
  deleteStaff,
} from "../apis/api";
import { toast } from "react-toastify";
import { Edit2, Trash2 } from "lucide-react";

const RetiredStaff = () => {
  const [staffList, setStaffList] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [courts, setCourts] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch all courts & retired staff
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [circuitsRes, magsRes, deptsRes, staffRes] = await Promise.all([
          getCircuitCourts(),
          getMagisterialCourts(),
          getDepartments(),
          getRetiredStaff(),
        ]);

        const normalizeRes = (res, key) =>
          res?.success ? res[key] || res.courts || [] : Array.isArray(res) ? res : [];

        setCourts([
          ...normalizeRes(circuitsRes, "courts").map((c) => ({ ...c, type: "circuit" })),
          ...normalizeRes(magsRes, "courts").map((m) => ({ ...m, type: "magisterial" })),
          ...normalizeRes(deptsRes, "departments").map((d) => ({ ...d, type: "department" })),
        ]);

        const staffData =
          Array.isArray(staffRes) ? staffRes : staffRes?.success ? staffRes.staff || [] : [];
        setStaffList(staffData);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleEdit = (staff) => {
    setSelectedStaff(staff);
    setModalOpen(true);
  };

  const handleDelete = async (staff) => {
    if (!staff._id) {
      toast.error("Cannot delete unsaved staff");
      return;
    }
    if (!window.confirm(`Are you sure you want to delete ${staff.name}?`)) return;

    try {
      const res = await deleteStaff(staff._id);
      if (res?.success || !res) {
        setStaffList((prev) => prev.filter((s) => s._id !== staff._id));
        toast.success(res?.message || "Staff deleted successfully");
      }
    } catch (err) {
      toast.error(err.message || "Error deleting staff");
    }
  };

  // Get court name & type
  const getCourtInfo = (staff) => {
    if (staff.courtId && typeof staff.courtId === "object" && staff.courtId.name) {
      return {
        name: staff.courtId.name,
        type:
          staff.courtId.type === "circuit"
            ? "Circuit Court"
            : staff.courtId.type === "magisterial"
            ? "Magisterial Court"
            : "Department",
      };
    }
    if (!staff.courtId) return { name: "N/A", type: "N/A" };
    const court = courts.find((c) => c._id === staff.courtId);
    return court
      ? {
          name: court.name,
          type:
            court.type === "circuit"
              ? "Circuit Court"
              : court.type === "magisterial"
              ? "Magisterial Court"
              : "Department",
        }
      : { name: "N/A", type: "N/A" };
  };

  // Skeleton Loader
  const SkeletonRow = () => (
    <tr className="animate-pulse">
      {Array.from({ length: 8 }).map((_, i) => (
        <td key={i} className="px-6 py-4">
          <div className="h-4 bg-gray-200 rounded w-24"></div>
        </td>
      ))}
    </tr>
  );

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Retired Staff</h2>
      </div>

      {/* Table Wrapper */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50 hidden md:table-header-group">
              <tr>
                {[
                  "Name",
                  "Position",
                  "Court Type",
                  "Court Name",
                  "Contact",
                  "Education",
                  "Status",
                  "Actions",
                ].map((h) => (
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
              ) : staffList.length ? (
                staffList.map((s) => {
                  const courtInfo = getCourtInfo(s);
                  return (
                    <tr
                      key={s._id}
                      className="hover:bg-gray-50 transition-colors block md:table-row"
                    >
                      {/* Mobile card layout */}
                      <td className="px-6 py-4 whitespace-nowrap block md:table-cell">
                        <div className="font-medium text-gray-900">{s.name}</div>
                        <div className="md:hidden text-sm text-gray-600">
                          {s.position} • {courtInfo.type}
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">{s.position}</td>
                      <td className="px-6 py-4 hidden md:table-cell">{courtInfo.type}</td>
                      <td className="px-6 py-4 hidden md:table-cell">{courtInfo.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{s.phone || "N/A"}</td>
                      <td className="px-6 py-4">{s.education || "-"}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 text-xs rounded-full capitalize ${
                            s.employmentStatus === "active"
                              ? "bg-green-100 text-green-800"
                              : s.employmentStatus === "on_leave"
                              ? "bg-blue-100 text-blue-800"
                              : s.employmentStatus === "retired"
                              ? "bg-gray-100 text-gray-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {s.employmentStatus?.replace("_", " ") || "Unknown"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(s)}
                            className="text-purple-600 hover:text-purple-800 p-1 rounded-lg hover:bg-purple-50"
                            title="Edit staff"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(s)}
                            className="text-red-600 hover:text-red-800 p-1 rounded-lg hover:bg-red-50"
                            title="Delete staff"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                    <p className="text-lg font-medium">No retired staff members found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Staff Modal */}
      <StaffModal
        show={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={(updated) => {
          if (selectedStaff) {
            setStaffList((prev) => prev.map((s) => (s._id === updated._id ? updated : s)));
          } else {
            setStaffList((prev) => [updated, ...prev]);
          }
          setModalOpen(false);
        }}
        staff={selectedStaff}
        courts={courts}
      />
    </div>
  );
};

export default RetiredStaff;
