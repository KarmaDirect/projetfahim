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

// ─── Colors ──────────────────────────────────────────────────────────────────
const BG = "#111827";
const CARD_BG = "#181A20";
const SURFACE = "#1F2937";
const PRIMARY = "#4B5563";
const SECONDARY = "#6B7280";
const MUTED = "#9CA3AF";
const WHITE = "#ffffff";
const BORDER = "rgba(255,255,255,0.08)";

const CARD_STYLE = {
  background: CARD_BG,
  borderRadius: 16,
  border: `1px solid ${BORDER}`,
  boxShadow: "0 15px 50px rgba(0,0,0,0.3)",
} as const;

// ─── Scene: Pour les monteurs pros ──────────────────────────────────────────
export const Scene3_TargetEditors: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Background ──
  const gridShift = frame * 0.12;
  const gridOpacity = interpolate(frame, [0, BEAT * 2], [0, 0.06], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const orb1X = 50 + Math.sin(frame * 0.008) * 15;
  const orb1Y = 40 + Math.cos(frame * 0.01) * 10;

  // ── Badge (Beat 0-1) ──
  const badgeProgress = spring({
    frame,
    fps,
    config: { damping: 7, stiffness: 140, mass: 0.4 },
  });

  // ── PR Logo (Beat 1.5) ──
  const prLogoScale = spring({
    frame: frame - BEAT * 1.5,
    fps,
    config: { damping: 7, stiffness: 130, mass: 0.4 },
  });

  // ── Timeline (Beat 2) ──
  const timelineSlide = spring({
    frame: frame - BEAT * 2,
    fps,
    config: { damping: 8, stiffness: 80, mass: 0.5 },
  });
  const trackAnim = interpolate(frame - BEAT * 2, [0, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // ── Checkmarks (Beat 6-9) — more time to read ──
  const checks = [
    { text: "Livré sous 48-72h", delay: BEAT * 6 },
    { text: "Qualité After Effects professionnelle", delay: BEAT * 7 },
    { text: "Boostez vos tarifs sans effort", delay: BEAT * 8 },
  ].map((item) => ({
    ...item,
    progress: spring({
      frame: frame - item.delay,
      fps,
      config: { damping: 8, stiffness: 100, mass: 0.4 },
    }),
  }));

  // ── Screenshot (Beat 5) ──
  const screenshotSpring = spring({
    frame: frame - BEAT * 4.5,
    fps,
    config: { damping: 8, stiffness: 70, mass: 0.6 },
  });

  // ── 3 Benefit cards (Beat 10-14) — plenty of time to read ──
  const benefitCards = [
    { number: "48h", label: "Délai de livraison", delay: BEAT * 10 },
    { number: "x2", label: "Revenus multipliés", delay: BEAT * 11 },
    { number: "0", label: "Effort requis", delay: BEAT * 12 },
  ].map((card) => ({
    ...card,
    spring: spring({
      frame: frame - card.delay,
      fps,
      config: { damping: 7, stiffness: 110, mass: 0.4 },
    }),
  }));

  // ── Floating dots ──
  const decorDots = [
    { x: 60, y: 180, size: 5, phase: 0, color: PRIMARY },
    { x: 1850, y: 300, size: 7, phase: 1.2, color: SECONDARY },
    { x: 100, y: 850, size: 4, phase: 2.4, color: MUTED },
    { x: 1800, y: 800, size: 6, phase: 3.6, color: PRIMARY },
    { x: 960, y: 1020, size: 5, phase: 0.8, color: SECONDARY },
    { x: 1700, y: 120, size: 4, phase: 2.0, color: MUTED },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: BG, overflow: "hidden" }}>
          {/* Grid dots */}
          <div
            style={{
              position: "absolute",
              inset: -40,
              opacity: gridOpacity,
              backgroundImage:
                "radial-gradient(circle, rgba(75,85,99,0.5) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
              backgroundPosition: `${gridShift}px ${gridShift * 0.6}px`,
            }}
          />

          {/* Gradient orb */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `radial-gradient(ellipse 800px 600px at ${orb1X}% ${orb1Y}%, rgba(75,85,99,0.15) 0%, transparent 70%)`,
            }}
          />

          {/* Vignette */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse at 50% 50%, transparent 35%, rgba(17,24,39,0.5) 100%)",
              pointerEvents: "none",
              zIndex: 50,
            }}
          />

          {/* Floating dots */}
          {decorDots.map((dot, i) => {
            const dotLife = Math.max(0, frame - BEAT * 3);
            const dotOpacity = interpolate(dotLife, [0, 20], [0, 0.3], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: dot.x + Math.sin(frame * 0.02 + dot.phase) * 15,
                  top: dot.y + Math.cos(frame * 0.025 + dot.phase) * 12,
                  width: dot.size,
                  height: dot.size,
                  borderRadius: "50%",
                  backgroundColor: dot.color,
                  opacity: dotOpacity,
                  pointerEvents: "none",
                  zIndex: 1,
                }}
              />
            );
          })}

          {/* ═══ MAIN CONTENT ═══ */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              zIndex: 5,
              paddingTop: 30,
            }}
          >
            {/* Badge */}
            <div
              style={{
                opacity: badgeProgress,
                transform: `translateY(${interpolate(badgeProgress, [0, 1], [-70, 0])}px) scale(${interpolate(badgeProgress, [0, 1], [0.7, 1])})`,
                padding: "12px 34px",
                borderRadius: 100,
                border: `1px solid ${BORDER}`,
                background: CARD_BG,
                fontSize: 14,
                color: MUTED,
                fontWeight: 700,
                fontFamily: FONT,
                letterSpacing: 3,
                textTransform: "uppercase" as const,
                boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
              }}
            >
              POUR LES MONTEURS PROS
            </div>

            {/* PR Logo */}
            <div
              style={{
                marginTop: 14,
                opacity: prLogoScale,
                transform: `scale(${interpolate(prLogoScale, [0, 1], [0.3, 1])}) translateY(${interpolate(prLogoScale, [0, 1], [-40, 0])}px)`,
              }}
            >
              <Img
                src={staticFile("pr.png")}
                style={{
                  width: 60,
                  height: "auto",
                  borderRadius: 16,
                  boxShadow: `0 12px 40px rgba(0,0,0,0.5), 0 0 0 1px ${BORDER}`,
                }}
              />
            </div>

            {/* Timeline mockup */}
            <div
              style={{
                marginTop: 12,
                width: 1100,
                opacity: timelineSlide,
                transform: `translateY(${interpolate(timelineSlide, [0, 1], [30, 0])}px) scale(${interpolate(timelineSlide, [0, 1], [0.85, 1])})`,
                ...CARD_STYLE,
                overflow: "hidden",
              }}
            >
              {/* Window bar */}
              <div
                style={{
                  height: 30,
                  backgroundColor: SURFACE,
                  display: "flex",
                  alignItems: "center",
                  padding: "0 14px",
                  gap: 7,
                }}
              >
                {["#ff5f57", "#ffbd2e", "#27c93f"].map((c) => (
                  <div
                    key={c}
                    style={{
                      width: 9,
                      height: 9,
                      borderRadius: "50%",
                      backgroundColor: c,
                    }}
                  />
                ))}
                <span
                  style={{
                    color: SECONDARY,
                    fontSize: 11,
                    fontFamily: "monospace",
                    marginLeft: 10,
                  }}
                >
                  Montage_Client_v3.prproj
                </span>
              </div>

              {/* Preview area */}
              <div
                style={{
                  height: 140,
                  backgroundColor: "#0f1319",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    width: 240,
                    height: 120,
                    backgroundColor: SURFACE,
                    borderRadius: 8,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: `1px solid ${BORDER}`,
                  }}
                >
                  <div
                    style={{
                      width: 0,
                      height: 0,
                      borderLeft: `20px solid ${SECONDARY}`,
                      borderTop: "12px solid transparent",
                      borderBottom: "12px solid transparent",
                    }}
                  />
                </div>
              </div>

              {/* Timeline header */}
              <div
                style={{
                  height: 22,
                  backgroundColor: SURFACE,
                  borderTop: `1px solid ${BORDER}`,
                  borderBottom: `1px solid ${BORDER}`,
                  display: "flex",
                  alignItems: "center",
                  padding: "0 14px",
                  gap: 50,
                }}
              >
                {["00:00", "00:05", "00:10", "00:15", "00:20", "00:25", "00:30", "00:35", "00:40"].map((t) => (
                  <span
                    key={t}
                    style={{
                      fontSize: 9,
                      color: SECONDARY,
                      fontFamily: "monospace",
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>

              {/* Tracks */}
              <div
                style={{
                  padding: "8px 14px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 5,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ color: SECONDARY, fontSize: 11, fontFamily: "monospace", width: 110, flexShrink: 0 }}>
                    V1 -- Rushes
                  </span>
                  <div
                    style={{
                      width: `${trackAnim * 100}%`,
                      height: 26,
                      backgroundColor: "rgba(75,85,99,0.3)",
                      borderRadius: 4,
                      border: "1px solid rgba(75,85,99,0.5)",
                    }}
                  />
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ color: SECONDARY, fontSize: 11, fontFamily: "monospace", width: 110, flexShrink: 0 }}>
                    V2 -- Titres
                  </span>
                  <div style={{ display: "flex", gap: 6, width: `${trackAnim * 100}%` }}>
                    <div style={{ flex: 2, height: 26, backgroundColor: "rgba(75,85,99,0.2)", borderRadius: 4, border: "1px solid rgba(75,85,99,0.35)" }} />
                    <div style={{ flex: 1, height: 26, backgroundColor: "rgba(75,85,99,0.2)", borderRadius: 4, border: "1px solid rgba(75,85,99,0.35)" }} />
                  </div>
                </div>

                {/* V3 - Motion (dashed = needs work) */}
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ color: MUTED, fontSize: 11, fontFamily: "monospace", width: 110, flexShrink: 0 }}>
                    V3 -- Motion
                  </span>
                  <div
                    style={{
                      width: `${trackAnim * 100}%`,
                      height: 26,
                      backgroundColor: "rgba(156,163,175,0.06)",
                      borderRadius: 4,
                      border: `2px dashed ${MUTED}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span
                      style={{
                        color: MUTED,
                        fontSize: 12,
                        fontFamily: FONT,
                        fontWeight: 500,
                        whiteSpace: "nowrap",
                        opacity: trackAnim,
                      }}
                    >
                      Besoin de motion design...
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Screenshot */}
            <div
              style={{
                marginTop: 16,
                opacity: screenshotSpring,
                transform: `translateY(${interpolate(screenshotSpring, [0, 1], [60, 0])}px) scale(${interpolate(screenshotSpring, [0, 1], [0.7, 1])})`,
              }}
            >
              <Img
                src={staticFile("orders-detail.png")}
                style={{
                  width: 700,
                  height: "auto",
                  borderRadius: 16,
                  boxShadow: `0 30px 80px rgba(0,0,0,0.55), 0 0 0 1px ${BORDER}`,
                  display: "block",
                }}
              />
            </div>

            {/* Checkmarks — spread horizontally */}
            <div
              style={{
                marginTop: 18,
                display: "flex",
                gap: 40,
                justifyContent: "center",
                width: 1100,
              }}
            >
              {checks.map((item) => (
                <div
                  key={item.text}
                  style={{
                    opacity: item.progress,
                    transform: `translateY(${interpolate(item.progress, [0, 1], [15, 0])}px) scale(${interpolate(item.progress, [0, 1], [0.8, 1])})`,
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    fontSize: 16,
                    color: "#ccc",
                    fontFamily: FONT,
                  }}
                >
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 7,
                      backgroundColor: SURFACE,
                      border: `1px solid ${BORDER}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: WHITE,
                      fontSize: 14,
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    ✓
                  </div>
                  {item.text}
                </div>
              ))}
            </div>

            {/* Benefit cards */}
            <div
              style={{
                marginTop: 22,
                display: "flex",
                gap: 24,
                justifyContent: "center",
              }}
            >
              {benefitCards.map((card) => (
                <div
                  key={card.label}
                  style={{
                    width: 260,
                    opacity: card.spring,
                    transform: `translateY(${interpolate(card.spring, [0, 1], [50, 0])}px) scale(${interpolate(card.spring, [0, 1], [0.6, 1])})`,
                    padding: "28px 22px",
                    ...CARD_STYLE,
                    textAlign: "center" as const,
                  }}
                >
                  <div
                    style={{
                      fontSize: 46,
                      fontWeight: 800,
                      fontFamily: FONT_DISPLAY,
                      color: WHITE,
                      letterSpacing: -1,
                    }}
                  >
                    {card.number}
                  </div>
                  <div
                    style={{
                      fontSize: 14,
                      fontFamily: FONT,
                      color: MUTED,
                      fontWeight: 500,
                      marginTop: 8,
                      letterSpacing: 0.3,
                    }}
                  >
                    {card.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── SFX ── */}
          <Sequence from={0}>
            <Audio src={staticFile("pop.mp3")} volume={0.4} />
          </Sequence>
          <Sequence from={Math.round(BEAT * 2)}>
            <Audio src={staticFile("woosh.mp3")} volume={0.35} />
          </Sequence>
          <Sequence from={Math.round(BEAT * 4.5)}>
            <Audio src={staticFile("woosh.mp3")} volume={0.3} />
          </Sequence>
          <Sequence from={Math.round(BEAT * 6)}>
            <Audio src={staticFile("pop.mp3")} volume={0.3} />
          </Sequence>
          <Sequence from={Math.round(BEAT * 7)}>
            <Audio src={staticFile("pop.mp3")} volume={0.25} />
          </Sequence>
          <Sequence from={Math.round(BEAT * 8)}>
            <Audio src={staticFile("pop.mp3")} volume={0.25} />
          </Sequence>
          <Sequence from={Math.round(BEAT * 10)}>
            <Audio src={staticFile("pop.mp3")} volume={0.3} />
          </Sequence>
          <Sequence from={Math.round(BEAT * 11)}>
            <Audio src={staticFile("pop.mp3")} volume={0.25} />
          </Sequence>

          {/* Progress bar */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              height: 3,
              width: `${interpolate(frame, [0, 300], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}%`,
              background: `linear-gradient(90deg, ${PRIMARY}, ${SECONDARY})`,
              zIndex: 60,
              boxShadow: "0 0 16px rgba(75,85,99,0.3)",
            }}
          />
    </AbsoluteFill>
  );
};
