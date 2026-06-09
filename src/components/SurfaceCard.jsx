import React from "react";

export default function SurfaceCard({ children, className = "" }) {
  return (
    <div className={`bg-surface-container-lowest border border-outline-variant rounded-xl ${className}`}>
      {children}
    </div>
  );
}
