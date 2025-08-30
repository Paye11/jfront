// import { FaGavel } from "react-icons/fa";

// export default function SidebarHeader() {
//   return (
//     <div className="px-6 pb-4 border-b border-white/10 text-center">
//       <FaGavel className="text-3xl mx-auto mt-5" />
//       <h2 className="text-lg mt-2 mb-5 font-bold">Personnel's Office</h2>
//     </div>
//   );
// }
import { FaGavel } from "react-icons/fa";
import { useEffect, useState } from "react";
import "./Sidebar.css";
import { getLogo } from "../apis/api"; 

export default function SidebarHeader() {
  const [logo, setLogo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        setLoading(true);
        const data = await getLogo();
        
        if (data.success && data.logo) {
          setLogo(data.logo);
        }
      } catch (error) {
        console.error("Failed to fetch logo:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogo();
  }, []);

  return (
    <div className="sidebar-header">
      {loading ? (
        <div className="sidebar-logo-placeholder">
          <FaGavel className="sidebar-default-icon" />
        </div>
      ) : logo ? (
        <img src={logo} alt="Court Logo" className="sidebar-logo" />
      ) : (
        <FaGavel className="sidebar-default-icon" />
      )}
      <h2 className="sidebar-title">Personnel's Office</h2>
    </div>
  );
}