// import React, { useEffect, useState } from "react";
// import StaffModal from "../components/StaffModal";
// import { getAllStaff, getMagisterialCourts, getCircuitCourts, getDepartments, deleteStaff } from "../apis/api";
// import { toast } from "react-toastify";
// import { FileText, Printer, Plus, Edit2, Trash2, Search, Filter, X } from "lucide-react";

// const TotalStaff = () => {
//   const [staffList, setStaffList] = useState([]);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [courts, setCourts] = useState([]);
//   const [childCourts, setChildCourts] = useState([]);
//   const [selectedStaff, setSelectedStaff] = useState(null);
//   const [filterCourtType, setFilterCourtType] = useState("");
//   const [filterCourtId, setFilterCourtId] = useState("");
//   const [searchTerm, setSearchTerm] = useState("");
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
//           getAllStaff()
//         ]);
        
//         // Handle different API response structures
//         let circuits = [];
//         if (circuitsRes && circuitsRes.success) {
//           circuits = circuitsRes.courts || [];
//         } else if (Array.isArray(circuitsRes)) {
//           circuits = circuitsRes; // Handle case where API returns array directly
//         }
        
//         let mags = [];
//         if (magsRes && magsRes.success) {
//           mags = magsRes.courts || [];
//         } else if (Array.isArray(magsRes)) {
//           mags = magsRes; // Handle case where API returns array directly
//         }
        
//         let depts = [];
//         if (deptsRes && deptsRes.success) {
//           depts = deptsRes.departments || deptsRes.courts || [];
//         } else if (Array.isArray(deptsRes)) {
//           depts = deptsRes; // Handle case where API returns array directly
//         }

//         setCourts([
//           ...circuits.map(c => ({ ...c, type: "circuit" })),
//           ...mags.map(m => ({ ...m, type: "magisterial" })),
//           ...depts.map(d => ({ ...d, type: "department" }))
//         ]);

//         // Handle staff response
//         if (staffRes && staffRes.success) {
//           setStaffList(staffRes.staff || []);
//         } else if (Array.isArray(staffRes)) {
//           setStaffList(staffRes); // Handle case where API returns array directly
//         }

//       } catch (err) {
//         console.error(err);
//         toast.error("Failed to load data");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   useEffect(() => {
//     if (!filterCourtType) {
//       setChildCourts([]);
//       setFilterCourtId("");
//     } else {
//       const filtered = courts.filter(c => c.type === filterCourtType);
//       setChildCourts(filtered);
      
//       // Reset court filter if the selected court is not in the filtered list
//       if (filterCourtId && !filtered.some(c => c._id === filterCourtId)) {
//         setFilterCourtId("");
//       }
//     }
//   }, [filterCourtType, courts, filterCourtId]);

//   const handleAddStaff = () => { setSelectedStaff(null); setModalOpen(true); };
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

//   const handleFilter = async () => {
//     try {
//       const params = {};
//       if (filterCourtType) params.courtType = filterCourtType;
//       if (filterCourtId) params.courtId = filterCourtId;
//       if (searchTerm) params.search = searchTerm;

//       const res = await getActiveStaff(params);
//       if (res && res.success) {
//         setStaffList(res.staff || []);
//       } else if (Array.isArray(res)) {
//         setStaffList(res); // Handle case where API returns array directly
//       } else {
//         toast.error("Failed to filter staff");
//       }
//     } catch (error) {
//       toast.error("Failed to filter staff");
//     }
//   };

//   const clearFilters = async () => {
//     setFilterCourtType("");
//     setFilterCourtId("");
//     setSearchTerm("");
//     setChildCourts([]);
//     try {
//       const res = await getActiveStaff();
//       if (res && res.success) {
//         setStaffList(res.staff || []);
//       } else if (Array.isArray(res)) {
//         setStaffList(res); // Handle case where API returns array directly
//       }
//     } catch (error) {
//       toast.error("Failed to clear filters");
//     }
//   };

//   // Filter staff based on search term
//   const filteredStaff = staffList.filter(staff => {
//     if (!searchTerm) return true;
//     const term = searchTerm.toLowerCase();
//     return (
//       staff.name?.toLowerCase().includes(term) ||
//       staff.position?.toLowerCase().includes(term) ||
//       staff.area?.toLowerCase().includes(term) ||
//       staff.education?.toLowerCase().includes(term)
//     );
//   });

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       {/* Header */}
//       <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
//         <div>
//           <h2 className="text-2xl font-bold text-gray-800">Staff Management</h2>
//           <p className="text-gray-600">Manage all judiciary employees in one place</p>
//         </div>
//         <button 
//           onClick={handleAddStaff} 
//           className="bg-purple-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-purple-700 transition-colors self-start md:self-auto"
//         >
//           <Plus size={18} /> Add New Staff
//         </button>
//       </div>

//       {/* Filters Card */}
//       <div className="bg-white rounded-xl shadow-sm p-5 mb-6 border border-gray-200">
//         <div className="flex items-center gap-2 mb-4">
//           <Filter size={18} className="text-purple-600" />
//           <h3 className="font-semibold text-gray-700">Filter Staff</h3>
//         </div>
        
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//           {/* Search Input */}
//           <div>
//             <label className="block mb-2 text-sm font-medium text-gray-700">Search</label>
//             <div className="relative">
//               <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//               <input
//                 type="text"
//                 value={searchTerm}
//                 onChange={e => setSearchTerm(e.target.value)}
//                 placeholder="Search by name, position..."
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
//               />
//             </div>
//           </div>

//           {/* Court Type Filter */}
//           <div>
//             <label className="block mb-2 text-sm font-medium text-gray-700">Court Type</label>
//             <select
//               value={filterCourtType}
//               onChange={e => { setFilterCourtType(e.target.value); setFilterCourtId(""); }}
//               className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
//             >
//               <option value="">All Types</option>
//               <option value="circuit">Circuit Court</option>
//               <option value="magisterial">Magisterial Court</option>
//               <option value="department">Department</option>
//             </select>
//           </div>

//           {/* Court Filter - Only show if court type is selected */}
//           {filterCourtType && (
//             <div>
//               <label className="block mb-2 text-sm font-medium text-gray-700">
//                 {filterCourtType === "circuit" ? "Circuit Court" : 
//                  filterCourtType === "magisterial" ? "Magisterial Court" : "Department"}
//               </label>
//               <select
//                 value={filterCourtId}
//                 onChange={e => setFilterCourtId(e.target.value)}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
//               >
//                 <option value="">All {filterCourtType === "circuit" ? "Circuit Courts" : 
//                                   filterCourtType === "magisterial" ? "Magisterial Courts" : "Departments"}</option>
//                 {childCourts.map(c => (
//                   <option key={c._id} value={c._id}>{c.name}</option>
//                 ))}
//               </select>
//               {childCourts.length === 0 && (
//                 <p className="text-xs text-gray-500 mt-1">No {filterCourtType} courts available</p>
//               )}
//             </div>
//           )}

//           {/* Action Buttons */}
//           <div className="flex items-end gap-2">
//             <button 
//               onClick={handleFilter} 
//               disabled={loading}
//               className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {loading ? "Loading..." : "Apply Filters"}
//             </button>
//             <button 
//               onClick={clearFilters} 
//               disabled={loading}
//               className="px-3 py-2 border border-gray-300 text-gray-600 rounded-xl hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//               title="Clear all filters"
//             >
//               <X size={18} />
//             </button>
//           </div>
//         </div>
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
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Area</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Education</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {filteredStaff.length ? filteredStaff.map(s => (
//                     <tr key={s._id} className="hover:bg-gray-50 transition-colors">
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="font-medium text-gray-900">{s.name}</div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-gray-700">{s.position}</div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-gray-700">{s.area || "-"}</div>
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
//                           {s.employmentStatus.replace('_', ' ')}
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
//                   )) : (
//                     <tr>
//                       <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
//                         <div className="flex flex-col items-center justify-center">
//                           <Search size={48} className="text-gray-300 mb-2" />
//                           <p className="text-lg font-medium">No staff members found</p>
//                           <p className="text-sm">Try adjusting your filters or add a new staff member</p>
//                         </div>
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

// export default TotalStaff;

import React, { useEffect, useState } from "react";
import StaffModal from "../components/StaffModal";
import { getAllStaff, getMagisterialCourts, getCircuitCourts, getDepartments, deleteStaff, getActiveStaff } from "../apis/api";
import { toast } from "react-toastify";
import { FileText, Printer, Plus, Edit2, Trash2, Search, Filter, X } from "lucide-react";

const TotalStaff = () => {
  const [staffList, setStaffList] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [courts, setCourts] = useState([]);
  const [childCourts, setChildCourts] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [filterCourtType, setFilterCourtType] = useState("");
  const [filterCourtId, setFilterCourtId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(false);

  // Fetch all courts & staff
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [circuitsRes, magsRes, deptsRes, staffRes] = await Promise.all([
          getCircuitCourts(),
          getMagisterialCourts(),
          getDepartments(),
          getAllStaff()
        ]);
        
        // Handle different API response structures
        let circuits = [];
        if (circuitsRes && circuitsRes.success) {
          circuits = circuitsRes.courts || [];
        } else if (Array.isArray(circuitsRes)) {
          circuits = circuitsRes;
        }
        
        let mags = [];
        if (magsRes && magsRes.success) {
          mags = magsRes.courts || [];
        } else if (Array.isArray(magsRes)) {
          mags = magsRes;
        }
        
        let depts = [];
        if (deptsRes && deptsRes.success) {
          depts = deptsRes.departments || deptsRes.courts || [];
        } else if (Array.isArray(deptsRes)) {
          depts = deptsRes;
        }

        setCourts([
          ...circuits.map(c => ({ ...c, type: "circuit" })),
          ...mags.map(m => ({ ...m, type: "magisterial" })),
          ...depts.map(d => ({ ...d, type: "department" }))
        ]);

        // Handle staff response
        if (staffRes && staffRes.success) {
          setStaffList(staffRes.staff || []);
        } else if (Array.isArray(staffRes)) {
          setStaffList(staffRes);
        }

      } catch (err) {
        console.error(err);
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!filterCourtType) {
      setChildCourts([]);
      setFilterCourtId("");
    } else {
      const filtered = courts.filter(c => c.type === filterCourtType);
      setChildCourts(filtered);
      
      // Reset court filter if the selected court is not in the filtered list
      if (filterCourtId && !filtered.some(c => c._id === filterCourtId)) {
        setFilterCourtId("");
      }
    }
  }, [filterCourtType, courts, filterCourtId]);

  const handleAddStaff = () => { setSelectedStaff(null); setModalOpen(true); };
  const handleEdit = (staff) => { setSelectedStaff(staff); setModalOpen(true); };

  const handleDelete = async (staff) => {
    if (!staff._id) { toast.error("Cannot delete unsaved staff"); return; }
    if (!window.confirm(`Are you sure you want to delete ${staff.name}?`)) return;

    try {
      const res = await deleteStaff(staff._id);
      if (res && res.success) {
        setStaffList(staffList.filter(s => s._id !== staff._id));
        toast.success(res.message || "Staff deleted successfully");
      } else if (!res) {
        setStaffList(staffList.filter(s => s._id !== staff._id));
        toast.success("Staff deleted successfully");
      }
    } catch (err) {
      toast.error(err.message || "Error deleting staff");
    }
  };

  const handleFilter = async () => {
    try {
      setFilterLoading(true);
      const params = {};
      if (filterCourtType) params.courtType = filterCourtType;
      if (filterCourtId) params.courtId = filterCourtId;
      if (searchTerm) params.search = searchTerm;

      const res = await getActiveStaff(params);
      if (res && res.success) {
        setStaffList(res.staff || []);
      } else if (Array.isArray(res)) {
        setStaffList(res);
      } else {
        toast.error("Failed to filter staff");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to filter staff");
    } finally {
      setFilterLoading(false);
    }
  };

  const clearFilters = async () => {
    setFilterCourtType("");
    setFilterCourtId("");
    setSearchTerm("");
    setChildCourts([]);
    try {
      setFilterLoading(true);
      const res = await getActiveStaff();
      if (res && res.success) {
        setStaffList(res.staff || []);
      } else if (Array.isArray(res)) {
        setStaffList(res);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to clear filters");
    } finally {
      setFilterLoading(false);
    }
  };

  // Skeleton loader components
  const FilterSkeleton = () => (
    <div className="bg-white rounded-xl shadow-sm p-5 mb-6 border border-gray-200">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-5 w-5 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i}>
            <div className="h-4 w-16 bg-gray-200 rounded mb-2 animate-pulse"></div>
            <div className="h-10 w-full bg-gray-200 rounded-xl animate-pulse"></div>
          </div>
        ))}
      </div>
    </div>
  );

  const TableSkeleton = () => (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
      <div className="hidden md:block">
        <div className="bg-gray-50 h-12 animate-pulse"></div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="p-4 border-b border-gray-200">
            <div className="flex space-x-4">
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
              </div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
              </div>
              <div className="flex-1 space-y-2 hidden md:block">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
              </div>
              <div className="flex-1 space-y-2 hidden lg:block">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="md:hidden p-4 space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-gray-50 p-4 rounded-lg animate-pulse">
            <div className="h-5 w-3/4 bg-gray-200 rounded mb-3"></div>
            <div className="h-4 w-1/2 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 w-2/3 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 w-1/3 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">Staff Management</h2>
          <p className="text-sm md:text-base text-gray-600">Manage all judiciary employees in one place</p>
        </div>
        <button 
          onClick={handleAddStaff} 
          className="bg-purple-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-purple-700 transition-colors self-start md:self-auto text-sm md:text-base"
        >
          <Plus size={18} /> Add New Staff
        </button>
      </div>

      {/* Filters Card */}
      {loading ? (
        <FilterSkeleton />
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-4 md:p-5 mb-6 border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <Filter size={18} className="text-purple-600" />
            <h3 className="font-semibold text-gray-700">Filter Staff</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search Input */}
            <div className="md:col-span-1">
              <label className="block mb-2 text-sm font-medium text-gray-700">Search</label>
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="Search by name, position..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                />
              </div>
            </div>

            {/* Court Type Filter */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Court Type</label>
              <select
                value={filterCourtType}
                onChange={e => { setFilterCourtType(e.target.value); setFilterCourtId(""); }}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
              >
                <option value="">All Types</option>
                <option value="circuit">Circuit Court</option>
                <option value="magisterial">Magisterial Court</option>
                <option value="department">Department</option>
              </select>
            </div>

            {/* Court Filter - Only show if court type is selected */}
            {filterCourtType && (
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  {filterCourtType === "circuit" ? "Circuit Court" : 
                  filterCourtType === "magisterial" ? "Magisterial Court" : "Department"}
                </label>
                <select
                  value={filterCourtId}
                  onChange={e => setFilterCourtId(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                >
                  <option value="">All {filterCourtType === "circuit" ? "Circuit Courts" : 
                                    filterCourtType === "magisterial" ? "Magisterial Courts" : "Departments"}</option>
                  {childCourts.map(c => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
                {childCourts.length === 0 && (
                  <p className="text-xs text-gray-500 mt-1">No {filterCourtType} courts available</p>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-end gap-2">
              <button 
                onClick={handleFilter} 
                disabled={filterLoading}
                className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {filterLoading ? "Applying..." : "Apply Filters"}
              </button>
              <button 
                onClick={clearFilters} 
                disabled={filterLoading}
                className="px-3 py-2 border border-gray-300 text-gray-600 rounded-xl hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Clear all filters"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Staff Table */}
      {loading ? (
        <TableSkeleton />
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
          {filterLoading ? (
            <div className="p-4 md:p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-600"></div>
              <p className="mt-2 text-gray-600">Loading staff data...</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50 hidden md:table-header-group">
                    <tr>
                      <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                      <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Area</th>
                      <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                      <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Education</th>
                      <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {staffList.length ? staffList.map(s => (
                      <React.Fragment key={s._id}>
                        {/* Desktop View */}
                        <tr className="hover:bg-gray-50 transition-colors hidden md:table-row">
                          <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                            <div className="font-medium text-gray-900">{s.name}</div>
                          </td>
                          <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                            <div className="text-gray-700">{s.position}</div>
                          </td>
                          <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                            <div className="text-gray-700">{s.area || "-"}</div>
                          </td>
                          <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                            <div className="text-gray-700">{s.phone || "N/A"}</div>
                          </td>
                          <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                            <div className="text-gray-700">{s.education || "-"}</div>
                          </td>
                          <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full capitalize ${
                              s.employmentStatus === 'active' ? 'bg-green-100 text-green-800' :
                              s.employmentStatus === 'on_leave' ? 'bg-blue-100 text-blue-800' :
                              s.employmentStatus === 'retired' ? 'bg-gray-100 text-gray-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {s.employmentStatus.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                            <div className="flex gap-2">
                              <button 
                                onClick={() => handleEdit(s)} 
                                className="text-purple-600 hover:text-purple-800 p-1 rounded-lg hover:bg-purple-50 transition-colors"
                                title="Edit staff"
                              >
                                <Edit2 size={18} />
                              </button>
                              <button 
                                onClick={() => handleDelete(s)} 
                                className="text-red-600 hover:text-red-800 p-1 rounded-lg hover:bg-red-50 transition-colors"
                                title="Delete staff"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                        
                        {/* Mobile View */}
                        <tr className="md:hidden table-row">
                          <td colSpan="7" className="px-4 py-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <div className="flex justify-between items-start mb-2">
                                <h3 className="font-semibold text-gray-900">{s.name}</h3>
                                <span className={`px-2 py-1 text-xs rounded-full capitalize ${
                                  s.employmentStatus === 'active' ? 'bg-green-100 text-green-800' :
                                  s.employmentStatus === 'on_leave' ? 'bg-blue-100 text-blue-800' :
                                  s.employmentStatus === 'retired' ? 'bg-gray-100 text-gray-800' :
                                  'bg-red-100 text-red-800'
                                }`}>
                                  {s.employmentStatus.replace('_', ' ')}
                                </span>
                              </div>
                              <div className="grid grid-cols-2 gap-2 mb-3">
                                <div>
                                  <p className="text-xs text-gray-500">Position</p>
                                  <p className="text-sm">{s.position}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500">Area</p>
                                  <p className="text-sm">{s.area || "-"}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500">Contact</p>
                                  <p className="text-sm">{s.phone || "N/A"}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500">Education</p>
                                  <p className="text-sm">{s.education || "-"}</p>
                                </div>
                              </div>
                              <div className="flex gap-2 justify-end">
                                <button 
                                  onClick={() => handleEdit(s)} 
                                  className="text-purple-600 hover:text-purple-800 p-1 rounded-lg hover:bg-purple-50 transition-colors"
                                  title="Edit staff"
                                >
                                  <Edit2 size={18} />
                                </button>
                                <button 
                                  onClick={() => handleDelete(s)} 
                                  className="text-red-600 hover:text-red-800 p-1 rounded-lg hover:bg-red-50 transition-colors"
                                  title="Delete staff"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      </React.Fragment>
                    )) : (
                      <tr>
                        <td colSpan="7" className="px-4 md:px-6 py-8 text-center text-gray-500">
                          <div className="flex flex-col items-center justify-center">
                            <Search size={48} className="text-gray-300 mb-2" />
                            <p className="text-lg font-medium">No staff members found</p>
                            <p className="text-sm">Try adjusting your filters or add a new staff member</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      )}

      {/* Staff Modal */}
      <StaffModal
        show={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={(updated) => {
          if (selectedStaff) {
            setStaffList(staffList.map(s => s._id === updated._id ? updated : s));
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

export default TotalStaff;