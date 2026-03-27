import React from "react";
import {
  AbsoluteFill,
  Img,
  Sequence,
  useCurrentFrame,
  interpolate,
  staticFile,
  spring,
  useVideoConfig,
} from "remotion";

type ShowcaseProps = {
  images: string[];
  projectName: string;
  clientName?: string;
  accentColor: string;
};

const IntroScene: React.FC<{
  projectName: string;
  clientName?: string;
  accentColor: string;
}> = ({ projectName, clientName, accentColor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const lineWidth = spring({ frame, fps, config: { damping: 20 } }) * 200;
  const nameOpacity = interpolate(frame, [10, 30], [0, 1], {
    extrapolateRight: "clamp",
  });
  const nameY = interpolate(frame, [10, 30], [40, 0], {
    extrapolateRight: "clamp",
  });
  const clientOpacity = interpolate(frame, [25, 40], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0a0a0a",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 24,
        }}
      >
        <div
          style={{
            width: lineWidth,
            height: 3,
            backgroundColor: accentColor,
            borderRadius: 2,
          }}
        />
        <h1
          style={{
            color: "#fff",
            fontSize: 80,
            fontWeight: 800,
            fontFamily: "Outfit, sans-serif",
            opacity: nameOpacity,
            transform: `translateY(${nameY}px)`,
            margin: 0,
            letterSpacing: -2,
          }}
        >
          {projectName}
        </h1>
        {clientName && (
          <p
            style={{
              color: "#888",
              fontSize: 28,
              fontFamily: "Outfit, sans-serif",
              opacity: clientOpacity,
              margin: 0,
            }}
          >
            {clientName}
          </p>
        )}
      </div>
    </AbsoluteFill>
  );
};

const ImageReveal: React.FC<{ src: string; index: number }> = ({
  src,
  index,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 80 },
  });

  const scale = interpolate(progress, [0, 1], [0.8, 1]);
  const opacity = interpolate(progress, [0, 1], [0, 1]);
  const borderRadius = interpolate(progress, [0, 1], [24, 12]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0a0a0a",
        justifyContent: "center",
        alignItems: "center",
        padding: 60,
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          overflow: "hidden",
          borderRadius,
          transform: `scale(${scale})`,
          opacity,
          boxShadow: "0 40px 80px rgba(0,0,0,0.5)",
        }}
      >
        <Img
          src={staticFile(src)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

export const Showcase: React.FC<ShowcaseProps> = ({
  images,
  projectName,
  clientName,
  accentColor,
}) => {
  const introDuration = 90;
  const imageDuration = 90;

  return (
    <AbsoluteFill>
      <Sequence durationInFrames={introDuration}>
        <IntroScene
          projectName={projectName}
          clientName={clientName}
          accentColor={accentColor}
        />
      </Sequence>
      {images.map((img, i) => (
        <Sequence
          key={img}
          from={introDuration + i * imageDuration}
          durationInFrames={imageDuration}
        >
          <ImageReveal src={img} index={i} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
