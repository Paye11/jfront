
import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import DashboardCard from "../components/DashboardCard";
import {
  Building,
  Landmark,
  Workflow,
  Users,
  UserCheck,
  UserRoundCog,
  UserRoundX,
} from "lucide-react";
import {
  getCircuitCourts,
  getMagisterialCourts,
  getDepartments,
  getStaffStatistics,
} from "../apis/api";

// Skeleton Loader Component
const SkeletonCard = () => (
  <div className="rounded-2xl shadow-md p-6 animate-pulse bg-white flex justify-between items-center">
    <div>
      <div className="h-4 w-24 bg-gray-300 rounded mb-2"></div>
      <div className="h-6 w-12 bg-gray-300 rounded"></div>
    </div>
    <div className="w-14 h-14 rounded-full bg-gray-300"></div>
  </div>
);

const Dashboard = () => {
  const location = useLocation();
  const isDashboard = location.pathname === "/admin/dashboard";

  const [circuitCourts, setCircuitCourts] = useState([]);
  const [magisterialCourts, setMagisterialCourts] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [staffStats, setStaffStats] = useState({
    total: 0,
    active: 0,
    retired: 0,
    dismissed: 0,
    on_leave: 0,
  });

  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [circuits, magistrals, deptsRes, stats] = await Promise.all([
        getCircuitCourts(),
        getMagisterialCourts(),
        getDepartments(),
        getStaffStatistics(),
      ]);

      setCircuitCourts(circuits || []);
      setMagisterialCourts(magistrals || []);
      setDepartments(deptsRes?.departments || []);
      setStaffStats(stats || {});
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isDashboard) fetchData();
  }, [isDashboard]);

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-6 overflow-y-auto bg-gray-50">
        {isDashboard ? (
          <>
            <h2 className="text-xl sm:text-2xl font-bold mb-6 text-center mt-3 sm:mt-5 pb-3 sm:pb-5">
            Judiciary Branch of Government <br />
            Republic of Liberia
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {loading ? (
                Array(8)
                  .fill(null)
                  .map((_, i) => <SkeletonCard key={i} />)
              ) : (
                <>
                  <DashboardCard
                    icon={Building}
                    title="Total Circuit Courts"
                    value={circuitCourts.length}
                    color="bg-blue-500"
                  />
                  <DashboardCard
                    icon={Landmark}
                    title="Total Magisterial Courts"
                    value={magisterialCourts.length}
                    color="bg-green-500"
                  />
                  <DashboardCard
                    icon={Workflow}
                    title="Total Departments"
                    value={departments.length}
                    color="bg-yellow-500"
                  />
                  <DashboardCard
                    icon={Users}
                    title="Total Staff"
                    value={staffStats.total}
                    color="bg-red-500"
                  />
                  <DashboardCard
                    icon={UserCheck}
                    title="Active Staff"
                    value={staffStats.active}
                    color="bg-purple-500"
                  />
                  <DashboardCard
                    icon={UserRoundCog}
                    title="Retired Staff"
                    value={staffStats.retired}
                    color="bg-pink-500"
                  />
                  <DashboardCard
                    icon={UserRoundX}
                    title="Dismissed Staff"
                    value={staffStats.dismissed}
                    color="bg-gray-600"
                  />
                  <DashboardCard
                    icon={UserRoundCog}
                    title="On Leave Staff"
                    value={staffStats.on_leave}
                    color="bg-indigo-500"
                  />
                </>
              )}
            </div>
          </>
        ) : (
          <Outlet />
        )}
      </main>
    </div>
  );
};

export default Dashboard;
