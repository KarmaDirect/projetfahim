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
const BEAT = Math.round((30 * 60) / BPM); // ~14 frames

// ── Per-character animated text ──────────────────────────────────────────────

const CharacterText: React.FC<{
  text: string;
  startFrame: number;
  stagger?: number;
  color?: string;
  fontSize?: number;
  fontWeight?: number;
  fontStyle?: React.CSSProperties["fontStyle"];
  overshoot?: boolean;
  letterSpacing?: number;
}> = ({
  text,
  startFrame,
  stagger = 1.5,
  color = "#ffffff",
  fontSize = 64,
  fontWeight = 500,
  fontStyle = "normal",
  overshoot = false,
  letterSpacing,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <span
      style={{
        display: "inline-block",
        whiteSpace: "pre",
        fontFamily: FONT_DISPLAY,
        fontSize,
        fontWeight,
        fontStyle,
        letterSpacing: letterSpacing ?? (overshoot ? -2 : -1),
      }}
    >
      {text.split("").map((char, i) => {
        const delay = startFrame + i * stagger;
        const prog = spring({
          frame: frame - delay,
          fps,
          config: overshoot
            ? { damping: 5, stiffness: 160, mass: 0.4 }
            : { damping: 8, stiffness: 120, mass: 0.5 },
        });

        const blur = interpolate(prog, [0, 0.5], [6, 0], {
          extrapolateRight: "clamp",
        });

        const yOffset = interpolate(prog, [0, 1], [30, 0]);
        const scaleVal = overshoot
          ? interpolate(prog, [0, 0.7, 1], [1.5, 0.95, 1])
          : interpolate(prog, [0, 1], [1.4, 1]);

        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity: prog,
              color,
              transform: `translateY(${yOffset}px) scale(${scaleVal})`,
              filter: `blur(${blur}px)`,
              minWidth: char === " " ? "0.3em" : undefined,
            }}
          >
            {char}
          </span>
        );
      })}
    </span>
  );
};

// ── Floating icon component ─────────────────────────────────────────────────

const FloatingIcon: React.FC<{
  src: string;
  x: number;
  y: number;
  size: number;
  delay: number;
  driftAmplitude?: number;
  driftSpeed?: number;
}> = ({ src, x, y, size, delay, driftAmplitude = 12, driftSpeed = 0.04 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = spring({
    frame: frame - delay,
    fps,
    config: { damping: 10, stiffness: 60, mass: 0.6 },
  });

  const floatY = Math.sin((frame + delay * 3) * driftSpeed) * driftAmplitude;
  const floatX =
    Math.cos((frame + delay * 2) * driftSpeed * 0.7) * driftAmplitude * 0.5;

  return (
    <Img
      src={staticFile(src)}
      style={{
        position: "absolute",
        left: x + floatX,
        top: y + floatY,
        width: size,
        height: "auto",
        opacity: fadeIn,
        zIndex: 10,
        filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.4))",
      }}
    />
  );
};

// ── Main Scene ───────────────────────────────────────────────────────────────

export const Scene1_Problem: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Navbar fade in (beat 0-2) ──
  const navProgress = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 80, mass: 0.5 },
  });
  const navY = interpolate(navProgress, [0, 1], [-40, 0]);

  // ── Subtitle + CTA (beat 2-4) ──
  const subtitleDelay = BEAT * 2 + 8;
  const subtitleProgress = spring({
    frame: frame - subtitleDelay,
    fps,
    config: { damping: 8, stiffness: 80, mass: 0.5 },
  });

  const ctaDelay = BEAT * 3;
  const ctaProgress = spring({
    frame: frame - ctaDelay,
    fps,
    config: { damping: 7, stiffness: 90, mass: 0.5 },
  });

  // ── Dashboard slide up (beat 4-6) ──
  const dashDelay = BEAT * 4;
  const dashProgress = spring({
    frame: frame - dashDelay,
    fps,
    config: { damping: 8, stiffness: 50, mass: 0.8 },
  });
  const dashY = interpolate(dashProgress, [0, 1], [400, 0]);

  // ── Zoom effect (beat 12-14) ──
  const zoomStart = BEAT * 12;
  const zoomEnd = BEAT * 14;
  const zoomScale = interpolate(frame, [zoomStart, zoomEnd], [1, 1.04], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });

  // ── Background orb drift ──
  const orbDriftX = Math.sin(frame * 0.008) * 40;
  const orbDriftY = Math.cos(frame * 0.006) * 25;

  // ── Icons row progress (beat 3-4) ──
  const iconsRowDelay = BEAT * 3 + 7;
  const iconsRowProgress = spring({
    frame: frame - iconsRowDelay,
    fps,
    config: { damping: 10, stiffness: 70, mass: 0.5 },
  });

  // Nav links
  const navLinks = ["Services", "Portfolio", "Tarifs", "Process", "FAQ"];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#111827",
        overflow: "hidden",
      }}
    >
      {/* ── Scene zoom wrapper ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `scale(${zoomScale})`,
          transformOrigin: "50% 40%",
        }}
      >
        {/* ── Ambient gradient orbs ── */}
        <div
          style={{
            position: "absolute",
            width: 1000,
            height: 1000,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(75,85,99,0.12) 0%, transparent 60%)",
            top: "20%",
            left: "50%",
            transform: `translate(-50%, -50%) translate(${orbDriftX}px, ${orbDriftY}px)`,
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 600,
            height: 600,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 60%)",
            top: "60%",
            left: "35%",
            transform: `translate(-50%, -50%) translate(${-orbDriftX * 0.6}px, ${-orbDriftY * 0.7}px)`,
          }}
        />

        {/* ── Subtle floating dots ── */}
        {[
          { x: 180, y: 220, size: 4, opacity: 0.06, sx: 0.018, sy: 0.022 },
          { x: 1650, y: 280, size: 5, opacity: 0.08, sx: 0.015, sy: 0.025 },
          { x: 350, y: 780, size: 3, opacity: 0.05, sx: 0.022, sy: 0.017 },
          { x: 1500, y: 700, size: 4, opacity: 0.07, sx: 0.02, sy: 0.019 },
        ].map((dot, i) => (
          <div
            key={`dot-${i}`}
            style={{
              position: "absolute",
              left: dot.x + Math.sin(frame * dot.sx + i * 2) * 25,
              top: dot.y + Math.cos(frame * dot.sy + i * 1.5) * 20,
              width: dot.size,
              height: dot.size,
              borderRadius: "50%",
              backgroundColor: "#6B7280",
              opacity: dot.opacity,
              pointerEvents: "none",
            }}
          />
        ))}

        {/* ── Vignette overlay ── */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(17,24,39,0.8) 100%)",
            pointerEvents: "none",
            zIndex: 5,
          }}
        />

        {/* ── NAVBAR ── */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 72,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 60px",
            zIndex: 20,
            opacity: navProgress,
            transform: `translateY(${navY}px)`,
          }}
        >
          {/* Logo */}
          <div
            style={{
              fontFamily: FONT_DISPLAY,
              fontSize: 24,
              fontWeight: 700,
              color: "#ffffff",
              letterSpacing: 2,
            }}
          >
            FAHIMAE
          </div>

          {/* Nav links */}
          <div
            style={{
              display: "flex",
              gap: 36,
              alignItems: "center",
            }}
          >
            {navLinks.map((link, i) => {
              const linkDelay = 4 + i * 3;
              const linkProg = spring({
                frame: frame - linkDelay,
                fps,
                config: { damping: 10, stiffness: 100, mass: 0.4 },
              });
              return (
                <span
                  key={link}
                  style={{
                    fontFamily: FONT,
                    fontSize: 15,
                    fontWeight: 400,
                    color: "#9CA3AF",
                    opacity: linkProg,
                    transform: `translateY(${interpolate(linkProg, [0, 1], [-10, 0])}px)`,
                  }}
                >
                  {link}
                </span>
              );
            })}
          </div>

          {/* CTA button */}
          <div
            style={{
              fontFamily: FONT,
              fontSize: 14,
              fontWeight: 600,
              color: "#ffffff",
              background: "linear-gradient(135deg, #4B5563, #6B7280)",
              padding: "10px 24px",
              borderRadius: 8,
              opacity: navProgress,
            }}
          >
            Demarrer
          </div>
        </div>

        {/* ── HERO CONTENT ── */}
        <div
          style={{
            position: "absolute",
            top: 110,
            left: 0,
            right: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            zIndex: 10,
          }}
        >
          {/* ── Headline block ── */}
          <div
            style={{
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
              lineHeight: 1.1,
            }}
          >
            {/* Line 1: "Vendez du Motion Design." */}
            <CharacterText
              text="Vendez du Motion Design."
              startFrame={0}
              stagger={1.2}
              color="#ffffff"
              fontSize={82}
              fontWeight={800}
              letterSpacing={-2}
              overshoot
            />

            {/* Line 2: "Je m'occupe du reste." italic */}
            <CharacterText
              text="Je m'occupe du reste."
              startFrame={BEAT + 4}
              stagger={1.3}
              color="#9CA3AF"
              fontSize={68}
              fontWeight={400}
              fontStyle="italic"
              letterSpacing={-1}
            />
          </div>

          {/* ── Subtitle text ── */}
          <div
            style={{
              marginTop: 28,
              opacity: subtitleProgress,
              transform: `translateY(${interpolate(subtitleProgress, [0, 1], [20, 0])}px)`,
              fontSize: 18,
              color: "#6B7280",
              fontFamily: FONT,
              fontWeight: 400,
              textAlign: "center",
              maxWidth: 600,
              lineHeight: 1.5,
            }}
          >
            Service de production motion design illimite pour les agences et
            freelances qui veulent scaler leur offre video.
          </div>

          {/* ── CTA Buttons ── */}
          <div
            style={{
              display: "flex",
              gap: 20,
              marginTop: 32,
              opacity: ctaProgress,
              transform: `translateY(${interpolate(ctaProgress, [0, 1], [25, 0])}px) scale(${interpolate(ctaProgress, [0, 1], [0.9, 1])})`,
            }}
          >
            {/* Primary CTA */}
            <div
              style={{
                fontFamily: FONT,
                fontSize: 16,
                fontWeight: 600,
                color: "#ffffff",
                background: "linear-gradient(135deg, #3B82F6, #6366F1)",
                padding: "14px 32px",
                borderRadius: 10,
                boxShadow: "0 4px 20px rgba(99,102,241,0.3)",
              }}
            >
              {"Commencer a deleguer \u2192"}
            </div>

            {/* Secondary CTA */}
            <div
              style={{
                fontFamily: FONT,
                fontSize: 16,
                fontWeight: 500,
                color: "#d1d5db",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)",
                padding: "14px 28px",
                borderRadius: 10,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  border: "1.5px solid #d1d5db",
                  fontSize: 9,
                }}
              >
                {"\u25B6"}
              </span>
              Voir le Portfolio
            </div>
          </div>

          {/* ── Social/tool icons row ── */}
          <div
            style={{
              display: "flex",
              gap: 16,
              marginTop: 24,
              alignItems: "center",
              opacity: iconsRowProgress * 0.5,
              transform: `translateY(${interpolate(iconsRowProgress, [0, 1], [10, 0])}px)`,
            }}
          >
            {["ae.png", "pr.png", "Instagram.png", "tiktok.png"].map(
              (icon, i) => (
                <Img
                  key={icon}
                  src={staticFile(icon)}
                  style={{
                    width: 22,
                    height: "auto",
                    opacity: 0.5,
                    filter: "grayscale(0.6) brightness(1.2)",
                  }}
                />
              )
            )}
          </div>

          {/* ── Arc / curved sweep above dashboard ── */}
          <div
            style={{
              marginTop: 40,
              width: 1100,
              height: 80,
              opacity: dashProgress,
              position: "relative",
              zIndex: 6,
            }}
          >
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: "50%",
                transform: "translateX(-50%)",
                width: 1000,
                height: 160,
                borderRadius: "50% 50% 0 0 / 100% 100% 0 0",
                background:
                  "linear-gradient(180deg, rgba(99,102,241,0.08) 0%, transparent 100%)",
                border: "1px solid rgba(99,102,241,0.12)",
                borderBottom: "none",
              }}
            />
            {/* Glowing line on top of arc */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: "50%",
                transform: "translateX(-50%)",
                width: 1000,
                height: 160,
                borderRadius: "50% 50% 0 0 / 100% 100% 0 0",
                boxShadow: "0 -2px 20px rgba(99,102,241,0.15)",
              }}
            />
          </div>

          {/* ── Dashboard screenshot ── */}
          <div
            style={{
              opacity: dashProgress,
              transform: `translateY(${dashY}px)`,
              position: "relative",
              zIndex: 7,
              marginTop: -10,
            }}
          >
            <div
              style={{
                background: "#181A20",
                borderRadius: 16,
                border: "1px solid rgba(255,255,255,0.08)",
                padding: 8,
                boxShadow:
                  "0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(99,102,241,0.08)",
              }}
            >
              <Img
                src={staticFile("dashboard-dark.png")}
                style={{
                  width: 980,
                  height: "auto",
                  borderRadius: 12,
                  display: "block",
                }}
              />
            </div>
          </div>
        </div>

        {/* ── Floating software icons (beat 6-8 fade in, sine drift) ── */}
        <FloatingIcon
          src="ae.png"
          x={80}
          y={380}
          size={64}
          delay={BEAT * 6}
          driftAmplitude={14}
          driftSpeed={0.035}
        />
        <FloatingIcon
          src="pr.png"
          x={1760}
          y={320}
          size={58}
          delay={BEAT * 6 + 5}
          driftAmplitude={12}
          driftSpeed={0.04}
        />
        <FloatingIcon
          src="Instagram.png"
          x={120}
          y={680}
          size={48}
          delay={BEAT * 7}
          driftAmplitude={10}
          driftSpeed={0.045}
        />
        <FloatingIcon
          src="tiktok.png"
          x={1720}
          y={620}
          size={46}
          delay={BEAT * 7 + 5}
          driftAmplitude={11}
          driftSpeed={0.038}
        />
        <FloatingIcon
          src="ae.png"
          x={1680}
          y={850}
          size={40}
          delay={BEAT * 8}
          driftAmplitude={8}
          driftSpeed={0.032}
        />
      </div>

      {/* ── SFX ── */}
      <Sequence from={0}>
        <Audio src={staticFile("woosh.mp3")} volume={0.35} />
      </Sequence>
      <Sequence from={0}>
        <Audio src={staticFile("keyboard-typing.mp3")} volume={0.25} />
      </Sequence>
      <Sequence from={Math.round(BEAT * 3)}>
        <Audio src={staticFile("pop.mp3")} volume={0.4} />
      </Sequence>
      <Sequence from={Math.round(BEAT * 4)}>
        <Audio src={staticFile("woosh.mp3")} volume={0.3} />
      </Sequence>
      <Sequence from={Math.round(BEAT * 6)}>
        <Audio src={staticFile("pop.mp3")} volume={0.3} />
      </Sequence>
    </AbsoluteFill>
  );
};
