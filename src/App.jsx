import React, { Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = lazy(() => import("./pages/Login"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const NotFound = lazy(() => import("./pages/NotFound"));
const LoadingSkeleton = lazy(() =>
  import("./components/skeleton/LoadingSkeleton")
);

// Lazy load sidebar pages
const CircuitCourts = lazy(() => import("./pages/CircuitCourts"));
const MagisterialCourts = lazy(() => import("./pages/MagisterialCourts"));
const Departments = lazy(() => import("./pages/Departments"));
const TotalStaff = lazy(() => import("./pages/TotalStaff"));
const ActiveStaff = lazy(() => import("./pages/ActiveStaff"));
const RetiredStaff = lazy(() => import("./pages/RetiredStaff"));
const DismissedStaff = lazy(() => import("./pages/DismissedStaff"));
const OnLeaveStaff = lazy(() => import("./pages/OnLeaveStaff"));
const RecycleBin = lazy(() => import("./pages/RecycleBin"));
const Settings = lazy(() => import("./pages/Settings"));

const App = () => {
  const getToken = () => localStorage.getItem("token");

  return (
    <Router>
      <Suspense fallback={<LoadingSkeleton />}>
        <ToastContainer />
        <Routes>
          {/* Root redirect */}
          <Route
            path="/"
            element={
              getToken() ? (
                <Navigate to="/admin/dashboard" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* Login */}
          <Route path="/login" element={<Login />} />

          {/* Admin protected routes */}
          <Route
            path="/admin/*"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          >
            {/* Nested Routes inside Dashboard */}
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<div>Dashboard Cards Here</div>} />
            <Route path="circuit-courts" element={<CircuitCourts />} />
            <Route path="magisterial-courts" element={<MagisterialCourts />} />
            <Route path="departments" element={<Departments />} />
            <Route path="total-staff" element={<TotalStaff />} />
            <Route path="active-staff" element={<ActiveStaff />} />
            <Route path="retired-staff" element={<RetiredStaff />} />
            <Route path="dismissed-staff" element={<DismissedStaff />} />
            <Route path="on-leave-staff" element={<OnLeaveStaff />} />
            <Route path="recycle-bin" element={<RecycleBin />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
