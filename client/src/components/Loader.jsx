import React from "react";
import "./loader.css"; // we'll add CSS file content below

export default function Loader() {
  return (
    <div className="loader-overlay" role="status" aria-live="polite">
      <div className="loader-circle" />
    </div>
  );
}
