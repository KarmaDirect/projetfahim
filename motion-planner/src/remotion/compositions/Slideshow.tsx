import React from "react";
import {
  AbsoluteFill,
  Img,
  useCurrentFrame,
  interpolate,
  staticFile,
} from "remotion";
import {
  TransitionSeries,
  linearTiming,
} from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";

type SlideshowProps = {
  images: string[];
  transitionDuration: number;
  slideDuration: number;
  title?: string;
  subtitle?: string;
  accentColor: string;
};

const Slide: React.FC<{ src: string }> = ({ src }) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, 90], [1, 1.05], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a0a" }}>
      <Img
        src={staticFile(src)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${scale})`,
        }}
      />
    </AbsoluteFill>
  );
};

const TitleCard: React.FC<{
  title?: string;
  subtitle?: string;
  accentColor: string;
}> = ({ title, subtitle, accentColor }) => {
  const frame = useCurrentFrame();
  const titleOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });
  const titleY = interpolate(frame, [0, 20], [30, 0], {
    extrapolateRight: "clamp",
  });
  const subtitleOpacity = interpolate(frame, [10, 30], [0, 1], {
    extrapolateRight: "clamp",
  });

  if (!title) return null;

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
          gap: 16,
        }}
      >
        <h1
          style={{
            color: "#fff",
            fontSize: 72,
            fontWeight: 700,
            fontFamily: "Outfit, sans-serif",
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
            margin: 0,
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            style={{
              color: accentColor,
              fontSize: 32,
              fontWeight: 400,
              fontFamily: "Outfit, sans-serif",
              opacity: subtitleOpacity,
              margin: 0,
            }}
          >
            {subtitle}
          </p>
        )}
      </div>
    </AbsoluteFill>
  );
};

export const Slideshow: React.FC<SlideshowProps> = ({
  images,
  transitionDuration,
  slideDuration,
  title,
  subtitle,
  accentColor,
}) => {
  const transitions = [fade(), slide({ direction: "from-right" })];

  return (
    <TransitionSeries>
      {title && (
        <>
          <TransitionSeries.Sequence durationInFrames={slideDuration}>
            <TitleCard
              title={title}
              subtitle={subtitle}
              accentColor={accentColor}
            />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition
            presentation={fade()}
            timing={linearTiming({ durationInFrames: transitionDuration })}
          />
        </>
      )}
      {images.map((img, i) => (
        <React.Fragment key={img}>
          <TransitionSeries.Sequence durationInFrames={slideDuration}>
            <Slide src={img} />
          </TransitionSeries.Sequence>
          {i < images.length - 1 && (
            <TransitionSeries.Transition
              presentation={transitions[i % transitions.length]}
              timing={linearTiming({
                durationInFrames: transitionDuration,
              })}
            />
          )}
        </React.Fragment>
      ))}
    </TransitionSeries>
  );
};
