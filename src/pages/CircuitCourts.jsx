
// import React, { useEffect, useState } from "react";
// import CircuitCourtCard from "../components/CircuitCourtCard";
// import CircuitCourtModal from "../components/CircuitCourtModal";
// import { getCircuitCourts, deleteCircuitCourt, createCircuitCourt } from "../apis/api";
// import { toast } from "react-toastify";
// import { jsPDF } from "jspdf";
// import * as XLSX from "xlsx";
// import { Document, Packer, Paragraph, Table, TableRow, TableCell, TextRun } from "docx";
// import { FileText, ChevronDown } from "lucide-react";

// const CircuitCourts = () => {
//   const [courts, setCourts] = useState([]);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [editingCourt, setEditingCourt] = useState(null);
//   const [dropdownOpen, setDropdownOpen] = useState(false);

//   useEffect(() => {
//     const fetchCourts = async () => {
//       try {
//         const data = await getCircuitCourts();
//         setCourts(data);
//       } catch (error) {
//         console.error("Failed to fetch courts:", error);
//       }
//     };
//     fetchCourts();
//   }, []);

//   const handleAdd = () => {
//     setEditingCourt(null);
//     setModalOpen(true);
//   };

//   const handleSave = async (court) => {
//     try {
//       const res = await createCircuitCourt(court);
//       if (res.success) {
//         setCourts((prev) => [...prev, { ...res.court, staffCount: 0 }]);
//         toast.success(res.message, { position: "top-right", autoClose: 3000 });
//         setModalOpen(false);
//       } else {
//         toast.error(res.message || "Failed to create court", { position: "top-right", autoClose: 3000 });
//       }
//     } catch (error) {
//       toast.error(error.message || "An error occurred", { position: "top-right", autoClose: 3000 });
//     }
//   };

//   const handleDelete = async (court) => {
//     if (!window.confirm(`Are you sure you want to delete "${court.name}"?`)) return;
//     try {
//       const res = await deleteCircuitCourt(court._id);
//       if (res.success) {
//         setCourts(courts.filter((c) => c._id !== court._id));
//         toast.success(res.message, { position: "top-right", autoClose: 3000 });
//       }
//     } catch (error) {
//       toast.error(error.message || "Failed to delete court", { position: "top-right", autoClose: 3000 });
//     }
//   };

//   const handleView = (court) => {
//     setEditingCourt(court);
//     setModalOpen(true);
//   };

//   // Export functions including total staff
//   const exportPDF = () => {
//     const doc = new jsPDF();
//     doc.text("Circuit Courts", 20, 20);
//     courts.forEach((c, i) => {
//       doc.text(`${i + 1}. Name: ${c.name}, Location: ${c.location || "N/A"}, Total Staff: ${c.staffCount || 0}`, 20, 30 + i * 10);
//     });
//     doc.save("circuit_courts.pdf");
//   };

//   const exportExcel = () => {
//     const data = courts.map(c => ({
//       Name: c.name,
//       Location: c.location || "N/A",
//       "Total Staff": c.staffCount || 0,
//     }));
//     const worksheet = XLSX.utils.json_to_sheet(data);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Circuit Courts");
//     XLSX.writeFile(workbook, "circuit_courts.xlsx");
//   };

//   const exportWord = async () => {
//     const doc = new Document({
//       sections: [
//         {
//           children: [
//             new Paragraph({ text: "Circuit Courts", heading: "Heading1" }),
//             ...courts.map(
//               (c, i) =>
//                 new Paragraph({
//                   children: [
//                     new TextRun(`${i + 1}. Name: ${c.name}, Location: ${c.location || "N/A"}, Total Staff: ${c.staffCount || 0}`)
//                   ]
//                 })
//             )
//           ]
//         }
//       ]
//     });
//     const blob = await Packer.toBlob(doc);
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = "circuit_courts.docx";
//     a.click();
//     URL.revokeObjectURL(url);
//   };

//   return (
//     <div className="p-6">
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-xl font-bold">Circuit Courts</h2>
//         <div className="flex gap-3 relative">
//           <button
//             onClick={handleAdd}
//             className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-1"
//           >
//             + Add Circuit Court
//           </button>

//           {/* Export Dropdown */}
//           <div className="relative">
//             <button
//               onClick={() => setDropdownOpen(!dropdownOpen)}
//               className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center gap-2"
//             >
//               <FileText size={16} />
//               Export Data
//               <ChevronDown size={16} />
//             </button>
//             {dropdownOpen && (
//               <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-lg z-50">
//                 <button
//                   onClick={() => { exportPDF(); setDropdownOpen(false); }}
//                   className="block w-full text-left px-4 py-2 hover:bg-green-100"
//                 >
//                   PDF
//                 </button>
//                 <button
//                   onClick={() => { exportExcel(); setDropdownOpen(false); }}
//                   className="block w-full text-left px-4 py-2 hover:bg-green-100"
//                 >
//                   Excel
//                 </button>
//                 <button
//                   onClick={() => { exportWord(); setDropdownOpen(false); }}
//                   className="block w-full text-left px-4 py-2 hover:bg-green-100"
//                 >
//                   Word
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//         {courts.map((court) => (
//           <CircuitCourtCard
//             key={court._id}
//             court={court}
//             onView={handleView}
//             onDelete={handleDelete}
//           />
//         ))}
//       </div>

//       <CircuitCourtModal
//         show={modalOpen}
//         onClose={() => setModalOpen(false)}
//         onSave={handleSave}
//         initialData={editingCourt}
//       />
//     </div>
//   );
// };

// export default CircuitCourts;


import React, { useEffect, useState } from "react";
import CircuitCourtCard from "../components/CircuitCourtCard";
import CircuitCourtModal from "../components/CircuitCourtModal";
import {
  getCircuitCourts,
  deleteCircuitCourt,
  createCircuitCourt,
} from "../apis/api";
import { toast } from "react-toastify";
import { jsPDF } from "jspdf";
import * as XLSX from "xlsx";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
} from "docx";
import { FileText, ChevronDown } from "lucide-react";

const CircuitCourts = () => {
  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCourt, setEditingCourt] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchCourts = async () => {
      try {
        setLoading(true);
        const data = await getCircuitCourts();
        setCourts(data || []);
      } catch (error) {
        console.error("Failed to fetch courts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourts();
  }, []);

  const handleAdd = () => {
    setEditingCourt(null);
    setModalOpen(true);
  };

  const handleSave = async (court) => {
    try {
      const res = await createCircuitCourt(court);
      if (res.success) {
        if (court._id) {
          // Editing
          setCourts((prev) =>
            prev.map((c) => (c._id === court._id ? { ...c, ...court } : c))
          );
        } else {
          // Creating new
          setCourts((prev) => [...prev, { ...res.court, staffCount: 0 }]);
        }
        toast.success(res.message, { position: "top-right", autoClose: 3000 });
        setModalOpen(false);
      } else {
        toast.error(res.message || "Failed to save court", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      toast.error(error.message || "An error occurred", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleDelete = async (court) => {
    if (!window.confirm(`Are you sure you want to delete "${court.name}"?`))
      return;
    try {
      const res = await deleteCircuitCourt(court._id);
      if (res.success) {
        setCourts(courts.filter((c) => c._id !== court._id));
        toast.success(res.message, { position: "top-right", autoClose: 3000 });
      }
    } catch (error) {
      toast.error(error.message || "Failed to delete court", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleEdit = (court) => {
    setEditingCourt(court);
    setModalOpen(true);
  };

  // Export functions
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Circuit Courts", 20, 20);
    courts.forEach((c, i) => {
      doc.text(
        `${i + 1}. Name: ${c.name}, Location: ${
          c.location || "N/A"
        }, Total Staff: ${c.staffCount || 0}`,
        20,
        30 + i * 10
      );
    });
    doc.save("circuit_courts.pdf");
  };

  const exportExcel = () => {
    const data = courts.map((c) => ({
      Name: c.name,
      Location: c.location || "N/A",
      "Total Staff": c.staffCount || 0,
    }));
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Circuit Courts");
    XLSX.writeFile(workbook, "circuit_courts.xlsx");
  };

  const exportWord = async () => {
    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({ text: "Circuit Courts", heading: "Heading1" }),
            ...courts.map(
              (c, i) =>
                new Paragraph({
                  children: [
                    new TextRun(
                      `${i + 1}. Name: ${c.name}, Location: ${
                        c.location || "N/A"
                      }, Total Staff: ${c.staffCount || 0}`
                    ),
                  ],
                })
            ),
          ],
        },
      ],
    });
    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "circuit_courts.docx";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
        <h2 className="text-lg sm:text-xl font-bold">Circuit Courts</h2>
        <div className="flex flex-wrap gap-3 relative">
          <button
            onClick={handleAdd}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-1"
          >
            + Add Circuit Court
          </button>

          {/* Export Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center gap-2"
            >
              <FileText size={16} />
              Export
              <ChevronDown size={16} />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-lg z-50">
                <button
                  onClick={() => {
                    exportPDF();
                    setDropdownOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-green-100"
                >
                  PDF
                </button>
                <button
                  onClick={() => {
                    exportExcel();
                    setDropdownOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-green-100"
                >
                  Excel
                </button>
                <button
                  onClick={() => {
                    exportWord();
                    setDropdownOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-green-100"
                >
                  Word
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Courts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl shadow-md p-6 bg-gray-100 animate-pulse h-40"
              >
                <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-4" />
                <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto" />
              </div>
            ))
          : courts.map((court) => (
              <CircuitCourtCard
                key={court._id}
                court={court}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
      </div>

      <CircuitCourtModal
        show={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        initialData={editingCourt}
      />
    </div>
  );
};

export default CircuitCourts;
