import React from "react";
import { interpolate, Easing } from "remotion";

type WipeMode = "circle" | "horizontal" | "diagonal";

type WipeTransitionProps = {
  progress: number;
  mode: WipeMode;
  children: React.ReactNode;
};

function getClipPath(mode: WipeMode, progress: number): string {
  // Ease the progress for smoother motion
  const easedProgress = interpolate(progress, [0, 1], [0, 1], {
    easing: Easing.bezier(0.4, 0, 0.2, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  switch (mode) {
    case "circle": {
      // Circle wipe from center — radius goes from 0% to ~72% (covers corners)
      const radius = interpolate(easedProgress, [0, 1], [0, 72]);
      return `circle(${radius}% at 50% 50%)`;
    }

    case "horizontal": {
      // Left-to-right horizontal wipe
      const edge = interpolate(easedProgress, [0, 1], [0, 100]);
      return `inset(0 ${100 - edge}% 0 0)`;
    }

    case "diagonal": {
      // Diagonal wipe from top-left to bottom-right using polygon
      // The polygon sweeps across diagonally
      const offset = interpolate(easedProgress, [0, 1], [-40, 140]);
      return `polygon(0 0, ${offset}% 0, ${offset - 40}% 100%, 0 100%)`;
    }

    default:
      return "none";
  }
}

export const WipeTransition: React.FC<WipeTransitionProps> = ({
  progress,
  mode,
  children,
}) => {
  const clipPath = getClipPath(mode, progress);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        clipPath,
        WebkitClipPath: clipPath,
      }}
    >
      {children}
    </div>
  );
};
