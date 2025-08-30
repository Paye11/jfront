// import React from "react";

// export default function SidebarMenuItem({ icon: Icon, label, active, onClick }) {
//   return (
//     <div
//       onClick={onClick}
//       className={`flex items-center px-6 py-3 cursor-pointer transition-colors
//         ${active ? "bg-blue-600" : "hover:bg-gray-700"}
//       `}
//     >
//       <Icon className="mr-3 text-lg" />
//       <span>{label}</span>
//     </div>
//   );
// }
import React from "react";
import "./Sidebar.css";

export default function SidebarMenuItem({ icon: Icon, label, active, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`sidebar-menu-item ${active ? "sidebar-menu-item-active" : ""}`}
    >
      <Icon className="sidebar-icon" />
      <span className="sidebar-label">{label}</span>
    </div>
  );
}