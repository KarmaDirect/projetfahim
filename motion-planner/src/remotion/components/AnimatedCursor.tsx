import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";

type CursorPoint = {
  x: number;
  y: number;
  frame: number;
  click?: boolean;
  hover?: boolean;
};

type AnimatedCursorProps = {
  points: CursorPoint[];
};

const TRAIL_COUNT = 4;
const TRAIL_SPACING = 2; // frames behind per ghost

const bezierEasing = Easing.bezier(0.25, 0.1, 0.25, 1);

function getPositionAtFrame(
  points: CursorPoint[],
  f: number
): { x: number; y: number } {
  if (points.length === 0) return { x: 0, y: 0 };
  if (f <= points[0].frame) return { x: points[0].x, y: points[0].y };

  for (let i = 0; i < points.length - 1; i++) {
    const curr = points[i];
    const next = points[i + 1];

    if (f >= curr.frame && f <= next.frame) {
      const x = interpolate(f, [curr.frame, next.frame], [curr.x, next.x], {
        easing: bezierEasing,
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      const y = interpolate(f, [curr.frame, next.frame], [curr.y, next.y], {
        easing: bezierEasing,
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      return { x, y };
    }
  }

  const last = points[points.length - 1];
  return { x: last.x, y: last.y };
}

function getStateAtFrame(
  points: CursorPoint[],
  f: number
): { click: boolean; hover: boolean } {
  let click = false;
  let hover = false;

  for (const p of points) {
    if (p.click && Math.abs(f - p.frame) < 4) {
      click = true;
    }
    if (p.hover && Math.abs(f - p.frame) < 8) {
      hover = true;
    }
  }

  return { click, hover };
}

export const AnimatedCursor: React.FC<AnimatedCursorProps> = ({ points }) => {
  const frame = useCurrentFrame();

  const { x, y } = getPositionAtFrame(points, frame);
  const { click, hover } = getStateAtFrame(points, frame);

  // Click ripple animation (expands outward over ~8 frames)
  const clickPoint = points.find(
    (p) => p.click && frame >= p.frame && frame < p.frame + 12
  );
  const rippleProgress = clickPoint
    ? interpolate(frame, [clickPoint.frame, clickPoint.frame + 12], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;

  // Hover glow pulse
  const hoverGlowOpacity = hover
    ? interpolate(frame % 20, [0, 10, 20], [0.3, 0.6, 0.3])
    : 0;

  // Click scale
  const clickScale = click
    ? interpolate(
        frame -
          (points.find((p) => p.click && Math.abs(frame - p.frame) < 4)
            ?.frame ?? frame),
        [0, 2, 4],
        [1, 0.8, 1],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
      )
    : 1;

  // Trail ghost positions
  const trails = Array.from({ length: TRAIL_COUNT }, (_, i) => {
    const trailFrame = frame - (i + 1) * TRAIL_SPACING;
    const pos = getPositionAtFrame(points, trailFrame);
    const opacity = interpolate(i, [0, TRAIL_COUNT - 1], [0.3, 0.06]);
    const scale = interpolate(i, [0, TRAIL_COUNT - 1], [0.9, 0.6]);
    return { ...pos, opacity, scale };
  });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 1000,
      }}
    >
      {/* Motion trail ghosts */}
      {trails.map((trail, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: trail.x,
            top: trail.y,
            opacity: trail.opacity,
            transform: `scale(${trail.scale})`,
          }}
        >
          <svg width="24" height="32" viewBox="0 0 24 32" fill="none">
            <path
              d="M2 2L2 26L8 20L14 30L18 28L12 18L20 18L2 2Z"
              fill="white"
              strokeWidth="0"
            />
          </svg>
        </div>
      ))}

      {/* Click ripple effect */}
      {clickPoint && rippleProgress > 0 && rippleProgress < 1 && (
        <>
          <div
            style={{
              position: "absolute",
              left: x - 30,
              top: y - 30,
              width: 60,
              height: 60,
              borderRadius: "50%",
              border: "2px solid rgba(108, 99, 255, 0.7)",
              transform: `scale(${interpolate(rippleProgress, [0, 1], [0.3, 2.5])})`,
              opacity: interpolate(rippleProgress, [0, 0.3, 1], [0, 0.8, 0]),
            }}
          />
          <div
            style={{
              position: "absolute",
              left: x - 20,
              top: y - 20,
              width: 40,
              height: 40,
              borderRadius: "50%",
              border: "1.5px solid rgba(108, 99, 255, 0.5)",
              transform: `scale(${interpolate(rippleProgress, [0, 1], [0.5, 2])})`,
              opacity: interpolate(rippleProgress, [0, 0.2, 1], [0, 0.6, 0]),
            }}
          />
        </>
      )}

      {/* Hover glow */}
      {hover && (
        <div
          style={{
            position: "absolute",
            left: x - 16,
            top: y - 12,
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(108,99,255,0.4) 0%, transparent 70%)",
            opacity: hoverGlowOpacity,
            filter: "blur(6px)",
          }}
        />
      )}

      {/* Main cursor */}
      <div
        style={{
          position: "absolute",
          left: x,
          top: y,
          transform: `scale(${clickScale})`,
        }}
      >
        <svg
          width="24"
          height="32"
          viewBox="0 0 24 32"
          fill="none"
          style={{ filter: "drop-shadow(2px 4px 6px rgba(0,0,0,0.4))" }}
        >
          <path
            d="M2 2L2 26L8 20L14 30L18 28L12 18L20 18L2 2Z"
            fill="white"
            stroke="#1a1a2e"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
};
