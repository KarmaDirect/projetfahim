import React from "react";

export const FahimLogo: React.FC<{ size?: number }> = ({ size = 48 }) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
      }}
    >
      <div
        style={{
          width: size,
          height: size,
          borderRadius: 12,
          background: "linear-gradient(135deg, #6C63FF 0%, #8B5CF6 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            color: "#fff",
            fontSize: size * 0.45,
            fontWeight: 800,
            fontFamily: "Outfit, sans-serif",
          }}
        >
          FA
        </span>
      </div>
      <span
        style={{
          color: "#fff",
          fontSize: size * 0.7,
          fontWeight: 700,
          fontFamily: "Outfit, sans-serif",
          letterSpacing: -1,
        }}
      >
        Fahim<span style={{ color: "#6C63FF", fontWeight: 400 }}>AE</span>
      </span>
    </div>
  );
};
