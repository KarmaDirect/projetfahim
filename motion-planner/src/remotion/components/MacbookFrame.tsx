import React from "react";
import { Img, staticFile } from "remotion";

type MacbookFrameProps = {
  children: React.ReactNode;
  scale?: number;
  rotateY?: number;
  rotateX?: number;
};

// Screen inset values relative to the frame image.
const SCREEN_INSET = {
  top: "5.5%",
  left: "11.5%",
  right: "11.5%",
  bottom: "16.5%",
};

export const MacbookFrame: React.FC<MacbookFrameProps> = ({
  children,
  scale = 1,
  rotateY = 0,
  rotateX = 0,
}) => {
  return (
    <div
      style={{
        position: "relative",
        display: "inline-block",
        transform: `perspective(1800px) scale(${scale}) rotateY(${rotateY}deg) rotateX(${rotateX}deg)`,
        transformStyle: "preserve-3d",
      }}
    >
      {/* Screen content area — sits behind the frame overlay */}
      <div
        style={{
          position: "absolute",
          top: SCREEN_INSET.top,
          left: SCREEN_INSET.left,
          right: SCREEN_INSET.right,
          bottom: SCREEN_INSET.bottom,
          overflow: "hidden",
          borderRadius: 6,
          background: "#0a0a1a",
          zIndex: 1,
        }}
      >
        {/* Screen content */}
        <div
          style={{
            width: "100%",
            height: "100%",
            position: "relative",
          }}
        >
          {children}
        </div>
      </div>

      {/* MacBook frame image — overlays on top */}
      <Img
        src={staticFile("macbook-frame.png")}
        style={{
          width: 1100,
          height: "auto",
          display: "block",
          position: "relative",
          zIndex: 2,
          pointerEvents: "none",
        }}
      />
    </div>
  );
};
