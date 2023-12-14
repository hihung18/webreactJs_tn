import React from "react";
import { useEffect } from 'react';
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./components/AuthenForm/Login";
import ErrorPage from "./pages/ErrorPage";
import UsersManagement from "./pages/UserManagement"
import PartnersManagement from "./pages/PartnerManagement"
import BusinessTripManagement from "./pages/BusinesssTripManagement"
import ReportManagementTrip from "./pages/ReportManagementTrip"
import ReportManagementTask from "./pages/ReportManagementTask"
import TaskManagement from "./pages/TaskManagement"
import { getMessagingToken, onMessageListener } from "./firebase";

function App() {
  useEffect(() => {
    getMessagingToken();
  },[])
 useEffect(() => {
   onMessageListener().then(data => {
      console.log("Receive foreground: ",data)
      const title = data.notification.title || 'No title';
      const body = data.notification.body || 'No body';
      alert(`${title}\n${body}`);
   })
})
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Login />} />
            {/* <Route index element={<BusinessTripManagement />} /> */}
            <Route path="users" element={<UsersManagement />} />
            <Route path="partners" element={<PartnersManagement />} />
            <Route path="business-trip" element={<BusinessTripManagement />} />
            <Route path="reports-trip/:id" element={<ReportManagementTrip />} />
            <Route path="reports-task/:id" element={<ReportManagementTask />} />
            <Route path="tasks/:id/manager/:managerid/status/:statustrip" element={<TaskManagement />} />
            <Route path="login" element={<Login />} />
            <Route path="*" element={<ErrorPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
