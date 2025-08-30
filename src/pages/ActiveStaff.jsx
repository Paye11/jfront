
// import React, { useEffect, useState } from "react";
// import StaffModal from "../components/StaffModal";
// import { getActiveStaff, getMagisterialCourts, getCircuitCourts, getDepartments, deleteStaff } from "../apis/api";
// import { toast } from "react-toastify";
// import { Edit2, Trash2 } from "lucide-react";

// const ActiveStaff = () => {
//   const [staffList, setStaffList] = useState([]);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [courts, setCourts] = useState([]);
//   const [selectedStaff, setSelectedStaff] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Fetch all courts & staff
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const [circuitsRes, magsRes, deptsRes, staffRes] = await Promise.all([
//           getCircuitCourts(),
//           getMagisterialCourts(),
//           getDepartments(),
//           getActiveStaff()
//         ]);
        
//         // Handle different API response structures
//         let circuits = [];
//         if (circuitsRes && circuitsRes.success) {
//           circuits = circuitsRes.courts || [];
//         } else if (Array.isArray(circuitsRes)) {
//           circuits = circuitsRes;
//         }
        
//         let mags = [];
//         if (magsRes && magsRes.success) {
//           mags = magsRes.courts || [];
//         } else if (Array.isArray(magsRes)) {
//           mags = magsRes;
//         }
        
//         let depts = [];
//         if (deptsRes && deptsRes.success) {
//           depts = deptsRes.departments || deptsRes.courts || [];
//         } else if (Array.isArray(deptsRes)) {
//           depts = deptsRes;
//         }

//         setCourts([
//           ...circuits.map(c => ({ ...c, type: "circuit" })),
//           ...mags.map(m => ({ ...m, type: "magisterial" })),
//           ...depts.map(d => ({ ...d, type: "department" }))
//         ]);

//         // Handle staff response - use populated court data from backend
//         let staffData = [];
//         if (staffRes && staffRes.success) {
//           staffData = staffRes.staff || [];
//         } else if (Array.isArray(staffRes)) {
//           staffData = staffRes;
//         }

//         setStaffList(staffData);

//       } catch (err) {
//         console.error(err);
//         toast.error("Failed to load data");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   const handleEdit = (staff) => { setSelectedStaff(staff); setModalOpen(true); };

//   const handleDelete = async (staff) => {
//     if (!staff._id) { toast.error("Cannot delete unsaved staff"); return; }
//     if (!window.confirm(`Are you sure you want to delete ${staff.name}?`)) return;

//     try {
//       const res = await deleteStaff(staff._id);
//       if (res && res.success) {
//         setStaffList(staffList.filter(s => s._id !== staff._id));
//         toast.success(res.message || "Staff deleted successfully");
//       } else if (!res) {
//         setStaffList(staffList.filter(s => s._id !== staff._id));
//         toast.success("Staff deleted successfully");
//       }
//     } catch (err) {
//       toast.error(err.message || "Error deleting staff");
//     }
//   };

//   // Get court name and type for display - use populated data from backend
//   const getCourtInfo = (staff) => {
//     // If courtId is populated (has name and type), use that data
//     if (staff.courtId && typeof staff.courtId === 'object' && staff.courtId.name) {
//       return {
//         name: staff.courtId.name,
//         type: staff.courtId.type === "circuit" ? "Circuit Court" : 
//               staff.courtId.type === "magisterial" ? "Magisterial Court" : "Department"
//       };
//     }
    
//     // Fallback to courts list if courtId is just an ID string
//     if (!staff.courtId) return { name: "N/A", type: "N/A" };
    
//     const court = courts.find(c => c._id === staff.courtId);
//     if (!court) return { name: "N/A", type: "N/A" };
    
//     return {
//       name: court.name,
//       type: court.type === "circuit" ? "Circuit Court" : 
//             court.type === "magisterial" ? "Magisterial Court" : "Department"
//     };
//   };

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-xl font-bold">Active staff</h2>
//       </div>

//       {/* Staff Table */}
//       <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
//         {loading ? (
//           <div className="p-8 text-center">
//             <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-600"></div>
//             <p className="mt-2 text-gray-600">Loading staff data...</p>
//           </div>
//         ) : (
//           <>
//             <div className="overflow-x-auto">
//               <table className="min-w-full">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Court Type</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Court Name</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Education</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {staffList.length ? staffList.map(s => {
//                     const courtInfo = getCourtInfo(s);
//                     return (
//                     <tr key={s._id} className="hover:bg-gray-50 transition-colors">
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="font-medium text-gray-900">{s.name}</div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-gray-700">{s.position}</div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-gray-700">{courtInfo.type}</div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-gray-700">{courtInfo.name}</div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-gray-700">{s.phone || "N/A"}</div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-gray-700">{s.education || "-"}</div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className={`px-2 py-1 text-xs rounded-full capitalize ${
//                           s.employmentStatus === 'active' ? 'bg-green-100 text-green-800' :
//                           s.employmentStatus === 'on_leave' ? 'bg-blue-100 text-blue-800' :
//                           s.employmentStatus === 'retired' ? 'bg-gray-100 text-gray-800' :
//                           'bg-red-100 text-red-800'
//                         }`}>
//                           {s.employmentStatus?.replace('_', ' ') || "Unknown"}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex gap-2">
//                           <button 
//                             onClick={() => handleEdit(s)} 
//                             className="text-purple-600 hover:text-purple-800 p-1 rounded-lg hover:bg-purple-50 transition-colors"
//                             title="Edit staff"
//                           >
//                             <Edit2 size={18} />
//                           </button>
//                           <button 
//                             onClick={() => handleDelete(s)} 
//                             className="text-red-600 hover:text-red-800 p-1 rounded-lg hover:bg-red-50 transition-colors"
//                             title="Delete staff"
//                           >
//                             <Trash2 size={18} />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   )}) : (
//                     <tr>
//                       <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
//                         <p className="text-lg font-medium">No staff members found</p>
//                         <p className="text-sm">Add a new staff member to get started</p>
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </>
//         )}
//       </div>

//       {/* Staff Modal */}
//       <StaffModal
//         show={modalOpen}
//         onClose={() => setModalOpen(false)}
//         onSave={(updated) => {
//           if (selectedStaff) {
//             setStaffList(staffList.map(s => s._id === updated._id ? updated : s));
//           } else {
//             setStaffList([updated, ...staffList]);
//           }
//           setModalOpen(false);
//         }}
//         staff={selectedStaff}
//         courts={courts}
//       />
//     </div>
//   );
// };

// export default ActiveStaff;

import React, { useEffect, useState, useMemo } from "react";
import StaffModal from "../components/StaffModal";
import {
  getActiveStaff,
  getMagisterialCourts,
  getCircuitCourts,
  getDepartments,
  deleteStaff,
} from "../apis/api";
import { toast } from "react-toastify";
import { Edit2, Trash2 } from "lucide-react";

const SkeletonRow = () => (
  <tr className="animate-pulse">
    {Array.from({ length: 8 }).map((_, i) => (
      <td key={i} className="px-6 py-4">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </td>
    ))}
  </tr>
);

const ActiveStaff = () => {
  const [staffList, setStaffList] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [courts, setCourts] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch all courts & staff
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [circuitsRes, magsRes, deptsRes, staffRes] = await Promise.all([
          getCircuitCourts(),
          getMagisterialCourts(),
          getDepartments(),
          getActiveStaff(),
        ]);

        const circuits = circuitsRes?.success
          ? circuitsRes.courts || []
          : Array.isArray(circuitsRes)
          ? circuitsRes
          : [];
        const mags = magsRes?.success
          ? magsRes.courts || []
          : Array.isArray(magsRes)
          ? magsRes
          : [];
        const depts = deptsRes?.success
          ? deptsRes.departments || deptsRes.courts || []
          : Array.isArray(deptsRes)
          ? deptsRes
          : [];

        setCourts([
          ...circuits.map((c) => ({ ...c, type: "circuit" })),
          ...mags.map((m) => ({ ...m, type: "magisterial" })),
          ...depts.map((d) => ({ ...d, type: "department" })),
        ]);

        setStaffList(
          staffRes?.success ? staffRes.staff || [] : Array.isArray(staffRes) ? staffRes : []
        );
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
      setStaffList(staffList.filter((s) => s._id !== staff._id));
      toast.success(res?.message || "Staff deleted successfully");
    } catch (err) {
      toast.error(err.message || "Error deleting staff");
    }
  };

  // Memoized court lookup
  const getCourtInfo = useMemo(
    () => (staff) => {
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
    },
    [courts]
  );

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-3">
        <h2 className="text-lg sm:text-xl font-bold">Active Staff</h2>
      </div>

      {/* Staff Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full hidden md:table">
            <thead className="bg-gray-50">
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
              {loading
                ? Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
                : staffList.length
                ? staffList.map((s) => {
                    const courtInfo = getCourtInfo(s);
                    return (
                      <tr key={s._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">{s.name}</td>
                        <td className="px-6 py-4">{s.position}</td>
                        <td className="px-6 py-4">{courtInfo.type}</td>
                        <td className="px-6 py-4">{courtInfo.name}</td>
                        <td className="px-6 py-4">{s.phone || "N/A"}</td>
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
                : !loading && (
                    <tr>
                      <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                        No staff members found
                      </td>
                    </tr>
                  )}
            </tbody>
          </table>

          {/* Mobile Cards */}
          <div className="md:hidden divide-y">
            {loading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="p-4 animate-pulse">
                    <div className="h-4 bg-gray-200 w-1/2 mb-2 rounded"></div>
                    <div className="h-4 bg-gray-200 w-1/3 mb-2 rounded"></div>
                    <div className="h-4 bg-gray-200 w-2/3 rounded"></div>
                  </div>
                ))
              : staffList.map((s) => {
                  const courtInfo = getCourtInfo(s);
                  return (
                    <div key={s._id} className="p-4">
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold">{s.name}</h3>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(s)}
                            className="text-purple-600 hover:text-purple-800"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(s)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{s.position}</p>
                      <p className="text-sm text-gray-600">{courtInfo.type} - {courtInfo.name}</p>
                      <p className="text-sm text-gray-600">{s.phone || "N/A"}</p>
                      <span
                        className={`inline-block mt-2 px-2 py-1 text-xs rounded-full capitalize ${
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
                    </div>
                  );
                })}
          </div>
        </div>
      </div>

      {/* Staff Modal */}
      <StaffModal
        show={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={(updated) => {
          if (selectedStaff) {
            setStaffList(
              staffList.map((s) => (s._id === updated._id ? updated : s))
            );
          } else {
            setStaffList([updated, ...staffList]);
          }
          setModalOpen(false);
        }}
        staff={selectedStaff}
        courts={courts}
      />
    </div>
  );
};

export default ActiveStaff;
