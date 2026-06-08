import React from "react";
import BottomNav from "./BottomNav.jsx";
import Fab from "./Fab.jsx";

export default function PageShell({ children, withNav = true, withFab = false, className = "" }) {
  return (
    <div className={`min-h-screen bg-background text-on-background transition-colors ${withNav ? "pb-32" : ""} ${className}`}>
      {children}
      {withFab ? <Fab /> : null}
      {withNav ? <BottomNav /> : null}
    </div>
  );
}
