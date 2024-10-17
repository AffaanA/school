import React from "react";
import "./buttons.css";

const Buttons = ({ variant, children, icon, onClick }) => {
  return (
    <button className={`btn custom-btn ${variant}`} onClick={onClick}>
      {icon && <span className="btn-icon">{icon}</span>}
      {children}
    </button>
  );
};

export default Buttons;
