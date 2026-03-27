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
import { AnimatedCursor } from "../components/AnimatedCursor";
const FONT = "Inter, system-ui, sans-serif";
const FONT_DISPLAY = "'Space Grotesk', Inter, sans-serif";
const BPM = 128;
const BEAT = Math.round((30 * 60) / BPM); // ~14 frames

const CARD_BG = "#181A20";
const CARD_BORDER = "1px solid rgba(255,255,255,0.08)";
const CARD_SHADOW = "0 15px 50px rgba(0,0,0,0.3)";
const CARD_RADIUS = 16;

const BOUNCY = { damping: 8, stiffness: 120, mass: 0.6 };
const SNAPPY = { damping: 10, stiffness: 140, mass: 0.5 };
const OVERSHOOT = { damping: 6, stiffness: 160, mass: 0.4 };

// Sine-wave drift for subtle floating motion
const drift = (frame: number, seed: number, ampX: number, ampY: number) => ({
  x: Math.sin((frame + seed * 50) * 0.018) * ampX,
  y: Math.cos((frame + seed * 37) * 0.022) * ampY,
});

// Background dots
const BG_DOTS = [
  { x: 120, y: 140, size: 6, color: "#4B5563", seed: 1 },
  { x: 1750, y: 100, size: 5, color: "#6B7280", seed: 2 },
  { x: 80, y: 800, size: 7, color: "#9CA3AF", seed: 3 },
  { x: 1800, y: 750, size: 5, color: "#374151", seed: 4 },
  { x: 350, y: 950, size: 6, color: "#4B5563", seed: 5 },
  { x: 1600, y: 920, size: 4, color: "#6B7280", seed: 6 },
  { x: 960, y: 60, size: 5, color: "#9CA3AF", seed: 7 },
  { x: 1400, y: 500, size: 6, color: "#374151", seed: 8 },
];

// Phase opacity helper: fade in over ~10 frames, fade out over ~14 frames
const phaseOpacity = (
  frame: number,
  enterStart: number,
  exitStart: number,
  exitEnd: number
) => {
  const enter = interpolate(frame, [enterStart, enterStart + 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exit = interpolate(frame, [exitStart, exitEnd], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return enter * exit;
};

export const Scene5_DashboardFeatures: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Global fade out (Beat 40-43, frame 560-600) ──
  const fadeOut = interpolate(frame, [560, 600], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.cubic),
  });

  // ── Badge "LA KILLER FEATURE" ──
  const badgeSpring = spring({
    frame: frame - 6,
    fps,
    config: { damping: 8, stiffness: 100, mass: 0.5 },
  });
  const badgeY = interpolate(badgeSpring, [0, 1], [-60, 0]);
  const badgeScale = interpolate(badgeSpring, [0, 1], [0.7, 1]);
  // Badge fades out when Phase 2 starts
  const badgeFade = interpolate(frame, [126, 140], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Background dots opacity ──
  const dotsAlpha = interpolate(frame, [28, 58, 560, 590], [0, 0.3, 0.3, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ===========================================================
  // PHASE 1: Dashboard Showcase (Beat 0-10, frame 0-140)
  // ===========================================================
  const P1_START = 0;
  const P1_END = 140;
  const showPhase1 = frame < P1_END + 10;
  const p1Opacity = phaseOpacity(frame, P1_START, P1_END - 14, P1_END);

  // Main dashboard image springs from bottom
  const dashSpring = spring({ frame: frame - BEAT, fps, config: BOUNCY });
  const dashY = interpolate(dashSpring, [0, 1], [400, 0]);
  const dashScale = interpolate(dashSpring, [0, 1], [0.8, 1]);
  const dashDrift = drift(frame, 1, 3, 2);

  // KPI cards overlay springs from top, delayed
  const kpiSpring = spring({
    frame: frame - (BEAT + 14),
    fps,
    config: BOUNCY,
  });
  const kpiY = interpolate(kpiSpring, [0, 1], [-200, 0]);
  const kpiScale = interpolate(kpiSpring, [0, 1], [0.85, 1]);
  const kpiDrift = drift(frame, 3, 4, 2);

  // Cursor points for Phase 1
  const cursorPoints = [
    { x: 960, y: 400, frame: 90 },
    { x: 750, y: 350, frame: 100, hover: true },
    { x: 750, y: 350, frame: 110, click: true },
    { x: 960, y: 450, frame: 130 },
  ];

  // ===========================================================
  // PHASE 2: Commandes & Suivi (Beat 10-20, frame 140-280)
  // ===========================================================
  const P2_START = 140;
  const P2_END = 280;
  const showPhase2 = frame >= P2_START - 10 && frame < P2_END + 10;
  const p2Opacity = phaseOpacity(frame, P2_START, P2_END - 14, P2_END);

  const ordersSpring = spring({ frame: frame - P2_START, fps, config: SNAPPY });
  const ordersY = interpolate(ordersSpring, [0, 1], [300, 0]);
  const ordersScale = interpolate(ordersSpring, [0, 1], [0.75, 1]);
  const ordersDrift = drift(frame, 5, 3, 2);

  // Notification badge with overshoot
  const notifSpring = spring({
    frame: frame - (P2_START + 18),
    fps,
    config: OVERSHOOT,
  });
  const notifScale = interpolate(notifSpring, [0, 1], [0.3, 1]);
  const notifY = interpolate(notifSpring, [0, 1], [-40, 0]);

  // Stat pills data
  const statPills = [
    { label: "En cours", value: "3", delay: 0 },
    { label: "Livré", value: "12", delay: 8 },
    { label: "Satisfaction", value: "4.9", delay: 16 },
  ];

  // ===========================================================
  // PHASE 3: Planning (Beat 20-30, frame 280-420)
  // ===========================================================
  const P3_START = 280;
  const P3_END = 420;
  const showPhase3 = frame >= P3_START - 10 && frame < P3_END + 10;
  const p3Opacity = phaseOpacity(frame, P3_START, P3_END - 14, P3_END);

  const planWeekSpring = spring({
    frame: frame - P3_START,
    fps,
    config: SNAPPY,
  });
  const planWeekX = interpolate(planWeekSpring, [0, 1], [600, 0]);
  const planWeekScale = interpolate(planWeekSpring, [0, 1], [0.8, 1]);
  const planWeekDrift = drift(frame, 6, 3, 2);

  const planMonthSpring = spring({
    frame: frame - (P3_START + BEAT * 2),
    fps,
    config: BOUNCY,
  });
  const planMonthScale = interpolate(planMonthSpring, [0, 1], [0.6, 0.92]);
  const planMonthDrift = drift(frame, 7, 2, 3);

  const planLabelSpring = spring({
    frame: frame - (P3_START + 30),
    fps,
    config: SNAPPY,
  });
  const planLabelY = interpolate(planLabelSpring, [0, 1], [40, 0]);

  // ===========================================================
  // PHASE 4: Feature Grid Summary (Beat 30-40, frame 420-560)
  // ===========================================================
  const P4_START = 420;
  const P4_END = 560;
  const showPhase4 = frame >= P4_START - 10 && frame < P4_END + 10;
  const p4Opacity = phaseOpacity(frame, P4_START, P4_END - 14, P4_END);

  const thumbs = [
    { src: "dashboard-dark.png", label: "Dashboard" },
    { src: "orders-detail.png", label: "Commandes" },
    { src: "planning-week.png", label: "Semaine" },
    { src: "planning-month.png", label: "Mois" },
  ];

  const features = [
    { title: "Suivi temps réel", stat: "24/7" },
    { title: "Chat intégré", stat: "0 délai" },
    { title: "Planning transparent", stat: "100%" },
    { title: "Paiement sécurisé", stat: "€" },
  ];

  return (
      <AbsoluteFill style={{ backgroundColor: "#111827" }}>
        {/* Radial background glow */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 80% 60% at 50% 45%, rgba(75,85,99,0.12) 0%, transparent 70%)",
          }}
        />

        {/* Animated secondary glow */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(circle 400px at ${960 + Math.sin(frame * 0.01) * 100}px ${540 + Math.cos(frame * 0.013) * 60}px, rgba(75,85,99,0.06) 0%, transparent 100%)`,
          }}
        />

        {/* Background dots */}
        {BG_DOTS.map((dot, i) => {
          const d = drift(frame, dot.seed, 15, 12);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: dot.x + d.x,
                top: dot.y + d.y,
                width: dot.size,
                height: dot.size,
                borderRadius: "50%",
                backgroundColor: dot.color,
                opacity: dotsAlpha,
                pointerEvents: "none",
              }}
            />
          );
        })}

        {/* ── SFX ── */}
        <Sequence from={0}>
          <Audio src={staticFile("pop.mp3")} volume={0.4} />
        </Sequence>
        <Sequence from={Math.round(BEAT)}>
          <Audio src={staticFile("woosh.mp3")} volume={0.35} />
        </Sequence>
        <Sequence from={Math.round(BEAT + 14)}>
          <Audio src={staticFile("woosh.mp3")} volume={0.3} />
        </Sequence>
        <Sequence from={110}>
          <Audio src={staticFile("mouse-click.mp3")} volume={0.5} />
        </Sequence>
        <Sequence from={140}>
          <Audio src={staticFile("woosh.mp3")} volume={0.35} />
        </Sequence>
        <Sequence from={158}>
          <Audio src={staticFile("paiement notif.mp3")} volume={0.5} />
        </Sequence>
        <Sequence from={168}>
          <Audio src={staticFile("pop.mp3")} volume={0.3} />
        </Sequence>
        <Sequence from={176}>
          <Audio src={staticFile("pop.mp3")} volume={0.25} />
        </Sequence>
        <Sequence from={280}>
          <Audio src={staticFile("woosh.mp3")} volume={0.35} />
        </Sequence>
        <Sequence from={310}>
          <Audio src={staticFile("woosh.mp3")} volume={0.25} />
        </Sequence>
        <Sequence from={420}>
          <Audio src={staticFile("woosh.mp3")} volume={0.3} />
        </Sequence>
        <Sequence from={440}>
          <Audio src={staticFile("pop.mp3")} volume={0.3} />
        </Sequence>
        <Sequence from={448}>
          <Audio src={staticFile("pop.mp3")} volume={0.25} />
        </Sequence>

        {/* All content wrapped in fadeOut */}
        <div style={{ position: "absolute", inset: 0, opacity: fadeOut }}>
          {/* ─── Badge "LA KILLER FEATURE" ─── */}
          <div
            style={{
              position: "absolute",
              top: 44,
              left: 0,
              width: "100%",
              display: "flex",
              justifyContent: "center",
              zIndex: 50,
              opacity: badgeSpring * badgeFade,
              transform: `translateY(${badgeY}px) scale(${badgeScale})`,
            }}
          >
            <div
              style={{
                padding: "12px 36px",
                borderRadius: 100,
                border: "1px solid rgba(255,255,255,0.1)",
                background:
                  "linear-gradient(135deg, rgba(75,85,99,0.12), rgba(75,85,99,0.04))",
                fontSize: 14,
                color: "#9CA3AF",
                fontWeight: 700,
                fontFamily: FONT,
                letterSpacing: 4,
                textTransform: "uppercase",
              }}
            >
              La Killer Feature
            </div>
          </div>

          {/* ═══════════════════════════════════════════
              PHASE 1: Dashboard Showcase
              ═══════════════════════════════════════════ */}
          {showPhase1 && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                opacity: p1Opacity,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                perspective: 1200,
              }}
            >
              {/* KPI cards overlay - positioned above main dashboard */}
              <div
                style={{
                  opacity: kpiSpring,
                  transform: `translateY(${kpiY + kpiDrift.y}px) translateX(${kpiDrift.x}px) scale(${kpiScale})`,
                  zIndex: 3,
                  marginBottom: -40,
                }}
              >
                <Img
                  src={staticFile("kpi-cards-dark.png")}
                  style={{
                    width: 700,
                    height: "auto",
                    borderRadius: CARD_RADIUS,
                    boxShadow: CARD_SHADOW,
                  }}
                />
              </div>

              {/* Main dashboard image */}
              <div
                style={{
                  opacity: dashSpring,
                  transform: `translateY(${dashY + dashDrift.y}px) translateX(${dashDrift.x}px) scale(${dashScale}) rotateX(3deg)`,
                  transformStyle: "preserve-3d",
                  zIndex: 2,
                }}
              >
                <Img
                  src={staticFile("dashboard-dark.png")}
                  style={{
                    width: 1200,
                    height: "auto",
                    borderRadius: CARD_RADIUS,
                    boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
                  }}
                />
              </div>

              {/* Animated cursor */}
              {frame >= 90 && frame < 135 && (
                <AnimatedCursor points={cursorPoints} />
              )}
            </div>
          )}

          {/* ═══════════════════════════════════════════
              PHASE 2: Commandes & Suivi
              ═══════════════════════════════════════════ */}
          {showPhase2 && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                opacity: p2Opacity,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                perspective: 1200,
              }}
            >
              {/* Orders detail image - centered */}
              <div
                style={{
                  opacity: ordersSpring,
                  transform: `translateY(${ordersY + ordersDrift.y}px) translateX(${ordersDrift.x}px) scale(${ordersScale}) rotateX(2deg)`,
                  transformStyle: "preserve-3d",
                  position: "relative",
                }}
              >
                <Img
                  src={staticFile("orders-detail.png")}
                  style={{
                    width: 1100,
                    height: "auto",
                    borderRadius: CARD_RADIUS,
                    boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
                  }}
                />
              </div>

              {/* "Projet livré !" notification - top-right area */}
              <div
                style={{
                  position: "absolute",
                  top: 100,
                  right: 140,
                  opacity: notifSpring,
                  transform: `scale(${notifScale}) translateY(${notifY}px)`,
                  zIndex: 30,
                }}
              >
                <div
                  style={{
                    padding: "22px 34px",
                    backgroundColor: "rgba(255,255,255,0.96)",
                    borderRadius: 18,
                    boxShadow: "0 16px 50px rgba(0,0,0,0.3)",
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                  }}
                >
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: 12,
                      backgroundColor: "#1F2937",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 22,
                      fontWeight: 800,
                      color: "#ffffff",
                      fontFamily: FONT_DISPLAY,
                    }}
                  >
                    {"\u2713"}
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: 21,
                        fontWeight: 700,
                        color: "#1a1a2e",
                        fontFamily: FONT_DISPLAY,
                      }}
                    >
                      Projet livré !
                    </div>
                    <div
                      style={{
                        fontSize: 14,
                        color: "#777",
                        fontFamily: FONT,
                        marginTop: 2,
                      }}
                    >
                      Intro YouTube TechCorp
                    </div>
                  </div>
                </div>
              </div>

              {/* Stat pills - bottom center */}
              <div
                style={{
                  position: "absolute",
                  bottom: 80,
                  left: "50%",
                  transform: "translateX(-50%)",
                  display: "flex",
                  gap: 24,
                  zIndex: 20,
                }}
              >
                {statPills.map((pill, i) => {
                  const pillSpring = spring({
                    frame: frame - (P2_START + 28 + pill.delay),
                    fps,
                    config: BOUNCY,
                  });
                  const pillY = interpolate(pillSpring, [0, 1], [60, 0]);
                  const pillScale = interpolate(pillSpring, [0, 1], [0.6, 1]);
                  return (
                    <div
                      key={i}
                      style={{
                        opacity: pillSpring,
                        transform: `translateY(${pillY}px) scale(${pillScale})`,
                        padding: "18px 34px",
                        borderRadius: 100,
                        background: CARD_BG,
                        border: CARD_BORDER,
                        boxShadow: CARD_SHADOW,
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 28,
                          fontWeight: 800,
                          color: "#ffffff",
                          fontFamily: FONT_DISPLAY,
                        }}
                      >
                        {pill.value}
                      </span>
                      <span
                        style={{
                          fontSize: 17,
                          color: "#9CA3AF",
                          fontFamily: FONT,
                          fontWeight: 500,
                        }}
                      >
                        {pill.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════
              PHASE 3: Planning
              ═══════════════════════════════════════════ */}
          {showPhase3 && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                opacity: p3Opacity,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                perspective: 1200,
              }}
            >
              {/* planning-month.png behind, offset for depth */}
              {frame >= P3_START + BEAT * 2 && (
                <div
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    transform: `translate(-55%, -48%) scale(${planMonthScale}) translateX(${planMonthDrift.x}px) translateY(${planMonthDrift.y}px) rotateX(2deg) rotateY(2deg)`,
                    transformStyle: "preserve-3d",
                    opacity: planMonthSpring * 0.7,
                    zIndex: 1,
                  }}
                >
                  <Img
                    src={staticFile("planning-month.png")}
                    style={{
                      width: 1100,
                      height: "auto",
                      borderRadius: CARD_RADIUS,
                      boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
                    }}
                  />
                </div>
              )}

              {/* planning-week.png in front, centered */}
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  transform: `translate(-50%, -50%) translateX(${planWeekX + planWeekDrift.x}px) translateY(${planWeekDrift.y}px) scale(${planWeekScale}) rotateX(2deg) rotateY(-2deg)`,
                  transformStyle: "preserve-3d",
                  opacity: planWeekSpring,
                  zIndex: 2,
                }}
              >
                <Img
                  src={staticFile("planning-week.png")}
                  style={{
                    width: 1100,
                    height: "auto",
                    borderRadius: CARD_RADIUS,
                    boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
                  }}
                />
              </div>

              {/* Label at bottom */}
              <div
                style={{
                  position: "absolute",
                  bottom: 80,
                  left: "50%",
                  transform: `translateX(-50%) translateY(${planLabelY}px)`,
                  opacity: planLabelSpring,
                  zIndex: 10,
                }}
              >
                <div
                  style={{
                    padding: "20px 50px",
                    borderRadius: 100,
                    background: CARD_BG,
                    border: CARD_BORDER,
                    color: "#fff",
                    fontSize: 26,
                    fontWeight: 700,
                    fontFamily: FONT_DISPLAY,
                    letterSpacing: -0.3,
                    whiteSpace: "nowrap",
                  }}
                >
                  Transparence totale du planning
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════
              PHASE 4: Feature Grid Summary
              ═══════════════════════════════════════════ */}
          {showPhase4 && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                opacity: p4Opacity,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 28,
              }}
            >
              {/* 2x2 thumbnail grid - CENTERED */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 16,
                  perspective: 800,
                }}
              >
                {thumbs.map((thumb, i) => {
                  const thumbSpring = spring({
                    frame: frame - (P4_START + i * 6),
                    fps,
                    config: SNAPPY,
                  });
                  const thumbY = interpolate(thumbSpring, [0, 1], [80, 0]);
                  const thumbScale = interpolate(
                    thumbSpring,
                    [0, 1],
                    [0.7, 1]
                  );
                  const td = drift(frame, 10 + i, 2, 1.5);
                  return (
                    <div
                      key={i}
                      style={{
                        opacity: thumbSpring,
                        transform: `translateY(${thumbY + td.y}px) translateX(${td.x}px) scale(${thumbScale})`,
                      }}
                    >
                      <Img
                        src={staticFile(thumb.src)}
                        style={{
                          width: 420,
                          height: "auto",
                          borderRadius: 12,
                          boxShadow: "0 16px 50px rgba(0,0,0,0.4)",
                          display: "block",
                        }}
                      />
                    </div>
                  );
                })}
              </div>

              {/* 4 feature cards row - CENTERED below thumbnails */}
              <div
                style={{
                  display: "flex",
                  gap: 16,
                  justifyContent: "center",
                }}
              >
                {features.map((feat, i) => {
                  const fSpring = spring({
                    frame: frame - (P4_START + 20 + i * 8),
                    fps,
                    config: BOUNCY,
                  });
                  const fY = interpolate(fSpring, [0, 1], [80, 0]);
                  const fScale = interpolate(fSpring, [0, 1], [0.7, 1]);
                  const fd = drift(frame, 20 + i, 2, 1.5);
                  return (
                    <div
                      key={i}
                      style={{
                        opacity: fSpring,
                        transform: `translateY(${fY + fd.y}px) translateX(${fd.x}px) scale(${fScale})`,
                        width: 210,
                        padding: "20px 16px",
                        background: CARD_BG,
                        borderRadius: CARD_RADIUS,
                        border: CARD_BORDER,
                        boxShadow: CARD_SHADOW,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 6,
                        textAlign: "center",
                      }}
                    >
                      <div
                        style={{
                          fontSize: 32,
                          fontWeight: 800,
                          color: "#ffffff",
                          fontFamily: FONT_DISPLAY,
                          lineHeight: 1,
                        }}
                      >
                        {feat.stat}
                      </div>
                      <div
                        style={{
                          fontSize: 15,
                          fontWeight: 600,
                          color: "#9CA3AF",
                          fontFamily: FONT,
                        }}
                      >
                        {feat.title}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </AbsoluteFill>
  );
};
