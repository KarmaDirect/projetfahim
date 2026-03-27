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
const BEAT = Math.round(30 * 60 / BPM); // ~14 frames

// ─── LikeExplosion ──────────────────────────────────────────────────────────
const LikeExplosion: React.FC<{
  delay: number;
  x: number;
  y: number;
  color: string;
  angle: number;
  distance: number;
}> = ({ delay, x, y, color, angle, distance }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 8, stiffness: 60, mass: 0.4 },
  });

  if (progress <= 0) return null;

  const radians = (angle * Math.PI) / 180;
  const moveX = Math.cos(radians) * distance * progress;
  const moveY = Math.sin(radians) * distance * progress;
  const opacity = interpolate(progress, [0, 0.2, 0.7, 1], [0, 1, 0.8, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scale = interpolate(progress, [0, 0.25, 0.6, 1], [0, 1.3, 1, 0.5], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const rotate = interpolate(progress, [0, 1], [0, (angle % 2 === 0 ? 1 : -1) * 30]);

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(${moveX}px, ${moveY}px) scale(${scale}) rotate(${rotate}deg)`,
        opacity,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          width: 20,
          height: 20,
          borderRadius: "50%",
          backgroundColor: color,
        }}
      />
    </div>
  );
};

// ─── Scene ──────────────────────────────────────────────────────────────────
export const Scene4_TargetB2B: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Badge (Beat 0-2) ─────────────────────────────────────────────────
  const badgeProgress = spring({
    frame,
    fps,
    config: { damping: 16, stiffness: 80, mass: 0.5 },
  });
  const badgeBlur = interpolate(badgeProgress, [0, 0.5], [6, 0], {
    extrapolateRight: "clamp",
  });

  // ── Left: Big text per-character (Beat 2-5) ──────────────────────────
  const line1 = "Oubliez les vidéos";
  const line2 = "corporate ennuyeuses.";

  // ── Sub text (Beat 4-6) ───────────────────────────────────────────────
  const subTextOpacity = interpolate(
    frame,
    [BEAT * 4, BEAT * 4 + 20],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const subTextBlur = interpolate(
    frame,
    [BEAT * 4, BEAT * 4 + 16],
    [7, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const subTextY = interpolate(
    frame,
    [BEAT * 4, BEAT * 4 + 20],
    [20, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }
  );

  // ── Platform logos (Beat 5-8) ─────────────────────────────────────────
  const platforms = [
    { src: "Instagram.png", label: "Instagram", delay: BEAT * 5 },
    { src: "Youtube.png", label: "YouTube", delay: BEAT * 5 + 8 },
    { src: "tiktok.png", label: "TikTok", delay: BEAT * 5 + 16 },
  ];

  // ── LinkedIn post (Beat 6-12) ─────────────────────────────────────────
  const postSpring = spring({
    frame: frame - BEAT * 6,
    fps,
    config: { damping: 8, stiffness: 70, mass: 0.5 },
  });
  const postBlur = interpolate(
    frame - BEAT * 6,
    [0, 16],
    [8, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // ── Engagement counters (Beat 6-12) ───────────────────────────────────
  const engagementProgress = interpolate(
    frame - BEAT * 8,
    [0, BEAT * 4],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }
  );

  // ── Like explosions (Beat 10-16) ──────────────────────────────────────
  const dotColors = ["#4B5563", "#6B7280", "#9CA3AF", "#374151", "#4B5563", "#6B7280", "#9CA3AF", "#374151"];
  const explosions = Array.from({ length: 18 }, (_, i) => ({
    delay: BEAT * 10 + i * 3,
    x: 230,
    y: 200,
    color: dotColors[i % dotColors.length],
    angle: (i * 360) / 18 + (i % 3) * 15,
    distance: 100 + (i % 3) * 60,
  }));

  // ── 3D tilt on post card (Beat 14-18) ─────────────────────────────────
  const tiltProgress = interpolate(
    frame,
    [BEAT * 14, BEAT * 15],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );
  const tiltY = interpolate(tiltProgress, [0, 1], [0, -5]);
  const tiltX = interpolate(tiltProgress, [0, 1], [0, 2]);
  // Slow drift after tilt settles
  const driftY = frame > BEAT * 15
    ? Math.sin((frame - BEAT * 15) * 0.02) * 1.5
    : 0;
  const driftX = frame > BEAT * 15
    ? Math.cos((frame - BEAT * 15) * 0.015) * 0.8
    : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: "#111827" }}>
          {/* ── Background gradient orbs ─────────────────────────────── */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse at 65% 40%, rgba(75,85,99,0.08) 0%, transparent 50%), radial-gradient(ellipse at 30% 65%, rgba(55,65,81,0.06) 0%, transparent 45%)",
            }}
          />

          {/* ── Background floating dots ─────────────────────────────── */}
          {[
            { x: 150, y: 180, size: 5, opacity: 0.08, speedX: 0.018, speedY: 0.022 },
            { x: 1650, y: 280, size: 6, opacity: 0.12, speedX: 0.015, speedY: 0.025 },
            { x: 350, y: 780, size: 4, opacity: 0.05, speedX: 0.022, speedY: 0.017 },
            { x: 1450, y: 720, size: 5, opacity: 0.15, speedX: 0.02, speedY: 0.019 },
            { x: 950, y: 130, size: 6, opacity: 0.1, speedX: 0.013, speedY: 0.028 },
            { x: 750, y: 880, size: 4, opacity: 0.07, speedX: 0.025, speedY: 0.014 },
          ].map((dot, i) => (
            <div
              key={`dot-${i}`}
              style={{
                position: "absolute",
                left: dot.x + Math.sin(frame * dot.speedX + i * 2) * 30,
                top: dot.y + Math.cos(frame * dot.speedY + i * 1.5) * 25,
                width: dot.size,
                height: dot.size,
                borderRadius: "50%",
                backgroundColor: `rgba(75,85,99,${dot.opacity})`,
                pointerEvents: "none",
                zIndex: 0,
              }}
            />
          ))}

          {/* ── Vignette overlay ─────────────────────────────────────── */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(17,24,39,0.4) 100%)",
              pointerEvents: "none",
              zIndex: 50,
            }}
          />

          {/* ── Badge ────────────────────────────────────────────────── */}
          <div
            style={{
              position: "absolute",
              top: 48,
              width: "100%",
              display: "flex",
              justifyContent: "center",
              zIndex: 10,
            }}
          >
            <div
              style={{
                opacity: badgeProgress,
                transform: `translateY(${interpolate(badgeProgress, [0, 1], [-50, 0])}px)`,
                filter: `blur(${badgeBlur}px)`,
                padding: "10px 30px",
                borderRadius: 100,
                border: "1px solid rgba(255,255,255,0.1)",
                background: "rgba(75,85,99,0.1)",
                fontSize: 14,
                color: "#9CA3AF",
                fontWeight: 600,
                fontFamily: FONT,
                letterSpacing: 3,
                textTransform: "uppercase",
              }}
            >
              Pour les entreprises
            </div>
          </div>

          {/* ── Main layout ──────────────────────────────────────────── */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              gap: 80,
              padding: "0 100px",
            }}
          >
            {/* ═══ LEFT SIDE ═══════════════════════════════════════════ */}
            <div
              style={{
                maxWidth: 640,
                display: "flex",
                flexDirection: "column",
                gap: 28,
              }}
            >
              {/* Big text — line 1 (white) */}
              <div
                style={{
                  fontSize: 62,
                  fontWeight: 800,
                  fontFamily: FONT_DISPLAY,
                  lineHeight: 1.1,
                  letterSpacing: -2,
                }}
              >
                <span style={{ display: "inline" }}>
                  {line1.split("").map((char, i) => {
                    const charDelay = BEAT * 2 + i * 1.2;
                    const charProgress = spring({
                      frame: frame - charDelay,
                      fps,
                      config: { damping: 9, stiffness: 100, mass: 0.4 },
                    });
                    const charScale = interpolate(charProgress, [0, 1], [1.3, 1]);
                    return (
                      <span
                        key={`l1-${i}`}
                        style={{
                          display: "inline-block",
                          opacity: charProgress,
                          transform: `translateY(${interpolate(charProgress, [0, 1], [30, 0])}px) scale(${charScale})`,
                          color: "#fff",
                          whiteSpace: char === " " ? "pre" : undefined,
                        }}
                      >
                        {char === " " ? "\u00A0" : char}
                      </span>
                    );
                  })}
                </span>
                <br />
                {/* Line 2 (gray) */}
                <span style={{ display: "inline" }}>
                  {line2.split("").map((char, i) => {
                    const charDelay = BEAT * 2 + line1.length * 1.2 + i * 1.2;
                    const charProgress = spring({
                      frame: frame - charDelay,
                      fps,
                      config: { damping: 9, stiffness: 100, mass: 0.4 },
                    });
                    const charScale = interpolate(charProgress, [0, 1], [1.3, 1]);
                    return (
                      <span
                        key={`l2-${i}`}
                        style={{
                          display: "inline-block",
                          opacity: charProgress,
                          transform: `translateY(${interpolate(charProgress, [0, 1], [30, 0])}px) scale(${charScale})`,
                          color: "#6B7280",
                          whiteSpace: char === " " ? "pre" : undefined,
                        }}
                      >
                        {char === " " ? "\u00A0" : char}
                      </span>
                    );
                  })}
                </span>
              </div>

              {/* Sub text (Beat 4-6) */}
              <div
                style={{
                  opacity: subTextOpacity,
                  transform: `translateY(${subTextY}px)`,
                  filter: `blur(${subTextBlur}px)`,
                  fontSize: 23,
                  color: "#9CA3AF",
                  fontFamily: FONT,
                  lineHeight: 1.7,
                  fontWeight: 300,
                }}
              >
                Démarquez-vous avec des formats courts et des animations
                premium.
              </div>

            </div>

            {/* ═══ RIGHT SIDE — LinkedIn post mockup ═══════════════════ */}
            <div
              style={{
                position: "relative",
                opacity: postSpring,
                transform: `translateY(${interpolate(postSpring, [0, 1], [60, 0])}px)`,
                filter: `blur(${postBlur}px)`,
              }}
            >
              <div
                style={{
                  width: 540,
                  backgroundColor: "#fff",
                  borderRadius: 16,
                  overflow: "hidden",
                  boxShadow:
                    "0 30px 80px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.05)",
                  transform: `perspective(800px) rotateY(${tiltY + driftY}deg) rotateX(${tiltX + driftX}deg)`,
                }}
              >
                {/* Post header */}
                <div
                  style={{
                    padding: "22px 28px",
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                  }}
                >
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: "50%",
                      background:
                        "linear-gradient(135deg, #4B5563 0%, #6B7280 100%)",
                      boxShadow: "0 4px 12px rgba(75,85,99,0.3)",
                      flexShrink: 0,
                    }}
                  />
                  <div>
                    <div
                      style={{
                        fontSize: 20,
                        fontWeight: 700,
                        color: "#1a1a2e",
                        fontFamily: FONT_DISPLAY,
                      }}
                    >
                      Votre Entreprise
                    </div>
                    <div
                      style={{
                        fontSize: 14,
                        color: "#9CA3AF",
                        fontFamily: FONT,
                      }}
                    >
                      2 500 abonnés · Sponsorisé
                    </div>
                  </div>
                </div>

                {/* Post text */}
                <div
                  style={{
                    padding: "0 28px 20px",
                    fontSize: 17,
                    color: "#333",
                    fontFamily: FONT,
                    lineHeight: 1.65,
                  }}
                >
                  Notre nouveau produit, expliqué en 30 secondes de motion
                  design. Le résultat parle de lui-même.
                </div>

                {/* Video placeholder */}
                <div
                  style={{
                    width: "100%",
                    height: 300,
                    background:
                      "linear-gradient(135deg, #1F2937 0%, #2C2F38 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                  }}
                >
                  {/* Play button */}
                  <div
                    style={{
                      width: 78,
                      height: 78,
                      borderRadius: "50%",
                      backgroundColor: "rgba(255,255,255,0.92)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 26,
                        marginLeft: 4,
                        color: "#ffffff",
                      }}
                    >
                      ▶
                    </span>
                  </div>

                  {/* Duration badge */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: 12,
                      right: 14,
                      padding: "4px 10px",
                      backgroundColor: "rgba(0,0,0,0.6)",
                      borderRadius: 6,
                      color: "#fff",
                      fontSize: 12,
                      fontFamily: "monospace",
                    }}
                  >
                    0:30
                  </div>
                </div>

                {/* Engagement bar */}
                <div
                  style={{
                    padding: "18px 28px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderTop: "1px solid #eee",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      fontSize: 17,
                      color: "#555",
                      fontFamily: FONT,
                    }}
                  >
                    <span style={{ display: "inline-flex", gap: 4, alignItems: "center" }}>
                      <span style={{ width: 13, height: 13, borderRadius: "50%", backgroundColor: "#0a66c2", display: "inline-block" }} />
                      <span style={{ width: 13, height: 13, borderRadius: "50%", backgroundColor: "#e74c3c", display: "inline-block" }} />
                      <span style={{ width: 13, height: 13, borderRadius: "50%", backgroundColor: "#f39c12", display: "inline-block" }} />
                    </span>
                    <span style={{ fontWeight: 600 }}>
                      {Math.round(
                        engagementProgress * 2847
                      ).toLocaleString()}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: 16,
                      color: "#777",
                      fontFamily: FONT,
                    }}
                  >
                    {Math.round(engagementProgress * 184)} commentaires
                  </div>
                </div>
              </div>

              {/* ── Like explosions (Beat 10-16) ─────────────────────── */}
              {explosions.map((e, i) => (
                <LikeExplosion key={i} {...e} />
              ))}

              {/* ── Stat cards (Beat 16) ───────────────────────────────── */}
              <div
                style={{
                  display: "flex",
                  gap: 20,
                  marginTop: 16,
                  justifyContent: "center",
                }}
              >
                {[
                  { label: "+340%", sub: "engagement rate", delay: BEAT * 16 },
                  { label: "x5", sub: "ROI sur contenu video", delay: BEAT * 16 + 8 },
                ].map((stat, i) => {
                  const statSpring = spring({
                    frame: frame - stat.delay,
                    fps,
                    config: { damping: 8, stiffness: 90, mass: 0.5 },
                  });
                  const statScale = interpolate(statSpring, [0, 1], [0.7, 1]);
                  return (
                    <div
                      key={i}
                      style={{
                        width: 240,
                        height: 100,
                        opacity: statSpring,
                        transform: `translateY(${interpolate(statSpring, [0, 1], [30, 0])}px) scale(${statScale})`,
                        background: "#181A20",
                        borderRadius: 16,
                        border: "1px solid rgba(255,255,255,0.08)",
                        boxShadow: "0 15px 50px rgba(0,0,0,0.3)",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 4,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 34,
                          fontWeight: 800,
                          color: "#fff",
                          fontFamily: FONT_DISPLAY,
                          letterSpacing: -1,
                        }}
                      >
                        {stat.label}
                      </span>
                      <span
                        style={{
                          fontSize: 14,
                          color: "#999",
                          fontFamily: FONT,
                          fontWeight: 400,
                        }}
                      >
                        {stat.sub}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          {/* ── SFX ── */}
          <Sequence from={0}>
            <Audio src={staticFile("pop.mp3")} volume={0.4} />
          </Sequence>
          <Sequence from={Math.round(BEAT * 2)}>
            <Audio src={staticFile("keyboard-typing.mp3")} volume={0.2} />
          </Sequence>
          <Sequence from={Math.round(BEAT * 5)}>
            <Audio src={staticFile("pop.mp3")} volume={0.3} />
          </Sequence>
          <Sequence from={Math.round(BEAT * 6)}>
            <Audio src={staticFile("woosh.mp3")} volume={0.35} />
          </Sequence>
          <Sequence from={Math.round(BEAT * 10)}>
            <Audio src={staticFile("pop.mp3")} volume={0.25} />
          </Sequence>
          <Sequence from={Math.round(BEAT * 16)}>
            <Audio src={staticFile("pop.mp3")} volume={0.3} />
          </Sequence>

          {/* ═══ BOTTOM PLATFORM ICONS ═══════════════════════════════ */}
          <div
            style={{
              position: "absolute",
              bottom: 50,
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              gap: 48,
              alignItems: "center",
              zIndex: 20,
            }}
          >
            {platforms.map((platform, i) => {
              const logoSpring = spring({
                frame: frame - platform.delay,
                fps,
                config: { damping: 8, stiffness: 90, mass: 0.5 },
              });
              const logoBlur = interpolate(
                frame - platform.delay,
                [0, 10],
                [6, 0],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
              );
              const floatY =
                logoSpring > 0.9
                  ? Math.sin((frame + i * 25) * 0.05) * 5
                  : 0;
              // Slide up from bottom
              const slideY = interpolate(logoSpring, [0, 1], [60, 0]);

              return (
                <div
                  key={platform.label}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 10,
                    opacity: logoSpring,
                    transform: `translateY(${slideY + floatY}px) scale(${interpolate(logoSpring, [0, 1], [0.5, 1])})`,
                    filter: `blur(${logoBlur}px)`,
                  }}
                >
                  <Img
                    src={staticFile(platform.src)}
                    style={{
                      width: 64,
                      height: 64,
                      objectFit: "contain",
                      borderRadius: 16,
                      boxShadow: "0 8px 28px rgba(0,0,0,0.35)",
                    }}
                  />
                  <span
                    style={{
                      fontSize: 14,
                      color: "#9CA3AF",
                      fontFamily: FONT,
                      fontWeight: 500,
                    }}
                  >
                    {platform.label}
                  </span>
                </div>
              );
            })}
          </div>

    </AbsoluteFill>
  );
};
