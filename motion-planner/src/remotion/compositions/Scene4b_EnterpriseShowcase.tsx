import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
  OffthreadVideo,
  Audio,
  staticFile,
  Easing,
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

const VIDEO_DURATION = 900; // 30 seconds at 30fps

export const Scene4b_EnterpriseShowcase: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Title (Beat 0-2) — slides from right ──
  const titleSpring = spring({
    frame,
    fps,
    config: { damping: 7, stiffness: 100, mass: 0.5 },
  });
  const titleX = interpolate(titleSpring, [0, 1], [400, 0]);

  // ── Subtitle (Beat 1.5) ──
  const subSpring = spring({
    frame: frame - Math.round(BEAT * 1.5),
    fps,
    config: { damping: 8, stiffness: 90, mass: 0.5 },
  });

  // ── Player card slides in from LEFT (Beat 1.5-3) ──
  const playerSpring = spring({
    frame: frame - Math.round(BEAT * 1.5),
    fps,
    config: { damping: 9, stiffness: 55, mass: 0.7 },
  });
  const playerSlideX = interpolate(playerSpring, [0, 1], [-900, 0]);
  const playerRotate = interpolate(playerSpring, [0, 1], [-4, 0]);
  const playerScale = interpolate(playerSpring, [0, 1], [0.85, 1]);

  // ── Subtle floating drift after player lands ──
  const hasLanded = playerSpring > 0.95;
  const driftX = hasLanded ? Math.sin(frame * 0.01) * 3 : 0;
  const driftY = hasLanded ? Math.cos(frame * 0.014) * 2 : 0;

  // ── Click at Beat 4.5 ──
  const clickFrame = Math.round(BEAT * 4.5);
  const hasClicked = frame >= clickFrame;

  // ── Click bounce on player ──
  const clickBounce = spring({
    frame: frame - clickFrame,
    fps,
    config: { damping: 12, stiffness: 300, mass: 0.3 },
  });
  const playerClickScale = hasClicked
    ? interpolate(clickBounce, [0, 0.15, 0.4, 1], [1, 0.965, 1.01, 1])
    : 1;

  // ── Click ripple (double ring) ──
  const clickRipple = spring({
    frame: frame - clickFrame,
    fps,
    config: { damping: 15, stiffness: 200, mass: 0.3 },
  });
  const clickRipple2 = spring({
    frame: frame - clickFrame - 4,
    fps,
    config: { damping: 18, stiffness: 160, mass: 0.35 },
  });

  // ── Play button ──
  const playBtnPulse = !hasClicked
    ? interpolate(Math.sin(frame * 0.15), [-1, 1], [0.94, 1.06])
    : 1;
  const playBtnGlow = !hasClicked
    ? interpolate(Math.sin(frame * 0.1), [-1, 1], [0.3, 0.6])
    : 0;
  const playBtnScale = hasClicked
    ? interpolate(clickRipple, [0, 0.5, 1], [1, 0.7, 0])
    : playBtnPulse;
  const playBtnOpacity = hasClicked
    ? interpolate(clickRipple, [0, 1], [1, 0])
    : 1;

  // ── Video fade in ──
  const videoOpacity = hasClicked
    ? interpolate(frame - clickFrame, [0, 10], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;

  // ── Video end: player fades out ──
  const videoEndFrame = clickFrame + VIDEO_DURATION;
  const exitProgress = interpolate(
    frame,
    [videoEndFrame + 5, videoEndFrame + 40],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.cubic) }
  );
  const exitScale = interpolate(exitProgress, [0, 1], [1, 0.92]);
  const exitOpacity = interpolate(exitProgress, [0, 1], [1, 0]);
  const exitY = interpolate(exitProgress, [0, 1], [0, 30]);

  // ── Cursor animation — comes from bottom-left ──
  const cursorAppear = Math.round(BEAT * 3);
  const cursorOpacity = interpolate(frame, [cursorAppear, cursorAppear + 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const cursorT = interpolate(
    frame,
    [cursorAppear, clickFrame],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );
  // Quadratic bezier — from bottom-left to center
  const cursorStartX = 400;
  const cursorStartY = 850;
  const cursorEndX = 960;
  const cursorEndY = 470;
  const cursorMidX = 800;
  const cursorMidY = 350;
  const cursorX = (1 - cursorT) * (1 - cursorT) * cursorStartX + 2 * (1 - cursorT) * cursorT * cursorMidX + cursorT * cursorT * cursorEndX;
  const cursorY = (1 - cursorT) * (1 - cursorT) * cursorStartY + 2 * (1 - cursorT) * cursorT * cursorMidY + cursorT * cursorT * cursorEndY;
  // Hover wobble
  const hoverWobbleX = cursorT > 0.85 ? Math.sin(frame * 0.3) * 2 : 0;
  const hoverWobbleY = cursorT > 0.85 ? Math.cos(frame * 0.25) * 1.5 : 0;

  const cursorFade = hasClicked
    ? interpolate(frame - clickFrame, [0, 8], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1;

  // ── Background ──
  const orbX = 45 + Math.sin(frame * 0.006) * 12;
  const orbY = 50 + Math.cos(frame * 0.008) * 8;

  return (
    <AbsoluteFill style={{ backgroundColor: BG, overflow: "hidden" }}>
      {/* Background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 800px 600px at ${orbX}% ${orbY}%, rgba(75,85,99,0.12) 0%, transparent 70%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(17,24,39,0.5) 100%)",
          pointerEvents: "none",
          zIndex: 50,
        }}
      />

      {/* ═══ CONTENT ═══ */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          zIndex: 5,
          paddingTop: 40,
          opacity: exitOpacity,
          transform: `translateY(${exitY}px)`,
        }}
      >
        {/* Title — slides from right */}
        <div
          style={{
            opacity: titleSpring,
            transform: `translateX(${titleX}px)`,
            textAlign: "center" as const,
          }}
        >
          <div
            style={{
              fontSize: 52,
              fontFamily: FONT_DISPLAY,
              fontWeight: 800,
              color: WHITE,
              letterSpacing: -2,
            }}
          >
            Du contenu qui convertit.
          </div>
        </div>

        {/* Subtitle */}
        <div
          style={{
            marginTop: 10,
            opacity: subSpring,
            transform: `translateY(${interpolate(subSpring, [0, 1], [15, 0])}px)`,
            fontSize: 22,
            color: MUTED,
            fontFamily: FONT,
            fontWeight: 300,
          }}
        >
          Découvrez nos réalisations pour les entreprises
        </div>

        {/* Video player card — slides from left with rotation */}
        <div
          style={{
            marginTop: 30,
            opacity: playerSpring,
            transform: `
              translateX(${playerSlideX + driftX}px)
              translateY(${driftY}px)
              rotate(${playerRotate}deg)
              scale(${playerScale * playerClickScale * exitScale})
            `,
            width: 1200,
            background: CARD_BG,
            borderRadius: 20,
            border: `1px solid ${BORDER}`,
            boxShadow: "0 30px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.03)",
            overflow: "hidden",
            position: "relative" as const,
          }}
        >
          {/* Top bar */}
          <div
            style={{
              height: 44,
              background: SURFACE,
              display: "flex",
              alignItems: "center",
              padding: "0 18px",
              gap: 8,
            }}
          >
            {["#ff5f57", "#ffbd2e", "#27c93f"].map((c) => (
              <div
                key={c}
                style={{
                  width: 11,
                  height: 11,
                  borderRadius: "50%",
                  backgroundColor: c,
                }}
              />
            ))}
            <span
              style={{
                color: SECONDARY,
                fontSize: 13,
                fontFamily: "monospace",
                marginLeft: 14,
              }}
            >
              FahimAE — Showreel Entreprise 2024
            </span>
          </div>

          {/* Video area */}
          <div
            style={{
              position: "relative",
              width: "100%",
              height: 630,
              background: "#0a0c10",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Placeholder */}
            {!hasClicked && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: `linear-gradient(135deg, ${SURFACE} 0%, #0f1319 50%, ${SURFACE} 100%)`,
                }}
              />
            )}

            {/* Play button with glow */}
            <div
              style={{
                position: "absolute",
                zIndex: 10,
                opacity: playBtnOpacity,
                transform: `scale(${playBtnScale})`,
              }}
            >
              <div
                style={{
                  width: 90,
                  height: 90,
                  borderRadius: "50%",
                  background: `linear-gradient(135deg, ${PRIMARY}, ${SECONDARY})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: `0 8px 40px rgba(75,85,99,0.4), 0 0 ${30 + playBtnGlow * 30}px rgba(107,114,128,${playBtnGlow})`,
                }}
              >
                <div
                  style={{
                    width: 0,
                    height: 0,
                    borderLeft: "24px solid white",
                    borderTop: "15px solid transparent",
                    borderBottom: "15px solid transparent",
                    marginLeft: 6,
                  }}
                />
              </div>
            </div>

            {/* Click ripple 1 */}
            {hasClicked && clickRipple < 1 && (
              <div
                style={{
                  position: "absolute",
                  zIndex: 9,
                  width: interpolate(clickRipple, [0, 1], [90, 350]),
                  height: interpolate(clickRipple, [0, 1], [90, 350]),
                  borderRadius: "50%",
                  border: `2px solid rgba(156,163,175,${interpolate(clickRipple, [0, 1], [0.6, 0])})`,
                }}
              />
            )}
            {/* Click ripple 2 (delayed) */}
            {hasClicked && clickRipple2 > 0 && clickRipple2 < 1 && (
              <div
                style={{
                  position: "absolute",
                  zIndex: 8,
                  width: interpolate(clickRipple2, [0, 1], [60, 280]),
                  height: interpolate(clickRipple2, [0, 1], [60, 280]),
                  borderRadius: "50%",
                  border: `1.5px solid rgba(156,163,175,${interpolate(clickRipple2, [0, 1], [0.4, 0])})`,
                }}
              />
            )}

            {/* Video — 30 seconds, Sequence handles start time & duration */}
            <Sequence from={clickFrame} durationInFrames={VIDEO_DURATION} layout="none">
              <OffthreadVideo
                src={staticFile("video entreprise.mp4")}
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  opacity: videoOpacity,
                }}
              />
            </Sequence>

            {/* Progress bar */}
            {hasClicked && frame < videoEndFrame + 40 && (
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: 4,
                  background: "rgba(255,255,255,0.1)",
                  zIndex: 20,
                }}
              >
                <div
                  style={{
                    width: `${interpolate(
                      frame - clickFrame,
                      [0, VIDEO_DURATION],
                      [0, 100],
                      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                    )}%`,
                    height: "100%",
                    background: `linear-gradient(90deg, ${PRIMARY}, ${SECONDARY})`,
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cursor — bezier curve from bottom-left */}
      <div
        style={{
          position: "absolute",
          left: cursorX + hoverWobbleX,
          top: cursorY + hoverWobbleY,
          zIndex: 60,
          opacity: cursorOpacity * cursorFade,
          pointerEvents: "none",
        }}
      >
        <svg width="24" height="28" viewBox="0 0 24 28" fill="none">
          <path
            d="M2 2L2 22L8 16L14 26L18 24L12 14L20 14L2 2Z"
            fill="white"
            stroke="#111827"
            strokeWidth="1.5"
          />
        </svg>
      </div>

      {/* ── SFX ── */}
      <Sequence from={0}>
        <Audio src={staticFile("woosh.mp3")} volume={0.4} />
      </Sequence>
      <Sequence from={Math.round(BEAT * 1.5)}>
        <Audio src={staticFile("woosh.mp3")} volume={0.4} />
      </Sequence>
      <Sequence from={clickFrame}>
        <Audio src={staticFile("mouse-click.mp3")} volume={0.6} />
      </Sequence>
    </AbsoluteFill>
  );
};
