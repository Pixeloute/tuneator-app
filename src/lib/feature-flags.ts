export enum FeatureFlag {
  DARK_MODE = 'dark_mode',
  ONBOARDING = 'onboarding',
  NEW_ANALYTICS = 'new_analytics',
  ENTERPRISE_SETTINGS = 'enterprise_settings',
  AIDETECTIVE_EXPERIMENT = 'ai_detective_experiment',
  // Add more flags as needed
}

// Minimal A/B experiment assignment utility
import { useState, useEffect } from 'react';

const EXPERIMENT_VARIANTS = ['control', 'ai_detective'] as const;
type ExperimentVariant = typeof EXPERIMENT_VARIANTS[number];

export function getExperimentVariant(flag: FeatureFlag): ExperimentVariant {
  const key = `exp_${flag}`;
  let variant = (typeof window !== 'undefined' && window.localStorage.getItem(key)) as ExperimentVariant | null;
  if (!variant || !EXPERIMENT_VARIANTS.includes(variant)) {
    variant = Math.random() < 0.5 ? 'control' : 'ai_detective';
    if (typeof window !== 'undefined') window.localStorage.setItem(key, variant);
  }
  return variant;
}

export function useExperimentVariant(flag: FeatureFlag): ExperimentVariant {
  const [variant, setVariant] = useState<ExperimentVariant>(() => getExperimentVariant(flag));
  useEffect(() => {
    setVariant(getExperimentVariant(flag));
  }, [flag]);
  return variant;
} 