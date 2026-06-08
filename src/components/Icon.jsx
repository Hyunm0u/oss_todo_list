import React from "react";

export default function Icon({ children, className = "", fill = false, ...props }) {
  return (
    <span
      className={`material-symbols-outlined ${className}`}
      style={fill ? { fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" } : undefined}
      {...props}
    >
      {children}
    </span>
  );
}
