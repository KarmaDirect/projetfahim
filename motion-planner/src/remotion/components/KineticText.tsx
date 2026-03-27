import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

type KineticTextProps = {
  text: string;
  startFrame: number;
  fontSize?: number;
  color?: string;
  accentWords?: string[];
  accentColor?: string;
  stagger?: number;
  fontFamily?: string;
};

const DISPLAY_FONT = "'Space Grotesk', Inter, sans-serif";

export const KineticText: React.FC<KineticTextProps> = ({
  text,
  startFrame,
  fontSize = 64,
  color = "#ffffff",
  accentWords = [],
  accentColor = "#6C63FF",
  stagger = 1.5,
  fontFamily = DISPLAY_FONT,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Split text into words, then track each character with its word context
  const words = text.split(" ");
  let globalCharIndex = 0;

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "0 0.3em",
        fontFamily,
        fontSize,
        fontWeight: 700,
        lineHeight: 1.2,
      }}
    >
      {words.map((word, wordIndex) => {
        const isAccent = accentWords.some(
          (aw) => aw.toLowerCase() === word.toLowerCase()
        );
        const wordColor = isAccent ? accentColor : color;

        const chars = word.split("").map((char, charInWord) => {
          const charIndex = globalCharIndex;
          globalCharIndex++;

          const charDelay = startFrame + charIndex * stagger;

          // Spring-based entrance
          const springVal = spring({
            frame: frame - charDelay,
            fps,
            config: {
              damping: 18,
              stiffness: 180,
              mass: 0.6,
            },
          });

          // Vertical offset: slides up from below
          const translateY = interpolate(springVal, [0, 1], [24, 0]);

          // Opacity
          const opacity = interpolate(springVal, [0, 1], [0, 1]);

          // Blur: starts blurred, becomes sharp
          const blur = interpolate(springVal, [0, 1], [8, 0]);

          // Slight scale pop
          const scale = interpolate(springVal, [0, 0.7, 1], [0.7, 1.05, 1]);

          return (
            <span
              key={`${wordIndex}-${charInWord}`}
              style={{
                display: "inline-block",
                color: wordColor,
                opacity,
                filter: `blur(${blur}px)`,
                transform: `translateY(${translateY}px) scale(${scale})`,
                willChange: "transform, opacity, filter",
              }}
            >
              {char}
            </span>
          );
        });

        // Account for space between words
        globalCharIndex++;

        return (
          <span
            key={wordIndex}
            style={{
              display: "inline-flex",
              whiteSpace: "pre",
            }}
          >
            {chars}
          </span>
        );
      })}
    </div>
  );
};
