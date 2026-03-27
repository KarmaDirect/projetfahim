import React from "react";
import { useCurrentFrame, interpolate } from "remotion";

type ParallaxLayerProps = {
  depth: number; // 0 = closest (no parallax), 1 = furthest (max parallax)
  driftX?: number; // pixels of horizontal drift per 100 frames
  driftY?: number; // pixels of vertical drift per 100 frames
  children: React.ReactNode;
};

export const ParallaxLayer: React.FC<ParallaxLayerProps> = ({
  depth,
  driftX = 0,
  driftY = 0,
  children,
}) => {
  const frame = useCurrentFrame();

  // TranslateZ: deeper layers are pushed further back
  const translateZ = -depth * 200;

  // Slow continuous drift — linear movement scaled by depth
  // Deeper layers drift more slowly (parallax effect)
  const depthScale = 1 - depth * 0.5; // 1.0 at depth 0, 0.5 at depth 1
  const currentDriftX = (frame / 100) * driftX * depthScale;
  const currentDriftY = (frame / 100) * driftY * depthScale;

  // Subtle scale adjustment for depth illusion
  const scale = interpolate(depth, [0, 1], [1, 0.92]);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        transform: `translate3d(${currentDriftX}px, ${currentDriftY}px, ${translateZ}px) scale(${scale})`,
        transformStyle: "preserve-3d",
        willChange: "transform",
      }}
    >
      {children}
    </div>
  );
};
