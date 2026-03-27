import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
  Easing,
  Audio,
  Sequence,
  staticFile,
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

export const Scene3b_YouTubeGrowth: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Background ──
  const gridShift = frame * 0.12;
  const gridOpacity = interpolate(frame, [0, BEAT * 2], [0, 0.06], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const orbX = 50 + Math.sin(frame * 0.008) * 15;
  const orbY = 40 + Math.cos(frame * 0.01) * 10;

  // ── Badge (Beat 0-1) ──
  const badgeProgress = spring({
    frame,
    fps,
    config: { damping: 7, stiffness: 140, mass: 0.4 },
  });

  // ── Title (Beat 1-2) ──
  const titleSpring = spring({
    frame: frame - BEAT,
    fps,
    config: { damping: 7, stiffness: 100, mass: 0.5 },
  });

  // ── Subtitle (Beat 2-3) ──
  const subtitleOpacity = interpolate(frame, [BEAT * 2, BEAT * 3], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── 3 big counter cards (Beat 4, 5, 6) ──
  const subscriberCount = animatedCounter(frame, BEAT * 4, BEAT * 6, 50000);
  const viewCount = animatedCounter(frame, BEAT * 5, BEAT * 6, 1200000);
  const revenueCount = animatedCounter(frame, BEAT * 6, BEAT * 6, 8500);

  const card1Spring = spring({
    frame: frame - BEAT * 4,
    fps,
    config: { damping: 7, stiffness: 110, mass: 0.4 },
  });
  const card2Spring = spring({
    frame: frame - BEAT * 5,
    fps,
    config: { damping: 7, stiffness: 110, mass: 0.4 },
  });
  const card3Spring = spring({
    frame: frame - BEAT * 6,
    fps,
    config: { damping: 7, stiffness: 110, mass: 0.4 },
  });

  // ── Progress bars (Beat 4-12) ──
  const bar1 = interpolate(frame, [BEAT * 4, BEAT * 12], [0, 85], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const bar2 = interpolate(frame, [BEAT * 5, BEAT * 12], [0, 72], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const bar3 = interpolate(frame, [BEAT * 6, BEAT * 12], [0, 93], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // ── Engagement stats sidebar (Beat 8-12) ──
  const engagementStats = [
    { label: "Watch Time", value: "+240%", delay: BEAT * 8 },
    { label: "CTR Thumbnails", value: "+18%", delay: BEAT * 9 },
    { label: "Rétention", value: "72%", delay: BEAT * 10 },
    { label: "Partages", value: "x4", delay: BEAT * 11 },
  ].map((s) => ({
    ...s,
    spring: spring({
      frame: frame - s.delay,
      fps,
      config: { damping: 8, stiffness: 120, mass: 0.35 },
    }),
  }));

  // ── Benefit pills (Beat 12-15) ──
  const pills = [
    "Intros percutantes",
    "Transitions fluides",
    "Lower thirds pro",
    "Animations logo",
    "Habillage complet",
  ];

  // ── Floating dots ──
  const decorDots = [
    { x: 80, y: 200, size: 5, phase: 0 },
    { x: 1830, y: 350, size: 7, phase: 1.2 },
    { x: 120, y: 850, size: 4, phase: 2.4 },
    { x: 1780, y: 780, size: 6, phase: 3.6 },
    { x: 960, y: 1010, size: 5, phase: 0.8 },
  ];

  const counterCards = [
    {
      label: "Abonnés gagnés",
      value: subscriberCount.toLocaleString("fr-FR"),
      spring: card1Spring,
      barWidth: bar1,
    },
    {
      label: "Vues mensuelles",
      value:
        viewCount >= 1000000
          ? `${(viewCount / 1000000).toFixed(1)}M`
          : viewCount >= 1000
            ? `${Math.round(viewCount / 1000)}K`
            : viewCount.toLocaleString("fr-FR"),
      spring: card2Spring,
      barWidth: bar2,
    },
    {
      label: "Revenus/mois",
      value: `${revenueCount.toLocaleString("fr-FR")}€`,
      spring: card3Spring,
      barWidth: bar3,
    },
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
            const colors = [PRIMARY, SECONDARY, MUTED, PRIMARY, SECONDARY];
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
            {/* Badge */}
            <div
              style={{
                opacity: badgeProgress,
                transform: `translateY(${interpolate(badgeProgress, [0, 1], [-50, 0])}px)`,
                padding: "10px 30px",
                borderRadius: 100,
                border: `1px solid ${BORDER}`,
                background: CARD_BG,
                fontSize: 14,
                color: MUTED,
                fontWeight: 700,
                fontFamily: FONT,
                letterSpacing: 3,
                textTransform: "uppercase" as const,
              }}
            >
              CROISSANCE YOUTUBE
            </div>

            {/* Title */}
            <div
              style={{
                marginTop: 20,
                opacity: titleSpring,
                transform: `translateY(${interpolate(titleSpring, [0, 1], [-30, 0])}px) scale(${interpolate(titleSpring, [0, 1], [0.8, 1])})`,
                textAlign: "center" as const,
              }}
            >
              <div
                style={{
                  fontSize: 60,
                  fontFamily: FONT_DISPLAY,
                  fontWeight: 800,
                  color: WHITE,
                  letterSpacing: -2,
                  lineHeight: 1.1,
                }}
              >
                Boostez votre chaîne
              </div>
              <div
                style={{
                  fontSize: 60,
                  fontFamily: FONT_DISPLAY,
                  fontWeight: 800,
                  background: `linear-gradient(135deg, ${WHITE}, ${MUTED})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  letterSpacing: -2,
                  lineHeight: 1.1,
                }}
              >
                avec du motion design
              </div>
            </div>

            {/* Subtitle */}
            <div
              style={{
                marginTop: 12,
                opacity: subtitleOpacity,
                fontSize: 22,
                color: SECONDARY,
                fontFamily: FONT,
                fontWeight: 300,
              }}
            >
              Des résultats concrets pour les créateurs de contenu
            </div>

            {/* 3 Counter cards + sidebar */}
            <div
              style={{
                marginTop: 40,
                display: "flex",
                gap: 28,
                width: 1600,
                justifyContent: "center",
              }}
            >
              {/* 3 counter cards */}
              <div style={{ display: "flex", gap: 24, flex: 1 }}>
                {counterCards.map((card, i) => (
                  <div
                    key={card.label}
                    style={{
                      flex: 1,
                      opacity: card.spring,
                      transform: `translateY(${interpolate(card.spring, [0, 1], [60, 0])}px) scale(${interpolate(card.spring, [0, 1], [0.6, 1])})`,
                      ...CARD_STYLE,
                      padding: "32px 24px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <div
                      style={{
                        width: 50,
                        height: 50,
                        borderRadius: 14,
                        background: `linear-gradient(135deg, ${PRIMARY}, ${SECONDARY})`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <span style={{ color: WHITE, fontSize: 22, fontWeight: 800, fontFamily: FONT_DISPLAY }}>
                        {["Ab", "Vu", "€"][i]}
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
                      {card.value}
                    </div>
                    <div style={{ fontSize: 15, fontFamily: FONT, color: MUTED, fontWeight: 500 }}>
                      {card.label}
                    </div>
                    <div style={{ width: "100%", height: 6, backgroundColor: SURFACE, borderRadius: 3, marginTop: 4 }}>
                      <div
                        style={{
                          width: `${card.barWidth}%`,
                          height: "100%",
                          background: `linear-gradient(90deg, ${PRIMARY}, ${SECONDARY})`,
                          borderRadius: 3,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Engagement stats sidebar */}
              <div
                style={{
                  width: 320,
                  ...CARD_STYLE,
                  padding: "24px 20px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div
                  style={{
                    fontSize: 13,
                    fontFamily: FONT,
                    fontWeight: 700,
                    color: MUTED,
                    letterSpacing: 2,
                    textTransform: "uppercase" as const,
                    marginBottom: 16,
                  }}
                >
                  MÉTRIQUES D'ENGAGEMENT
                </div>
                {engagementStats.map((stat, i) => (
                  <div
                    key={stat.label}
                    style={{
                      opacity: stat.spring,
                      transform: `translateX(${interpolate(stat.spring, [0, 1], [30, 0])}px)`,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "14px 0",
                      borderBottom: i < engagementStats.length - 1 ? `1px solid ${BORDER}` : "none",
                    }}
                  >
                    <span style={{ fontSize: 15, fontFamily: FONT, color: "#ccc", fontWeight: 500 }}>
                      {stat.label}
                    </span>
                    <span
                      style={{
                        fontSize: 22,
                        fontFamily: FONT_DISPLAY,
                        fontWeight: 800,
                        color: WHITE,
                      }}
                    >
                      {stat.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Benefit pills */}
            <div
              style={{
                marginTop: 36,
                display: "flex",
                gap: 16,
                justifyContent: "center",
              }}
            >
              {pills.map((pill, i) => {
                const pillSpring = spring({
                  frame: frame - BEAT * (12 + i * 0.6),
                  fps,
                  config: { damping: 8, stiffness: 120, mass: 0.35 },
                });
                return (
                  <div
                    key={pill}
                    style={{
                      opacity: pillSpring,
                      transform: `translateY(${interpolate(pillSpring, [0, 1], [20, 0])}px)`,
                      padding: "10px 24px",
                      borderRadius: 100,
                      border: `1px solid ${BORDER}`,
                      background: SURFACE,
                      fontSize: 14,
                      fontFamily: FONT,
                      fontWeight: 600,
                      color: "#ddd",
                    }}
                  >
                    {pill}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── SFX ── */}
          <Sequence from={0}>
            <Audio src={staticFile("pop.mp3")} volume={0.4} />
          </Sequence>
          <Sequence from={Math.round(BEAT * 1)}>
            <Audio src={staticFile("woosh.mp3")} volume={0.35} />
          </Sequence>
          <Sequence from={Math.round(BEAT * 4)}>
            <Audio src={staticFile("pop.mp3")} volume={0.35} />
          </Sequence>
          <Sequence from={Math.round(BEAT * 5)}>
            <Audio src={staticFile("pop.mp3")} volume={0.3} />
          </Sequence>
          <Sequence from={Math.round(BEAT * 6)}>
            <Audio src={staticFile("pop.mp3")} volume={0.3} />
          </Sequence>
          <Sequence from={Math.round(BEAT * 8)}>
            <Audio src={staticFile("pop.mp3")} volume={0.25} />
          </Sequence>
          <Sequence from={Math.round(BEAT * 9)}>
            <Audio src={staticFile("pop.mp3")} volume={0.25} />
          </Sequence>
          <Sequence from={Math.round(BEAT * 12)}>
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
