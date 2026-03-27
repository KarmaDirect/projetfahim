import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
  Img,
  staticFile,
  Easing,
  Audio,
  Sequence,
} from "remotion";

const FONT = "Inter, system-ui, sans-serif";
const FONT_DISPLAY = "'Space Grotesk', Inter, sans-serif";
const BPM = 128;
const BEAT = Math.round((30 * 60) / BPM); // ~14 frames

export const Scene2_Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Logo "FA" icon scale-in with heavy overshoot (beat 0-3) ──
  const logoIconScale = spring({
    frame,
    fps,
    config: { damping: 6, stiffness: 160, mass: 0.4 },
  });

  const logoIconRotate = spring({
    frame,
    fps,
    config: { damping: 8, stiffness: 120, mass: 0.5 },
  });

  // ── "FahimAE" typewriter (beat 1-3) ──
  const brandName = "FahimAE";
  const typewriterProgress = interpolate(
    frame,
    [BEAT * 1, BEAT * 2.5],
    [0, brandName.length],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const visibleChars = Math.floor(typewriterProgress);

  // ── Gradient line wipe (beat 3-4) ──
  const lineWipe = spring({
    frame: frame - BEAT * 3,
    fps,
    config: { damping: 8, stiffness: 140, mass: 0.4 },
  });

  // ── Tagline line 1 (beat 3.5) - overlaps with line wipe ──
  const tagline1Prog = spring({
    frame: frame - BEAT * 3.5,
    fps,
    config: { damping: 7, stiffness: 120, mass: 0.4 },
  });

  // ── Tagline line 2 (beat 4) ──
  const tagline2Prog = spring({
    frame: frame - BEAT * 4,
    fps,
    config: { damping: 8, stiffness: 100, mass: 0.5 },
  });

  // ── Logo shrink to top-left (beat 5-7) ──
  const logoShrinkProg = interpolate(frame, [BEAT * 5, BEAT * 7], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });

  const logoScale = interpolate(logoShrinkProg, [0, 1], [1, 0.3]);
  const logoTranslateX = interpolate(logoShrinkProg, [0, 1], [0, -780]);
  const logoTranslateY = interpolate(logoShrinkProg, [0, 1], [0, -450]);
  const logoGroupOpacity = interpolate(logoShrinkProg, [0.5, 1], [1, 0.85], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const taglineFade = interpolate(frame, [BEAT * 5, BEAT * 6], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Screenshot cards (beat 5-8) - start entering while logo is still shrinking ──
  const card1Spring = spring({
    frame: frame - BEAT * 5.5,
    fps,
    config: { damping: 8, stiffness: 80, mass: 0.6 },
  });
  const card2Spring = spring({
    frame: frame - BEAT * 6,
    fps,
    config: { damping: 7, stiffness: 90, mass: 0.5 },
  });
  const card3Spring = spring({
    frame: frame - BEAT * 6.5,
    fps,
    config: { damping: 9, stiffness: 70, mass: 0.5 },
  });

  // Card drift after landing (sine wave)
  const driftTime = Math.max(0, frame - BEAT * 8);
  const card1DriftX = Math.sin(driftTime * 0.025) * 6;
  const card1DriftY = Math.cos(driftTime * 0.03) * 4;
  const card2DriftX = Math.sin(driftTime * 0.03 + 1.5) * 5;
  const card2DriftY = Math.cos(driftTime * 0.02 + 0.8) * 6;
  const card3DriftX = Math.sin(driftTime * 0.02 + 3) * 4;
  const card3DriftY = Math.cos(driftTime * 0.035 + 2) * 5;

  // ── Stat badges (beat 8-12) ──
  const stats = [
    { number: "10s", label: "de motion en 48h", delay: BEAT * 8 },
    { number: "50+", label: "projets livres", delay: BEAT * 8.5 },
    { number: "4.9/5", label: "satisfaction client", delay: BEAT * 9 },
    { number: "24/7", label: "support integre", delay: BEAT * 9.5 },
    { number: "100%", label: "cle en main", delay: BEAT * 10 },
  ];

  const statSprings = stats.map((s) =>
    spring({
      frame: frame - s.delay,
      fps,
      config: { damping: 7, stiffness: 120, mass: 0.4 },
    }),
  );

  const statNumberSprings = stats.map((s) =>
    spring({
      frame: frame - s.delay,
      fps,
      config: { damping: 6, stiffness: 160, mass: 0.3 },
    }),
  );

  const statLabelOpacities = stats.map((s) =>
    interpolate(frame - s.delay, [8, 18], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );

  // ── Floating dots (beat 12-14) ──
  const dots = [
    { x: 120, y: 200, size: 6, delay: BEAT * 12, speed: 0.03, phase: 0 },
    { x: 1780, y: 350, size: 8, delay: BEAT * 12.3, speed: 0.025, phase: 1.2 },
    { x: 300, y: 800, size: 5, delay: BEAT * 12.5, speed: 0.035, phase: 2.4 },
    { x: 1600, y: 150, size: 7, delay: BEAT * 12.8, speed: 0.02, phase: 3.6 },
    { x: 950, y: 950, size: 4, delay: BEAT * 13, speed: 0.04, phase: 0.8 },
    { x: 1400, y: 850, size: 6, delay: BEAT * 13.2, speed: 0.03, phase: 1.6 },
    { x: 200, y: 500, size: 5, delay: BEAT * 13.5, speed: 0.028, phase: 2.0 },
    { x: 1700, y: 600, size: 7, delay: BEAT * 13.8, speed: 0.032, phase: 3.2 },
  ];

  // ── Animated background grid dots ──
  const gridDotOpacity = interpolate(frame, [0, BEAT * 2], [0, 0.08], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const gridShift = frame * 0.15;

  // ── Moving gradient orbs ──
  const orb1X = 30 + Math.sin(frame * 0.012) * 15;
  const orb1Y = 25 + Math.cos(frame * 0.015) * 10;
  const orb2X = 70 + Math.sin(frame * 0.01 + 2) * 12;
  const orb2Y = 65 + Math.cos(frame * 0.013 + 1) * 10;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#111827",
        overflow: "hidden",
      }}
    >
      {/* ── Animated grid dots background ── */}
      <div
        style={{
          position: "absolute",
          inset: -40,
          opacity: gridDotOpacity,
          backgroundImage:
            "radial-gradient(circle, rgba(75,85,99,0.5) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          backgroundPosition: `${gridShift}px ${gridShift * 0.7}px`,
        }}
      />

      {/* ── Moving gradient orbs ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 600px 500px at ${orb1X}% ${orb1Y}%, rgba(75,85,99,0.18) 0%, transparent 70%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 500px 400px at ${orb2X}% ${orb2Y}%, rgba(75,85,99,0.1) 0%, transparent 60%)`,
        }}
      />

      {/* ── Logo + Tagline group ── */}
      <div
        style={{
          position: "absolute",
          zIndex: 10,
          left: "50%",
          top: "50%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 24,
          opacity: logoGroupOpacity,
          transform: `translate(-50%, -50%) translate(${logoTranslateX}px, ${logoTranslateY}px) scale(${logoScale})`,
        }}
      >
        {/* Logo icon + typed name */}
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          {/* FA icon */}
          <div
            style={{
              width: 96,
              height: 96,
              borderRadius: 24,
              background:
                "linear-gradient(135deg, #4B5563 0%, #6B7280 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow:
                "0 14px 60px rgba(75,85,99,0.5), 0 0 0 1px rgba(75,85,99,0.2)",
              transform: `scale(${logoIconScale}) rotate(${interpolate(logoIconRotate, [0, 1], [-12, 0])}deg)`,
              opacity: logoIconScale,
            }}
          >
            <span
              style={{
                color: "#fff",
                fontSize: 42,
                fontWeight: 800,
                fontFamily: FONT_DISPLAY,
              }}
            >
              FA
            </span>
          </div>

          {/* Typed brand name */}
          <span
            style={{
              fontSize: 76,
              fontWeight: 700,
              fontFamily: FONT_DISPLAY,
              letterSpacing: -2,
              opacity: visibleChars > 0 ? 1 : 0,
            }}
          >
            <span style={{ color: "#fff" }}>
              {brandName.slice(0, Math.min(visibleChars, 5))}
            </span>
            <span style={{ color: "#9CA3AF", fontWeight: 400 }}>
              {visibleChars > 5 ? brandName.slice(5, visibleChars) : ""}
            </span>
            {visibleChars < brandName.length && frame % 14 < 9 && (
              <span
                style={{
                  color: "#6B7280",
                  fontWeight: 300,
                  marginLeft: 2,
                }}
              >
                |
              </span>
            )}
          </span>
        </div>

        {/* Animated gradient line */}
        <div
          style={{
            width: interpolate(lineWipe, [0, 1], [0, 320]),
            height: 3,
            background:
              "linear-gradient(90deg, transparent, #4B5563, #6B7280, #9CA3AF, transparent)",
            borderRadius: 2,
            opacity: lineWipe,
            boxShadow: "0 0 20px rgba(75,85,99,0.4)",
          }}
        />

        {/* Tagline line 1 */}
        <div
          style={{
            opacity: tagline1Prog * taglineFade,
            transform: `translateY(${interpolate(tagline1Prog, [0, 1], [30, 0])}px) scale(${interpolate(tagline1Prog, [0, 1], [0.9, 1])})`,
            fontSize: 36,
            color: "#888898",
            fontFamily: FONT,
            fontWeight: 300,
            textAlign: "center",
            letterSpacing: 0.5,
          }}
        >
          La premiere plateforme de
        </div>

        {/* Tagline line 2 (gradient text) */}
        <div
          style={{
            opacity: tagline2Prog * taglineFade,
            transform: `translateY(${interpolate(tagline2Prog, [0, 1], [35, 0])}px) scale(${interpolate(tagline2Prog, [0, 1], [0.85, 1])})`,
            fontSize: 54,
            fontFamily: FONT_DISPLAY,
            fontWeight: 700,
            textAlign: "center",
            letterSpacing: -1,
            background:
              "linear-gradient(90deg, #ffffff, #9CA3AF, #6B7280)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Motion Design a la demande
        </div>
      </div>

      {/* ── Screenshot Card 1: dashboard-dark.png — centered, largest ── */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 110,
          zIndex: 5,
          opacity: card1Spring,
          transform: `
            translateX(-50%)
            perspective(1200px)
            translateY(${interpolate(card1Spring, [0, 1], [200, 0]) + card1DriftY}px)
            scale(${interpolate(card1Spring, [0, 1], [0.6, 1])})
            rotateX(${interpolate(card1Spring, [0, 1], [8, 2])}deg)
          `,
        }}
      >
        <Img
          src={staticFile("dashboard-dark.png")}
          style={{
            width: 1100,
            height: "auto",
            borderRadius: 16,
            boxShadow:
              "0 30px 80px rgba(0,0,0,0.6), 0 10px 30px rgba(75,85,99,0.15), 0 0 0 1px rgba(255,255,255,0.06)",
            display: "block",
          }}
        />
        {/* Label — solid text, no glassmorphism */}
        <div
          style={{
            position: "absolute",
            top: -18,
            right: 24,
            fontSize: 13,
            color: "#9CA3AF",
            fontFamily: FONT,
            fontWeight: 700,
            letterSpacing: 2,
            textTransform: "uppercase",
            textShadow: "0 2px 10px rgba(0,0,0,0.8)",
            opacity: interpolate(card1Spring, [0.7, 1], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          Dashboard
        </div>
        {/* Scan line animation — glowing horizontal line sweeping down */}
        {card1Spring > 0.8 && (
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: `${interpolate(
                (frame - BEAT * 8) % 90,
                [0, 90],
                [0, 100],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
              )}%`,
              height: 2,
              background:
                "linear-gradient(90deg, transparent 5%, rgba(75,85,99,0.5) 30%, rgba(107,114,128,0.8) 50%, rgba(75,85,99,0.5) 70%, transparent 95%)",
              boxShadow: "0 0 20px rgba(75,85,99,0.4), 0 0 60px rgba(75,85,99,0.15)",
              opacity: interpolate(
                (frame - BEAT * 8) % 90,
                [0, 10, 80, 90],
                [0, 0.7, 0.7, 0],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
              ),
              borderRadius: 1,
              pointerEvents: "none",
              zIndex: 10,
            }}
          />
        )}
      </div>

      {/* ── Screenshot Card 2: orders-detail.png — left, overlaps dashboard ── */}
      <div
        style={{
          position: "absolute",
          left: 40,
          top: 380,
          zIndex: 6,
          opacity: card2Spring,
          transform: `
            perspective(1200px)
            translateX(${interpolate(card2Spring, [0, 1], [-250, 0]) + card2DriftX}px)
            translateY(${interpolate(card2Spring, [0, 1], [60, 0]) + card2DriftY}px)
            scale(${interpolate(card2Spring, [0, 1], [0.5, 1])})
            rotateY(${interpolate(card2Spring, [0, 1], [12, 4])}deg)
          `,
        }}
      >
        <Img
          src={staticFile("orders-detail.png")}
          style={{
            width: 700,
            height: "auto",
            borderRadius: 14,
            boxShadow:
              "0 25px 70px rgba(0,0,0,0.55), 0 8px 25px rgba(75,85,99,0.12), 0 0 0 1px rgba(255,255,255,0.05)",
            display: "block",
          }}
        />
        {/* Label — solid text */}
        <div
          style={{
            position: "absolute",
            top: -18,
            left: 18,
            fontSize: 13,
            color: "#9CA3AF",
            fontFamily: FONT,
            fontWeight: 700,
            letterSpacing: 2,
            textTransform: "uppercase",
            textShadow: "0 2px 10px rgba(0,0,0,0.8)",
            opacity: interpolate(card2Spring, [0.7, 1], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          Commandes
        </div>
      </div>

      {/* ── Screenshot Card 3: chat-dashboard.png — overlaps dashboard from bottom-right ── */}
      <div
        style={{
          position: "absolute",
          right: 80,
          top: 460,
          zIndex: 7,
          opacity: card3Spring,
          transform: `
            perspective(1200px)
            translateX(${interpolate(card3Spring, [0, 1], [200, 0]) + card3DriftX}px)
            translateY(${interpolate(card3Spring, [0, 1], [-150, 0]) + card3DriftY}px)
            scale(${interpolate(card3Spring, [0, 1], [0.4, 1])})
            rotateY(${interpolate(card3Spring, [0, 1], [-10, -3])}deg)
          `,
        }}
      >
        <Img
          src={staticFile("chat-dashboard.png")}
          style={{
            width: 580,
            height: "auto",
            borderRadius: 14,
            boxShadow:
              "0 20px 60px rgba(0,0,0,0.5), 0 6px 20px rgba(75,85,99,0.1), 0 0 0 1px rgba(255,255,255,0.04)",
            display: "block",
          }}
        />
        {/* Label — solid text */}
        <div
          style={{
            position: "absolute",
            top: -18,
            right: 18,
            fontSize: 13,
            color: "#9CA3AF",
            fontFamily: FONT,
            fontWeight: 700,
            letterSpacing: 2,
            textTransform: "uppercase",
            textShadow: "0 2px 10px rgba(0,0,0,0.8)",
            opacity: interpolate(card3Spring, [0.7, 1], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          Chat en direct
        </div>
      </div>

      {/* ── Stat badges (beat 8-12) ── */}
      {stats.map((stat, i) => {
        const s = statSprings[i];
        const ns = statNumberSprings[i];
        const lo = statLabelOpacities[i];
        const positions = [
          { left: 180, bottom: 90 },
          { left: 530, bottom: 70 },
          { left: 880, bottom: 95 },
          { left: 1230, bottom: 75 },
          { left: 1580, bottom: 85 },
        ];
        const pos = positions[i];

        return (
          <div
            key={stat.label}
            style={{
              position: "absolute",
              left: pos.left,
              bottom: pos.bottom,
              zIndex: 15,
              opacity: s,
              transform: `
                translateY(${interpolate(s, [0, 1], [60, 0])}px)
                scale(${interpolate(s, [0, 1], [0.5, 1])})
              `,
              padding: "22px 36px",
              borderRadius: 18,
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%)",
              border: "1px solid rgba(255,255,255,0.08)",
              backdropFilter: "blur(20px)",
              boxShadow: `0 15px 50px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05), 0 0 ${interpolate(Math.sin((frame - stat.delay) * 0.08), [-1, 1], [10, 30])}px rgba(75,85,99,${interpolate(Math.sin((frame - stat.delay) * 0.08), [-1, 1], [0.05, 0.15])})`,
              textAlign: "center",
              minWidth: 160,
            }}
          >
            <div
              style={{
                color: "#fff",
                fontSize: 44,
                fontWeight: 800,
                fontFamily: FONT_DISPLAY,
                letterSpacing: -1,
                transform: `scale(${interpolate(ns, [0, 1], [0.3, 1])})`,
                background:
                  "linear-gradient(135deg, #fff 0%, #9CA3AF 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {stat.number}
            </div>
            <div
              style={{
                color: "#777",
                fontSize: 15,
                fontFamily: FONT,
                fontWeight: 500,
                marginTop: 6,
                opacity: lo,
                letterSpacing: 0.5,
              }}
            >
              {stat.label}
            </div>
          </div>
        );
      })}

      {/* ── Floating dots (beat 12-14) ── */}
      {dots.map((dot, i) => {
        const life = frame - dot.delay;
        if (life < 0) return null;
        const dotSpring = spring({
          frame: life,
          fps,
          config: { damping: 10, stiffness: 60, mass: 0.3 },
        });
        const floatX =
          dot.x + Math.sin(life * dot.speed + dot.phase) * 20;
        const floatY =
          dot.y + Math.cos(life * dot.speed * 0.8 + dot.phase) * 15;
        const dotColors = [
          "#4B5563",
          "#6B7280",
          "#9CA3AF",
          "#4B5563",
          "#6B7280",
          "#9CA3AF",
          "#4B5563",
          "#6B7280",
        ];

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: floatX,
              top: floatY,
              width: dot.size,
              height: dot.size,
              borderRadius: "50%",
              backgroundColor: dotColors[i],
              opacity: dotSpring * 0.6,
              transform: `scale(${dotSpring})`,
              boxShadow: `0 0 ${dot.size * 3}px ${dotColors[i]}40`,
              pointerEvents: "none",
            }}
          />
        );
      })}

      {/* ── SFX ── */}
      <Sequence from={0}>
        <Audio src={staticFile("pop.mp3")} volume={0.45} />
      </Sequence>
      <Sequence from={Math.round(BEAT * 1)}>
        <Audio src={staticFile("keyboard-typing.mp3")} volume={0.2} />
      </Sequence>
      <Sequence from={Math.round(BEAT * 3)}>
        <Audio src={staticFile("woosh.mp3")} volume={0.3} />
      </Sequence>
      <Sequence from={Math.round(BEAT * 5.5)}>
        <Audio src={staticFile("woosh.mp3")} volume={0.3} />
      </Sequence>
      <Sequence from={Math.round(BEAT * 6)}>
        <Audio src={staticFile("woosh.mp3")} volume={0.25} />
      </Sequence>
      <Sequence from={Math.round(BEAT * 8)}>
        <Audio src={staticFile("pop.mp3")} volume={0.35} />
      </Sequence>
      <Sequence from={Math.round(BEAT * 9)}>
        <Audio src={staticFile("pop.mp3")} volume={0.3} />
      </Sequence>
      <Sequence from={Math.round(BEAT * 10)}>
        <Audio src={staticFile("pop.mp3")} volume={0.3} />
      </Sequence>

      {/* ── Progress bar accent (bottom of screen) ── */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          height: 3,
          width: `${interpolate(frame, [0, 300], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}%`,
          background:
            "linear-gradient(90deg, #4B5563, #6B7280, #9CA3AF)",
          zIndex: 20,
          boxShadow: "0 0 20px rgba(75,85,99,0.4)",
        }}
      />
    </AbsoluteFill>
  );
};
