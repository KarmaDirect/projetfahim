import React from "react";
import { useCurrentFrame, interpolate } from "remotion";

type FloatingParticleProps = {
  content: string; // text, emoji, or shape character
  x: number;
  y: number;
  size?: number;
  opacity?: number;
  speed?: number; // oscillation speed multiplier (default 1)
  delay?: number; // frame offset for desynchronization
};

export const FloatingParticle: React.FC<FloatingParticleProps> = ({
  content,
  x,
  y,
  size = 24,
  opacity = 0.6,
  speed = 1,
  delay = 0,
}) => {
  const frame = useCurrentFrame();

  const t = (frame + delay) * speed;

  // Sine-wave floating: vertical bobbing
  const floatY = Math.sin(t * 0.06) * 12;

  // Gentle horizontal sway (different frequency for natural feel)
  const floatX = Math.sin(t * 0.04 + 1.5) * 6;

  // Subtle rotation
  const rotation = Math.sin(t * 0.03 + 0.7) * 8;

  // Gentle opacity pulse
  const opacityPulse = interpolate(
    Math.sin(t * 0.05 + 2.0),
    [-1, 1],
    [opacity * 0.7, opacity]
  );

  // Subtle scale breathing
  const scale = interpolate(
    Math.sin(t * 0.035 + 1.0),
    [-1, 1],
    [0.9, 1.1]
  );

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        fontSize: size,
        opacity: opacityPulse,
        transform: `translate(${floatX}px, ${floatY}px) rotate(${rotation}deg) scale(${scale})`,
        pointerEvents: "none",
        userSelect: "none",
        lineHeight: 1,
        willChange: "transform, opacity",
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      {content}
    </div>
  );
};
