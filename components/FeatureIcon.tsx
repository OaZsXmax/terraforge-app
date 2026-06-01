'use client';
import React from 'react';
import { vegetableIcons } from '@/icons/vegetables';
import { fruitIcons } from '@/icons/fruits';
import { flowerIcons } from '@/icons/flowers';
import { infrastructureIcons } from '@/icons/infrastructure';
import { soilIcons } from '@/icons/soil';
import { waterIcons, energyIcons, animalIcons, biodiversityIcons } from '@/icons/systems';

const ALL_ICONS = {
  ...vegetableIcons,
  ...fruitIcons,
  ...flowerIcons,
  ...infrastructureIcons,
  ...soilIcons,
  ...waterIcons,
  ...energyIcons,
  ...animalIcons,
  ...biodiversityIcons,
};

// Emojis that should render as plain emoji characters with no background box
const PLAIN_EMOJI = new Set(['🌱', '🫒']);

interface FeatureIconProps {
  emoji: string;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

export default function FeatureIcon({ emoji, size = 32, className, style }: FeatureIconProps) {
  const iconFn = ALL_ICONS[emoji];

  if (iconFn) {
    return (
      <span
        className={className}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: size,
          height: size,
          flexShrink: 0,
          ...style,
        }}
      >
        {iconFn(size)}
      </span>
    );
  }

  // Plain emoji — no background box (used for 🌱 and others without SVGs)
  if (PLAIN_EMOJI.has(emoji)) {
    return (
      <span
        className={className}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: size,
          height: size,
          fontSize: size * 0.72,
          lineHeight: 1,
          flexShrink: 0,
          ...style,
        }}
      >
        {emoji}
      </span>
    );
  }

  // Emoji fallback — dark tile style for unknown emojis
  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
        fontSize: size * 0.55,
        lineHeight: 1,
        flexShrink: 0,
        background: '#06281E',
        border: '2px solid #0F4D3A',
        borderRadius: size * 0.26,
        ...style,
      }}
    >
      {emoji}
    </span>
  );
}
