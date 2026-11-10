import type {ComponentType} from 'react';

export type CaptionCue = {
  startFrame: number;
  durationInFrames: number;
  text: string;
  highlightedKeyword?: string;
};

export type NarrationClip = {
  file: string;
  from: number;
  durationInFrames?: number;
  volume?: number;
};

export type SceneDefinition = {
  id: string;
  durationInFrames: number;
  visualKey: string;
  visualProps?: Record<string, number | string | boolean | undefined>;
};

export type VisualProps = {
  scene: SceneDefinition;
  script: string;
  durationInFrames: number;
};

export type TopicDefinition = {
  id: string;
  compositionId: string;
  title: string;
  width: number;
  height: number;
  fps: number;
  audioPath?: string;
  narration?: NarrationClip[];
  scenes: SceneDefinition[];
  script: Record<string, string>;
  captions: Record<string, CaptionCue[]>;
  visuals: Record<string, ComponentType<VisualProps>>;
};

export const getSceneDuration = (scenes: SceneDefinition[]) =>
  scenes.reduce((total, scene) => total + scene.durationInFrames, 0);

export const getSceneStartFrame = (scenes: SceneDefinition[], sceneId: string) => {
  let startFrame = 0;
  for (const scene of scenes) {
    if (scene.id === sceneId) {
      return startFrame;
    }
    startFrame += scene.durationInFrames;
  }
  return undefined;
};

export const getVisualNumber = (
  scene: SceneDefinition,
  key: string,
  fallback: number,
) => {
  const value = scene.visualProps?.[key];
  return typeof value === 'number' ? value : fallback;
};

export const getVisualString = (
  scene: SceneDefinition,
  key: string,
  fallback: string,
) => {
  const value = scene.visualProps?.[key];
  return typeof value === 'string' ? value : fallback;
};
