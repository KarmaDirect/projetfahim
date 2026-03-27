import React from "react";
import { Composition, Sequence, AbsoluteFill, Audio, staticFile } from "remotion";
import { z } from "zod";
import { zColor } from "@remotion/zod-types";
import { Slideshow } from "./compositions/Slideshow";
import { Showcase } from "./compositions/Showcase";
import { Scene1_Problem } from "./compositions/Scene1_Problem";
import { Scene2_Intro } from "./compositions/Scene2_Intro";
import { Scene3_TargetEditors } from "./compositions/Scene3_TargetEditors";
import { Scene3b_YouTubeGrowth } from "./compositions/Scene3b_YouTubeGrowth";
import { Scene3b2_YouTubeShowcase } from "./compositions/Scene3b2_YouTubeShowcase";
import { Scene3c_ROIResults } from "./compositions/Scene3c_ROIResults";
import { Scene4_TargetB2B } from "./compositions/Scene4_TargetB2B";
import { Scene4b_EnterpriseShowcase } from "./compositions/Scene4b_EnterpriseShowcase";
import { Scene5_DashboardFeatures } from "./compositions/Scene5_DashboardFeatures";
import { Scene6_Outro } from "./compositions/Scene6_Outro";

// === Full Promo Video ===
// Timeline (30 FPS):
// Scene 1:   0-300      (00:00 - 00:10) — Hero Landing
// Scene 2:   300-600    (00:10 - 00:20) — La Solution / Intro
// Scene 3a:  600-900    (00:20 - 00:30) — Cible Monteurs (Timeline)
// Scene 3b:  900-1200   (00:30 - 00:40) — YouTube Growth
// Scene 3b2: 1200-1500  (00:40 - 00:50) — YouTube Showcase (Video)
// Scene 3c:  1500-1800  (00:50 - 01:00) — ROI & Résultats
// Scene 4:   1800-2250  (01:00 - 01:15) — Cible B2B
// Scene 4b:  2250-3300  (01:15 - 01:50) — Enterprise Showcase (30s Video)
// Scene 5:   3300-3900  (01:50 - 02:10) — Dashboard Features
// Scene 6:   3900-4500  (02:10 - 02:30) — Outro / CTA

const PromoVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#111827" }}>
      <Sequence from={0} durationInFrames={300}>
        <Scene1_Problem />
      </Sequence>

      <Sequence from={300} durationInFrames={300}>
        <Scene2_Intro />
      </Sequence>

      <Sequence from={600} durationInFrames={300}>
        <Scene3_TargetEditors />
      </Sequence>

      <Sequence from={900} durationInFrames={300}>
        <Scene3b_YouTubeGrowth />
      </Sequence>

      <Sequence from={1200} durationInFrames={300}>
        <Scene3b2_YouTubeShowcase />
      </Sequence>

      <Sequence from={1500} durationInFrames={300}>
        <Scene3c_ROIResults />
      </Sequence>

      <Sequence from={1800} durationInFrames={450}>
        <Scene4_TargetB2B />
      </Sequence>

      <Sequence from={2250} durationInFrames={1050}>
        <Scene4b_EnterpriseShowcase />
      </Sequence>

      <Sequence from={3300} durationInFrames={600}>
        <Scene5_DashboardFeatures />
      </Sequence>

      <Sequence from={3900} durationInFrames={600}>
        <Scene6_Outro />
      </Sequence>
    </AbsoluteFill>
  );
};

// === Schemas for reusable compositions ===

const slideshowSchema = z.object({
  images: z.array(z.string()),
  transitionDuration: z.number().default(15),
  slideDuration: z.number().default(60),
  title: z.string().optional(),
  subtitle: z.string().optional(),
  accentColor: zColor().default("#6C63FF"),
});

const showcaseSchema = z.object({
  images: z.array(z.string()),
  projectName: z.string(),
  clientName: z.string().optional(),
  accentColor: zColor().default("#6C63FF"),
});

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Main promo video — 1min45 */}
      <Composition
        id="FahimAE-Promo"
        component={PromoVideo}
        durationInFrames={4500}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* Individual scenes for preview */}
      <Composition
        id="Scene1-Problem"
        component={Scene1_Problem}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Scene2-Intro"
        component={Scene2_Intro}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Scene3-TargetEditors"
        component={Scene3_TargetEditors}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Scene3b-YouTubeGrowth"
        component={Scene3b_YouTubeGrowth}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Scene3b2-YouTubeShowcase"
        component={Scene3b2_YouTubeShowcase}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Scene3c-ROIResults"
        component={Scene3c_ROIResults}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Scene4-TargetB2B"
        component={Scene4_TargetB2B}
        durationInFrames={450}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Scene4b-EnterpriseShowcase"
        component={Scene4b_EnterpriseShowcase}
        durationInFrames={1050}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Scene5-DashboardFeatures"
        component={Scene5_DashboardFeatures}
        durationInFrames={600}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Scene6-Outro"
        component={Scene6_Outro}
        durationInFrames={600}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* Reusable compositions */}
      <Composition
        id="Slideshow"
        component={Slideshow}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
        schema={slideshowSchema}
        defaultProps={{
          images: [],
          transitionDuration: 15,
          slideDuration: 60,
          accentColor: "#6C63FF",
        }}
        calculateMetadata={({ props }) => {
          const count = Math.max(props.images.length, 1);
          return {
            durationInFrames:
              count * props.slideDuration +
              (count - 1) * props.transitionDuration,
          };
        }}
      />
      <Composition
        id="Showcase"
        component={Showcase}
        durationInFrames={450}
        fps={30}
        width={1920}
        height={1080}
        schema={showcaseSchema}
        defaultProps={{
          images: [],
          projectName: "Mon Projet",
          accentColor: "#6C63FF",
        }}
      />
    </>
  );
};
