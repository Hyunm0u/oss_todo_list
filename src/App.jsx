import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard.jsx";
import AddSchedule from "./pages/AddSchedule.jsx";
import Stats from "./pages/Stats.jsx";
import Settings from "./pages/Settings.jsx";
import Calendar from "./pages/Calendar.jsx";
import CategoryNotifications from "./pages/CategoryNotifications.jsx";
import TimeNotifications from "./pages/TimeNotifications.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/add" element={<AddSchedule />} />
      <Route path="/stats" element={<Stats />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/calendar" element={<Calendar />} />
      <Route path="/notifications/category" element={<CategoryNotifications />} />
      <Route path="/notifications/time" element={<TimeNotifications />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
