import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home/Home";
import Login from "./components/Login/Login";
import Navbar from "./components/Common/Navbar";
import WorkOrderManagement from "./components/WorkOrderManagement/WorkOrderManagement";
import SCManagement from "./components/SCManagement/SCManagement";
import ServiceManagement from "./components/ServiceManagement/ServiceManagement";
import SparePartsMaanagement from "./components/SparePartsManagement.jsx/SparePartsMaanagement";
import DeviceManagement from "./components/DeviceManagement/DeviceManagement";
import ArticleManagement from "./components/ArticleManagement/ArticleManagement";
import BasicData from "./components/BasicData/BasicData";
import ReportManagement from "./components/ReportManagement/ReportManagement";
import AdminTools from "./components/AdminTools/AdminTools";
import UserManagement from "./components/UserManagement/UserManagement";
import UserRegister from "./components/UserRegister/UserRegister";
import ProtectedRoute from "./components/Common/ProtectedRoutes";
import StoreManagement from "./components/AdminTools/StoreManagement";

export default function AppRoutes() {
  const appRoutes = [
    { path: "/home", component: <Home /> },
    { path: "/workorder", component: <WorkOrderManagement /> },
    { path: "/sc-management", component: <SCManagement /> },
    { path: "/service-management", component: <ServiceManagement /> },
    { path: "/spare-parts-management", component: <SparePartsMaanagement /> },
    { path: "/device-management", component: <DeviceManagement /> },
    { path: "/artice-management", component: <ArticleManagement /> },
    { path: "/basic-data", component: <BasicData /> },
    { path: "/report-management", component: <ReportManagement /> },
    { path: "/admin-tools/store-management", component: <StoreManagement/> },
    { path: "/admin-tools/user-management", component: <UserManagement /> },
    { path: "/admin-tools/register-user", component: <UserRegister /> },
  ];

  return (
    <Router>
      <Routes>
        {/* Public login route */}
        <Route path="/" element={<Login />} />

        {/* Protected routes */}
        <Route
          element={
            <ProtectedRoute>
              <Navbar />
            </ProtectedRoute>
          }
        >
          {appRoutes.map((item, index) => (
            <Route key={index} path={item.path} element={item.component} />
          ))}
        </Route>
      </Routes>
    </Router>
  );
}
