import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
  Easing,
  Img,
  staticFile,
  Audio,
  Sequence,
} from "remotion";
const FONT = "Inter, system-ui, sans-serif";
const FONT_DISPLAY = "'Space Grotesk', Inter, sans-serif";
const BPM = 128;
const BEAT = Math.round(30 * 60 / BPM); // ~14 frames

export const Scene6_Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ─── Beat 0-3: Logo "FA" springs in with overshoot + blur-in ───
  const logoSpring = spring({
    frame,
    fps,
    config: { damping: 5, stiffness: 80, mass: 0.6 },
  });
  const logoBlur = interpolate(frame, [0, 25], [12, 0], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });
  const logoScale = interpolate(logoSpring, [0, 1], [0.4, 1]);

  // "FahimAE" text appears letter by letter
  const brandText = "FahimAE";
  const letterStartFrame = 10;
  const letterStagger = 2; // frames per letter

  // ─── Beat 3-4: Animated gradient line wipe ───
  const lineStart = BEAT * 3; // 42
  const lineProgress = spring({
    frame: frame - lineStart,
    fps,
    config: { damping: 20, stiffness: 100, mass: 0.5 },
  });

  // ─── Beat 4-8: Main CTA text per-CHARACTER animation ───
  const ctaStart = BEAT * 4; // 56
  const ctaLine1 = "Passez au niveau";
  const ctaLine2 = "supérieur.";
  const charStagger = 1.5; // frames per character

  // ─── Beat 8-10: Sub text fade in ───
  const subStart = BEAT * 8; // 112
  const subProgress = spring({
    frame: frame - subStart,
    fps,
    config: { damping: 18, stiffness: 60, mass: 0.6 },
  });

  // ─── Beat 10-14: CTA button springs in ───
  const btnStart = BEAT * 10; // 140
  const btnSpring = spring({
    frame: frame - btnStart,
    fps,
    config: { damping: 10, stiffness: 100, mass: 0.5 },
  });
  // Sine-wave pulse oscillation
  const btnPulse = frame >= btnStart
    ? interpolate(Math.sin((frame - btnStart) * 0.12), [-1, 1], [0.96, 1.04])
    : 1;
  // Glow shadow breath
  const glowBreath = frame >= btnStart
    ? interpolate(Math.sin((frame - btnStart) * 0.08), [-1, 1], [0.25, 0.55])
    : 0.25;

  // ─── Beat 14-16: URL fade in ───
  const urlStart = BEAT * 14; // 196
  const urlProgress = spring({
    frame: frame - urlStart,
    fps,
    config: { damping: 14, stiffness: 70, mass: 0.5 },
  });

  // ─── Background glow oscillation ───
  const bgGlowOpacity = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.08, 0.25]);

  // ─── 8 orbiting particles ───
  const particles = Array.from({ length: 8 }, (_, i) => {
    const baseAngle = (i / 8) * Math.PI * 2;
    const angularSpeed = 0.008 + (i % 3) * 0.002;
    const angle = baseAngle + frame * angularSpeed;
    const radius = 280 + i * 30;
    const x = 960 + Math.cos(angle) * radius;
    const y = 540 + Math.sin(angle) * radius * 0.65;
    const size = 6 + (i % 3) * 2;
    const opacity = interpolate(
      Math.sin(frame * 0.05 + i * 0.8),
      [-1, 1],
      [0.15, 0.35]
    );
    return { x, y, size, opacity };
  });

  // Helper: render per-character animation
  const renderAnimatedText = (
    text: string,
    startFrame: number,
    stagger: number,
    style: React.CSSProperties
  ) => {
    return (
      <span style={{ display: "inline-block", ...style }}>
        {text.split("").map((char, i) => {
          const charFrame = startFrame + i * stagger;
          const charProgress = spring({
            frame: frame - charFrame,
            fps,
            config: { damping: 8, stiffness: 120, mass: 0.4 },
          });
          const charOpacity = interpolate(charProgress, [0, 1], [0, 1]);
          const charY = interpolate(charProgress, [0, 1], [20, 0]);

          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                opacity: charOpacity,
                transform: `translateY(${charY}px)`,
                whiteSpace: char === " " ? "pre" : undefined,
              }}
            >
              {char}
            </span>
          );
        })}
      </span>
    );
  };

  return (
      <AbsoluteFill
        style={{
          backgroundColor: "#111827",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Animated radial gradient glow */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(ellipse at 50% 45%, rgba(75,85,99,${bgGlowOpacity}) 0%, transparent 55%)`,
          }}
        />

        {/* Orbiting particles */}
        {particles.map((p, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: p.x,
              top: p.y,
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              backgroundColor: `rgba(107,114,128,${p.opacity})`,
              pointerEvents: "none",
            }}
          />
        ))}

        {/* Floating screenshot cards (depth layer) */}
        {[
          {
            src: "dashboard-dark.png",
            x: 80,
            y: 60,
            opacity: 0.08,
            rotate: -6,
            rotateX: 5,
            rotateY: -3,
            speedX: 0.01,
            speedY: 0.013,
            width: 440,
          },
          {
            src: "orders-detail.png",
            x: 1400,
            y: 700,
            opacity: 0.12,
            rotate: 4,
            rotateX: -3,
            rotateY: 5,
            speedX: 0.008,
            speedY: 0.011,
            width: 420,
          },
          {
            src: "planning-week.png",
            x: 1300,
            y: 300,
            opacity: 0.1,
            rotate: 2,
            rotateX: 4,
            rotateY: -2,
            speedX: 0.012,
            speedY: 0.009,
            width: 400,
          },
        ].map((card, i) => {
          const driftXCard = Math.sin(frame * card.speedX + i * 2) * 15;
          const driftYCard = Math.cos(frame * card.speedY + i * 1.5) * 12;
          return (
            <Img
              key={`screenshot-${i}`}
              src={staticFile(card.src)}
              style={{
                position: "absolute",
                left: card.x + driftXCard,
                top: card.y + driftYCard,
                width: card.width,
                opacity: card.opacity,
                borderRadius: 16,
                transform: `rotate(${card.rotate}deg) rotateX(${card.rotateX}deg) rotateY(${card.rotateY}deg)`,
                pointerEvents: "none",
                zIndex: 1,
              }}
            />
          );
        })}

        {/* Vignette overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at 50% 50%, transparent 50%, rgba(17,24,39,0.6) 100%)",
            pointerEvents: "none",
            zIndex: 2,
          }}
        />

        {/* Main content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 28,
            zIndex: 3,
          }}
        >
          {/* Logo "FA" + "FahimAE" */}
          <div
            style={{
              opacity: logoSpring,
              transform: `scale(${logoScale})`,
              filter: `blur(${logoBlur}px)`,
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            {/* FA icon */}
            <div
              style={{
                width: 84,
                height: 84,
                borderRadius: 22,
                background: "linear-gradient(135deg, #4B5563 0%, #6B7280 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 8px 40px rgba(75,85,99,0.45)",
              }}
            >
              <span
                style={{
                  color: "#fff",
                  fontSize: 38,
                  fontWeight: 800,
                  fontFamily: FONT_DISPLAY,
                }}
              >
                FA
              </span>
            </div>

            {/* "FahimAE" letter by letter */}
            <span
              style={{
                fontSize: 62,
                fontWeight: 700,
                fontFamily: FONT_DISPLAY,
                letterSpacing: -2,
                display: "inline-flex",
              }}
            >
              {brandText.split("").map((char, i) => {
                const lFrame = letterStartFrame + i * letterStagger;
                const lProgress = spring({
                  frame: frame - lFrame,
                  fps,
                  config: { damping: 12, stiffness: 110, mass: 0.4 },
                });
                const isAE = i >= 5; // "AE" portion
                return (
                  <span
                    key={i}
                    style={{
                      display: "inline-block",
                      opacity: interpolate(lProgress, [0, 1], [0, 1]),
                      transform: `translateY(${interpolate(lProgress, [0, 1], [12, 0])}px)`,
                      color: isAE ? "#9CA3AF" : "#fff",
                      fontWeight: isAE ? 400 : 700,
                    }}
                  >
                    {char}
                  </span>
                );
              })}
            </span>
          </div>

          {/* Animated gradient line */}
          <div
            style={{
              width: interpolate(lineProgress, [0, 1], [0, 200]),
              height: 2,
              background: "linear-gradient(90deg, transparent, #4B5563, #6B7280, transparent)",
              borderRadius: 1,
              opacity: lineProgress,
            }}
          />

          {/* Main CTA text */}
          <div
            style={{
              textAlign: "center",
              lineHeight: 1.15,
            }}
          >
            {/* "Passez au niveau" */}
            <div>
              {renderAnimatedText(ctaLine1, ctaStart, charStagger, {
                fontSize: 74,
                fontWeight: 800,
                color: "#fff",
                fontFamily: FONT_DISPLAY,
                letterSpacing: -3,
              })}
            </div>
            {/* "supérieur." with gradient */}
            <div style={{ marginTop: 4 }}>
              {ctaLine2.split("").map((char, i) => {
                const charFrame = ctaStart + ctaLine1.length * charStagger + i * charStagger;
                const charProgress = spring({
                  frame: frame - charFrame,
                  fps,
                  config: { damping: 8, stiffness: 120, mass: 0.4 },
                });
                const charOpacity = interpolate(charProgress, [0, 1], [0, 1]);
                const charY = interpolate(charProgress, [0, 1], [20, 0]);

                return (
                  <span
                    key={i}
                    style={{
                      display: "inline-block",
                      opacity: charOpacity,
                      transform: `translateY(${charY}px)`,
                      fontSize: 74,
                      fontWeight: 800,
                      fontFamily: FONT_DISPLAY,
                      letterSpacing: -3,
                      background: "linear-gradient(90deg, #ffffff, #9CA3AF, #6B7280)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      whiteSpace: char === " " ? "pre" : undefined,
                    }}
                  >
                    {char}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Sub text */}
          <div
            style={{
              opacity: interpolate(subProgress, [0, 1], [0, 1]),
              transform: `translateY(${interpolate(subProgress, [0, 1], [15, 0])}px)`,
              fontSize: 26,
              color: "#9CA3AF",
              fontFamily: FONT,
              fontWeight: 300,
              letterSpacing: 0.5,
            }}
          >
            Créez votre premier projet dès maintenant.
          </div>

          {/* CTA Button */}
          <div
            style={{
              opacity: btnSpring,
              transform: `scale(${interpolate(btnSpring, [0, 1], [0.7, 1]) * btnPulse})`,
              marginTop: 8,
            }}
          >
            <div
              style={{
                padding: "24px 64px",
                background: "linear-gradient(135deg, #4B5563 0%, #6B7280 100%)",
                borderRadius: 18,
                color: "#fff",
                fontSize: 26,
                fontWeight: 700,
                fontFamily: FONT_DISPLAY,
                boxShadow: `0 8px 50px rgba(75,85,99,${glowBreath})`,
                display: "flex",
                alignItems: "center",
                gap: 14,
                letterSpacing: -0.5,
              }}
            >
              Commencer à déléguer
              <span style={{ fontSize: 30, opacity: 0.8 }}>→</span>
            </div>
          </div>

          {/* URL */}
          <div
            style={{
              opacity: urlProgress,
              transform: `translateY(${interpolate(urlProgress, [0, 1], [10, 0])}px)`,
              fontSize: 22,
              color: "#6B7280",
              fontFamily: "monospace",
              fontWeight: 500,
              letterSpacing: 2,
              marginTop: 4,
            }}
          >
            fahim-ae.com
          </div>

          {/* ── SFX ── */}
          <Sequence from={0}>
            <Audio src={staticFile("pop.mp3")} volume={0.45} />
          </Sequence>
          <Sequence from={Math.round(BEAT * 3)}>
            <Audio src={staticFile("woosh.mp3")} volume={0.3} />
          </Sequence>
          <Sequence from={Math.round(BEAT * 4)}>
            <Audio src={staticFile("keyboard-typing.mp3")} volume={0.2} />
          </Sequence>
          <Sequence from={Math.round(BEAT * 8)}>
            <Audio src={staticFile("woosh.mp3")} volume={0.25} />
          </Sequence>
          <Sequence from={Math.round(BEAT * 10)}>
            <Audio src={staticFile("pop.mp3")} volume={0.4} />
          </Sequence>
          <Sequence from={Math.round(BEAT * 14)}>
            <Audio src={staticFile("woosh.mp3")} volume={0.2} />
          </Sequence>

          {/* Second row: tagline */}
          {(() => {
            const taglineStart = BEAT * 16;
            const taglineOpacity = interpolate(
              frame,
              [taglineStart, taglineStart + 20],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );
            const taglineY = interpolate(
              frame,
              [taglineStart, taglineStart + 20],
              [10, 0],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.out(Easing.cubic),
              }
            );
            return (
              <div
                style={{
                  opacity: taglineOpacity,
                  transform: `translateY(${taglineY}px)`,
                  fontSize: 18,
                  color: "#9CA3AF",
                  fontFamily: FONT,
                  fontWeight: 300,
                  letterSpacing: 1,
                  marginTop: 6,
                  display: "flex",
                  gap: 8,
                }}
              >
                <span>Motion Design</span>
                <span style={{ color: "#6B7280" }}>a la demande</span>
              </div>
            );
          })()}
        </div>
      </AbsoluteFill>
  );
};
