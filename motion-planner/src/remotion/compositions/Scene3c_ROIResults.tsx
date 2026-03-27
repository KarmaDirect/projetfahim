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
const BEAT = Math.round((30 * 60) / BPM);

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

const animatedCounter = (
  frame: number,
  startFrame: number,
  duration: number,
  target: number,
) => {
  const raw = interpolate(frame, [startFrame, startFrame + duration], [0, target], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  return Math.round(raw);
};

export const Scene3c_ROIResults: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Background ──
  const gridShift = frame * 0.12;
  const gridOpacity = interpolate(frame, [0, BEAT * 2], [0, 0.06], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const orbX = 55 + Math.sin(frame * 0.007) * 12;
  const orbY = 45 + Math.cos(frame * 0.009) * 10;

  // ── Title (Beat 0-2) ──
  const titleSpring = spring({
    frame: frame - BEAT * 0.5,
    fps,
    config: { damping: 7, stiffness: 90, mass: 0.5 },
  });

  // ── Animated counters (Beat 3-10) ──
  const roiNumber = animatedCounter(frame, BEAT * 3, BEAT * 5, 340);
  const trafficNumber = animatedCounter(frame, BEAT * 4, BEAT * 5, 3);
  const visibilityNumber = animatedCounter(frame, BEAT * 5, BEAT * 5, 180);
  const engagementNumber = animatedCounter(frame, BEAT * 6, BEAT * 5, 5);

  // ── 4 stat cards (Beat 3, 4, 5, 6) ──
  const statCards = [
    { number: `+${roiNumber}%`, label: "ROI moyen", icon: "ROI", delay: BEAT * 3 },
    { number: `x${trafficNumber}`, label: "Trafic organique", icon: "x3", delay: BEAT * 4 },
    { number: `+${visibilityNumber}%`, label: "Visibilité en ligne", icon: "+%", delay: BEAT * 5 },
    { number: `x${engagementNumber}`, label: "Engagement social", icon: "x5", delay: BEAT * 6 },
  ].map((card) => ({
    ...card,
    spring: spring({
      frame: frame - card.delay,
      fps,
      config: { damping: 7, stiffness: 110, mass: 0.4 },
    }),
  }));

  // ── ROI progress bar (Beat 3-12) ──
  const roiBarWidth = interpolate(frame, [BEAT * 3, BEAT * 12], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // ── Before/After cards (Beat 8, 9) ──
  const beforeSpring = spring({
    frame: frame - BEAT * 8,
    fps,
    config: { damping: 8, stiffness: 100, mass: 0.45 },
  });
  const afterSpring = spring({
    frame: frame - BEAT * 9,
    fps,
    config: { damping: 8, stiffness: 100, mass: 0.45 },
  });

  // ── Bottom CTA (Beat 14) ──
  const ctaOpacity = interpolate(frame, [BEAT * 14, BEAT * 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Floating dots ──
  const decorDots = [
    { x: 70, y: 200, size: 5, phase: 0 },
    { x: 1840, y: 280, size: 7, phase: 1.2 },
    { x: 110, y: 860, size: 4, phase: 2.4 },
    { x: 1790, y: 810, size: 6, phase: 3.6 },
    { x: 500, y: 1010, size: 5, phase: 0.8 },
    { x: 1400, y: 100, size: 4, phase: 2.0 },
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
              background: `radial-gradient(ellipse 800px 600px at ${orbX}% ${orbY}%, rgba(75,85,99,0.15) 0%, transparent 70%)`,
            }}
          />

          {/* Vignette */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "radial-gradient(ellipse at 50% 50%, transparent 35%, rgba(17,24,39,0.5) 100%)",
              pointerEvents: "none",
              zIndex: 50,
            }}
          />

          {/* Floating dots */}
          {decorDots.map((dot, i) => {
            const colors = [PRIMARY, SECONDARY, MUTED, PRIMARY, SECONDARY, MUTED];
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
                  backgroundColor: colors[i],
                  opacity: 0.25,
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
              paddingTop: 40,
            }}
          >
            {/* Title */}
            <div
              style={{
                opacity: titleSpring,
                transform: `translateY(${interpolate(titleSpring, [0, 1], [-40, 0])}px) scale(${interpolate(titleSpring, [0, 1], [0.7, 1])})`,
                textAlign: "center" as const,
              }}
            >
              <div
                style={{
                  fontSize: 16,
                  fontFamily: FONT,
                  fontWeight: 600,
                  color: MUTED,
                  letterSpacing: 4,
                  textTransform: "uppercase" as const,
                  marginBottom: 8,
                }}
              >
                RETOUR SUR INVESTISSEMENT
              </div>
              <div
                style={{
                  fontSize: 56,
                  fontFamily: FONT_DISPLAY,
                  fontWeight: 800,
                  color: WHITE,
                  letterSpacing: -2,
                  lineHeight: 1.1,
                }}
              >
                Des résultats qui parlent
              </div>
              <div
                style={{
                  fontSize: 56,
                  fontFamily: FONT_DISPLAY,
                  fontWeight: 800,
                  color: MUTED,
                  letterSpacing: -2,
                  lineHeight: 1.1,
                }}
              >
                d'eux-mêmes.
              </div>
            </div>

            {/* 4 stat cards */}
            <div
              style={{
                marginTop: 40,
                display: "flex",
                gap: 24,
                width: 1600,
                justifyContent: "center",
              }}
            >
              {statCards.map((card) => (
                <div
                  key={card.label}
                  style={{
                    flex: 1,
                    opacity: card.spring,
                    transform: `translateY(${interpolate(card.spring, [0, 1], [60, 0])}px) scale(${interpolate(card.spring, [0, 1], [0.6, 1])})`,
                    ...CARD_STYLE,
                    padding: "32px 24px",
                    textAlign: "center" as const,
                    position: "relative" as const,
                    overflow: "hidden",
                  }}
                >
                  {/* Accent line at top */}
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 3,
                      background: `linear-gradient(90deg, ${PRIMARY}, ${SECONDARY})`,
                      opacity: 0.8,
                    }}
                  />
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      background: `linear-gradient(135deg, ${PRIMARY}, ${SECONDARY})`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 12px",
                    }}
                  >
                    <span style={{ color: WHITE, fontSize: 14, fontWeight: 800, fontFamily: FONT_DISPLAY }}>
                      {card.icon}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: 52,
                      fontFamily: FONT_DISPLAY,
                      fontWeight: 800,
                      color: WHITE,
                      letterSpacing: -2,
                    }}
                  >
                    {card.number}
                  </div>
                  <div
                    style={{
                      fontSize: 15,
                      fontFamily: FONT,
                      color: MUTED,
                      fontWeight: 500,
                      marginTop: 8,
                    }}
                  >
                    {card.label}
                  </div>
                </div>
              ))}
            </div>

            {/* ROI progress bar */}
            <div style={{ marginTop: 30, width: 1200 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 8,
                }}
              >
                <span style={{ fontSize: 14, fontFamily: FONT, color: MUTED, fontWeight: 600 }}>
                  Investissement
                </span>
                <span style={{ fontSize: 14, fontFamily: FONT, color: WHITE, fontWeight: 700 }}>
                  +{roiNumber}% ROI
                </span>
              </div>
              <div
                style={{
                  width: "100%",
                  height: 10,
                  backgroundColor: SURFACE,
                  borderRadius: 5,
                  overflow: "hidden",
                  border: `1px solid ${BORDER}`,
                }}
              >
                <div
                  style={{
                    width: `${roiBarWidth}%`,
                    height: "100%",
                    background: `linear-gradient(90deg, ${PRIMARY}, ${SECONDARY}, ${MUTED})`,
                    borderRadius: 5,
                    boxShadow: `0 0 16px rgba(75,85,99,0.4)`,
                  }}
                />
              </div>
            </div>

            {/* Before / After */}
            <div
              style={{
                marginTop: 36,
                display: "flex",
                gap: 40,
                width: 1400,
                justifyContent: "center",
              }}
            >
              {/* BEFORE */}
              <div
                style={{
                  flex: 1,
                  opacity: beforeSpring,
                  transform: `translateX(${interpolate(beforeSpring, [0, 1], [-60, 0])}px) scale(${interpolate(beforeSpring, [0, 1], [0.8, 1])})`,
                  ...CARD_STYLE,
                  padding: "28px 30px",
                  position: "relative" as const,
                  overflow: "hidden",
                }}
              >
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: SECONDARY, opacity: 0.4 }} />
                <div
                  style={{
                    fontSize: 13,
                    fontFamily: FONT,
                    fontWeight: 700,
                    color: SECONDARY,
                    letterSpacing: 3,
                    textTransform: "uppercase" as const,
                    marginBottom: 18,
                  }}
                >
                  SANS FAHIMAE
                </div>
                {[
                  "Motion design basique",
                  "Pas d'habillage professionnel",
                  "Peu de rétention viewers",
                  "Revenus limités",
                  "Croissance lente",
                ].map((item) => (
                  <div
                    key={item}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      marginBottom: 12,
                      fontSize: 16,
                      fontFamily: FONT,
                      color: SECONDARY,
                    }}
                  >
                    <span style={{ color: SECONDARY, fontSize: 16, fontWeight: 700 }}>✕</span>
                    {item}
                  </div>
                ))}
              </div>

              {/* AFTER */}
              <div
                style={{
                  flex: 1,
                  opacity: afterSpring,
                  transform: `translateX(${interpolate(afterSpring, [0, 1], [60, 0])}px) scale(${interpolate(afterSpring, [0, 1], [0.8, 1])})`,
                  ...CARD_STYLE,
                  padding: "28px 30px",
                  position: "relative" as const,
                  overflow: "hidden",
                }}
              >
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: WHITE, opacity: 0.6 }} />
                <div
                  style={{
                    fontSize: 13,
                    fontFamily: FONT,
                    fontWeight: 700,
                    color: WHITE,
                    letterSpacing: 3,
                    textTransform: "uppercase" as const,
                    marginBottom: 18,
                  }}
                >
                  AVEC FAHIMAE
                </div>
                {[
                  "Motion design cinématique",
                  "Habillage complet & professionnel",
                  "Rétention +72% garantie",
                  "Revenus multipliés x2",
                  "Croissance explosive",
                ].map((item) => (
                  <div
                    key={item}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      marginBottom: 12,
                      fontSize: 16,
                      fontFamily: FONT,
                      color: "#ddd",
                    }}
                  >
                    <span style={{ color: WHITE, fontSize: 16, fontWeight: 700 }}>✓</span>
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom CTA */}
            <div
              style={{
                marginTop: 30,
                opacity: ctaOpacity,
                transform: `translateY(${interpolate(ctaOpacity, [0, 1], [15, 0])}px)`,
                display: "flex",
                alignItems: "center",
                gap: 16,
              }}
            >
              <Img
                src={staticFile("pr.png")}
                style={{
                  width: 36,
                  height: "auto",
                  borderRadius: 10,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
                }}
              />
              <span
                style={{
                  fontSize: 20,
                  fontFamily: FONT,
                  fontWeight: 600,
                  color: MUTED,
                  letterSpacing: 1,
                }}
              >
                FahimAE — Le motion design qui fait la différence
              </span>
            </div>
          </div>

          {/* ── SFX ── */}
          <Sequence from={Math.round(BEAT * 0.5)}>
            <Audio src={staticFile("woosh.mp3")} volume={0.35} />
          </Sequence>
          <Sequence from={Math.round(BEAT * 3)}>
            <Audio src={staticFile("pop.mp3")} volume={0.35} />
          </Sequence>
          <Sequence from={Math.round(BEAT * 4)}>
            <Audio src={staticFile("pop.mp3")} volume={0.3} />
          </Sequence>
          <Sequence from={Math.round(BEAT * 5)}>
            <Audio src={staticFile("pop.mp3")} volume={0.3} />
          </Sequence>
          <Sequence from={Math.round(BEAT * 6)}>
            <Audio src={staticFile("pop.mp3")} volume={0.3} />
          </Sequence>
          <Sequence from={Math.round(BEAT * 8)}>
            <Audio src={staticFile("woosh.mp3")} volume={0.3} />
          </Sequence>
          <Sequence from={Math.round(BEAT * 9)}>
            <Audio src={staticFile("woosh.mp3")} volume={0.25} />
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
            }}
          />
    </AbsoluteFill>
  );
};
