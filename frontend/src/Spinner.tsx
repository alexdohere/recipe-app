import React from "react";

const Spinner: React.FC = () => {
  return (
    <div
      style={{
        border: "4px solid rgba(0, 0, 0, 0.1)",
        borderLeftColor: "#09f",
        borderRadius: "50%",
        width: "40px",
        height: "40px",
        animation: "spin 1s linear infinite",
        margin: "20px auto",
      }}
    ></div>
  );
};

export default Spinner;
