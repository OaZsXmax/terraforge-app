'use client';
import React from 'react';

export const DEFS = (
  <defs>
    <linearGradient id="gGreen"   x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#88C057"/><stop offset="100%" stopColor="#2E7D32"/></linearGradient>
    <linearGradient id="gDkGreen" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#66BB6A"/><stop offset="100%" stopColor="#1B5E20"/></linearGradient>
    <linearGradient id="gLime"    x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#C6E97A"/><stop offset="100%" stopColor="#558B2F"/></linearGradient>
    <linearGradient id="gRed"     x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#EF5350"/><stop offset="100%" stopColor="#B71C1C"/></linearGradient>
    <linearGradient id="gCrimson" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#F06292"/><stop offset="100%" stopColor="#880E4F"/></linearGradient>
    <linearGradient id="gOrange"  x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#FFA726"/><stop offset="100%" stopColor="#E64A19"/></linearGradient>
    <linearGradient id="gAmber"   x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#FFD54F"/><stop offset="100%" stopColor="#E65100"/></linearGradient>
    <linearGradient id="gYellow"  x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#FFF176"/><stop offset="100%" stopColor="#F57F17"/></linearGradient>
    <linearGradient id="gGold"    x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#FFE082"/><stop offset="100%" stopColor="#FF8F00"/></linearGradient>
    <linearGradient id="gBlue"    x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#64B5F6"/><stop offset="100%" stopColor="#0D47A1"/></linearGradient>
    <linearGradient id="gSkyBlue" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#B3E5FC"/><stop offset="100%" stopColor="#01579B"/></linearGradient>
    <linearGradient id="gPurple"  x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#CE93D8"/><stop offset="100%" stopColor="#6A1B9A"/></linearGradient>
    <linearGradient id="gViolet"  x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#B39DDB"/><stop offset="100%" stopColor="#4527A0"/></linearGradient>
    <linearGradient id="gBrown"   x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#BCAAA4"/><stop offset="100%" stopColor="#5D4037"/></linearGradient>
    <linearGradient id="gBark"    x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#A1887F"/><stop offset="100%" stopColor="#4E342E"/></linearGradient>
    <linearGradient id="gSoil"    x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#8D6E63"/><stop offset="100%" stopColor="#3E2723"/></linearGradient>
    <linearGradient id="gSteel"   x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#ECEFF1"/><stop offset="100%" stopColor="#546E7A"/></linearGradient>
    <linearGradient id="gWater"   x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#81D4FA"/><stop offset="100%" stopColor="#0277BD"/></linearGradient>
    <radialGradient id="rShine" cx="32%" cy="24%"><stop offset="0%" stopColor="white" stopOpacity="0.5"/><stop offset="55%" stopColor="white" stopOpacity="0"/></radialGradient>
    <radialGradient id="rSoft"  cx="32%" cy="28%"><stop offset="0%" stopColor="white" stopOpacity="0.25"/><stop offset="100%" stopColor="white" stopOpacity="0"/></radialGradient>
    <radialGradient id="rDeep"  cx="50%" cy="50%"><stop offset="0%" stopColor="white" stopOpacity="0.1"/><stop offset="100%" stopColor="black" stopOpacity="0.15"/></radialGradient>
  </defs>
);

export default function W({ size, children }: { size: number; children: React.ReactNode }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      {DEFS}
      {children}
    </svg>
  );
}
