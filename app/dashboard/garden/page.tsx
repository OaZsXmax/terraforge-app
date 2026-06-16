'use client';

import { generateBlueprint } from './generate';
import { supabase } from '@/lib/supabase';
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { usePlan } from '@/hooks/usePlan';
import FeatureIcon from '@/components/FeatureIcon';
import Paywall from '@/components/Paywall';
import { createPortal } from 'react-dom';
import { useForm, Resolver } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Leaf, Droplet, Recycle, Users, Award, Download,
  Heart, Calendar, Target, Plus,
  AlertTriangle, TrendingUp, Settings, X,
  RotateCcw, Info, CheckCircle2, BarChart3,
  Zap, Layers, Map as MapIcon, Sprout, ArrowUp,
  Copy, Trash2, BookOpen,
  Pencil, Share2, Link, Home,
} from 'lucide-react';

/* ===========================================================================
   VERDANT OS -- "Bioluminescent Command Interface" v8.0
   Typography: Space Grotesk (display) + Inter (body) + JetBrains Mono (data)
   Aesthetic: Living biotech command center. Liquid glass, emerald bioluminescence,
   organic morphing shapes, deep forest void, crystalline data panels.
   Smooth spring physics navigation. Every panel feels alive.
   =========================================================================== */
const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500;700&display=swap');

/* -- CSS Reset ------------------------------------------ */
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}

/* -- AXIOM Design Tokens -------------------------------- */
:root {
  /* Depth layers — lifted, brighter forest green */
  --void:    #0a1f15;
  --abyss:   #0d2418;
  --deep:    #112e1e;
  --dark:    #163824;
  --chamber: #1c4530;
  --surface: #22523a;
  --lift:    #2a6648;
  --panel:   rgba(18,44,30,0.82);
  --panel2:  rgba(24,54,38,0.90);

  /* Axiom spectrum — quantum bioluminescence */
  --jade:    #00ffaa;
  --jade2:   #00e896;
  --jade3:   #00c47a;
  --jade4:   #009a5e;
  --jade5:   #006640;

  /* Signal colours */
  --cyan:    #00eeff;
  --cyan2:   #00c8d8;
  --plasma:  #a78bfa;
  --amber:   #ffb020;
  --amber2:  #e09010;
  --red:     #ff8c42;
  --rose:    #ff3366;
  --ice:     #88ddff;

  /* Text — crisp, high contrast */
  --tp:  rgba(242,255,250,1.00);
  --td:  rgba(210,252,234,0.98);
  --tf:  rgba(170,240,210,0.92);
  --ts:  rgba(130,215,180,0.80);

  /* Borders — energy field edges */
  --border:  rgba(0,255,170,0.28);
  --border2: rgba(0,255,170,0.45);
  --border3: rgba(0,255,170,0.65);
  --b-cyan:  rgba(0,238,255,0.26);

  /* Glows */
  --glow-j:  rgba(0,255,170,0.55);
  --glow-c:  rgba(0,238,255,0.45);

  --plasma:  #a78bfa;
  --cyan2:   #00c8d8;
}

/* -- Typography ----------------------------------------- */
.f-clash  { font-family:'Space Grotesk',sans-serif; font-weight:700; letter-spacing:.06em; }
.f-outfit { font-family:'Inter',sans-serif; font-weight:400; }
.f-mono   { font-family:'JetBrains Mono',monospace; }

/* -- Keyframes ------------------------------------------ */
@keyframes scan         { 0%{transform:translateY(-100%);opacity:0} 3%{opacity:.06} 97%{opacity:.03} 100%{transform:translateY(100vh);opacity:0} }
@keyframes scan2        { 0%{transform:translateY(-100%);opacity:0} 3%{opacity:.03} 97%{opacity:.015} 100%{transform:translateY(100vh);opacity:0} }
@keyframes fadeUp       { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
@keyframes fadeIn       { from{opacity:0} to{opacity:1} }
@keyframes scaleIn      { from{opacity:0;transform:scale(0.88) translateY(8px)} to{opacity:1;transform:scale(1) translateY(0)} }
@keyframes slideInRight { from{opacity:0;transform:translateX(32px)} to{opacity:1;transform:translateX(0)} }
@keyframes pulse        { 0%,100%{opacity:1} 50%{opacity:0.18} }
@keyframes morphGradient{ 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
@keyframes shimmer      { 0%{background-position:-800% 0} 100%{background-position:800% 0} }
@keyframes holoShimmer  { 0%{background-position:-400% 0} 100%{background-position:400% 0} }
@keyframes orb          { 0%{transform:translate(0,0) scale(1)} 33%{transform:translate(80px,-60px) scale(1.14)} 66%{transform:translate(-40px,-80px) scale(0.88)} 100%{transform:translate(0,0) scale(1)} }
@keyframes orb2         { 0%{transform:translate(0,0) rotate(0deg)} 40%{transform:translate(-70px,60px) rotate(8deg)} 70%{transform:translate(50px,-40px) rotate(-5deg)} 100%{transform:translate(0,0) rotate(0deg)} }
@keyframes liquidMorph  { 0%,100%{border-radius:62% 38% 68% 32%/52% 62% 38% 48%} 33%{border-radius:32% 68% 38% 62%/62% 32% 68% 38%} 66%{border-radius:68% 32% 62% 38%/38% 68% 32% 62%} }
@keyframes borderFlow   { 0%{background-position:0% 50%} 100%{background-position:200% 50%} }
@keyframes dataFlicker  { 0%,96%,100%{opacity:1} 97%{opacity:0.7} 98%{opacity:1} 99%{opacity:0.85} }
@keyframes shimmerText  { 0%{background-position:0% 50%} 100%{background-position:200% 50%} }
@keyframes scanline     { 0%{transform:translateY(0)} 100%{transform:translateY(4px)} }
@keyframes floatEmoji   { 0%,100%{transform:translateY(0px) rotate(-5deg);opacity:0.18} 50%{transform:translateY(-28px) rotate(5deg);opacity:0.32} }
@keyframes slideRotate  { 0%,23%{opacity:0;transform:translateY(12px)} 4%,19%{opacity:1;transform:translateY(0)} 23%,100%{opacity:0;transform:translateY(-12px)} }
@keyframes cardFloat    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
@keyframes iconBounce   { 0%,100%{transform:translateY(0) scale(1)} 40%{transform:translateY(-4px) scale(1.1)} }
@keyframes ctaPulse     { 0%,100%{box-shadow:0 0 48px rgba(0,255,170,0.20),0 8px 24px rgba(0,0,0,0.30)} 50%{box-shadow:0 0 72px rgba(0,255,170,0.40),0 8px 32px rgba(0,0,0,0.40)} }
@keyframes rotateGeo    { from{transform:rotateX(0deg) rotateY(0deg) rotateZ(0deg)} to{transform:rotateX(360deg) rotateY(240deg) rotateZ(120deg)} }
@keyframes rotateGeo2   { from{transform:rotateX(0deg) rotateY(0deg)} to{transform:rotateX(-240deg) rotateY(360deg)} }
@keyframes gridPulse    { 0%,100%{opacity:0.025} 50%{opacity:0.055} }
@keyframes energyRing   { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
@keyframes energyRing2  { from{transform:rotate(0deg)} to{transform:rotate(-360deg)} }
@keyframes hoverLift    { from{transform:translateY(0) rotateX(0deg)} to{transform:translateY(-4px) rotateX(2deg)} }
@keyframes breathe      { 0%,100%{opacity:0.45} 50%{opacity:0.80} }
@keyframes svgPulse    { 0%,100%{opacity:0.55;stroke-opacity:0.55} 50%{opacity:0.12;stroke-opacity:0.12} }
@keyframes terrainPulse { 0%,100%{opacity:0.55} 50%{opacity:0.90} }
@keyframes axiomBoot    { 0%{opacity:0;transform:scale(0.95) translateY(12px)} 60%{opacity:1} 100%{opacity:1;transform:scale(1) translateY(0)} }
@keyframes streamFlow   { 0%{stroke-dashoffset:1000} 100%{stroke-dashoffset:0} }
@keyframes particleRise { 0%{transform:translateY(0) translateX(0);opacity:0.8} 100%{transform:translateY(-80px) translateX(var(--dx,0px));opacity:0} }
@keyframes a-pulse      { 0%,100%{opacity:0.55;r:0} 50%{opacity:0;r:6} }
@keyframes spin3d       { from{transform:rotateX(0deg) rotateY(0deg) rotateZ(0deg)} to{transform:rotateX(360deg) rotateY(240deg) rotateZ(120deg)} }
@keyframes spin         { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
@keyframes edgeRun      { 0%{background-position:0% 50%} 100%{background-position:400% 50%} }
@keyframes morphBlob    { 0%,100%{border-radius:62% 38% 68% 32%/52% 62% 38% 48%} 33%{border-radius:32% 68% 38% 62%/62% 32% 68% 38%} 66%{border-radius:68% 32% 62% 38%/38% 68% 32% 62%} }

/* Terrain performance */
.terrain-svg {
  will-change:transform;
  isolation:isolate;
}
/* Dashboard bento panels — isolated layers, no over-compositing */
.bento-widget {
  isolation:isolate;
  contain:layout style;
}


/* -- Animation classes ---------------------------------- */
.a-scan    { animation:scan 28s linear infinite }
.a-fadeUp  { animation:fadeUp 0.60s cubic-bezier(0.22,1,0.36,1) both }
.a-fadeIn  { animation:fadeIn 0.30s ease both }
.a-scaleIn { animation:scaleIn 0.42s cubic-bezier(0.22,1,0.36,1) both }
.a-slideR  { animation:slideInRight 0.42s cubic-bezier(0.22,1,0.36,1) both }
.a-pulse   { animation:pulse 2.8s ease-in-out infinite }
.a-liquid  { animation:liquidMorph 12s ease-in-out infinite }
.a-shimmer {
  background:linear-gradient(90deg,transparent,rgba(0,255,170,0.08) 40%,rgba(0,238,255,0.05) 60%,transparent);
  background-size:600% 100%;
  animation:shimmer 4s ease infinite;
}
.a-boot    { animation:axiomBoot 0.8s cubic-bezier(0.22,1,0.36,1) both }

/* -- Scrollbars ----------------------------------------- */
* { scrollbar-width:thin; scrollbar-color:rgba(0,255,170,0.22) transparent }
*::-webkit-scrollbar { width:3px; height:3px }
*::-webkit-scrollbar-thumb { background:rgba(0,255,170,0.45); border-radius:99px }

/* -- Holographic grid pattern --------------------------- */
.holo-grid {
  background-image:
    linear-gradient(rgba(0,255,170,0.055) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,255,170,0.055) 1px, transparent 1px);
  background-size:48px 48px;
  animation:gridPulse 6s ease-in-out infinite;
}

/* -- Hex pattern ---------------------------------------- */
.hex {
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64'%3E%3Cpath d='M32 4L58 18v28L32 60 6 46V18Z' fill='none' stroke='%2300ffaa' stroke-width='0.3' stroke-opacity='0.055'/%3E%3Ccircle cx='32' cy='32' r='1' fill='%2300ffaa' fill-opacity='0.04'/%3E%3C/svg%3E");
}

/* -- Tile states ---------------------------------------- */
.tile-empty {
  background:rgba(0,255,170,0.06);
  border:1px dashed rgba(0,255,170,0.30);
  transition:all 0.18s cubic-bezier(0.22,1,0.36,1);
}
.tile-empty:hover {
  background:rgba(0,255,170,0.08);
  border-color:rgba(0,255,170,0.50)!important;
  border-style:solid!important;
  box-shadow:0 0 20px rgba(0,255,170,0.12),inset 0 0 8px rgba(0,255,170,0.04);
}
/* Flatten 3D grid during library drag so HTML5 drop targets work */
.grid-lib-drag [data-bp-id] {
  transform: rotateX(0deg) rotateY(0deg) !important;
  transition: none !important;
}
.tile-placed {
  background:linear-gradient(145deg,rgba(0,255,170,0.18),rgba(0,238,255,0.10),rgba(167,139,250,0.06))!important;
  border:1px solid rgba(0,255,170,0.45)!important;
  box-shadow:
    0 4px 16px rgba(0,0,0,0.40),
    0 0 18px rgba(0,255,170,0.12),
    inset 0 1px 0 rgba(0,255,170,0.16),
    inset 0 0 12px rgba(0,255,170,0.03)!important;
}

/* -- Form inputs ---------------------------------------- */
.tf-in {
  outline:none;
  transition:all 0.22s cubic-bezier(0.22,1,0.36,1);
  font-family:'Inter',sans-serif;
}
.tf-in:focus {
  border-color:rgba(0,255,170,0.60)!important;
  box-shadow:0 0 0 3px rgba(0,255,170,0.08),0 0 24px rgba(0,255,170,0.12),0 4px 16px rgba(0,0,0,0.40);
  background:rgba(0,255,170,0.03)!important;
}
textarea.tf-in { resize:none }

/* -- Generate button — AXIOM prime action --------------- */
.gen-btn {
  position:relative; overflow:hidden;
  background:linear-gradient(135deg,#003d28 0%,#006644 30%,#00aa66 60%,#00cc7a 80%,#006644 100%);
  background-size:300% 300%;
  animation:morphGradient 5s ease infinite;
  transition:all 0.26s cubic-bezier(0.22,1,0.36,1);
  border:1px solid rgba(0,255,170,0.45);
  box-shadow:
    0 1px 0 rgba(0,255,170,0.18) inset,
    0 6px 28px rgba(0,150,90,0.28),
    0 0 60px rgba(0,255,170,0.08);
  font-family:'Space Grotesk',sans-serif;
}
.gen-btn::before {
  content:'';position:absolute;inset:0;
  background:linear-gradient(135deg,rgba(0,255,170,0.18),rgba(0,238,255,0.06));
  opacity:0;transition:opacity 0.22s;
}
.gen-btn::after {
  content:'';position:absolute;top:0;left:-100%;width:55%;height:100%;
  background:linear-gradient(90deg,transparent,rgba(0,255,170,0.20),rgba(0,238,255,0.10),transparent);
  transition:left 0.65s ease;
}
.gen-btn:hover::before { opacity:1 }
.gen-btn:hover::after  { left:160% }
.gen-btn:hover {
  box-shadow:0 0 0 1px rgba(0,255,170,0.45),0 10px 40px rgba(0,150,90,0.36),0 0 80px rgba(0,255,170,0.16);
  transform:translateY(-2px) scale(1.006);
}
.gen-btn:active { transform:scale(0.988);transition-duration:0.06s }

/* -- Nav tabs ------------------------------------------- */
.nav-btn { transition:all 0.18s cubic-bezier(0.22,1,0.36,1) }
.nav-active {
  background:linear-gradient(135deg,rgba(0,255,170,0.22),rgba(0,238,255,0.10))!important;
  border-color:rgba(0,255,170,0.60)!important;
  box-shadow:0 0 0 1px rgba(0,255,170,0.30),0 2px 16px rgba(0,0,0,0.25),0 0 40px rgba(0,255,170,0.22)!important;
}

/* -- Score rings ---------------------------------------- */
.ring-track { fill:none; stroke:rgba(0,255,170,0.20); stroke-width:7 }
.ring-fill  { fill:none; stroke-width:7; stroke-linecap:round; transition:stroke-dashoffset 1.6s cubic-bezier(0.22,1,0.36,1); filter:drop-shadow(0 0 8px currentColor) }

/* -- ROI bars ------------------------------------------- */
.roi-bar { transition:filter 0.18s,transform 0.18s; cursor:pointer; transform-origin:bottom }
.roi-bar:hover { filter:brightness(1.6) saturate(1.5); transform:scaleY(1.10) }

/* -- Chips ---------------------------------------------- */
.chip {
  display:inline-flex; align-items:center; gap:5px;
  padding:3px 11px; border-radius:999px;
  font-family:'Inter',sans-serif; font-size:12px; font-weight:500;
  background:linear-gradient(135deg,rgba(0,255,170,0.10),rgba(0,238,255,0.05));
  border:1px solid rgba(0,255,170,0.25);
  color:var(--jade); margin:2px;
  transition:all 0.18s; box-shadow:0 0 12px rgba(0,255,170,0.06);
}
.chip:hover { background:linear-gradient(135deg,rgba(0,255,170,0.18),rgba(0,238,255,0.09)); border-color:rgba(0,255,170,0.45); box-shadow:0 0 20px rgba(0,255,170,0.14); transform:translateY(-1px); }

/* -- Slide panel ---------------------------------------- */
.slide-panel     { transition:transform 0.42s cubic-bezier(0.22,1,0.36,1),opacity 0.26s ease }
.slide-panel-in  { transform:translateX(0);  opacity:1 }
.slide-panel-out { transform:translateX(100%); opacity:0 }

/* -- Category colors ------------------------------------ */
.cc-food         { --cc:#00ffaa }
.cc-water        { --cc:#00eeff }
.cc-energy       { --cc:#ffb020 }
.cc-soil         { --cc:#d4a060 }
.cc-biodiversity { --cc:#44ee88 }
.cc-animals      { --cc:#ff9960 }
.cc-flowers      { --cc:#cc88ff }

/* -- AXIOM panel system — glass plates with energy edges -- */
.axiom-panel {
  position:relative;
  background:linear-gradient(135deg,rgba(0,255,170,0.14) 0%,rgba(10,40,28,0.90) 40%,rgba(12,8,50,0.88) 100%);
  border:1px solid rgba(0,255,170,0.35);
  border-radius:20px;
  backdrop-filter:blur(48px) saturate(1.8) brightness(1.22);
  overflow:hidden;
  transition:all 0.24s cubic-bezier(0.22,1,0.36,1);
  box-shadow:
    0 0 0 1px rgba(0,255,170,0.05) inset,
    0 1px 0 rgba(0,255,170,0.12) inset,
    0 20px 60px rgba(0,0,0,0.32),
    0 0 40px rgba(0,255,170,0.10);
}
.axiom-panel::before {
  content:'';position:absolute;top:0;left:0;right:0;height:1px;
  background:linear-gradient(90deg,transparent,rgba(0,255,170,0.75) 30%,rgba(0,238,255,0.55) 60%,rgba(167,139,250,0.40) 80%,transparent);
  animation:borderFlow 8s linear infinite;
  background-size:200% 100%;
}
.axiom-panel::after {
  content:'';position:absolute;bottom:0;left:0;right:0;height:1px;
  background:linear-gradient(90deg,transparent,rgba(0,255,170,0.18) 50%,transparent);
}
.axiom-panel:hover {
  border-color:rgba(0,255,170,0.28);
  box-shadow:
    0 0 0 1px rgba(0,255,170,0.09) inset,
    0 1px 0 rgba(0,255,170,0.18) inset,
    0 24px 64px rgba(0,0,0,0.28),
    0 0 60px rgba(0,255,170,0.08);
  transform:translateY(-1px);
}

/* -- Glass panel performance ----------------------------- */
.glass-panel, .axiom-panel, .crystal-panel {
  contain:layout style;}
/* Prevent backdrop-filter on low-motion preference */
@media (prefers-reduced-motion: reduce) {
  .glass-panel::before, .axiom-panel::before { animation:none !important; }
  .tilt-card { transition:none !important; }
  .a-scan, .a-breathe, .a-liquid { animation:none !important; }
}

/* -- Tilt card — 3D perspective hover ------------------- */
.tilt-card {
  transition:transform 0.20s cubic-bezier(0.22,1,0.36,1), box-shadow 0.20s;
  transform-style:preserve-3d;
}

/* -- Data card ------------------------------------------ */
.data-card {
  background:linear-gradient(135deg,rgba(0,255,170,0.14) 0%,rgba(10,34,24,0.88) 100%);
  border:1px solid rgba(0,255,170,0.32);
  border-radius:18px;
  backdrop-filter:blur(16px) brightness(1.18);
  transition:border-color 0.22s cubic-bezier(0.22,1,0.36,1),box-shadow 0.22s cubic-bezier(0.22,1,0.36,1),transform 0.22s cubic-bezier(0.22,1,0.36,1);
  overflow:hidden;
  position:relative;
}
.data-card::before {
  content:'';position:absolute;top:0;left:0;right:0;height:1px;
  background:linear-gradient(90deg,transparent,rgba(0,255,170,0.60) 50%,transparent);
}
.data-card:hover {
  border-color:rgba(0,255,170,0.28);
  box-shadow:0 0 0 1px rgba(0,255,170,0.12),0 12px 40px rgba(0,0,0,0.32),0 0 40px rgba(0,255,170,0.09);
  transform:translateY(-3px) scale(1.005);
}

/* -- Top nav — AXIOM command bar ------------------------ */
.tf-topnav {
  position:sticky; top:0; z-index:200;
  display:flex; align-items:center; gap:0;
  height:56px; padding:0 20px;
  background:linear-gradient(90deg,rgba(8,48,30,0.97) 0%,rgba(10,28,48,0.97) 60%,rgba(16,6,50,0.97) 100%);
  backdrop-filter:blur(28px) brightness(1.18);
  -webkit-backdrop-filter:blur(28px) brightness(1.18);
  border-bottom:1px solid rgba(0,255,170,0.12);
  box-shadow:0 1px 0 rgba(0,255,170,0.08),0 6px 32px rgba(0,0,0,0.32);
  font-family:'Space Grotesk',sans-serif;
}
.tf-topnav::before {
  content:'';position:absolute;top:0;left:0;right:0;height:1px;
  background:linear-gradient(90deg,transparent,rgba(0,255,170,0.55) 25%,rgba(0,238,255,0.35) 50%,rgba(167,139,250,0.25) 75%,transparent);
  animation:borderFlow 6s linear infinite;
  background-size:200% 100%;
}
.tf-topnav-logo {
  display:flex;align-items:center;gap:10px;
  flex-shrink:0;padding-right:20px;
  border-right:1px solid rgba(0,255,170,0.08);
}
.tf-topnav-tabs {
  display:flex;align-items:center;gap:2px;
  padding:0 12px;flex:1;
}
.tf-topnav-actions {
  display:flex;align-items:center;gap:8px;
  padding-left:16px;
  border-left:1px solid rgba(0,255,170,0.08);
}
.tf-navtab {
  display:flex;align-items:center;gap:5px;
  padding:5px 12px;border-radius:10px;
  font-family:'Space Grotesk',sans-serif;font-size:10px;font-weight:600;
  color:rgba(140,220,185,0.50);
  border:1px solid transparent;background:transparent;
  letter-spacing:.08em;text-transform:uppercase;
  transition:all 0.20s cubic-bezier(0.22,1,0.36,1);
  cursor:pointer;
}
.tf-navtab:hover {
  color:rgba(200,255,230,0.80);
  background:rgba(0,255,170,0.04);
  border-color:rgba(0,255,170,0.12);
}
.tf-navtab.active {
  color:var(--jade);
  background:rgba(0,255,170,0.08);
  border-color:rgba(0,255,170,0.25);
  box-shadow:0 0 0 1px rgba(0,255,170,0.10),0 2px 14px rgba(0,0,0,0.32),0 0 20px rgba(0,255,170,0.08);
  text-shadow:0 0 12px rgba(0,255,170,0.60);
}

/* -- Main layout ---------------------------------------- */
.tf-app {
  min-height:100vh;
  background:var(--void);
  position:relative;
  overflow-x:hidden;
  font-family:'Inter',sans-serif;
}
.tf-main {
  position:relative;z-index:1;
  max-width:1560px;margin:0 auto;
  padding:20px 20px 48px;
}
.tf-content { width:100% }

/* -- Config panel --------------------------------------- */
.config-panel {
  border-radius:24px;
  border:1px solid rgba(0,255,170,0.14);
  background:linear-gradient(135deg,rgba(0,255,170,0.06),rgba(12,28,18,0.80));
  backdrop-filter:blur(48px) saturate(1.8) brightness(1.26);
  overflow:hidden;
  box-shadow:0 0 0 1px rgba(0,255,170,0.05) inset,0 24px 64px rgba(0,0,0,0.32);
}

/* -- Section header ------------------------------------- */
.section-hdr {
  display:flex;align-items:center;gap:9px;
  margin-bottom:14px;
}
.section-hdr-bar {
  width:2px;height:14px;border-radius:2px;flex-shrink:0;
  background:linear-gradient(180deg,var(--jade),var(--cyan));
  box-shadow:0 0 14px rgba(0,255,170,0.80),0 0 28px rgba(0,255,170,0.25);
}

/* -- Stat ribbon ---------------------------------------- */
.stat-ribbon { display:flex;align-items:center;gap:2px }
.stat-ribbon-cell {
  display:flex;flex-direction:column;align-items:center;
  padding:3px 10px;border-radius:8px;
  background:rgba(0,255,170,0.04);
  border:1px solid rgba(0,255,170,0.10);
  min-width:68px;
}

/* -- Content panels ------------------------------------- */
.content-section {
  border-radius:20px;
  background:linear-gradient(135deg,rgba(0,255,170,0.06),rgba(12,28,18,0.76));
  border:1px solid rgba(0,255,170,0.13);
  backdrop-filter:blur(40px) saturate(1.7) brightness(1.26);
  overflow:hidden;
  box-shadow:0 0 0 1px rgba(0,255,170,0.04) inset,0 20px 56px rgba(0,0,0,0.28);
  position:relative;
}
.content-section::before {
  content:'';position:absolute;top:0;left:0;right:0;height:1px;
  background:linear-gradient(90deg,transparent,rgba(0,255,170,0.36) 50%,transparent);
}
.panel-hdr {
  padding:16px 24px;
  border-bottom:1px solid rgba(0,255,170,0.09);
  background:rgba(0,255,170,0.03);
  display:flex;align-items:center;justify-content:space-between;
}
.panel-body { padding:20px 24px }

/* -- Feature library ------------------------------------ */
.lib-grid { display:flex;flex-wrap:wrap;gap:7px }
.lib-icon {
  display:flex;flex-direction:column;align-items:center;gap:4px;
  padding:9px 6px;border-radius:14px;
  width:76px;min-height:64px;
  background:rgba(0,255,170,0.04);
  border:1px solid rgba(0,255,170,0.12);
  cursor:pointer;
  transition:all 0.18s cubic-bezier(0.22,1,0.36,1);
  position:relative;overflow:hidden;
}
.lib-icon::before {
  content:'';position:absolute;top:0;left:0;right:0;height:1px;
  background:linear-gradient(90deg,transparent,rgba(0,255,170,0.25) 50%,transparent);
  opacity:0;transition:opacity 0.18s;
}
.lib-icon:hover::before { opacity:1 }
.lib-icon:hover {
  background:rgba(0,255,170,0.08);
  border-color:rgba(0,255,170,0.38);
  box-shadow:0 0 20px rgba(0,255,170,0.14),inset 0 0 8px rgba(0,255,170,0.04);
  transform:scale(1.08) translateY(-2px);
}

/* -- Map tab buttons ------------------------------------ */
.map-tab {
  padding:6px 16px;border-radius:10px;
  font-family:'Space Grotesk',sans-serif;font-size:10px;font-weight:600;
  letter-spacing:.08em;text-transform:uppercase;
  transition:all 0.20s cubic-bezier(0.22,1,0.36,1);
  border:1px solid transparent;cursor:pointer;
  color:var(--tf);
}
.map-tab:hover { color:var(--td);background:rgba(0,255,170,0.05) }
.map-tab.active {
  color:var(--jade);background:rgba(0,255,170,0.09);
  border-color:rgba(0,255,170,0.26);
  box-shadow:0 0 18px rgba(0,255,170,0.10);
  text-shadow:0 0 10px rgba(0,255,170,0.50);
}

/* -- Improve button ------------------------------------- */
.improve-btn {
  display:flex;align-items:center;gap:5px;
  padding:5px 12px;border-radius:10px;
  font-family:'Space Grotesk',sans-serif;font-size:10px;font-weight:600;
  letter-spacing:.06em;text-transform:uppercase;
  border:1.5px solid;background:transparent;
  cursor:pointer;
  transition:all 0.20s cubic-bezier(0.22,1,0.36,1);
}
.improve-btn:hover { transform:scale(1.05);filter:brightness(1.2) }

/* -- Tooltip -------------------------------------------- */
.tf-tooltip {
  position:fixed;z-index:9999;
  min-width:200px;max-width:280px;
  padding:10px 14px;border-radius:14px;
  background:linear-gradient(135deg,rgba(0,255,170,0.06),rgba(2,10,7,0.94));
  border:1px solid rgba(0,255,170,0.20);
  box-shadow:0 10px 40px rgba(0,0,0,0.35),0 0 0 1px rgba(0,255,170,0.06) inset,0 0 24px rgba(0,255,170,0.06);
  backdrop-filter:blur(14px);
  font-family:'Inter',sans-serif;font-size:11px;
  color:var(--td);line-height:1.5;
  pointer-events:none;
  animation:fadeIn 0.16s ease both;
}

/* -- Feature panel (slide-in) --------------------------- */
.feat-panel {
  position:fixed;top:0;right:0;bottom:0;z-index:800;
  width:340px;max-width:92vw;
  background:linear-gradient(180deg,rgba(12,28,18,0.84) 0%,rgba(2,14,10,0.94) 100%);
  border-left:1px solid rgba(0,255,170,0.14);
  backdrop-filter:blur(56px) saturate(2.2) brightness(1.18);
  box-shadow:-24px 0 80px rgba(0,0,0,0.35),0 0 60px rgba(0,255,170,0.04);
  overflow-y:auto;
}

/* -- Conflict banner ------------------------------------ */
.conflict-row {
  width:100%;text-align:left;
  padding:9px 16px;border:none;background:transparent;
  display:flex;align-items:center;gap:8px;
  font-family:'Inter',sans-serif;font-size:11px;font-weight:500;
  color:var(--amber);cursor:pointer;
  transition:background 0.14s;
}
.conflict-row:hover { background:rgba(255,176,32,0.05) }

/* -- Score section layout ------------------------------- */
.scores-outer { display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:28px;padding:28px }
.scores-secondary { display:grid;grid-template-columns:repeat(2,1fr);gap:24px;flex:1;min-width:220px }

/* -- Blueprint selector --------------------------------- */
.bp-selector {
  display:flex;align-items:center;gap:6px;
  padding:6px 12px 6px 6px;border-radius:12px;
  background:rgba(0,255,170,0.04);border:1px solid rgba(0,255,170,0.10);
  cursor:pointer;
  transition:all 0.18s cubic-bezier(0.22,1,0.36,1);
  font-family:'Inter',sans-serif;font-size:11px;font-weight:500;
  color:var(--td);
}
.bp-selector.active {
  background:rgba(0,255,170,0.08);border-color:rgba(0,255,170,0.24);
  color:var(--jade);box-shadow:0 0 16px rgba(0,255,170,0.08);
}
.bp-selector:hover { border-color:rgba(0,255,170,0.22);color:var(--tp) }

/* -- ROI bar chart -------------------------------------- */
.roi-chart-wrap {
  background:rgba(0,4,2,0.60);
  border-radius:16px;
  border:1px solid rgba(0,255,170,0.07);
  padding:16px;overflow:hidden;
  position:relative;
}
.roi-chart-wrap::before {
  content:'';position:absolute;top:0;left:0;right:0;height:1px;
  background:linear-gradient(90deg,transparent,rgba(0,255,170,0.20) 50%,transparent);
}

/* -- Seasonal calendar ---------------------------------- */
.season-card {
  border-radius:16px;
  border:1px solid rgba(0,255,170,0.08);
  background:linear-gradient(135deg,rgba(0,255,170,0.03),rgba(2,10,7,0.70));
  padding:16px;
  transition:all 0.20s cubic-bezier(0.22,1,0.36,1);
  position:relative;overflow:hidden;
}
.season-card::before {
  content:'';position:absolute;top:0;left:0;right:0;height:1px;
  background:linear-gradient(90deg,transparent,rgba(0,255,170,0.24) 50%,transparent);
  opacity:0;transition:opacity 0.20s;
}
.season-card:hover::before { opacity:1 }
.season-card:hover {
  border-color:rgba(0,255,170,0.20);
  background:linear-gradient(135deg,rgba(0,255,170,0.06),rgba(2,10,7,0.72));
  transform:translateY(-3px);
  box-shadow:0 8px 32px rgba(0,0,0,0.40),0 0 24px rgba(0,255,170,0.06);
}

/* -- Library scroll container --------------------------- */
.lib-scroll {
  scrollbar-width:auto;
  scrollbar-color:rgba(0,255,170,0.60) rgba(0,255,170,0.06);
}
.lib-scroll::-webkit-scrollbar { width:10px }
.lib-scroll::-webkit-scrollbar-track { background:rgba(0,255,170,0.05);border-radius:99px;margin:4px 2px }
.lib-scroll::-webkit-scrollbar-thumb {
  background:linear-gradient(180deg,#00ffaa 0%,#00c47a 100%);
  border-radius:99px;
  border:2px solid rgba(2,10,7,0.80);
  box-shadow:0 0 12px rgba(0,255,170,0.55);
  min-height:44px;
}
.lib-scroll::-webkit-scrollbar-thumb:hover {
  background:linear-gradient(180deg,#44ffbb 0%,#00ffaa 100%);
  box-shadow:0 0 24px rgba(0,255,170,0.85);
}

/* -- Energy ring decorations ---------------------------- */
.energy-ring-outer {
  position:absolute;border-radius:50%;
  border:1px solid rgba(0,255,170,0.08);
  animation:energyRing 24s linear infinite;
  pointer-events:none;
}
.energy-ring-inner {
  position:absolute;border-radius:50%;
  border:1px dashed rgba(0,238,255,0.06);
  animation:energyRing2 18s linear infinite;
  pointer-events:none;
}

/* -- Holographic shimmer overlay ----------------------- */
.holo-surface::before {
  content:'';position:absolute;inset:0;border-radius:inherit;
  background:linear-gradient(105deg,transparent 20%,rgba(0,255,170,0.04) 35%,rgba(0,238,255,0.03) 50%,rgba(167,139,250,0.02) 65%,transparent 80%);
  background-size:400% 100%;
  animation:holoShimmer 8s ease infinite;
  pointer-events:none;
  z-index:1;
}

/* -- Responsive ----------------------------------------- */
@media(max-width:768px){
  .tf-topnav{padding:0 12px;height:48px}
  .tf-navtab span{display:none}
  .tf-navtab{padding:5px 8px}
  .tf-main{padding:12px 12px 32px}
}
/* -- Hard viewport clamp -- prevents any overflow */
html{overflow-x:hidden;}
body{overflow-x:hidden;position:relative;-webkit-overflow-scrolling:touch;background:linear-gradient(160deg,rgba(8,42,26,1) 0%,rgba(10,30,42,1) 55%,rgba(14,8,46,1) 100%);background-attachment:fixed;min-height:100vh;}
/* -- Mobile safe area & overflow fixes --------- */
*,*::before,*::after{box-sizing:border-box;}
html,body{max-width:100vw;overflow-x:hidden;}
@supports(padding:env(safe-area-inset-bottom)){
  .tf-bottom-nav{
    padding-bottom:env(safe-area-inset-bottom);
  }
}
/* Hide scrollbars on tab bar */
.tf-tab-scroll::-webkit-scrollbar{display:none;}
.tf-tab-scroll{-ms-overflow-style:none;scrollbar-width:none;}
/* Prevent iOS bounce causing layout issues */
@media(max-width:768px){
  .tf-main{padding:12px 10px 100px;}
}
`;


/* ==== SCHEMA ==== */
const formSchema = z.object({
  prompt:      z.string().optional(),
  yardSqFt:   z.coerce.number().min(500,'Min 500 sq ft').max(200000,'Too large'),
  familySize: z.coerce.number().min(1,'Min 1').max(20,'Max 20'),
  climateZone: z.enum(['Temperate','Arid','Subtropical','Cold','Tropical']),
  budget:     z.coerce.number().min(500,'Min $500').max(100000,'Max $100k'),
}).superRefine((d:any,ctx:any)=>{
  if(d.yardSqFt>30000&&d.budget<8000) ctx.addIssue({code:z.ZodIssueCode.custom,message:'Large property needs higher budget',path:['budget']});
  if(d.familySize>8&&d.yardSqFt<8000) ctx.addIssue({code:z.ZodIssueCode.custom,message:'Large family on small yard',path:['familySize']});
});
type FormData = z.infer<typeof formSchema>;

/* ==== ICON LIBRARY ==== */
const iconLibrary = [
  // -- Food: Beds & Trees ---------------------------------
  {name:'Raised Bed',        emoji:'🌱',category:'food',       yieldLbs:40, waterGal:80,  co2:8,   costMin:80,  costMax:150},
  {name:'Greenhouse',        emoji:'🏡',category:'food',       yieldLbs:200,waterGal:60,  co2:18,  costMin:400, costMax:1200},
  {name:'Herb Spiral',       emoji:'🌿',category:'food',       yieldLbs:8,  waterGal:20,  co2:4,   costMin:40,  costMax:100},
  // -- Food: Vegetables -----------------------------------
  {name:'Asparagus',         emoji:'🌵',category:'food',       yieldLbs:8,  waterGal:18,  co2:6,   costMin:15,  costMax:35},
  {name:'Beans',             emoji:'🫘',category:'food',       yieldLbs:12, waterGal:20,  co2:8,   costMin:3,   costMax:10},
  {name:'Broccoli',          emoji:'🥦',category:'food',       yieldLbs:14, waterGal:22,  co2:4,   costMin:4,   costMax:12},
  {name:'Cabbage',           emoji:'🥗',category:'food',       yieldLbs:20, waterGal:25,  co2:4,   costMin:3,   costMax:10},
  {name:'Carrots',           emoji:'🥕',category:'food',       yieldLbs:15, waterGal:25,  co2:4,   costMin:5,   costMax:15},
  {name:'Celery',            emoji:'🪴',category:'food',       yieldLbs:10, waterGal:20,  co2:3,   costMin:4,   costMax:10},
  {name:'Chard',             emoji:'🍃',category:'food',       yieldLbs:12, waterGal:16,  co2:3,   costMin:3,   costMax:8},
  {name:'Corn',              emoji:'🌽',category:'food',       yieldLbs:30, waterGal:60,  co2:6,   costMin:5,   costMax:20},
  {name:'Cucumbers',         emoji:'🥒',category:'food',       yieldLbs:18, waterGal:30,  co2:4,   costMin:3,   costMax:12},
  {name:'Eggplant',          emoji:'🍆',category:'food',       yieldLbs:18, waterGal:28,  co2:5,   costMin:4,   costMax:12},
  {name:'Garlic',            emoji:'🧄',category:'food',       yieldLbs:6,  waterGal:10,  co2:2,   costMin:3,   costMax:10},
  {name:'Herbs',             emoji:'🫒',category:'food',       yieldLbs:5,  waterGal:10,  co2:3,   costMin:5,   costMax:20},
  {name:'Kale',              emoji:'🥬',category:'food',       yieldLbs:12, waterGal:18,  co2:4,   costMin:5,   costMax:15},
  {name:'Lettuce',           emoji:'🫛',category:'food',       yieldLbs:10, waterGal:15,  co2:3,   costMin:5,   costMax:15},
  {name:'Onions',            emoji:'🧅',category:'food',       yieldLbs:12, waterGal:15,  co2:3,   costMin:3,   costMax:10},
  {name:'Peppers',           emoji:'🌶️',category:'food',      yieldLbs:8,  waterGal:20,  co2:3,   costMin:5,   costMax:15},
  {name:'Potatoes',          emoji:'🥔',category:'food',       yieldLbs:35, waterGal:45,  co2:5,   costMin:5,   costMax:20},
  {name:'Pumpkin',           emoji:'🎃',category:'food',       yieldLbs:40, waterGal:50,  co2:6,   costMin:5,   costMax:15},
  {name:'Radishes',          emoji:'🔴',category:'food',       yieldLbs:8,  waterGal:10,  co2:2,   costMin:2,   costMax:6},
  {name:'Spinach',           emoji:'🍀',category:'food',       yieldLbs:8,  waterGal:14,  co2:3,   costMin:3,   costMax:8},
  {name:'Sweet Potato',      emoji:'🍠',category:'food',       yieldLbs:30, waterGal:35,  co2:5,   costMin:4,   costMax:12},
  {name:'Tomatoes',          emoji:'🍅',category:'food',       yieldLbs:20, waterGal:40,  co2:5,   costMin:10,  costMax:30},
  {name:'Zucchini',          emoji:'🫑',category:'food',       yieldLbs:25, waterGal:35,  co2:5,   costMin:3,   costMax:10},
  // -- Food: Fruits ---------------------------------------
  {name:'Apple Tree',        emoji:'🍎',category:'food',       yieldLbs:60, waterGal:35,  co2:45,  costMin:30,  costMax:80},
  {name:'Avocado Tree',      emoji:'🥑',category:'food',       yieldLbs:40, waterGal:28,  co2:35,  costMin:30,  costMax:90},
  {name:'Banana Tree',       emoji:'🍌',category:'food',       yieldLbs:80, waterGal:50,  co2:40,  costMin:25,  costMax:70},
  {name:'Berry Bush',        emoji:'🍁',category:'food',       yieldLbs:25, waterGal:30,  co2:12,  costMin:20,  costMax:60},
  {name:'Blueberries',       emoji:'🫐',category:'food',       yieldLbs:10, waterGal:20,  co2:10,  costMin:15,  costMax:40},
  {name:'Cantaloupe',        emoji:'🍈',category:'food',       yieldLbs:30, waterGal:40,  co2:5,   costMin:4,   costMax:10},
  {name:'Fig Tree',          emoji:'🍄',category:'food',       yieldLbs:30, waterGal:22,  co2:28,  costMin:25,  costMax:65},
  {name:'Grapes',            emoji:'🍇',category:'food',       yieldLbs:35, waterGal:30,  co2:20,  costMin:20,  costMax:60},
  {name:'Lemon Tree',        emoji:'🍋',category:'food',       yieldLbs:50, waterGal:32,  co2:42,  costMin:30,  costMax:75},
  {name:'Mango Tree',        emoji:'🥭',category:'food',       yieldLbs:60, waterGal:42,  co2:48,  costMin:40,  costMax:100},
  {name:'Peach Tree',        emoji:'🍑',category:'food',       yieldLbs:55, waterGal:38,  co2:40,  costMin:25,  costMax:70},
  {name:'Pear Tree',         emoji:'🍐',category:'food',       yieldLbs:65, waterGal:36,  co2:50,  costMin:30,  costMax:80},
  {name:'Pineapple Tree',    emoji:'🍍',category:'food',       yieldLbs:20, waterGal:25,  co2:12,  costMin:10,  costMax:30},
  {name:'Orange Tree',        emoji:'🍊',category:'food',       yieldLbs:55, waterGal:35,  co2:42,  costMin:30,  costMax:80},
  {name:'Cherry Tree',        emoji:'🍒',category:'food',       yieldLbs:30, waterGal:28,  co2:35,  costMin:25,  costMax:70},
  {name:'Pomegranate Tree',   emoji:'🫀',category:'food',       yieldLbs:25, waterGal:22,  co2:30,  costMin:20,  costMax:60},
  {name:'Plum Tree',         emoji:'🫚',category:'food',       yieldLbs:40, waterGal:30,  co2:38,  costMin:25,  costMax:65},
  {name:'Strawberries',      emoji:'🍓',category:'food',       yieldLbs:8,  waterGal:15,  co2:4,   costMin:5,   costMax:18},
  {name:'Watermelon',        emoji:'🍉',category:'food',       yieldLbs:50, waterGal:55,  co2:7,   costMin:4,   costMax:12},
  // -- Water ----------------------------------------------
  {name:'Cistern',           emoji:'🪣',category:'water',      yieldLbs:0,  waterGal:12000,co2:18,  costMin:400, costMax:1000},
  {name:'Drip Irrigation',   emoji:'🚿',category:'water',      yieldLbs:0,  waterGal:2000, co2:2,   costMin:100, costMax:300},
  {name:'Pond',              emoji:'🐟',category:'water',      yieldLbs:10, waterGal:5000, co2:10,  costMin:300, costMax:1200},
  {name:'Rain Garden',       emoji:'🌧️',category:'water',     yieldLbs:0,  waterGal:3000, co2:14,  costMin:150, costMax:400},
  {name:'Rain Tank',         emoji:'💧',category:'water',      yieldLbs:0,  waterGal:4000, co2:12,  costMin:250, costMax:600},
  {name:'Swale',             emoji:'🌊',category:'water',      yieldLbs:0,  waterGal:8000, co2:20,  costMin:200, costMax:500},
  // -- Energy ---------------------------------------------
  {name:'Solar Battery',     emoji:'🔋',category:'energy',     yieldLbs:0,  waterGal:0,   co2:150, costMin:600, costMax:1800},
  {name:'Solar Panel',       emoji:'☀️',category:'energy',     yieldLbs:0,  waterGal:0,   co2:250, costMin:800, costMax:3000},
  {name:'Solar Pump',        emoji:'⚡',category:'energy',     yieldLbs:0,  waterGal:0,   co2:60,  costMin:200, costMax:600},
  {name:'Wind Turbine',      emoji:'🌬️',category:'energy',    yieldLbs:0,  waterGal:0,   co2:500, costMin:500, costMax:2000},
  // -- Soil -----------------------------------------------
  {name:'Cold Frame',        emoji:'🪟',category:'soil',       yieldLbs:25, waterGal:20,  co2:6,   costMin:40,  costMax:120},
  {name:'Compost Bin',       emoji:'♻️',category:'soil',       yieldLbs:0,  waterGal:0,   co2:40,  costMin:40,  costMax:100},
  {name:'Cover Crops',       emoji:'🌾',category:'soil',       yieldLbs:0,  waterGal:80,  co2:25,  costMin:10,  costMax:40},
  {name:'Hugelkultur',       emoji:'🌲',category:'soil',       yieldLbs:50, waterGal:200, co2:30,  costMin:50,  costMax:200},
  {name:'Mulch Zone',        emoji:'🍂',category:'soil',       yieldLbs:0,  waterGal:500, co2:18,  costMin:20,  costMax:60},
  {name:'Worm Bin',          emoji:'🪱',category:'soil',       yieldLbs:35, waterGal:0,   co2:20,  costMin:50,  costMax:150},
  // -- Biodiversity ---------------------------------------
  {name:'Bat Box',           emoji:'🦇',category:'biodiversity',yieldLbs:0, waterGal:0,   co2:3,   costMin:20,  costMax:60},
  {name:'Beehive',           emoji:'🐝',category:'biodiversity',yieldLbs:30,waterGal:0,   co2:8,   costMin:200, costMax:600},
  {name:'Bird House',        emoji:'🐦',category:'biodiversity',yieldLbs:0, waterGal:0,   co2:5,   costMin:30,  costMax:80},
  {name:'Hedgerow',          emoji:'🌴',category:'biodiversity',yieldLbs:5, waterGal:20,  co2:22,  costMin:60,  costMax:200},
  {name:'Insect Hotel',      emoji:'🐛',category:'biodiversity',yieldLbs:0, waterGal:0,   co2:4,   costMin:15,  costMax:50},
  {name:'Native Plants',     emoji:'🌺',category:'biodiversity',yieldLbs:0, waterGal:8,   co2:8,   costMin:40,  costMax:120},
  {name:'Pollinator Patch',  emoji:'🌼',category:'biodiversity',yieldLbs:0, waterGal:10,  co2:10,  costMin:60,  costMax:120},
  {name:'Wildlife Pond',     emoji:'🪷',category:'biodiversity',yieldLbs:0, waterGal:500, co2:12,  costMin:200, costMax:800},
  // -- Animals --------------------------------------------
  {name:'Chicken Coop',      emoji:'🐔',category:'animals',    yieldLbs:130,waterGal:0,   co2:15,  costMin:300, costMax:800},
  {name:'Duck House',        emoji:'🦆',category:'animals',    yieldLbs:80, waterGal:0,   co2:12,  costMin:250, costMax:700},
  {name:'Goat Pen',          emoji:'🐐',category:'animals',    yieldLbs:300,waterGal:0,   co2:25,  costMin:500, costMax:1500},
  {name:'Pig Run',           emoji:'🐖',category:'animals',    yieldLbs:200,waterGal:0,   co2:20,  costMin:400, costMax:1200},
  {name:'Rabbit Hutch',      emoji:'🐇',category:'animals',    yieldLbs:40, waterGal:0,   co2:10,  costMin:150, costMax:400},
  // -- Flowers --------------------------------------------
  {name:'Borage',            emoji:'💙',category:'flowers',    yieldLbs:2,  waterGal:10,  co2:4,   costMin:3,   costMax:10},
  {name:'Calendula',         emoji:'🌻',category:'flowers',    yieldLbs:1,  waterGal:8,   co2:3,   costMin:3,   costMax:10},
  {name:'Chamomile',         emoji:'🌸',category:'flowers',    yieldLbs:2,  waterGal:8,   co2:3,   costMin:4,   costMax:12},
  {name:'Cosmos',            emoji:'✿',category:'flowers',    yieldLbs:0,  waterGal:8,   co2:3,   costMin:2,   costMax:8},
  {name:'Dahlias',           emoji:'🏵️',category:'flowers',   yieldLbs:1,  waterGal:14,  co2:4,   costMin:8,   costMax:25},
  {name:'Echinacea',         emoji:'🌟',category:'flowers',    yieldLbs:1,  waterGal:10,  co2:5,   costMin:6,   costMax:18},
  {name:'Foxglove',          emoji:'🔔',category:'flowers',    yieldLbs:0,  waterGal:12,  co2:5,   costMin:5,   costMax:15},
  {name:'Lavender',          emoji:'💜',category:'flowers',    yieldLbs:2,  waterGal:8,   co2:5,   costMin:8,   costMax:25},
  {name:'Lupins',            emoji:'🫧',category:'flowers',    yieldLbs:0,  waterGal:14,  co2:8,   costMin:5,   costMax:15},
  {name:'Marigolds',         emoji:'🟠',category:'flowers',    yieldLbs:0,  waterGal:8,   co2:3,   costMin:3,   costMax:10},
  {name:'Nasturtium',        emoji:'🧡',category:'flowers',    yieldLbs:2,  waterGal:8,   co2:3,   costMin:2,   costMax:8},
  {name:'Peonies',           emoji:'🪻',category:'flowers',    yieldLbs:0,  waterGal:14,  co2:5,   costMin:12,  costMax:35},
  {name:'Roses',             emoji:'🌹',category:'flowers',    yieldLbs:1,  waterGal:12,  co2:5,   costMin:10,  costMax:35},
  {name:'Sunflowers',        emoji:'🌞',category:'flowers',    yieldLbs:3,  waterGal:12,  co2:6,   costMin:3,   costMax:10},
  {name:'Sweet Peas',        emoji:'💐',category:'food',       yieldLbs:10, waterGal:12,  co2:3,   costMin:3,   costMax:10},
  {name:'Tulips',            emoji:'🌷',category:'flowers',    yieldLbs:0,  waterGal:10,  co2:4,   costMin:5,   costMax:20},
  {name:'Wildflower Mix',    emoji:'🌈',category:'flowers',    yieldLbs:0,  waterGal:8,   co2:10,  costMin:5,   costMax:20},
  {name:'Zinnias',           emoji:'🌠',category:'flowers',    yieldLbs:0,  waterGal:10,  co2:3,   costMin:3,   costMax:10},
];

const CAT_COLOR: Record<string,string> = {
  food:'#00ffaa', water:'#00e5ff', energy:'#ffb340',
  soil:'#c8a060', biodiversity:'#c8ff64', animals:'#ff9060', flowers:'#ff80ab',
};

/* Pre-computed O(1) lookup map -- avoids repeated .find() scans on every render */
const ICON_LOOKUP = new Map(iconLibrary.map(i=>[i.emoji,i]));
// Module-level: the emoji being dragged from the library right now.
// Written in onDragStart, read in onDrop — never stale, no closure.
let _draggedEmoji='';
let _isDraggingFromLibrary=false; // true while user drags from feature library

const CONFLICTS: Record<string,string[]> = {
  '🐔':['🌱','🌼','🐝'], '🐝':['🌬️','🦆'], '🌊':['🥔','🥕','🌱'],
  '🐐':['🌳','🌱'], '🐖':['🌱','🌳','🥔','🥕'], '🐇':['🌱','🌼','🌿'],
  '🦆':['🌱'],
};

const CONFLICT_REASONS: Record<string,string> = {
  '🐔🌱': 'Chickens scratch and destroy raised beds. Keep them separated with fencing, or use a mobile chicken tractor that rotates away from growing beds.',
  '🐔🌼': 'Chickens eat and trample pollinator flowers before they can establish. Place pollinator patches in chicken-free zones with at least 6 ft of separation.',
  '🐔🐝': 'Chickens will knock over hives and disturb foraging bees near the hive entrance. Keep beehives at least 30 ft from any chicken run.',
  '🐝🌬️': 'Wind turbine vibration travels through the ground and stresses bee colonies, causing disorientation and potential abandonment. Site hives at least 50 ft away, upwind of the turbine.',
  '🐝🦆': 'Ducks actively hunt and eat bees near the hive entrance. Keep ducks at least 40 ft from any beehive and use barriers to block line of sight.',
  '🌊🥔': 'Swales create waterlogged soil. Potatoes rot quickly in saturated conditions — plant them upslope or in raised mounds well above the swale line.',
  '🌊🥕': 'Carrots split and fork in waterlogged soil near swales. Plant root vegetables at least 8 ft from swale edges where drainage is good.',
  '🌊🌱': 'Raised beds downhill of a swale risk waterlogging. Position beds upslope of swales or ensure at least 10 ft separation with well-drained pathways between.',
  '🐐🌳': 'Goats strip bark from fruit trees and can kill established trees within hours. Protect all trees with sturdy wire guards or keep goats in a separate paddock.',
  '🐐🌱': 'Goats will eat raised bed contents over fences. Use solid 5 ft fencing around all growing areas and keep goats in a clearly separated zone.',
  '🐖🌱': 'Pigs root up soil and destroy raised bed structure. Keep pigs in a defined paddock with electric fencing well away from all growing beds.',
  '🐖🌳': 'Pigs strip bark and root around the base of trees, killing them within a season. Protect all fruit trees with sturdy wire guards or keep pigs in a separate paddock.',
  '🐖🥔': 'Pigs will root up and eat potato beds enthusiastically. Plant potatoes in a pig-free zone or use them intentionally to let pigs clear a patch.',
  '🐖🥕': 'Pigs root up and eat root vegetables on sight. Keep all root crops in a fully fenced zone away from any pig access.',
  '🐇🌱': 'Rabbits will eat raised bed contents down to the soil. Use solid fencing with a buried skirt (6 in underground) around all growing beds.',
  '🐇🌼': 'Rabbits graze pollinator flowers to the ground. Fence pollinator patches or place them in a rabbit-proof zone.',
  '🐇🌿': 'Rabbits eat herbs immediately. Grow herbs in raised beds with solid rabbit-proof fencing or in containers elevated off the ground.',
  '🦆🌱': 'Ducks eat seedlings and disturb raised bed soil while foraging. Keep ducks out of growing areas until plants are well established and use fencing.',
};
function getConflictReason(a: string, b: string): string {
  return CONFLICT_REASONS[a+b] ?? CONFLICT_REASONS[b+a] ?? 'These features can interfere with each other. Consider separating them or adjusting placement for best results.';
}

/* ==== COMPANION PLANTING DATA ==== */
// [emojiA, emojiB, benefit description]
const COMPANIONS: [string,string,string][] = [
  ['🍅','🌿','Basil repels aphids and whitefly from tomatoes, and many gardeners report improved tomato flavour when planted within 18 inches.'],
  ['🍅','🥕','Carrots loosen soil around tomato roots and attract predatory wasps that control tomato hornworm.'],
  ['🥕','🧅','Onions repel carrot fly, while carrots deter onion fly — a classic mutual protection partnership.'],
  ['🥬','🧄','Garlic deters aphids, slugs, and spider mites from leafy greens. Plant at bed edges for perimeter protection.'],
  ['🥦','🌿','Herbs in the mint family (including basil) repel cabbage white butterfly from brassicas like broccoli.'],
  ['🥒','🌼','Nasturtiums act as a trap crop for aphids and attract pollinators that boost cucumber fruit set by up to 30%.'],
  ['🌽','🫘','Beans fix nitrogen into the soil that feeds corn. Traditionally grown together in the "Three Sisters" alongside squash.'],
  ['🌽','🎃','Pumpkin leaves shade the soil around corn, suppressing weeds and retaining moisture — the third "Three Sister."'],
  ['🫘','🎃','Beans fix nitrogen that benefits pumpkin heavy feeding, while pumpkin ground cover protects bean roots from heat.'],
  ['🍓','🧄','Garlic planted around strawberry beds suppresses botrytis (grey mould) and deters slugs significantly.'],
  ['🍅','🌼','Pollinator patches near tomatoes increase fruit set by 20–40% through improved bee visitation rates.'],
  ['🥕','🌿','Rosemary and sage near carrots confuse carrot fly with aromatic oils, reducing pest pressure.'],
  ['🥬','🥦','Inter-planting brassicas with leafy greens maximizes bed efficiency — greens mature before brassicas need full space.'],
  ['🍅','🥬','Lettuce and spinach planted under tomatoes benefit from the shade, extending their season into summer heat.'],
  ['🥕','🥬','Fast-growing lettuce fills gaps between slow-growing carrots, suppressing weeds naturally.'],
  ['🧄','🌼','Garlic planted at the edges of pollinator patches deters deer and rabbits without affecting beneficial insects.'],
  ['🫘','🥕','Beans and carrots grow at different soil depths, avoiding competition while beans add nitrogen for carrot growth.'],
  ['🎃','🌼','Pumpkin and squash flowers attract specialist squash bees, and nearby pollinator patches increase yield significantly.'],
  ['🥔','🫘','Beans fix nitrogen that potatoes crave, reducing fertiliser needs. Keep well separated to avoid disease spread.'],
  ['🌽','🌼','Pollinator patches near corn improve pollination completeness, reducing blank spots on the cob.'],
];

function getCompanions(emoji: string): {partner: string; benefit: string}[] {
  return COMPANIONS
    .filter(([a,b])=>a===emoji||b===emoji)
    .map(([a,b,benefit])=>({partner: a===emoji?b:a, benefit}));
}

function getPositivePairs(icons: string[]): {icons:[string,string]; benefit:string}[] {
  const set = new Set(icons);
  const found: {icons:[string,string]; benefit:string}[] = [];
  const seen = new Set<string>();
  COMPANIONS.forEach(([a,b,benefit])=>{
    if(set.has(a)&&set.has(b)){
      const key=[a,b].sort().join('');
      if(!seen.has(key)){seen.add(key);found.push({icons:[a,b],benefit});}
    }
  });
  return found;
}

/* ==== KEYWORD MAP ==== */
const KEYWORD_MAP: {keywords:string[];emoji:string}[] = [
  {keywords:['rain tank','rainwater','water collection','water barrel','water butt'],emoji:'💧'},
  {keywords:['cistern','water storage','large tank'],emoji:'🪣'},
  {keywords:['rain garden','bioswale','rain bed'],emoji:'🌧️'},
  {keywords:['drip irrigation','irrigation','drip system','watering system'],emoji:'🚿'},
  {keywords:['solar panel','solar energy','solar power','photovoltaic','pv panel','pv system'],emoji:'☀️'},
  {keywords:['solar battery','battery storage','energy storage','battery backup','battery'],emoji:'🔋'},
  {keywords:['solar pump','water pump'],emoji:'⚡'},
  {keywords:['wind','turbine','windmill'],emoji:'🌬️'},
  {keywords:['compost','composting','compost bin'],emoji:'♻️'},
  {keywords:['worm bin','vermicompost','worms','worm farm'],emoji:'🪱'},
  {keywords:['cover crop','green manure','nitrogen fixer'],emoji:'🌾'},
  {keywords:['green crop','green crops','leafy crop','greens','salad greens','salad crops'],emoji:'🥬'},
  {keywords:['flower','flowers','flowering plant','blooms'],emoji:'🌼'},
  {keywords:['herb','herbs','herb garden'],emoji:'🌿'},
  {keywords:['mulch','mulching','wood chip','bark chip'],emoji:'🍂'},
  {keywords:['cold frame','season extender','cloche'],emoji:'🪟'},
  {keywords:['hugelkultur','hugel','wood mound'],emoji:'🌲'},
  {keywords:['herb','basil','mint','rosemary','thyme','oregano','parsley'],emoji:'🌿'},
  {keywords:['herb spiral'],emoji:'🌿'},
  {keywords:['fresh herbs','cooking herbs','culinary herbs','chives','cilantro','dill','sage'],emoji:'🫒'},
  {keywords:['raised bed','garden bed','planter box'],emoji:'🌱'},
  {keywords:['greenhouse','hoophouse','poly tunnel','polytunnel'],emoji:'🏡'},
  {keywords:['tomato','tomatoes'],emoji:'🍅'},
  {keywords:['carrot','carrots'],emoji:'🥕'},
  {keywords:['kale'],emoji:'🥬'},
  {keywords:['lettuce','salad','leafy greens'],emoji:'🫛'},
  {keywords:['spinach'],emoji:'🍀'},
  {keywords:['chard','silverbeet','swiss chard'],emoji:'🍃'},
  {keywords:['pepper','peppers','chili','chilli','capsicum'],emoji:'🌶️'},
  {keywords:['corn','maize','sweetcorn'],emoji:'🌽'},
  {keywords:['cucumber','cucumbers'],emoji:'🥒'},
  {keywords:['eggplant','aubergine'],emoji:'🍆'},
  {keywords:['garlic'],emoji:'🧄'},
  {keywords:['onion','onions','leek','leeks','shallot'],emoji:'🧅'},
  {keywords:['potato','potatoes'],emoji:'🥔'},
  {keywords:['pumpkin','winter squash'],emoji:'🎃'},
  {keywords:['zucchini','courgette','summer squash'],emoji:'🫑'},
  {keywords:['squash'],emoji:'🎃'},
  {keywords:['beans','legume'],emoji:'🫘'},
  {keywords:['peas','pea'],emoji:'🫘'},
  {keywords:['radish','radishes'],emoji:'🔴'},
  {keywords:['sweet potato','yam','kumara'],emoji:'🍠'},
  {keywords:['broccoli'],emoji:'🥦'},
  {keywords:['cabbage'],emoji:'🥗'},
  {keywords:['celery'],emoji:'🪴'},
  {keywords:['asparagus'],emoji:'🌵'},
  {keywords:['fruit tree','orchard','food forest','food forest tree','fruit orchard'],emoji:'🌳'}, // resolved to climate tree at placement,
  {keywords:['apple tree','apple'],emoji:'🍎'},
  {keywords:['avocado'],emoji:'🥑'},
  {keywords:['banana'],emoji:'🍌'},
  {keywords:['berry bush','blackcurrant','currant','gooseberry','berries','berry plants','berry'],emoji:'🍁'},
  {keywords:['blueberry','blueberries'],emoji:'🫐'},
  {keywords:['fig','figs'],emoji:'🍄'},
  {keywords:['grape','grapes','vine','grapevine'],emoji:'🍇'},
  {keywords:['lemon','lime','citrus'],emoji:'🍋'},
  {keywords:['mango'],emoji:'🥭'},
  {keywords:['peach','nectarine'],emoji:'🍑'},
  {keywords:['pear','pears'],emoji:'🍐'},
  {keywords:['plum','plums','damson'],emoji:'🫚'},
  {keywords:['raspberry','raspberries'],emoji:'🍒'},
  {keywords:['strawberry','strawberries'],emoji:'🍓'},
  {keywords:['watermelon'],emoji:'🍉'},
  {keywords:['cantaloupe','melon','honeydew'],emoji:'🍈'},
  {keywords:['pineapple'],emoji:'🍍'},
  {keywords:['pond','fish pond','aquaponics','water feature','fish pond','water garden'],emoji:'🐟'},
  {keywords:['swale','earthwork','water contour','land shaping','on contour'],emoji:'🌊'},
  {keywords:['wildlife pond'],emoji:'🪷'},
  {keywords:['chicken','hen','poultry','egg','coop'],emoji:'🐔'},
  {keywords:['duck','ducks'],emoji:'🦆'},
  {keywords:['goat','goats'],emoji:'🐐'},
  {keywords:['pig','pigs'],emoji:'🐖'},
  {keywords:['rabbit','rabbits'],emoji:'🐇'},
  {keywords:['bee','beehive','honey','apiary'],emoji:'🐝'},
  {keywords:['bat box','bat house','bats'],emoji:'🦇'},
  {keywords:['bird house','bird box','birds'],emoji:'🐦'},
  {keywords:['insect hotel','bug hotel','insect house'],emoji:'🐛'},
  {keywords:['pollinator','wildflower','butterfly garden'],emoji:'🌼'},
  {keywords:['native plant','native plants','natives'],emoji:'🌺'},
  {keywords:['hedgerow','hedge'],emoji:'🌴'},
  // -- Flowers --------------------------------------------------
  {keywords:['borage','starflower'],emoji:'💙'},
  {keywords:['calendula','pot marigold'],emoji:'🌻'},
  {keywords:['chamomile','camomile'],emoji:'🌸'},
  {keywords:['cosmos flower','cosmos'],emoji:'✿'},
  {keywords:['dahlia','dahlias'],emoji:'🏵️'},
  {keywords:['echinacea','coneflower','purple coneflower'],emoji:'🌟'},
  {keywords:['foxglove','digitalis'],emoji:'🔔'},
  {keywords:['lavender'],emoji:'💜'},
  {keywords:['lupin','lupine','lupins'],emoji:'🫧'},
  {keywords:['marigold','marigolds','french marigold'],emoji:'🟠'},
  {keywords:['nasturtium'],emoji:'🧡'},
  {keywords:['peony','peonies'],emoji:'🪻'},
  {keywords:['rose','roses'],emoji:'🌹'},
  {keywords:['sunflower','sunflowers'],emoji:'🌞'},
  {keywords:['sweet pea','sweet peas'],emoji:'💐'},
  {keywords:['tulip','tulips'],emoji:'🌷'},
  {keywords:['wildflower mix','meadow mix','flower meadow'],emoji:'🌈'},
  {keywords:['zinnia','zinnias'],emoji:'🌠'},
];

function extractEmojisFromPrompt(prompt: string): string[] {
  if (!prompt) return [];
  const lower = prompt.toLowerCase();
  // Quantity words that can precede a keyword
  const WORD_NUMS:Record<string,number>={
    one:1,two:2,three:3,four:4,five:5,six:6,seven:7,eight:8,nine:9,ten:10,
    eleven:11,twelve:12,a:1,an:1,some:2,few:3,'a few':3,several:4,couple:2,'a couple':2,
  };
  const getQty=(before:string):number=>{
    const t=before.trimEnd();
    // Check for digit(s) immediately before the keyword
    const dig=t.match(/(\d+)\s*$/);
    if(dig)return Math.min(parseInt(dig[1]),12);
    // Check for written number words at the end of the preceding text
    for(const [w,n] of Object.entries(WORD_NUMS)){
      if(t===w||t.endsWith(' '+w))return n;
    }
    return 1;
  };
  const found:string[]=[];
  // Track which emojis have already been matched — prevents duplicate entries firing twice
  const matched=new Set<string>();
  KEYWORD_MAP.forEach(({keywords,emoji})=>{
    if(matched.has(emoji))return; // skip if this emoji already matched a previous entry
    for(const k of keywords){
      // Use smart word-boundary: keyword must not be preceded or followed by a letter
      // This prevents 'pea' matching 'pear', 'peach', 'pineapple'→apple, etc.
      const pattern=new RegExp('(?<![a-z])'+k.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'(?:s|es)?(?![a-z])');
      const match=pattern.exec(lower);
      if(!match)continue;
      const qty=getQty(lower.slice(0,match.index));
      for(let i=0;i<qty;i++)found.push(emoji);
      matched.add(emoji);
      break; // first matching keyword wins per entry
    }
  });
  return found;
}

/* ==== CALCULATION ENGINE ==== */
const FOOD_NEED = 600;
const WATER_BASE = 30000;

interface CalcResult {
  totalYieldLbs: number; totalWaterGal: number; totalCo2Lbs: number;
  foodSelfSufficiencyPct: number; waterSavingsPct: number;
  estimatedCostMin: number; estimatedCostMax: number;
  resilienceScore: number; biodiversityScore: number;
  year1Savings: number; paybackYears: number;
  foodSavings: number; // actual food+animal savings using per-category rates
  featureBreakdown: {emoji:string;name:string;yieldLbs:number;waterGal:number;co2:number;count:number}[];
}

function calculateFromTiles(tiles:{id:number;icon:string}[], familySize:number, climateZone?:string): CalcResult {
  familySize=Math.max(1,familySize||1);
  const climateMult=climateZone==='Tropical'?1.45:climateZone==='Subtropical'?1.3:climateZone==='Arid'?0.7:climateZone==='Cold'?0.8:1.0;
  const emojis = tiles.map(t=>t.icon);
  let totalYield=0,totalWater=0,totalCo2=0,costMin=0,costMax=0;
  const breakdown:any[]=[];
  const seen=new Map<string,any>();
  emojis.forEach(em=>{
    const f=ICON_LOOKUP.get(em); if(!f) return;
    totalYield+=Math.round(f.yieldLbs*climateMult); totalWater+=Math.round(f.waterGal*climateMult); totalCo2+=Math.round(f.co2*climateMult);
    // Use midpoint cost for both min and max — gives a single accurate figure
    // instead of a wide range that can mislead users about their budget
    const mid=Math.round((f.costMin+f.costMax)/2);
    costMin+=mid; costMax+=mid;
    const existing=seen.get(em);
    if(!existing){const entry={emoji:em,name:f.name,yieldLbs:f.yieldLbs,waterGal:f.waterGal,co2:f.co2,count:1};breakdown.push(entry);seen.set(em,entry);}
    else{existing.count++;}
  });
  const foodNeed=FOOD_NEED*familySize;
  const foodPct=Math.min(100,Math.round((totalYield/foodNeed)*100));
  const waterBase=WATER_BASE*(familySize/4);
  const waterPct=Math.min(100,Math.round((totalWater/waterBase)*100));
  const cats=new Set(emojis.map(em=>ICON_LOOKUP.get(em)?.category).filter(Boolean));
  const resilience=Math.min(98,Math.round(
    Math.min(30,cats.size*5)+Math.min(22,(foodPct/100)*22)+
    Math.min(18,(waterPct/100)*18)+Math.min(15,(Math.min(totalCo2,600)/600)*15)+
    (emojis.some(e=>['☀️','🌬️','🔋','⚡'].includes(e))?8:0)+Math.min(5,(new Set(emojis).size/12)*5)
  ));
  const bioIcons=new Set(emojis.filter(e=>['🌼','🐝','🦇','🐛','🐦','🌺','🪷','🌴'].includes(e)));
  const animalBioBonus=emojis.some(e=>['🐔','🦆','🐇','🐐','🐖'].includes(e))?10:0;
  const biodiversity=Math.min(100,bioIcons.size*16+(cats.has('biodiversity')?20:0)+animalBioBonus);
  // Animal products command much higher retail value than produce ($0.80/lb)
  // Eggs: ~$0.35/egg retail; Dairy: ~$1.25/lb; Meat: ~$3-5/lb; Honey: ~$8/lb
  // We use per-category blended rates for accurate savings
  const ANIMAL_RATE:Record<string,number>={'🐔':3.30,'🦆':3.30,'🐐':1.25,'🐖':3.00,'🐇':3.00,'🐝':8.00};
  const animalSavings=emojis.reduce((sum,em)=>{
    const rate=ANIMAL_RATE[em];
    if(!rate)return sum;
    const f=ICON_LOOKUP.get(em);
    return sum+(f?.yieldLbs??0)*rate;
  },0);
  const produceSavings=emojis.reduce((sum,em)=>{
    if(ANIMAL_RATE[em])return sum; // handled above
    const f=ICON_LOOKUP.get(em);
    return sum+(f?.yieldLbs??0)*0.8;
  },0);
  const energySavings = emojis.filter(e=>['☀️','🌬️'].includes(e)).length * 200
    + emojis.filter(e=>e==='🔋').length * 120
    + emojis.filter(e=>e==='⚡').length * 60;
  const year1Savings=Math.round(produceSavings+animalSavings+totalWater*0.005+totalCo2*0.023+energySavings);
  const avgCost=Math.round((costMin+costMax)/2);
  const payback=year1Savings>0?Math.round((avgCost/year1Savings)*10)/10:0;
  return {totalYieldLbs:totalYield,totalWaterGal:totalWater,totalCo2Lbs:totalCo2,
    foodSelfSufficiencyPct:foodPct,waterSavingsPct:waterPct,estimatedCostMin:costMin,
    estimatedCostMax:costMax,resilienceScore:resilience,biodiversityScore:biodiversity,
    year1Savings,paybackYears:payback,foodSavings:Math.round(produceSavings+animalSavings),featureBreakdown:breakdown};
}

/* ==== IMPROVEMENT TIPS ==== */
interface Tip{label:string;emoji:string;impact:string;example:string}
function getImprovementTips(calc:CalcResult,tiles:{id:number;icon:string}[]):Record<string,Tip[]>{
  const emojis=tiles.map(t=>t.icon);
  const tips:Record<string,Tip[]>={};
  if(calc.foodSelfSufficiencyPct<100){
    const t:Tip[]=[];
    if(!emojis.includes('🏡'))t.push({label:'Add a Greenhouse',emoji:'🏡',impact:'+15–25% yield',example:'Extends growing season 3–4 months, enabling year-round lettuce, tomatoes, and herbs.'});
    if(!emojis.some(e=>['🍎','🍋','🍑','🍐','🥭','🍌','🍄','🫚','🍊','🍒','🥑'].includes(e)))t.push({label:'Plant Fruit Trees',emoji:'🍎',impact:'+60–120 lbs/yr each',example:'A mature apple tree produces 60–120 lbs annually and lives 50–80 years. Choose variety by climate zone.'});
    if(!emojis.includes('🌱'))t.push({label:'Add Raised Beds',emoji:'🌱',impact:'+40 lbs each',example:'A 4×8 ft raised bed yields ~40 lbs/season. Three beds = 5% self-sufficiency per person.'});
    if(emojis.filter(e=>['🍅','🥕','🥬','🫛','🍀','🌽','🥔'].includes(e)).length<3)t.push({label:'Diversify Crops',emoji:'🍅',impact:'+10–30 lbs per variety',example:'Mixing tomatoes, carrots, and leafy greens ensures harvest spring through fall.'});
    tips['Food Self-Sufficiency']=t.slice(0,3);
    tips['Annual Yield (lbs)']=t.slice(0,3);
  }
  if(calc.waterSavingsPct<30){
    const t:Tip[]=[];
    if(!emojis.includes('💧'))t.push({label:'Install Rain Tank',emoji:'💧',impact:'+4,000 gal/yr',example:'A 500-gal tank on a 1,000 sq ft roof captures ~4,000 gal/yr in temperate climate.'});
    if(!emojis.includes('🌊'))t.push({label:'Dig a Swale',emoji:'🌊',impact:'+8,000 gal/yr',example:'A 20-ft on-contour swale passively irrigates plants for weeks after each rain event.'});
    if(!emojis.includes('🐟'))t.push({label:'Add a Pond',emoji:'🐟',impact:'+5,000 gal/yr',example:'A 500-gal pond acts as an irrigation reservoir and reduces site runoff by 80%.'});
    tips['Water Saved']=t.slice(0,3);
  }
  if(calc.totalCo2Lbs<200){
    tips['CO₂ Sequestered']=[
      {label:'Plant Fruit Trees',emoji:'🍎',impact:'+40–65 lbs CO₂/yr each',example:'3 fruit trees = ~180 lbs CO₂/yr — equivalent to driving 235 fewer miles annually.'},
      {label:'Add Compost Bin',emoji:'♻️',impact:'+40 lbs CO₂/yr',example:'Composting diverts methane from landfills and builds soil carbon. One bin processes 200 lbs waste/yr.'},
    ];
  }
  if(calc.biodiversityScore<50){
    tips['Biodiversity Score']=[
      {label:'Pollinator Patch',emoji:'🌼',impact:'+16 pts',example:'10 sq ft of native wildflowers supports 50+ pollinator species and boosts yields 15–30%.'},
      {label:'Install Beehive',emoji:'🐝',impact:'+16 pts',example:'One hive pollinates 300M flowers/day. Honey yield: 20–60 lbs/year worth $100–300.'},
      {label:'Add Bat Box',emoji:'🦇',impact:'+16 pts',example:'One bat eats 1,000+ insects/night — 90% of moth pest pressure eliminated, free of charge.'},
    ];
  }
  if(calc.year1Savings<500){
    const t:Tip[]=[];
    if(!emojis.includes('☀️'))t.push({label:'Add Solar Panel',emoji:'☀️',impact:'+~$200/yr',example:'A 1kW solar starter system (2–3 panels) offsets ~$200/yr in electricity costs at average US rates.'});
    if(!emojis.some(e=>['🍎','🍋','🍑','🍐','🥭','🍌','🍄','🫚','🍊','🍒','🥑'].includes(e)))t.push({label:'Plant Fruit Trees',emoji:'🍎',impact:'+$50–100/yr each',example:'A mature apple tree produces $48–96 food value + CO₂ credits per year for 50+ years.'});
    if(!emojis.includes('🌬️'))t.push({label:'Add Wind Turbine',emoji:'🌬️',impact:'+~$212/yr',example:'Wind turbine offsets ~$200/yr in electricity plus $11.50 in CO₂ credits — best in exposed locations.'});
    tips['Year 1 Savings']=t.slice(0,3);
  }
  if(calc.paybackYears>8&&calc.paybackYears>0){
    const t:Tip[]=[];
    if(!emojis.includes('♻️'))t.push({label:'Add Compost Bin',emoji:'♻️',impact:'Fastest payback: ~2 yrs',example:'At $70 avg cost, compost produces ~$33/yr in fertiliser savings and CO₂ credits — paying back in just 2 years.'});
    if(!emojis.includes('🌱'))t.push({label:'Add Raised Bed',emoji:'🌱',impact:'Payback ~3 yrs',example:'A $115 raised bed yielding $33/yr pays back in ~3.5 yrs — one of the quickest returns in the system.'});
    tips['Payback Period']=t.slice(0,3);
  }
  if(calc.resilienceScore<60){
    const t:Tip[]=[];
    t.push({label:'Balance all categories',emoji:'⚖️',impact:'+5 pts per new category',example:'Each new category — food, water, energy, soil, biodiversity, animals, or flowers — adds 5 pts to your score (up to 30 pts total).'});
    if(!emojis.some(e=>['☀️','🌬️','🔋','⚡'].includes(e)))
      t.push({label:'Add Solar Panel',emoji:'☀️',impact:'+8 pts',example:'A 1kW solar system covers ~15% of average home electricity needs and adds the full 8-point energy bonus to your Regen Score.'});
    tips['Regeneration Score']=t;
  }
  return tips;
}

/* ==== FEATURE DB ==== */
const featureDB:Record<string,{time:string;cost:string;difficulty:string;roi:string;example:string;steps:string[]}> = {
  '🌱':{time:'2–4 hrs',cost:'$80–150',difficulty:'Easy',roi:'High',
    example:'A 4x8 ft raised bed filled with quality mix yields 40–80 lbs of vegetables per season. Extending life to 10+ years with annual compost top-dressing makes it one of the best ROI features on any homestead.',
    steps:['Choose a level sunny spot with 6+ hours of direct sun','Build from untreated cedar, pine, or galvanised metal — avoid pressure-treated wood near food','Fill with 60% topsoil, 30% compost, 10% perlite for drainage','Install drip irrigation or soaker hose before planting','Top-dress with 2 in of compost every spring','Rotate crop families each season to prevent soil disease buildup']},
  '🏡':{time:'3–5 days',cost:'$800–3,500',difficulty:'Hard',roi:'Very High',
    example:'A 10x12 ft unheated hoop house extends your growing season by 8–12 weeks in cold climates, allowing year-round lettuce, spinach, and herbs. In temperate zones, a heated greenhouse enables tropical crops like tomatoes through winter.',
    steps:['Orient ridge east-to-west for maximum winter sun exposure','Use polycarbonate twin-wall panels — better insulation than single-layer poly','Install a thermometer and automatic vent opener for temperature regulation','Add thermal mass (water barrels or stone) to buffer overnight temperature drops','Use raised beds inside to improve drainage and soil warmth','Ventilate aggressively in summer to prevent overheating above 95°F']},
  '🌿':{time:'3–4 hrs',cost:'$60–120',difficulty:'Easy',roi:'Very High',
    example:'A herb spiral packs 20+ herb varieties into 6 sq ft by creating microclimates — dry Mediterranean herbs at the top, moisture-loving mint at the base. Fresh culinary herbs save $30–80/month on grocery bills.',
    steps:['Build a spiral 3 ft tall and 6 ft diameter using stone, brick, or timber','Fill top zones with gravel-rich mix for rosemary, thyme, oregano','Use standard mix in mid-zones for basil, parsley, chives, sage','Plant moisture-lovers (mint, lemon balm, chervil) at the base near a small pond if possible','Harvest regularly — cutting above a leaf node encourages bushier growth','Divide clumps every 2–3 years to maintain vigour']},
  '🌵':{time:'2–3 hrs',cost:'$15–35',difficulty:'Medium',roi:'Medium',
    example:'Asparagus is a 25-year perennial investment. A bed of 20 crowns produces 8–12 lbs annually once established in year 3. Annual value: $60–100 in fresh spears.',
    steps:['Prepare a permanent bed — asparagus will grow in the same spot for 20+ years','Dig 12-inch-deep trenches and amend heavily with compost','Plant crowns 18 inches apart, 6 inches deep, roots spread wide','Do not harvest the first two years — let ferns grow to build root energy','Harvest spears in year 3 when they are pencil-thick and 6–8 inches tall','Cut back brown ferns in late autumn and top-dress with compost']},
  '🫘':{time:'1–2 hrs',cost:'$3–10',difficulty:'Easy',roi:'High',
    example:'Beans are nitrogen-fixing cover croppers and food producers in one. A 10 ft row of climbing beans produces 8–15 lbs through summer. They enrich the soil for the next crop planted after them.',
    steps:['Sow direct into warm soil (above 15C) after last frost — do not transplant','Provide a trellis, bamboo frame, or string for climbing varieties','Inoculate seeds with rhizobium bacteria powder for maximum nitrogen fixation','Water consistently — irregular watering causes pods to become stringy','Harvest pods young and regularly to keep plants producing','At season end, cut plants at ground level and leave roots to decompose, releasing nitrogen']},
  '🥦':{time:'1–2 hrs',cost:'$4–12',difficulty:'Medium',roi:'High',
    example:'Broccoli is one of the most calorie-dense vegetables per sq ft. One plant produces a main head plus 6–10 weeks of side shoots. A 4x4 bed of 8 plants yields 10–16 lbs per season.',
    steps:['Start indoors 6–8 weeks before last frost or direct sow in late summer for autumn crop','Transplant at 4–6 leaf stage into deeply composted soil','Feed with nitrogen-rich fertiliser at transplant and again 3 weeks later','Harvest main head before any yellow flowers appear — cut at a slant to shed water','Leave stem in ground — side shoots will continue producing for weeks','Control cabbage moths with fine mesh netting or Bt spray']},
  '🥗':{time:'1–2 hrs',cost:'$3–8',difficulty:'Easy',roi:'High',
    example:'Cabbage stores for 3–6 months in a cool shed, making it a key winter food security crop. A row of 10 plants produces 20–40 lbs of heads, worth $40–80 at market rates.',
    steps:['Start indoors 6 weeks before transplant date or direct sow in cool weather','Space 18 inches apart — tight spacing produces smaller but still usable heads','Keep soil consistently moist — dry spells cause heads to crack when rain returns','Apply collar around stem base to deter cabbage root fly','Harvest when head feels solid and dense when squeezed','Store unwashed in a cool, humid cellar — heads last months this way']},
  '🥕':{time:'1 hr',cost:'$2–6',difficulty:'Easy',roi:'High',
    example:'Carrots in deep, loose, stone-free soil yield 15–25 lbs per 4 ft row. Heritage and coloured varieties fetch $4–6/lb at farmers markets. Storage carrots last 4–6 months in sand-filled crates.',
    steps:['Prepare soil by digging 12 inches deep and removing all stones — obstructions cause forked roots','Mix in sharp sand for drainage and aeration, not fresh manure (causes forking)','Sow seed thinly direct — do not transplant','Thin seedlings to 2 inches apart when 2 inches tall','Cover with fleece to deter carrot root fly, or interplant with onions','Harvest when shoulders are visible at soil surface, or leave in ground until needed in winter']},
  '🪴':{time:'1–2 hrs',cost:'$3–8',difficulty:'Easy',roi:'Medium',
    example:'Celery requires consistent moisture and fertility but rewards with a premium crop worth $3–5 per head at market. Self-blanching varieties grown in blocks are easiest for beginners.',
    steps:['Start indoors 10–12 weeks before last frost — celery needs a long season','Sow on surface, do not cover — needs light to germinate','Transplant into rich, moisture-retentive soil amended with plenty of compost','Water heavily and consistently — celery is 95% water and wilts fast','Feed with liquid feed every 2 weeks through the growing season','Harvest outer stalks as needed or cut whole head at base']},
  '🍃':{time:'1 hr',cost:'$3–8',difficulty:'Easy',roi:'High',
    example:'Chard is the most productive leafy green per square foot — one plant produces from June to November. A row of 6 plants yields 20+ lbs of leaves, worth $40 fresh. Highly ornamental with coloured stems.',
    steps:['Sow direct or transplant — very adaptable unlike many greens','Space 9 inches apart for continuous leaf harvest, 12 inches for large heads','Water regularly — drought stress turns leaves bitter','Harvest outer leaves when 6 inches long, leaving the growing centre intact','In mild climates, plants overwinter and bolt in spring — remove to allow new sowing','Companion plant with brassicas — chard repels aphids']},
  '🌽':{time:'2–3 hrs',cost:'$4–12',difficulty:'Medium',roi:'Medium',
    example:'Corn requires space but a block of 16 plants (wind-pollinated — must be in a grid not a row) yields 20–30 cobs. Sweet corn eaten within hours of harvest is far superior to shop-bought.',
    steps:['Sow in a grid pattern minimum 4x4 plants for wind pollination — single rows fail','Plant through black plastic mulch to warm soil and suppress weeds','Sow a second block 3 weeks later for a staggered harvest','Feed with nitrogen-rich feed when plants are knee-high and again when tassels appear','Test for ripeness by peeling back a leaf — kernels should be plump and milky when pierced','Harvest in the cool morning and eat the same day for peak sweetness']},
  '🥒':{time:'1–2 hrs',cost:'$3–10',difficulty:'Easy',roi:'High',
    example:'Cucumbers are prolific — 2 healthy plants produce 20–40 cucumbers through summer. Trained vertically on a trellis they save bed space and improve fruit quality.',
    steps:['Sow indoors 3–4 weeks before last frost or direct sow when soil is warm','Transplant carefully — cucumber roots hate disturbance, use biodegradable pots','Train up a vertical trellis — dramatically improves airflow and reduces mildew','Water deeply and consistently — irregular watering causes bitter fruits','Harvest when fruits are 6–8 inches and dark green — overripe fruits stop plant production','Remove male flowers early to delay bitterness in greenhouse varieties']},
  '🍆':{time:'2–3 hrs',cost:'$4–12',difficulty:'Medium',roi:'Medium',
    example:'Eggplant is a warm-season crop that performs best in hot climates or under cover. A healthy plant produces 6–10 large fruits or 20+ small varieties per season, worth $20–40 at farm stall prices.',
    steps:['Start indoors 8–10 weeks before last frost — needs a long warm season','Transplant only when night temps are consistently above 15C','Stake early — plants become top-heavy with fruit','Feed with potassium-rich fertiliser once flowering begins','Harvest before skin loses its shine — dull skin means seeds are maturing and flavour is declining','In cool climates, grow in a greenhouse or polytunnel for reliable crops']},
  '🧄':{time:'1 hr',cost:'$8–20',difficulty:'Easy',roi:'Very High',
    example:'Garlic is one of the best homestead crops — plant in autumn, harvest in midsummer with zero attention required. A row of 50 cloves yields 50 heads worth $75–150. Stores 6–9 months.',
    steps:['Plant individual cloves in autumn (October–November in temperate zones) pointy end up','Choose large outer cloves from the best bulbs for next season planting stock','Plant 4 inches deep and 6 inches apart in well-drained soil','Feed with nitrogen in early spring when shoots emerge','Stop watering when leaves start yellowing in early summer — let bulbs cure in the soil','Harvest when lower 3–4 leaves are brown, upper 5–6 still green. Cure in a dry shed for 3–4 weeks']},
  '🫒':{time:'1–2 hrs',cost:'$5–15',difficulty:'Easy',roi:'Very High',
    example:'A mixed herb patch of 6–8 culinary herbs saves $50–100/month on fresh herb purchases. Basil, parsley, coriander, chives, thyme, and rosemary cover 90% of everyday cooking needs.',
    steps:['Group herbs by water needs — Mediterranean herbs (thyme, rosemary, oregano) tolerate dry conditions; basil and parsley need moisture','Start annual herbs (basil, parsley, coriander) from seed every 4–6 weeks for continuous harvest','Perennial herbs (thyme, rosemary, sage, chives) establish once and return every year','Harvest before flowering — once herbs bolt, leaf flavour intensifies then declines','Dry or freeze excess harvest to use through winter','Cut back woody perennials by one third in early spring to encourage fresh growth']},
  '🥬':{time:'1 hr',cost:'$3–8',difficulty:'Easy',roi:'Very High',
    example:'Kale is the most productive cold-hardy vegetable. A plant sown in late summer continues producing through winter and into spring — 8 months of harvest from one sowing. A row of 8 plants yields 25–40 lbs.',
    steps:['Sow from late spring to late summer for staggered harvests','Transplant at 6-leaf stage, spacing 18 inches apart','Pick outer leaves from the bottom up — never strip the growing crown','Frost actually improves flavour by converting starches to sugars','Feed with nitrogen-rich fertiliser monthly through the growing season','Leave 2 plants to flower in spring as early pollinator food — seeds self-sow readily']},
  '🫛':{time:'1 hr',cost:'$2–6',difficulty:'Easy',roi:'Very High',
    example:'Cut-and-come-again lettuce is the highest-value crop per square foot — a single 4x4 bed sown every 3 weeks provides enough salad leaves for a family of 4 year-round (under cover in winter).',
    steps:['Sow small amounts every 2–3 weeks to avoid glut and gap','Surface sow and barely cover — lettuce needs light to germinate','For cut-and-come-again, harvest outer leaves at 3–4 inches, leaving the centre to regrow','Shade cloth in summer prevents bolting — lettuce is a cool-season crop','Interplant between slow-growing crops like brassicas to use space efficiently','Winter varieties (Arctic King, Valdor) survive under cold frames or in polytunnels']},
  '🧅':{time:'1–2 hrs',cost:'$5–15',difficulty:'Easy',roi:'High',
    example:'A 10 ft row of onion sets produces 20–30 lbs of storage onions — enough for a family for 6 months. Grown from sets (small bulbs) they are nearly foolproof and store for up to a year when properly cured.',
    steps:['Plant sets in early spring as soon as soil can be worked — they are frost tolerant','Push sets into soil with tip just below surface, 4 inches apart','Keep weed-free — onions hate competition','Stop watering when foliage falls over naturally — this signals bulbs are ready','Cure by leaving onions on wire mesh in a warm, airy shed for 3–4 weeks','Braid into ropes for traditional storage or hang in mesh bags in a cool dry space']},
  '🌶️':{time:'2–3 hrs',cost:'$4–12',difficulty:'Medium',roi:'High',
    example:'Chillies and capsicums are extraordinarily productive under cover — a single plant produces 50–200 fruits per season. In warm climates they can overwinter and become multi-year woody perennials.',
    steps:['Start indoors 10–12 weeks before last frost — they need a long warm season','Provide bottom heat (20–25C) for germination','Pot on into large containers or plant into polytunnel borders','Feed with high-potassium fertiliser once the first flowers appear','Harvest green for mild flavour or leave to ripen red/orange/yellow for full heat and sweetness','Overwinter mature plants in a frost-free space — they produce earlier the following year']},
  '🥔':{time:'2–3 hrs',cost:'$10–25',difficulty:'Easy',roi:'High',
    example:'Potatoes yield 5–10 lbs per lb of seed potatoes planted. A 10x10 ft bed produces 50–100 lbs of storage potatoes worth $75–150. They also break up compacted soil and are a perfect first crop on new ground.',
    steps:['Chit (pre-sprout) seed potatoes indoors for 4–6 weeks before planting','Plant in trenches 12 inches deep with a handful of compost under each tuber','Earth up stems 3 times as plants grow — this creates more tubers and prevents greening','Water consistently — irregular water causes hollow heart and scab','Stop watering when foliage yellows and dies back naturally','Harvest carefully with a fork, working from outside the bed inward to avoid spearing']},
  '🎃':{time:'2–3 hrs',cost:'$4–12',difficulty:'Easy',roi:'Medium',
    example:'Pumpkins and winter squash are the ultimate storage crop — harvested in autumn and stored for 3–6 months. A single plant trailing across 10 sq ft produces 3–8 fruits. One fruit feeds a family of 4 multiple meals.',
    steps:['Sow indoors 3 weeks before last frost or direct sow after all frost risk has passed','Plant on a mound of compost and manure — pumpkins are heavy feeders','Allow vines to trail across paths or over the compost heap to save bed space','Water at the base, not on leaves — wet foliage causes mildew','Remove all but 3–4 fruits per plant for large specimens','Cure for 10 days in warm sun before storing — this hardens the skin for long storage']},
  '🔴':{time:'1 hr',cost:'$2–5',difficulty:'Easy',roi:'High',
    example:'Radishes mature in 25–30 days — the fastest crop in the garden. Use them as row markers between slow crops or as a catch crop in unused spaces. French breakfast varieties are milder and larger than round types.',
    steps:['Sow direct in cool weather — summer heat causes bolting and hollow, pithy roots','Sow a short row every 2 weeks from early spring to early summer, and again in early autumn','Thin to 2 inches apart when seedlings emerge','Water consistently — dry conditions make roots woody and hot','Harvest when roots are thumbnail size to finger-thick — overmaturity causes pithy texture','Leave a few plants to flower for edible seed pods and to attract beneficial insects']},
  '🍀':{time:'1–2 hrs',cost:'$3–8',difficulty:'Easy',roi:'High',
    example:'Spinach and perpetual spinach (spinach beet) are among the most nutritious crops per square foot. True spinach prefers cool weather; perpetual spinach is more heat tolerant and produces all season.',
    steps:['Sow true spinach in early spring and autumn — it bolts in summer heat','Grow perpetual spinach (chard relative) for summer harvests','Sow in blocks rather than rows for higher yield per area','Water regularly — moisture stress causes premature bolting','Harvest outer leaves at 3–4 inches, allowing the centre to regrow 3–4 times','In mild climates, autumn-sown plants overwinter and provide early spring harvests']},
  '🍠':{time:'2–3 hrs',cost:'$10–25',difficulty:'Medium',roi:'High',
    example:'Sweet potato is a vigorous warm-season crop producing 10–20 lbs per plant in tropical/subtropical climates. Rich in vitamins A and C, they store for 6+ months when cured properly.',
    steps:['Grow from slips (rooted cuttings) not tubers — start slips 6 weeks before planting out','Plant only when soil is above 20C and all frost risk has passed','Plant on raised ridges to improve drainage and soil warmth','Allow vines to sprawl — do not trim them as leaves are solar panels for tuber production','Stop watering 2–3 weeks before harvest to concentrate sugar in tubers','Cure at 30C for 1 week before storage to convert starches to sugars and heal skin']},
  '🍅':{time:'2–3 hrs',cost:'$4–15',difficulty:'Medium',roi:'Very High',
    example:'A single indeterminate tomato plant in a greenhouse produces 10–20 lbs of fruit through summer. Outdoor determinate varieties in warm climates produce large flushes ideal for sauce-making and preserving.',
    steps:['Start indoors 8–10 weeks before last frost','Pot on twice before final planting to develop a strong root system','Plant deeply — bury up to two thirds of the stem to produce roots along the buried stem','Remove sideshoots (suckers) in the leaf axils of indeterminate varieties','Feed with high-potassium fertiliser once the first truss sets fruit','Support with sturdy stakes — a heavily laden plant snaps in wind']},
  '🫑':{time:'1–2 hrs',cost:'$3–10',difficulty:'Easy',roi:'High',
    example:'Courgette/zucchini is possibly the most productive vegetable by weight — one plant provides 20–40 courgettes through summer. The key is to harvest while small (6–8 inches) — fruits left on the plant become marrows and stop production.',
    steps:['Sow direct outdoors after last frost or indoors 3 weeks before','Grow on a prepared mound of compost and manure','One plant per square metre is enough — they are very vigorous','Water at the base, never on leaves — wet foliage causes powdery mildew','Hand pollinate in cool/cloudy weather by transferring pollen from male to female flowers','Harvest at 6–8 inches, every 2–3 days in peak season — missing even one causes it to become a marrow']},
  '🍁':{time:'2–4 hrs',cost:'$25–80',difficulty:'Easy',roi:'Very High',
    example:'Berry bushes are set-and-forget perennials. A row of 5 currant bushes (red, black, white) produces 10–20 lbs annually for 15–20 years with minimal care. Total lifetime value: $500–1,000 per plant.',
    steps:['Plant bare-root bushes in autumn or winter during dormancy for best establishment','Prepare a permanent bed with deep compost incorporation — these plants stay for decades','Space 4–5 feet apart for full-size bushes, 3 feet for compact varieties','Mulch heavily around the base with wood chip each spring','Prune one third of the oldest stems to ground level after harvest each year','Net against birds just as fruits begin to colour']},
  '🫐':{time:'2–4 hrs',cost:'$30–90',difficulty:'Medium',roi:'Very High',
    example:'Blueberries are high-value crops — $6–12/lb at market — but require acid soil (pH 4.5–5.5). A mature plant (year 5+) produces 5–8 lbs annually. They live 50+ years and require minimal pruning.',
    steps:['Test soil pH first — blueberries absolutely require acid conditions','Amend with sulphur or ericaceous compost to reach pH 4.5–5.5 before planting','Plant at least 2 varieties for cross-pollination','Mulch with pine bark or wood chip to maintain acid conditions','Water with rainwater not tap water (tap is often alkaline and damages plants over time)','Remove flower buds in year 1 to direct energy into root establishment']},
  '🍈':{time:'2–3 hrs',cost:'$4–12',difficulty:'Medium',roi:'Medium',
    example:'Melons require heat and space but a single Charentais melon plant produces 4–8 richly flavoured fruits. Under glass in cool climates they perform beautifully. Market value: $4–8 per melon.',
    steps:['Start indoors 4 weeks before last frost — they need warmth to germinate','Transplant into the sunniest, warmest spot or greenhouse border','Pinch out growing tip after 5 leaves and train 4 sideshoots','Restrict each sideshoot to one fruit — remove all others for larger, sweeter melons','Support swelling fruits in a net hammock tied to the frame above','Test for ripeness by gently pressing the blossom end — a slight give and fruity fragrance indicates readiness']},
  '🍇':{time:'4–6 hrs',cost:'$40–120',difficulty:'Hard',roi:'Very High',
    example:'A mature grapevine (year 5+) produces 15–25 lbs of fruit and provides dense shade on a south-facing pergola. Dessert grapes and wine grapes require different pruning systems but both live 50+ years.',
    steps:['Plant against a south-facing wall or train over a sunny pergola','Establish permanent woody framework in the first 2–3 years','Prune to short spurs (2–3 buds) on the rod each winter','Remove all but one bunch per lateral for quality over quantity','Pinch out growing tips 2 leaves beyond each bunch','Harvest when all berries have changed colour and taste sweet with a slight tackiness']},
  '🍓':{time:'2–3 hrs',cost:'$15–40',difficulty:'Easy',roi:'Very High',
    example:'Strawberries are the most popular homestead fruit. A bed of 20 plants yields 20–40 lbs in year 2 and beyond. Propagate new plants from runners each autumn for a perpetually renewed bed at zero cost.',
    steps:['Plant bare-root crowns in late summer/early autumn for a harvest the following year','Set crown at soil level — too deep rots the crown, too shallow dries it out','Mulch around plants with straw once fruits begin to set to keep them clean','Net against birds when fruits begin to colour','After harvest, cut back all old leaves (not crown) and remove runners you do not need','Replace with new runners every 3–4 years as virus build-up reduces yield']},
  '🍉':{time:'2–3 hrs',cost:'$4–12',difficulty:'Hard',roi:'Medium',
    example:'Watermelons need heat, space, and a long season. In warm climates, one plant sprawling over 20 sq ft produces 3–5 fruits weighing 10–20 lbs each. Under cover they succeed in cooler regions.',
    steps:['Start indoors 3–4 weeks before transplanting — they hate cold and root disturbance','Transplant into the hottest spot after all frost risk, using biodegradable pots','Grow on black plastic mulch to maximise soil warmth','Hand pollinate female flowers using a soft brush','Limit to 2–3 fruits per plant for full-size fruits','Test ripeness by knocking — a ripe watermelon gives a hollow thud, not a high ping']},
  '💧':{time:'4–8 hrs',cost:'$250–800',difficulty:'Medium',roi:'Very High',
    example:'A 500-gallon tank fed from a 1,000 sq ft roof collects 600+ gallons from a single 1-inch rainstorm. Gravity-fed to raised beds, it eliminates municipal water use for irrigation from April to October.',
    steps:['Calculate catchment: roof area (sq ft) x rainfall (in) x 0.623 = gallons collected','Install a first flush diverter to discard the first inch of runoff (contaminated by debris)','Use food-grade polyethylene tanks — avoid recycled chemical containers','Elevate tank 2–3 feet above garden level for gravity-fed pressure without a pump','Screen all inlets with fine mesh to exclude insects and debris','Install an overflow pipe directed away from foundations']},
  '🪣':{time:'2–4 hrs',cost:'$150–500',difficulty:'Easy',roi:'High',
    example:'A 10,000-gallon underground cistern fed from multiple roof surfaces provides 3–6 months of irrigation water. In arid climates this is the foundation of any water-resilient property.',
    steps:['Assess total catchment area and annual rainfall to size the cistern','Underground polyethylene tanks maintain water temperature and prevent algae growth','Install a sediment filter on the inlet and UV filter on the outlet for safe non-potable use','Connect to drip irrigation for maximum water use efficiency','Test water quarterly for bacterial contamination if used for food crops','In earthquake zones, use flexible inlet/outlet connections to prevent damage']},
  '🚿':{time:'4–8 hrs',cost:'$200–600',difficulty:'Medium',roi:'Very High',
    example:'Drip irrigation reduces water use by 50–70% versus overhead sprinklers while delivering water directly to root zones. A properly designed system reduces disease and weed germination between rows.',
    steps:['Map your garden layout and calculate total row length before purchasing','Use main supply lines (16mm) and branch off with 8mm feeder pipes to emitters','Install a pressure regulator — too high pressure blows emitters','Add a filter on the inlet to prevent clogging','Space emitters every 12 inches for vegetables, 18–24 inches for perennials','Flush lines at the start and end of each season to remove mineral deposits']},
  '🐟':{time:'3–5 days',cost:'$300–2,000',difficulty:'Hard',roi:'Very High',
    example:'A 1,500-gallon pond supports a thriving aquatic ecosystem — frogs control slugs and snails, dragonfly larvae eat mosquito larvae, and birds drink and bathe, increasing their pest-control visits to your garden.',
    steps:['Choose the lowest natural point on the property for gravity-fed water','Use EPDM rubber liner (not PVC which degrades in UV) for longevity','Include marginal shelves at 9 and 18 inches depth for different plant zones','Plant natives: bulrush, iris, water mint, watercress, and floating pondweed','Never add fish if you want maximum wildlife — they eat frog spawn and invertebrates','Create a log pile ramp for hedgehogs and other wildlife to climb out if they fall in']},
  '🌧️':{time:'1–2 days',cost:'$200–800',difficulty:'Medium',roi:'High',
    example:'A rain garden built in a low-lying area captures 10,000+ gallons of stormwater per year, preventing runoff and recharging groundwater. Native plants filter pollutants and create valuable wildlife habitat.',
    steps:['Site in a natural low point that collects runoff after heavy rain','Dig a shallow basin 6–12 inches deep with gently sloping sides','Amend with 30% compost and 20% coarse sand for improved infiltration','Plant deep-rooted native species that tolerate both flooding and dry periods','Create an overflow outlet at one end directed to a drainage swale','The basin should drain within 24–48 hours — if slower, improve subsoil drainage']},
  '☀️':{time:'1–2 days',cost:'$800–3,500',difficulty:'Hard',roi:'Very High',
    example:'A 3kW roof solar array produces 3,000–4,500 kWh annually, covering 60–80% of average household electricity. Payback period 6–9 years. System life 25–30 years. Pairs ideally with a battery and EV charger.',
    steps:['Audit your annual electricity usage first — size the system to meet 80–100% of consumption','South-facing at 30–40 degrees tilt maximises annual output in temperate zones','Get 3 quotes — include racking, inverter, and monitoring in total cost comparison','Pair with battery storage to increase self-consumption from 30% to 70–80%','Check local planning rules before installation','Register with your utility for net metering or feed-in tariffs']},
  '🔋':{time:'4–8 hrs',cost:'$600–3,000',difficulty:'Hard',roi:'High',
    example:'A 10kWh battery bank stores surplus solar production for use at night or on cloudy days, increasing solar self-consumption from 30% to 70–80%. Combined ROI with solar: 5–8 years.',
    steps:['Size battery to 1–2 days of your evening electricity consumption','Lithium iron phosphate (LiFePO4) is the preferred chemistry — 3,000+ cycles at 80% depth of discharge','Install in a temperature-regulated space — batteries perform poorly below 0C','Connect via a quality inverter/charger that handles both solar and grid charging','Set charging to 80% for daily cycling, 100% only when a grid outage is forecast','Monitor with a battery management system and review monthly for unusual patterns']},
  '⚡':{time:'4–6 hrs',cost:'$400–1,500',difficulty:'Medium',roi:'High',
    example:'A solar-powered pump system eliminates electricity costs for water distribution entirely. A 100W panel drives a pump capable of moving 2,000 gallons/day from a well, stream, or tank to irrigation systems.',
    steps:['Calculate total dynamic head (vertical lift plus friction loss through pipes) to select the right pump','Size solar panel to deliver 20–30% more power than the pump rated consumption','Install a float switch in the destination tank to prevent overflow and protect the pump from dry running','Use MPPT charge controller for maximum efficiency in variable sunlight','Install check valve to prevent backflow when pump stops','Service pump annually — clean strainer, check seals, test pressure']},
  '🌬️':{time:'1–3 days',cost:'$500–2,500',difficulty:'Hard',roi:'High',
    example:'A 1.5kW micro wind turbine at a site averaging 12 mph produces 2,000–3,000 kWh annually — enough for all household lighting and appliances. Effective in coastal, hilltop, and open rural sites.',
    steps:['Measure wind speed consistently over 3–6 months using an anemometer before purchasing','Turbine should be installed at least 10 ft above any obstruction within 300 ft radius','Tower height is more important than turbine size — invest in height first','Use a dump load controller to divert excess power when batteries are full, preventing overcharge','Check planning/zoning regulations — turbines may require permits','Annual service: inspect blades for chips, check all fasteners, test braking system']},
  '♻️':{time:'2–4 hrs',cost:'$40–150',difficulty:'Easy',roi:'Very High',
    example:'A hot compost system (minimum 1 cubic metre) reaches 55–70C, kills weed seeds and pathogens, and produces finished compost in 6–8 weeks. The finished product is worth $30–60 per cubic yard as soil amendment.',
    steps:['Build a minimum 3x3x3 ft bay — smaller heaps do not generate enough heat','Maintain 25:1 carbon to nitrogen ratio: 25 parts brown (cardboard, straw, dry leaves) to 1 part green','Keep heap as moist as a wrung-out sponge — too dry stalls decomposition','Turn every 3–5 days for hot composting, or leave for cold composting','A properly hot heap smells earthy, never putrid — putrid smell means too much nitrogen or too wet','Finished compost is dark, crumbly, and smells like forest floor']},
  '🪱':{time:'2–3 hrs',cost:'$50–150',difficulty:'Easy',roi:'Very High',
    example:'A 2-tray worm bin converts 2 lbs of kitchen scraps per week into the richest possible soil amendment. Worm castings are 5x more nutrient-dense than compost and worm liquid (diluted 10:1) is an unbeatable plant tonic.',
    steps:['Start with red wigglers (Eisenia fetida) not garden earthworms — they process waste efficiently','Use a ratio of 1,000 worms per lb of weekly food waste','Bedding should be moist shredded cardboard, aged compost, or coir','Feed kitchen scraps, coffee grounds, tea bags, fruit, and vegetable trimmings','Avoid: citrus, onions, meat, dairy, oily foods — these repel or harm worms','Harvest castings from the bottom tray every 2–3 months']},
  '🌾':{time:'1–2 hrs',cost:'$10–30',difficulty:'Easy',roi:'Very High',
    example:'Cover crops sown between harvests prevent soil erosion, suppress weeds, and add fertility. A winter rye plus vetch mix adds 80–150 lbs of nitrogen per acre when turned in — equivalent to spreading commercial fertiliser.',
    steps:['Choose cover crop based on goal: nitrogen fixation (legumes), soil structure (rye, oats), weed suppression (mustard, buckwheat)','Sow immediately after clearing a crop — never leave soil bare for more than 2–3 weeks','Broadcast seed evenly and rake in lightly — good soil contact is critical','In autumn, sow winter-hardy varieties that survive frost and protect soil all winter','Cut or roll down 2 weeks before planting the next crop to allow decomposition','Do not till in more than 4 inches of green material at once — excess nitrogen causes problems']},
  '🍂':{time:'1–2 hrs',cost:'$5–20',difficulty:'Easy',roi:'Very High',
    example:'A 3-inch layer of wood chip mulch on all bare soil eliminates 90% of weeding, retains soil moisture reducing irrigation by 50%, and feeds soil fungi that improve plant health. Annual application keeps the system thriving.',
    steps:['Apply wood chip, straw, or leaf mulch 3–4 inches deep over all bare soil','Keep mulch 2 inches away from plant stems to prevent collar rot','Arborist wood chip (the whole chipped tree) is best — higher fungal inoculum than bark chip','Apply fresh mulch to beds each spring before weeds germinate','Do not dig mulch in — let it decompose on the surface as nature intended','In autumn, add a final mulch layer over perennials to insulate roots from frost']},
  '🪟':{time:'2–4 hrs',cost:'$40–120',difficulty:'Easy',roi:'High',
    example:'A simple cold frame extends the growing season by 4–6 weeks each end. Early lettuce in February and late tomatoes through November are achievable. Cost: one sheet of old window glass and four boards.',
    steps:['Build a bottomless box with a sloped lid — back 12 inches high, front 8 inches, angled for rain runoff','Face due south for maximum winter sun collection','Use a prop stick to ventilate on mild days — overheating kills seedlings quickly','Harden off plants before planting out by opening the frame progressively over 2 weeks','In severe frost, drape old carpet or bubble wrap over the frame for extra insulation','Close the frame every evening in spring to trap the day warmth']},
  '🌲':{time:'1–2 days',cost:'$50–200',difficulty:'Medium',roi:'Very High',
    example:'Hugelkultur (hill culture) beds made from buried rotting wood retain moisture for 2–3 years without irrigation once established. The internal wood sponge releases nutrients as it decomposes over 5–10 years — a self-fertilising bed.',
    steps:['Dig a trench 2–3 ft deep and fill with rotting logs, branches, and woody material','Layer with nitrogen-rich material (manure, green clippings, seaweed) between the wood','Cover with topsoil and compost mound, 1–3 ft above grade','Plant into the mound immediately — the elevated surface drains quickly and warms fast in spring','Do not water in the first season — the decomposing wood holds ample moisture','As the mound settles over years, top-dress with compost to maintain height']},
  '🌼':{time:'1–2 hrs',cost:'$60–200',difficulty:'Easy',roi:'Very High',
    example:'A pollinator patch of 10 native flowering species extends from April to October, attracting 200+ species of bees, hoverflies, and butterflies. These insects pollinate neighbouring food crops, increasing fruit yields by 20–40%.',
    steps:['Choose a sunny, sheltered position — pollinators prefer warmth','Select species to bloom in sequence across all seasons: early (crocus, hellebore), mid (borage, phacelia, lavender), late (sedum, aster)','Include single-flowered varieties — double flowers often lack accessible nectar and pollen','Avoid using pesticides within 30 metres of the patch','Leave a section of bare soil as ground-nesting habitat for solitary bees','Leave seedheads standing through winter — hollow stems are overwintering habitat']},
  '🦇':{time:'1–2 hrs',cost:'$30–80',difficulty:'Easy',roi:'High',
    example:'A bat box installed on a south-facing wall or mature tree attracts pipistrelle bats. One bat eats 3,000 insects per night — including moths, gnats, and leatherjackets that damage crops. Zero maintenance once established.',
    steps:['Install on a south or south-west facing surface to absorb warmth','Mount at least 13 ft high — lower boxes are rarely used','Choose a position with an unobstructed flight path to and from the opening','Use untreated, rough-sawn timber — bats cling to the textured surface','Do not check the box during April–August when young bats are present','Be patient — colonisation can take 2–3 years']},
  '🐦':{time:'1–2 hrs',cost:'$20–60',difficulty:'Easy',roi:'High',
    example:'A blue tit family feeds its chicks 10,000 caterpillars before they fledge. Installing 5–10 nest boxes of different types across the property creates a resident insectivorous bird colony that provides season-long pest control.',
    steps:['Match hole size to target species: 25mm for blue/coal tit, 28mm for great tit, 32mm for tree sparrow','Face boxes north-east to avoid direct afternoon sun and prevailing rain','Fix firmly at 6–12 ft height on trees, fences, or buildings','Clean boxes in November–February between breeding seasons to remove parasites','Space boxes at least 30 ft apart for territorial species like robins and wrens','Pair with native berry shrubs nearby for winter food supply']},
  '🌴':{time:'2–4 hrs',cost:'$50–200',difficulty:'Easy',roi:'Very High',
    example:'A mixed hedgerow of hawthorn, blackthorn, elder, hazel, and field maple provides wildlife corridors, windbreak protection (reducing heating costs by 15–20%), free foraging, and carbon sequestration simultaneously.',
    steps:['Plant bare-root whips in autumn/winter when dormant — far cheaper than pot-grown trees','Use a mixed species blend: at minimum 5 different native species for resilience','Plant in a double staggered row, 18 inches between plants in each row','Protect with spiral guards or rabbit netting for the first 3 years','Cut on a 3-year rotation — cut one third each year to maintain flowering and fruiting','Allow occasional trees to grow to full height at 15 ft intervals']},
  '🐛':{time:'2–4 hrs',cost:'$40–100',difficulty:'Easy',roi:'Very High',
    example:'An insect hotel hosting lacewings, ground beetles, and solitary bees provides season-long pest control. A single lacewing larva eats 200 aphids per week. These predatory insects are the cornerstone of chemical-free growing.',
    steps:['Build using untreated timber — treated wood chemicals harm insects','Fill compartments with: hollow bamboo stems (8–10mm diameter for mason bees), rolled corrugated cardboard, pinecones, dry straw, bark, and drilled wooden blocks','Face the structure south or south-east for warmth','Install at least 3 ft off the ground, sheltered from rain but in full sun','Position near flowering plants that provide food for adult insects','Replace filling materials every 2–3 years as they become damp and mouldy']},
  '🌺':{time:'2–3 hrs',cost:'$40–120',difficulty:'Easy',roi:'Very High',
    example:'Native plant borders require 60% less water than exotic plantings, zero fertiliser, and minimal maintenance while supporting 4x more wildlife species than non-native gardens. They also increase property value.',
    steps:['Research which plants are native to your specific region and climate zone','Choose species that cover all seasons: spring bulbs, summer perennials, autumn berries, evergreen structure','Plant in drifts of 3–5 of each species for visual impact and insect foraging efficiency','Amend soil minimally — native plants evolved for local soil conditions','Reduce mowing in naturalistic areas, allowing grasses and wildflowers to establish','Leave plants standing through winter — seedheads feed birds, hollow stems shelter insects']},
  '🪷':{time:'3–5 days',cost:'$400–1,500',difficulty:'Hard',roi:'Very High',
    example:'A wildlife pond with native aquatic plants supports a self-sustaining ecosystem within 2 years. Research shows gardens with ponds have 3x more biodiversity than those without. Frogs alone consume 100+ slugs per week.',
    steps:['Choose a position that receives both sun and shade — full sun causes excessive algae','Include shallow margins (2–4 inches) for amphibians to spawn and for birds to bathe','Plant 40% of the surface with native aquatics to naturally balance water quality','Never add fish — they eat everything that makes a wildlife pond valuable','Create log pile surrounds for amphibian shelter and slow drainage from the bank','Connect to rainwater collection — chlorinated tap water harms aquatic life']},
  '🐔':{time:'4–6 hrs',cost:'$300–800',difficulty:'Medium',roi:'High',
    example:'6 hens produce 5–6 eggs/day in peak season (spring/summer), worth $15–20/week at premium prices. They also convert kitchen scraps and garden waste into eggs and manure — one of the highest-ROI animals for a small homestead.',
    steps:['Provide 4 sq ft of coop space and 10 sq ft of run per bird — cramped conditions cause stress and pecking','Secure run with hardware cloth (not chicken wire) buried 12 inches below ground to exclude foxes','Provide 1 nesting box per 3 hens','Supplement with oyster shell for strong eggshells and grit for digestion','Collect eggs daily and clean coop weekly to reduce disease risk','Rotate hens across garden sections — they improve soil but destroy it if left in one place too long']},
  '🦆':{time:'3–5 hrs',cost:'$200–600',difficulty:'Medium',roi:'High',
    example:'Ducks are superior to chickens for slug and snail control — they consume pests voraciously without scratching up plant roots like chickens. 4 Khaki Campbell ducks produce 300+ eggs per year.',
    steps:['Provide a pond or deep water container — ducks need to submerge their bills to clean nostrils','Electric poultry netting is most cost-effective for moving ducks between garden sections','Females are quieter than males — keep a 4:1 female to male ratio','Ducks lay before 9am — close them in at night and collect eggs each morning','Provide high-protein feed during moult (autumn) when egg production drops','Duck manure is wetter than chicken manure — dilute before applying to plants or compost first']},
  '🐐':{time:'4–6 hrs',cost:'$400–1,200',difficulty:'Hard',roi:'High',
    example:'Two Nigerian Dwarf goats produce 1–2 quarts of rich milk daily for 10 months of the year. Their milk is naturally homogenised and easy to digest. They also clear brush, brambles, and invasive plants.',
    steps:['Goats require a minimum 200 sq ft of space per animal plus a dry, draught-free shelter','Install high-tensile or electric fencing — goats are highly intelligent escape artists','Keep minimum 2 goats — they are herd animals and become destructive when lonely','Provide browse (tree prunings, shrub clippings) as primary food source, not grain','Hoof trimming every 6–8 weeks is essential to prevent lameness','Does require breeding each year to maintain milk production']},
  '🐖':{time:'3–4 hrs',cost:'$300–800',difficulty:'Medium',roi:'Very High',
    example:'Two weaners bought in spring and raised through summer on kitchen scraps, whey, and fresh pasture yield 150–200 lbs of pork and lard in 5–6 months. Cost: $400–600 to raise. Market value: $900–1,200.',
    steps:['Use portable electric fencing and rotate pigs across different areas — they will devastate a small permanent area','Pigs root and turn compacted soil better than any machine — use them to clear new ground for cultivation','Feed kitchen scraps, surplus garden produce, and forage — supplement with balanced feed','Provide a wallow — pigs cannot sweat and need mud to thermoregulate in summer','Slaughter in autumn after summer growth — arrange processing 3–4 months in advance','Do not name animals you intend to eat — it makes the final step unnecessarily difficult']},
  '🐇':{time:'2–3 hrs',cost:'$150–400',difficulty:'Easy',roi:'High',
    example:'A doe rabbit produces 4–5 litters of 6–8 kits per year. Each kit reaches slaughter weight in 8–10 weeks on kitchen scraps and garden forage. Annual production: 150+ lbs of lean, low-cholesterol meat. Very space efficient.',
    steps:['House in a secure hutch with a separate enclosed sleeping area and open exercise run','Rabbits are highly productive in small spaces — ideal for urban and suburban homesteads','Feed garden weeds, vegetable trimmings, hay, and a small amount of pellets','Check water and food daily — rabbits are sensitive to deprivation','Breed selectively — keep the largest, healthiest animals as breeding stock','Rabbit manure can be applied directly to garden beds without composting — it is not a hot manure']},
  '💙':{time:'1–2 hrs',cost:'$5–15',difficulty:'Easy',roi:'Very High',
    example:'Borage is the ultimate companion plant — bees love it, it deters tomato hornworm, improves flavour of neighbouring strawberries, and self-seeds freely so you plant once and it returns forever. Edible star-shaped flowers for salads.',
    steps:['Direct sow in spring after last frost — borage hates transplanting','Tolerates poor, dry soil — thrives where other plants struggle','Once established it self-seeds prolifically — pull unwanted seedlings while young','Dead-head regularly to prolong flowering season from June to October','Use as mulch material when cutting back — leaves decompose rapidly and feed the soil','Interplant throughout the vegetable garden rather than as a separate block']},
  '🌻':{time:'1–2 hrs',cost:'$5–15',difficulty:'Easy',roi:'High',
    example:'Calendula (pot marigold) is a medicinal and culinary flower that blooms June to November. Its sticky resin traps aphids and whitefly (use as a trap crop near tomatoes), and the petals are an anti-inflammatory skin remedy.',
    steps:['Direct sow in spring or autumn — calendula germinates in cool soil','Thin to 12 inches apart for bushy plants','Dead-head weekly to extend the flowering season over 5 months','Harvest petals in the morning when fully open for fresh use or drying','Dry petals on mesh in a single layer away from direct light to preserve colour and potency','Allow a few plants to set seed each year — they self-sow readily in undisturbed soil']},
  '🌸':{time:'1–2 hrs',cost:'$5–15',difficulty:'Easy',roi:'High',
    example:'Chamomile is a compact, apple-scented flowering herb that attracts beneficial insects and is said to improve the health and flavour of nearby plants (hence its folk name: the plant physician). Harvest flowers for tea.',
    steps:['Sow on the surface — tiny seeds need light to germinate','Thin to 6 inches apart once established','Harvest flowers when fully open and petals are just beginning to reflex downward','Dry at low temperature (35C) on mesh screens for 1–2 weeks for tea','Roman chamomile (perennial) forms a fragrant ground cover between paving','German chamomile (annual) is higher in the active compound bisabolol']},
  '✿':{time:'1–2 hrs',cost:'$5–15',difficulty:'Easy',roi:'Medium',
    example:'Cosmos fill the cutting garden from July to November with feathery foliage and prolific blooms. They attract hoverflies whose larvae eat aphids, and provide endless cut flowers for the home. Free from self-sown seed each year.',
    steps:['Direct sow after last frost or start indoors 4–5 weeks before transplanting','Tolerates poor soil — excessive fertility produces leafy plants with fewer flowers','Pinch out growing tips when 12 inches tall to produce a branching, bushy plant','Dead-head regularly or allow seed to set for self-sowing','Cut when buds are just opening for vases — fully open blooms shatter quickly once cut','Leave some plants to self-seed — they will establish a self-renewing colony']},
  '🏵️':{time:'2–3 hrs',cost:'$15–40',difficulty:'Medium',roi:'Medium',
    example:'Dahlias produce the most abundant cut flowers from July to hard frost. A single tuber grows into a 3 ft plant producing 20–50 blooms. Premium varieties fetch $8–15 per bunch at farmers markets.',
    steps:['Plant tubers after last frost when soil reaches 15C — cold and wet soil rots them','Choose a sunny sheltered position — dahlias hate wind','Pinch out the growing tip at 12 inches to produce a multi-stemmed bushy plant','Feed weekly with high-potassium liquid fertiliser once buds appear','Lift tubers after the first hard frost, dry, and store in barely moist compost at 5–8C','Divide tubers before replanting — each division needs at least one visible eye (bud)']},
  '🌟':{time:'2–3 hrs',cost:'$10–25',difficulty:'Easy',roi:'Very High',
    example:'Echinacea (coneflower) is a drought-tolerant native perennial that blooms July–September with zero care after establishment. The roots are a popular immune-supporting herb; seeds feed goldfinches; dried seedheads provide winter structure.',
    steps:['Plant in full sun and well-drained soil — Echinacea rots in waterlogged conditions','Space 18 inches apart — they spread slowly via self-seeding over years','Do not deadhead in autumn — seedheads are bird food through winter','Divide established clumps every 4–5 years in early spring to maintain vigour','Harvest roots in autumn of year 3 for medicinal use — dry whole roots or tincture fresh','Species varieties support far more wildlife than fancy garden cultivars']},
  '🔔':{time:'1–2 hrs',cost:'$5–15',difficulty:'Medium',roi:'Medium',
    example:'Foxglove is a bold biennial providing towering flower spikes in its second year. It is one of the most important early summer nectar sources for bumblebees. Digitalis compounds have medical significance.',
    steps:['Sow in early summer for flowers the following year','Tolerates shade — valuable for difficult spots under trees and on north-facing slopes','Self-seeds prolifically once established — allow seedheads to ripen and scatter','Every part of the plant is toxic — wear gloves when handling and keep away from children and animals','Staking required in exposed sites — hollow stems snap in wind','Biennial cycle: year 1 rosette, year 2 flowers and dies — maintain a perpetual colony via self-seeding']},
  '💜':{time:'2–3 hrs',cost:'$10–30',difficulty:'Easy',roi:'Very High',
    example:'Lavender is the ultimate low-maintenance perennial — it tolerates drought, poor soil, and neglect. It attracts bees from 200m away, repels moths from stored clothing, and is the most widely used aromatherapy plant on earth.',
    steps:['Plant in full sun and sharply drained soil — lavender dies in wet, heavy clay','Incorporate gravel into planting holes on heavy soils','Cut back by one third immediately after flowering — never cut into old wood (plants will not regenerate)','Every 3–4 years, hard rejuvenation pruning in spring can extend the plant life','Propagate easily from semi-ripe cuttings in late summer — strike in sandy compost','Harvest flower spikes just as the first few buds open for the strongest fragrance']},
  '🫧':{time:'1–2 hrs',cost:'$5–15',difficulty:'Easy',roi:'High',
    example:'Lupins are statuesque nitrogen-fixing perennials that fix 100–200 lbs of atmospheric nitrogen per acre annually. Their deep taproot breaks up subsoil compaction, and they provide early summer nectar for bumblebee queens after winter dormancy.',
    steps:['Sow in autumn for spring flowers, or in spring for midsummer flowering','Nick or soak seeds for 24 hours before sowing to improve germination rate','Plant in full sun with slightly acid, well-drained soil — lupins struggle in alkaline conditions','Deadhead promptly to prevent self-seeding (seedlings rarely match parent quality)','Cut back to ground level after flowering — a second flush of smaller spikes often follows','Divide every 3–4 years in early spring as lupins deteriorate after 5–6 years']},
  '🟠':{time:'1–2 hrs',cost:'$5–15',difficulty:'Easy',roi:'Very High',
    example:'French marigolds (Tagetes) are the most scientifically proven companion plant — their roots exude a substance that kills nematodes, and their scent confuses aphids and whitefly when interplanted with tomatoes and peppers.',
    steps:['Sow indoors 6 weeks before last frost for transplanting as a tomato companion','Direct sow in summer for natural pest management anywhere in the garden','Plant densely between vegetable rows for maximum nematode suppression','Dead-head regularly to maintain flowering from June to frost','In autumn, dig in the entire plant (roots contain the highest concentration of nematocides)','African marigolds (Tagetes erecta) are taller and have stronger nematode-suppressing effect']},
  '🧡':{time:'1–2 hrs',cost:'$5–12',difficulty:'Easy',roi:'Very High',
    example:'Nasturtium is a multi-purpose edible companion plant — flowers, leaves, and seeds are all edible with a peppery flavour. It is a magnet for black aphids, drawing them away from beans and other crops. Bees love it.',
    steps:['Direct sow after last frost — large seeds are easy to handle and germinate fast','Plant in poor soil — rich soil produces lush leaves but few flowers','Use as a living mulch ground cover, a climbing plant, or a hanging basket subject','All parts are edible: flowers in salads, leaves in pesto, pickled seeds as capers','As a trap crop: allow aphids to colonise nasturtiums and then cut infested stems to compost','Self-seeds freely in mild climates — one planting can establish a permanent colony']},
  '🪻':{time:'2–3 hrs',cost:'$15–40',difficulty:'Medium',roi:'Medium',
    example:'Peonies are long-lived perennials (100+ years) producing lush, fragrant flowers in May–June. They are premium cut flowers worth $5–15 per stem at markets. Once established they are virtually indestructible and pest-free.',
    steps:['Plant bare-root divisions in autumn, with eyes (buds) no more than 2 inches below the soil surface — too deep and they will not flower','Choose a permanent position in full sun — peonies hate being moved','Stake before flowers open — heavy blooms collapse in rain','Do not cut foliage in autumn — leave it to die back naturally to replenish root reserves','Peonies flower best with a cold winter dormancy — they do not perform well in frost-free climates','Divide only if absolutely necessary — they resent disturbance and may take 3 years to rebloom']},
  '🌹':{time:'3–4 hrs',cost:'$20–60',difficulty:'Medium',roi:'Medium',
    example:'Old-fashioned shrub roses (David Austin types) combine fragrance, repeat flowering, and disease resistance that modern hybrid teas lack. A mature shrub rose provides 50–100 cut blooms per season and lives 30–50 years.',
    steps:['Plant bare-root in autumn/winter or pot-grown any time with adequate watering','Choose disease-resistant varieties — you should not need to spray preventively','Feed in spring with rose fertiliser as new growth begins, and again after first flush','Prune to outward-facing buds to maintain an open, vase-shaped structure','Deadhead promptly after flowering to encourage repeat blooming','Mulch generously each spring to retain moisture and suppress weeds']},
  '🌞':{time:'1–2 hrs',cost:'$4–12',difficulty:'Easy',roi:'High',
    example:'Sunflowers grow to 6–12 ft, providing a dramatic visual accent and 500–1,000 seeds per head. The seeds are harvested for eating, bird food, or pressing into oil. Goldfinches and other seed-eating birds will strip the heads through autumn.',
    steps:['Direct sow after last frost in a sunny, sheltered position','Sow in succession every 3 weeks for blooms from July to October','Support tall varieties with a stake — stems snap in wind','Leave seedheads on the plant in autumn as a bird feeding station','To harvest seeds: cut head when back turns brown, hang upside down in a mesh bag to dry','Save seeds from the best plants each year — sunflowers easily come true from saved seed']},
  '💐':{time:'1–2 hrs',cost:'$5–15',difficulty:'Easy',roi:'Medium',
    example:'Sweet peas produce the most intensely fragrant cut flowers in the garden from June to August. Train them up an obelisk or wigwam and cut armfuls for the house daily — the more you cut, the more they produce.',
    steps:['Sow in deep pots in autumn (overwinter in a cold frame) or in early spring','Use deep modules — sweet peas develop long roots and suffer in shallow containers','Provide a tall (6 ft minimum) structure to climb — they stall and collapse on short supports','Pinch out growing tip at 6 inches to encourage branching','Remove tendrils and redirect stems weekly to maintain an even structure','Pick every 2–3 days without fail — even one seed pod setting stops all further flower production']},
  '🌷':{time:'1–2 hrs',cost:'$10–30',difficulty:'Easy',roi:'Medium',
    example:'Tulips provide the most spectacular spring display and are the easiest spring bulb to grow. Mass planting (50+ bulbs in a bed) creates a professional display worth $200+ in cut flowers. Lift and store annually for best results.',
    steps:['Plant in November, 6–8 inches deep and 4–6 inches apart','Choose a well-drained position — waterlogged soil causes tulip fire disease','In formal displays, lift bulbs in June once foliage yellows, dry in a shed, and store in mesh bags','In naturalistic settings, leave bulbs in the ground — they perennialise in free-draining soil','Dead-head promptly but leave foliage to die back fully — this feeds the bulb for next year','Species tulips perennialise far more reliably than large hybrids']},
  '🌈':{time:'1–2 hrs',cost:'$10–25',difficulty:'Easy',roi:'Very High',
    example:'A wildflower meadow in even a 10x10 ft patch provides season-long nectar from April to October. Research shows meadow areas support 40x more pollinating insects than mown grass. Maintenance: one cut per year.',
    steps:['Remove all existing vegetation — wildflowers cannot compete with established grass','Prepare a fine, low-fertility seedbed — bare soil is ideal conditions','Sow a native species mix suited to your soil type (acidic, alkaline, or neutral)','Spring sowing (April–May) or autumn sowing (August–September) are both effective','Do not fertilise — meadow wildflowers evolved for poor soil conditions','Cut once in autumn (late September–October) and remove all cuttings to keep fertility low']},
  '🌠':{time:'1–2 hrs',cost:'$5–15',difficulty:'Easy',roi:'High',
    example:'Zinnias are the most heat-tolerant, prolific cut flower for summer gardens. They bloom from June to hard frost in a full spectrum of colours, attract butterflies, and produce armfuls of long-stemmed cuts for the home each week.',
    steps:['Direct sow after last frost — zinnias despise cold and root disturbance','Thin to 12 inches apart — crowded plants develop powdery mildew','Pinch out the first flower bud when young to produce more branching stems','Water at the base, not on leaves — overhead watering causes mildew on the lower leaves','Harvest with a long stem early in the morning — recut at an angle under water','Deadhead regularly or let some go to seed — zinnias cross-pollinate easily creating interesting new colours']},
  '🍎':{time:'1–2 hrs/yr',cost:'$55–200',difficulty:'Easy',roi:'Very High',
    example:'A mature apple tree (zones 3–8) yields 60–200 lbs/yr and lives 50–80 years. Not suitable for tropical climates — choose citrus or mango instead. Self-fertile varieties (Cox, Bramley) are ideal for small gardens.',
    steps:['Choose full-sun zone 2 placement','Dig 3x root ball width, not deeper','Amend backfill with 20% compost','Stake loosely — trunk movement builds strength','Mulch 3 in deep, water weekly year 1','Prune annually in late winter']},
  '🍋':{time:'2–4 hrs',cost:'$80–250',difficulty:'Medium',roi:'High',
    example:'A container lemon tree in a temperate climate produces 20–60 lemons per year when overwintered in a frost-free conservatory. In subtropical and Mediterranean climates it grows in the ground, producing 200+ fruits annually.',
    steps:['Choose a frost-free position or plan to overwinter indoors above 7C','Plant in well-drained, slightly acid soil (pH 6.0–6.5)','Feed with citrus-specific fertiliser high in nitrogen and trace elements','Water deeply and allow soil to partly dry between waterings — citrus hate waterlogged roots','Remove suckers from below the graft immediately','Harvest when fully coloured — citrus does not ripen further off the tree']},
  '🥑':{time:'2–3 hrs',cost:'$80–200',difficulty:'Hard',roi:'Very High',
    example:'Avocado trees in zones 9–11 produce 200–500 fruits per year once mature (year 5–7). Value: $400–1,000 at farm-gate prices. They require specific warm, frost-free conditions and do not perform outside their suitable zones.',
    steps:['Plant only in frost-free zones (9–11) or in a very large heated greenhouse','Requires well-drained soil — avocados are extremely sensitive to root rot in wet conditions','Plant two varieties for cross-pollination (A-type and B-type flower alternating schedules)','Provide windbreak protection — salt and cold wind causes leaf scorch and crop loss','Mulch heavily but keep mulch away from trunk','Young trees need frost protection in year 1–3 even in suitable zones']},
  '🍌':{time:'2–3 hrs',cost:'$60–180',difficulty:'Medium',roi:'High',
    example:'Bananas in tropical and subtropical climates produce a hand of fruit 14–18 months after planting a corm. Each corm produces one harvest then dies, but generates 3–4 daughter corms that continue the cycle indefinitely.',
    steps:['Plant corms in a rich, moisture-retentive, well-drained position in full sun','Feed monthly with high-nitrogen then high-potassium fertiliser as plants mature','Remove all but 1 successor sucker per plant to concentrate growth','Once the flower stalk emerges, remove excess hands from the end of the bunch','Bunch takes 3–6 months to ripen after the flower emerges','Harvest the whole bunch when the first fruits begin to yellow']},
  '🍊':{time:'2–3 hrs',cost:'$80–250',difficulty:'Medium',roi:'High',
    example:'Oranges in zones 9–11 are among the most productive fruit trees — a mature tree produces 200–400 lbs annually for 50+ years. Blood oranges, navels, and valencias cover fresh eating, juicing, and processing.',
    steps:['Plant in full sun with excellent drainage','Citrus need protection from frost even in zone 9 — young trees especially','Feed with citrus fertiliser in spring and midsummer','Water deeply but infrequently — let soil dry between waterings','Thin fruit if the tree sets a very heavy crop to prevent biennial bearing','Leave on tree until needed — citrus holds well on the tree for weeks']},
  '🍒':{time:'2–3 hrs',cost:'$80–200',difficulty:'Medium',roi:'High',
    example:'A self-fertile cherry tree produces 15–50 lbs per year from year 4. Sweet cherries need another variety for cross-pollination unless self-fertile. Morello (sour) cherries are self-fertile and grow on north-facing walls.',
    steps:['Choose a self-fertile variety (Stella, Sunburst) for single-tree planting','Train as a fan against a wall to save space and protect blossom from late frost','Net against birds just as cherries begin to colour','Prune in summer, not winter — cherry trees are susceptible to silver leaf disease through winter wounds','Pick with the stalk attached to avoid fungal entry through the broken skin','Sour cherries (Morello) tolerate shadier conditions than sweet cherries']},
  '🍑':{time:'2–3 hrs',cost:'$80–200',difficulty:'Medium',roi:'High',
    example:'A wall-trained peach or nectarine fan produces 20–40 lbs from a south-facing wall in temperate climates. The wall acts as a thermal mass, protecting blossom from frost and ripening fruit that would not mature in open ground.',
    steps:['Train as a fan against a south-facing wall — essential for temperate climates','Hand pollinate in early spring using a soft brush when blossom opens','Cover blossom with horticultural fleece on frost forecast nights','Thin fruits to 6 inches apart after the natural June drop for large, quality fruit','Water regularly and feed with high-potassium fertiliser from June','Prune immediately after harvest to allow young replacement shoots to mature before winter']},
  '🍐':{time:'2–3 hrs',cost:'$80–200',difficulty:'Medium',roi:'High',
    example:'Pears are more tolerant of heavy, wet soil than apples. A mature pear tree yields 40–150 lbs annually for 50–75 years. Conference is self-fertile; most varieties benefit from a pollination partner.',
    steps:['Most pears need a pollination partner — plant 2 compatible varieties','Pears flower 1–2 weeks earlier than apples — more frost risk to blossom','Train as a cordon or espalier to save space and advance ripening against a wall','Pick pears before they are fully ripe — they ripen from the inside out and are mealy if left on the tree','Store in a cool, dark place and check daily — they go from perfect to overripe in 24–48 hours','Williams and Doyenne du Comice are picked in August–September; Conference in October']},
  '🍄':{time:'2–3 hrs',cost:'$60–180',difficulty:'Medium',roi:'Very High',
    example:'Mulberry trees produce abundant sweet-tart fruits over a 6-week season with zero maintenance once established. The fruit is too delicate to transport commercially, making home-grown mulberries uniquely valuable. Trees live 200+ years.',
    steps:['Plant in a sheltered position — mulberries leaf late and rarely suffer frost damage','Spread a sheet under the tree and shake branches gently to harvest — the fruit stains everything permanently','Feed young trees with a balanced fertiliser in spring until established','Mulberry requires no regular pruning — just remove dead wood in summer','In mild climates, plant the white mulberry (Morus alba) which tolerates heat better','Expect 3–5 years before first significant harvest — mulberries take time to establish']},
  '🥭':{time:'2–3 hrs',cost:'$80–250',difficulty:'Hard',roi:'Very High',
    example:'Mango trees in zones 10–12 produce 100–300 fruits per year when mature. A single mature tree can feed a family through the mango season and generate $300–800 at market. They live 200–300 years.',
    steps:['Plant only in truly frost-free tropical/subtropical climates (zones 10–12)','Choose a grafted variety from a reputable nursery — seed-grown trees take 8+ years to fruit','Young trees are frost-sensitive — protect below 32F for the first 3 years','Water deeply but infrequently — mangoes are drought-tolerant once established','Prune after harvest to control size and encourage uniform new growth for next season flowers','Harvest when the shoulder of the fruit (near the stem) begins to flatten — the fruit will ripen off the tree']},
  '🍍':{time:'2–3 hrs',cost:'$30–80',difficulty:'Medium',roi:'High',
    example:'Pineapples are one of the most space-efficient tropical fruits — each plant occupies 2 sq ft and produces one fruit per 18-month cycle, then a ratoon crop from the suckers. Fresh pineapple is worth $4–8 each.',
    steps:['Propagate from the crown (top) of a shop-bought pineapple — twist off and allow to dry for 2 days before planting','Grow in very well-drained, slightly acid soil or large containers','Requires temperatures above 18C year-round — not suitable outside the tropics without a heated greenhouse','Apply nitrogen fertiliser monthly through the growing season','To force fruiting: place a ripe apple inside the central leaf rosette and cover with a bag for 1 week — ethylene gas triggers flower initiation','Harvest when the fruit turns golden at the base and smells sweet']},
  '🫚':{time:'2–3 hrs',cost:'$60–180',difficulty:'Medium',roi:'High',
    example:'Olive trees in zones 8–11 are near-immortal food plants — some specimens are 2,000+ years old. A mature tree produces 20–40 lbs of olives for curing, or 2–4 litres of cold-pressed oil. Zero maintenance once established.',
    steps:['Plant in full sun with perfect drainage — waterlogged soil is fatal','Incorporate gravel and grit on heavy soils','Olives need 2 months of chilling (below 10C) to initiate flowering — this limits them to Mediterranean and warm temperate climates','Prune every 2–3 years in spring to maintain an open, light-filled canopy','Harvest olives when changing from green to purple (for oil) or fully black (for table olives)','Cure table olives in brine for 3–6 months to remove bitterness']},
  '🫀':{time:'2–3 hrs',cost:'$60–180',difficulty:'Medium',roi:'High',
    example:'Fig trees in sheltered positions produce the most calorie-dense fruit of any temperate tree. A fan-trained fig against a south wall in zone 7–8 produces 40–80 figs per year, worth $30–60 at market.',
    steps:['Restrict roots in a container or by lining the planting pit with slabs — root restriction promotes fruiting over leafy growth','Train as a fan against the warmest wall on the property','Remove any fruit larger than a pea in autumn — they will not survive winter. Small embryo fruits overwinter to become next crop','Pinch out growing tips in late spring when 5–6 leaves have formed to encourage branching','Harvest when fruits hang down, feel soft to gentle pressure, and a drop of nectar appears at the eye','Protect stems and young growth from hard frost with fleece or straw wrapping']},
  '🌊':{time:'1–2 days',cost:'$200–800',difficulty:'Medium',roi:'High',
    example:'A swale (on-contour water-harvesting ditch) passively captures thousands of gallons of rainfall, eliminating irrigation for fruit trees planted on the downslope berm. One day of excavation work creates a 20-year water management asset.',
    steps:['Survey the land with an A-frame level or bunyip (water level) to find the contour lines','Excavate the swale trench on the contour — never at an angle or water will channel and erode','Use excavated soil to build a berm on the downslope side — plant the berm immediately','Plant trees and perennials on the berm where water will collect in the subsoil','Include an overflow spillway at one end to safely route excess water','Allow swale to establish 1 full season before planting intensively around it']},
  '🐝':{time:'4–6 hrs',cost:'$200–600',difficulty:'Hard',roi:'Very High',
    example:'A managed beehive produces 30–80 lbs of honey per year worth $200–600 at farm-gate prices. More importantly, the hive pollinates your food crops within a 2-mile radius, increasing yields by 20–40%. Bees pay for themselves in year 2–3.',
    steps:['Complete a beekeeping course before acquiring bees — the colony and your neighbours will thank you','Start with a Langstroth or National hive and a 3-lb nucleus colony in spring','Place the hive in morning sun, afternoon shade, with a clear flight path to water','Inspect every 7–10 days in spring and summer to monitor for swarm preparations','Leave at least 40 lbs of honey in the hive for winter food — do not over-harvest','Join a local beekeeping association for disease identification training and mentorship']},
};

function climateFruitTree(zone?:string):string{
  switch(zone){
    case 'Subtropical': return '🍌';
    case 'Arid':        return '🍋';
    case 'Cold':        return '🍐';
    default:            return '🍎';
  }
}
const FRUIT_TREE_EMOJIS=new Set(['🌳']); // Only generic tree resolves to climate tree — specific trees show own data

function getFeatureInfo(emoji:string,fv:Partial<FormData>,score:number){
  const resolved=FRUIT_TREE_EMOJIS.has(emoji)?climateFruitTree(fv.climateZone):emoji;
  const lib=ICON_LOOKUP.get(resolved)??ICON_LOOKUP.get(emoji);
  const autoCost=lib?`$${Math.round((lib.costMin+lib.costMax)/2).toLocaleString()}`:'Varies';
  const data=featureDB[resolved]??featureDB[emoji]??{time:'Varies',cost:autoCost,difficulty:'Easy',roi:'Medium',example:'A valuable addition to any regenerative homestead.',steps:['Follow blueprint layout','Integrate with ecosystem','Monitor seasonally']};
  const name=lib?.name??'Feature';
  const context=`${fv.climateZone??'Temperate'} climate · ${Math.max(1,Number(fv.familySize)||4)}-person household · $${(fv.budget??2800).toLocaleString()} budget · Score: ${score}`;
  return {...data,name,context,resolved};
}

/* ==== SEASONAL DATA ==== */
const SEASONAL:Record<string,{label:string;hex:string;activities:string[];plantNow:string[]}[]>={
  Temperate:[
    {label:'Spring',hex:'#4ade80',activities:['Start seedlings indoors (6–8 wks before last frost)','Prune dormant fruit trees before bud break','Direct sow cool-season crops: lettuce, spinach, peas','Install rain tanks before spring rains begin'],plantNow:['🥬','🌱','🍃','🔴']},
    {label:'Summer',hex:'#facc15',activities:['Harvest tomatoes, zucchini, beans daily to encourage yield','Deep mulch all beds 3 in to conserve moisture','Monitor rain tank levels; connect drip irrigation','Harvest and dry herbs before they go to seed'],plantNow:['🍅','🥒','🫘','🌽']},
    {label:'Autumn',hex:'#fb923c',activities:['Plant garlic (Oct–Nov for spring harvest)','Build compost pile with fallen leaves + kitchen scraps','Collect and dry seeds from open-pollinated varieties','Plant cover crops: crimson clover, winter rye'],plantNow:['🧄','🥬','🌾','🍀']},
    {label:'Winter',hex:'#93c5fd',activities:['Plan next season layout — order seeds by January','Repair and build infrastructure (raised beds, fencing)','Process and ferment stored harvest (kimchi, pickles)','Prune fruit trees while fully dormant'],plantNow:[]},
  ],
  Arid:[
    {label:'Spring',hex:'#4ade80',activities:['Plant heat-loving crops early before summer heat','Install shade cloth on raised beds','Deep water all perennials before dry season','Fill rain tanks and check overflow diverters'],plantNow:['🌶️','🍅','🫑','🥒']},
    {label:'Summer',hex:'#facc15',activities:['Water only pre-dawn to minimize evaporation','Harvest drought-tolerant crops: beans, corn, squash','Apply 4 in mulch — critical for water retention','Swale maintenance: check for erosion and overflow'],plantNow:[]},
    {label:'Autumn',hex:'#fb923c',activities:['Prime planting season — moderate temps, some rain','Establish all perennials, fruit trees, berry bushes','Rainwater system prep before winter rains','Direct sow cool-season crops: greens, root veg'],plantNow:['🧄','🥬','🌾','🍀']},
    {label:'Winter',hex:'#93c5fd',activities:['Peak growing season in warm arid climates','Harvest citrus, root vegetables, leafy greens','Soil building: top dress all beds with compost','Infrastructure projects in mild weather'],plantNow:['🥬','🌱','🥕','🫛']},
  ],
  Subtropical:[
    {label:'Spring',hex:'#4ade80',activities:['Pest pressure rises — inspect crops weekly','Tend tropical fruit trees: mango, avocado, banana','Check water systems before wet season','Succession plant fast crops every 2 weeks'],plantNow:['🌶️','🍅','🫑','🥒']},
    {label:'Summer',hex:'#facc15',activities:['Wet season — harvest before fungal pressure builds','Prune canopy to improve airflow and reduce disease','Collect and ferment harvest: hot sauce, preserves','Monitor compost moisture — may need covering'],plantNow:[]},
    {label:'Autumn',hex:'#fb923c',activities:['Best planting season — cool, dry conditions','Establish all major food crops and perennials','Water system prep for dry season ahead','Root crop and brassica planting time'],plantNow:['🧄','🥬','🌾','🍀']},
    {label:'Winter',hex:'#93c5fd',activities:['Dry season — best growing conditions','Harvest root vegetables, citrus (🍊🍋), leafy greens','Harvest avocado (🥑) and mango (🥭) in peak season','Best time for soil building and earthworks'],plantNow:['🥬','🌱','🥕','🫛']},
  ],
  Cold:[
    {label:'Spring',hex:'#4ade80',activities:['Watch last frost dates — use row covers for protection','Start seeds in greenhouse or cold frames','Maple sap season — tap before bud break','Plant cold-hardy crops as soon as soil thaws'],plantNow:['🥬','🌱','🍃','🔴']},
    {label:'Summer',hex:'#facc15',activities:['Intensive harvests — short season, maximize production','Preserve and ferment: pickles, jam, dehydrated herbs','Rotate animals on pasture to fertilize sections','Build and repair all infrastructure for winter'],plantNow:['🍅','🥒','🫘','🌽']},
    {label:'Autumn',hex:'#fb923c',activities:['Stock root cellar: potatoes, carrots, beets, squash','Plant garlic for spring — best done before hard frost','Canning, dehydrating, and fermentation in full swing','Winterize water systems: drain tanks and pipes'],plantNow:['🥬','🥕','🍀']},
    {label:'Winter',hex:'#93c5fd',activities:['Animal care focus — increased feed and bedding needs','Seed catalog planning and next-year layout design','Fermentation projects: sourdough, sauerkraut, kombucha','Tool sharpening, repair, and maintenance'],plantNow:[]},
  ],
  Tropical:[
    {label:'Wet Season',hex:'#4ade80',activities:['Plant fast-growing leafy greens between heavy rains','Ensure drainage channels are clear — waterlogging kills roots','Harvest bananas, papaya, and passionfruit as they ripen','Mulch heavily to prevent soil nutrient leaching from rain'],plantNow:['🥬','🍃','🫘','🍌']},
    {label:'Dry Season',hex:'#facc15',activities:['Irrigate consistently — this is the main growing window','Plant tomatoes, peppers, and eggplant in the cooler dry months','Establish new fruit trees while you can control watering','Harvest and cure root crops like sweet potato and cassava'],plantNow:['🍅','🌶️','🍠','🥑']},
    {label:'Build-Up',hex:'#fb923c',activities:['Prepare beds and drainage before the rains return','Plant cover crops to protect soil from heavy downpours','Prune fruit trees after harvest, before new growth flush','Stock up on mulch material for the wet season ahead'],plantNow:['🌾','🍂','🌱','🥭']},
    {label:'Cool Dry',hex:'#22d3ee',activities:['Best window for most vegetables in tropical highlands','Plant brassicas and salad crops in the cooler temperatures','Harvest citrus and establish pineapple crowns','Year-round herbs thrive — harvest and propagate continuously'],plantNow:['🥦','🥗','🍊','🍍']},
  ],
};

/* ==== PERSISTENCE ==== */


interface Blueprint{id:string;name:string;type:'property'|'garden'|'raised-bed';tiles:{id:number;icon:string}[];gridCols:number;gridCount:number;rotation:{x:number;y:number};notes:string;
  /** For raised-bed type: the tile id on the property map that spawned this bed */
  sourceTileId?:number;
  /** For raised-bed type: which property blueprint owns this bed */
  sourceBpId?:string;
}
function newBP(type:'property'|'garden'|'raised-bed',name?:string):Blueprint{
  const isP=type==='property';
  const isRB=type==='raised-bed';
  return{id:`${type}-${Date.now()}-${Math.random().toString(36).slice(2,7)}`,name:name??(isP?'Property Map':isRB?'Raised Bed':'Garden Map'),type,tiles:[],gridCols:isP?6:isRB?8:4,gridCount:isP?36:isRB?32:16,rotation:{x:-22,y:28},notes:''};
}
/** Create one raised-bed blueprint for a given property tile slot */
function newRaisedBed(sourceBpId:string,tileId:number,bedNumber:number):Blueprint{
  return{
    id:`raised-bed-${sourceBpId}-${tileId}`,
    name:`Raised Bed ${bedNumber}`,
    type:'raised-bed',
    tiles:[],
    gridCols:8,
    gridCount:32,
    rotation:{x:-22,y:28},
    notes:'',
    sourceTileId:tileId,
    sourceBpId,
  };
}
/** Features that belong on the Property Map only — cannot be placed inside a raised bed */
const RAISED_BED_BLOCKED = new Set([
  '🌱', // Raised Bed itself (no nesting)
  // Structures & infrastructure
  '🏡','🪣','☀️','🌬️','🔋','⚡','🚿',
  // Large water features
  '🌊','🌧️','🐟','🪷',
  // Animals
  '🐔','🦆','🐐','🐖','🐇',
  // Large trees (property-scale) — all fruit trees blocked from raised beds
  '🌳','🌲','🌴','🍎','🥑','🍌','🍄','🍋','🥭','🍑','🍐','🫚','🍊','🍒','🫀',
  // Soil systems (property-scale)
  '♻️','🌾','🍂','🪱',
  // Biodiversity structures
  '🐝','🦇','🐛','🐦',
]);
/** Icons that go in raised beds — food crops, herbs, flowers suitable for beds */
const RAISED_BED_ALLOWED_HINT = '🥕🍅🥒🌽🥬🍀🍃🫛🧄🧅🥔🎃🫑🍆🌶️🫘🥦🥗🌿🪴🔴🍓🍉🍈🍍🌸🌻💜🧡💙🌸🌟🔔🏵️🟠🌠✿🌼🌺';

/**
 * Keeps raised-bed blueprints in sync with 🌱 tiles on all property maps.
 * - Adds a raised-bed bp for each new 🌱 tile (preserving existing bed content).
 * - Removes raised-bed bps whose source 🌱 tile no longer exists.
 * - Re-numbers bed names sequentially (Raised Bed 1, 2, 3 …).
 */
function syncRaisedBedsToPropertyTiles(bps:Blueprint[]):Blueprint[]{
  const propBps=bps.filter(b=>b.type==='property');
  const existingBeds=bps.filter(b=>b.type==='raised-bed');
  const otherBps=bps.filter(b=>b.type!=='property'&&b.type!=='raised-bed');

  // Collect all (sourceBpId, tileId) combos that should have a bed
  const wanted:Array<{sourceBpId:string;tileId:number}>=[];
  propBps.forEach(prop=>{
    prop.tiles.filter(t=>t.icon==='🌱').forEach(t=>{
      wanted.push({sourceBpId:prop.id,tileId:t.id});
    });
  });

  // Build a map of existing beds keyed by their canonical id
  const bedById=new Map<string,Blueprint>(existingBeds.map(b=>[b.id,b]));

  // Build the new raised-bed list, preserving content for surviving beds
  let bedNum=0;
  const newBeds:Blueprint[]=wanted.map(({sourceBpId,tileId})=>{
    bedNum++;
    const canonId=`raised-bed-${sourceBpId}-${tileId}`;
    const existing=bedById.get(canonId);
    if(existing){
      // Preserve user-placed tiles but update sequential name only if still default
      const isDefault=/^Raised Bed \d+$/.test(existing.name);
      return{...existing,name:isDefault?`Raised Bed ${bedNum}`:existing.name};
    }
    return newRaisedBed(sourceBpId,tileId,bedNum);
  });

  return [...propBps,...newBeds,...otherBps];
}


/* ==== LOCAL AUTOSAVE ==== */
const STORAGE_KEY='terraforge-v8';
function loadSaved(){
  if(typeof window==='undefined')return null;
  try{
    const r=localStorage.getItem(STORAGE_KEY);
    if(r)return JSON.parse(r);
    return null;
  }catch{return null;}
}

// Module-level blueprint constants with fixed IDs
const DEFAULT_PROP_BP:Blueprint={id:'tf-prop-1',name:'Property Map 1',type:'property',tiles:[{id:0,icon:'🌱'}],gridCols:6,gridCount:36,rotation:{x:-22,y:28},notes:''};
const EMPTY_PROP_BP:Blueprint={id:'tf-prop-1',name:'Property Map 1',type:'property',tiles:[],gridCols:6,gridCount:36,rotation:{x:-22,y:28},notes:''};
// Default state: property map with 1 raised bed pre-placed.
// syncRaisedBedsToPropertyTiles will create the corresponding 'raised-bed' blueprint on mount.
const DEFAULT_BLUEPRINTS:Blueprint[]=[DEFAULT_PROP_BP];
const DEMO_BLUEPRINTS:Blueprint[]=[
  {id:'tf-prop-1',name:'Sample Homestead',type:'property',
   tiles:[
     {id:0,icon:'🏡'},{id:1,icon:'🍅'},{id:2,icon:'🥬'},{id:3,icon:'🥕'},
     {id:6,icon:'🌱'},{id:7,icon:'🍎'},{id:8,icon:'🍐'},{id:9,icon:'☀️'},
     {id:12,icon:'💧'},{id:13,icon:'🐔'},{id:14,icon:'♻️'},{id:15,icon:'🌼'},
     {id:18,icon:'🫐'},{id:19,icon:'🍓'},{id:20,icon:'🌿'},{id:21,icon:'🐝'},
   ],
   gridCols:6,gridCount:36,rotation:{x:-22,y:28},notes:''},
];
// Reset state: fully empty — score 0, no tiles, no raised beds until user adds them
const RESET_BLUEPRINTS:Blueprint[]=[EMPTY_PROP_BP];

/* ==== PDF EXPORT ==== */
/* ==== HTML ESCAPE ==== */
function escHTML(s:string):string{
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

function exportAsPDF(blueprints:Blueprint[],calc:CalcResult,fv:Partial<any>,apiBlueprint:any){
  const ex=document.getElementById('tf-print-root');if(ex)ex.remove();

  const date  = new Date().toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'});
  const acres = ((Number(fv.yardSqFt)||0)/43560).toFixed(2);
  const zone  = fv.climateZone??'Temperate';
  const famN  = Math.max(1,Number(fv.familySize)||4);
  const fam   = String(famN);
  const bud   = (fv.budget??0).toLocaleString();
  const sqft  = (Number(fv.yardSqFt)||0).toLocaleString();
  const prompt= (fv.prompt??'').slice(0,280);
  const sorted=[...blueprints].sort((a,b)=>a.type===b.type?0:a.type==='property'?-1:1);
  const propBps=sorted.filter(b=>b.type==='property');
  const raisedBedBpsPDF=sorted.filter(b=>b.type==='raised-bed');

  // Palette
  const G='#00a86b';const G2='#006b44';const GL='#eafaf2';
  const B='#0091c2';const BL='#e6f4fb';
  const A='#c47a00';const AL='#fdf3e0';
  const LM='#4d8c00';const RO='#c43060';const SO='#8a5c00';
  const INK='#111f17';const GR='#5a6e60';
  const BD='#d0e8d8';const WH='#ffffff';const BG='#f6fbf8';
  const CAT_C:Record<string,string>={food:G,water:B,energy:A,soil:SO,biodiversity:LM,animals:'#b05000',flowers:RO};

  // Layout constants -- declared first so all helpers can reference them
  const PAGE_W=1020; // render width in px
  const PGPAD=36;    // horizontal padding used everywhere

  // Page counter
  const totalPages=3+sorted.length+1;
  let pn=0;const np=()=>{pn++;return pn;};

  // -- pageShell: wraps every page with consistent nav + footer --
  // PAGE_STYLE: no class attribute -- 100% inline styles
  // so Tailwind/Next.js CSS resets cannot touch any element.
  const PAGE_STYLE='display:flex;flex-direction:column;width:'+PAGE_W+'px;'
    +'background:#ffffff;font-family:Inter,system-ui,Helvetica,Arial,sans-serif;'
    +'color:#111f17;overflow:visible;';
  const NAV_STYLE='display:flex;align-items:center;justify-content:space-between;'
    +'background:'+INK+';padding:8px '+PGPAD+'px;flex-shrink:0;';
  const BODY_STYLE='padding:'+PGPAD+'px;flex:1;min-height:0;';
  const FOOT_STYLE='padding:7px '+PGPAD+'px;border-top:1px solid '+BD+';'
    +'display:flex;align-items:center;justify-content:space-between;flex-shrink:0;';
  const FLEX_ROW='display:flex;align-items:center;';

  const pageShell=(content:string,title:string,pg:number)=>
    '<div style="'+PAGE_STYLE+'">'
    // Top nav bar -- no class, pure inline
    +'<div style="'+NAV_STYLE+'">'
    +'<div style="'+FLEX_ROW+'gap:7px">'
    +'<span style="font-size:12px;line-height:1">&#127807;</span>'
    +'<span style="font-size:9px;font-weight:700;letter-spacing:.18em;color:'+G+';text-transform:uppercase">TerraForge</span>'
    +'<span style="color:rgba(255,255,255,0.18);margin:0 3px;font-size:9px">&#124;</span>'
    +'<span style="font-size:9px;font-weight:500;color:rgba(255,255,255,0.40);text-transform:uppercase;letter-spacing:.06em">'+title+'</span>'
    +'</div>'
    +'<div style="'+FLEX_ROW+'gap:8px">'
    +'<span style="font-size:9px;color:rgba(255,255,255,0.28)">'+date+'</span>'
    +'<div style="background:rgba(0,168,107,0.18);border:1px solid rgba(0,168,107,0.35);border-radius:99px;padding:2px 9px;font-size:9px;font-weight:700;color:'+G+'">'+pg+' / '+totalPages+'</div>'
    +'</div>'
    +'</div>'
    // Content area
    +'<div style="'+BODY_STYLE+'">'
    +content
    +'</div>'
    // Bottom bar
    +'<div style="'+FOOT_STYLE+'">'
    +'<span style="font-size:9px;color:#9aaa9a">Regenerative Home Blueprint &middot; '+date+'</span>'
    +'<span style="font-size:9px;color:#9aaa9a">Score: <strong style="color:'+G+'">'+calc.resilienceScore+'/98</strong></span>'
    +'</div>'
    +'</div>';

  // -- Shared micro helpers --------------------------------------
  const secLabel=(txt:string,color=G2)=>
    '<div style="display:flex;align-items:center;gap:7px;margin-bottom:12px">'
    +'<div style="width:3px;height:16px;background:'+color+';border-radius:2px;flex-shrink:0"></div>'
    +'<span style="font-size:10px;font-weight:800;color:'+color+';text-transform:uppercase;letter-spacing:.11em">'+txt+'</span>'
    +'</div>';

  const divider=()=>'<div style="height:1px;background:'+BD+';margin:16px 0"></div>';

  const statTile=(val:string,lbl:string,sub:string,c:string)=>
    '<div style="background:'+WH+';border:1px solid '+BD+';border-radius:11px;padding:13px 11px;border-top:3px solid '+c+';box-shadow:0 1px 4px rgba(0,0,0,0.05)">'
    +'<div style="font-size:18px;font-weight:900;color:'+c+';line-height:1.1;margin-bottom:2px">'+val+'</div>'
    +(sub?'<div style="font-size:9px;color:'+GR+';margin-bottom:4px;line-height:1.3">'+sub+'</div>':'')
    +'<div style="font-size:8px;font-weight:700;color:#b0b8b4;text-transform:uppercase;letter-spacing:.08em">'+lbl+'</div>'
    +'</div>';

  const sBar=(lbl:string,val:number,max:number,c:string,sub='')=>{
    const w=Math.round(Math.min(100,(val/max)*100));
    return '<div style="margin-bottom:11px">'
      +'<div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:3px">'
      +'<span style="font-size:10.5px;font-weight:600;color:'+INK+'">'+lbl+'</span>'
      +'<span style="font-size:10.5px;font-weight:800;color:'+c+'">'+val+(sub?' '+sub:'')+'</span>'
      +'</div>'
      +'<div style="height:7px;background:#e4ede6;border-radius:99px;overflow:hidden">'
      +'<div style="height:7px;width:'+w+'%;background:'+c+';border-radius:99px"></div>'
      +'</div></div>';
  };

  const kvRow=(l:string,v:string,c:string,s=false)=>
    '<div style="display:flex;justify-content:space-between;align-items:center;padding:7px 12px;background:'+(s?BG:WH)+';border-bottom:1px solid '+BD+'">'
    +'<span style="font-size:11px;color:'+GR+'">'+l+'</span>'
    +'<span style="font-size:11.5px;font-weight:700;color:'+c+'">'+v+'</span>'
    +'</div>';

  const catTag=(txt:string,c:string)=>
    '<span style="display:inline-block;padding:1px 7px;border-radius:99px;font-size:8.5px;font-weight:700;background:'+c+'16;color:'+c+';border:1px solid '+c+'28;text-transform:uppercase;letter-spacing:.04em">'+txt+'</span>';

  // ========================================================
  // PAGE 1 -- COVER
  // ========================================================
  const pg1=np();
  const scoreStatus=calc.resilienceScore>=70?'Self-Sustaining':calc.resilienceScore>=40?'Developing':'Early Stage';

  const toc=[
    ['&#128202;','Page 2','System Performance','Scores, ROI projections, and savings analysis'],
    ['&#127807;','Page 3','Features &amp; Recommendations','Full feature table and personalized action plan'],
    ...propBps.map((bp,i):string[]=>['&#127968;','Page '+(4+i),escHTML(bp.name),'Property map with full feature breakdown']),
    ...raisedBedBpsPDF.map((bp,i):string[]=>['&#127807;','Page '+(4+propBps.length+i),escHTML(bp.name),'Raised bed with planted crops breakdown']),
    ['&#10003;','Page '+totalPages,'Summary','Final score and closing overview'],
  ];

  const coverContent=
    // Dark hero
    '<div style="background:'+INK+';padding:28px '+PGPAD+'px 24px;margin:-'+PGPAD+'px -'+PGPAD+'px 18px;position:relative;overflow:hidden">'
    +'<div style="position:absolute;right:-60px;top:-60px;width:240px;height:240px;border-radius:50%;border:48px solid rgba(0,168,107,0.07)"></div>'
    +'<div style="position:absolute;left:-20px;bottom:-50px;width:150px;height:150px;border-radius:50%;border:30px solid rgba(0,168,107,0.04)"></div>'
    // Wordmark
    +'<div style="display:flex;align-items:center;gap:8px;margin-bottom:22px">'
    +'<span style="font-size:17px">&#127807;</span>'
    +'<span style="font-size:10px;font-weight:800;letter-spacing:.22em;color:'+G+';text-transform:uppercase">TerraForge</span>'
    +'<div style="flex:1;height:1px;background:rgba(255,255,255,0.08);margin:0 8px"></div>'
    +'<span style="font-size:9px;color:rgba(255,255,255,0.28);letter-spacing:.1em">Regenerative Design System</span>'
    +'</div>'
    // Title + score circle
    +'<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:24px">'
    +'<div style="flex:1">'
    +'<h1 style="font-size:36px;font-weight:900;color:'+WH+';margin:0 0 8px;line-height:1.05;letter-spacing:-.02em">Regenerative<br>Home Blueprint</h1>'
    +'<p style="font-size:11px;color:rgba(255,255,255,0.38);margin:0 0 17px">Generated '+date+'</p>'
    +'<div style="display:flex;flex-wrap:wrap;gap:6px">'
    +[['&#127968;',sqft+' sq ft ('+acres+' ac)'],['&#128101;',fam+' people'],['&#127780;',zone],['&#128176;','$'+bud+' budget']]
      .map(([ic,vl])=>'<div style="display:inline-flex;align-items:center;gap:5px;padding:4px 10px;background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.10);border-radius:99px">'
        +'<span style="font-size:11px">'+ic+'</span>'
        +'<span style="font-size:9.5px;color:rgba(255,255,255,0.65);font-weight:500">'+vl+'</span>'
        +'</div>').join('')
    +'</div>'
    +'</div>'
    // Score circle
    +'<div style="flex-shrink:0;text-align:center">'
    +'<div style="width:104px;height:104px;border-radius:50%;border:4px solid '+G+';display:flex;flex-direction:column;align-items:center;justify-content:center;background:rgba(15,23,42,0.05);box-shadow:0 0 0 10px '+G+'18">'
    +'<div style="font-size:30px;font-weight:900;color:'+G+';line-height:1">'+calc.resilienceScore+'</div>'
    +'<div style="font-size:8px;color:rgba(255,255,255,0.28)">/98</div>'
    +'</div>'
    +'<div style="margin-top:7px;font-size:8.5px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:'+G+'">'+scoreStatus+'</div>'
    +'</div>'
    +'</div>'
    // Goal
    +(prompt?'<div style="margin-top:17px;padding:10px 13px;background:rgba(0,168,107,0.09);border:1px solid rgba(0,168,107,0.22);border-radius:8px">'
      +'<div style="font-size:8px;font-weight:800;letter-spacing:.16em;color:'+G+';text-transform:uppercase;margin-bottom:3px">Your Goal</div>'
      +'<p style="margin:0;font-size:11px;color:rgba(255,255,255,0.55);line-height:1.6;font-style:italic">&ldquo;'+escHTML(prompt)+(prompt.length>=280?'&hellip;':'')+'&rdquo;</p>'
      +'</div>':'')
    +'</div>'

    // Table of contents
    +secLabel("What's Inside This Export")
    +'<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:17px">'
    +toc.map(([ic,pg,ttl,desc])=>
      '<div style="display:flex;gap:9px;padding:9px 11px;background:'+BG+';border:1px solid '+BD+';border-radius:9px;align-items:flex-start">'
      +'<span style="font-size:15px;flex-shrink:0">'+ic+'</span>'
      +'<div>'
      +'<div style="font-size:9.5px;font-weight:800;color:'+G2+'">'+pg+' &mdash; '+ttl+'</div>'
      +'<div style="font-size:9px;color:'+GR+';margin-top:1px">'+desc+'</div>'
      +'</div></div>'
    ).join('')
    +'</div>'

    // Blueprint summary cards
    +secLabel('Blueprint Summary')
    +'<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">'
    +sorted.filter(bp=>bp.type!=='garden').map(bp=>{
      const bc=calculateFromTiles(bp.tiles,famN);
      const isProp=bp.type==='property';
      const isRB=bp.type==='raised-bed';
      const AC=isProp?G2:B;const LT=isProp?GL:BL;
      return '<div style="border:1px solid '+AC+'28;border-radius:10px;overflow:hidden">'
        +'<div style="background:'+AC+';padding:9px 13px;display:flex;justify-content:space-between;align-items:center">'
        +'<div>'
        +'<div style="font-size:12.5px;font-weight:800;color:'+WH+'">'+escHTML(bp.name)+'</div>'
        +'<div style="font-size:9px;color:rgba(255,255,255,0.50)">'+bp.tiles.length+' features &middot; '+bp.gridCols+'&times;'+bp.gridCols+' grid</div>'
        +'</div>'
        +'<span style="background:rgba(255,255,255,0.15);color:'+WH+';border-radius:99px;padding:2px 8px;font-size:8.5px;font-weight:700;letter-spacing:.06em">'+(isProp?'PROPERTY':isRB?'RAISED BED':'MAP')+'</span>'
        +'</div>'
        +'<div style="padding:9px;display:grid;grid-template-columns:repeat(3,1fr);gap:5px;background:'+LT+'">'
        +[['&#127806;',bc.totalYieldLbs.toLocaleString()+' lbs','Yield'],['&#128167;',bc.totalWaterGal.toLocaleString()+' gal','Water'],['&#128176;','$'+bc.year1Savings.toLocaleString()+'/yr','Savings']]
          .map(([em,vl,lb])=>'<div style="text-align:center;padding:7px 4px;background:'+WH+';border-radius:7px;border:1px solid '+AC+'18">'
            +'<div style="font-size:13px;line-height:1.3">'+em+'</div>'
            +'<div style="font-size:11.5px;font-weight:700;color:'+AC+'">'+vl+'</div>'
            +'<div style="font-size:7.5px;color:'+GR+';text-transform:uppercase;letter-spacing:.06em">'+lb+'</div>'
            +'</div>').join('')
        +'</div></div>';
    }).join('')
    +'</div>';

  const page1=pageShell(coverContent,'Cover',pg1);

  // ========================================================
  // PAGE 2 -- SYSTEM PERFORMANCE + ROI
  // ========================================================
  const pg2=np();
  const p2=
    secLabel('Combined System Performance')
    +'<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:7px;margin-bottom:16px">'
    +[['Regen Score',calc.resilienceScore+'/98',calc.resilienceScore>=70?'Self-Sustaining':calc.resilienceScore>=40?'Developing':'Early Stage',G],
      ['Annual Yield',calc.totalYieldLbs.toLocaleString()+' lbs','feeds ~'+Math.round(calc.totalYieldLbs/FOOD_NEED*10)/10+' people/yr',G],
      ['Water Saved',calc.totalWaterGal.toLocaleString()+' gal',calc.waterSavingsPct+'% of irrigation budget',B],
      ['CO2 Offset',calc.totalCo2Lbs.toLocaleString()+' lbs/yr',Math.round(calc.totalCo2Lbs*1.31).toLocaleString()+' fewer miles driven',A],
      ['Food Self-Suff.',calc.foodSelfSufficiencyPct+'%',calc.totalYieldLbs.toLocaleString()+' of '+(famN*FOOD_NEED).toLocaleString()+' lbs needed',G2],
      ['Biodiversity',calc.biodiversityScore+'/100',calc.biodiversityScore>=60?'Thriving':calc.biodiversityScore>=30?'Growing':'Minimal',LM],
      ['Year 1 Savings','$'+calc.year1Savings.toLocaleString(),'~$'+Math.round(calc.year1Savings/12).toLocaleString()+'/month',G2],
      ['Payback',calc.paybackYears>0?calc.paybackYears+' yrs':'N/A',calc.paybackYears>0?'then $'+calc.year1Savings.toLocaleString()+'/yr profit':'add more features',A],
    ].map(([l,v,s,c])=>statTile(v as string,l as string,s as string,c as string)).join('')
    +'</div>'
    +divider()
    +secLabel('Score Breakdown')
    +'<div style="background:'+BG+';border:1px solid '+BD+';border-radius:11px;padding:16px 18px 5px;margin-bottom:16px">'
    +'<div style="display:grid;grid-template-columns:1fr 1fr;gap:1px 44px">'
    +sBar('Food Self-Sufficiency',calc.foodSelfSufficiencyPct,100,G,'%')
    +sBar('Water Independence',calc.waterSavingsPct,100,B,'%')
    +sBar('Biodiversity Score',calc.biodiversityScore,100,LM,'/ 100')
    +sBar('CO2 Impact',Math.min(100,Math.round((calc.totalCo2Lbs/600)*100)),100,A,'/ 100%')
    +sBar('Regeneration Score',calc.resilienceScore,98,G2,'/ 98')
    +'</div></div>'
    +divider()
    +'<div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">'
    +'<div>'
    +secLabel('Return on Investment',LM)
    +'<div style="border:1px solid '+BD+';border-radius:10px;overflow:hidden">'
    +[['Setup Cost','$'+calc.estimatedCostMin.toLocaleString(),GR,false],
      ['Year 1 Return','$'+calc.year1Savings.toLocaleString()+' /yr',G,true],
      ['Payback Period',calc.paybackYears>0?calc.paybackYears+' yrs':'N/A',A,false],
      ['5-Year Return','$'+Math.round(calc.year1Savings*((Math.pow(1.03,5)-1)/0.03)).toLocaleString(),G2,true],
      ['10-Year Return','$'+Math.round(calc.year1Savings*((Math.pow(1.03,10)-1)/0.03)).toLocaleString(),G2,false],
      ['20-Year Return','$'+Math.round(calc.year1Savings*((Math.pow(1.03,20)-1)/0.03)).toLocaleString(),G,true],
    ].map(([l,v,c,s])=>kvRow(l as string,v as string,c as string,s as boolean)).join('')
    +'</div></div>'
    +'<div>'
    +secLabel('Savings Methodology',B)
    +'<div style="background:'+BL+';border:1px solid '+B+'22;border-radius:10px;padding:13px 15px">'
    +[['&#127806;','Food value: $0.80/lb produce · $3.00–8.00/lb animal products (eggs, honey, meat, dairy)'],
      ['&#128167;','Water offset: $0.005 per gallon saved or captured'],
      ['&#9889;','Solar panel: $200/yr energy offset + CO₂ credits (1kW system)'],
      ['&#127788;','Wind turbine: $200/yr energy offset + CO₂ credits (1kW turbine)'],
      ['&#128267;','Solar battery: $120/yr peak-rate arbitrage savings'],
      ['&#9889;','Solar pump: $60/yr pumping cost offset'],
      ['&#127807;','Carbon benefit: $0.023 per lb CO₂ (~$50/tonne, voluntary market rate)'],
      ['&#128200;','~3% annual compounding on returns (conservative real-world benchmark)'],
    ].map(([ic,tx])=>'<div style="display:flex;gap:8px;margin-bottom:8px;align-items:flex-start">'
      +'<span style="font-size:13px;width:18px;flex-shrink:0">'+ic+'</span>'
      +'<span style="font-size:10.5px;color:#2a4a5a;line-height:1.55">'+tx+'</span>'
      +'</div>').join('')
    +'</div></div></div>';
  const page2html=pageShell(p2,'System Performance',pg2);

  // ========================================================
  // PAGE 3 -- FEATURE TABLE + RECS + SEASONAL
  // ========================================================
  const pg3=np();
  const p3=
    (calc.featureBreakdown.length>0
      ?secLabel('All Features - Value Breakdown')
        +'<div style="border:1px solid '+BD+';border-radius:10px;overflow:hidden;margin-bottom:16px">'
        +'<table style="width:100%;border-collapse:collapse">'
        +'<thead><tr style="background:'+GL+'">'
        +['Feature','Category','Yield','Water','CO2','Value/yr'].map((h,i)=>
          '<th style="padding:7px 9px;font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.07em;color:'+G2+';text-align:'+(i>=2?'right':'left')+'">'+h+'</th>'
        ).join('')
        +'</tr></thead><tbody>'
        +calc.featureBreakdown.map((f,i)=>{
          const cnt=(()=>{const allT=blueprints.flatMap((b:any)=>b.tiles);return allT.filter((t:any)=>t.icon===f.emoji).length||1;})();
          const energySavPer=(f.emoji==='☀️'?200:f.emoji==='🌬️'?200:f.emoji==='🔋'?120:f.emoji==='⚡'?60:0);
          const animalRatePDF:Record<string,number>={'🐔':3.30,'🦆':3.30,'🐐':1.25,'🐖':3.00,'🐇':3.00,'🐝':8.00};
          const foodRatePDF=animalRatePDF[f.emoji]??0.8;
          const ev=Math.round((f.yieldLbs*foodRatePDF+f.waterGal*0.005+f.co2*0.023+energySavPer)*cnt);
          const cat=ICON_LOOKUP.get(f.emoji)?.category??'';
          const cc=CAT_C[cat]??GR;
          return '<tr style="background:'+(i%2===0?WH:BG)+'">'
            +'<td style="padding:7px 9px;font-size:11px;font-weight:600;color:'+INK+'">'+f.emoji+' '+f.name+(cnt>1?' <span style="font-weight:400;color:'+GR+'">&times;'+cnt+'</span>':'')+'</td>'
            +'<td style="padding:7px 9px">'+catTag(cat,cc)+'</td>'
            +'<td style="padding:7px 9px;font-size:10.5px;color:'+G+';text-align:right;font-weight:700">'+(f.yieldLbs>0?f.yieldLbs*cnt+' lbs':'&#8212;')+'</td>'
            +'<td style="padding:7px 9px;font-size:10.5px;color:'+B+';text-align:right;font-weight:700">'+(f.waterGal>0?f.waterGal*cnt+' gal':'&#8212;')+'</td>'
            +'<td style="padding:7px 9px;font-size:10.5px;color:'+A+';text-align:right;font-weight:700">'+(f.co2>0?f.co2*cnt+' lbs':'&#8212;')+'</td>'
            +'<td style="padding:7px 9px;font-size:11px;color:'+G2+';text-align:right;font-weight:800">'+(ev>0?'$'+ev:'&#8212;')+'</td>'
            +'</tr>';
        }).join('')
        +'</tbody><tfoot><tr style="background:'+GL+'">'
        +'<td colspan="2" style="padding:8px 9px;font-size:10.5px;font-weight:900;color:'+INK+'">TOTALS</td>'
        +'<td style="padding:8px 9px;font-size:10.5px;font-weight:800;color:'+G+';text-align:right">'+calc.totalYieldLbs.toLocaleString()+' lbs</td>'
        +'<td style="padding:8px 9px;font-size:10.5px;font-weight:800;color:'+B+';text-align:right">'+calc.totalWaterGal.toLocaleString()+' gal</td>'
        +'<td style="padding:8px 9px;font-size:10.5px;font-weight:800;color:'+A+';text-align:right">'+calc.totalCo2Lbs.toLocaleString()+' lbs</td>'
        +'<td style="padding:8px 9px;font-size:11px;font-weight:800;color:'+G2+';text-align:right">$'+calc.year1Savings+'</td>'
        +'</tr></tfoot></table></div>'
      :'')
    +divider()
    +'<div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">'
    +'<div>'
    +secLabel('Personalized Recommendations')
    +(apiBlueprint?.recommendations?.length
      ?apiBlueprint.recommendations.slice(0,5).map((r:string,i:number)=>
          '<div style="display:flex;gap:9px;margin-bottom:7px;align-items:flex-start">'
          +'<div style="min-width:19px;height:19px;background:'+G2+';color:'+WH+';border-radius:5px;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:800;flex-shrink:0">'+(i+1)+'</div>'
          +'<div style="background:'+BG+';border:1px solid '+BD+';border-radius:7px;padding:7px 10px;flex:1">'
          +'<p style="margin:0;font-size:10px;color:'+INK+';line-height:1.6">'+escHTML(r)+'</p>'
          +'</div></div>'
        ).join('')
      :'<p style="font-size:10.5px;color:'+GR+';font-style:italic">Generate a blueprint to see personalized recommendations.</p>'
    )
    +'</div>'
    +'<div>'
    +secLabel('Seasonal Guide - '+zone,B)
    +(({'Temperate':[['&#127800;','Spring','Sow cool-season crops, prune fruit trees, install rain tanks.'],['&#9728;','Summer','Harvest daily, deep-mulch beds to 3 in.'],['&#127810;','Autumn','Plant garlic, build compost, sow cover crops.'],['&#10052;','Winter','Plan seeds, repair infrastructure, ferment harvest.']],
       'Arid':[['&#127800;','Spring','Plant heat-lovers early, install shade cloth.'],['&#9728;','Summer','Water pre-dawn only, harvest, apply 4 in of mulch.'],['&#127810;','Autumn','Prime planting season - establish perennials.'],['&#10052;','Winter','Peak growing - harvest citrus; ideal for earthworks.']],
       'Subtropical':[['&#127800;','Spring','Inspect pests weekly, prep water before wet season.'],['&#9728;','Summer','Harvest before fungal pressure, prune for airflow.'],['&#127810;','Autumn','Best planting season - establish food crops.'],['&#10052;','Winter','Harvest root veg and citrus; ideal for earthworks.']],
       'Cold':[['&#127800;','Spring','Watch frost dates, start seeds under cover.'],['&#9728;','Summer','Intensive harvest - short window, preserve everything.'],['&#127810;','Autumn','Stock root cellar, plant garlic, winterize.'],['&#10052;','Winter','Seed planning, fermentation, animal care, tool maintenance.']],
      } as Record<string,[string,string,string][]>)[zone]??[['&#127800;','Spring',''],['&#9728;','Summer',''],['&#127810;','Autumn',''],['&#10052;','Winter','']])
      .map(([ic,nm,ac])=>
        '<div style="display:flex;gap:8px;padding:7px 9px;background:'+BG+';border:1px solid '+BD+';border-radius:7px;margin-bottom:5px;align-items:flex-start">'
        +'<span style="font-size:15px;flex-shrink:0">'+ic+'</span>'
        +'<div>'
        +'<div style="font-size:9.5px;font-weight:700;color:'+INK+';margin-bottom:1px">'+nm+'</div>'
        +'<p style="margin:0;font-size:9.5px;color:'+GR+';line-height:1.5">'+ac+'</p>'
        +'</div></div>'
      ).join('')
    +'</div></div>';
  const page3html=pageShell(p3,'Features & Recommendations',pg3);

  // ========================================================
  // MAP PAGES -- one per blueprint, property first then garden
  // ========================================================
  const mapPage=(bp:Blueprint,accent:string,typeLabel:string,typeLight:string,pgN:number)=>{
    const bc=calculateFromTiles(bp.tiles,famN);
    const cols=bp.gridCols;const GAP=3;
    // Fill full 880px content width (960px page - 2*40px padding)
    const contentW=PAGE_W-PGPAD*2; const sz=Math.floor((contentW-GAP*(cols-1))/cols);

    const grid=Array(bp.gridCount).fill(0).map((_,i)=>{
      const t=bp.tiles.find(x=>x.id===i);
      const lib=t?ICON_LOOKUP.get(t.icon):null;
      const cc=lib?(CAT_C[lib.category]??accent):accent;
      if(t)return '<div style="width:'+sz+'px;height:'+sz+'px;background:'+cc+'10;border:1.5px solid '+cc+'40;border-radius:6px;display:flex;flex-direction:column;align-items:center;justify-content:center;flex-shrink:0;gap:1px">'
        +'<span style="font-size:'+Math.round(sz*0.42)+'px;line-height:1">'+t.icon+'</span>'
        +(sz>=36?'<span style="font-size:'+(sz>=52?7:6)+'px;color:'+cc+';font-weight:600;text-align:center;overflow:hidden;max-width:'+(sz-4)+'px;white-space:nowrap;line-height:1">'+(lib?lib.name.split(' ').slice(0,2).join(' '):'')+'</span>':'')
        +'</div>';
      return '<div style="width:'+sz+'px;height:'+sz+'px;background:#f0f5f1;border:1px solid #d4e4d8;border-radius:6px;flex-shrink:0;display:flex;align-items:center;justify-content:center">'
        +'<span style="font-size:10px;color:#c4d8c8">+</span></div>';
    }).join('');

    const seen=new Set<string>();
    const uniq=bp.tiles.filter(t=>{if(seen.has(t.icon))return false;seen.add(t.icon);return true;});
    const fRows=uniq.map((t,i)=>{
      const lib=ICON_LOOKUP.get(t.icon);if(!lib)return '';
      const cnt=bp.tiles.filter(x=>x.icon===t.icon).length;
      const animalRateBP:Record<string,number>={'🐔':3.30,'🦆':3.30,'🐐':1.25,'🐖':3.00,'🐇':3.00,'🐝':8.00};
      const foodRateBP=animalRateBP[lib.emoji]??0.8;
      const ev=Math.round((lib.yieldLbs*foodRateBP+lib.waterGal*0.005+lib.co2*0.023+(lib.emoji==='☀️'?200:lib.emoji==='🌬️'?200:lib.emoji==='🔋'?120:lib.emoji==='⚡'?60:0))*cnt);
      const cc=CAT_C[lib.category]??GR;
      return '<tr style="background:'+(i%2===0?WH:BG)+'">'
        +'<td style="padding:7px 9px;font-size:11px;font-weight:600;color:'+INK+'">'+t.icon+' '+lib.name+(cnt>1?' <span style="font-weight:400;color:'+GR+'">&times;'+cnt+'</span>':'')+'</td>'
        +'<td style="padding:7px 9px">'+catTag(lib.category,cc)+'</td>'
        +'<td style="padding:7px 9px;font-size:10.5px;color:'+G+';text-align:right;font-weight:700">'+(lib.yieldLbs>0?(lib.yieldLbs*cnt).toLocaleString()+' lbs':'&#8212;')+'</td>'
        +'<td style="padding:7px 9px;font-size:10.5px;color:'+B+';text-align:right;font-weight:700">'+(lib.waterGal>0?(lib.waterGal*cnt).toLocaleString()+' gal':'&#8212;')+'</td>'
        +'<td style="padding:7px 9px;font-size:10.5px;color:'+A+';text-align:right;font-weight:700">'+(lib.co2>0?(lib.co2*cnt).toLocaleString()+' lbs':'&#8212;')+'</td>'
        +'<td style="padding:7px 9px;font-size:11px;color:'+G2+';text-align:right;font-weight:800">'+(ev>0?'$'+ev.toLocaleString():'&#8212;')+'</td>'
        +'</tr>';
    }).join('');

    // Build active category tags for the legend
    const activeCats=Object.keys(uniq.reduce((acc:{[k:string]:boolean},t)=>{
      const lib=ICON_LOOKUP.get(t.icon);
      if(lib)acc[lib.category]=true;
      return acc;
    },{}));

    const mc=
      // Map header band
      '<div style="background:'+accent+';padding:16px 18px;margin:-'+PGPAD+'px -'+PGPAD+'px '+(PGPAD-22)+'px;position:relative;overflow:hidden">'
      +'<div style="position:absolute;right:-40px;top:-40px;width:140px;height:140px;border-radius:50%;border:28px solid rgba(255,255,255,0.08)"></div>'
      +'<div style="display:flex;justify-content:space-between;align-items:center;gap:14px">'
      +'<div>'
      +'<div style="font-size:8px;font-weight:700;letter-spacing:.2em;color:rgba(255,255,255,0.42);text-transform:uppercase;margin-bottom:3px">'+typeLabel+'</div>'
      +'<h2 style="font-size:22px;font-weight:900;color:'+WH+';margin:0 0 2px;letter-spacing:-.01em">'+escHTML(bp.name)+'</h2>'
      +'<p style="margin:0;font-size:9.5px;color:rgba(255,255,255,0.42)">'+bp.tiles.length+' features &middot; '+cols+'&times;'+cols+' grid</p>'
      +'</div>'
      +'<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px">'
      +[['&#127806;',bc.totalYieldLbs.toLocaleString()+' lbs','Yield'],['&#128167;',bc.totalWaterGal.toLocaleString()+' gal','Water'],['&#127807;',bc.totalCo2Lbs.toLocaleString()+' lbs','CO2'],['&#128176;','$'+bc.year1Savings.toLocaleString()+'/yr','Savings']]
        .map(([em,vl,lb])=>'<div style="text-align:center;background:rgba(255,255,255,0.13);padding:6px 8px;border-radius:7px;border:1px solid rgba(255,255,255,0.17)">'
          +'<div style="font-size:13px;margin-bottom:1px">'+em+'</div>'
          +'<div style="font-size:11px;font-weight:800;color:'+WH+'">'+vl+'</div>'
          +'<div style="font-size:7px;color:rgba(255,255,255,0.42);text-transform:uppercase;letter-spacing:.08em">'+lb+'</div>'
          +'</div>').join('')
      +'</div></div></div>'
      // Category legend
      +(activeCats.length>0
        ?'<div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:12px;align-items:center">'
          +activeCats.map(cat=>catTag(cat,CAT_C[cat]??GR)).join('')
          +'<span style="font-size:8.5px;color:'+GR+';margin-left:4px">active categories on this map</span>'
          +'</div>'
        :'')
      // Grid label
      +'<div style="font-size:8.5px;font-weight:700;color:'+GR+';text-transform:uppercase;letter-spacing:.1em;margin-bottom:6px">'
      +cols+'x'+cols+' Layout &mdash; '+bp.tiles.length+' of '+bp.gridCount+' cells filled</div>'
      // Full-width grid
      +'<div style="display:flex;flex-wrap:wrap;gap:'+GAP+'px;background:'+WH+';padding:8px;border-radius:9px;border:1.5px solid '+accent+'20;box-shadow:0 1px 8px rgba(0,0,0,0.04);margin-bottom:14px">'
      +grid
      +'</div>'
      // Feature table
      +(uniq.length>0
        ?'<div style="font-size:8.5px;font-weight:700;color:'+GR+';text-transform:uppercase;letter-spacing:.1em;margin-bottom:6px">Features Placed on This Map</div>'
          +'<div style="border:1px solid '+accent+'20;border-radius:9px;overflow:hidden">'
          +'<table style="width:100%;border-collapse:collapse">'
          +'<thead><tr style="background:'+typeLight+'">'
          +['Feature','Category','Food Yield','Water Saved','CO2','Est. Value/yr'].map((h,i)=>
            '<th style="padding:7px 9px;font-size:8.5px;font-weight:800;text-transform:uppercase;letter-spacing:.06em;text-align:'+(i>=2?'right':'left')+';color:'+accent+'">'+h+'</th>'
          ).join('')
          +'</tr></thead><tbody>'+fRows+'</tbody>'
          +'<tfoot><tr style="background:'+typeLight+'">'
          +'<td colspan="2" style="padding:7px 9px;font-size:10px;font-weight:900;color:'+INK+'">Map Totals</td>'
          +'<td style="padding:7px 9px;font-size:10px;font-weight:800;color:'+G+';text-align:right">'+bc.totalYieldLbs.toLocaleString()+' lbs</td>'
          +'<td style="padding:7px 9px;font-size:10px;font-weight:800;color:'+B+';text-align:right">'+bc.totalWaterGal.toLocaleString()+' gal</td>'
          +'<td style="padding:7px 9px;font-size:10px;font-weight:800;color:'+A+';text-align:right">'+bc.totalCo2Lbs.toLocaleString()+' lbs</td>'
          +'<td style="padding:7px 9px;font-size:10.5px;font-weight:800;color:'+G2+';text-align:right">$'+bc.year1Savings.toLocaleString()+'/yr</td>'
          +'</tr></tfoot></table></div>'
          +(bp.notes?'<div style="margin-top:9px;padding:8px 11px;background:'+AL+';border-left:3px solid '+A+';border-radius:0 7px 7px 0">'
            +'<div style="font-size:8px;font-weight:700;color:'+A+';text-transform:uppercase;letter-spacing:.08em;margin-bottom:2px">Notes</div>'
            +'<p style="margin:0;font-size:10.5px;color:#554;line-height:1.55">'+escHTML(bp.notes)+'</p>'
            +'</div>':'')
        :'<div style="text-align:center;padding:22px;background:'+BG+';border:1px solid '+BD+';border-radius:9px">'
          +'<p style="margin:0;font-size:11px;color:'+GR+';font-style:italic">No features placed on this map yet.</p>'
          +'</div>'
      );

    return pageShell(mc,typeLabel+' - '+escHTML(bp.name),pgN);
  };

  const propPageList=propBps.map(bp=>mapPage(bp,G2,'Property Map',GL,np()));
  const bedPageList=raisedBedBpsPDF.map(bp=>mapPage(bp,B,'Raised Bed',BL,np()));
  const propPages=propPageList.join('');
  const bedPages=bedPageList.join('');

  // --- FINAL PAGE --------------------------------------------
  const pgLast=np();
  const lastPage=pageShell(
    '<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:500px;text-align:center">'
    +'<div style="font-size:44px;margin-bottom:14px">&#127807;</div>'
    +'<h2 style="font-size:20px;font-weight:900;color:'+G2+';margin:0 0 8px">Your Blueprint Is Complete</h2>'
    +'<p style="font-size:12px;color:'+GR+';max-width:380px;line-height:1.65;margin:0 0 22px">Thank you for using TerraForge. Your regenerative home design has been fully documented across '+totalPages+' pages.</p>'
    +'<div style="background:'+GL+';border:1px solid '+BD+';border-radius:11px;padding:16px 28px;display:inline-block">'
    +'<div style="font-size:9px;font-weight:700;color:'+GR+';text-transform:uppercase;letter-spacing:.1em;margin-bottom:4px">Final Regeneration Score</div>'
    +'<div style="font-size:38px;font-weight:900;color:'+G+'">'+calc.resilienceScore+'<span style="font-size:16px;color:'+GR+'">/98</span></div>'
    +'<div style="font-size:10.5px;color:'+GR+';margin-top:3px">'+scoreStatus+'</div>'
    +'</div>'
    +'</div>',
    'Complete',pgLast
  );

  // -- Named pages -- use pre-rendered list items --------------
  const namedPages:[string,string][]=[
    ['01-Cover',           page1],
    ['02-Performance-ROI', page2html],
    ['03-Recommendations', page3html],
    ...propPageList.map((pg:string,i:number)=>[String(4+i).padStart(2,'0')+'-'+propBps[i].name.replace(/[^a-zA-Z0-9_\- ]/g,'').replace(/\s+/g,'-').slice(0,40), pg] as [string,string]),
    ...bedPageList.map((pg:string,i:number)=>[String(4+propBps.length+i).padStart(2,'0')+'-'+raisedBedBpsPDF[i].name.replace(/[^a-zA-Z0-9_\- ]/g,'').replace(/\s+/g,'-').slice(0,40), pg] as [string,string]),
    [String(4+propBps.length+raisedBedBpsPDF.length).padStart(2,'0')+'-Footer', lastPage],
  ];

  // -- Toast ---------------------------------------------
  const toast=document.createElement('div');
  toast.style.cssText='position:fixed;bottom:32px;left:50%;transform:translateX(-50%);'
    +'background:#f0fdf4;color:#15803d;border:1px solid rgba(22,163,74,0.25);border-radius:12px;'
    +'padding:12px 24px;font-size:13px;font-weight:600;z-index:99999;'
    +'box-shadow:0 4px 24px rgba(15,23,42,0.05);white-space:nowrap;font-family:Inter,sans-serif';
  toast.textContent='Loading export tools...';
  document.body.appendChild(toast);

  const loadScript=(id:string,url:string):Promise<void>=>new Promise((res,rej)=>{
    if(document.getElementById(id)){res();return;}
    const s=document.createElement('script');
    s.id=id;s.src=url;s.onload=()=>res();
    s.onerror=()=>rej(new Error('Failed to load: '+url));
    document.head.appendChild(s);
  });

  // -- Build a full standalone HTML doc for each page --------
  // The entire page HTML is wrapped in a complete <!DOCTYPE html>
  // document with ONLY our CSS -- no Tailwind, no Next.js, nothing.
  // This doc is injected into a hidden iframe via srcdoc, creating
  // a 100% isolated rendering context.
  const CSS_RESET=[
    '*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}',
    'html,body{background:#ffffff;width:'+PAGE_W+'px}',
    'body{',
    '  font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif;',
    '  color:#111f17;',
    '  -webkit-font-smoothing:antialiased;',
    '  line-height:1.4',
    '}',
    'h1,h2,h3,h4,h5,h6{margin:0;padding:0;font-weight:inherit;line-height:1.2}',
    'p{margin:0;padding:0}',
    'table{border-collapse:collapse;width:100%}',
    'th,td{vertical-align:top;padding:0}',
    'strong{font-weight:700}',
    'a{text-decoration:none;color:inherit}',
  ].join(' ');

  const makeDoc=(bodyHtml:string)=>
    '<!DOCTYPE html><html><head>'
    +'<meta charset="UTF-8">'
    +'<style>'+CSS_RESET+'</style>'
    +'</head><body>'
    +bodyHtml
    +'</body></html>';

  // -- Render one page via srcdoc iframe ---------------------
  // The iframe gets a fresh empty document -- zero app styles.
  // html2canvas is loaded inside that iframe's window and
  // captures its own document body directly.
  const renderOnePage=(html:string):Promise<string>=>new Promise((res,rej)=>{
    const frame=document.createElement('iframe');
    // Off-screen via absolute position -- NOT visibility:hidden which
    // causes browsers to skip layout and return zero scrollHeight.
    frame.style.cssText=
      'position:absolute;'
      +'top:0;'
      +'left:-'+(PAGE_W+600)+'px;'
      +'width:'+PAGE_W+'px;'
      +'height:1080px;'
      +'border:0;'
      +'pointer-events:none;';
    document.body.appendChild(frame);

    frame.srcdoc=makeDoc(html);

    frame.addEventListener('load',()=>{
      const win=frame.contentWindow as any;
      const fdoc=frame.contentDocument!;
      const body=fdoc.body;

      // Give the browser one rAF to fully paint the document
      // before measuring height -- critical for complex layouts
      requestAnimationFrame(()=>{
        requestAnimationFrame(()=>{
          const h=Math.max(body.scrollHeight,400);
          frame.style.height=h+'px';

          // Load h2c into iframe's own window context
          const s=fdoc.createElement('script');
          s.src='https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
          s.onload=()=>{
            // 300ms settle for fonts + any async layout
            setTimeout(()=>{
              win.html2canvas(body,{
                scale:2,
                useCORS:true,
                allowTaint:true,
                backgroundColor:'#ffffff',
                width:PAGE_W,
                height:h,
                windowWidth:PAGE_W,
                windowHeight:h,
                scrollX:0,
                scrollY:0,
                logging:false,
              }).then((canvas:HTMLCanvasElement)=>{
                const data=canvas.toDataURL('image/png').split(',')[1];
                frame.remove();
                res(data);
              }).catch((e:any)=>{frame.remove();rej(e);});
            },300);
          };
          s.onerror=()=>{frame.remove();rej(new Error('h2c load failed'));};
          fdoc.head.appendChild(s);
        });
      });
    },{once:true});

    setTimeout(()=>{frame.remove();rej(new Error('render timeout'));},90000);
  });

  // Load JSZip upfront; html2canvas is loaded per-iframe (must run in iframe context)
  Promise.all([
    loadScript('tf-jszip','https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js'),
  ])
  .then(async()=>{
    toast.textContent='Starting export...';
    const zip=new (window as any).JSZip();
    const folder=zip.folder('TerraForge-Blueprint');
    const total=namedPages.length;
    for(let i=0;i<total;i++){
      const[name,html]=namedPages[i];
      toast.textContent='Rendering page '+(i+1)+' of '+total+'...';
      const b64=await renderOnePage(html);
      folder.file(name+'.png',b64,{base64:true});
    }
    toast.textContent='Building ZIP...';
    const blob=await zip.generateAsync({type:'blob',compression:'DEFLATE',compressionOptions:{level:6}});
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a');
    a.href=url;a.download='TerraForge-Blueprint-'+Date.now()+'.zip';
    document.body.appendChild(a);a.click();a.remove();
    URL.revokeObjectURL(url);
    toast.textContent='✓ Downloaded — '+total+' pages!';
    setTimeout(()=>toast.remove(),3000);
  })
  .catch((err:any)=>{
    console.error('TerraForge export error:',err);
    toast.textContent='Export failed: '+err.message;
    toast.style.color='#ff6060';
    setTimeout(()=>toast.remove(),5000);
  });
}

/* ==== STYLE INJECTOR ==== */
/* ==== ONBOARDING OVERLAY ==== */
const ONBOARDING_STEPS=[
  {emoji:'🌱',title:'Welcome to TerraForge',desc:'Design your dream homestead with AI. Let us walk through the core features in 30 seconds.',cta:'Get Started'},
  {emoji:'⚙️',title:'Configure Your Property',desc:'Hit Configure to set your property size, family size, climate zone, and budget. This calibrates every calculation to your land.',cta:'Got it'},
  {emoji:'🤖',title:'Describe Your Vision',desc:'Type a natural language prompt — "I want raised beds, fruit trees, and solar with a $5k budget" — and AI will generate a personalised blueprint.',cta:'Got it'},
  {emoji:'🗺️',title:'Explore Your Maps',desc:'Click Maps to see your 3D property layout. Drag icons from the library to place features manually. Click any tile for detailed data.',cta:'Got it'},
  {emoji:'📊',title:'Track Your Progress',desc:'Dashboard, Overview, ROI, and Deploy tabs give you financial projections, resilience scores, and a step-by-step implementation plan.',cta:'Got it'},
  {emoji:'🚀',title:'You Are Ready',desc:'Start with an example prompt or Configure your property. Your blueprint saves automatically as you work.',cta:'Start Building'},
];

// ─── Property Canvas ──────────────────────────────────────────────────────────
const CANVAS_TILES=[
  {name:'Raised Bed',emoji:'🌱',cat:'food'},{name:'Greenhouse',emoji:'🏡',cat:'food'},
  {name:'Herb Spiral',emoji:'🌿',cat:'food'},{name:'Tomatoes',emoji:'🍅',cat:'food'},
  {name:'Apple Tree',emoji:'🍎',cat:'food'},{name:'Lemon Tree',emoji:'🍋',cat:'food'},
  {name:'Pear Tree',emoji:'🍐',cat:'food'},{name:'Peach Tree',emoji:'🍑',cat:'food'},
  {name:'Mango Tree',emoji:'🥭',cat:'food'},{name:'Avocado',emoji:'🥑',cat:'food'},
  {name:'Banana Tree',emoji:'🍌',cat:'food'},{name:'Orange Tree',emoji:'🍊',cat:'food'},
  {name:'Cherry Tree',emoji:'🍒',cat:'food'},{name:'Blueberries',emoji:'🫐',cat:'food'},
  {name:'Grapes',emoji:'🍇',cat:'food'},{name:'Strawberries',emoji:'🍓',cat:'food'},
  {name:'Corn',emoji:'🌽',cat:'food'},{name:'Carrots',emoji:'🥕',cat:'food'},
  {name:'Kale',emoji:'🥬',cat:'food'},{name:'Potatoes',emoji:'🥔',cat:'food'},
  {name:'Beans',emoji:'🫘',cat:'food'},{name:'Pumpkin',emoji:'🎃',cat:'food'},
  {name:'Rain Tank',emoji:'💧',cat:'water'},{name:'Swale',emoji:'🌊',cat:'water'},
  {name:'Pond',emoji:'🐟',cat:'water'},{name:'Cistern',emoji:'🪣',cat:'water'},
  {name:'Rain Garden',emoji:'🌧️',cat:'water'},{name:'Drip Irrigation',emoji:'🚿',cat:'water'},
  {name:'Solar Panel',emoji:'☀️',cat:'energy'},{name:'Wind Turbine',emoji:'🌬️',cat:'energy'},
  {name:'Solar Battery',emoji:'🔋',cat:'energy'},{name:'Solar Pump',emoji:'⚡',cat:'energy'},
  {name:'Compost Bin',emoji:'♻️',cat:'soil'},{name:'Hugelkultur',emoji:'🌲',cat:'soil'},
  {name:'Cover Crops',emoji:'🌾',cat:'soil'},{name:'Mulch Zone',emoji:'🍂',cat:'soil'},
  {name:'Chicken Coop',emoji:'🐔',cat:'animals'},{name:'Beehive',emoji:'🐝',cat:'animals'},
  {name:'Duck Pond',emoji:'🦆',cat:'animals'},{name:'Rabbit Hutch',emoji:'🐇',cat:'animals'},
  {name:'Native Plants',emoji:'🌸',cat:'bio'},{name:'Wildflower',emoji:'🌼',cat:'bio'},
  {name:'Food Forest',emoji:'🌳',cat:'bio'},{name:'Hedgerow',emoji:'🌿',cat:'bio'},
];
const CAT_COLORS:Record<string,string>={food:'#00ffaa',water:'#00d4ff',energy:'#facc15',soil:'#d97706',animals:'#f472b6',bio:'#a78bfa'};
const CAT_LABELS:Record<string,string>={food:'Food',water:'Water',energy:'Energy',soil:'Soil',animals:'Animals',bio:'Bio'};
const CANVAS_GRID=14;
type CanvasCell={emoji:string;name:string};
type CanvasState=Record<number,CanvasCell>;
declare global{interface Window{google:any;}}

function PropertyCanvas({isPro,onPaywall,address}:{isPro:boolean;onPaywall:()=>void;address:string}){
  const mapRef=useRef<HTMLDivElement>(null);
  const mapInstance=useRef<any>(null);
  const geocoderRef=useRef<any>(null);
  const didInit=useRef(false);
  const [cells,setCells]=useState<CanvasState>(()=>{
    try{const s=localStorage.getItem('tf-canvas-v1');return s?JSON.parse(s):{};}catch{return {};}
  });
  const [selected,setSelected]=useState<{emoji:string;name:string}|null>(null);
  const [activeCat,setActiveCat]=useState('food');
  const [mapLoaded,setMapLoaded]=useState(false);
  const [placingMode,setPlacingMode]=useState(false);
  const [hoveredCell,setHoveredCell]=useState<number|null>(null);
  const dragTile=useRef<{emoji:string;name:string}|null>(null);

  // Persist tiles — survives close, refresh, everything
  useEffect(()=>{try{localStorage.setItem('tf-canvas-v1',JSON.stringify(cells));}catch{}},[cells]);

  // Init map once on mount
  useEffect(()=>{
    if(didInit.current)return;
    const apiKey=process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if(!apiKey)return;
    function boot(){
      if(didInit.current)return;
      didInit.current=true;
      setTimeout(()=>{
        if(!mapRef.current)return;
        const map=new window.google.maps.Map(mapRef.current,{
          center:{lat:39.8283,lng:-98.5795},zoom:4,
          mapTypeId:'satellite',tilt:0,gestureHandling:'greedy',
          zoomControl:true,streetViewControl:false,mapTypeControl:false,fullscreenControl:false,
        });
        mapInstance.current=map;
        geocoderRef.current=new window.google.maps.Geocoder();
        setMapLoaded(true);
        // Center on address if available at mount
        if(address.trim()){
          geocoderRef.current.geocode({address},(r:any,s:any)=>{
            if(s==='OK'&&r[0]){map.setCenter(r[0].geometry.location);map.setZoom(19);}
          });
        }
      },80);
    }
    if(window.google?.maps){boot();return;}
    const ex=document.getElementById('tf-gmaps-script');
    if(ex){ex.addEventListener('load',boot,{once:true} as any);return;}
    const s=document.createElement('script');
    s.id='tf-gmaps-script';
    s.src=`https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    s.async=true;s.onload=boot;
    document.head.appendChild(s);
  },[]);

  // Sync map whenever the address prop changes (user types in Property tab address field)
  const lastGeocodedAddr=useRef('');
  useEffect(()=>{
    if(!address.trim())return;
    if(address===lastGeocodedAddr.current)return;
    if(!geocoderRef.current||!mapInstance.current)return;
    lastGeocodedAddr.current=address;
    geocoderRef.current.geocode({address},(r:any,s:any)=>{
      if(s==='OK'&&r[0]){mapInstance.current.setCenter(r[0].geometry.location);mapInstance.current.setZoom(19);}
    });
  },[address]);

  function handleCellClick(i:number){
    if(!placingMode)return;
    if(selected) setCells(p=>({...p,[i]:{emoji:selected.emoji,name:selected.name}}));
    else setCells(p=>{const n={...p};delete n[i];return n;});
  }

  function handleDrop(i:number){
    const t=dragTile.current;
    if(!t)return;
    setCells(p=>({...p,[i]:{emoji:t.emoji,name:t.name}}));
    dragTile.current=null;
    setPlacingMode(true);
  }

  const cats=Array.from(new Set(CANVAS_TILES.map(t=>t.cat)));
  const placedCount=Object.keys(cells).length;

  if(!isPro) return(
    <div style={{borderRadius:20,padding:'40px 32px',textAlign:'center',
      background:'linear-gradient(135deg,rgba(0,255,170,0.04),rgba(4,14,8,0.95))',
      border:'1px solid rgba(0,255,170,0.14)'}}>
      <div style={{fontSize:36,marginBottom:12}}>🗺️</div>
      <h3 style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:18,fontWeight:700,
        color:'var(--tp)',margin:'0 0 8px'}}>Property Canvas</h3>
      <p style={{fontSize:13,color:'var(--ts)',lineHeight:1.6,maxWidth:380,margin:'0 auto 24px'}}>
        Drag &amp; drop homestead tiles onto a live satellite view of your property. Pro only.
      </p>
      <button onClick={onPaywall} style={{padding:'11px 28px',borderRadius:12,cursor:'pointer',
        background:'linear-gradient(135deg,#00ffaa,#00c47a)',border:'none',
        color:'#0a1f15',fontSize:14,fontWeight:800,fontFamily:"'Space Grotesk',sans-serif"}}>
        Upgrade to Pro
      </button>
    </div>
  );

  return(
    <div style={{borderRadius:20,overflow:'hidden',border:'1px solid rgba(0,255,170,0.18)',
      background:'rgba(8,22,14,0.97)'}}>

      {/* Toolbar */}
      <div style={{display:'flex',alignItems:'center',gap:10,padding:'12px 16px',
        borderBottom:'1px solid rgba(0,255,170,0.12)',flexWrap:'wrap',
        background:'rgba(10,31,21,0.98)'}}>
        <span style={{fontFamily:"'Space Grotesk',sans-serif",fontWeight:700,
          fontSize:13,color:'#00ffaa',flexShrink:0}}>🗺️ Property Canvas</span>
        <span style={{fontSize:11,color:'rgba(0,255,170,0.45)',
          background:'rgba(0,255,170,0.07)',border:'1px solid rgba(0,255,170,0.15)',
          borderRadius:99,padding:'2px 8px',flexShrink:0}}>
          {placedCount} tile{placedCount!==1?'s':''}
        </span>
        {address.trim()&&(
          <span style={{fontSize:11,color:'rgba(0,255,170,0.4)',flexShrink:0}}>📍 {address}</span>
        )}
        <div style={{flex:1}}/>
        <button onClick={()=>setPlacingMode(p=>!p)} style={{padding:'6px 12px',borderRadius:8,
          cursor:'pointer',flexShrink:0,fontSize:12,fontWeight:700,
          background:placingMode?'rgba(0,255,170,0.18)':'rgba(255,255,255,0.05)',
          border:`1px solid ${placingMode?'rgba(0,255,170,0.45)':'rgba(255,255,255,0.12)'}`,
          color:placingMode?'#00ffaa':'rgba(200,230,212,0.5)'}}>
          {placingMode?'✏️ Placing':'🖐 Navigate'}
        </button>
        <button onClick={()=>{if(confirm('Clear all canvas tiles?'))setCells({});}} style={{
          padding:'6px 10px',borderRadius:8,cursor:'pointer',flexShrink:0,
          background:'rgba(255,80,80,0.08)',border:'1px solid rgba(255,80,80,0.2)',
          color:'#ff8080',fontSize:12,fontWeight:600}}>Clear</button>
      </div>

      {/* Body */}
      <div style={{display:'flex',height:520}}>

        {/* Tile palette */}
        <div style={{width:176,flexShrink:0,display:'flex',flexDirection:'column',
          borderRight:'1px solid rgba(0,255,170,0.1)',overflowY:'auto'}}>
          <div style={{padding:'8px 10px',borderBottom:'1px solid rgba(0,255,170,0.08)',flexShrink:0,minHeight:48}}>
            {selected?(
              <div style={{display:'flex',alignItems:'center',gap:6,padding:'5px 8px',
                background:'rgba(0,255,170,0.1)',border:'1px solid rgba(0,255,170,0.3)',borderRadius:8}}>
                <span style={{fontSize:18}}>{selected.emoji}</span>
                <span style={{fontSize:10,fontWeight:700,color:'#00ffaa',flex:1,lineHeight:1.2}}>{selected.name}</span>
                <button onClick={()=>setSelected(null)} style={{background:'none',border:'none',
                  color:'rgba(0,255,170,0.4)',cursor:'pointer',fontSize:12,padding:0,lineHeight:1}}>✕</button>
              </div>
            ):(
              <div style={{fontSize:9,color:'rgba(170,240,210,0.3)',textAlign:'center',
                lineHeight:1.5,paddingTop:4}}>Select a tile<br/>then click grid</div>
            )}
          </div>
          <div style={{display:'flex',flexWrap:'wrap',gap:2,padding:'6px 8px 4px',flexShrink:0}}>
            {cats.map(cat=>(
              <button key={cat} onClick={()=>setActiveCat(cat)}
                style={{padding:'2px 7px',borderRadius:99,fontSize:9,fontWeight:700,cursor:'pointer',
                  background:activeCat===cat?CAT_COLORS[cat]:'rgba(255,255,255,0.04)',
                  border:`1px solid ${activeCat===cat?CAT_COLORS[cat]:'rgba(255,255,255,0.08)'}`,
                  color:activeCat===cat?'#0a1f15':'rgba(200,230,212,0.5)'}}>
                {CAT_LABELS[cat]}
              </button>
            ))}
          </div>
          <div style={{flex:1,overflowY:'auto',padding:'2px 6px 12px'}}>
            {CANVAS_TILES.filter(t=>t.cat===activeCat).map(tile=>{
              const isSel=selected?.emoji===tile.emoji&&selected?.name===tile.name;
              return(
                <div key={tile.name} draggable
                  onDragStart={()=>{dragTile.current={emoji:tile.emoji,name:tile.name};}}
                  onClick={()=>{setSelected(isSel?null:tile);if(!isSel)setPlacingMode(true);}}
                  style={{display:'flex',alignItems:'center',gap:7,padding:'5px 7px',
                    borderRadius:7,cursor:'grab',marginBottom:1,
                    background:isSel?'rgba(0,255,170,0.1)':'rgba(255,255,255,0.02)',
                    border:`1px solid ${isSel?'rgba(0,255,170,0.35)':'transparent'}`}}>
                  <span style={{fontSize:15,lineHeight:1}}>{tile.emoji}</span>
                  <span style={{fontSize:10,color:'rgba(200,230,212,0.7)',fontWeight:isSel?700:400}}>{tile.name}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Map + grid */}
        <div style={{flex:1,position:'relative'}}>
          <div ref={mapRef} style={{position:'absolute',inset:0,zIndex:0}}/>
          <div style={{position:'absolute',inset:0,zIndex:1,
            display:'grid',
            gridTemplateColumns:`repeat(${CANVAS_GRID},1fr)`,
            gridTemplateRows:`repeat(${CANVAS_GRID},1fr)`,
            pointerEvents:placingMode?'all':'none'}}>
            {Array.from({length:CANVAS_GRID*CANVAS_GRID},(_,i)=>(
              <div key={i}
                onDragOver={e=>{e.preventDefault();setHoveredCell(i);}}
                onDragLeave={()=>setHoveredCell(null)}
                onDrop={e=>{e.preventDefault();handleDrop(i);setHoveredCell(null);}}
                onClick={()=>handleCellClick(i)}
                onMouseEnter={()=>setHoveredCell(i)}
                onMouseLeave={()=>setHoveredCell(null)}
                style={{border:`1px solid rgba(0,255,170,${placingMode?0.15:0.05})`,
                  background:hoveredCell===i?'rgba(0,255,170,0.18)':cells[i]?'rgba(0,0,0,0.45)':'transparent',
                  display:'flex',alignItems:'center',justifyContent:'center',
                  cursor:selected?'crosshair':placingMode?'cell':'default',
                  position:'relative',userSelect:'none'}}>
                {cells[i]&&(
                  <span style={{fontSize:18,lineHeight:1,
                    filter:'drop-shadow(0 1px 4px rgba(0,0,0,0.9))',pointerEvents:'none'}}>
                    {cells[i].emoji}
                  </span>
                )}
                {hoveredCell===i&&cells[i]&&(
                  <div style={{position:'absolute',bottom:'calc(100% + 2px)',left:'50%',
                    transform:'translateX(-50%)',background:'rgba(10,31,21,0.97)',
                    border:'1px solid rgba(0,255,170,0.25)',borderRadius:5,
                    padding:'2px 7px',fontSize:9,color:'#00ffaa',whiteSpace:'nowrap',
                    pointerEvents:'none',zIndex:20}}>
                    {cells[i].name}
                  </div>
                )}
              </div>
            ))}
          </div>
          {!mapLoaded&&(
            <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',
              justifyContent:'center',background:'rgba(4,14,8,0.92)',zIndex:5}}>
              <div style={{textAlign:'center'}}>
                <div style={{fontSize:28,marginBottom:10}}>🛰️</div>
                <div style={{color:'#00ffaa',fontSize:13,fontWeight:600}}>Loading satellite map…</div>
              </div>
            </div>
          )}
          {mapLoaded&&(
            <div style={{position:'absolute',bottom:10,left:'50%',transform:'translateX(-50%)',
              background:'rgba(10,31,21,0.9)',border:'1px solid rgba(0,255,170,0.15)',
              borderRadius:8,padding:'5px 12px',fontSize:10,color:'rgba(0,255,170,0.6)',
              pointerEvents:'none',zIndex:10,whiteSpace:'nowrap'}}>
              {placingMode
                ?`✏️ ${selected?`Click to place ${selected.emoji} ${selected.name}`:'Click cell to erase · select a tile to place'}`
                :'🖐 Navigate — pan & zoom freely · switch to Placing to add tiles'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function OnboardingOverlay({onDone}:{onDone:()=>void}){
  const[step,setStep]=useState(0);
  const s=ONBOARDING_STEPS[step];
  const isLast=step===ONBOARDING_STEPS.length-1;
  return(
    <div style={{
      position:'fixed',inset:0,zIndex:9800,
      background:'rgba(4,12,8,0.88)',
      backdropFilter:'blur(14px)',
      display:'flex',alignItems:'center',justifyContent:'center',
      padding:16,
    }} onClick={(e)=>{if(e.target===e.currentTarget){onDone();}}}>
      <div className="a-scaleIn" style={{
        maxWidth:440,width:'100%',
        background:'linear-gradient(160deg,rgba(14,42,26,0.98) 0%,rgba(8,20,36,0.98) 100%)',
        border:'1px solid rgba(0,255,170,0.28)',
        borderRadius:28,padding:'40px 36px',
        boxShadow:'0 40px 100px rgba(0,0,0,0.70),0 0 60px rgba(0,255,170,0.06)',
        position:'relative',
      }}>
        {/* Close */}
        <button onClick={onDone} style={{
          position:'absolute',top:16,right:16,
          width:32,height:32,borderRadius:8,border:'1px solid rgba(0,255,170,0.18)',
          background:'rgba(0,255,170,0.06)',cursor:'pointer',
          display:'flex',alignItems:'center',justifyContent:'center',
          color:'var(--ts)',fontSize:14,
        }}>✕</button>
        {/* Step indicator */}
        <div style={{display:'flex',gap:5,marginBottom:28,justifyContent:'center'}}>
          {ONBOARDING_STEPS.map((_,i)=>(
            <div key={i} style={{
              height:3,borderRadius:99,transition:'all 0.3s',
              width:i===step?24:8,
              background:i===step?'#00ffaa':i<step?'rgba(0,255,170,0.40)':'rgba(0,255,170,0.12)',
            }}/>
          ))}
        </div>
        {/* Content */}
        <div style={{textAlign:'center'}}>
          <div style={{fontSize:48,marginBottom:20,lineHeight:1}}>{s.emoji}</div>
          <h2 style={{
            fontSize:22,fontWeight:800,margin:'0 0 12px',
            color:'var(--tp)',fontFamily:"'Space Grotesk',sans-serif",
            letterSpacing:'-.02em',
          }}>{s.title}</h2>
          <p style={{
            fontSize:15,color:'var(--ts)',lineHeight:1.7,margin:'0 0 32px',
            fontFamily:"'Inter',sans-serif",
          }}>{s.desc}</p>
          <div style={{display:'flex',gap:10,justifyContent:'center'}}>
            {step>0&&(
              <button onClick={()=>setStep(s=>s-1)} style={{
                padding:'11px 22px',borderRadius:12,
                border:'1px solid rgba(0,255,170,0.22)',
                background:'rgba(0,255,170,0.05)',
                color:'var(--tf)',fontSize:13,fontWeight:600,cursor:'pointer',
                fontFamily:"'Inter',sans-serif",
              }}>← Back</button>
            )}
            <button onClick={()=>{if(isLast)onDone();else setStep(s=>s+1);}} style={{
              padding:'11px 28px',borderRadius:12,
              background:'linear-gradient(135deg,#00ffaa 0%,#00d4c8 100%)',
              border:'none',
              color:'#051a0e',fontSize:13,fontWeight:800,cursor:'pointer',
              fontFamily:"'Space Grotesk',sans-serif",letterSpacing:'.04em',
              boxShadow:'0 4px 20px rgba(0,255,170,0.28)',
              flex:1,
            }}>{s.cta} {!isLast&&'→'}</button>
          </div>
          {step===0&&(
            <button onClick={onDone} style={{
              marginTop:14,background:'none',border:'none',cursor:'pointer',
              fontSize:12,color:'var(--ts)',fontFamily:"'Inter',sans-serif",
              textDecoration:'underline',opacity:0.6,
            }}>Skip tutorial</button>
          )}
        </div>
      </div>
    </div>
  );
}

function StyleInjector(){
  return(
    <>
      <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover"/>
      <style dangerouslySetInnerHTML={{__html:GLOBAL_CSS}}/>
    </>
  );
}

/* ==== SCORE RING ==== */
function ScoreRing({value,max=100,color='#00ffaa',size=80,stroke=7,label,sublabel,animated=true}:{value:number;max?:number;color?:string;size?:number;stroke?:number;label:string;sublabel?:string;animated?:boolean}){
  const r=((size-stroke*2)/2)-2;
  const circ=2*Math.PI*r;
  const pct=Math.min(1,value/max);
  const offset=circ-(circ*pct);
  return(
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8}}>
      <div style={{position:'relative',width:size,height:size}}>
        {/* Outer glow ring */}
        <div style={{position:'absolute',inset:-4,borderRadius:'50%',boxShadow:`0 0 ${Math.round(size*0.18)}px ${color}28`,pointerEvents:'none'}}/>
        <svg width={size} height={size} style={{transform:'rotate(-90deg)'}}>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(0,255,170,0.08)" strokeWidth={stroke}/>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circ}
            style={animated?{transition:'stroke-dashoffset 1.4s cubic-bezier(0.22,1,0.36,1)',strokeDashoffset:offset}:{strokeDashoffset:circ}}
            filter={`drop-shadow(0 0 ${stroke}px ${color}88)`}/>
        </svg>
        <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
          <span className="f-clash" style={{fontSize:Math.round(size*0.26),color,lineHeight:1,textShadow:`0 0 ${Math.round(size*0.2)}px ${color}66`}}>{value}</span>
          {sublabel&&<span className="f-mono" style={{fontSize:Math.round(size*0.10),color:'rgba(160,200,180,0.45)',marginTop:2}}>{sublabel}</span>}
        </div>
      </div>
      <span style={{fontSize:12,fontFamily:"'Inter',sans-serif",fontWeight:700,textAlign:'center',letterSpacing:'.03em',color:'var(--tf)',maxWidth:size+20,lineHeight:1.35,display:'block',marginTop:6}}>{label}</span>
    </div>
  );
}

/* ==== TOOLTIP PORTAL ==== */
function TooltipPortal({anchorRef,children}:{anchorRef:React.RefObject<HTMLDivElement>;children:React.ReactNode}){
  const[pos,setPos]=useState<{top:number;left:number;above:boolean}|null>(null);
  useEffect(()=>{
    if(!anchorRef.current)return;
    const r=anchorRef.current.getBoundingClientRect();
    const tipH=220;
    // Always prefer above — only fall back to below if no room above
    const above=r.top>=tipH+12;
    const rawTop=above?r.top-tipH-6:r.bottom+6;
    const top=Math.max(8,Math.min(rawTop,window.innerHeight-tipH-8));
    const left=Math.max(12,Math.min(r.left+r.width/2-144,window.innerWidth-300));
    setPos({top,left,above});
  },[anchorRef]);
  if(!pos||typeof document==='undefined')return null;
  return createPortal(
    <div className="a-fadeUp" style={{position:'fixed',zIndex:9998,fontFamily:"'Inter',sans-serif",top:`${pos.top}px`,left:`${pos.left}px`,filter:'drop-shadow(0 12px 40px rgba(0,0,0,0.79))'}}>
          {!pos.above&&<div style={{display:"flex",justifyContent:"center",marginBottom:"-6px"}}><div style={{width:12,height:12,transform:"rotate(45deg)",background:"rgba(8,22,16,0.81)",borderLeft:"1px solid rgba(0,255,170,0.16)",borderTop:"1px solid rgba(0,255,170,0.16)"}}/></div>}
      {children}
          {pos.above&&<div style={{display:"flex",justifyContent:"center",marginTop:"-6px"}}><div style={{width:12,height:12,transform:"rotate(45deg)",background:"rgba(8,22,16,0.81)",borderRight:"1px solid rgba(0,255,170,0.16)",borderBottom:"1px solid rgba(0,255,170,0.16)"}}/></div>}
    </div>,
    document.body
  );
}

/* ==== IMPROVE PANEL PORTAL ==== */
function ImprovePanelPortal({anchorRef,tips,addedEmojis,onAddFeature,onClose,onAdd,label}:{anchorRef:React.RefObject<HTMLDivElement>;tips:any[];addedEmojis:Set<string>;onAddFeature?:(e:string)=>void;onClose:()=>void;onAdd:(e:string)=>void;label?:string}){
  const[pos,setPos]=useState<{top:number;left:number;maxH:number}|null>(null);
  useEffect(()=>{
    const compute=()=>{
      if(!anchorRef.current)return;
      const r=anchorRef.current.getBoundingClientRect();
      const pw=Math.min(360,window.innerWidth-16);
      const margin=12;
      const spaceBelow=window.innerHeight-r.bottom-margin;
      const spaceAbove=r.top-margin;
      // Prefer above if more space, otherwise below
      const useAbove=spaceAbove>spaceBelow&&spaceAbove>200;
      const maxH=Math.min(480,Math.max(180,useAbove?spaceAbove:spaceBelow));
      // Position just above or just below the card
      const rawTop=useAbove?r.top-maxH-margin:r.bottom+margin;
      // Clamp so panel never goes above 8px from top of viewport
      const top=Math.max(8,Math.min(rawTop,window.innerHeight-maxH-margin));
      // Center horizontally on the card, clamped to viewport
      const left=Math.max(margin,Math.min(r.left+r.width/2-pw/2,window.innerWidth-pw-margin));
      setPos({top,left,maxH});
    };
    compute();
    window.addEventListener('scroll',compute,{passive:true,capture:true});
    window.addEventListener('resize',compute);
    // Recompute on dashboard inner scroll too
    document.querySelectorAll('.tf-main,[data-scroll]').forEach(el=>el.addEventListener('scroll',compute,{passive:true}));
    return()=>{
      window.removeEventListener('scroll',compute,{capture:true});
      window.removeEventListener('resize',compute);
      document.querySelectorAll('.tf-main,[data-scroll]').forEach(el=>el.removeEventListener('scroll',compute));
    };
  },[anchorRef]);
  useEffect(()=>{
    const h=(e:MouseEvent)=>{
      const t=e.target as Node;
      if(anchorRef.current&&!anchorRef.current.contains(t)){
        const panels=document.querySelectorAll('[data-improve-panel]');
        for(const p of panels){if(p.contains(t))return;}
        onClose();
      }
    };
    document.addEventListener('mousedown',h);
    return()=>document.removeEventListener('mousedown',h);
  },[anchorRef,onClose]);
  if(!pos||typeof document==='undefined')return null;
  return createPortal(
    <div data-improve-panel="true" className="a-scaleIn"
      style={{position:'fixed',zIndex:99999,width:Math.min(360,window.innerWidth-16),top:`${pos.top}px`,left:`${pos.left}px`,
              maxHeight:`${pos.maxH}px`,display:'flex',flexDirection:'column',
              filter:'drop-shadow(0 20px 60px rgba(0,0,0,0.79))'}}>
      <div style={{borderRadius:22,padding:"18px 20px",background:"rgba(8,22,16,0.81)",backdropFilter:"blur(48px)",border:"1px solid rgba(0,255,170,0.28)",boxShadow:"0 0 40px rgba(0,255,170,0.12),0 20px 60px rgba(0,0,0,0.62)",
                   overflowY:'auto',maxHeight:'100%'}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <ArrowUp style={{width:16,height:16,color:"var(--jade)"}}/>
            <span style={{fontSize:13,fontWeight:700,color:"var(--jade)",fontFamily:"'Space Grotesk',sans-serif",letterSpacing:".03em"}}>How to Improve</span>
          </div>
          <button onClick={e=>{e.stopPropagation();onClose();}} style={{width:28,height:28,display:"flex",alignItems:"center",justifyContent:"center",borderRadius:9,cursor:"pointer",background:"rgba(255,255,255,0.06)",border:"1px solid rgba(0,255,170,0.12)",transition:"transform 0.14s"}}>
            <X style={{width:14,height:14,color:"var(--td)"}}/>
          </button>
        </div>
        {tips.length===0?(
          <div style={{padding:'14px 16px',borderRadius:12,textAlign:'center',
            background:'rgba(0,255,170,0.05)',border:'1px solid rgba(0,255,170,0.15)'}}>
            <div style={{fontSize:20,marginBottom:6}}>✨</div>
            <p style={{fontSize:13,fontWeight:700,color:'#00ffaa',margin:'0 0 4px',
              fontFamily:"'Space Grotesk',sans-serif"}}>Looking good!</p>
            <p style={{fontSize:11,color:'rgba(180,230,210,0.70)',margin:0,lineHeight:1.6,
              fontFamily:"'Inter',sans-serif"}}>This metric is performing well. Add more features from the library to push it further.</p>
          </div>
        ):tips.map((tip,idx)=>(
          <div key={tip.label} style={{marginBottom:16,paddingBottom:16,borderBottom:idx<tips.length-1?"1px solid rgba(0,255,170,0.08)":"none"}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
              <FeatureIcon emoji={tip.emoji} size={18}/>
              <span style={{fontSize:14,fontWeight:700,color:"var(--tp)",fontFamily:"'Inter',sans-serif"}}>{tip.label}</span>
              <span style={{marginLeft:"auto",fontFamily:"'JetBrains Mono',monospace",fontSize:10,padding:"2px 8px",borderRadius:99,background:"rgba(0,255,170,0.1)",color:"var(--jade)",border:"1px solid rgba(0,255,170,0.22)"}}>{tip.impact}</span>
            </div>
            <p style={{fontSize:13,lineHeight:1.70,color:"var(--td)",paddingLeft:32,marginBottom:10,fontFamily:"'Inter',sans-serif"}}>{tip.example}</p>
            {onAddFeature&&tip.emoji&&(
              addedEmojis.has(tip.emoji)?(
                <div style={{marginLeft:32,display:"flex",alignItems:"center",gap:8,padding:"5px 12px",borderRadius:10,fontSize:11,fontFamily:"'Inter',sans-serif",fontWeight:600,background:"rgba(0,255,170,0.12)",border:"1px solid rgba(0,255,170,0.35)",color:"var(--jade)"}}>
                  <CheckCircle2 style={{width:12,height:12}}/> {tip.emoji} Added to map
                </div>
              ):(
                <button onClick={e=>{e.stopPropagation();onAddFeature(tip.emoji);onAdd(tip.emoji);}}
                  style={{marginLeft:32,display:"flex",alignItems:"center",gap:6,padding:"5px 12px",borderRadius:10,fontSize:11,fontFamily:"'Inter',sans-serif",fontWeight:600,cursor:"pointer",transition:"all 0.14s",background:"rgba(0,255,170,0.09)",border:"1px solid rgba(0,255,170,0.28)",color:"var(--jade)"}}>
                  <Plus style={{width:12,height:12}}/> Add {tip.emoji} to map
                </button>
              )
            )}
          </div>
        ))}
      </div>
    </div>,
    document.body
  );
}

/* ==== STAT DESCRIPTIONS ==== */
const STAT_DESC:Record<string,{short:string;detail:string;icon:string}>={
  'Regeneration Score':    {icon:'◈',short:'Overall system resilience (0–98)',detail:'Composite score across food, water, energy, soil, biodiversity, animals, and flowers. 70+ means largely self-sustaining. Maximum is 98 — a perfect system by design never scores 100. Each new category adds 5 pts (up to 30 pts max).'},
  'Annual Yield (lbs)':   {icon:'◉',short:'Total edible harvest per year',detail:'Pounds of fresh produce your system yields annually. A family of 4 needs ~2,400 lbs/yr. Perennial yields grow 40–60% as trees and bushes mature in years 2–5.'},
  'Year 1 Savings':       {icon:'◆',short:'Money saved in the first 12 months',detail:'Food value at $0.80/lb produce (or $1.25–8.00/lb for animal products) + water at $0.005/gal + carbon at $0.023/lb CO₂ + energy offset ($200/yr solar or wind, $120 battery, $60 pump). Excludes setup costs. See ROI tab for 20-year projection.'},
  'CO₂ Sequestered':      {icon:'◎',short:'Carbon pulled from atmosphere annually',detail:'Trees are the biggest driver (45–200 lbs/yr each). Compost and soil add significantly. 500 lbs CO₂ = 600 fewer miles driven.'},
  'Water Saved':          {icon:'◐',short:'Gallons not drawn from municipal supply',detail:'Rainwater harvesting, swales, mulching, and efficient plants. A well-designed 10,000 sq ft property captures 8,000–25,000 gal/yr.'},
  'Biodiversity Score':   {icon:'◑',short:'Wildlife and pollinator richness (0–100)',detail:'Pollinators boost vegetable yields 15–30%. Native plants support 35× more wildlife than exotic ornamentals.'},
  'Food Self-Sufficiency':{icon:'◒',short:'% of fresh produce grown on-site',detail:'20% = notable impact. 50% = significant food security. 100% = full seasonal independence. Factor in food preservation for year-round supply.'},
  'Payback Period':       {icon:'◓',short:'Years until investment pays for itself',detail:'Estimated setup cost ÷ Year 1 savings = payback years. After breakeven, the system generates net positive returns. The 20-year chart applies 3% annual compounding to project long-term growth.'},
};

/* ==== STAT CARD ==== */
function StatCard({icon:Icon,label,value,sub,delay=0,tips,onAddFeature,color='#00ffaa'}:{icon:any;label:string;value:string;sub?:string;delay?:number;tips?:any[];onAddFeature?:(e:string)=>void;color?:string}){
  const[hover,setHover]=useState(false);
  const[showTips,setShowTips]=useState(false);
  const[added,setAdded]=useState<Set<string>>(new Set());
  const ref=useRef<HTMLDivElement>(null);
  const desc=STAT_DESC[label];
  const hasTips=tips&&tips.length>0;
  return(
    <div ref={ref}
      className="a-fadeUp tilt-card"
      style={{
        animationDelay:`${delay}ms`,
        borderRadius:20,
        padding:'26px 20px',
        textAlign:'center',
        cursor:'default',
        position:'relative',
        background:hover
          ?`linear-gradient(160deg,${color}18 0%,rgba(8,18,12,0.8) 100%)`
          :`linear-gradient(160deg,${color}0a 0%,rgba(8,16,12,0.76) 100%)`,
        border:`1px solid ${hover?color+'38':color+'18'}`,
        backdropFilter:'blur(24px) saturate(1.5) brightness(1.05)',
        zIndex:showTips?10:1,
        boxShadow:hover?`0 0 32px ${color}14,0 8px 28px rgba(0,0,0,0.32)`:`0 0 12px ${color}06,0 3px 16px rgba(0,0,0,0.30)`,
        transition:'transform 0.22s cubic-bezier(0.22,1,0.36,1),opacity 0.22s cubic-bezier(0.22,1,0.36,1),border-color 0.22s cubic-bezier(0.22,1,0.36,1),box-shadow 0.22s cubic-bezier(0.22,1,0.36,1)',
      }}
      onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}>
      {/* Top accent line */}
      <div style={{position:'absolute',top:0,left:20,right:20,height:1,
        background:`linear-gradient(90deg,transparent,${color}55,transparent)`}}/>
      {/* Icon */}
      <div style={{width:42,height:42,borderRadius:12,margin:'0 auto 14px',
        background:hover?`${color}20`:`${color}10`,
        border:`1px solid ${hover?color+'38':color+'22'}`,
        display:'flex',alignItems:'center',justifyContent:'center',
        transition:'transform 0.22s ease,opacity 0.22s ease,border-color 0.22s ease,box-shadow 0.22s ease'}}>
        <Icon style={{width:19,height:19,color,transition:'color 0.22s'}}/>
      </div>
      <p style={{
        fontSize:30,fontWeight:900,lineHeight:1,marginBottom:8,
        fontFamily:"'Space Grotesk',sans-serif",
        color,
        textShadow:`0 0 ${hover?24:12}px ${color}${hover?'66':'33'}`,
        transition:'transform 0.22s ease,opacity 0.22s ease,border-color 0.22s ease,box-shadow 0.22s ease',
      }}>{value}</p>
      {sub&&<p style={{fontSize:12,color:`${color}80`,lineHeight:1.50,letterSpacing:'.01em',marginTop:5,marginBottom:8,fontFamily:"'Inter',sans-serif"}}>{sub}</p>}
      <p style={{fontSize:11,color:`${color}70`,letterSpacing:'.07em',textTransform:'uppercase',fontFamily:"'Space Grotesk',sans-serif",fontWeight:700}}>{label}</p>
      {(hasTips||tips!==undefined)&&(
        <button onClick={(e:React.MouseEvent)=>{e.stopPropagation();setShowTips((v:boolean)=>!v);}}
          style={{
            display:'flex',alignItems:'center',gap:6,
            margin:'10px auto 0',
            padding:'5px 14px',borderRadius:99,
            fontSize:12,fontFamily:"'Inter',sans-serif",fontWeight:700,
            letterSpacing:'.04em',textTransform:'uppercase',
            cursor:'pointer',
            color:showTips?'var(--void)':color,
            background:showTips?color:`${color}14`,
            border:`1.5px solid ${color}`,
            boxShadow:showTips
              ?`0 0 18px ${color}50,0 2px 8px rgba(0,0,0,0.40)`
              :`0 0 8px ${color}20`,
            transition:'transform 0.18s cubic-bezier(0.22,1,0.36,1),opacity 0.18s cubic-bezier(0.22,1,0.36,1),border-color 0.18s cubic-bezier(0.22,1,0.36,1),box-shadow 0.18s cubic-bezier(0.22,1,0.36,1)',
          }}
          onMouseEnter={e=>{
            const b=e.currentTarget as HTMLButtonElement;
            if(!showTips){b.style.background=`${color}26`;b.style.boxShadow=`0 0 20px ${color}44`;}
          }}
          onMouseLeave={e=>{
            const b=e.currentTarget as HTMLButtonElement;
            if(!showTips){b.style.background=`${color}14`;b.style.boxShadow=`0 0 8px ${color}20`;}
          }}>
          <ArrowUp style={{width:9,height:9}}/> IMPROVE
        </button>
      )}
      {hover&&desc&&!showTips&&(
        <TooltipPortal anchorRef={ref as React.RefObject<HTMLDivElement>}>
          <div style={{borderRadius:18,padding:"16px 18px",textAlign:"left",background:"rgba(8,22,16,0.81)",backdropFilter:"blur(40px) saturate(1.8) brightness(1.24)",border:"1px solid rgba(0,255,170,0.16)",boxShadow:"0 16px 48px rgba(0,0,0,0.62)",minWidth:280,maxWidth:300}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
              <span className="f-mono" style={{fontSize:14,color:'var(--jade)'}}>{desc.icon}</span>
              <p style={{fontSize:10,fontFamily:"'JetBrains Mono',monospace",fontWeight:700,letterSpacing:".14em",textTransform:"uppercase",color:"var(--jade)"}}>{label}</p>
            </div>
          <p style={{fontSize:13,fontFamily:"'Inter',sans-serif",fontWeight:500,marginBottom:6,lineHeight:1.6,color:"rgba(240,253,244,0.92)"}}>{desc.short}</p>
          <p style={{fontSize:12,fontFamily:"'Inter',sans-serif",lineHeight:1.65,color:"var(--td)"}}>{desc.detail}</p>
          </div>
        </TooltipPortal>
      )}
      {showTips&&(
        <ImprovePanelPortal anchorRef={ref as React.RefObject<HTMLDivElement>} tips={tips??[]} addedEmojis={added}
          onAddFeature={onAddFeature} onClose={()=>setShowTips(false)}
          label={label}
          onAdd={(e:string)=>setAdded((prev:Set<string>)=>new Set([...prev,e]))}/>
      )}
    </div>
  );
}

/* ==== SKELETON ==== */
function Skeletons(){
  return(
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:12}}>
      {Array(8).fill(0).map((_,i)=>(
      <div key={i} className="a-shimmer" style={{borderRadius:16,padding:20,background:"rgba(0,255,170,0.04)",border:"1px solid rgba(0,255,170,0.08)",animationDelay:`${i*80}ms`,minHeight:140}}/>
      ))}
    </div>
  );
}

/* ==== CONFLICT BANNER ==== */
function ConflictBanner({conflicts}:{conflicts:{icons:[string,string];msg:string}[]}){
  const[open,setOpen]=useState<string|null>(null);
  return(
    <div style={{background:'rgba(255,149,0,0.05)',borderBottom:'1px solid rgba(255,149,0,0.18)'}}>
      {conflicts.map((c)=>{
        const ck=c.icons[0]+c.icons[1];
        return(
        <div key={ck}>
          <button
            onClick={()=>setOpen(open===ck?null:ck)}
            className="conflict-row">
            <AlertTriangle style={{width:14,height:14,flexShrink:0}}/>
            <span style={{fontSize:11,fontFamily:"'Inter',sans-serif",fontWeight:500,flex:1}}>{c.msg}</span>
            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:"rgba(245,158,11,0.55)"}}>{open===ck?"▲ Hide":"▼ Why?"}</span>
          </button>
          {open===ck&&(
            <div style={{margin:"0 18px 12px",padding:"10px 14px",borderRadius:14,fontSize:12,fontFamily:"'Inter',sans-serif",lineHeight:1.65,background:"rgba(245,158,11,0.07)",border:"1px solid rgba(245,158,11,0.20)",color:"rgba(255,220,140,0.90)"}}>
              <strong style={{display:"block",marginBottom:4,color:"var(--amber)",fontFamily:"'Inter',sans-serif"}}>⚠ Why this matters:</strong>
              {getConflictReason(c.icons[0],c.icons[1])}
            </div>
          )}
        </div>
        );
      })}
    </div>
  );
}

/* ==== COMPANION BANNER ==== */
function CompanionBanner({pairs}:{pairs:{icons:[string,string];benefit:string}[]}){
  const[open,setOpen]=useState<string|null>(null);
  if(pairs.length===0)return null;
  return(
    <div style={{background:'rgba(0,255,170,0.03)',borderBottom:'1px solid rgba(0,255,170,0.12)'}}>
      {pairs.map((p,_pi)=>{
        const pk=p.icons[0]+p.icons[1];
        const na=ICON_LOOKUP.get(p.icons[0])?.name??p.icons[0];
        const nb=ICON_LOOKUP.get(p.icons[1])?.name??p.icons[1];
        return(
          <div key={pk}>
            <button onClick={()=>setOpen(open===pk?null:pk)}
              style={{width:'100%',display:'flex',alignItems:'center',gap:10,padding:'8px 18px',
                background:'transparent',border:'none',cursor:'pointer',textAlign:'left',
                transition:'background 0.15s'}}>
              <span style={{fontSize:13,color:'#00ffaa',flexShrink:0}}>✦</span>
              <span style={{fontSize:11,fontFamily:"'Inter',sans-serif",fontWeight:500,flex:1,
                color:'rgba(180,255,220,0.80)'}}>
                {p.icons[0]} {na} + {p.icons[1]} {nb} — companion pair
              </span>
              <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:'rgba(0,255,170,0.45)'}}>
                {open===pk?"▲ Hide":"▼ Why?"}
              </span>
            </button>
            {open===pk&&(
              <div style={{margin:"0 18px 12px",padding:"10px 14px",borderRadius:14,fontSize:12,
                fontFamily:"'Inter',sans-serif",lineHeight:1.65,
                background:"rgba(0,255,170,0.05)",border:"1px solid rgba(0,255,170,0.18)",
                color:"rgba(180,255,220,0.90)"}}>
                <strong style={{display:"block",marginBottom:4,color:"#00ffaa",fontFamily:"'Inter',sans-serif"}}>✦ Companion benefit:</strong>
                {p.benefit}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ==== MAP GRID ==== */
interface MapGridProps{bp:Blueprint;isDragging:boolean;onMouseDown:(e:React.MouseEvent)=>void;onTouchStart?:(e:React.TouchEvent)=>void;onDrop:(id:number,emoji:string)=>void;onTileMove:(fromId:number,toId:number)=>void;onRemove:(id:number)=>void;onTileClick:(id:number,icon:string)=>void;onReset:()=>void;gridPixelSize?:number}
function MapGrid({bp,isDragging,onMouseDown,onTouchStart,onDrop,onTileMove,onRemove,onTileClick,onReset,gridPixelSize=220}:MapGridProps){
  const gridRef=useRef<HTMLDivElement>(null);
  const allIcons=useMemo(()=>bp.tiles.map((t:{id:number;icon:string})=>t.icon),[bp.tiles]);
  const allIconSet=useMemo(()=>new Set(allIcons),[allIcons]);
  const conflicts=useMemo(()=>{
    const w:{icons:[string,string];msg:string}[]=[];
    const seen=new Set<string>();
    allIcons.forEach((icon:string)=>{
      (CONFLICTS[icon]??[]).forEach(c=>{
        if(allIconSet.has(c)){
          const key=[icon,c].sort().join('');
          if(seen.has(key))return; seen.add(key);
          const a=ICON_LOOKUP.get(icon)?.name??icon;
          const b=ICON_LOOKUP.get(c)?.name??c;
          w.push({icons:[icon,c],msg:`${icon} ${a} conflicts with ${c} ${b}`});
        }
      });
    });
    return w;
  },[allIcons,allIconSet]);
  const companions=useMemo(()=>getPositivePairs(allIcons),[allIcons]);
  return(
    <div style={{borderRadius:24,background:'linear-gradient(135deg,rgba(0,255,170,0.10) 0%,rgba(8,30,20,0.90) 100%)',border:'1px solid rgba(0,255,170,0.35)'}}>
      {/* Header */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 18px",borderBottom:"1px solid rgba(0,255,170,0.07)",background:"rgba(0,255,170,0.018)"}}>
        <div>
          <div style={{display:'flex',alignItems:'center',gap:8}}>
            <p style={{fontSize:14,fontWeight:700,color:"var(--tp)",fontFamily:"'Space Grotesk',sans-serif",letterSpacing:".03em"}}>{bp.name}</p>
            {bp.type==='raised-bed'&&(
              <span style={{fontSize:9,fontWeight:700,padding:'2px 8px',borderRadius:99,
                background:'rgba(0,212,255,0.12)',border:'1px solid rgba(0,212,255,0.28)',
                color:'#00d4ff',fontFamily:"'JetBrains Mono',monospace",letterSpacing:'.08em'}}>
                RAISED BED · {bp.gridCols}×{bp.gridCount/bp.gridCols}
              </span>
            )}
          </div>
          <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,marginTop:2,color:"var(--tf)",letterSpacing:".08em"}}>
            {bp.type==='raised-bed'
              ?`${bp.tiles.length}/32 planted — drag crops from the library`
              :`${bp.gridCols}×${bp.gridCount/bp.gridCols} GRID · ${bp.tiles.length} FEATURES PLACED`}
          </p>

        </div>
        <button onClick={onReset} style={{display:"flex",alignItems:"center",gap:6,padding:"5px 11px",borderRadius:9,fontSize:11,fontFamily:"'Inter',sans-serif",cursor:"pointer",transition:"all 0.15s",background:"rgba(0,255,170,0.05)",border:"1px solid rgba(0,255,170,0.16)",color:"var(--jade2)"}}>
          <RotateCcw style={{width:11,height:11}}/> Reset view
        </button>
      </div>
      {conflicts.length>0&&(
        <ConflictBanner conflicts={conflicts}/>
      )}
      {companions.length>0&&(
        <CompanionBanner pairs={companions}/>
      )}
      {/* Grid */}
      <div className="hex" style={{padding:gridPixelSize<340?8:14,background:"rgba(0,28,16,0.60)",display:'flex',flexDirection:'column',alignItems:'center'}}>

        <div style={{userSelect:"none",cursor:isDragging?"grabbing":"grab",width:gridPixelSize,maxWidth:'100%',margin:"0 auto"}}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}>
          <div data-bp-id={bp.id} style={{display:'grid',gridTemplateColumns:`repeat(${bp.gridCols},1fr)`,gap:gridPixelSize<340?3:5,transform:`rotateX(${bp.rotation.x}deg) rotateY(${bp.rotation.y}deg)`,transition:isDragging?'none':'transform 0.15s cubic-bezier(0.22,1,0.36,1)'}}>
            {(()=>{
              const tileById=new Map(bp.tiles.map((t:{id:number;icon:string})=>[t.id,t]));
              return Array(bp.gridCount).fill(0).map((_,i)=>{
              const placed=tileById.get(i);
              return(
                <div key={`${i}-${placed?.icon??'e'}`}
                  onDragOver={e=>{e.preventDefault();e.currentTarget.style.outline='2px solid rgba(0,255,170,0.6)';}}
                  onDragLeave={e=>{e.currentTarget.style.outline='';}}
                  onDrop={e=>{
                    e.preventDefault();
                    e.currentTarget.style.outline='';
                    const fromId=e.dataTransfer.getData('tile-move');
                    const em=_draggedEmoji||e.dataTransfer.getData('text/plain');
                    _draggedEmoji='';
                    _isDraggingFromLibrary=false;
                    if(fromId!==''){
                      onTileMove(Number(fromId),i);
                    } else if(em){
                      onDrop(i,em);
                    }
                  }}
                  onClick={()=>{if(placed)onTileClick(i,placed.icon);}}
                  className={placed?"tile-placed":"tile-empty"} style={{borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",position:"relative",transition:"all 0.16s cubic-bezier(0.22,1,0.36,1)",cursor:placed?"pointer":"default",aspectRatio:"1",fontSize:20,opacity:1}}>
                  {placed?(
                    <div
                      draggable
                      onMouseDown={e=>e.stopPropagation()}
                      onDragStart={e=>{
                        e.stopPropagation();
                        _draggedEmoji=''; // clear any stale library drag
                        e.dataTransfer.setData('tile-move',String(i));
                        e.dataTransfer.setData('text/plain','');
                        e.dataTransfer.effectAllowed='move';
                        (e.currentTarget.parentElement as HTMLElement).style.opacity='0.45';
                      }}
                      onDragEnd={e=>{
                        (e.currentTarget.parentElement as HTMLElement).style.opacity='1';
                      }}
                      style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:1,width:"100%",height:"100%",padding:"1px 1px 0",cursor:"grab"}}
                      title="Drag to move · Click to view guide">
                      {(()=>{const _iconSz=Math.max(10,Math.min(22,Math.floor(gridPixelSize/bp.gridCols*0.28)));return placed.icon==='🌱'||placed.icon==='🫒'?<span style={{fontSize:_iconSz+2,lineHeight:1}}>{placed.icon}</span>:<FeatureIcon emoji={placed.icon} size={_iconSz}/>;})()
                      }
                      {(gridPixelSize/bp.gridCols)>=28&&<span style={{fontSize:Math.max(6,Math.min(8,Math.floor(gridPixelSize/bp.gridCols*0.13))),fontFamily:"'Inter',sans-serif",fontWeight:600,textAlign:"center",width:"100%",color:"var(--tf)",display:'-webkit-box',WebkitLineClamp:1,WebkitBoxOrient:'vertical',overflow:'hidden',lineHeight:1.1}}>{ICON_LOOKUP.get(placed.icon)?.name??''}</span>}
                    </div>
                  ):(
                    <span style={{color:'rgba(0,255,170,0.14)',fontSize:10}}>+</span>
                  )}
                  {placed&&(
                    <button onClick={e=>{e.stopPropagation();onRemove(i);}}
                      style={{position:"absolute",top:-6,right:-6,width:16,height:16,display:"flex",alignItems:"center",justifyContent:"center",borderRadius:"50%",zIndex:10,cursor:"pointer",background:"var(--red)",border:"1px solid rgba(255,77,109,0.5)",transition:"transform 0.12s"}}>
                      <X style={{width:8,height:8,color:"white"}}/>
                    </button>
                  )}
                </div>
              );
            });})()}
          </div>
        </div>
        <p style={{fontSize:9,color:'var(--ts)',textAlign:'center',marginTop:16,letterSpacing:'.18em',textTransform:'uppercase',fontFamily:"'JetBrains Mono',monospace"}}>⟳ DRAG BG TO ORBIT · DRAG ICON TO MOVE · CLICK ICON FOR GUIDE</p>
      </div>
    </div>
  );
}

/* ==== FEATURE DETAIL PANEL (slide-in) ==== */
function FeaturePanel({mf,info,onClose,onRemove}:{mf:any;info:any;onClose:()=>void;onRemove:()=>void}){
  const diffN=({Easy:1,Medium:2,Hard:3} as any)[info?.difficulty??'Easy']??1;
  const lib=ICON_LOOKUP.get(mf.emoji);
  const C=lib?(CAT_COLOR[lib.category]??'#00ffaa'):'#00ffaa';

  return(
    <div style={{position:'fixed',inset:0,zIndex:9999,
        display:'flex',alignItems:'center',justifyContent:'center',
        background:'rgba(2,8,4,0.75)',backdropFilter:'blur(12px)',
        padding:16}}
      onClick={onClose}>

      {/* Panel — centered modal */}
      <div className="a-scaleIn" onClick={e=>e.stopPropagation()}
        style={{
          width:'100%',maxWidth:420,maxHeight:'90vh',
          display:'flex',flexDirection:'column',overflowY:'auto',
          background:'rgba(8,22,14,0.97)',
          border:`1px solid ${C}30`,
          borderRadius:20,
          boxShadow:`0 40px 100px rgba(0,0,0,0.70), 0 0 0 1px ${C}10`,
        }}>

        {/* Colour top edge */}
        <div style={{height:2,background:'linear-gradient(90deg,transparent,'+C+','+C+'88,transparent)',flexShrink:0}}/>

        {/* Header */}
        <div style={{
          display:'flex',alignItems:'center',justifyContent:'space-between',
          padding:'14px 20px',
          borderBottom:'1px solid rgba(0,255,170,0.08)',
          flexShrink:0,
        }}>
          <span style={{fontSize:8,fontFamily:"'JetBrains Mono',monospace",letterSpacing:'.16em',
            textTransform:'uppercase',color:'var(--ts)',fontWeight:700}}>Feature Guide</span>
          <button onClick={onClose} style={{
            width:28,height:28,borderRadius:8,cursor:'pointer',
            display:'flex',alignItems:'center',justifyContent:'center',
            background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.09)',
            transition:'transform 0.14s,opacity 0.14s,border-color 0.14s,box-shadow 0.14s',
          }}
            onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background='rgba(255,255,255,0.09)';}}
            onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background='rgba(255,255,255,0.04)';}}>
            <X style={{width:13,height:13,color:'var(--tf)'}}/>
          </button>
        </div>

        {/* Body */}
        <div style={{flex:1,padding:'20px 20px 12px',display:'flex',flexDirection:'column',gap:16}}>

          {/* Hero -- emoji + name + category badge */}
          <div style={{textAlign:'center',paddingBottom:16,borderBottom:'1px solid rgba(0,255,170,0.07)'}}>
            <div style={{
              width:72,height:72,borderRadius:20,margin:'0 auto 12px',
              background:`${C}14`,border:`1px solid ${C}30`,
              display:'flex',alignItems:'center',justifyContent:'center',
              boxShadow:`0 0 24px ${C}20`,
            }}>
              <FeatureIcon emoji={mf.emoji} size={36}/>
            </div>
            <h3 style={{
              fontSize:19,fontWeight:800,color:'var(--tp)',
              fontFamily:"'Space Grotesk',sans-serif",letterSpacing:'.02em',marginBottom:6,
            }}>{info.name}</h3>
            <span style={{
              display:'inline-block',padding:'2px 10px',borderRadius:99,
              fontSize:8.5,fontWeight:700,letterSpacing:'.08em',textTransform:'uppercase',
              fontFamily:"'JetBrains Mono',monospace",
              background:`${C}18`,border:`1px solid ${C}35`,color:C,
            }}>{lib?.category??'feature'}</span>
          </div>

          {/* Stats row -- yield, water, co2, cost */}
          {lib&&(
            <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:6}}>
              {[
                {label:'YIELD', value:lib.yieldLbs>0?lib.yieldLbs.toLocaleString()+' lbs':'—',  color:'#00ffaa'},
                {label:'WATER', value:lib.waterGal>0?lib.waterGal.toLocaleString()+' gal':'—',  color:'#00d4ff'},
                {label:'CO₂',   value:lib.co2>0?lib.co2+' lbs':'—',                             color:'#ffb830'},
                {label:'COST',  value:'$'+Math.round((lib.costMin+lib.costMax)/2).toLocaleString(), color:'#a78bfa'},
              ].map(({label,value,color})=>(
                <div key={label} style={{
                  padding:'8px 4px',borderRadius:10,textAlign:'center',
                  background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.07)',
                }}>
                  <div style={{fontSize:12,fontWeight:800,color,lineHeight:1.2,
                    fontFamily:"'JetBrains Mono',monospace",marginBottom:3}}>{value}</div>
                  <div style={{fontSize:7.5,color:'var(--ts)',letterSpacing:'.10em',
                    textTransform:'uppercase',fontFamily:"'JetBrains Mono',monospace"}}>{label}</div>
                </div>
              ))}
            </div>
          )}

          {/* Install meta -- time / difficulty / roi */}
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:6}}>
            {[
              {label:'TIME',  value:info.time,    icon:'⏱'},
              {label:'LEVEL', value:info.difficulty??'Easy', icon:'◆'},
              {label:'ROI',   value:info.roi,     icon:'📈'},
            ].map(({label,value,icon})=>(
              <div key={label} style={{
                padding:'10px 8px',borderRadius:10,textAlign:'center',
                background:'rgba(0,255,170,0.04)',border:'1px solid rgba(0,255,170,0.10)',
              }}>
                <div style={{fontSize:14,marginBottom:4,lineHeight:1}}>{icon}</div>
                <div style={{fontSize:11,fontWeight:600,color:'var(--td)',
                  fontFamily:"'Inter',sans-serif",lineHeight:1.2,marginBottom:2}}>{value}</div>
                <div style={{fontSize:7.5,color:'var(--ts)',letterSpacing:'.10em',
                  textTransform:'uppercase',fontFamily:"'JetBrains Mono',monospace"}}>{label}</div>
              </div>
            ))}
          </div>

          {/* Difficulty dots */}
          <div style={{display:'flex',alignItems:'center',gap:8}}>
            <span style={{fontSize:8,fontFamily:"'JetBrains Mono',monospace",letterSpacing:'.12em',
              textTransform:'uppercase',color:'var(--ts)'}}>Difficulty</span>
            <div style={{display:'flex',gap:5,alignItems:'center'}}>
              {['Easy','Medium','Hard'].map((lvl,i)=>(
                <div key={lvl} style={{
                  display:'flex',alignItems:'center',gap:4,padding:'2px 8px',
                  borderRadius:99,fontSize:8.5,fontWeight:700,fontFamily:"'JetBrains Mono',monospace",
                  background:i<diffN?'rgba(245,158,11,0.12)':'rgba(255,255,255,0.04)',
                  border:`1px solid ${i<diffN?'rgba(245,158,11,0.30)':'rgba(255,255,255,0.08)'}`,
                  color:i<diffN?'var(--amber)':'var(--ts)',
                }}>{lvl}</div>
              ))}
            </div>
          </div>

          {/* Example */}
          {info.example&&(
            <div style={{
              padding:'12px 14px',borderRadius:12,
              background:'rgba(125,211,252,0.05)',border:'1px solid rgba(125,211,252,0.14)',
            }}>
              <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:7}}>
                <BookOpen style={{width:11,height:11,color:'#7dd3fc',flexShrink:0}}/>
                <span style={{fontSize:8,fontFamily:"'JetBrains Mono',monospace",letterSpacing:'.12em',
                  textTransform:'uppercase',color:'#7dd3fc',fontWeight:700}}>Real-World Example</span>
              </div>
              <p style={{fontSize:12,fontFamily:"'Inter',sans-serif",lineHeight:1.65,
                color:'rgba(200,240,225,0.80)',margin:0}}>{info.example}</p>
            </div>
          )}

          {/* Installation steps */}
          <div>
            <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:10}}>
              <div style={{width:2,height:11,borderRadius:2,background:'linear-gradient(180deg,'+C+','+C+'66)'}}/>
              <span style={{fontSize:8,fontFamily:"'JetBrains Mono',monospace",letterSpacing:'.14em',
                textTransform:'uppercase',color:C,fontWeight:700}}>Installation Steps</span>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:7}}>
              {info.steps.map((step:string,i:number)=>(
                <div key={i} style={{display:'flex',gap:10,alignItems:'flex-start'}}>
                  <div style={{
                    width:20,height:20,borderRadius:6,flexShrink:0,
                    display:'flex',alignItems:'center',justifyContent:'center',
                    background:`${C}14`,border:`1px solid ${C}28`,
                    fontSize:9,fontWeight:800,color:C,
                    fontFamily:"'JetBrains Mono',monospace",
                  }}>{i+1}</div>
                  <p style={{fontSize:12,fontFamily:"'Inter',sans-serif",lineHeight:1.60,
                    color:'var(--td)',margin:0,paddingTop:2}}>{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Context / homestead fit */}
          {info.context&&(
            <div style={{
              padding:'10px 12px',borderRadius:10,
              background:'rgba(0,255,170,0.04)',border:'1px solid rgba(0,255,170,0.10)',
              display:'flex',alignItems:'flex-start',gap:8,
            }}>
              <Info style={{width:12,height:12,color:'var(--jade2)',flexShrink:0,marginTop:1}}/>
              <p style={{fontSize:11,fontFamily:"'Inter',sans-serif",lineHeight:1.55,
                color:'var(--td)',margin:0}}>{info.context}</p>
            </div>
          )}

          {/* Companion planting section */}
          {(()=>{
            const companions=getCompanions(mf.emoji);
            if(companions.length===0)return null;
            return(
              <div>
                <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:10}}>
                  <div style={{width:2,height:11,borderRadius:2,background:'linear-gradient(180deg,#00ffaa,#00ffaa66)'}}/>
                  <span style={{fontSize:8,fontFamily:"'JetBrains Mono',monospace",letterSpacing:'.14em',
                    textTransform:'uppercase',color:'#00ffaa',fontWeight:700}}>Companion Plants</span>
                </div>
                <div style={{display:'flex',flexDirection:'column',gap:7}}>
                  {companions.map(({partner,benefit},i)=>{
                    const pname=ICON_LOOKUP.get(partner)?.name??partner;
                    return(
                      <div key={i} style={{display:'flex',gap:10,alignItems:'flex-start',
                        padding:'9px 11px',borderRadius:10,
                        background:'rgba(0,255,170,0.04)',border:'1px solid rgba(0,255,170,0.12)'}}>
                        <div style={{flexShrink:0,fontSize:18,lineHeight:1,paddingTop:1}}>{partner}</div>
                        <div>
                          <div style={{fontSize:11,fontWeight:700,color:'var(--jade2)',
                            fontFamily:"'Inter',sans-serif",marginBottom:3}}>{pname}</div>
                          <div style={{fontSize:11,color:'var(--ts)',fontFamily:"'Inter',sans-serif",
                            lineHeight:1.55}}>{benefit}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}
        </div>

        {/* Action buttons */}
        <div style={{
          display:'flex',gap:10,padding:'14px 20px',
          borderTop:'1px solid rgba(0,255,170,0.08)',
          flexShrink:0,background:'rgba(0,255,170,0.015)',
        }}>
          {mf.tileId!==-1&&(
            <button onClick={onRemove} style={{
              flex:1,padding:'10px',borderRadius:11,cursor:'pointer',
              fontFamily:"'Inter',sans-serif",fontSize:13,fontWeight:600,
              background:'rgba(239,68,68,0.08)',border:'1px solid rgba(239,68,68,0.24)',
              color:'var(--red)',transition:'transform 0.14s,opacity 0.14s,border-color 0.14s,box-shadow 0.14s',
            }}
              onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background='rgba(239,68,68,0.14)';}}
              onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background='rgba(239,68,68,0.08)';}}>
              Remove from map
            </button>
          )}
          <button onClick={onClose} style={{
            flex:1,padding:'10px',borderRadius:11,cursor:'pointer',
            fontFamily:"'Inter',sans-serif",fontSize:13,fontWeight:600,
            background:`${C}14`,border:`1px solid ${C}30`,
            color:C,transition:'transform 0.14s,opacity 0.14s,border-color 0.14s,box-shadow 0.14s',
          }}
            onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background=`${C}22`;}}
            onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background=`${C}14`;}}>
            {mf.tileId!==-1?'Keep on map':'Close'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ==== ROI CALCULATOR ==== */
function ROICalculator({calc}:{calc:CalcResult}){
  const[year,setYear]=useState(5);
  const data=useMemo(()=>Array.from({length:20},(_,i)=>{const n=i+1;const cumReturn=Math.round(calc.year1Savings*((Math.pow(1.03,n)-1)/0.03));const cost=Math.round((calc.estimatedCostMin+calc.estimatedCostMax)/2);return{year:n,value:cumReturn-cost};}),[calc.year1Savings,calc.estimatedCostMin,calc.estimatedCostMax]);
  const sel=data[year-1];const be=data.findIndex((d:any)=>d.value>=0)+1;const mx=Math.max(1,...data.map((d:any)=>Math.abs(d.value)));
  const showBreakeven=be>0&&be<=20&&calc.year1Savings>0;
  return(
    <div className="a-fadeUp" style={{display:"flex",flexDirection:"column",gap:14}}>
      {/* Header card */}
      <div style={{borderRadius:18,padding:"20px 22px",background:"rgba(14,30,20,0.76)",border:"1px solid rgba(0,255,170,0.09)"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:4}}>
          <h3 style={{fontSize:17,fontWeight:800,color:"var(--tp)",fontFamily:"'Space Grotesk',sans-serif",letterSpacing:'.04em'}}>ROI Projection</h3>
          {showBreakeven&&<span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,fontWeight:700,padding:'3px 12px',borderRadius:99,background:'rgba(0,255,170,0.08)',border:'1px solid rgba(0,255,170,0.25)',color:'var(--jade)',letterSpacing:'.06em'}}>BREAKEVEN YR {be}</span>}
        </div>
        <p style={{fontFamily:"'Inter',sans-serif",fontSize:13,color:'var(--td)',marginBottom:20,lineHeight:1.65}}>Click any bar to explore that year's cumulative net return from your blueprint investment.</p>
        {/* Bar chart */}
        <div style={{display:"flex",alignItems:"flex-end",gap:2,height:100,marginBottom:8}}>
          {data.map((d:any,i:number)=>{
            const isSel=i===year-1;const h=Math.max(3,Math.round((Math.abs(d.value)/mx)*100));
return <button key={d.year} onClick={()=>setYear(d.year)}
  style={{
    flex:1, borderRadius:'4px 4px 0 0',
    height:`${h}%`,
    background:isSel?'var(--jade)':d.value>=0?'rgba(0,255,170,0.28)':'rgba(255,77,109,0.25)',
    boxShadow:isSel?'0 0 14px rgba(0,255,170,0.5)':undefined,
    cursor:'pointer', transformOrigin:'bottom',
    transition:'filter 0.16s, transform 0.16s',
  }}
  title={`Yr ${d.year}: ${d.value>=0?'+':''}$${d.value.toLocaleString()}`}/>;
          })}
        </div>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:9,fontFamily:"'JetBrains Mono',monospace",color:"var(--ts)",letterSpacing:".18em",marginBottom:16}}>
          <span>YR 1</span><span>YR 10</span><span>YR 20</span>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
          {[{l:'YEAR SELECTED',v:String(year),c:'var(--tp)'},{l:'NET RETURN',v:`${sel?.value>=0?'+':''}$${sel?.value.toLocaleString()}`,c:sel?.value>=0?'var(--jade)':'var(--red)'},{l:'AVG / YEAR',v:`$${Math.round(calc.year1Savings).toLocaleString()}`,c:'var(--amber)'}].map(({l,v,c})=>(
            <div key={l} style={{borderRadius:12,padding:"12px",textAlign:"center",background:"rgba(0,255,170,0.04)",border:"1px solid rgba(0,255,170,0.09)"}}>
              <p style={{fontSize:8,fontFamily:"'JetBrains Mono',monospace",letterSpacing:".14em",marginBottom:4,color:"var(--tf)"}}>{l}</p>
              <p style={{fontSize:20,fontWeight:800,color:c,fontFamily:"'Space Grotesk',sans-serif"}}>{v}</p>
            </div>
          ))}
        </div>
        <p style={{fontSize:8,fontFamily:"'JetBrains Mono',monospace",textAlign:"center",marginTop:12,color:"var(--ts)",letterSpacing:".12em"}}>3% ANNUAL COMPOUNDING ASSUMED</p>
      </div>
      {/* Personalised ROI Breakdown */}
      <div style={{borderRadius:18,padding:'20px 22px',background:'rgba(0,213,255,0.04)',border:'1px solid rgba(0,213,255,0.10)'}}>
        {/* Section header */}
        <div style={{display:'flex',alignItems:'center',gap:9,marginBottom:18}}>
          <div style={{width:3,height:18,borderRadius:2,background:'linear-gradient(180deg,#00d4ff,#00ffaa)',flexShrink:0}}/>
          <p style={{fontSize:15,fontWeight:800,color:'var(--tp)',fontFamily:"'Space Grotesk',sans-serif",letterSpacing:'.03em',margin:0}}>
            Personalised ROI Breakdown
          </p>
        </div>
        {calc.featureBreakdown.length===0?(
          <p style={{fontSize:13,color:'var(--tf)',fontFamily:"'Inter',sans-serif"}}>
            Place features on your maps to see a personalised savings breakdown.
          </p>
        ):(
          <>
            <div style={{display:'flex',flexDirection:'column',gap:10,marginBottom:20}}>
              {calc.featureBreakdown.map(f=>{
                const cnt=f.count??1;
                const ANIMAL_RATE_ROI:Record<string,number>={'🐔':3.30,'🦆':3.30,'🐐':1.25,'🐖':3.00,'🐇':3.00,'🐝':8.00};
                const foodRate=ANIMAL_RATE_ROI[f.emoji]??0.80;
                const foodSav=Math.round(f.yieldLbs*foodRate*cnt);
                const waterSav=Math.round(f.waterGal*0.005*cnt);
                const co2Sav=Math.round(f.co2*0.023*cnt);
                const libEntry=ICON_LOOKUP.get(f.emoji);
                const energySav=(f.emoji==='☀️'?200:f.emoji==='🌬️'?200:f.emoji==='🔋'?120:f.emoji==='⚡'?60:0)*cnt;
                const grandTotal=foodSav+waterSav+co2Sav+energySav;
                if(grandTotal===0)return null;
                const maxSav=Math.max(...calc.featureBreakdown.map(fb=>{
                  const c=fb.count??1;
                  const ar=ANIMAL_RATE_ROI[fb.emoji]??0.80;
                  return Math.round(fb.yieldLbs*ar*c)+Math.round(fb.waterGal*0.005*c)+Math.round(fb.co2*0.023*c)+(fb.emoji==='☀️'?200:fb.emoji==='🌬️'?200:fb.emoji==='🔋'?120:fb.emoji==='⚡'?60:0)*c;
                }),1);
                const pct=Math.round((grandTotal/maxSav)*100);
                return(
                  <div key={f.emoji} style={{
                    borderRadius:14,padding:'12px 14px',
                    background:'rgba(0,255,170,0.04)',
                    border:'1px solid rgba(0,255,170,0.10)',
                  }}>
                    {/* Row: emoji + name + total */}
                    <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:9}}>
                      <FeatureIcon emoji={f.emoji} size={22}/>
                      <span style={{fontSize:14,fontWeight:600,color:'var(--tp)',
                        fontFamily:"'Inter',sans-serif",flex:1}}>{f.name}{cnt>1&&<span style={{fontSize:11,fontWeight:500,opacity:0.55,marginLeft:4}}>×{cnt}</span>}</span>
                      <span style={{fontSize:16,fontWeight:800,color:'#00ffaa',
                        fontFamily:"'Space Grotesk',sans-serif",letterSpacing:'-.01em',flexShrink:0}}>
                        ${grandTotal}<span style={{fontSize:10,opacity:0.6}}>/yr</span>
                      </span>
                    </div>
                    {/* Progress bar */}
                    <div style={{height:5,borderRadius:99,overflow:'hidden',
                      marginBottom:10,background:'rgba(0,255,170,0.09)'}}>
                      <div style={{height:'100%',borderRadius:99,width:pct+'%',
                        background:'linear-gradient(90deg,#00ffaa,#00d4ff)',
                        transition:'width 0.8s cubic-bezier(0.22,1,0.36,1)'}}/>
                    </div>
                    {/* Breakdown tags */}
                    <div style={{display:'flex',flexWrap:'wrap',gap:'5px 14px'}}>
                      {foodSav>0&&(
                        <span style={{fontSize:11,color:'#00ffaa',fontFamily:"'Inter',sans-serif"}}>
                          🌾 Food <strong>${foodSav}</strong>
                        </span>
                      )}
                      {waterSav>0&&(
                        <span style={{fontSize:11,color:'#7dd3fc',fontFamily:"'Inter',sans-serif"}}>
                          💧 Water <strong>${waterSav}</strong>
                        </span>
                      )}
                      {energySav>0&&(
                        <span style={{fontSize:11,color:'var(--amber)',fontFamily:"'Inter',sans-serif"}}>
                          ⚡ Energy <strong>${energySav}</strong>
                        </span>
                      )}
                      {co2Sav>0&&(
                        <span style={{fontSize:11,color:'#a0ff60',fontFamily:"'Inter',sans-serif"}}>
                          🌿 Carbon <strong>${co2Sav}</strong>
                        </span>
                      )}
                      {libEntry&&(
                        <span style={{fontSize:11,color:'var(--ts)',fontFamily:"'Inter',sans-serif",marginLeft:'auto'}}>
                          Setup: $${Math.round((libEntry.costMin+libEntry.costMax)/2)}
                        </span>
                      )}
                    </div>
                  </div>
                );
              }).filter(Boolean)}
            </div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10,paddingTop:16,borderTop:'1px solid rgba(0,213,255,0.10)'}}>
              {[['Total Setup',`$${calc.estimatedCostMin.toLocaleString()}`,'var(--tp)'],
                ['Year 1 Return',`$${calc.year1Savings.toLocaleString()}`,'var(--jade)'],
                ['Payback',calc.paybackYears>0?`${calc.paybackYears} yrs`:'N/A','var(--amber)'],
              ].map(([l,v,c])=>(
                <div key={l as string} style={{borderRadius:16,padding:'12px',textAlign:'center',background:'rgba(0,213,255,0.05)',border:'1px solid rgba(0,213,255,0.14)'}}>
                  <p style={{fontSize:8,fontFamily:"'JetBrains Mono',monospace",letterSpacing:".14em",marginBottom:4,color:"var(--tf)"}}>{l}</p>
                  <p style={{fontSize:18,fontWeight:800,color:c as string,fontFamily:"'Space Grotesk',sans-serif"}}>{v}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      {/* Improve ROI */}
      <div style={{borderRadius:18,padding:"18px 20px",background:"rgba(0,255,170,0.03)",border:"1px solid rgba(0,255,170,0.09)"}}>
        <p style={{fontSize:8,fontFamily:"'JetBrains Mono',monospace",letterSpacing:".14em",textTransform:"uppercase",marginBottom:12,color:"var(--jade2)"}}>Improve Your ROI</p>
        <div style={{display:"flex",flexDirection:"column",gap:13}}>
          {[{emoji:'☀️',label:'Solar Panel',detail:'Top energy ROI: ~$200/yr savings from a 1kW starter system (2–3 panels), payback 8–12 yrs.',show:!calc.featureBreakdown.find(f=>f.emoji==='☀️')},
            {emoji:'🍎',label:'Apple Tree',detail:'Best food ROI: ~$60/yr per tree for 50+ years from yield and carbon sequestration. Choose variety for your zone.',show:!calc.featureBreakdown.find(f=>['🍎','🍋','🍑','🍐','🥭','🍌','🍄','🫚','🍊','🍒','🥑'].includes(f.emoji))},
            {emoji:'♻️',label:'Compost Bin',detail:'Boosts yields 30–40% and sequesters 40 lbs CO₂/yr. Low cost, long-term soil value.',show:!calc.featureBreakdown.find(f=>f.emoji==='♻️')},
            {emoji:'💧',label:'Rain Tank',detail:'Captures ~4,000 gal/yr from a 500-gal tank on 1,000 sq ft of roof. Reduces irrigation costs and runoff.',show:!calc.featureBreakdown.find(f=>f.emoji==='💧')},
          ].filter(t=>t.show).slice(0,3).map((tip)=>(
            <div key={tip.label} style={{display:"flex",gap:11,alignItems:"flex-start"}}>
              <FeatureIcon emoji={tip.emoji} size={20}/>
              <div>
                <p style={{fontSize:14,fontWeight:700,color:"var(--tp)",fontFamily:"'Inter',sans-serif",marginBottom:2}}>{tip.label}</p>
                <p style={{fontSize:11,lineHeight:1.6,color:"var(--td)",fontFamily:"'Inter',sans-serif",margin:0}}>{tip.detail}</p>
              </div>
            </div>
          ))}
          {calc.featureBreakdown.length>=8&&<p style={{fontSize:11,color:"var(--jade)",fontFamily:"'Inter',sans-serif"}}>✓ Great ROI — your layout covers all major savings categories.</p>}
        </div>
      </div>
      {/* Feature breakdown */}
      {calc.featureBreakdown.length>0&&(
        <div style={{borderRadius:22,padding:'20px 22px',background:'rgba(8,20,12,0.76)',border:'1px solid rgba(0,255,170,0.09)'}}>
          <p style={{fontSize:9,fontFamily:"'JetBrains Mono',monospace",letterSpacing:'.14em',textTransform:'uppercase',marginBottom:12,color:'var(--jade2)'}}>Feature Contributions</p>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {calc.featureBreakdown.map(f=>{
              const cnt=f.count??1;
              return(
              <div key={f.emoji} style={{display:"flex",alignItems:"center",gap:10,fontSize:12,color:"var(--td)",fontFamily:"'Inter',sans-serif"}}>
                <FeatureIcon emoji={f.emoji} size={18}/>
                <span style={{flex:1,fontSize:11}}>{f.name}{cnt>1&&<span style={{opacity:0.5,fontSize:10}}> ×{cnt}</span>}</span>
                {f.yieldLbs>0&&<span style={{fontSize:10,fontFamily:"'JetBrains Mono',monospace",color:"var(--jade2)"}}>{f.yieldLbs*cnt} lbs</span>}
                {f.waterGal>0&&<span style={{fontSize:10,fontFamily:"'JetBrains Mono',monospace",color:"#7dd3fc"}}>{(f.waterGal*cnt).toLocaleString()} gal</span>}
                {f.co2>0&&<span style={{fontSize:10,fontFamily:"'JetBrains Mono',monospace",color:"#d97706"}}>{f.co2*cnt} lbs CO₂</span>}
              </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/* ==== SEASONAL CALENDAR ==== */
// Month-level planting data per crop emoji keyed by climate zone
// Format: [sowStart, sowEnd, harvestStart, harvestEnd] (0=Jan, 11=Dec)
const CROP_MONTHS:Record<string,Record<string,[number,number,number,number]>>={
  '🍅':{Temperate:[2,4,6,9],Arid:[1,3,5,8],Subtropical:[1,3,4,8],Cold:[3,4,7,9]},
  '🥕':{Temperate:[2,4,7,10],Arid:[8,10,11,13],Subtropical:[8,10,11,13],Cold:[3,4,8,10]},
  '🥬':{Temperate:[1,3,8,10],Arid:[8,10,11,13],Subtropical:[8,10,11,13],Cold:[2,3,8,10]},
  '🥦':{Temperate:[1,2,8,9],Arid:[8,9,11,12],Subtropical:[8,9,11,12],Cold:[2,3,8,9]},
  '🥒':{Temperate:[3,5,6,9],Arid:[2,4,5,8],Subtropical:[2,4,5,8],Cold:[4,5,7,9]},
  '🌽':{Temperate:[3,5,7,9],Arid:[2,4,6,8],Subtropical:[2,4,6,8],Cold:[4,5,8,9]},
  '🫘':{Temperate:[3,5,7,9],Arid:[2,3,5,7],Subtropical:[2,3,5,7],Cold:[4,5,8,9]},
  '🧄':{Temperate:[9,11,4,6],Arid:[9,10,3,5],Subtropical:[9,10,3,5],Cold:[9,10,5,7]},
  '🧅':{Temperate:[1,3,6,8],Arid:[8,10,1,3],Subtropical:[8,10,1,3],Cold:[2,3,7,9]},
  '🥔':{Temperate:[2,4,7,9],Arid:[1,2,5,7],Subtropical:[1,2,5,7],Cold:[3,4,8,9]},
  '🎃':{Temperate:[3,5,8,10],Arid:[2,4,7,9],Subtropical:[2,4,7,9],Cold:[4,5,8,10]},
  '🍓':{Temperate:[2,3,5,7],Arid:[1,2,4,6],Subtropical:[1,2,4,6],Cold:[3,4,6,8]},
  '🌿':{Temperate:[2,4,5,10],Arid:[1,3,4,10],Subtropical:[1,3,4,10],Cold:[3,5,6,10]},
  '🌱':{Temperate:[2,4,4,10],Arid:[1,3,3,10],Subtropical:[1,3,3,10],Cold:[3,4,5,10]},
  '🍆':{Temperate:[3,5,7,9],Arid:[2,4,6,8],Subtropical:[2,4,6,8],Cold:[4,5,7,9]},
  '🌶️':{Temperate:[3,5,7,9],Arid:[2,4,6,8],Subtropical:[2,4,6,8],Cold:[4,5,7,9]},
};
const MONTHS_SHORT=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const MONTH_COLORS={sow:'rgba(0,238,255,0.70)',harvest:'rgba(68,238,136,0.80)',both:'rgba(167,139,250,0.80)'};

function SeasonalCalendar({zone,userTiles}:{zone:string;userTiles:string[]}){
  const currentSeasonIdx=useMemo(()=>{
    const m=new Date().getMonth();
    if(m>=2&&m<=4)return 0;
    if(m>=5&&m<=7)return 1;
    if(m>=8&&m<=10)return 2;
    return 3;
  },[]);
  const[view,setView]=useState<'season'|'monthly'>('season');
  const[active,setActive]=useState(currentSeasonIdx);
  const s=SEASONAL[zone]??SEASONAL['Temperate'];
  const cs=s[active];
  const currentMonth=new Date().getMonth();

  // Filter crop months to only crops the user has placed
  const userCrops=useMemo(()=>{
    const placed=new Set(userTiles);
    return Object.entries(CROP_MONTHS).filter(([em])=>placed.has(em));
  },[userTiles]);

  // For each month, which crops are sow vs harvest
  const monthlyData=useMemo(()=>{
    return MONTHS_SHORT.map((_,mi)=>{
      const sow:string[]=[],harvest:string[]=[],both:string[]=[];
      userCrops.forEach(([em,zones])=>{
        const z=zones[zone]??zones['Temperate'];
        if(!z)return;
        let [s0,s1,h0,h1]=z;
        // Handle wrap-around (e.g. garlic sown Oct-Jan)
        const inSow=(s1>11)?(mi>=s0||mi<=s1-12):(mi>=s0&&mi<=s1);
        const inHarv=(h1>11)?(mi>=h0||mi<=h1-12):(mi>=h0&&mi<=h1);
        if(inSow&&inHarv)both.push(em);
        else if(inSow)sow.push(em);
        else if(inHarv)harvest.push(em);
      });
      return{sow,harvest,both};
    });
  },[userCrops,zone]);

  return(
    <div className="a-fadeUp" style={{borderRadius:18,overflow:'hidden',
      background:'rgba(14,30,20,0.76)',border:'1px solid rgba(0,255,170,0.09)'}}>
      {/* View toggle */}
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',
        padding:'12px 16px',borderBottom:'1px solid rgba(0,255,170,0.10)',
        background:'rgba(0,255,170,0.015)',gap:10,flexWrap:'wrap'}}>
        <div style={{display:'flex',gap:5}}>
          {(['season','monthly'] as const).map(v=>(
            <button key={v} onClick={()=>setView(v)} style={{
              padding:'5px 13px',borderRadius:8,cursor:'pointer',
              fontSize:11,fontWeight:700,letterSpacing:'.06em',textTransform:'uppercase',
              fontFamily:"'JetBrains Mono',monospace",
              background:view===v?'rgba(0,255,170,0.14)':'rgba(0,255,170,0.04)',
              border:view===v?'1px solid rgba(0,255,170,0.38)':'1px solid rgba(0,255,170,0.10)',
              color:view===v?'var(--jade)':'var(--ts)',
            }}>{v==='season'?'Seasonal':'Monthly'}</button>
          ))}
        </div>
        <span style={{fontSize:9,fontWeight:700,color:'rgba(68,238,136,0.60)',
          fontFamily:"'JetBrains Mono',monospace",letterSpacing:'.12em',
          padding:'4px 10px',borderRadius:99,
          background:'rgba(68,238,136,0.07)',border:'1px solid rgba(68,238,136,0.18)'}}>
          ◎ {zone.toUpperCase()}
        </span>
      </div>

      {/* ── SEASONAL VIEW ── */}
      {view==='season'&&(<>
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:6,padding:'14px 16px',
          borderBottom:'1px solid rgba(0,255,170,0.12)',background:'rgba(0,255,170,0.015)'}}>
          {s.map((season,i)=>(
            <button key={season.label} onClick={()=>setActive(i)} style={{
              padding:'8px 6px',borderRadius:10,cursor:'pointer',
              fontFamily:"'Inter',sans-serif",fontSize:12,fontWeight:600,
              transition:'all 0.16s cubic-bezier(0.22,1,0.36,1)',
              background:i===active?season.hex+'1a':'rgba(255,255,255,0.03)',
              color:i===active?season.hex:'var(--tf)',
              border:i===active?`1px solid ${season.hex}44`:'1px solid rgba(0,255,170,0.07)',
              boxShadow:i===active?`0 0 14px ${season.hex}18`:'none',
            }}>{season.label}</button>
          ))}
        </div>
        <div style={{padding:'18px 18px 14px'}}>
          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:14}}>
            <div style={{width:3,height:18,borderRadius:2,background:cs.hex,boxShadow:`0 0 8px ${cs.hex}66`}}/>
            <span style={{fontSize:13,fontWeight:700,color:cs.hex,fontFamily:"'Space Grotesk',sans-serif"}}>{cs.label}</span>
          </div>
          <ul style={{listStyle:'none',margin:'0 0 14px',padding:0,display:'flex',flexDirection:'column',gap:9}}>
            {cs.activities.map((a,i)=>(
              <li key={i} style={{display:'flex',alignItems:'flex-start',gap:10,
                fontSize:14,color:'var(--td)',fontFamily:"'Inter',sans-serif",lineHeight:1.70}}>
                <div style={{width:7,height:7,borderRadius:'50%',flexShrink:0,marginTop:5,
                  background:cs.hex,boxShadow:`0 0 5px ${cs.hex}77`}}/>
                {a}
              </li>
            ))}
          </ul>
          {cs.plantNow.length>0&&(
            <div style={{padding:'12px 13px',borderRadius:12,
              background:'rgba(0,255,170,0.04)',border:'1px solid rgba(0,255,170,0.10)'}}>
              <div style={{fontSize:8,letterSpacing:'.14em',color:'var(--jade2)',marginBottom:8,
                fontFamily:"'JetBrains Mono',monospace",textTransform:'uppercase',fontWeight:700}}>
                Plant Now
              </div>
              <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
                {cs.plantNow.map(em=>{
                  const nm=ICON_LOOKUP.get(em)?.name??'';
                  return(
                    <span key={em} style={{display:'inline-flex',alignItems:'center',gap:5,
                      padding:'3px 10px',borderRadius:99,fontSize:11,
                      fontFamily:"'Inter',sans-serif",fontWeight:500,
                      background:'rgba(0,255,170,0.07)',border:'1px solid rgba(0,255,170,0.16)',
                      color:'var(--jade3)'}}>{em} {nm}</span>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </>)}

      {/* ── MONTHLY VIEW ── */}
      {view==='monthly'&&(
        <div style={{padding:'16px'}}>
          {userCrops.length===0&&(
            <div style={{textAlign:'center',padding:'24px',color:'var(--ts)',
              fontSize:13,fontFamily:"'Inter',sans-serif",lineHeight:1.7}}>
              <div style={{fontSize:28,marginBottom:8}}>🌱</div>
              No crops placed yet. Generate a blueprint or add crops to your map to see your personalised planting schedule.
            </div>
          )}
          {userCrops.length>0&&(<>
            {/* Legend */}
            <div style={{display:'flex',gap:12,marginBottom:14,flexWrap:'wrap'}}>
              {[['Sow',MONTH_COLORS.sow,'🌱'],['Harvest',MONTH_COLORS.harvest,'✂️'],['Both',MONTH_COLORS.both,'◉']].map(([l,c,ic])=>(
                <div key={String(l)} style={{display:'flex',alignItems:'center',gap:5,fontSize:10,
                  color:'var(--ts)',fontFamily:"'Inter',sans-serif"}}>
                  <div style={{width:10,height:10,borderRadius:3,background:String(c)}}/>
                  {ic} {l}
                </div>
              ))}
            </div>
            {/* Month grid */}
            <div style={{overflowX:'auto',paddingBottom:4}}>
              <table style={{width:'100%',minWidth:320,borderCollapse:'separate',borderSpacing:'2px 2px'}}>
                <thead>
                  <tr>
                    <td style={{width:90,fontSize:9,color:'var(--ts)',fontFamily:"'JetBrains Mono',monospace",
                      padding:'4px 6px',letterSpacing:'.06em'}}>CROP</td>
                    {MONTHS_SHORT.map((m,mi)=>(
                      <td key={m} style={{textAlign:'center',fontSize:9,padding:'4px 2px',
                        fontFamily:"'JetBrains Mono',monospace",letterSpacing:'.04em',
                        color:mi===currentMonth?'var(--jade)':'var(--ts)',
                        fontWeight:mi===currentMonth?700:400,
                        background:mi===currentMonth?'rgba(0,255,170,0.06)':'transparent',
                        borderRadius:4,
                      }}>{m}</td>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {userCrops.map(([em,zones])=>{
                    const z=zones[zone]??zones['Temperate'];
                    const nm=ICON_LOOKUP.get(em)?.name??'';
                    return(
                      <tr key={em}>
                        <td style={{padding:'4px 6px',fontSize:11,color:'var(--td)',
                          fontFamily:"'Inter',sans-serif",whiteSpace:'nowrap',
                          overflow:'hidden',textOverflow:'ellipsis',maxWidth:90}}>
                          {em} {nm.split(' ')[0]}
                        </td>
                        {MONTHS_SHORT.map((_,mi)=>{
                          const d=monthlyData[mi];
                          const isSow=d.sow.includes(em);
                          const isHarv=d.harvest.includes(em);
                          const isBoth=d.both.includes(em);
                          const isCurrent=mi===currentMonth;
                          let bg='transparent';
                          if(isBoth)bg=MONTH_COLORS.both;
                          else if(isSow)bg=MONTH_COLORS.sow;
                          else if(isHarv)bg=MONTH_COLORS.harvest;
                          return(
                            <td key={mi} style={{padding:'3px 2px',textAlign:'center'}}>
                              <div style={{
                                height:20,borderRadius:4,
                                background:bg,
                                outline:isCurrent?'1px solid rgba(0,255,170,0.50)':'none',
                                outlineOffset:1,
                              }}/>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                  {/* Monthly task row */}
                  <tr>
                    <td style={{padding:'8px 6px 4px',fontSize:9,color:'var(--jade2)',
                      fontFamily:"'JetBrains Mono',monospace",letterSpacing:'.06em',
                      textTransform:'uppercase',fontWeight:700}}>Tasks</td>
                    {MONTHS_SHORT.map((_,mi)=>{
                      const sowCount=monthlyData[mi].sow.length+monthlyData[mi].both.length;
                      const harvCount=monthlyData[mi].harvest.length+monthlyData[mi].both.length;
                      const total=sowCount+harvCount;
                      const isCurrent=mi===currentMonth;
                      return(
                        <td key={mi} style={{textAlign:'center',padding:'3px 2px'}}>
                          <div style={{
                            height:20,borderRadius:4,display:'flex',alignItems:'center',
                            justifyContent:'center',fontSize:8,fontWeight:700,
                            fontFamily:"'JetBrains Mono',monospace",
                            background:total>0?(isCurrent?'rgba(0,255,170,0.18)':'rgba(0,255,170,0.07)'):'transparent',
                            color:total>0?(isCurrent?'var(--jade)':'var(--ts)'):'transparent',
                            outline:isCurrent?'1px solid rgba(0,255,170,0.40)':'none',
                            outlineOffset:1,
                          }}>{total>0?total:''}</div>
                        </td>
                      );
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
            {/* This month callout */}
            {(()=>{
              const d=monthlyData[currentMonth];
              const allThisMonth=[...d.sow,...d.harvest,...d.both];
              if(allThisMonth.length===0)return null;
              return(
                <div style={{marginTop:14,padding:'12px 14px',borderRadius:12,
                  background:'rgba(0,255,170,0.05)',border:'1px solid rgba(0,255,170,0.18)'}}>
                  <div style={{fontSize:9,letterSpacing:'.14em',color:'var(--jade2)',marginBottom:8,
                    fontFamily:"'JetBrains Mono',monospace",textTransform:'uppercase',fontWeight:700}}>
                    ◎ {MONTHS_SHORT[currentMonth].toUpperCase()} — ACTION NOW
                  </div>
                  <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
                    {d.sow.map(em=><span key={'s'+em} style={{display:'inline-flex',alignItems:'center',gap:4,
                      padding:'3px 9px',borderRadius:99,fontSize:11,fontWeight:500,
                      fontFamily:"'Inter',sans-serif",
                      background:'rgba(0,238,255,0.10)',border:'1px solid rgba(0,238,255,0.28)',
                      color:'rgba(140,230,255,0.90)'}}>🌱 {em} Sow now</span>)}
                    {d.harvest.map(em=><span key={'h'+em} style={{display:'inline-flex',alignItems:'center',gap:4,
                      padding:'3px 9px',borderRadius:99,fontSize:11,fontWeight:500,
                      fontFamily:"'Inter',sans-serif",
                      background:'rgba(68,238,136,0.10)',border:'1px solid rgba(68,238,136,0.28)',
                      color:'rgba(140,255,200,0.90)'}}>✂️ {em} Harvest</span>)}
                    {d.both.map(em=><span key={'b'+em} style={{display:'inline-flex',alignItems:'center',gap:4,
                      padding:'3px 9px',borderRadius:99,fontSize:11,fontWeight:500,
                      fontFamily:"'Inter',sans-serif",
                      background:'rgba(167,139,250,0.10)',border:'1px solid rgba(167,139,250,0.28)',
                      color:'rgba(210,190,255,0.90)'}}>◉ {em} Sow & harvest</span>)}
                  </div>
                </div>
              );
            })()}
          </>)}
        </div>
      )}
    </div>
  );
}

/* ==== EXAMPLE PROMPTS ==== */
const EXAMPLE_PROMPTS = [
  {label:'🌾 Food Independence', text:'I want 30% food self-sufficiency for a family of 4. Add raised beds with tomatoes, carrots, and lettuce, 2 fruit trees, and a compost bin.'},
  {label:'💧 Water Security',    text:'Maximize water capture on a temperate quarter-acre. Install a rain tank, swale for passive catchment, a pond, and drip irrigation for all growing areas.'},
  {label:'⚡ Off-Grid Energy',   text:'Solar panel for energy independence with a battery backup. Pair with a wind turbine and rain tank for a fully self-sufficient homestead.'},
  {label:'🐝 Biodiversity First',text:'Create a thriving wildlife habitat with a pollinator patch, beehive, bat box, insect hotel, and native wildflowers throughout. Add a small pond for amphibians.'},
  {label:'🐔 Backyard Farm',     text:'Family backyard farm: chicken coop for eggs, raised beds with herbs and vegetables, fruit trees, compost bin to close the nutrient loop.'},
  {label:'🌿 Soil Regeneration', text:'Rebuild degraded soil with hugelkultur beds, worm bin, compost system, cover crops, and mulch zones. Plant deep-rooted perennials on swale berms.'},
  {label:'🌳 Food Forest',       text:'Plant a food forest with 5 fruit trees including apple, pear, and lemon, berry bushes, herb spiral, and a pollinator patch to boost pollination by 25%.'},
  {label:'🏡 Suburban Starter',  text:'New to permaculture. Start simple: 2 raised beds, a compost bin, one rain tank, and a small pollinator patch to attract bees and butterflies.'},
];

function ExamplePrompts({onSelect,currentVal}:{onSelect:(v:string)=>void;currentVal:string}){
  const[active,setActive]=useState(0);
  const[visible,setVisible]=useState(true);

  useEffect(()=>{
    if(currentVal)return;
    let innerTimer:ReturnType<typeof setTimeout>|null=null;
    const id=setInterval(()=>{
      setVisible(false);
      innerTimer=setTimeout(()=>{setActive((p:number)=>(p+1)%EXAMPLE_PROMPTS.length);setVisible(true);},300);
    },4500);
    return()=>{clearInterval(id);if(innerTimer)clearTimeout(innerTimer);};
  },[currentVal]);

  // Chip click: preview only -- slides to that example without filling textarea
  const handleChip=(i:number)=>{
    setVisible(false);
    setTimeout(()=>{setActive(i);setVisible(true);},160);
  };

  return(
    <div style={{marginTop:10,display:"flex",flexDirection:"column",gap:7}}>
      <p style={{fontSize:8,color:'var(--tf)',letterSpacing:'.16em',textTransform:'uppercase',fontFamily:"'JetBrains Mono',monospace",fontWeight:700}}>Try an example — click the card to fill:</p>
      {/* Large card -- fills textarea only, never submits form */}
      <button
        type="button"
        onClick={()=>onSelect(EXAMPLE_PROMPTS[active].text)}
        style={{
          width:'100%',textAlign:'left',padding:'12px 14px',borderRadius:12,display:'block',
          background:'rgba(0,255,170,0.07)',
          border:'1px solid rgba(0,255,170,0.30)',
          opacity:visible?1:0,
          transition:'opacity 0.3s ease, transform 0.18s ease, box-shadow 0.18s ease',
          cursor:'pointer',
        }}
        onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.transform='scale(1.01)';(e.currentTarget as HTMLElement).style.boxShadow='0 0 22px rgba(0,255,170,0.16)';}}
        onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.transform='scale(1)';(e.currentTarget as HTMLElement).style.boxShadow='';}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
          <span style={{fontSize:9,fontFamily:"'JetBrains Mono',monospace",fontWeight:700,letterSpacing:'.12em',textTransform:'uppercase',color:'var(--jade2)'}}>{EXAMPLE_PROMPTS[active].label}</span>
          <span style={{fontSize:10,fontFamily:"'Inter',sans-serif",fontWeight:600,color:'var(--jade)',opacity:0.75,marginLeft:'auto'}}>↵ click to use</span>
        </div>
        <p style={{fontSize:12,fontFamily:"'Inter',sans-serif",lineHeight:1.65,color:'var(--td)',margin:0}}>{EXAMPLE_PROMPTS[active].text}</p>
      </button>
      {/* Category chips -- navigate/preview only, do NOT fill textarea */}
      <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
        {EXAMPLE_PROMPTS.map((ex,i)=>(
          <button key={i}
            onClick={e=>{e.preventDefault();e.stopPropagation();handleChip(i);}}
            style={{
              padding:'3px 9px',borderRadius:99,fontSize:11,fontWeight:600,cursor:'pointer',
              fontFamily:"'Inter',sans-serif",transition:'transform 0.14s,opacity 0.14s,border-color 0.14s,box-shadow 0.14s',
              background:i===active?'rgba(0,255,170,0.12)':'rgba(255,255,255,0.04)',
              border:`1px solid ${i===active?'rgba(0,255,170,0.35)':'rgba(255,255,255,0.08)'}`,
              color:i===active?'var(--jade)':'var(--td)',
            }}
            title="Preview this example — click the green card above to use it">
            {ex.label}
          </button>
        ))}
      </div>
      <p style={{fontSize:8,fontFamily:"'JetBrains Mono',monospace",color:'var(--ts)',letterSpacing:'.08em'}}>↑ chips preview · click the card above to fill</p>
    </div>
  );
}

/* ==== STEP INPUT ==== */
function StepInput({value,onChange,min=0,max=Infinity,step=500}:{value:number;onChange:(n:number)=>void;min?:number;max?:number;step?:number}){
  const dec=()=>onChange(Math.max(min,value-step));
  const inc=()=>onChange(Math.min(max,value+step));
  const btnStyle=(side:'left'|'right')=>({
    width:36,height:'100%',flexShrink:0,
    display:'flex',alignItems:'center',justifyContent:'center',
    background:'transparent',
    borderRight:side==='left'?'1px solid rgba(0,255,170,0.12)':undefined,
    borderLeft:side==='right'?'1px solid rgba(0,255,170,0.12)':undefined,
    cursor:'pointer',
    color:'#00ffaa',
    fontSize:18,fontWeight:300,
    transition:'transform 0.14s ease,opacity 0.14s ease,border-color 0.14s ease,box-shadow 0.14s ease',
    fontFamily:"'Inter',sans-serif",
  } as React.CSSProperties);
  return(
    <div style={{
      display:'flex',alignItems:'center',height:48,
      borderRadius:12,overflow:'hidden',
      background:'rgba(0,255,170,0.04)',
      border:'1px solid rgba(0,255,170,0.32)',
      boxShadow:'0 2px 12px rgba(0,0,0,0.20)',
    }}>
      <button type="button" onClick={dec}
        style={btnStyle('left')}
        onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background='rgba(0,255,170,0.10)';}}
        onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background='transparent';}}>
        −
      </button>
      <input type="text" inputMode="numeric" value={value||''}
        onChange={e=>{const n=Number(e.target.value);if(!isNaN(n))onChange(n);}}
        className="tf-in"
        style={{
          flex:1,height:'100%',background:'transparent',
          textAlign:'center',border:'none',outline:'none',
          color:'#00ffaa',fontSize:17,fontWeight:800,
          fontFamily:"'Space Grotesk',sans-serif",
          letterSpacing:'.02em',
          minWidth:0,padding:'0 6px',
          textShadow:'0 0 12px rgba(0,255,170,0.35)',
        }}/>
      <button type="button" onClick={inc}
        style={btnStyle('right')}
        onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background='rgba(0,255,170,0.10)';}}
        onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background='transparent';}}>
        +
      </button>
    </div>
  );
}

/* ==== LOGIN MODAL (Supabase Auth) ==== */
function LoginModal({onClose,onLoad,currentData,isPro}:{onClose:()=>void;onLoad:(d:any)=>void;currentData:any;isPro:boolean}){
  const[tab,setTab]=useState<'login'|'register'|'saves'>('login');
  const[name,setName]=useState('');
  const[email,setEmail]=useState(''); 
  const[password,setPassword]=useState('');
  const[confirmPassword,setConfirmPassword]=useState('');
  const[showPw,setShowPw]=useState(false);
  const[label,setLabel]=useState(`Blueprint ${new Date().toLocaleDateString()}`);
  const[error,setError]=useState('');
  const[loading,setLoading]=useState(false);
  const[saves,setSaves]=useState<any[]>([]);
  const[user,setUser]=useState<any>(null);
  const[forgotSent,setForgotSent]=useState(false);
  const[cancelFlow,setCancelFlow]=useState<'idle'|'confirm'|'reason'|'done'>('idle');
  const[cancelReason,setCancelReason]=useState('');
  const[cancelOther,setCancelOther]=useState('');
  const[cancelLoading,setCancelLoading]=useState(false);
  const[annualLoading,setAnnualLoading]=useState(false);

  // Load current Supabase session on mount
  // Load remembered email after mount (avoids SSR hydration mismatch)
  useEffect(()=>{
    try{const saved=localStorage.getItem('tf-last-email');if(saved)setEmail(saved);}catch{}
  },[]);

  useEffect(()=>{
    supabase.auth.getSession().then(({data:{session}})=>{
      if(session?.user){setUser(session.user);setTab('saves');loadSaves(session.user.id);}
    });
    const{data:{subscription}}=supabase.auth.onAuthStateChange((_,session)=>{
      if(session?.user){setUser(session.user);loadSaves(session.user.id);}
      else{setUser(null);setSaves([]);}
    });
    return()=>subscription.unsubscribe();
  },[]);

  async function loadSaves(userId:string){
    try{
      const{data}=await supabase.from('profiles').select('saves').eq('id',userId).single();
      setSaves(data?.saves??[]);
    }catch{setSaves([]);}
  }

  async function register(){
    if(!name.trim()||!email.trim()){setError('Name and email are required');return;}
    if(!password){setError('Please choose a password');return;}
    if(password.length<6){setError('Password must be at least 6 characters');return;}
    if(password!==confirmPassword){setError('Passwords do not match');return;}
    setLoading(true);setError('');
    const{data,error:err}=await supabase.auth.signUp({email:email.trim(),password,options:{data:{name:name.trim()}}});
    if(err){setError(err.message);setLoading(false);return;}
    if(data.user){
      try{localStorage.setItem('tf-last-email',email.trim().toLowerCase());}catch{}
      if(data.session){
        // Session available — email confirmation not required
        // Create profile row now that we have a valid session (RLS requires auth.uid())
        const{error:upsertErr}=await supabase.from('profiles').upsert({id:data.user.id,email:email.trim().toLowerCase(),name:name.trim(),saves:[],plan:'free'});
        if(upsertErr){setError('Account created but profile setup failed — '+upsertErr.message+'. Please contact support.');setLoading(false);return;}
        // Fire welcome email (non-blocking)
        try{fetch('/api/email/send',{method:'POST',headers:{'Content-Type':'application/json','Authorization':`Bearer ${data.session.access_token}`},body:JSON.stringify({type:'welcome',userId:data.user.id,email:email.trim().toLowerCase(),name:name.trim()})}).catch(()=>{});}catch{}
        setUser(data.user);setTab('saves');
      } else {
        // Email confirmation required — can't create profile yet (no session for RLS)
        // Profile will be created on first login via the login flow
        setError('');
        setTab('login');
        setTimeout(()=>setError('Account created! Please check your email to confirm your address before logging in.'),100);
      }
    }
    setLoading(false);
  }

  async function login(){
    setLoading(true);setError('');
    const{data,error:err}=await supabase.auth.signInWithPassword({email:email.trim(),password});
    if(err){
      if(err.message.toLowerCase().includes('email not confirmed')||err.message.toLowerCase().includes('not confirmed')){
        setError('Please confirm your email before logging in. Check your inbox for a confirmation link.');
      }else{setError(err.message);}
      setLoading(false);return;
    }
    if(data.user&&data.session){
      try{localStorage.setItem('tf-last-email',email.trim().toLowerCase());}catch{}
      // Ensure profile row exists (handles email-confirmation flow where register couldn't create it)
      const{data:existingProfile}=await supabase.from('profiles').select('id').eq('id',data.user.id).single();
      if(!existingProfile){
        try{await supabase.from('profiles').upsert({id:data.user.id,email:data.user.email??'',name:data.user.user_metadata?.name??'',saves:[],plan:'free'});}catch{}
      }
      setUser(data.user);setTab('saves');loadSaves(data.user.id);
    }else if(data.user&&!data.session){
      setError('Please confirm your email before logging in. Check your inbox for a link from TerraForge.');
    }
    setLoading(false);
  }

  async function forgotPassword(){
    if(!email.trim()){setError('Enter your email address first');return;}
    setLoading(true);setError('');
    const{error:err}=await supabase.auth.resetPasswordForEmail(email.trim(),{
      redirectTo:`${window.location.origin}/auth/reset`,
    });
    setLoading(false);
    if(err){setError(err.message);return;}
    setForgotSent(true);
  }

  async function cancelSubscription(){
    setCancelLoading(true);
    try{
      const reason=cancelReason==='Other'?cancelOther:cancelReason;
      const{data:{session}}=await supabase.auth.getSession();
      const token=session?.access_token;
      if(!token){setError('Session expired — please log in again.');setCancelLoading(false);return;}
      const res=await fetch('/api/cancel-subscription',{
        method:'POST',
        headers:{'Content-Type':'application/json','Authorization':`Bearer ${token}`},
        body:JSON.stringify({userId:user?.id,reason}),
      });
      if(!res.ok){const d=await res.json().catch(()=>({}));setError(d.error||'Could not cancel. Please contact support.');setCancelLoading(false);return;}
      setCancelFlow('done');
    } catch(e){
      setError('Could not cancel. Please contact support.');
    }
    setCancelLoading(false);
  }

  async function upgradeToAnnual(){
    setAnnualLoading(true);setError('');
    try{
      const{data:{session}}=await supabase.auth.getSession();
      const token=session?.access_token;
      if(!token){setError('Session expired — please log in again.');setAnnualLoading(false);return;}
      const res=await fetch('/api/checkout',{
        method:'POST',
        headers:{'Content-Type':'application/json','Authorization':`Bearer ${token}`},
        body:JSON.stringify({priceId:'price_1ThhtXBsMVXXOrRddpHo3AHs'}),
      });
      const d=await res.json().catch(()=>({}));
      if(!res.ok){setError(d.error||'Could not start upgrade. Please try again.');setAnnualLoading(false);return;}
      if(d.url){window.location.href=d.url;return;}
      setError('Could not start upgrade. Please try again.');
    }catch(e){
      setError('Could not start upgrade. Please try again.');
    }
    setAnnualLoading(false);
  }

  async function logout(){
    try{await supabase.auth.signOut();}catch{}
    try{localStorage.removeItem(STORAGE_KEY);}catch{}
    setUser(null);setSaves([]);setTab('login');setPassword('');
  }

  async function saveWork(){
    if(!user)return;
    if(!isPro&&saves.length>=1){setError('Free accounts can only have 1 saved blueprint. Upgrade to Pro for unlimited saves.');return;}
    const key=`tf-save-${user.id}-${Date.now()}`;
    const newSave={key,label:label.trim()||'Unnamed',savedAt:new Date().toISOString(),data:currentData};
    const updated=[newSave,...saves].slice(0,20);
    setLoading(true);setError('');
    const{error:saveErr}=await supabase.from('profiles').upsert({id:user.id,saves:updated});
    setLoading(false);
    if(saveErr){setError('Save failed — '+saveErr.message);return;}
    setSaves(updated);
    // Fire save_confirm email (non-blocking)
    try{supabase.auth.getSession().then(({data:{session}})=>{if(session){fetch('/api/email/send',{method:'POST',headers:{'Content-Type':'application/json','Authorization':`Bearer ${session.access_token}`},body:JSON.stringify({type:'save_confirm',userId:user.id,email:user.email??'',name:user.user_metadata?.name??user.email??'',blueprintLabel:newSave.label})}).catch(()=>{});}});}catch{}
    const t=document.createElement('div');
    t.style.cssText='position:fixed;bottom:32px;left:50%;transform:translateX(-50%);background:#f0fdf4;color:#15803d;border:1px solid rgba(22,163,74,0.25);border-radius:12px;padding:12px 24px;font-size:13px;font-weight:600;z-index:99999;pointer-events:none;';
    t.textContent='✓ Blueprint saved!';
    document.body.appendChild(t);setTimeout(()=>t.remove(),2500);
  }

  async function deleteSave(key:string){
    const updated=saves.filter((s:any)=>s.key!==key);
    const{error:delErr}=await supabase.from('profiles').upsert({id:user.id,saves:updated});
    if(delErr){setError('Delete failed — '+delErr.message);return;}
    setSaves(updated);
  }

  function loadSave(sv:any){
    try{onLoad(sv.data);onClose();}
    catch{setError('Could not load save');}
  }

  const inputStyle:React.CSSProperties={
    width:'100%',padding:'9px 12px',borderRadius:10,fontSize:13,
    background:'rgba(0,255,170,0.03)',border:'1px solid rgba(0,255,170,0.12)',
    color:'var(--tp)',fontFamily:"'Inter',sans-serif",outline:'none',
  };
  const labelStyle:React.CSSProperties={
    display:'block',fontSize:11,letterSpacing:'.05em',color:'var(--tf)',
    fontFamily:"'Inter',sans-serif",fontWeight:600,marginBottom:5,
  };

  return(
    <div className="a-fadeIn" style={{position:'fixed',inset:0,display:'flex',alignItems:'center',justifyContent:'center',zIndex:99998,padding:16,background:'rgba(0,0,0,0.64)',backdropFilter:'blur(16px)'}} onClick={onClose}>
      <div className="a-scaleIn" style={{
          width:'100%',maxWidth:440,borderRadius:22,position:'relative',overflow:'hidden',
          maxHeight:'88vh',overflowY:'auto',
          background:'rgba(6,14,10,0.81)',border:'1px solid rgba(0,255,170,0.24)',
          boxShadow:'0 0 80px rgba(0,255,170,0.10),0 40px 80px rgba(0,0,0,0.64)',
        }}
        onClick={e=>e.stopPropagation()}>
        {/* Top jade line */}
        <div style={{position:'absolute',top:0,left:0,right:0,height:2,
          background:'linear-gradient(90deg,transparent,#00ffaa 40%,#00d4ff 70%,transparent)'}}/>

        {/* Header */}
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',
          padding:'16px 20px',borderBottom:'1px solid rgba(0,255,170,0.08)'}}>
          <div>
            <p style={{fontSize:16,fontWeight:800,color:'var(--tp)',
              fontFamily:"'Space Grotesk',sans-serif",marginBottom:2}}>
              {user?`Welcome back, ${user.user_metadata?.name??user.email}`:'TerraForge Account'}
            </p>
            <p style={{fontSize:11,color:'var(--tf)',fontFamily:"'Inter',sans-serif"}}>
              {user?user.email:'Save and access your blueprints from any session'}
            </p>
          </div>
          <button onClick={onClose} style={{width:30,height:30,display:'flex',alignItems:'center',
            justifyContent:'center',borderRadius:9,background:'rgba(255,255,255,0.05)',
            border:'1px solid rgba(0,255,170,0.10)',cursor:'pointer'}}>
            <X style={{width:14,height:14,color:'var(--td)'}}/>
          </button>
        </div>

        {/* Tab switcher -- only when logged out */}
        {!user&&(
          <div style={{display:'flex',padding:'14px 20px 0',gap:7}}>
            {(['login','register'] as const).map(t=>(
              <button key={t} onClick={()=>{setTab(t);setError('');setPassword('');setConfirmPassword('');}} style={{
                flex:1,padding:'8px 12px',borderRadius:9,cursor:'pointer',
                fontFamily:"'Inter',sans-serif",fontSize:13,fontWeight:600,
                textTransform:'capitalize',transition:'transform 0.15s,opacity 0.15s,border-color 0.15s,box-shadow 0.15s',
                ...(tab===t
                  ?{background:'rgba(0,255,170,0.10)',border:'1px solid rgba(0,255,170,0.30)',color:'var(--jade)'}
                  :{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(0,255,170,0.10)',color:'var(--td)'})
              }}>{t==='login'?'Sign In':'Create Account'}</button>
            ))}
          </div>
        )}

        <div style={{padding:'16px 20px 22px',display:'flex',flexDirection:'column',gap:12}}>
          {/* Error */}
          {error&&(
            <div style={{padding:'9px 13px',borderRadius:9,fontSize:12,
              fontFamily:"'Inter',sans-serif",
              background:'rgba(239,68,68,0.10)',border:'1px solid rgba(239,68,68,0.28)',
              color:'var(--red)',display:'flex',alignItems:'center',gap:7}}>
              <span style={{fontSize:14,flexShrink:0}}>⚠</span>{error}
            </div>
          )}

          {/* -- LOGIN -- */}
          {tab==='login'&&!user&&(
            <div style={{display:'flex',flexDirection:'column',gap:12}}>
              <div>
                <label style={labelStyle}>Email</label>
                <input value={email} onChange={e=>setEmail(e.target.value)} type="email"
                  placeholder="you@example.com" className="tf-in" style={inputStyle}
                  onKeyDown={e=>e.key==='Enter'&&login()}/>
              </div>
              <div>
                <label style={labelStyle}>Password</label>
                <div style={{position:'relative'}}>
                  <input value={password} onChange={e=>setPassword(e.target.value)}
                    type={showPw?'text':'password'} placeholder="Your password"
                    className="tf-in" style={{...inputStyle,paddingRight:42}}
                    onKeyDown={e=>e.key==='Enter'&&login()}/>
                  <button type="button" onClick={()=>setShowPw((v:boolean)=>!v)} style={{
                    position:'absolute',right:10,top:'50%',transform:'translateY(-50%)',
                    background:'none',border:'none',cursor:'pointer',
                    color:'var(--ts)',fontSize:13,padding:'0 4px',
                  }}>{showPw?'🙈':'👁'}</button>
                </div>
              </div>
              <button onClick={login} disabled={loading} className="gen-btn"
                style={{width:'100%',padding:'12px',borderRadius:13,fontSize:14,
                  fontWeight:700,fontFamily:"'Inter',sans-serif",marginTop:2,
                  opacity:loading?0.6:1}}>
                {loading?'Signing in…':'Sign In'}
              </button>
              {forgotSent?(
                <div style={{padding:'10px 13px',borderRadius:9,fontSize:12,
                  fontFamily:"'Inter',sans-serif",textAlign:'center',
                  background:'rgba(0,255,170,0.06)',border:'1px solid rgba(0,255,170,0.20)',
                  color:'#00ffaa'}}>
                  ✓ Reset link sent to {email} — check your inbox
                </div>
              ):(
                <button onClick={forgotPassword} disabled={loading} style={{
                  width:'100%',padding:'7px',borderRadius:10,fontSize:12,
                  fontFamily:"'Inter',sans-serif",cursor:'pointer',
                  background:'none',border:'none',
                  color:'rgba(0,255,170,0.50)',textDecoration:'underline',
                  textUnderlineOffset:3}}>
                  Forgot your password?
                </button>
              )}
              <button onClick={()=>{setTab('register');setError('');setForgotSent(false);}} style={{
                width:'100%',padding:'9px',borderRadius:12,fontSize:13,
                fontFamily:"'Inter',sans-serif",cursor:'pointer',
                background:'rgba(255,255,255,0.03)',border:'1px solid rgba(0,255,170,0.09)',
                color:'var(--td)'}}>
                New here? Create an account →
              </button>
            </div>
          )}

          {/* -- REGISTER -- */}
          {tab==='register'&&!user&&(
            <div style={{display:'flex',flexDirection:'column',gap:12}}>
              <div>
                <label style={labelStyle}>Your Name</label>
                <input value={name} onChange={e=>setName(e.target.value)} type="text"
                  placeholder="Jane Smith" className="tf-in" style={inputStyle}/>
              </div>
              <div>
                <label style={labelStyle}>Email</label>
                <input value={email} onChange={e=>setEmail(e.target.value)} type="email"
                  placeholder="you@example.com" className="tf-in" style={inputStyle}/>
              </div>
              <div>
                <label style={labelStyle}>Password <span style={{fontSize:10,color:'var(--ts)',fontWeight:400}}>(min 6 characters)</span></label>
                <div style={{position:'relative'}}>
                  <input value={password} onChange={e=>setPassword(e.target.value)}
                    type={showPw?'text':'password'} placeholder="Choose a password"
                    className="tf-in" style={{...inputStyle,paddingRight:42}}/>
                  <button type="button" onClick={()=>setShowPw((v:boolean)=>!v)} style={{
                    position:'absolute',right:10,top:'50%',transform:'translateY(-50%)',
                    background:'none',border:'none',cursor:'pointer',
                    color:'var(--ts)',fontSize:13,padding:'0 4px',
                  }}>{showPw?'🙈':'👁'}</button>
                </div>
                {password.length>0&&(()=>{
                  const strength=password.length>=10&&/[A-Z]/.test(password)&&/[0-9]/.test(password)?3:password.length>=8?2:password.length>=6?1:0;
                  const colors=['#ef4444','#f59e0b','#00ffaa','#00d4ff'];
                  const labels=['Too short','Weak','Good','Strong'];
                  return(
                    <div style={{marginTop:7}}>
                      <div style={{display:'flex',gap:3,marginBottom:4}}>
                        {[0,1,2,3].map(i=>(
                          <div key={i} style={{flex:1,height:3,borderRadius:99,
                            background:i<=strength-1?colors[strength-1]:'rgba(255,255,255,0.08)',
                            transition:'background 0.2s'}}/>
                        ))}
                      </div>
                      <span style={{fontSize:10,color:colors[strength-1]||'var(--ts)',
                        fontFamily:"'Inter',sans-serif"}}>{labels[strength]||'Too short'}</span>
                    </div>
                  );
                })()}
              </div>
              <div>
                <label style={labelStyle}>Confirm Password</label>
                <input value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)}
                  type={showPw?'text':'password'} placeholder="Repeat your password"
                  className="tf-in"
                  style={{...inputStyle,
                    borderColor:confirmPassword&&confirmPassword!==password?'rgba(239,68,68,0.45)':
                      confirmPassword&&confirmPassword===password?'rgba(0,255,170,0.40)':undefined}}
                  onKeyDown={e=>e.key==='Enter'&&register()}/>
              </div>
              <button onClick={register} disabled={loading} className="gen-btn"
                style={{width:'100%',padding:'12px',borderRadius:13,fontSize:14,
                  fontWeight:700,fontFamily:"'Inter',sans-serif",marginTop:2,
                  opacity:loading?0.6:1}}>
                {loading?'Creating account…':'Create Account'}
              </button>
            </div>
          )}

          {/* -- LOGGED IN -- saves panel -- */}
          {user&&(
            <div style={{display:'flex',flexDirection:'column',gap:16}}>
              {/* Save current work */}
              <div style={{borderRadius:14,padding:16,
                background:'rgba(0,255,170,0.04)',border:'1px solid rgba(0,255,170,0.10)'}}>
                <p style={{fontSize:11,fontWeight:700,color:'var(--jade2)',
                  fontFamily:"'Space Grotesk',sans-serif",letterSpacing:'.06em',
                  textTransform:'uppercase',marginBottom:10}}>Save Current Blueprint</p>
                <input value={label} onChange={e=>setLabel(e.target.value)}
                  className="tf-in" style={{...inputStyle,marginBottom:10}}
                  placeholder="Blueprint name…"/>
                <button onClick={saveWork} className="gen-btn"
                  style={{width:'100%',padding:'10px',borderRadius:11,fontSize:13,
                    fontWeight:600,fontFamily:"'Inter',sans-serif"}}>
                  💾 Save to Profile
                </button>
              </div>

              {/* Saved blueprints list */}
              {saves.length>0&&(
                <div>
                  <p style={{fontSize:11,fontWeight:700,color:'var(--jade2)',
                    fontFamily:"'Space Grotesk',sans-serif",letterSpacing:'.06em',
                    textTransform:'uppercase',marginBottom:10}}>
                    Saved Blueprints ({saves.length})
                  </p>
                  <div style={{display:'flex',flexDirection:'column',gap:7}}>
                    {saves.map((sv:any)=>(
                      <div key={sv.key} style={{display:'flex',alignItems:'center',gap:10,
                        borderRadius:11,padding:'10px 13px',
                        background:'rgba(0,255,170,0.03)',border:'1px solid rgba(0,255,170,0.09)'}}>
                        <div style={{flex:1,minWidth:0}}>
                          <p style={{fontSize:13,fontWeight:600,color:'var(--tp)',
                            fontFamily:"'Inter',sans-serif",
                            overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
                            {sv.label}
                          </p>
                          <p style={{fontSize:10,color:'var(--ts)',
                            fontFamily:"'Inter',sans-serif",marginTop:1}}>
                            {new Date(sv.savedAt).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}
                          </p>
                        </div>
                        <button onClick={()=>loadSave(sv)} style={{
                          padding:'5px 12px',borderRadius:8,fontSize:11,
                          fontFamily:"'Inter',sans-serif",fontWeight:600,cursor:'pointer',
                          background:'rgba(0,255,170,0.08)',border:'1px solid rgba(0,255,170,0.22)',
                          color:'var(--jade)',whiteSpace:'nowrap'}}>
                          Load
                        </button>
                        <button onClick={()=>deleteSave(sv.key)} style={{
                          width:28,height:28,display:'flex',alignItems:'center',
                          justifyContent:'center',borderRadius:8,cursor:'pointer',flexShrink:0,
                          background:'rgba(239,68,68,0.08)',border:'1px solid rgba(239,68,68,0.20)',
                          color:'var(--red)'}}>
                          <Trash2 style={{width:12,height:12}}/>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {saves.length===0&&(
                <p style={{fontSize:13,textAlign:'center',padding:'14px 0',
                  fontFamily:"'Inter',sans-serif",color:'var(--tf)'}}>
                  No blueprints saved yet. Save your current work above.
                </p>
              )}

              {/* Manage Subscription */}
              {isPro&&cancelFlow==='idle'&&(
                <button onClick={upgradeToAnnual} disabled={annualLoading} style={{
                  width:'100%',padding:'11px',borderRadius:11,fontSize:13,marginBottom:8,
                  fontFamily:"'Space Grotesk',sans-serif",fontWeight:800,
                  cursor:annualLoading?'wait':'pointer',position:'relative',
                  background:annualLoading?'rgba(0,232,122,0.15)':'linear-gradient(135deg,#00e87a,#00c45a)',
                  border:'none',color:annualLoading?'rgba(5,26,14,0.5)':'#051a0e',
                  letterSpacing:'.03em',
                  boxShadow:annualLoading?'none':'0 4px 18px rgba(0,232,122,0.22)'}}>
                  {annualLoading?'Redirecting to Stripe…':'Switch to Annual — Save 27%'}
                  {!annualLoading&&(
                    <span style={{position:'absolute',top:-8,right:-6,background:'#ffb020',color:'#1a0a00',
                      fontSize:8,fontWeight:800,padding:'2px 7px',borderRadius:99,letterSpacing:'.03em',
                      textTransform:'uppercase'}}>$79/yr</span>
                  )}
                </button>
              )}

              {isPro&&cancelFlow==='idle'&&(
                <button onClick={()=>setCancelFlow('confirm')} style={{
                  width:'100%',padding:'8px',borderRadius:10,fontSize:12,
                  fontFamily:"'Inter',sans-serif",cursor:'pointer',
                  background:'none',border:'none',
                  color:'rgba(200,230,220,0.30)',textDecoration:'underline',
                  textUnderlineOffset:3}}>
                  Manage subscription
                </button>
              )}

              {/* Step 1: Confirm cancel */}
              {isPro&&cancelFlow==='confirm'&&(
                <div style={{borderRadius:12,padding:14,
                  background:'rgba(239,68,68,0.05)',border:'1px solid rgba(239,68,68,0.15)'}}>
                  <p style={{fontSize:13,fontWeight:700,color:'rgba(220,255,240,0.80)',
                    fontFamily:"'Space Grotesk',sans-serif",marginBottom:6}}>
                    Cancel your subscription?
                  </p>
                  <p style={{fontSize:11,color:'rgba(200,230,220,0.45)',
                    fontFamily:"'Inter',sans-serif",marginBottom:12,lineHeight:1.5}}>
                    You'll keep Pro access until the end of your current billing period.
                  </p>
                  <div style={{display:'flex',gap:8}}>
                    <button onClick={()=>setCancelFlow('reason')} style={{
                      flex:1,padding:'8px',borderRadius:9,fontSize:12,cursor:'pointer',
                      fontFamily:"'Inter',sans-serif",fontWeight:600,
                      background:'rgba(239,68,68,0.12)',border:'1px solid rgba(239,68,68,0.30)',
                      color:'#f87171'}}>
                      Yes, cancel
                    </button>
                    <button onClick={()=>setCancelFlow('idle')} style={{
                      flex:1,padding:'8px',borderRadius:9,fontSize:12,cursor:'pointer',
                      fontFamily:"'Inter',sans-serif",
                      background:'rgba(0,255,170,0.06)',border:'1px solid rgba(0,255,170,0.18)',
                      color:'var(--jade)'}}>
                      Keep Pro
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Reason */}
              {isPro&&cancelFlow==='reason'&&(
                <div style={{borderRadius:12,padding:14,
                  background:'rgba(239,68,68,0.05)',border:'1px solid rgba(239,68,68,0.15)'}}>
                  <p style={{fontSize:12,fontWeight:700,color:'rgba(220,255,240,0.70)',
                    fontFamily:"'Space Grotesk',sans-serif",marginBottom:10}}>
                    Help us improve — why are you cancelling?
                  </p>
                  {['Too expensive','Not using it enough','Missing features I need',
                    'Found a better tool','Just exploring','Other'].map(reason=>(
                    <button key={reason} onClick={()=>setCancelReason(reason)} style={{
                      display:'block',width:'100%',textAlign:'left',
                      padding:'7px 10px',borderRadius:8,marginBottom:6,fontSize:12,
                      fontFamily:"'Inter',sans-serif",cursor:'pointer',
                      background:cancelReason===reason?'rgba(0,255,170,0.10)':'rgba(255,255,255,0.02)',
                      border:cancelReason===reason?'1px solid rgba(0,255,170,0.35)':'1px solid rgba(255,255,255,0.06)',
                      color:cancelReason===reason?'var(--jade)':'rgba(200,230,220,0.55)'}}>
                      {cancelReason===reason?'● ':' '} {reason}
                    </button>
                  ))}
                  {cancelReason==='Other'&&(
                    <textarea value={cancelOther} onChange={e=>setCancelOther(e.target.value)}
                      placeholder="Tell us more…"
                      style={{width:'100%',padding:'8px 10px',borderRadius:8,fontSize:12,
                        fontFamily:"'Inter',sans-serif",resize:'vertical',minHeight:64,
                        background:'rgba(0,255,170,0.03)',border:'1px solid rgba(0,255,170,0.15)',
                        color:'var(--tp)',outline:'none',marginBottom:8,boxSizing:'border-box'}}/>
                  )}
                  <div style={{display:'flex',gap:8,marginTop:4}}>
                    <button onClick={cancelSubscription}
                      disabled={!cancelReason||cancelLoading} style={{
                      flex:1,padding:'8px',borderRadius:9,fontSize:12,cursor:'pointer',
                      fontFamily:"'Inter',sans-serif",fontWeight:600,
                      background:cancelReason?'rgba(239,68,68,0.12)':'rgba(255,255,255,0.04)',
                      border:'1px solid rgba(239,68,68,0.25)',
                      color:cancelReason?'#f87171':'rgba(200,230,220,0.25)',
                      opacity:cancelLoading?0.6:1}}>
                      {cancelLoading?'Cancelling…':'Confirm Cancel'}
                    </button>
                    <button onClick={()=>{setCancelFlow('idle');setCancelReason('');setCancelOther('');}} style={{
                      flex:1,padding:'8px',borderRadius:9,fontSize:12,cursor:'pointer',
                      fontFamily:"'Inter',sans-serif",
                      background:'rgba(0,255,170,0.06)',border:'1px solid rgba(0,255,170,0.18)',
                      color:'var(--jade)'}}>
                      Go back
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Done */}
              {cancelFlow==='done'&&(
                <div style={{padding:'12px',borderRadius:12,textAlign:'center',
                  background:'rgba(0,255,170,0.04)',border:'1px solid rgba(0,255,170,0.15)'}}>
                  <p style={{fontSize:13,color:'#00ffaa',fontWeight:700,marginBottom:4}}>
                    Subscription cancelled
                  </p>
                  <p style={{fontSize:11,color:'rgba(200,230,220,0.45)',
                    fontFamily:"'Inter',sans-serif",lineHeight:1.5}}>
                    You'll have Pro access until your billing period ends. Thanks for trying TerraForge.
                  </p>
                </div>
              )}

              <button onClick={logout} style={{
                width:'100%',padding:'9px',borderRadius:12,fontSize:13,
                fontFamily:"'Inter',sans-serif",fontWeight:600,cursor:'pointer',
                background:'rgba(239,68,68,0.06)',border:'1px solid rgba(239,68,68,0.20)',
                color:'var(--red)'}}>
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


/* ==== DEPLOY PLAN ==== */
function getDeployPlan(calc:CalcResult,fv:Partial<any>,blueprints:Blueprint[],zone:string):{
  phase:string;label:string;weeks:string;color:string;icon:string;
  steps:{title:string;detail:string;cost?:string}[];
}[]{
  const budget=Math.max(500, Number(fv.budget)||2800);
  const sqft=Math.max(500, Number(fv.yardSqFt)||10000);
  const allTiles=blueprints.flatMap((b:Blueprint)=>b.tiles);
  const emojis=allTiles.map((t:{id:number;icon:string})=>t.icon);
  const hasWater=emojis.some(e=>['💧','🌊','🪣','🚿','🐟','🌧️'].includes(e));
  const hasEnergy=emojis.some(e=>['☀️','🌬️','🔋','⚡'].includes(e));
  const hasFood=emojis.some(e=>ICON_LOOKUP.get(e)?.category==='food');
  const hasSoil=emojis.some(e=>['♻️','🪱','🌾','🍂','🪟','🌲'].includes(e));
  const hasBio=emojis.some(e=>['🐝','🌼','🦇','🐛','🐦','🌺','🪷','🌴'].includes(e));
  const hasAnimals=emojis.some(e=>['🐔','🦆','🐐','🐖','🐇'].includes(e));
  const phases=[];

  // Phase 1 -- Site Assessment & Planning (always first)
  phases.push({
    phase:'1',label:'Site Assessment',weeks:'Week 1–2',color:'#a78bfa',icon:'🗺️',
    steps:[
      {title:'Walk your boundary',detail:'Mark property corners, note existing trees, slopes, water flow paths, and sun exposure morning to afternoon.',cost:'Free'},
      {title:'Soil test',detail:'Take 5–6 samples from different areas, mix them, and send to your local extension service for pH, NPK, and organic matter analysis.',cost:'$15–$40'},
      {title:'Sun mapping',detail:`For ${Math.round(sqft).toLocaleString()} sq ft, sketch a rough grid and note which zones get full sun (6+ hrs), part sun (3–6 hrs), and shade.`,cost:'Free'},
      {title:'Water flow observation',detail:'During or after rain, trace where water moves, pools, or drains. Mark these — they determine swale and pond placement.',cost:'Free'},
      {title:'Print your blueprint maps',detail:'Export your TerraForge maps and use them as a planning overlay on your property sketch.',cost:'Free'},
    ],
  });

  // Phase 2 -- Earthworks & Water (only if user has water features)
  if(hasWater){
    phases.push({
      phase:'2',label:'Water Systems',weeks:'Week 2–4',color:'#00d4ff',icon:'💧',
      steps:[
        ...(emojis.includes('🌊')?[{title:'Dig swales on contour',detail:'Follow elevation lines exactly. A 10 ft swale on a gentle slope captures 300–500 gal per inch of rain. Hire an excavator for anything over 50 linear feet.',cost:'$200–$800'}]:[]),
        ...(emojis.includes('💧')||emojis.includes('🪣')?[{title:'Install rain catchment',detail:`Size your tanks: 1 inch of rain on ${Math.round(sqft*0.3).toLocaleString()} sq ft of roof = ${Math.round(sqft*0.3*0.623/100)*100} gal. Connect downspouts first, overflow last.`,cost:'$250–$600'}]:[]),
        ...(emojis.includes('🌧️')?[{title:'Build rain garden',detail:'Excavate a shallow bowl 6–12 in deep at a natural low point. Amend with 40% compost, 40% sand, 20% topsoil. Plant with moisture-tolerant natives. Captures roof and surface runoff before it leaves the property.',cost:'$150–$400'}]:[]),
        ...(emojis.includes('🚿')?[{title:'Lay drip irrigation',detail:'Install main header line first, then branch lines to beds. Use pressure regulators at each zone. Timer optional but highly recommended.',cost:'$80–$300'}]:[]),
        ...(emojis.includes('🐟')?[{title:'Excavate pond',detail:'Minimum depth 18 in to prevent summer stagnation. Line with bentonite clay or EPDM rubber. Fill slowly to avoid disturbing clay.',cost:'$300–$1,200'}]:[]),
      ],
    });
  }

  // Phase 3 -- Soil Building
  if(hasSoil||hasFood){
    phases.push({
      phase:'3',label:'Soil Building',weeks:'Week 3–6',color:'#c8a060',icon:'🌱',
      steps:[
        {title:'Smother existing grass',detail:'Lay cardboard (remove tape/staples) overlapping 6 inches, wet thoroughly, then cover with 4–6 inches of compost or wood chips. No digging needed.',cost:'Free–$120'},
        {title:'Mulch all pathways',detail:'3–4 inches of wood chip mulch on paths reduces mud, retains moisture, and breaks down into soil over 2 years. Source from local arborists — often free.',cost:'Free–$80'},
        ...(emojis.includes('🌲')?[{title:'Build hugelkultur mound',detail:'Bury logs, branches, and wood scraps in a mound 2–4 ft high. Cover with compost, then soil. The wood acts as a sponge — retaining moisture for 3–5 years and releasing nutrients as it decomposes.',cost:'$50–$200'}]:[]),
        ...(emojis.includes('🪟')?[{title:'Install cold frame',detail:'Site on a south-facing slope. Set glass or polycarbonate lid at a 10–15° angle. Ventilate on warm days to prevent overheating. Extends season by 4–6 weeks each end.',cost:'$40–$120'}]:[]),
        ...(emojis.includes('♻️')?[{title:'Set up compost system',detail:'Three-bay system is ideal: one filling, one cooking, one finished. Aim for 25:1 carbon-to-nitrogen ratio. Turn every 2 weeks.',cost:'$40–$100'}]:[]),
        ...(emojis.includes('🪱')?[{title:'Start worm bins',detail:'1,000 worms per pound of weekly food scraps. Keep at 55–75°F. Harvest castings every 3–4 months. One of the highest-ROI soil amendments.',cost:'$50–$150'}]:[]),
        ...(emojis.includes('🌾')?[{title:'Sow cover crops',detail:`Seed clover, vetch, or buckwheat across bare areas now. They fix nitrogen (up to 200 lbs/acre/yr) and suppress weeds while beds establish.`,cost:'$10–$35'}]:[]),
        ...(hasFood?[{title:'Build raised bed frames',detail:`Your plan calls for growing beds. Use untreated cedar or doug fir 2×12 boards. ${Math.round(sqft*0.02)} sq ft of bed space needs roughly ${Math.max(1,Math.round(sqft*0.02/32))} 4×8 frames.`,cost:`$${Math.round(sqft*0.02*2)}–$${Math.round(sqft*0.02*5)}`}]:[]),
      ],
    });
  }

  // Phase 4 -- Planting
  if(hasFood){
    const seasonStart=zone==='Cold'?'late spring':zone==='Arid'?'early spring or autumn':zone==='Subtropical'?'autumn (dry season)':'early spring';
    phases.push({
      phase:'4',label:'Planting',weeks:'Week 4–8',color:'#00ffaa',icon:'🌿',
      steps:[
        ...(emojis.includes('🌳')||emojis.includes('🍎')||emojis.includes('🍋')||emojis.includes('🥭')||emojis.includes('🥑')||emojis.includes('🍌')||emojis.includes('🍐')||emojis.includes('🍑')||emojis.includes('🍄')||emojis.includes('🫚')?[{title:'Plant fruit trees first',detail:`Trees take longest to establish — plant bare-root stock in ${seasonStart} before leafing. Space standard trees 15–20 ft, dwarfs 8–10 ft. Mulch ring 3 ft diameter.`,cost:'$25–$80 per tree'}]:[]),
        ...(emojis.includes('🍓')||emojis.includes('🫐')||emojis.includes('🍇')||emojis.includes('🍁')?[{title:'Install berry bushes & vines',detail:'Plant 2 ft deep, amend with compost, water weekly first season. Blueberries need pH 4.5–5.5 — add sulfur if needed.',cost:'$12–$45 per plant'}]:[]),
        {title:'Start seedlings indoors',detail:`Begin 6–8 weeks before last frost. Prioritise: tomatoes, peppers, brassicas, herbs. Use quality potting mix — garden soil compacts and stunts roots in trays.`,cost:'$20–$60'},
        {title:'Direct sow in beds',detail:'Sow carrots, radishes, beans, peas, and greens directly into prepared beds. Follow spacing on packets — crowded plants underperform dramatically.',cost:'$15–$40'},
        {title:'Label everything',detail:'Use weatherproof labels with plant name and date sown. This becomes invaluable for tracking yields and planning next season.',cost:'$5–$15'},
      ],
    });
  }

  // Phase 5 -- Energy (if applicable)
  if(hasEnergy){
    phases.push({
      phase:'5',label:'Energy Systems',weeks:'Week 6–12',color:'#ffb830',icon:'⚡',
      steps:[
        ...(emojis.includes('☀️')?[{title:'Solar panel installation',detail:`Get 3 quotes minimum. For a $${budget.toLocaleString()} budget, expect ${Math.max(1,Math.round(budget/2500))}–${Math.max(2,Math.round(budget/1500))} panels realistically installed. Ensure panels face south (northern hemisphere) and are unshaded noon–3pm.`,cost:'$800–$3,000+'}]:[]),
        ...(emojis.includes('🌬️')?[{title:'Wind turbine siting',detail:'Turbines need 10 mph average wind and clear exposure — minimum 30 ft above any obstruction within 300 ft. Check local zoning before purchasing.',cost:'$500–$2,000'}]:[]),
        ...(emojis.includes('🔋')?[{title:'Battery storage',detail:'Size battery bank to cover 2 days of critical loads. LiFePO4 batteries outperform lead-acid for cycle life (3,000+ vs 300–500 cycles).',cost:'$600–$1,800'}]:[]),
        {title:'Audit current consumption',detail:'Log meter readings for 2 weeks. Identify high-draw appliances (water heater, dryer, HVAC) — efficiency gains here increase effective solar/wind capacity.',cost:'Free'},
      ],
    });
  }

  // Phase 6 -- Biodiversity & Animals
  if(hasBio||hasAnimals){
    phases.push({
      phase:'6',label:'Habitat & Animals',weeks:'Week 8–14',color:'#4ade80',icon:'🦋',
      steps:[
        ...(emojis.includes('🐝')?[{title:'Install beehive',detail:'Place hive facing south-east, 3 ft off ground, sheltered from north wind. Source a nucleus colony in spring. Take a 1-day beginner course first.',cost:'$200–$600'}]:[]),
        ...(emojis.includes('🐔')?[{title:'Set up chicken coop',detail:`For your blueprint: 4 sq ft per bird inside, 10 sq ft outside. Automatic door, predator-proof hardware cloth (not chicken wire). Start with 3–6 hens for a family of ${Math.max(1,Number(fv.familySize)||4)}.`,cost:'$300–$800'}]:[]),
        ...(emojis.includes('🌼')||emojis.includes('🌺')?[{title:'Plant pollinator corridor',detail:'Connect flowering plants from one end of property to the other. Aim for something in bloom every month. Native species outperform exotics 35:1 for biodiversity.',cost:'$40–$120'}]:[]),
        ...(emojis.includes('🦆')?[{title:'Set up duck house',detail:'Ducks need 4 sq ft each inside, no roost bars — they sleep on the ground. Secure pond/water access with predator fencing. Muscovy and Khaki Campbell are dual-purpose breeds.',cost:'$250–$700'}]:[]),
        ...(emojis.includes('🐐')?[{title:'Build goat pen',detail:'Minimum 200 sq ft per goat with 5 ft high fencing — goats climb and jump. Separate bucks from does except for breeding. Provide mineral lick and dry shelter at all times.',cost:'$500–$1,500'}]:[]),
        ...(emojis.includes('🐖')?[{title:'Set up pig run',detail:'Pigs need 50+ sq ft each in a defined paddock. Electric fencing is most effective — one strand at snout height. Rotate paddocks to prevent ground destruction.',cost:'$400–$1,200'}]:[]),
        ...(emojis.includes('🐇')?[{title:'Install rabbit hutch',detail:'Minimum 3 sq ft per rabbit indoor, 8 sq ft outdoor run. Elevate hutch for airflow and predator protection. New Zealand Whites and Californians are the most productive meat breeds.',cost:'$150–$400'}]:[]),
        ...(emojis.includes('🦇')?[{title:'Mount bat boxes',detail:'2–3 boxes on south-facing wall or pole, 12–15 ft high. One bat eats 1,000 mosquitoes per hour. Leave 3 weeks before expecting occupancy.',cost:'$20–$60'}]:[]),
        {title:'Install insect hotel',detail:'Fill with hollow bamboo sections, pine cones, bark, and straw. Place in a sunny, rain-sheltered spot. Supports 50+ beneficial species.',cost:'$15–$50'},
      ],
    });
  }

  // Phase 7 -- Monitoring & Harvest
  phases.push({
    phase:String(phases.length+1),label:'Monitor & Harvest',weeks:'Ongoing',color:'#a0ff60',icon:'📊',
    steps:[
      {title:'Track weekly yields',detail:'Weigh harvests by crop and log them. After one season you will know exactly which plants give the best return per square foot in your specific conditions.',cost:'Free'},
      {title:'Monitor water levels',detail:'Check tank levels after each rain event. Note overflow frequency — if it overflows >3× per month, add capacity or a second swale.',cost:'Free'},
      {title:'Photograph monthly',detail:'Same spots, same day of month. A year of photos reveals what is thriving, what failed, and where to adjust next season.',cost:'Free'},
      {title:`Review your TerraForge score`,detail:`Your current Regen Score is ${calc.resilienceScore}/98. After Year 1, regenerate your blueprint and compare — most established systems gain 15–25 points.`,cost:'Free'},
      {title:'Plan next season',detail:'Use your yield logs to expand what worked. Add one new perennial layer each year — the system compounds in productivity over time.',cost:'Varies'},
    ],
  });

  // Renumber phases sequentially so there are no gaps (1,2,3... not 1,3,5...)
  return phases.map((p,i)=>({...p,phase:String(i+1)}));
}

/* ==== DEPLOY PHASES COMPONENT ==== */
type DeployPhase=ReturnType<typeof getDeployPlan>[number];

function DeployPhaseCard({phase,isMobile=false}:{phase:DeployPhase;isMobile?:boolean}){
  // Pre-compute all color variants -- avoids template literals inside JSX style props
  const c=phase.color;
  const cBorder   =c+'20';
  const cBg       =c+'08';
  const cBgHeader =c+'14';
  const cNumBg    =c+'18';
  const cNumBorder=c+'35';
  const cPillBg   =c+'15';
  const cPillBord =c+'30';
  const cStepBg   =c+'12';
  const cStepBord =c+'25';
  return(
    <div style={{
      borderRadius:18,overflow:'hidden',
      background:'rgba(9,20,14,0.74)',
      border:'1px solid '+cBorder,
      backdropFilter:'blur(16px)',
    }}>
      {/* Phase header */}
      <div style={{
        display:'flex',alignItems:'center',gap:14,
        padding:isMobile?'12px 14px':'16px 22px',
        background:cBg,
        borderBottom:'1px solid '+cBgHeader,
      }}>
        <div style={{
          width:42,height:42,borderRadius:13,flexShrink:0,
          background:cNumBg,border:'1.5px solid '+cNumBorder,
          display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',
        }}>
          <span style={{fontSize:8,color:c,fontFamily:"'JetBrains Mono',monospace",
            fontWeight:700,letterSpacing:'.08em',lineHeight:1}}>PHASE</span>
          <span style={{fontSize:16,fontWeight:900,color:c,
            fontFamily:"'Space Grotesk',sans-serif",lineHeight:1.1}}>{phase.phase}</span>
        </div>
        <div style={{flex:1}}>
          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:4}}>
            <span style={{fontSize:18,lineHeight:1}}>{phase.icon}</span>
            <span style={{fontSize:isMobile?13:16,fontWeight:800,color:'var(--tp)',
              fontFamily:"'Space Grotesk',sans-serif",letterSpacing:'.02em'}}>{phase.label}</span>
          </div>
          <span style={{
            display:'inline-block',padding:'2px 10px',borderRadius:99,
            fontSize:10,fontWeight:700,letterSpacing:'.06em',
            fontFamily:"'JetBrains Mono',monospace",
            background:cPillBg,border:'1px solid '+cPillBord,
            color:c,
          }}>{phase.weeks}</span>
        </div>
        <div style={{padding:'6px 14px',borderRadius:99,
          background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.07)'}}>
          <span style={{fontSize:12,color:'var(--tf)',
            fontFamily:"'Inter',sans-serif",fontWeight:500}}>
            {phase.steps.length} step{phase.steps.length!==1?'s':''}
          </span>
        </div>
      </div>
      {/* Steps */}
      <div style={{padding:'4px 0 8px'}}>
        {phase.steps.map((step,si)=>(
          <div key={si} style={{
            display:'flex',gap:isMobile?10:14,padding:isMobile?'10px 14px':'14px 22px',
            borderBottom:si<phase.steps.length-1?'1px solid rgba(255,255,255,0.04)':'none',
          }}>
            <div style={{
              width:26,height:26,borderRadius:8,flexShrink:0,marginTop:1,
              display:'flex',alignItems:'center',justifyContent:'center',
              background:cStepBg,border:'1px solid '+cStepBord,
              fontSize:11,fontWeight:800,color:c,
              fontFamily:"'JetBrains Mono',monospace",
            }}>{si+1}</div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{display:'flex',alignItems:'baseline',gap:10,marginBottom:5,flexWrap:'wrap'}}>
                <span style={{fontSize:isMobile?12:14,fontWeight:700,color:'var(--tp)',
                  fontFamily:"'Inter',sans-serif"}}>{step.title}</span>
                {step.cost&&(
                  <span style={{
                    fontSize:10,fontWeight:700,padding:'1px 8px',borderRadius:99,
                    background:'rgba(255,184,48,0.10)',border:'1px solid rgba(255,184,48,0.22)',
                    color:'#ffb830',fontFamily:"'JetBrains Mono',monospace",whiteSpace:'nowrap',
                  }}>{step.cost}</span>
                )}
              </div>
              <p style={{fontSize:isMobile?12:14,lineHeight:1.65,color:'var(--tf)',
                fontFamily:"'Inter',sans-serif",margin:0}}>{step.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DeployPhases({plan,score}:{plan:DeployPhase[];score:number}){
  return(
    <div style={{display:'flex',flexDirection:'column',gap:12}}>
      {plan.map((phase)=>(
        <DeployPhaseCard key={phase.phase+'-'+phase.label} phase={phase} isMobile={typeof window!=='undefined'&&window.innerWidth<=768}/>
      ))}
      {/* Closing callout */}
      <div style={{padding:'18px 22px',borderRadius:16,
        background:'rgba(0,255,170,0.04)',border:'1px solid rgba(0,255,170,0.12)',
        display:'flex',alignItems:'flex-start',gap:14}}>
        <div style={{fontSize:22,flexShrink:0,marginTop:2}}>💡</div>
        <div>
          <div style={{fontSize:13,fontWeight:700,color:'var(--jade)',
            fontFamily:"'Space Grotesk',sans-serif",marginBottom:5}}>Start small, build momentum</div>
          <p style={{fontSize:13,lineHeight:1.65,color:'var(--tf)',
            fontFamily:"'Inter',sans-serif",margin:0}}>
            {"You don't need to complete all phases at once. Most successful homesteaders implement one phase per season over 2–3 years. Your Regen Score of "}
            <strong style={{color:'#00ffaa'}}>{score}/98</strong>
            {" will compound significantly as perennials establish in years 2–5. Return to TerraForge after each phase to update your maps and recalculate."}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ==== TABS ==== */
const TABS=[
  {id:'dashboard',  label:'Dashboard',  Icon:Sprout,    desc:'Home base'},
  {id:'overview',   label:'Overview',   Icon:BarChart3, desc:'Metrics & scores'},
  {id:'maps',       label:'Maps',       Icon:MapIcon,   desc:'3D property & garden'},
  {id:'property',   label:'Property',   Icon:Home,      desc:'Satellite view & analysis'},
  {id:'blueprints', label:'Blueprints', Icon:Layers,    desc:'All saved layouts'},
  {id:'calendar',   label:'Calendar',   Icon:Calendar,  desc:'Seasonal planting'},
  {id:'roi',        label:'ROI',        Icon:TrendingUp,desc:'Financial return'},
  {id:'deploy',     label:'Deploy',     Icon:Zap,       desc:'Step-by-step plan'},
] as const;
type TabId=typeof TABS[number]['id'];

/* -- DASHBOARD DRILL MODAL ---------------------------------
   Compact centered popup — never full-page.
   ---------------------------------------------------------- */
function DashDrill({info,onClose}:{
  info:{title:string;color:string;rows:{l:string;v:string;c:string}[];note?:string};
  onClose:()=>void;
}){
  useEffect(()=>{
    const h=(e:KeyboardEvent)=>{if(e.key==='Escape')onClose();};
    window.addEventListener('keydown',h);
    return()=>window.removeEventListener('keydown',h);
  },[onClose]);
  return createPortal(
    <div
      style={{position:'fixed',inset:0,zIndex:9100,
        display:'flex',alignItems:'center',justifyContent:'center',padding:24}}
      onClick={onClose}>
      {/* Backdrop — subtle, not full-black */}
      <div style={{position:'absolute',inset:0,background:'rgba(8,22,14,0.70)',
        backdropFilter:'blur(10px)'}}/>
      {/* Modal box — max 440px wide, compact */}
      <div
        style={{
          position:'relative',zIndex:1,
          width:'100%',maxWidth:440,
          borderRadius:20,overflow:'hidden',
          background:'linear-gradient(135deg,rgba(0,255,170,0.06) 0%,rgba(12,32,20,0.88) 100%)',
          border:`1px solid ${info.color}28`,
          backdropFilter:'blur(24px)',
          boxShadow:`0 0 60px ${info.color}10,0 24px 64px rgba(0,0,0,0.28)`,
          animation:'scaleIn 0.22s cubic-bezier(0.22,1,0.36,1) both',
        }}
        onClick={e=>e.stopPropagation()}>
        {/* Top edge */}
        <div style={{position:'absolute',top:0,left:0,right:0,height:1,
          background:`linear-gradient(90deg,transparent,${info.color}60,transparent)`}}/>
        {/* Header */}
        <div style={{padding:'16px 20px 14px',borderBottom:`1px solid ${info.color}10`,
          display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <div style={{display:'flex',alignItems:'center',gap:9}}>
            <div style={{width:3,height:16,borderRadius:2,flexShrink:0,
              background:`linear-gradient(180deg,${info.color},${info.color}66)`,
              boxShadow:`0 0 10px ${info.color}80`}}/>
            <h3 style={{fontSize:15,fontWeight:700,color:'var(--tp)',margin:0,
              fontFamily:"'Space Grotesk',sans-serif"}}>{info.title}</h3>
          </div>
          <button onClick={onClose}
            style={{width:26,height:26,borderRadius:'50%',border:'none',cursor:'pointer',
              background:'rgba(255,255,255,0.06)',color:'var(--tf)',
              display:'flex',alignItems:'center',justifyContent:'center',
              transition:'background 0.15s',outline:'none'}}
            onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background='rgba(255,255,255,0.12)'}}
            onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background='rgba(255,255,255,0.06)'}}>
            <X style={{width:12,height:12}}/>
          </button>
        </div>
        {/* Rows */}
        <div style={{padding:'12px 20px'}}>
          {info.rows.map(({l,v,c},i)=>(
            <div key={i} style={{display:'flex',justifyContent:'space-between',
              alignItems:'baseline',padding:'8px 0',
              borderBottom:i<info.rows.length-1?'1px solid rgba(255,255,255,0.04)':undefined}}>
              <span style={{fontSize:12,color:'var(--tf)',fontFamily:"'Inter',sans-serif"}}>{l}</span>
              <span style={{fontSize:14,fontWeight:700,color:c,
                fontFamily:"'JetBrains Mono',monospace",textShadow:`0 0 10px ${c}44`}}>{v}</span>
            </div>
          ))}
          {info.note&&(
            <p style={{fontSize:11,color:'var(--ts)',fontFamily:"'Inter',sans-serif",
              marginTop:12,lineHeight:1.6,padding:'8px 12px',borderRadius:8,
              background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.06)'}}>{info.note}</p>
          )}
        </div>
        <div style={{padding:'0 20px 12px',textAlign:'right',
          fontSize:9,color:'var(--ts)',fontFamily:"'JetBrains Mono',monospace",letterSpacing:'.08em'}}>
          ESC or click outside to close
        </div>
      </div>
    </div>,
    document.body
  );
}

/* -- DASHBOARD ISOMETRIC TERRAIN ---------------------------
   Fixed pan (global listeners), smooth wheel zoom, map switcher.
   ---------------------------------------------------------- */
function DashTerrain({propTiles,gardTiles,mapView,propCols,gardCols,parallax,setModal,propBpId,gardBpId}:{
  propTiles:{id:number;icon:string}[];
  gardTiles:{id:number;icon:string}[];
  mapView:'property'|'raised-bed';
  propCols:number;
  gardCols:number;
  parallax:{x:number;y:number};
  setModal:(v:{emoji:string;bpId:string;tileId:number}|null)=>void;
  propBpId:string;
  gardBpId:string;
}){
  const [hovIdx,  setHovIdx] = useState<number|null>(null);
  const [zoom,    setZoom]   = useState(1.78);
  const [cursor,  setCursor] = useState<'grab'|'grabbing'>('grab');
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapRef      = useRef<HTMLDivElement>(null); // single transform target
  const svgRef       = useRef<SVGSVGElement>(null);  // measures actual rendered bounds
  const zoomRef      = useRef(1.78);
  const panRef       = useRef({x:0,y:0});
  const dragRef      = useRef<{mx:number;my:number;px:number;py:number}|null>(null);
  const movedRef     = useRef(false);
  // iconOffset: the pixel rect of the SVG rendered content (inside letterbox)
  const [iconOffset, setIconOffset] = useState<{left:number;top:number;width:number;height:number}|null>(null);

  const tiles      = mapView==='property'?propTiles:gardTiles;
  const activeBpId = mapView==='property'?propBpId:gardBpId;
  const COLS = mapView==='property'?propCols:gardCols;
  // Raised beds are 8 cols × 4 rows; property maps are square (COLS×COLS)
  const ROWS = (mapView==='raised-bed'&&COLS===8) ? 4 : COLS;
  const TW   = COLS===4?78:COLS===8?52:58;  // tile width — narrower for 8-col grid
  const TH   = COLS===4?46:COLS===8?30:34;
  const TZ   = COLS===4?28:COLS===8?18:22;
  // Sort by id (slot number) — matches the Maps grid slot layout exactly
  const placed  = [...tiles].sort((a,b)=>a.id-b.id).slice(0,COLS*ROWS);
  const W=COLS*TW+80, H=(ROWS+COLS)*TH+TZ*3+60;
  const cx=W/2;
  const isoX=(c:number,r:number)=>(c-r)*(TW/2);
  const isoY=(c:number,r:number)=>(c+r)*(TH/2);

  const applyTransform=(z:number,animate=false)=>{
    if(!wrapRef.current)return;
    wrapRef.current.style.transition=animate?'transform 0.22s cubic-bezier(0.22,1,0.36,1)':'none';
    wrapRef.current.style.transform=`translate(${panRef.current.x}px,${panRef.current.y}px) scale(${z})`;
  };

  // Measure where the SVG actually renders its content (accounts for xMidYMid meet letterboxing)
  const measureSvg=()=>{
    const svg=svgRef.current;
    const wrap=wrapRef.current;
    if(!svg||!wrap)return;
    const cw=wrap.clientWidth, ch=wrap.clientHeight;
    if(!cw||!ch)return;
    const scale=Math.min(cw/W, ch/H);
    const rw=W*scale, rh=H*scale;
    setIconOffset({left:(cw-rw)/2, top:(ch-rh)/2, width:rw, height:rh});
  };

  useEffect(()=>{
    measureSvg();
    const ro=new ResizeObserver(measureSvg);
    if(wrapRef.current)ro.observe(wrapRef.current);
    return()=>ro.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[W,H]);

  // Apply initial zoom+center on first mount — pan down so grid is centered not top-clipped
  useEffect(()=>{
    const frame=requestAnimationFrame(()=>{
      const h=containerRef.current?.clientHeight??400;
      // At 1.78x scale from center, top edge clips. Pan down by ~28% of container height
      // to bring the isometric grid into the visible center.
      const offsetY=Math.round(h*0.55);
      zoomRef.current=1.78;
      panRef.current={x:0,y:offsetY};
      applyTransform(1.78,false);
      setZoom(1.78);
    });
    return()=>cancelAnimationFrame(frame);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  useEffect(()=>{
    const el=containerRef.current;
    if(!el)return;
    const handler=(e:WheelEvent)=>{
      e.preventDefault();
      const rect=el.getBoundingClientRect();
      const mx=e.clientX-rect.left-rect.width/2;
      const my=e.clientY-rect.top-rect.height/2;
      const factor=e.deltaY<0?1.09:0.92;
      const next=Math.max(0.3,Math.min(4,zoomRef.current*factor));
      const ratio=next/zoomRef.current;
      panRef.current={x:mx+(panRef.current.x-mx)*ratio,y:my+(panRef.current.y-my)*ratio};
      zoomRef.current=next;
      applyTransform(next);
      setZoom(next);
    };
    el.addEventListener('wheel',handler,{passive:false});
    return()=>el.removeEventListener('wheel',handler);
  },[]);

  useEffect(()=>{
    const move=(clientX:number,clientY:number)=>{
      if(!dragRef.current)return;
      const dx=clientX-dragRef.current.mx;
      const dy=clientY-dragRef.current.my;
      if(!movedRef.current&&Math.hypot(dx,dy)>3)movedRef.current=true;
      if(!movedRef.current)return;
      panRef.current={x:dragRef.current.px+dx,y:dragRef.current.py+dy};
      applyTransform(zoomRef.current);
    };
    const onMouseMove=(e:MouseEvent)=>move(e.clientX,e.clientY);
    // touchmove on the CONTAINER only — never on window, so page scroll is unaffected
    const el=containerRef.current;
    const onTouchMove=(e:TouchEvent)=>{
      if(!dragRef.current)return; // only intercept when user is dragging terrain
      if(e.touches.length!==1)return;
      e.preventDefault();
      move(e.touches[0].clientX,e.touches[0].clientY);
    };
    const onUp=()=>{dragRef.current=null;movedRef.current=false;setCursor('grab');};
    window.addEventListener('mousemove',onMouseMove,{passive:true});
    window.addEventListener('mouseup',onUp);
    window.addEventListener('touchend',onUp);
    if(el)el.addEventListener('touchmove',onTouchMove,{passive:false});
    return()=>{
      window.removeEventListener('mousemove',onMouseMove);
      window.removeEventListener('mouseup',onUp);
      window.removeEventListener('touchend',onUp);
      if(el)el.removeEventListener('touchmove',onTouchMove);
    };
  },[]);

  const onMouseDown=(e:React.MouseEvent)=>{
    if(e.button!==0)return;
    e.preventDefault();
    movedRef.current=false;
    dragRef.current={mx:e.clientX,my:e.clientY,px:panRef.current.x,py:panRef.current.y};
    setCursor('grabbing');
  };

  const px=parallax.x*3, py=parallax.y*2;

  const emptyState=(
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',
      justifyContent:'center',height:'100%',gap:14,color:'var(--ts)',textAlign:'center',padding:32}}>
      <div style={{fontSize:36,opacity:0.25}}>🌱</div>
      <p style={{fontSize:13,fontFamily:"'Inter',sans-serif",lineHeight:1.6,maxWidth:260}}>
        Generate a blueprint to see your terrain — each feature becomes a clickable node.
      </p>
    </div>
  );

  return(
    <div style={{position:'absolute',inset:0}}>
      {/* Parallax glow */}
      <div aria-hidden style={{position:'absolute',
        top:`calc(38% + ${py}px)`,left:`calc(46% + ${px}px)`,
        width:240,height:240,borderRadius:'50%',pointerEvents:'none',
        background:'radial-gradient(circle,rgba(0,255,170,0.07) 0%,transparent 65%)',
        transform:'translate(-50%,-50%)',
        transition:'top 1.4s cubic-bezier(0.22,1,0.36,1),left 1.4s cubic-bezier(0.22,1,0.36,1)'}}/>

      <div ref={containerRef}
        style={{position:'absolute',inset:0,overflow:'hidden',cursor,userSelect:'none'}}
        onMouseDown={onMouseDown}
        onTouchStart={e=>{
          if(e.touches.length!==1)return;
          e.preventDefault();
          const t=e.touches[0];
          movedRef.current=false;
          dragRef.current={mx:t.clientX,my:t.clientY,px:panRef.current.x,py:panRef.current.y};
          setCursor('grabbing');
        }}>

        {placed.length===0?emptyState:(
          <div ref={wrapRef} style={{
            position:'absolute',inset:0,
            transformOrigin:'center center',
          }}>
            <svg ref={svgRef} width="100%" height="100%"
              viewBox={`0 0 ${W} ${H}`}
              preserveAspectRatio="xMidYMid meet"
              style={{position:'absolute',inset:0,userSelect:'none'}}>

              {/* Ghost grid */}
              {Array.from({length:COLS},(_,c)=>Array.from({length:ROWS},(_,r)=>{
                const x=cx+isoX(c,r),y=isoY(c,r)+24;
                return<polygon key={`g${c}${r}`}
                  points={`${x},${y} ${x+TW/2},${y+TH/2} ${x},${y+TH} ${x-TW/2},${y+TH/2}`}
                  fill="rgba(0,255,170,0.016)" stroke="rgba(0,255,170,0.06)" strokeWidth="0.5"/>;
              }))}

              {/* Tiles */}
              {placed.map((tile)=>{
                  const slot=tile.id;
                  const c=slot%COLS, r=Math.floor(slot/COLS);
                  const idx=placed.findIndex(t=>t.id===tile.id);
                  const x=cx+isoX(c,r),y=isoY(c,r)+24;
                  const lib=ICON_LOOKUP.get(tile.icon);
                  const col=(lib&&CAT_COLOR[lib.category])||'#00ffaa';
                  const hov=hovIdx===idx;
                  const tz=hov?TZ+10:TZ;
                  const top  =`${x},${y-tz} ${x+TW/2},${y+TH/2-tz} ${x},${y+TH-tz} ${x-TW/2},${y+TH/2-tz}`;
                  const right=`${x+TW/2},${y+TH/2-tz} ${x+TW/2},${y+TH/2} ${x},${y+TH} ${x},${y+TH-tz}`;
                  const left =`${x-TW/2},${y+TH/2-tz} ${x-TW/2},${y+TH/2} ${x},${y+TH} ${x},${y+TH-tz}`;
                  return(
                    <g key={tile.id} style={{cursor:'pointer'}}
                      onMouseEnter={()=>setHovIdx(idx)}
                      onMouseLeave={()=>setHovIdx(null)}
                      onClick={e=>{
                        e.stopPropagation();
                        if(movedRef.current)return;
                        setModal({emoji:tile.icon,bpId:activeBpId,tileId:tile.id});
                      }}>
                      <polygon points={left}  fill={hov?`${col}28`:`${col}12`} stroke={`${col}28`} strokeWidth="0.5"/>
                      <polygon points={right} fill={hov?`${col}38`:`${col}1a`} stroke={`${col}28`} strokeWidth="0.5"/>
                      <polygon points={top}
                        fill={hov?`${col}c0`:`${col}60`}
                        stroke={`${col}${hov?'ff':'88'}`}
                        strokeWidth={hov?1.0:0.6}/>
                      {hov&&<ellipse cx={x} cy={y+TH/2-tz+2} rx={TW/2+4} ry={TH/2+3}
                        fill={`${col}18`} style={{animation:'pulse 1.5s ease-in-out infinite'}}/>}
                    </g>
                  );
                })}

              <ellipse cx={cx} cy={isoY(COLS/2,ROWS/2)+TH+36}
                rx={W*0.38} ry={28} fill="rgba(0,255,170,0.04)"
                style={{animation:'breathe 5s ease-in-out infinite'}}/>
            </svg>

            {/* Icon overlay: positioned using measured SVG render bounds */}
            {iconOffset&&(
              <div style={{
                position:'absolute',
                left:iconOffset.left,
                top:iconOffset.top,
                width:iconOffset.width,
                height:iconOffset.height,
                pointerEvents:'none',
                userSelect:'none',
              }}>
                {placed.map((tile)=>{
                  const slot=tile.id;
                  const c=slot%COLS, r=Math.floor(slot/COLS);
                  const x=cx+isoX(c,r), y=isoY(c,r)+24;
                  const idx2=placed.findIndex((t:{id:number;icon:string})=>t.id===tile.id);
                  const tz2=(hovIdx===idx2?TZ+10:TZ);
                  const pctX=(x/W)*100;
                  const pctY=((y+TH/2-tz2)/H)*100;
                  return(
                    <div key={tile.id} style={{
                      position:'absolute',
                      left:`${pctX}%`,
                      top:`${pctY}%`,
                      transform:'translate(-50%,-50%)',
                      width:20,height:20,
                      display:'flex',alignItems:'center',justifyContent:'center',
                    }}>
                      {tile.icon==='🌱'?<span style={{fontSize:13,lineHeight:1}}>🌱</span>:<FeatureIcon emoji={tile.icon} size={14}/>}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Bottom bar: category legend LEFT · zoom controls + hint RIGHT */}
        <div style={{position:'absolute',bottom:9,left:10,right:10,
          display:'flex',justifyContent:'space-between',alignItems:'center',
          pointerEvents:'none',zIndex:4}}>
          {/* Category legend */}
          <div style={{display:'flex',gap:4,flexWrap:'wrap'}}>
            {Object.entries(CAT_COLOR)
              .filter(([cat])=>tiles.some(t=>ICON_LOOKUP.get(t.icon)?.category===cat))
              .map(([cat,c])=>(
                <span key={cat} style={{fontSize:8,color:c,fontFamily:"'JetBrains Mono',monospace",
                  letterSpacing:'.05em',textTransform:'uppercase',
                  padding:'2px 6px',borderRadius:99,background:`${c}10`,border:`1px solid ${c}1c`}}>
                  {cat}
                </span>
              ))}
          </div>
          {/* Zoom controls + hint */}
          <div style={{display:'flex',alignItems:'center',gap:5,pointerEvents:'all'}}>
            <span style={{fontSize:8,color:'rgba(0,255,170,0.22)',
              fontFamily:"'JetBrains Mono',monospace",letterSpacing:'.04em',marginRight:2}}>
              scroll · drag · click
            </span>
            {[
              {l:'−',fn:()=>{const n=Math.max(0.3,zoomRef.current*0.87);zoomRef.current=n;applyTransform(n,true);setZoom(n);}},
              {l:'↺',fn:()=>{const h=containerRef.current?.clientHeight??400;const offsetY=Math.round(h*0.55);zoomRef.current=1.78;panRef.current={x:0,y:offsetY};applyTransform(1.78,true);setZoom(1.78);}},
              {l:'+',fn:()=>{const n=Math.min(4,zoomRef.current*1.15);zoomRef.current=n;applyTransform(n,true);setZoom(n);}},
            ].map(({l,fn})=>(
              <button key={l} onClick={fn}
                style={{width:22,height:22,borderRadius:5,
                  border:'1px solid rgba(0,255,170,0.16)',
                  background:'rgba(8,22,14,0.70)',backdropFilter:'blur(8px)',
                  color:'#00ffaa',cursor:'pointer',outline:'none',
                  display:'flex',alignItems:'center',justifyContent:'center',
                  fontSize:l==='↺'?9:13,fontFamily:'monospace',
                  transition:'background 0.14s,border-color 0.14s'}}
                onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background='rgba(0,255,170,0.14)';
                  (e.currentTarget as HTMLElement).style.borderColor='rgba(0,255,170,0.38)';}}
                onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background='rgba(8,22,14,0.70)';
                  (e.currentTarget as HTMLElement).style.borderColor='rgba(0,255,170,0.16)';}}>
                {l}
              </button>
            ))}
            <span style={{fontSize:9,color:'rgba(0,255,170,0.55)',
              fontFamily:"'JetBrains Mono',monospace",letterSpacing:'.03em',minWidth:28,textAlign:'right'}}>
              {Math.round(zoom*100)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
/* ============================================
   MAIN COMPONENT
============================================ */
interface BentoGridProps {
  calc: CalcResult;
  allTiles: {id:number;icon:string}[];
  isMobile: boolean;
  blueprints: Blueprint[];
  mapSubTab: 'property'|'raised-bed';
  propIdx: number;
  rbIdx: number;
  raisedBedBps: Blueprint[];
  propBps: Blueprint[];
  wDragSrc: string|null;
  setWDragSrc: React.Dispatch<React.SetStateAction<string|null>>;
  wOrder: string[];
  setWOrder: React.Dispatch<React.SetStateAction<string[]>>;
  drillInfo: any;
  setDrillInfo: React.Dispatch<React.SetStateAction<any>>;
  terrainMap: 'property'|'raised-bed';
  terrainPropIdx: number;
  terrainGardIdx: number;
  parallax: {x:number;y:number};
  setModal: React.Dispatch<React.SetStateAction<any>>;
  fv: any;
  terrainDropdown: 'property'|'raised-bed'|null;
  setTerrainDropdown: React.Dispatch<React.SetStateAction<'property'|'raised-bed'|null>>;
  setTerrainMap: React.Dispatch<React.SetStateAction<'property'|'raised-bed'>>;
  setTerrainPropIdx: React.Dispatch<React.SetStateAction<number>>;
  setTerrainGardIdx: React.Dispatch<React.SetStateAction<number>>;
  CAT_COLOR: Record<string,string>;
  iconFilter: string;
  setIconFilter: React.Dispatch<React.SetStateAction<string>>;
}

function BentoGrid({
  calc,
  allTiles,
  isMobile,
  blueprints,
  mapSubTab,
  propIdx,
  rbIdx,
  raisedBedBps,
  propBps,
  wDragSrc,
  setWDragSrc,
  wOrder,
  setWOrder,
  drillInfo,
  setDrillInfo,
  terrainMap,
  terrainPropIdx,
  terrainGardIdx,
  parallax,
  setModal,
  fv,
  terrainDropdown,
  setTerrainDropdown,
  setTerrainMap,
  setTerrainPropIdx,
  setTerrainGardIdx,
  CAT_COLOR,
  iconFilter,
  setIconFilter,
}: BentoGridProps) {
// Helper to build drill info for a given widget
const drill=(title:string,color:string,rows:{l:string;v:string;c:string}[],note?:string)=>
  ()=>setDrillInfo({title,color,rows,note});

const startDrag=(id:string)=>setWDragSrc(id);
const dropOn=(id:string)=>{
  if(!wDragSrc||wDragSrc===id)return;
  setWOrder(o=>{
    const a=[...o];
    const si=a.indexOf(wDragSrc),di=a.indexOf(id);
    if(si>=0&&di>=0){[a[si],a[di]]=[a[di],a[si]];}
    return a;
  });
  setWDragSrc(null);
};

// Shared drag props for each widget
const dragProps=(id:string)=>({
  onDragStart:(e:React.DragEvent)=>{
    e.dataTransfer.effectAllowed='move';
    e.dataTransfer.setData('text/plain',id);
    setWDragSrc(id);
    // Add slight opacity to dragging element
    setTimeout(()=>{(e.target as HTMLElement).style.opacity='0.55';},0);
  },
  onDragEnd:(e:React.DragEvent)=>{
    (e.target as HTMLElement).style.opacity='';
    setWDragSrc(null);
  },
  onDragOver:(e:React.DragEvent)=>{e.preventDefault();e.dataTransfer.dropEffect='move';},
  onDrop:(e:React.DragEvent)=>{
    e.preventDefault();
    const src=e.dataTransfer.getData('text/plain');
    if(src&&src!==id){
      setWOrder(o=>{
        const a=[...o];
        const si=a.indexOf(src),di=a.indexOf(id);
        if(si>=0&&di>=0){[a[si],a[di]]=[a[di],a[si]];}
        return a;
      });
    }
    setWDragSrc(null);
  },
});

// Active blueprint for terrain
  // propBps passed as prop - not redefined here

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const w_score = (
    <div className="tilt-card"
      draggable {...dragProps('score')}
      onClick={drill('Regeneration Score','#00ffaa',[
        {l:'Composite score',v:`${calc.resilienceScore}/98`,c:'#00ffaa'},
        {l:'Category diversity (max 30)',v:String(Math.min(30,new Set(allTiles.map((t:{id:number;icon:string})=>ICON_LOOKUP.get(t.icon)?.category).filter(Boolean)).size*5)),c:'#00e09a'},
        {l:'Food sufficiency (max 22)',v:String(Math.round((calc.foodSelfSufficiencyPct/100)*22)),c:'#00ffaa'},
        {l:'Water (max 18)',v:String(Math.round((calc.waterSavingsPct/100)*18)),c:'#00e5ff'},
        {l:'CO₂ (max 15)',v:String(Math.round((Math.min(calc.totalCo2Lbs,600)/600)*15)),c:'#c8ff64'},
        {l:'Energy (max 8)',v:allTiles.some((t:{id:number;icon:string})=>['☀️','🌬️','🔋','⚡'].includes(t.icon))?'8':'0',c:'#ffb340'},
        {l:'Features (max 5)',v:String(Math.min(5,Math.round((allTiles.length/12)*5))),c:'#a78bfa'},
      ],'Max score is 98 — a perfect ecosystem is never finished.')}
      style={{
        position:'relative',overflow:isMobile?'visible':'hidden',borderRadius:20,padding:isMobile?'14px 14px':'22px 20px',
        cursor:'pointer',gridColumn:isMobile?'span 1':'span 4',
        background:'linear-gradient(160deg,rgba(0,255,170,0.09) 0%,rgba(12,30,20,0.82) 100%)',
        border:'1px solid rgba(0,255,170,0.32)',
        backdropFilter:'blur(20px)',
        boxShadow:'0 0 40px rgba(0,255,170,0.07)',
      }}>
      <div style={{position:'absolute',top:0,left:0,right:0,height:1,
        background:'linear-gradient(90deg,transparent,rgba(0,255,170,0.55),transparent)'}}/>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:isMobile?8:14}}>
        <span style={{fontSize:10,fontWeight:700,letterSpacing:'.14em',color:'rgba(0,255,170,0.65)',
          fontFamily:"'JetBrains Mono',monospace",textTransform:'uppercase'}}>REGEN SCORE ↗</span>
        {!isMobile&&<span style={{fontSize:12,color:'var(--ts)',cursor:'grab',userSelect:'none'}}
          draggable onDragStart={e=>{e.stopPropagation();startDrag('score');}}>⋮⋮</span>}
      </div>
      <div style={{display:'flex',alignItems:'center',gap:16}}>
        <ScoreRing value={calc.resilienceScore} max={98} color="#00ffaa" size={isMobile?64:88} label="" sublabel="" animated/>
        <div style={{flex:1}}>
          <div style={{fontSize:isMobile?26:38,fontWeight:300,color:'#00ffaa',lineHeight:1,
            fontFamily:"'Inter',sans-serif",
            textShadow:'0 0 28px rgba(0,255,170,0.55)',marginBottom:4}}>
            {calc.resilienceScore}<span style={{fontSize:16,opacity:0.45}}>/98</span>
          </div>
          <div style={{fontSize:10,letterSpacing:'.10em',textTransform:'uppercase',
            color:'rgba(0,255,170,0.65)',fontFamily:"'JetBrains Mono',monospace",marginBottom:10}}>
            {calc.resilienceScore>=70?'SELF-SUSTAINING':calc.resilienceScore>=40?'DEVELOPING':'EARLY STAGE'}
          </div>
          {!isMobile&&[
            {l:'Food', v:calc.foodSelfSufficiencyPct,c:'#00e09a'},
            {l:'Water',v:calc.waterSavingsPct,       c:'#00e5ff'},
            {l:'CO₂', v:Math.min(100,Math.round(calc.totalCo2Lbs/6)),c:'#c8ff64'},
          ].map(({l,v,c})=>(
            <div key={l} style={{marginBottom:5}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:2,
                fontSize:9,color:'var(--ts)',fontFamily:"'JetBrains Mono',monospace",letterSpacing:'.06em'}}>
                <span>{l}</span><span style={{color:c}}>{v}%</span>
              </div>
              <div style={{height:3,borderRadius:99,background:'rgba(255,255,255,0.06)'}}>
                <div style={{height:'100%',borderRadius:99,width:`${v}%`,
                  background:`linear-gradient(90deg,${c},${c}99)`,
                  boxShadow:`0 0 6px ${c}55`,
                  transition:'width 1.4s cubic-bezier(0.22,1,0.36,1)'}}/>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
);
const w_kpi = (
    <div
      draggable {...dragProps('kpi')}
      style={{
        position:'relative',overflow:isMobile?'visible':'hidden',borderRadius:20,padding:isMobile?'12px 14px':'18px 20px',
        gridColumn:isMobile?'span 1':'span 8',
        background:'linear-gradient(135deg,rgba(0,255,170,0.04),rgba(12,30,20,0.80))',
        border:'1px solid rgba(0,255,170,0.09)',
        backdropFilter:'blur(20px)',
      }}>
      <div style={{position:'absolute',top:0,left:0,right:0,height:1,
        background:'linear-gradient(90deg,transparent,rgba(0,255,170,0.30),transparent)'}}/>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:isMobile?8:14}}>
        <span style={{fontSize:10,fontWeight:700,letterSpacing:'.14em',color:'rgba(0,255,170,0.50)',
          fontFamily:"'JetBrains Mono',monospace",textTransform:'uppercase'}}>KEY METRICS</span>
        {!isMobile&&<span style={{fontSize:12,color:'var(--ts)',cursor:'grab',userSelect:'none'}}
          draggable onDragStart={e=>{e.stopPropagation();startDrag('kpi');}}>⋮⋮</span>}
      </div>
      <div style={{display:'grid',gridTemplateColumns:isMobile?'repeat(2,1fr)':'repeat(4,1fr)',gap:isMobile?8:10}}>
        {[
          {icon:'🌾',label:'Annual Yield',  value:calc.totalYieldLbs.toLocaleString()+' lbs',sub:`~${Math.round(calc.totalYieldLbs/FOOD_NEED*10)/10} people/yr`,c:'#00e09a',
            rows:[{l:'Total yield',v:calc.totalYieldLbs.toLocaleString()+' lbs',c:'#00e09a'},{l:'Family need',v:(FOOD_NEED*Math.max(1,Number(fv.familySize)||4)).toLocaleString()+' lbs',c:'var(--ts)'},{l:'Self-sufficiency',v:calc.foodSelfSufficiencyPct+'%',c:'#00e09a'}],
            note:'FOOD_NEED = 600 lbs/person/yr'},
          {icon:'💧',label:'Water Saved',   value:calc.totalWaterGal.toLocaleString()+' gal',sub:`${calc.waterSavingsPct}% of irrigation budget`,c:'#00e5ff',
            rows:[{l:'Captured/yr',v:calc.totalWaterGal.toLocaleString()+' gal',c:'#00e5ff'},{l:'Irrigation baseline',v:Math.round(WATER_BASE*(Math.max(1,Number(fv.familySize)||4)/4)).toLocaleString()+' gal',c:'var(--ts)'},{l:'Independence',v:calc.waterSavingsPct+'%',c:'#00e5ff'}]},
          {icon:'💰',label:'Year 1 Savings',value:'$'+calc.year1Savings.toLocaleString(),sub:`$${Math.round(calc.year1Savings/12).toLocaleString()}/mo`,c:'#00ffaa',
            rows:[{l:'Food & animal value',v:'$'+calc.foodSavings.toLocaleString(),c:'#00e09a'},{l:'Water value',v:'$'+Math.round(calc.totalWaterGal*.005).toLocaleString(),c:'#00e5ff'},{l:'CO₂ benefit',v:'$'+Math.round(calc.totalCo2Lbs*.023).toLocaleString(),c:'#c8ff64'},{l:'Total year 1',v:'$'+calc.year1Savings.toLocaleString(),c:'#00ffaa'}],
            note:'$0.80/lb produce · $1.25–8.00/lb animal products · $0.005/gal water · $0.023/lb CO₂ (~$50/tonne) · $200/yr energy unit'},
          {icon:'🌿',label:'CO₂ Offset',   value:calc.totalCo2Lbs.toLocaleString()+' lbs',sub:`≈ ${Math.round(calc.totalCo2Lbs*1.31).toLocaleString()} fewer miles`,c:'#c8ff64',
            rows:[{l:'CO₂ sequestered',v:calc.totalCo2Lbs.toLocaleString()+' lbs/yr',c:'#c8ff64'},{l:'Driving equivalent',v:Math.round(calc.totalCo2Lbs*1.31).toLocaleString()+' miles',c:'var(--ts)'},{l:'Target (max score)',v:'600 lbs',c:'var(--ts)'}]},
        ].map(({icon,label,value,sub,c,rows,note})=>(
          <div key={label} className="tilt-card"
            onClick={drill(label,c,rows,note)}
            style={{
              cursor:'pointer',padding:isMobile?'10px 10px':'14px 16px',borderRadius:14,
              background:`${c}08`,border:`1px solid ${c}18`,
              transition:'transform 0.18s,opacity 0.18s,border-color 0.18s,box-shadow 0.18s',position:'relative',overflow:'hidden',
            }}
            onMouseEnter={e=>{const el=e.currentTarget as HTMLElement;
              el.style.background=`${c}12`;el.style.borderColor=`${c}30`;}}
            onMouseLeave={e=>{const el=e.currentTarget as HTMLElement;
              el.style.background=`${c}08`;el.style.borderColor=`${c}18`;}}>
            <div style={{position:'absolute',top:0,left:0,right:0,height:1,
              background:`linear-gradient(90deg,transparent,${c}44,transparent)`}}/>
            <div style={{display:'flex',alignItems:'center',gap:5,marginBottom:isMobile?5:9}}>
              <span style={{fontSize:isMobile?13:16}}>{icon}</span>
              <span style={{fontSize:isMobile?8:9,fontWeight:700,letterSpacing:'.10em',color:`${c}80`,
                fontFamily:"'JetBrains Mono',monospace",textTransform:'uppercase'}}>{label}</span>
            </div>
            <div style={{fontSize:isMobile?15:22,fontWeight:700,color:c,
              fontFamily:"'Inter',sans-serif",lineHeight:1,marginBottom:isMobile?2:5,
              textShadow:`0 0 18px ${c}55`}}>{value}</div>
            {!isMobile&&<div style={{fontSize:10,color:`${c}60`,fontFamily:"'Inter',sans-serif"}}>{sub}</div>}
          </div>
        ))}
      </div>
    </div>
);
const w_terrain = (
    <div
      draggable {...dragProps('terrain')}
      style={{
        position:'relative',overflow:'hidden',borderRadius:20,
        gridColumn:isMobile?'span 1':'span 8',height:isMobile?340:340,
        background:'linear-gradient(135deg,rgba(0,255,170,0.04),rgba(12,30,20,0.82))',
        border:'1px solid rgba(0,255,170,0.10)',
        backdropFilter:'blur(20px)',
      }}>
      {/* Chromatic top edge */}
      <div style={{position:'absolute',top:0,left:0,right:0,height:1,
        background:'linear-gradient(90deg,transparent,rgba(0,255,170,0.35),transparent)',zIndex:2}}/>

      {/* -- Header: title LEFT · dropdown selectors RIGHT -- */}
      <div style={{
        position:'absolute',top:0,left:0,right:0,zIndex:5,
        display:'flex',alignItems:'center',justifyContent:'space-between',
        padding:'9px 12px 7px',
        background:'linear-gradient(180deg,rgba(12,28,18,0.80) 0%,rgba(0,8,5,0.40) 70%,transparent 100%)',
        pointerEvents:'none',
      }}>
        {/* Title + active map info */}
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <span style={{fontSize:9,fontWeight:700,letterSpacing:'.14em',
            color:'rgba(0,255,170,0.60)',fontFamily:"'JetBrains Mono',monospace",
            textTransform:'uppercase'}}>TERRAIN CORE</span>
          <span style={{fontSize:9,color:'rgba(0,255,170,0.28)',
            fontFamily:"'JetBrains Mono',monospace",letterSpacing:'.05em'}}>
            {terrainMap==='property'
              ?(propBps[terrainPropIdx]??propBps[0])?.name
              :(raisedBedBps[terrainGardIdx]??raisedBedBps[0])?.name??'No Raised Beds'}
          </span>
          <span style={{fontSize:9,color:'rgba(0,255,170,0.55)',
            fontFamily:"'JetBrains Mono',monospace",letterSpacing:'.04em'}}>
            · {terrainMap==='property'
              ?(propBps[terrainPropIdx]??propBps[0])?.tiles?.length??0
              :(raisedBedBps[terrainGardIdx]??raisedBedBps[0])?.tiles?.length??0} nodes
          </span>
        </div>

        {/* Type + blueprint dropdown selectors */}
        <div style={{display:'flex',gap:4,pointerEvents:'all',position:'relative'}}>
          {(['property','raised-bed'] as const).map(t=>{
            const on=terrainMap===t;
            const C=t==='property'?'#00ffaa':'#00d4ff';
            const bps=t==='property'?propBps:raisedBedBps;
            const idx=t==='property'?terrainPropIdx:terrainGardIdx;
            const active=bps[idx]??bps[0];
            const isOpen=terrainDropdown===t;
            return(
              <div key={t} style={{position:'relative'}}>
                <button
                  onClick={()=>{
                    setTerrainMap(t);
                    if(bps.length>1)
                      setTerrainDropdown(isOpen?null:t);
                    else
                      setTerrainDropdown(null);
                  }}
                  style={{
                    display:'flex',alignItems:'center',gap:5,
                    padding:'4px 8px',borderRadius:7,
                    cursor:'pointer',outline:'none',
                    fontSize:9,fontWeight:700,letterSpacing:'.05em',
                    textTransform:'uppercase',fontFamily:"'JetBrains Mono',monospace",
                    background:on?`${C}18`:`rgba(0,8,5,0.55)`,
                    color:on?C:'rgba(160,210,190,0.35)',
                    boxShadow:on?`0 0 10px ${C}25`:undefined,
                    border:`1px solid ${on?C+'22':'rgba(0,255,170,0.08)'}`,
                    backdropFilter:'blur(8px)',
                    transition:'background 0.14s,color 0.14s',
                  }}>
                  {t==='property'?'🏡':'🌱'}
                  <span>{t==='property'?'property':'raised beds'}</span>
                  <span style={{opacity:0.50,fontSize:8}}>({bps.length})</span>
                  {bps.length>1&&(
                    <span style={{fontSize:8,opacity:0.60,marginLeft:1}}>
                      {isOpen?'▲':'▼'}
                    </span>
                  )}
                </button>

                {/* Dropdown list */}
                {isOpen&&bps.length>1&&(
                  <div style={{
                    position:'absolute',top:'calc(100% + 4px)',right:0,
                    minWidth:160,borderRadius:10,overflow:'hidden',
                    background:'rgba(0,8,5,0.96)',
                    border:`1px solid ${C}22`,
                    backdropFilter:'blur(20px)',
                    boxShadow:`0 8px 32px rgba(0,0,0,0.35),0 0 0 1px ${C}10`,
                    zIndex:20,
                  }}>
                    {bps.map((bp,i)=>{
                      const isSel=(t==='property'?terrainPropIdx:terrainGardIdx)===i;
                      return(
                        <button key={bp.id}
                          onClick={e=>{
                            e.stopPropagation();
                            if(t==='property')setTerrainPropIdx(i);
                            else setTerrainGardIdx(i);
                            setTerrainDropdown(null);
                          }}
                          style={{
                            width:'100%',display:'flex',alignItems:'center',
                            justifyContent:'space-between',
                            gap:8,padding:'8px 12px',border:'none',
                            background:isSel?`${C}12`:'transparent',
                            cursor:'pointer',textAlign:'left',outline:'none',
                            borderBottom:i<bps.length-1?`1px solid ${C}0a`:undefined,
                            transition:'background 0.12s',
                          }}
                          onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background=`${C}18`;}}
                          onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background=isSel?`${C}12`:'transparent';}}>
                          <div>
                            <div style={{fontSize:11,fontWeight:600,
                              color:isSel?C:'var(--td)',
                              fontFamily:"'Inter',sans-serif",lineHeight:1.3}}>
                              {bp.name}
                            </div>
                            <div style={{fontSize:9,color:'var(--ts)',
                              fontFamily:"'JetBrains Mono',monospace",
                              letterSpacing:'.04em',marginTop:2}}>
                              {bp.tiles.length} nodes · {bp.gridCols}×{bp.gridCount/bp.gridCols}
                            </div>
                          </div>
                          {isSel&&<span style={{fontSize:10,color:C}}>✓</span>}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Close dropdown on outside click */}
      {terrainDropdown&&(
        <div style={{position:'fixed',inset:0,zIndex:4}}
          onClick={()=>setTerrainDropdown(null)}/>
      )}

      <DashTerrain
        propTiles={(propBps[terrainPropIdx]??propBps[0])?.tiles??[]}
        gardTiles={(raisedBedBps[terrainGardIdx]??raisedBedBps[0])?.tiles??[]}
        mapView={terrainMap}
        propCols={(propBps[terrainPropIdx]??propBps[0])?.gridCols??6}
        gardCols={(raisedBedBps[terrainGardIdx]??raisedBedBps[0])?.gridCols??8}
        parallax={parallax}
        setModal={setModal}
        propBpId={(propBps[terrainPropIdx]??propBps[0])?.id??''}
        gardBpId={(raisedBedBps[terrainGardIdx]??raisedBedBps[0])?.id??''}
      />
    </div>
);
const w_features = (
    <div
      draggable {...dragProps('features')}
      style={{
        position:'relative',overflow:'hidden',borderRadius:20,
        gridColumn:isMobile?'span 1':'span 4',height:isMobile?'auto':340,
        display:'flex',flexDirection:'column',
        background:'linear-gradient(135deg,rgba(0,255,170,0.04),rgba(12,30,20,0.80))',
        border:'1px solid rgba(0,255,170,0.09)',
        backdropFilter:'blur(20px)',
      }}>
      <div style={{position:'absolute',top:0,left:0,right:0,height:1,
        background:'linear-gradient(90deg,transparent,rgba(0,255,170,0.25),transparent)'}}/>
      <div style={{padding:'13px 15px 9px',borderBottom:'1px solid rgba(0,255,170,0.07)',
        flexShrink:0,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <span style={{fontSize:10,fontWeight:700,letterSpacing:'.14em',color:'rgba(0,255,170,0.60)',
          fontFamily:"'JetBrains Mono',monospace",textTransform:'uppercase'}}>INVENTORY</span>
        <span style={{fontSize:12,color:'var(--ts)',cursor:'grab',userSelect:'none'}}
          draggable onDragStart={e=>{e.stopPropagation();startDrag('features');}}>⋮⋮</span>
      </div>
      {/* Category filter chips */}
      <div style={{padding:isMobile?'5px 8px':'7px 10px',borderBottom:'1px solid rgba(0,255,170,0.05)',
        display:'flex',flexWrap:'wrap',gap:isMobile?3:4,flexShrink:0}}>
        {['all','food','water','energy','soil','biodiversity'].map(cat=>(
          <button key={cat} onClick={()=>setIconFilter(cat)}
            style={{padding:'2px 8px',borderRadius:99,fontSize:9,fontWeight:600,
              fontFamily:"'Inter',sans-serif",letterSpacing:'.05em',
              textTransform:'uppercase',cursor:'pointer',outline:'none',
              background:iconFilter===cat?'#00ffaa':'rgba(0,255,170,0.04)',
              border:`1px solid ${iconFilter===cat?'#00ffaa':'rgba(0,255,170,0.10)'}`,
              color:iconFilter===cat?'#001a10':'#00ffaa',transition:'transform 0.14s,opacity 0.14s,border-color 0.14s,box-shadow 0.14s'}}>
            {cat}
          </button>
        ))}
      </div>
      {/* Feature list */}
      <div style={{flex:isMobile?'none':1,overflowY:isMobile?'visible':'auto',padding:'6px 10px',width:'100%',boxSizing:'border-box'}} className="lib-scroll">
        {calc.featureBreakdown
          .filter((f:any)=>iconFilter==='all'||ICON_LOOKUP.get(f.emoji)?.category===iconFilter)
          .map((f:any)=>{
            const lib=ICON_LOOKUP.get(f.emoji);
            const c=(lib&&CAT_COLOR[lib.category])||'#00ffaa';
            return(
              <div key={f.emoji}
                onClick={()=>drill(`${f.emoji} ${f.name}`,c,[
                  {l:'Count on map',v:String(f.count),c},
                  {l:'Yield / unit',v:f.yieldLbs>0?f.yieldLbs+' lbs/yr':'—',c:'#00e09a'},
                  {l:'Water / unit',v:f.waterGal>0?f.waterGal.toLocaleString()+' gal/yr':'—',c:'#00e5ff'},
                  {l:'CO₂ / unit',v:f.co2+' lbs/yr',c:'#c8ff64'},
                  {l:'Est. cost',v:'$'+(lib?Math.round((lib.costMin+lib.costMax)/2):0).toLocaleString(),c:'#ffb340'},
                  ...(f.count>1?[{l:`Total yield (×${f.count})`,v:(f.yieldLbs*f.count).toLocaleString()+' lbs',c}]:[]),
                ])()}
                style={{display:'flex',alignItems:'center',gap:8,padding:'7px 8px',
                  borderRadius:9,marginBottom:3,cursor:'pointer',transition:'transform 0.14s,opacity 0.14s,border-color 0.14s,box-shadow 0.14s',
                  background:'rgba(0,255,170,0.02)',border:'1px solid rgba(0,255,170,0.05)'}}
                onMouseEnter={e=>{const el=e.currentTarget as HTMLElement;
                  el.style.background=`${c}0d`;el.style.borderColor=`${c}22`;}}
                onMouseLeave={e=>{const el=e.currentTarget as HTMLElement;
                  el.style.background='rgba(0,255,170,0.02)';el.style.borderColor='rgba(0,255,170,0.05)';}}>
                <FeatureIcon emoji={f.emoji} size={16}/>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:11,fontWeight:600,color:'var(--td)',
                    fontFamily:"'Inter',sans-serif",
                    whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>
                    {f.name}
                    {f.count>1&&<span style={{fontSize:9,color:`${c}80`,
                      fontFamily:"'JetBrains Mono',monospace",marginLeft:4}}>×{f.count}</span>}
                  </div>
                  <div style={{fontSize:9,color:'var(--ts)',
                    fontFamily:"'JetBrains Mono',monospace",letterSpacing:'.04em',marginTop:1}}>
                    {f.yieldLbs*f.count>0?`${(f.yieldLbs*f.count).toLocaleString()}lbs · `:''}
                    {f.co2*f.count}lbs CO₂
                  </div>
                </div>
                <span style={{fontSize:10,fontWeight:600,color:c,flexShrink:0,
                  fontFamily:"'JetBrains Mono',monospace"}}>
                  ${lib?Math.round((lib.costMin+lib.costMax)/2*f.count):0}
                </span>
              </div>
            );
          })}
      </div>
      {/* Footer */}
      <div style={{padding:'9px 14px',borderTop:'1px solid rgba(0,255,170,0.07)',
        flexShrink:0,display:'flex',gap:10,justifyContent:'space-between'}}>
        {[
          {l:'Features',v:allTiles.length},
          {l:'Est. cost',v:(()=>{const tot=allTiles.reduce((s:number,t:{id:number;icon:string})=>{const f=ICON_LOOKUP.get(t.icon);return s+(f?Math.round((f.costMin+f.costMax)/2):0);},0);return '$'+tot.toLocaleString();})()},
          {l:'Net/yr',   v:'$'+calc.year1Savings.toLocaleString()},
        ].map(({l,v})=>(
          <div key={l} style={{textAlign:'center'}}>
            <div style={{fontSize:14,fontWeight:700,color:'#00ffaa',
              fontFamily:"'Inter',sans-serif"}}>{v}</div>
            <div style={{fontSize:8,color:'var(--ts)',fontFamily:"'JetBrains Mono',monospace",
              letterSpacing:'.08em',textTransform:'uppercase'}}>{l}</div>
          </div>
        ))}
      </div>
    </div>
);
const w_roi = (()=>{
    const net20=Math.round(calc.year1Savings*((1.03**20-1)/0.03)-(calc.estimatedCostMin+calc.estimatedCostMax)/2);
    const pts=Array.from({length:10},(_,i)=>
      Math.round(calc.year1Savings*((1.03**(i+1)-1)/0.03)-(calc.estimatedCostMin+calc.estimatedCostMax)/2));
    const max=Math.max(...pts),min=Math.min(...pts,0),range=max-min||1;
    const W=240,H=60,pad=6;
    const coords=pts.map((v,i)=>({
      x:pad+(i/9)*(W-pad*2),
      y:H-pad-((v-min)/range)*(H-pad*2),
    }));
    const lineD=coords.map((p,i)=>`${i===0?'M':'L'}${p.x},${p.y}`).join(' ');
    const areaD=`M${pad},${H-pad} ${lineD.slice(1)} L${W-pad},${H-pad} Z`;
    const zeroY=H-pad-((0-min)/range)*(H-pad*2);
    return(
      <div className="tilt-card"
        draggable {...dragProps('roi')}
        onClick={drill('20-Year ROI','#ffb340',[
          {l:'Setup cost (est.)',v:'$'+Math.round((calc.estimatedCostMin+calc.estimatedCostMax)/2).toLocaleString(),c:'var(--ts)'},
          {l:'Year 1 savings',  v:'$'+calc.year1Savings.toLocaleString(),c:'#00e09a'},
          {l:'Payback period',  v:calc.paybackYears>0?calc.paybackYears+' yrs':'N/A',c:'#ffb340'},
          {l:'20-yr net (3%)',  v:'$'+net20.toLocaleString(),c:'#ffb340'},
        ],'3% annual compounding · $0.80/lb produce · $0.005/gal water')}
        style={{
          position:'relative',overflow:'hidden',borderRadius:20,padding:'20px 22px',
          gridColumn:'span 6',cursor:'pointer',
          background:'linear-gradient(135deg,rgba(255,179,64,0.07) 0%,rgba(12,30,20,0.80) 100%)',
          border:'1px solid rgba(255,179,64,0.16)',
          backdropFilter:'blur(20px)',
        }}>
        <div style={{position:'absolute',top:0,left:0,right:0,height:1,
          background:'linear-gradient(90deg,transparent,rgba(255,179,64,0.50),transparent)'}}/>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:12}}>
          <div>
            <div style={{fontSize:9,fontWeight:700,letterSpacing:'.14em',color:'rgba(255,179,64,0.65)',
              fontFamily:"'JetBrains Mono',monospace",textTransform:'uppercase',marginBottom:5}}>
              20-YR PROJECTION ↗
            </div>
            <div style={{fontSize:32,fontWeight:300,color:'#ffb340',
              fontFamily:"'Inter',sans-serif",lineHeight:1,
              textShadow:'0 0 20px rgba(255,179,64,0.50)'}}>
              ${net20>=1000?Math.round(net20/1000)+'k':net20.toLocaleString()}
            </div>
            <div style={{fontSize:10,color:'rgba(255,179,64,0.55)',
              fontFamily:"'JetBrains Mono',monospace",marginTop:4}}>
              payback {calc.paybackYears>0?calc.paybackYears+' yrs':'—'} · ${calc.year1Savings.toLocaleString()}/yr
            </div>
          </div>
          <span style={{fontSize:12,color:'var(--ts)',cursor:'grab',userSelect:'none'}}>⋮⋮</span>
        </div>
        <svg width={W} height={H} style={{overflow:'visible'}}>
          <defs>
            <linearGradient id="roig2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffb340" stopOpacity="0.28"/>
              <stop offset="100%" stopColor="#ffb340" stopOpacity="0.03"/>
            </linearGradient>
          </defs>
          <line x1={pad} y1={zeroY} x2={W-pad} y2={zeroY}
            stroke="rgba(255,255,255,0.08)" strokeWidth="1" strokeDasharray="3 4"/>
          <path d={areaD} fill="url(#roig2)"/>
          <path d={lineD} fill="none" stroke="#ffb340" strokeWidth="1.5"
            strokeLinecap="round" strokeLinejoin="round"
            style={{filter:'drop-shadow(0 0 4px rgba(255,179,64,0.65))'}}/>
          {coords.length>0&&<circle cx={coords[9].x} cy={coords[9].y} r="3"
            fill="#ffb340" style={{filter:'drop-shadow(0 0 5px rgba(255,179,64,0.90))'}}/>}
        </svg>
      </div>
    );
})();
const w_bio = (
    <div className="tilt-card"
      draggable {...dragProps('bio')}
      onClick={drill('Biodiversity','#c8ff64',[
        {l:'Score',      v:calc.biodiversityScore+'/100',c:'#c8ff64'},
        {l:'Bio features',v:String(allTiles.filter(t=>['🌼','🐝','🦇','🐛','🐦','🌺','🪷','🌴'].includes(t.icon)).length),c:'#c8ff64'},
        {l:'Food category',v:allTiles.filter(t=>ICON_LOOKUP.get(t.icon)?.category==='food').length+' items',c:'#00e09a'},
        {l:'Water category',v:allTiles.filter(t=>ICON_LOOKUP.get(t.icon)?.category==='water').length+' items',c:'#00e5ff'},
      ],'Each unique bio feature +16 pts · first bio category +20 pts bonus')}
      style={{
        position:'relative',overflow:isMobile?'visible':'hidden',borderRadius:20,padding:'20px 22px',
        gridColumn:isMobile?'span 1':'span 6',cursor:'pointer',
        background:'linear-gradient(135deg,rgba(200,255,100,0.06) 0%,rgba(12,30,20,0.80) 100%)',
        border:'1px solid rgba(200,255,100,0.14)',
        backdropFilter:'blur(20px)',
      }}>
      <div style={{position:'absolute',top:0,left:0,right:0,height:1,
        background:'linear-gradient(90deg,transparent,rgba(200,255,100,0.45),transparent)'}}/>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:12}}>
        <div style={{display:'flex',alignItems:'center',gap:14}}>
          <ScoreRing value={calc.biodiversityScore} max={100} color="#c8ff64" size={72} label="" sublabel="" animated/>
          <div>
            <div style={{fontSize:9,fontWeight:700,letterSpacing:'.14em',color:'rgba(200,255,100,0.60)',
              fontFamily:"'JetBrains Mono',monospace",textTransform:'uppercase',marginBottom:5}}>
              BIODIVERSITY ↗
            </div>
            <div style={{fontSize:30,fontWeight:300,color:'#c8ff64',lineHeight:1,
              fontFamily:"'Inter',sans-serif",
              textShadow:'0 0 20px rgba(200,255,100,0.45)'}}>
              {calc.biodiversityScore}<span style={{fontSize:14,opacity:.45}}>/100</span>
            </div>
            <div style={{fontSize:10,color:'rgba(200,255,100,0.55)',
              fontFamily:"'JetBrains Mono',monospace",marginTop:4}}>
              {calc.biodiversityScore>=60?'Thriving habitat':calc.biodiversityScore>=30?'Growing habitat':'Minimal habitat'}
            </div>
          </div>
        </div>
        <span style={{fontSize:12,color:'var(--ts)',cursor:'grab',userSelect:'none'}}>⋮⋮</span>
      </div>
      {/* Category spread bars */}
      {Object.entries(CAT_COLOR)
        .filter(([cat])=>allTiles.some((t:{id:number;icon:string})=>ICON_LOOKUP.get(t.icon)?.category===cat))
        .slice(0,5).map(([cat,c])=>{
          const cnt=allTiles.filter(t=>ICON_LOOKUP.get(t.icon)?.category===cat).length;
          const maxCnt=Math.max(1,...Object.keys(CAT_COLOR).map(k=>
            allTiles.filter(t=>ICON_LOOKUP.get(t.icon)?.category===k).length));
          return(
            <div key={cat} style={{marginBottom:5}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:2,
                fontSize:9,color:'var(--ts)',fontFamily:"'JetBrains Mono',monospace",letterSpacing:'.06em'}}>
                <span style={{textTransform:'uppercase'}}>{cat}</span>
                <span style={{color:c}}>{cnt}</span>
              </div>
              <div style={{height:2,borderRadius:99,background:'rgba(255,255,255,0.05)'}}>
                <div style={{height:'100%',borderRadius:99,background:c,
                  width:`${(cnt/maxCnt)*100}%`,
                  transition:'width 1.2s cubic-bezier(0.22,1,0.36,1)'}}/>
              </div>
            </div>
          );
        })}
    </div>
);
const WIDGET: Record<string,React.ReactNode> = {score:w_score, kpi:w_kpi, terrain:w_terrain, features:w_features, roi:w_roi, bio:w_bio};

return(
  <>
    {/* Mobile: simple stacked cards instead of bento */}
    {isMobile?(
      <div style={{display:'flex',flexDirection:'column',gap:12}}>

        {/* Card 1: Regen Score */}
        <div style={{borderRadius:16,padding:'16px',background:'linear-gradient(160deg,rgba(0,255,170,0.09),rgba(12,30,20,0.82))',border:'1px solid rgba(0,255,170,0.32)'}}>
          <div style={{fontSize:10,fontWeight:700,letterSpacing:'.12em',color:'rgba(0,255,170,0.65)',fontFamily:"'JetBrains Mono',monospace",textTransform:'uppercase',marginBottom:10}}>REGEN SCORE</div>
          <div style={{display:'flex',alignItems:'center',gap:14}}>
            <ScoreRing value={calc.resilienceScore} max={98} color="#00ffaa" size={72} label="" sublabel="" animated/>
            <div>
              <div style={{fontSize:32,fontWeight:300,color:'#00ffaa',lineHeight:1,fontFamily:"'Inter',sans-serif",textShadow:'0 0 20px rgba(0,255,170,0.55)'}}>{calc.resilienceScore}<span style={{fontSize:14,opacity:0.45}}>/98</span></div>
              <div style={{fontSize:10,color:'rgba(0,255,170,0.65)',fontFamily:"'JetBrains Mono',monospace",marginTop:5,letterSpacing:'.08em'}}>{calc.resilienceScore>=70?'SELF-SUSTAINING':calc.resilienceScore>=40?'DEVELOPING':'EARLY STAGE'}</div>
              <div style={{display:'flex',gap:10,marginTop:8}}>
                {[{l:'Food',v:calc.foodSelfSufficiencyPct,c:'#00e09a'},{l:'Water',v:calc.waterSavingsPct,c:'#00e5ff'},{l:'CO₂',v:Math.min(100,Math.round(calc.totalCo2Lbs/6)),c:'#c8ff64'}].map(({l,v,c})=>(
                  <div key={l} style={{textAlign:'center'}}>
                    <div style={{fontSize:13,fontWeight:700,color:c,fontFamily:"'JetBrains Mono',monospace"}}>{v}%</div>
                    <div style={{fontSize:8,color:'var(--ts)',letterSpacing:'.06em'}}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Key Metrics */}
        <div style={{borderRadius:16,padding:'16px',background:'linear-gradient(135deg,rgba(0,255,170,0.04),rgba(12,30,20,0.80))',border:'1px solid rgba(0,255,170,0.09)'}}>
          <div style={{fontSize:10,fontWeight:700,letterSpacing:'.12em',color:'rgba(0,255,170,0.50)',fontFamily:"'JetBrains Mono',monospace",textTransform:'uppercase',marginBottom:10}}>KEY METRICS</div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:8}}>
            {[
              {icon:'🌾',label:'Annual Yield',value:calc.totalYieldLbs.toLocaleString()+' lbs',c:'#00e09a'},
              {icon:'💧',label:'Water Saved',value:calc.totalWaterGal.toLocaleString()+' gal',c:'#00e5ff'},
              {icon:'💰',label:'Year 1 Savings',value:'$'+calc.year1Savings.toLocaleString(),c:'#00ffaa'},
              {icon:'🌿',label:'CO₂ Offset',value:calc.totalCo2Lbs.toLocaleString()+' lbs',c:'#c8ff64'},
            ].map(({icon,label,value,c})=>(
              <div key={label} style={{padding:'10px',borderRadius:12,background:`${c}08`,border:`1px solid ${c}18`}}>
                <div style={{display:'flex',alignItems:'center',gap:5,marginBottom:6}}>
                  <span style={{fontSize:14}}>{icon}</span>
                  <span style={{fontSize:8,fontWeight:700,color:`${c}80`,fontFamily:"'JetBrains Mono',monospace",textTransform:'uppercase',letterSpacing:'.06em'}}>{label}</span>
                </div>
                <div style={{fontSize:16,fontWeight:700,color:c,fontFamily:"'Inter',sans-serif",lineHeight:1}}>{value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Card 3: Terrain */}
        <div style={{borderRadius:16,overflow:'hidden',background:'linear-gradient(135deg,rgba(0,255,170,0.04),rgba(12,30,20,0.82))',border:'1px solid rgba(0,255,170,0.10)',height:220,position:'relative'}}>
          <div style={{position:'absolute',top:8,left:12,fontSize:9,fontWeight:700,letterSpacing:'.12em',color:'rgba(0,255,170,0.55)',fontFamily:"'JetBrains Mono',monospace",textTransform:'uppercase',zIndex:5}}>TERRAIN</div>
          <DashTerrain
            propTiles={(propBps[terrainPropIdx]??propBps[0])?.tiles??[]}
            gardTiles={(raisedBedBps[terrainGardIdx]??raisedBedBps[0])?.tiles??[]}
            mapView={terrainMap}
            propCols={(propBps[terrainPropIdx]??propBps[0])?.gridCols??6}
            gardCols={(raisedBedBps[terrainGardIdx]??raisedBedBps[0])?.gridCols??8}
            parallax={parallax}
            setModal={setModal}
            propBpId={(propBps[terrainPropIdx]??propBps[0])?.id??''}
            gardBpId={(raisedBedBps[terrainGardIdx]??raisedBedBps[0])?.id??''}
          />
        </div>

        {/* Card 4: Feature Inventory */}
        <div style={{borderRadius:16,padding:'0',background:'linear-gradient(135deg,rgba(0,255,170,0.04),rgba(12,30,20,0.80))',border:'1px solid rgba(0,255,170,0.09)'}}>
          <div style={{padding:'12px 14px 10px',borderBottom:'1px solid rgba(0,255,170,0.07)'}}>
            <span style={{fontSize:10,fontWeight:700,letterSpacing:'.12em',color:'rgba(0,255,170,0.60)',fontFamily:"'JetBrains Mono',monospace",textTransform:'uppercase'}}>INVENTORY</span>
          </div>
          <div style={{padding:'8px 10px',display:'flex',flexDirection:'column',gap:4}}>
            {calc.featureBreakdown.slice(0,8).map((f:any)=>{
              const lib=ICON_LOOKUP.get(f.emoji);
              const c=(lib&&CAT_COLOR[lib.category])||'#00ffaa';
              return(
                <div key={f.emoji} style={{display:'flex',alignItems:'center',gap:8,padding:'6px 8px',borderRadius:8,background:'rgba(0,255,170,0.02)',border:'1px solid rgba(0,255,170,0.05)'}}>
                  <FeatureIcon emoji={f.emoji} size={16}/>
                  <span style={{flex:1,fontSize:12,color:'var(--td)',fontFamily:"'Inter',sans-serif",fontWeight:500}}>{f.name}{f.count>1&&<span style={{opacity:0.5,fontSize:10}}> ×{f.count}</span>}</span>
                  <span style={{fontSize:11,color:c,fontFamily:"'JetBrains Mono',monospace",fontWeight:600}}>{f.yieldLbs*f.count>0?f.yieldLbs*f.count+' lbs':f.waterGal*f.count>0?f.waterGal*f.count+' gal':f.co2*f.count+' lbs CO₂'}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Card 5: ROI */}
        <div style={{borderRadius:16,padding:'16px',background:'linear-gradient(135deg,rgba(255,179,64,0.07),rgba(12,30,20,0.80))',border:'1px solid rgba(255,179,64,0.16)'}}>
          <div style={{fontSize:10,fontWeight:700,letterSpacing:'.12em',color:'rgba(255,179,64,0.65)',fontFamily:"'JetBrains Mono',monospace",textTransform:'uppercase',marginBottom:10}}>20-YR PROJECTION</div>
          {(()=>{
            const net20=Math.round(calc.year1Savings*((1.03**20-1)/0.03)-(calc.estimatedCostMin+calc.estimatedCostMax)/2);
            return(
              <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:8}}>
                {[
                  {l:'Setup',v:'$'+Math.round((calc.estimatedCostMin+calc.estimatedCostMax)/2).toLocaleString(),c:'var(--ts)'},
                  {l:'Yr 1 Return',v:'$'+calc.year1Savings.toLocaleString(),c:'#00e09a'},
                  {l:'20-yr Net',v:'$'+(net20>=0?net20:0).toLocaleString(),c:'#ffb340'},
                ].map(({l,v,c})=>(
                  <div key={l} style={{textAlign:'center',padding:'10px 6px',borderRadius:10,background:'rgba(255,179,64,0.05)',border:'1px solid rgba(255,179,64,0.10)'}}>
                    <div style={{fontSize:14,fontWeight:700,color:c,fontFamily:"'Inter',sans-serif"}}>{v}</div>
                    <div style={{fontSize:8,color:'var(--ts)',fontFamily:"'JetBrains Mono',monospace",letterSpacing:'.06em',marginTop:3}}>{l}</div>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>

        {/* Card 6: Biodiversity */}
        <div style={{borderRadius:16,padding:'16px',background:'linear-gradient(135deg,rgba(200,255,100,0.06),rgba(12,30,20,0.80))',border:'1px solid rgba(200,255,100,0.14)'}}>
          <div style={{display:'flex',alignItems:'center',gap:12}}>
            <ScoreRing value={calc.biodiversityScore} max={100} color="#c8ff64" size={64} label="" sublabel="" animated/>
            <div>
              <div style={{fontSize:10,fontWeight:700,letterSpacing:'.12em',color:'rgba(200,255,100,0.60)',fontFamily:"'JetBrains Mono',monospace",textTransform:'uppercase',marginBottom:4}}>BIODIVERSITY</div>
              <div style={{fontSize:28,fontWeight:300,color:'#c8ff64',fontFamily:"'Inter',sans-serif",lineHeight:1}}>{calc.biodiversityScore}<span style={{fontSize:12,opacity:0.45}}>/100</span></div>
              <div style={{fontSize:10,color:'rgba(200,255,100,0.55)',fontFamily:"'JetBrains Mono',monospace",marginTop:4}}>{calc.biodiversityScore>=60?'Thriving':calc.biodiversityScore>=30?'Growing':'Minimal'}</div>
            </div>
          </div>
        </div>

      </div>
    ):(
    <>
    {/* Drag hint */}

    <div style={{display:'flex',alignItems:'center',justifyContent:'flex-end',
      gap:8,marginBottom:2}}>
      <span style={{fontSize:10,color:'var(--ts)',fontFamily:"'JetBrains Mono',monospace",
        letterSpacing:'.06em'}}>⋮⋮ drag any widget to rearrange</span>
    </div>
    {/* Drag CSS injected inline so it applies to bento widgets */}
    <style>{`
      [data-widget]:active{cursor:grabbing}
      [data-widget][data-dragging=true]{opacity:.50;outline:2px dashed rgba(0,255,170,0.50);outline-offset:2px}
    `}</style>
    {/* 12-column bento grid */}
    <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'repeat(12,1fr)',gap:12}}>
        {wOrder.map(id=>{const Wfn=WIDGET[id as keyof typeof WIDGET];return Wfn?<div key={id} style={{display:'contents'}}>{Wfn}</div>:null;})}
    </div>
    </>
    )}
    {drillInfo&&<DashDrill info={drillInfo} onClose={()=>setDrillInfo(null)}/>}
  </>
);
}

const ADMIN_EMAILS = ['compassavail@gmail.com'];
const ZERO_CALC:CalcResult={
  totalYieldLbs:0,totalWaterGal:0,totalCo2Lbs:0,
  foodSelfSufficiencyPct:0,waterSavingsPct:0,
  estimatedCostMin:0,estimatedCostMax:0,
  resilienceScore:0,biodiversityScore:0,
  year1Savings:0,paybackYears:0,
  foodSavings:0,featureBreakdown:[],
};
export default function TerraForgeHome(){
  const[mounted,    setMounted]    = useState(false);
  // Check login state from localStorage (client-side only)
  const [supaUser, setSupaUser] = useState<any>(null);
  const [supaSession, setSupaSession] = useState<any>(null);
  useEffect(()=>{
    supabase.auth.getSession().then(({data:{session}})=>{setSupaUser(session?.user??null);setSupaSession(session);});
    const{data:{subscription}}=supabase.auth.onAuthStateChange((_,session)=>{setSupaUser(session?.user??null);setSupaSession(session);});
    return()=>subscription.unsubscribe();
  },[]);
  const isLoggedIn = mounted && !!supaUser;
  const[apiBlueprint,setApiBlueprint]=useState<any>(null);
  const[isMobile,   setIsMobile]   = useState(false);
  const[loading,    setLoading]    = useState(false);
  const[useAI,      setUseAI]      = useState(false); // true=AI generation, false=base calculation
  const[addMode,    setAddMode]    = useState(false); // true=add to existing blueprint, false=fresh generation
  const[activeTab,  setActiveTab]  = useState<TabId>('dashboard');
  const[formOpen,   setFormOpen]   = useState(false);
  const activeEmail = supaUser?.email ?? undefined;
  const { plan, loading: planLoading } = usePlan(activeEmail);
  const activeProfile = supaUser ? { email: supaUser.email, name: supaUser.user_metadata?.name } : null;
  // While plan is fetching and user is logged in, assume pro to prevent flash of locked content
  const isPro = (isLoggedIn && planLoading) || plan === 'pro' || (!!supaUser?.email && ADMIN_EMAILS.includes(supaUser.email.toLowerCase()));
  const [paywallFeature, setPaywallFeature] = useState<string|null>(null);
  const [pdfExportCount, setPdfExportCount] = useState(0);
  const [showShoppingList, setShowShoppingList] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const [isSharedView, setIsSharedView] = useState(false);
  const [shareToast, setShareToast] = useState<string|null>(null);
  const [budgetWarned, setBudgetWarned] = useState(false);
  const [showHowTo, setShowHowTo] = useState(false);
  const [propertyAddress, setPropertyAddress] = useState('');
  const [visualising, setVisualising] = useState(false);
  const [visualSvg, setVisualSvg] = useState<string|null>(null);
  const [visualError, setVisualError] = useState('');
  const [propertyAnalysing, setPropertyAnalysing] = useState(false);
  const [propertyData, setPropertyData] = useState<{address:string;lat:number;lng:number;satelliteUrl:string;analysis:any}|null>(null);
  const [propertyError, setPropertyError] = useState('');
  const [pendingBudgetAdd, setPendingBudgetAdd] = useState<string|null>(null);

  // Analytics event helper — fires to GA4 (gtag loaded in layout.tsx)
  const trackEvent = (name: string, params?: Record<string, any>) => {
    try { if (typeof window !== 'undefined' && (window as any).gtag) (window as any).gtag('event', name, params || {}); } catch {}
  };

  // Direct upgrade - goes straight to checkout or login
  const [upgradePlan, setUpgradePlan] = useState<'monthly'|'annual'>('annual');
  const handleDirectUpgrade = (plan:'monthly'|'annual'='annual') => {
    trackEvent('upgrade_click', { source: 'direct_button', plan, logged_in: isLoggedIn });
    setUpgradePlan(plan);
    if (!isLoggedIn) { setShowLogin(true); return; }
    setPaywallFeature('TerraForge Pro');
  };

  // Single gate function: shows login if not logged in, paywall if not Pro
  const requirePro = (feature: string): boolean => {
    if (!isLoggedIn) { trackEvent('paywall_login_required', { feature }); setShowLogin(true); return false; }
    if (!isPro) { trackEvent('paywall_view', { feature }); setPaywallFeature(feature); return false; }
    return true;
  };
  const[iconFilter, setIconFilter] = useState('all');
  const[showLogin,  setShowLogin]  = useState(false);
  const[mapSubTab,  setMapSubTab]  = useState<'property'|'raised-bed'>('property');
  const[propIdx,    setPropIdx]    = useState(0);
  const[gardIdx,    setGardIdx]    = useState(0); // kept for legacy save compat
  const[rbIdx,      setRbIdx]      = useState(0); // active raised-bed index

  const[blueprints, setBlueprints] = useState<Blueprint[]>(()=>syncRaisedBedsToPropertyTiles(DEFAULT_BLUEPRINTS));
  const[draggingId, setDraggingId] = useState<string|null>(null);
  const lastMouse=useRef({x:0,y:0});

  // Dashboard state
  const[drillInfo,  setDrillInfo]  = useState<{title:string;color:string;rows:{l:string;v:string;c:string}[];note?:string}|null>(null);
  const[parallax,   setParallax]   = useState({x:0,y:0});
  const[terrainMap, setTerrainMap] = useState<'property'|'raised-bed'>('property');
  const[terrainPropIdx, setTerrainPropIdx] = useState(0);
  const[terrainGardIdx, setTerrainGardIdx] = useState(0);
  const[terrainDropdown, setTerrainDropdown] = useState<'property'|'raised-bed'|null>(null);
  const[wOrder, setWOrder] = useState(['score','kpi','terrain','features','roi','bio']);
  const[wDragSrc, setWDragSrc] = useState<string|null>(null);

  // Cursor parallax + card tilt
  useEffect(()=>{
    let frame=0;
    const onMove=(e:MouseEvent)=>{
      // Tilt cards every frame (direct DOM, no state)
      const cards=document.querySelectorAll<HTMLElement>('.tilt-card');
      cards.forEach(card=>{
        const r=card.getBoundingClientRect();
        if(!r.width)return;
        const cx=r.left+r.width/2, cy=r.top+r.height/2;
        const dx=(e.clientX-cx)/r.width, dy=(e.clientY-cy)/r.height;
        if(Math.sqrt(dx*dx+dy*dy)<0.9){
          card.style.transform=`perspective(800px) rotateX(${-dy*10}deg) rotateY(${dx*10}deg) translateZ(4px)`;
          card.style.boxShadow=`${-dx*2*10}px ${-dy*2*10}px 40px rgba(0,255,170,0.10)`;
        }else{card.style.transform='';card.style.boxShadow='';}
      });
      // Throttle parallax state — only every 2 frames (React re-render)
      frame++;
      if(frame%2!==0)return;
      const vw=window.innerWidth, vh=window.innerHeight;
      setParallax({x:(e.clientX/vw-0.5)*2, y:(e.clientY/vh-0.5)*2});
    };
    window.addEventListener('mousemove',onMove,{passive:true});
    return()=>window.removeEventListener('mousemove',onMove);
  },[]);

  const[modal,      setModal]      = useState<{emoji:string;bpId:string;tileId:number}|null>(null);
  const[renamingId, setRenamingId] = useState<string|null>(null);
  const[renameVal,  setRenameVal]  = useState('');

  const{register,handleSubmit,formState:{errors},setValue,watch,reset}=useForm<FormData,any,FormData>({
  resolver: zodResolver(formSchema) as Resolver<FormData>,
  mode:'onBlur',
    defaultValues:{yardSqFt:10000,familySize:4,climateZone:'Temperate',budget:2800,prompt:''},
  });
  const fv=watch();

  /* Detect mobile */
  useEffect(()=>{
    const check=()=>setIsMobile(window.innerWidth<=768);
    check();
    window.addEventListener('resize',check);
    return()=>window.removeEventListener('resize',check);
  },[]);

  /* Client hydration */
  useEffect(()=>{
    setMounted(true);
    // Show onboarding for first-time users
    try{const seen=localStorage.getItem('tf-onboarded');if(!seen)setShowOnboarding(true);}catch{setShowOnboarding(true);}
    // Handle ?cancelled=1 from Stripe cancel redirect
    if(typeof window!=='undefined'&&window.location.search.includes('cancelled=1')){
      const t=document.createElement('div');
      t.style.cssText='position:fixed;top:20px;left:50%;transform:translateX(-50%);background:#0d2418;color:#fbbf24;border:1px solid rgba(251,191,36,0.35);border-radius:12px;padding:12px 24px;font-size:13px;font-weight:600;z-index:99999;pointer-events:none;';
      t.textContent='Checkout cancelled — your plan has not changed.';
      document.body.appendChild(t);setTimeout(()=>t.remove(),4000);
      window.history.replaceState({},'',window.location.pathname);
    }
    // Handle ?share= blueprint link
    if(typeof window!=='undefined'){
      const shareParam=new URLSearchParams(window.location.search).get('share');
      if(shareParam){
        try{
          const decoded=JSON.parse(decodeURIComponent(atob(shareParam)));
          if(decoded.zone)setValue('climateZone',decoded.zone);
          if(decoded.sqft)setValue('yardSqFt',decoded.sqft);
          if(decoded.family)setValue('familySize',decoded.family);
          if(decoded.budget)setValue('budget',decoded.budget);
          if(decoded.bps&&Array.isArray(decoded.bps)&&decoded.bps.length>0){
            const sharedBps:Blueprint[]=decoded.bps.map((b:any)=>({
              id:b.id??'tf-prop-1',name:b.name??'Shared Property',type:b.type??'property',
              tiles:b.tiles??[],gridCols:b.gridCols??6,gridCount:b.gridCount??36,
              rotation:b.rotation??{x:-22,y:28},notes:'',
            }));
            setBlueprints(sharedBps);
            setIsSharedView(true);
            trackEvent('shared_blueprint_view',{ score:decoded.score });
          }
          window.history.replaceState({},'',window.location.pathname);
          // Show shared blueprint toast
          const t=document.createElement('div');
          t.style.cssText='position:fixed;top:20px;left:50%;transform:translateX(-50%);background:#0d2418;color:#00ffaa;border:1px solid rgba(0,255,170,0.35);border-radius:12px;padding:12px 24px;font-size:13px;font-weight:600;z-index:99999;pointer-events:none;';
          t.textContent='Viewing a shared homestead — tap "Make Your Own" to start designing.';
          document.body.appendChild(t);setTimeout(()=>t.remove(),5000);
          return;
        }catch{}
      }
    }
    const saved=loadSaved();
    if(!saved){
      // First-time visitor — show a populated demo so they see the magic immediately
      try{
        const demoSeen=localStorage.getItem('tf-demo-dismissed');
        if(!demoSeen){
          setBlueprints(JSON.parse(JSON.stringify(DEMO_BLUEPRINTS)));
          setShowDemo(true);
        }
      }catch{}
      return;
    }
    if(saved.apiBlueprint){setApiBlueprint(saved.apiBlueprint);setFormOpen(true);}
    if(saved.blueprints?.length>0){
      let bps:Blueprint[]=saved.blueprints.map((b:any)=>({
        ...b,
        tiles:    b.tiles??[],
        gridCols: b.gridCols??(b.type==='property'?6:b.type==='raised-bed'?8:4),
        gridCount:b.gridCount??(b.type==='property'?36:b.type==='raised-bed'?32:16),
        rotation: b.rotation??{x:-22,y:28},
        notes:    b.notes??'',
      }));
      // Guarantee at least one property blueprint
      if(!bps.some((b:Blueprint)=>b.type==='property')) bps=[{...DEFAULT_PROP_BP},...bps];

      // Migrate legacy 'garden' blueprints
      const legacyGardenBps=bps.filter(b=>b.type==='garden');
      if(legacyGardenBps.length>0){
        const propBp=bps.find(b=>b.type==='property')!;
        legacyGardenBps.forEach((garden,gi)=>{
          // If property map doesn't already have a 🌱 tile for this garden index, add one
          const bedSlots=propBp.tiles.filter(t=>t.icon==='🌱').map(t=>t.id);
          if(bedSlots[gi]===undefined){
            const usedSlots=new Set(propBp.tiles.map(t=>t.id));
            let slot=0; while(usedSlots.has(slot)&&slot<propBp.gridCount)slot++;
            if(slot<propBp.gridCount){
              propBp.tiles=[...propBp.tiles,{id:slot,icon:'🌱'}];
            }
          }
        });
        bps=bps.map(b=>b.id===propBp.id?propBp:b);
        // Remove legacy garden bps - their tiles will be in raised beds after sync
        bps=bps.filter(b=>b.type!=='garden');
        // Sync to create raised-bed bps for every 🌱 on property map
        bps=syncRaisedBedsToPropertyTiles(bps);
        // Restore garden tile content into the first matching raised bed
        legacyGardenBps.forEach((garden,gi)=>{
          const bed=bps.filter(b=>b.type==='raised-bed')[gi];
          if(bed&&garden.tiles.length>0){
            // Put legacy garden tiles into the bed (fit within 3x3=9 slots)
            const rescuedTiles=garden.tiles.slice(0,9).map((t:any,i:number)=>({id:i,icon:t.icon}));
            bps=bps.map(b=>b.id===bed.id?{...b,tiles:rescuedTiles}:b);
          }
        });
      } else {
        // No garden bps - just filter them out and sync normally
        bps=bps.filter(b=>b.type!=='garden');
      }

      // Renumber property blueprints with default names
      let pC=0;
      bps=bps.map((b:Blueprint)=>{
        if(b.type==='property'){pC++;const isDefault=/^Property Map \d+$/.test(b.name);return isDefault?{...b,name:`Property Map ${pC}`}:b;}
        return b;
      });
      // Re-sync raised beds to match 🌱 tiles on property maps
      bps=syncRaisedBedsToPropertyTiles(bps);
      setBlueprints(bps);
      const propBpsLen=bps.filter((b:Blueprint)=>b.type==='property').length;
      const rbLen=bps.filter((b:Blueprint)=>b.type==='raised-bed').length;
      setPropIdx(Math.min(saved.propIdx??0, Math.max(0,propBpsLen-1)));
      setRbIdx(Math.min(saved.gardIdx??0, Math.max(0,rbLen-1)));
    }
    if(saved.formValues)reset(saved.formValues);
    if(saved.wOrder&&Array.isArray(saved.wOrder)&&saved.wOrder.length>0)setWOrder(saved.wOrder);
    // Open form panel for returning users so they land in an active state
    setFormOpen(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  /* Raised-bed sync — runs whenever property map tiles change.
     Ensures raised-bed blueprints always mirror 🌱 tiles on all property maps. */
  

  /* Reset state when user logs out — only after mount to avoid nuking saved data */
  const prevLoggedInRef=useRef<boolean|null>(null);
  useEffect(()=>{
    if(!mounted)return;
    if(prevLoggedInRef.current===true&&!supaUser){
      setBlueprints(RESET_BLUEPRINTS);
      setApiBlueprint(null);
      reset({yardSqFt:10000,familySize:4,climateZone:'Temperate',budget:2800,prompt:''});
    }
    prevLoggedInRef.current=isLoggedIn;
  },[supaUser,mounted]);

  /* Debounced save */
  const saveTimer=useRef<ReturnType<typeof setTimeout>|null>(null);
  useEffect(()=>{
    if(saveTimer.current)clearTimeout(saveTimer.current);
    saveTimer.current=setTimeout(()=>{try{localStorage.setItem(STORAGE_KEY,JSON.stringify({apiBlueprint,blueprints,propIdx,gardIdx,formValues:fv,wOrder}));}catch{}},700);
    return()=>{if(saveTimer.current)clearTimeout(saveTimer.current);};
  },[apiBlueprint,blueprints,propIdx,gardIdx,fv,wOrder]);

  /* 3D orbit — React-controlled rotation, no direct DOM writes */
  const liveRotRef = useRef({x:-22,y:28});
  const [liveRot, setLiveRot] = useState<{id:string;x:number;y:number}|null>(null);
  useEffect(()=>{
    if(!draggingId)return;
    const bp=blueprints.find((b:Blueprint)=>b.id===draggingId);
    if(bp)liveRotRef.current={x:bp.rotation.x,y:bp.rotation.y};

    const move=(clientX:number,clientY:number)=>{
      const dx=clientX-lastMouse.current.x,dy=clientY-lastMouse.current.y;
      lastMouse.current={x:clientX,y:clientY};
      liveRotRef.current={
        x:Math.max(-65,Math.min(65,liveRotRef.current.x-dy*0.50)),
        y:liveRotRef.current.y+dx*0.50,
      };
      setLiveRot({id:draggingId,x:liveRotRef.current.x,y:liveRotRef.current.y});
    };

    const onMouseMove=(e:MouseEvent)=>move(e.clientX,e.clientY);
    const onTouchMove=(e:TouchEvent)=>{
      if(e.touches.length!==1)return;
      e.preventDefault();
      move(e.touches[0].clientX,e.touches[0].clientY);
    };
    const up=()=>{
      if(!draggingId){setDraggingId(null);setLiveRot(null);return;}
      setBlueprints((prev:Blueprint[])=>prev.map((b:Blueprint)=>b.id!==draggingId?b:{...b,rotation:{...liveRotRef.current}}));
      setDraggingId(null);
      setLiveRot(null);
    };

    window.addEventListener('mousemove',onMouseMove,{passive:true});
    window.addEventListener('mouseup',up);
    window.addEventListener('touchmove',onTouchMove,{passive:false});
    window.addEventListener('touchend',up);
    return()=>{
      window.removeEventListener('mousemove',onMouseMove);
      window.removeEventListener('mouseup',up);
      window.removeEventListener('touchmove',onTouchMove);
      window.removeEventListener('touchend',up);
    };
  },[draggingId]);

  /* Generate */
  const onGenerate=async(data:FormData)=>{
    trackEvent('blueprint_generate', { mode: useAI?'ai':'base', add_mode: addMode, climate: data.climateZone });
    // Clear the demo state — user is making their own now
    if(showDemo){setShowDemo(false);try{localStorage.setItem('tf-demo-dismissed','1');}catch{}}
    // Guard: addMode + AI requires a prompt — otherwise Claude has nothing to add
    if(addMode&&useAI&&!(data.prompt??'').trim()){
      const t=document.createElement('div');
      t.style.cssText='position:fixed;bottom:32px;left:50%;transform:translateX(-50%);background:#0a0e1a;color:#fbbf24;border:1px solid rgba(251,191,36,0.35);border-radius:12px;padding:12px 24px;font-size:13px;font-weight:600;z-index:99999;pointer-events:none;';
      t.textContent='Please describe what you want to add to your blueprint.';
      document.body.appendChild(t);setTimeout(()=>t.remove(),3500);
      return;
    }
    setLoading(true);setActiveTab('dashboard');
    setBudgetWarned(false); // reset budget warning for new blueprint
    const _rawEmojis=extractEmojisFromPrompt(data.prompt??'');
    // Specific trees named in prompt
    const TREE_SET=new Set(['🍎','🍋','🍑','🍐','🥭','🍌','🍄','🫚','🍊','🍒','🫀','🥑','🍍']);
    const specificTrees=_rawEmojis.filter((em:string)=>TREE_SET.has(em));
    const genericTreeCount=_rawEmojis.filter((em:string)=>em==='🌳').length;
    // How many generic trees still needed after specific ones are counted
    const extraTrees=Math.max(0, genericTreeCount - specificTrees.length);
    // Climate fallback tree for remaining generic slots
    const climTree=(z:string)=>z==='Subtropical'?'🍌':z==='Arid'?'🍋':z==='Cold'?'🍐':'🍎';
    // Build final emoji list: remove 🌳, keep specific trees, add only extra generic trees
    // Use variety for extras: cycle through different trees not already placed
    const allTrees=['🍎','🍐','🍋','🍑','🍌','🥭','🍄','🫚','🍊','🍒'];
    const usedTrees=new Set(specificTrees);
    const extraTreeEmojis:string[]=[];
    for(const t of allTrees){
      if(extraTreeEmojis.length>=extraTrees)break;
      if(!usedTrees.has(t)){extraTreeEmojis.push(t);usedTrees.add(t);}
    }
    // If still need more, fall back to climate tree
    while(extraTreeEmojis.length<extraTrees)extraTreeEmojis.push(climTree(data.climateZone));
    const _allPromptEmojis=[
      ..._rawEmojis.filter((em:string)=>em!=='🌳'&&!TREE_SET.has(em)), // non-tree emojis
      ...specificTrees,   // explicitly named trees
      ...extraTreeEmojis, // remaining generic tree slots filled with variety
    ];
    // Smart bed inference: 'raised beds' plural + N crops mentioned = N beds
    const _bedCnt=_allPromptEmojis.filter((em:string)=>em==='🌱').length;
    const _cropCnt=new Set(_allPromptEmojis.filter((em:string)=>!['💧','☀️','♻️','🐔','🌊','🏡','🐝','🌼','🌬️','🐟','🦇','🐛','🐦','🔋','⚡','🌲','🌴','🪱','🦆','🐐','🐖','🐇','🪣','🌧️','🌾','🍂','🪟','🪷','🍎','🍋','🥭','🥑','🍌','🍐','🍑','🍄','🫚','🌱','🌳'].includes(em))).size;
    const _pL=(data.prompt||'').toLowerCase();
    if(/raised beds/.test(_pL)&&!/\d+\s*raised|one raised|a raised|two raised|three raised/.test(_pL)&&_bedCnt===1&&_cropCnt>1){
      for(let i=0;i<_cropCnt-1;i++)_allPromptEmojis.push('🌱');
    }
    const promptEmojis=[..._allPromptEmojis];
    try{
    let updatedBlueprints = blueprints;

    if(promptEmojis.length>0){
      // In addMode, keep existing tiles — only add new ones
      // In fresh mode, clear all tiles first
      if(!addMode){
        updatedBlueprints = blueprints.map((bp:Blueprint)=>({...bp,tiles:[]}));
      }

      // place: addMode replaces-by-type then adds; fresh mode clears all
      const place=(bp:Blueprint,ems:string[])=>{
        let baseTiles:Blueprint['tiles']=addMode?[...bp.tiles]:[];
        if(addMode&&ems.length>0){
          // Remove existing tiles of the same types being placed
          // so "5 compost bins" replaces the existing 1 rather than stacking
          const newTypes=new Set(ems);
          baseTiles=baseTiles.filter((t:{id:number;icon:string})=>!newTypes.has(t.icon));
        }
        const tiles=[...baseTiles];
        const used=new Set<number>(tiles.map((t:{id:number;icon:string})=>t.id));
        // Shuffle only the emoji order so each bed gets a different variety mix,
        // but place into sequential slots so plants stay packed together cleanly
        const shuffledEms=[...ems];
        for(let i=shuffledEms.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[shuffledEms[i],shuffledEms[j]]=[shuffledEms[j],shuffledEms[i]];}
        shuffledEms.forEach(em=>{
          let slot=0;while(used.has(slot)&&slot<bp.gridCount)slot++;
          if(slot<bp.gridCount){tiles.push({id:slot,icon:em});used.add(slot);}
        });
        return{...bp,tiles};
      };
      const propBp=updatedBlueprints.find((b:Blueprint)=>b.type==='property')??updatedBlueprints[0];
      const flowerInBeds=/(flower|bloom|pollinator|wildflower).*bed|bed.*(flower|bloom|pollinator|wildflower)/i.test(data.prompt||'');
      const PROP_ONLY=['💧','☀️','♻️','🐔','🌳','🌊','🏡','🐝','🌬️','🐟','🦇','🐛','🐦','🔋','⚡','🌲','🌴','🪱','🦆','🐐','🐖','🐇','🪣','🌧️','🌾','🍂','🪟','🪷','🍎','🍋','🥭','🥑','🍌','🍐','🍑','🍄','🫚','🌱',...(flowerInBeds?[]:['🌼'])];
      const propEm=promptEmojis.filter(em=>PROP_ONLY.includes(em));
      // Crop/plant emojis (non-property) go into raised beds — distributed evenly
      const bedEm=promptEmojis.filter(em=>!propEm.includes(em));
      // Place property-level emojis (including 🌱) on the property map
      updatedBlueprints=updatedBlueprints.map((bp:Blueprint)=>{
        if(bp.id===propBp.id)return place(bp,propEm);
        return bp;
      });
      // Sync raised beds now that 🌱 tiles are placed
      updatedBlueprints=syncRaisedBedsToPropertyTiles(updatedBlueprints);
      // Distribute bed emojis — supports per-group assignment
      // e.g. "green crops in 2 beds, flowers in the other 2"
      const beds=updatedBlueprints.filter((b:Blueprint)=>b.type==='raised-bed');
      if(beds.length>0&&bedEm.length>0){
        const promptLower=(data.prompt||'').toLowerCase();
        const fillMatch=promptLower.match(/(\d+)\s*%\s*(full|fill|filled|planted|covered)/);
        const halfMatch=/(half\s*(full|fill|filled|planted)|50\s*%)/.test(promptLower);
        const fillPct=fillMatch?Math.min(100,parseInt(fillMatch[1])):halfMatch?50:null;

        // Detect per-group bed patterns: "X in N beds, Y in M beds" or "X in two beds and Y in the other two"
        // Group beds by content type if multiple content types mentioned
        const FLOWER_EMOJIS=new Set(['🌼','💙','🌸','💜','🌞','🌹','🧡','🟠','🌷','🌈','🌟','✿','🌺','💐']);
        const GREEN_EMOJIS=new Set(['🥬','🌿','🫛','🍃','🥦','🥗','🍀']);
        // Default variety pools — used when only 1 emoji of a type is extracted
        const FLOWER_VARIETY=['🌼','💙','🌸','💜','🌞','🌹','🧡','🌷','🌟'];
        const GREEN_VARIETY=['🥬','🥦','🫛','🌿','🍃','🥗','🍀','🧄','🥕'];
        const flowerEmsRaw=bedEm.filter((e:string)=>FLOWER_EMOJIS.has(e));
        const greenEmsRaw=bedEm.filter((e:string)=>GREEN_EMOJIS.has(e));
        const otherEms=bedEm.filter((e:string)=>!FLOWER_EMOJIS.has(e)&&!GREEN_EMOJIS.has(e));
        // Also detect by keyword in prompt in case emoji didn't reach bedEm
        const flowerKw=/(flower|bloom|wildflower|pollinator)/.test(promptLower);
        const greenKw=/(green.crop|leafy|salad.crop|vegetable)/.test(promptLower);
        // Expand to full variety pool if emoji or keyword detected
        const flowerEms=(flowerEmsRaw.length>0||flowerKw)?FLOWER_VARIETY:[];
        const greenEms=(greenEmsRaw.length>0||greenKw)?GREEN_VARIETY:[];

        // Check for explicit group patterns in prompt
        // "flowers in N beds" or "N beds with flowers" etc
        const flowerBedMatch=promptLower.match(/(?:flowers?|blooms?|flowering)\s+in\s+(?:the\s+)?(?:other\s+)?(\w+)\s+(?:of\s+the\s+)?(?:garden\s+)?beds?|(?:(\w+)\s+(?:garden\s+)?beds?\s+(?:with|of)\s+flowers?)|(?:flowers?|blooms?)\s+in\s+the\s+other\s+(\w+)|the\s+other\s+(\w+)\s+(?:garden\s+)?beds?\s+(?:with\s+)?(?:flowers?|blooms?)|(\w+)\s+(?:garden\s+)?beds?\s+(?:with\s+)?flowers?/);
        const greenBedMatch=promptLower.match(/(?:green\s+crops?|greens?|leafy)\s+in\s+(?:the\s+)?(?:other\s+)?(\w+)\s+(?:of\s+the\s+)?(?:garden\s+)?beds?|(?:(\w+)\s+(?:garden\s+)?beds?\s+(?:with|of)\s+(?:green\s+crops?|greens?))|green\s+crops?\s+in\s+(?:the\s+)?(?:other\s+)?(\w+)\s+(?:garden\s+)?beds?/);


        const WORD_TO_NUM:Record<string,number>={'one':1,'two':2,'three':3,'four':4,'five':5,'six':6,'the other':0,'other':0,'remaining':0,'rest':0};

        let groups:{emojis:string[];bedCount:number}[]=[];

        if((flowerEms.length>0||greenEms.length>0)&&(flowerBedMatch||greenBedMatch)&&beds.length>1){
          // Parse how many beds each group gets
          const getN=(match:RegExpMatchArray|null)=>{
            const w=match?.[1]||match?.[2]||match?.[3]||match?.[4]||match?.[5]||'';
            return (WORD_TO_NUM[w.toLowerCase()]??parseInt(w))||0;
          };
          const flowerN=getN(flowerBedMatch);
          const greenN=getN(greenBedMatch);

          if(flowerN>0&&greenN>0){
            groups=[
              {emojis:greenEms.length>0?greenEms:otherEms,bedCount:greenN},
              {emojis:flowerEms,bedCount:flowerN},
            ];
          } else if(flowerN>0&&flowerEms.length>0){
            const remaining=beds.length-flowerN;
            groups=[
              {emojis:greenEms.length>0?greenEms:otherEms.length>0?otherEms:bedEm.filter((e:string)=>!FLOWER_EMOJIS.has(e)),bedCount:Math.max(1,remaining)},
              {emojis:flowerEms,bedCount:flowerN},
            ];
          } else if(greenN>0&&greenEms.length>0){
            const remaining=beds.length-greenN;
            groups=[
              {emojis:greenEms,bedCount:greenN},
              {emojis:flowerEms.length>0?flowerEms:otherEms,bedCount:Math.max(1,remaining)},
            ];
          }
        }

        if(groups.length>0){
          // Assign bed groups
          let bedIdx=0;
          const defaultSlots=Math.max(4,Math.round(beds[0].gridCount*0.25)); // default quarter-fill
          groups.forEach(({emojis,bedCount})=>{
            if(emojis.length===0)return;
            const slotsPerBed=fillPct?Math.max(1,Math.round((beds[0].gridCount*fillPct)/100)):defaultSlots;
            for(let i=0;i<bedCount&&bedIdx<beds.length;i++,bedIdx++){
              const bed=beds[bedIdx];
              const expanded:string[]=[];
              for(let j=0;j<slotsPerBed;j++)expanded.push(emojis[j%emojis.length]);
              updatedBlueprints=updatedBlueprints.map((b:Blueprint)=>b.id===bed.id?place(b,expanded):b);
            }
          });
          // Any remaining beds get the first group's emojis
          for(;bedIdx<beds.length;bedIdx++){
            const bed=beds[bedIdx];
            const em=groups[0].emojis;
            const slotsPerBed=fillPct?Math.max(1,Math.round((beds[0].gridCount*fillPct)/100)):defaultSlots;
            const expanded:string[]=[];
            for(let j=0;j<slotsPerBed;j++)expanded.push(em[j%em.length]);
            updatedBlueprints=updatedBlueprints.map((b:Blueprint)=>b.id===bed.id?place(b,expanded):b);
          }
        } else {
          // Default: distribute evenly across all beds
          const slotsPerBed=fillPct?Math.max(1,Math.round((beds[0].gridCount*fillPct)/100)):null;
          const totalSlots=slotsPerBed?slotsPerBed*beds.length:bedEm.length;
          const expandedEms:string[]=[];
          for(let i=0;i<totalSlots;i++)expandedEms.push(bedEm[i%bedEm.length]);
          const perBed=Math.ceil(expandedEms.length/beds.length);
          beds.forEach((bed:Blueprint,bi:number)=>{
            const chunk=expandedEms.slice(bi*perBed,(bi+1)*perBed);
            updatedBlueprints=updatedBlueprints.map((b:Blueprint)=>b.id===bed.id?place(b,chunk):b);
          });
        }
      }
      setBlueprints(updatedBlueprints);
    }
    // Gate AI generation — requires login + Pro
    if(useAI){
      if(!isLoggedIn){
        setLoading(false);
        setShowLogin(true);
        return;
      }
      if(!isPro){
        setLoading(false);
        setPaywallFeature('AI Blueprint Generation');
        return;
      }
    }
    const result = useAI ? await generateBlueprint({
      ...data,
      climateZone: (data.climateZone==='Tropical'?'Subtropical':data.climateZone) as 'Temperate'|'Arid'|'Subtropical'|'Cold',
      prompt: addMode
        ? `ADDITIVE REQUEST — do NOT replace or remove existing features. Only add what is specifically requested: ${(data.prompt??'').trim()}`
        : (data.prompt ?? '').trim(),
      propertyMap: updatedBlueprints.filter((b:Blueprint)=>b.type==='property').flatMap((b:Blueprint)=>b.tiles.map((t:{id:number;icon:string})=>t.icon)),
      gardenMap: updatedBlueprints.filter((b:Blueprint)=>b.type==='raised-bed').flatMap((b:Blueprint)=>b.tiles.map((t:{id:number;icon:string})=>t.icon)),
    }) : (()=>{
      // promptEmojis already placed property icons — return only crops for raised beds
      const allExtracted=extractEmojisFromPrompt(data.prompt||'');
      const baseCropIcons=allExtracted.filter((em:string)=>!RAISED_BED_BLOCKED.has(em)&&em!=='🌱');
      const hasBeds=allExtracted.some((em:string)=>em==='🌱');
      const defaultCrops=['🍅','🥕','🥬','🌽','🥒','🫘','🥦','🌶️','🧄','🥔'];
      const cropIcons=baseCropIcons.length>0?baseCropIcons:hasBeds?defaultCrops:[];
      return {summary:'',recommendations:[],recommendedIcons:cropIcons};
    })();

    // ── Step 1: merge recommendedIcons — property features → property map, crops → raised beds ──
    if(result.recommendedIcons?.length>0){
      const propIcons=result.recommendedIcons.filter((em:string)=>RAISED_BED_BLOCKED.has(em));
      const bedIcons=result.recommendedIcons.filter((em:string)=>!RAISED_BED_BLOCKED.has(em));
      // Property-level features on property map
      if(propIcons.length>0){
        const propBpIdx=updatedBlueprints.findIndex((b:Blueprint)=>b.type==='property');
        if(propBpIdx>=0){
          const bp=updatedBlueprints[propBpIdx];
          const tiles=[...bp.tiles];
          const used=new Set(tiles.map((t:{id:number;icon:string})=>t.id));
          propIcons.forEach((em:string)=>{
            if(!tiles.find((t:{id:number;icon:string})=>t.icon===em)){
              let slot=0;while(used.has(slot)&&slot<bp.gridCount)slot++;
              if(slot<bp.gridCount){tiles.push({id:slot,icon:em});used.add(slot);}
            }
          });
          updatedBlueprints=[...updatedBlueprints];
          updatedBlueprints[propBpIdx]={...bp,tiles};
          updatedBlueprints=syncRaisedBedsToPropertyTiles(updatedBlueprints);
        }
      }
      // Crop emojis distributed across raised beds, respecting fill % if in prompt
      if(bedIcons.length>0){
        const beds=updatedBlueprints.filter((b:Blueprint)=>b.type==='raised-bed');
        if(beds.length>0){
          const pLower=(data.prompt||'').toLowerCase();
          const fMatch=pLower.match(/(\d+)\s*%\s*(full|fill|filled|planted|covered)/);
          const hMatch=/(half\s*(full|fill|filled|planted)|50\s*%)/.test(pLower);
          const fPct=fMatch?Math.min(100,parseInt(fMatch[1])):hMatch?50:null;
          const sPerBed=fPct?Math.max(1,Math.round((beds[0].gridCount*fPct)/100)):null;
          const totalS=sPerBed?sPerBed*beds.length:bedIcons.length;
          const expanded:string[]=[];
          for(let i=0;i<totalS;i++)expanded.push(bedIcons[i%bedIcons.length]);
          const perBed=Math.ceil(expanded.length/beds.length);
          beds.forEach((bed:Blueprint,bi:number)=>{
            const chunk=expanded.slice(bi*perBed,(bi+1)*perBed);
            if(chunk.length===0)return;
            const bpIdx=updatedBlueprints.findIndex((b:Blueprint)=>b.id===bed.id);
            if(bpIdx<0)return;
            const bp=updatedBlueprints[bpIdx];
            const tiles=[...bp.tiles];
            const used=new Set(tiles.map((t:{id:number;icon:string})=>t.id));
            chunk.forEach((em:string)=>{
              let slot=0;while(used.has(slot)&&slot<bp.gridCount)slot++;
              if(slot<bp.gridCount){tiles.push({id:slot,icon:em});used.add(slot);}
            });
            updatedBlueprints=[...updatedBlueprints];
            updatedBlueprints[bpIdx]={...bp,tiles};
          });
        } else {
          // No raised beds — fallback to property map
          const propBpIdx=updatedBlueprints.findIndex((b:Blueprint)=>b.type==='property');
          if(propBpIdx>=0){
            const bp=updatedBlueprints[propBpIdx];
            const tiles=[...bp.tiles];
            const used=new Set(tiles.map((t:{id:number;icon:string})=>t.id));
            bedIcons.forEach((em:string)=>{
              let slot=0;while(used.has(slot)&&slot<bp.gridCount)slot++;
              if(slot<bp.gridCount){tiles.push({id:slot,icon:em});used.add(slot);}
            });
            updatedBlueprints=[...updatedBlueprints];
            updatedBlueprints[propBpIdx]={...bp,tiles};
          }
        }
      }
    }

    // ── Step 2: budget enforcement — ceiling AND floor ────────────────────────
    const budget=Number(data.budget)||2800;
    const tileAvgCost=(em:string):number=>{
      const f=ICON_LOOKUP.get(em);
      return f?Math.round((f.costMin+f.costMax)/2):0;
    };
    const valueOf=(em:string):number=>{
      const f=ICON_LOOKUP.get(em);
      if(!f)return 0;
      const cost=tileAvgCost(em);
      return cost>0?(f.co2*0.023+f.yieldLbs*0.8+f.waterGal*0.005)/cost:0;
    };
    const getAllCost=()=>updatedBlueprints
      .flatMap((b:Blueprint)=>b.tiles)
      .reduce((s:number,t:{id:number;icon:string})=>s+tileAvgCost(t.icon),0);

    // ── CEILING: trim if over budget (skip in addMode) ───────────────────────
    if(!addMode&&getAllCost()>budget){
      const propIdx2=updatedBlueprints.findIndex((b:Blueprint)=>b.type==='property');
      if(propIdx2>=0){
        const bp=updatedBlueprints[propIdx2];
        // 🌱 tiles are structural (they create raised beds) — always keep them
        const structural=bp.tiles.filter((t:{id:number;icon:string})=>t.icon==='🌱');
        const trimmable=bp.tiles.filter((t:{id:number;icon:string})=>t.icon!=='🌱');
        const structuralCost=structural.reduce((s:number,t:{id:number;icon:string})=>s+tileAvgCost(t.icon),0);
        const trimBudget=Math.max(budget-structuralCost,0);
        // Sort trimmable by ROI/dollar descending, keep until budget used
        const sorted=[...trimmable].sort((a:{id:number;icon:string},b:{id:number;icon:string})=>valueOf(b.icon)-valueOf(a.icon));
        let running=0;
        const kept:typeof bp.tiles=[...structural];
        for(const tile of sorted){
          const cost=tileAvgCost(tile.icon);
          if(running+cost<=trimBudget){kept.push(tile);running+=cost;}
        }
        updatedBlueprints=[...updatedBlueprints];
        updatedBlueprints[propIdx2]={...bp,tiles:kept};
        updatedBlueprints=syncRaisedBedsToPropertyTiles(updatedBlueprints);
      }
      // Trim raised beds if still over — share remaining budget equally across all beds
      if(getAllCost()>budget){
        const propCost=updatedBlueprints.filter((b:Blueprint)=>b.type==='property')
          .flatMap((b:Blueprint)=>b.tiles).reduce((s:number,t:{id:number;icon:string})=>s+tileAvgCost(t.icon),0);
        const totalBedBudget=Math.max(budget-propCost,0);
        const bedBps=updatedBlueprints.filter((b:Blueprint)=>b.type==='raised-bed');
        const budgetPerBed=bedBps.length>0?Math.floor(totalBedBudget/bedBps.length):0;
        updatedBlueprints=updatedBlueprints.map((b:Blueprint)=>{
          if(b.type!=='raised-bed')return b;
          const sortedBed=[...b.tiles].sort((a:{id:number;icon:string},bb:{id:number;icon:string})=>valueOf(bb.icon)-valueOf(a.icon));
          let r=0;const k:typeof b.tiles=[];
          for(const tile of sortedBed){const cost=tileAvgCost(tile.icon);if(r+cost<=budgetPerBed){k.push(tile);r+=cost;}}
          return{...b,tiles:k};
        });
      }
    }

    // ── FLOOR: skip when user gave explicit prompt or in addMode ─────────────
    const hasExplicitPrompt=(data.prompt||'').trim().length>10;
    const floorTarget=Math.round(budget*0.75);
    if(!addMode&&!hasExplicitPrompt&&getAllCost()<floorTarget){
      const propIdx3=updatedBlueprints.findIndex((b:Blueprint)=>b.type==='property');
      if(propIdx3>=0){
        const bp=updatedBlueprints[propIdx3];
        const placedEmojis=new Set(bp.tiles.map((t:{id:number;icon:string})=>t.icon));
        const usedSlots=new Set(bp.tiles.map((t:{id:number;icon:string})=>t.id));
        // Ordered priority list for floor filling:
        // High-value infrastructure first, then food, then soil/biodiversity
        const PRIORITY_ORDER=[
          '☀️','💧','🌬️','🔋','🌊','🐝','🐟',
          '🌼','♻️','🪱','🍂','🌾','🪟','🌲',
          '🐔','🐇','🦆',
        ];
        // Only fill non-food infrastructure — skip food if user already described food goals
        const _promptMentionsFood=(data.prompt||'').toLowerCase().match(/raised bed|tomato|carrot|lettuce|fruit tree|crops|vegetables|food/i);
        const tilesToAdd:[...typeof bp.tiles]=[...bp.tiles];
        let runningCost=getAllCost();
        for(const em of PRIORITY_ORDER){
          if(runningCost>=floorTarget)break;
          if(placedEmojis.has(em))continue; // already placed
          // Skip food/tree items if user already specified food in prompt
          const _f=ICON_LOOKUP.get(em);
          if(_promptMentionsFood&&_f?.category==='food')continue;
          const cost=tileAvgCost(em);
          if(cost===0)continue;
          if(runningCost+cost>budget)continue; // would exceed ceiling
          // Find next free slot
          let slot=0;
          while(usedSlots.has(slot)&&slot<bp.gridCount)slot++;
          if(slot>=bp.gridCount)break; // property map full
          tilesToAdd.push({id:slot,icon:em});
          usedSlots.add(slot);
          placedEmojis.add(em);
          runningCost+=cost;
        }
        if(tilesToAdd.length>bp.tiles.length){
          updatedBlueprints=[...updatedBlueprints];
          updatedBlueprints[propIdx3]={...bp,tiles:tilesToAdd};
          updatedBlueprints=syncRaisedBedsToPropertyTiles(updatedBlueprints);
        }
      }
    }

    // ── Step 3: single setBlueprints call with fully enforced result ──────────
    setBlueprints(updatedBlueprints);

      // Normalize the API result — extract only what we render
      const norm={
        summary:     typeof result.summary==='string'     ? result.summary     : '',
        recommendations: Array.isArray(result.recommendations) ? result.recommendations.filter((r:any)=>typeof r==='string') : [],
      };
      setApiBlueprint(norm);setFormOpen(false);
      // Notify user of final budget utilization
      const finalCost=updatedBlueprints.flatMap((b:Blueprint)=>b.tiles)
        .reduce((s:number,t:{id:number;icon:string})=>{const f=ICON_LOOKUP.get(t.icon);return s+(f?Math.round((f.costMin+f.costMax)/2):0);},0);
      const utilPct=budget>0?Math.round((finalCost/budget)*100):100;
      const _hasExplicitPrompt2=(data.prompt||'').trim().length>10;
      if(utilPct<70&&budget>=2000&&!_hasExplicitPrompt2&&!addMode){
        setTimeout(()=>{
          const t=document.createElement('div');
          t.style.cssText='position:fixed;bottom:32px;left:50%;transform:translateX(-50%);background:#0a0e1a;color:#fbbf24;border:1px solid rgba(251,191,36,0.35);border-radius:14px;padding:16px 28px;font-size:12px;font-weight:600;z-index:99999;pointer-events:none;max-width:480px;text-align:center;line-height:1.6;box-shadow:0 8px 32px rgba(0,0,0,0.5);';
          t.innerHTML=`ℹ Blueprint optimized to $${finalCost.toLocaleString()} (${utilPct}% of $${budget.toLocaleString()} budget). Your property map has limited space for additional features — expand grid size in settings or add features manually from the library.`;
          document.body.appendChild(t);setTimeout(()=>t.remove(),7000);
        },1000);
      }
    }catch(e){
      console.error(e);
      // Show error toast without corrupting apiBlueprint state
      const t=document.createElement('div');
      t.style.cssText='position:fixed;bottom:32px;left:50%;transform:translateX(-50%);background:#1a0a0a;color:#f87171;border:1px solid rgba(239,68,68,0.35);border-radius:12px;padding:12px 24px;font-size:13px;font-weight:600;z-index:99999;pointer-events:none;';
      t.textContent='⚠ Blueprint generation failed — tiles placed from keywords.';
      document.body.appendChild(t);setTimeout(()=>t.remove(),4000);
    }
    setLoading(false);
  };

  /* Calculations — include all tiles across all blueprint types */
  const allTiles=useMemo(()=>blueprints.flatMap((b:Blueprint)=>b.tiles),[blueprints]);
  const calc=useMemo(()=>calculateFromTiles(allTiles,Math.max(1,Number(fv.familySize)||4),fv.climateZone),[allTiles,fv.familySize,fv.climateZone]);
  // When AI is generating, show zeros so base calc doesn't flash before AI result
  // ZERO_CALC defined at module scope
  const displayCalc=loading&&useAI?ZERO_CALC:calc;
  const tips=useMemo(()=>getImprovementTips(calc,allTiles),[calc,allTiles]);

  const propBps     = useMemo(()=>blueprints.filter((b:Blueprint)=>b.type==='property'),[blueprints]);
  const raisedBedBps= useMemo(()=>blueprints.filter((b:Blueprint)=>b.type==='raised-bed'),[blueprints]);

  // activeBp: determined by mapSubTab + matching index
  const activeBp = mapSubTab==='property'
    ? (propBps[propIdx] ?? propBps[0])
    : (raisedBedBps[rbIdx] ?? raisedBedBps[0]);
  const activeBpId   = activeBp?.id ?? '';
  const activeBpIdRef = useRef<string>('');
  const pendingDropSlotRef = useRef<{bpId:string;id:number;em:string}|null>(null);
  activeBpIdRef.current = activeBpId;
  const setActiveBpId = (id:string)=>{
    if(mapSubTab==='property'){const i=propBps.findIndex((b:Blueprint)=>b.id===id);if(i>=0)setPropIdx(i);}
    else{const i=raisedBedBps.findIndex((b:Blueprint)=>b.id===id);if(i>=0)setRbIdx(i);}
  };

  // When in raised-bed mode, filter out icons that can't go in a raised bed
  const filteredIcons=useMemo(()=>{
    const base=(iconFilter==='all'?iconLibrary:iconLibrary.filter(i=>i.category===iconFilter)).slice().sort((a,b)=>a.name.localeCompare(b.name));
    if(mapSubTab==='raised-bed') return base.filter(i=>!RAISED_BED_BLOCKED.has(i.emoji));
    return base;
  },[iconFilter,mapSubTab]);
  const modalInfo=useMemo(()=>modal?getFeatureInfo(modal.emoji,fv,displayCalc.resilienceScore):null,[modal,fv,displayCalc.resilienceScore]);

  function updateBp(id:string,patch:Partial<Blueprint>){
    setBlueprints((prev:Blueprint[])=>{
      const updated=prev.map((b:Blueprint)=>b.id===id?{...b,...patch}:b);
      // If a property blueprint's tiles changed, re-sync raised beds
      const bp=prev.find((b:Blueprint)=>b.id===id);
      if(bp?.type==='property'&&patch.tiles!==undefined){
        return syncRaisedBedsToPropertyTiles(updated);
      }
      return updated;
    });
  }
  function updateBpTiles(id:string,updater:(tiles:{id:number;icon:string}[])=>{id:number;icon:string}[]){
    setBlueprints((prev:Blueprint[])=>{
      const updated=prev.map((b:Blueprint)=>{
        if(b.id!==id)return b;
        const nt=updater(b.tiles);
        return{...b,tiles:nt};
      });
      const bp=prev.find((b:Blueprint)=>b.id===id);
      if(bp?.type==='property'){
        return syncRaisedBedsToPropertyTiles(updated);
      }
      return updated;
    });
  }
  function addFeatureToActiveMap(emoji:string,skipBudgetCheck=false){
    // Budget check — warn once per blueprint if addition would exceed budget
    if(!skipBudgetCheck&&!budgetWarned&&allTiles.length>1){
      const featureCost=ICON_LOOKUP.get(emoji);
      const addCost=featureCost?Math.round((featureCost.costMin+featureCost.costMax)/2):0;
      const currentCost=allTiles.reduce((sum:number,t:{id:number;icon:string})=>{
        const f=ICON_LOOKUP.get(t.icon);
        return sum+(f?Math.round((f.costMin+f.costMax)/2):0);
      },0);
      const budget=Math.max(500,Number(fv.budget)||2800);
      if(addCost>0&&currentCost+addCost>budget){
        setPendingBudgetAdd(emoji);
        return;
      }
    }
    // Block raised-bed-blocked icons from being added to raised bed maps
    if(mapSubTab==='raised-bed'&&RAISED_BED_BLOCKED.has(emoji)){
      const t=document.createElement('div');
      t.style.cssText='position:fixed;bottom:32px;left:50%;transform:translateX(-50%);background:#1a0a0a;color:#f87171;border:1px solid rgba(239,68,68,0.35);border-radius:12px;padding:10px 20px;font-size:13px;font-weight:600;z-index:99999;pointer-events:none;';
      t.textContent='This feature belongs on the Property map, not inside a raised bed.';
      document.body.appendChild(t);setTimeout(()=>t.remove(),3000);
      return;
    }
    let mapFull=false;
    const targetId=activeBpIdRef.current||activeBpId;
    setBlueprints((prev:Blueprint[])=>{
      const updated=prev.map((bp:Blueprint)=>{
        if(bp.id!==targetId)return bp;
        const used=new Set(bp.tiles.map((t:{id:number;icon:string})=>t.id));let slot=0;
        while(used.has(slot)&&slot<bp.gridCount)slot++;
        if(slot>=bp.gridCount){mapFull=true;return bp;}
        return{...bp,tiles:[...bp.tiles,{id:slot,icon:emoji}]};
      });
      // If we added a 🌱 to a property map, sync raised beds immediately
      const target=prev.find((b:Blueprint)=>b.id===targetId);
      if(target?.type==='property'&&emoji==='🌱'&&!mapFull){
        return syncRaisedBedsToPropertyTiles(updated);
      }
      return updated;
    });
    if(mapFull){
      const t=document.createElement('div');
      t.style.cssText='position:fixed;bottom:32px;left:50%;transform:translateX(-50%);background:#1a1a0a;color:#fbbf24;border:1px solid rgba(251,191,36,0.35);border-radius:12px;padding:10px 20px;font-size:13px;font-weight:600;z-index:99999;pointer-events:none;';
      t.textContent='Map is full — remove a tile or switch blueprints.';
      document.body.appendChild(t);setTimeout(()=>t.remove(),3000);
    }else{
      setActiveTab('maps');
    }
  }
  function addBlueprint(type:'property'|'raised-bed'){
    if(type==='raised-bed'){
      // Can't manually add raised beds — they are derived from 🌱 on property maps
      const t=document.createElement('div');
      t.style.cssText='position:fixed;bottom:32px;left:50%;transform:translateX(-50%);background:#0a1a14;color:#00ffaa;border:1px solid rgba(0,255,170,0.30);border-radius:12px;padding:10px 20px;font-size:13px;font-weight:600;z-index:99999;pointer-events:none;';
      t.textContent='Add a 🌱 Raised Bed to your Property Map to create a new bed.';
      document.body.appendChild(t);setTimeout(()=>t.remove(),3500);
      return;
    }
    const count=blueprints.filter((b:Blueprint)=>b.type===type).length+1;
    // Multi-property is a Pro feature — free users get 1 property map
    const existingProps=blueprints.filter((b:Blueprint)=>b.type==='property').length;
    if(existingProps>=1 && !isPro){
      trackEvent('paywall_view',{ feature:'Multiple Properties' });
      setPaywallFeature('Multiple Properties');
      return;
    }
    const bp=newBP(type,`Property Map ${count}`);
    setBlueprints((prev:Blueprint[])=>[...prev,bp]);
    const newIdx=blueprints.filter((b:Blueprint)=>b.type===type).length;
    setPropIdx(newIdx);
    setActiveTab('maps');setMapSubTab('property');
  }
  function duplicateBp(id:string){
    const orig=blueprints.find((b:Blueprint)=>b.id===id);if(!orig)return;
    if(orig.type==='raised-bed')return; // raised beds are managed automatically
    // Duplicating a property creates a second property — Pro only
    if(orig.type==='property'){
      const existingProps=blueprints.filter((b:Blueprint)=>b.type==='property').length;
      if(existingProps>=1 && !isPro){
        trackEvent('paywall_view',{ feature:'Multiple Properties' });
        setPaywallFeature('Multiple Properties');
        return;
      }
    }
    const copy:Blueprint={...orig,id:`${orig.type}-${Date.now()}-${Math.random().toString(36).slice(2,7)}`,name:orig.name+' (copy)'};
    setBlueprints((prev:Blueprint[])=>[...prev,copy]);
    const newIdx=blueprints.filter((b:Blueprint)=>b.type===orig.type).length;
    if(orig.type==='property')setPropIdx(newIdx);
  }
  function deleteBp(id:string){
    const deleting=blueprints.find((b:Blueprint)=>b.id===id);if(!deleting)return;
    if(deleting.type==='raised-bed')return; // raised beds are managed automatically
    if(blueprints.filter((b:Blueprint)=>b.type===deleting.type).length<=1)return;
    setBlueprints((prev:Blueprint[])=>prev.filter((b:Blueprint)=>b.id!==id));
    if(deleting.type==='property')setPropIdx(0);
  }
  // Build an aggregated, categorised shopping list from all placed features
  const shoppingListData = useMemo(()=>{
    const counts=new Map<string,number>();
    allTiles.forEach((t:{id:number;icon:string})=>{
      counts.set(t.icon,(counts.get(t.icon)??0)+1);
    });
    const catLabels:Record<string,string>={food:'🌾 Food Production',water:'💧 Water Systems',energy:'⚡ Energy',soil:'♻️ Soil & Compost',biodiversity:'🌼 Biodiversity',animals:'🐔 Animals',flowers:'🌷 Flowers'};
    const groups:Record<string,{name:string;emoji:string;qty:number;costMin:number;costMax:number}[]>={};
    let totalMin=0,totalMax=0;
    counts.forEach((qty,emoji)=>{
      const info:any=ICON_LOOKUP.get(emoji);
      if(!info)return;
      const cat=info.category||'food';
      if(!groups[cat])groups[cat]=[];
      const cMin=(info.costMin||0)*qty;
      const cMax=(info.costMax||0)*qty;
      groups[cat].push({name:info.name,emoji,qty,costMin:cMin,costMax:cMax});
      totalMin+=cMin;totalMax+=cMax;
    });
    const ordered=Object.keys(groups).map(cat=>({
      category:cat,
      label:catLabels[cat]||cat,
      items:groups[cat].sort((a,b)=>b.costMax-a.costMax),
    })).filter(g=>g.items.length>0);
    return {groups:ordered,totalMin,totalMax,itemCount:allTiles.length};
  },[allTiles]);

  const printShoppingList=()=>{
    const w=window.open('','_blank','width=800,height=900');
    if(!w)return;
    const rows=shoppingListData.groups.map(g=>`
      <h2>${g.label}</h2>
      <table>
        <thead><tr><th>Item</th><th>Qty</th><th>Est. Cost</th></tr></thead>
        <tbody>
        ${g.items.map(it=>`<tr><td>${it.emoji} ${it.name}</td><td>${it.qty}</td><td>$${it.costMin.toLocaleString()}–$${it.costMax.toLocaleString()}</td></tr>`).join('')}
        </tbody>
      </table>`).join('');
    w.document.write(`<!DOCTYPE html><html><head><title>TerraForge Shopping List</title>
    <style>
      body{font-family:'Inter',Arial,sans-serif;background:#fff;color:#1a2e1a;margin:0;padding:32px;max-width:700px;}
      h1{font-size:24px;color:#1a5c2a;margin:0 0 4px;}
      .sub{font-size:13px;color:#666;margin:0 0 24px;}
      h2{font-size:14px;color:#2e7d32;margin:24px 0 8px;border-bottom:2px solid #e0ede0;padding-bottom:4px;}
      table{width:100%;border-collapse:collapse;margin-bottom:8px;}
      th{text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:.05em;color:#888;padding:6px 8px;border-bottom:1px solid #eee;}
      td{font-size:13px;padding:7px 8px;border-bottom:1px solid #f5f5f5;}
      td:nth-child(2){text-align:center;width:60px;color:#666;}
      td:nth-child(3){text-align:right;width:140px;font-weight:600;}
      .total{margin-top:24px;padding:16px;background:#f0f9f1;border-radius:10px;display:flex;justify-content:space-between;align-items:center;}
      .total-label{font-size:14px;font-weight:700;color:#1a5c2a;}
      .total-val{font-size:20px;font-weight:800;color:#1a5c2a;}
      .footer{margin-top:24px;font-size:11px;color:#aaa;text-align:center;}
      @media print{body{padding:12px;}}
    </style></head><body>
    <h1>🌱 TerraForge Shopping List</h1>
    <p class="sub">${shoppingListData.itemCount} features · ${fv.climateZone} climate · Generated ${new Date().toLocaleDateString()}</p>
    ${rows}
    <div class="total">
      <span class="total-label">Estimated Total</span>
      <span class="total-val">$${shoppingListData.totalMin.toLocaleString()} – $${shoppingListData.totalMax.toLocaleString()}</span>
    </div>
    <p class="footer">Costs are estimates for materials and starting stock. Prices vary by region and supplier. · terraforgehome.com</p>
    <script>window.onload=()=>window.print();</script>
    </body></html>`);
    w.document.close();
  };

  const openShoppingList=()=>{
    if(!hasData)return;
    if(!requirePro('Shopping List'))return;
    trackEvent('shopping_list_open');
    setShowShoppingList(true);
  };

  const exportPDF=()=>{
    if(!hasData) return;
    trackEvent('pdf_export', { is_pro: isPro });
    if(!isPro && pdfExportCount >= 1){
      requirePro('PDF Export');
      return;
    }
    // Show confirmation for free users
    if(!isPro){
      const confirmed = confirm(
        'Export your TerraForge plan as PDF?\n\n' +
        'Free accounts get 1 export. This will use your free export.\n\n' +
        'Click OK to download your PDF.'
      );
      if(!confirmed) return;
      exportAsPDF(blueprints,calc,fv,apiBlueprint);
      setPdfExportCount(1);
      return;
    }
    exportAsPDF(blueprints,calc,fv,apiBlueprint);
  };
  const sanitizeSvg=(svg:string):string=>{
    return svg
      .replace(/<script[\s\S]*?<\/script>/gi,'')
      .replace(/\son\w+\s*=\s*["'][^"']*["']/gi,'')
      .replace(/\son\w+\s*=\s*\{[^}]*\}/gi,'')
      .replace(/href\s*=\s*["']javascript:[^"']*["']/gi,'href="#"')
      .replace(/xlink:href\s*=\s*["']javascript:[^"']*["']/gi,'xlink:href="#"')
      .replace(/<foreignObject[\s\S]*?<\/foreignObject>/gi,'')
      .replace(/expression\s*\([^)]*\)/gi,'')
      .trim();
  };

  const generateVisualisation=async()=>{
    if(!isPro){requirePro('Garden Visualiser');return;}
    setVisualising(true);setVisualError('');setVisualSvg(null);
    try{
      const features=allTiles.map(t=>ICON_LOOKUP.get(t.icon)?.name).filter(Boolean);
      const res=await fetch('/api/visualise-property',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({
          address:propertyData?.address||propertyAddress||'My Property',
          sqft:propertyData?.analysis?.totalSqFt||Number(fv.yardSqFt)||10000,
          zone:fv.climateZone||'Temperate',
          features,
          existingFeatures:propertyData?.analysis?.existingFeatures||[],
          blueprintSummary:apiBlueprint?.summary||'',
        }),
      });
      const d=await res.json();
      if(!res.ok){setVisualError(d.error||'Could not generate illustration.');setVisualising(false);return;}
      setVisualSvg(sanitizeSvg(d.svg));
    }catch(e:any){
      setVisualError('Generation failed — please try again.');
    }
    setVisualising(false);
  };

  const downloadVisualisation=()=>{
    if(!visualSvg)return;
    const blob=new Blob([visualSvg],{type:'image/svg+xml'});
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a');
    a.href=url;a.download='TerraForge-Garden-Art.svg';
    document.body.appendChild(a);a.click();a.remove();
    URL.revokeObjectURL(url);
  };

  const analyseProperty=async()=>{
    if(!propertyAddress.trim()){setPropertyError('Please enter a property address.');return;}
    setPropertyAnalysing(true);setPropertyError('');
    try{
      const res=await fetch('/api/analyse-property',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({address:propertyAddress.trim()}),
      });
      const d=await res.json();
      if(!res.ok){setPropertyError(d.error||'Could not analyse property.');setPropertyAnalysing(false);return;}
      setPropertyData(d);
    }catch(e:any){
      setPropertyError('Analysis failed — please check your address and try again.');
    }
    setPropertyAnalysing(false);
  };

  const printPropertyReport=()=>{
    if(!propertyData)return;
    const w=window.open('','_blank','width=900,height=700');
    if(!w)return;
    w.document.write(`<!DOCTYPE html><html><head><title>TerraForge — Property Report</title>
    <style>
      body{font-family:'Inter',sans-serif;background:#f8faf8;color:#1a2e1a;margin:0;padding:32px;}
      h1{font-size:24px;color:#1a5c2a;margin:0 0 4px;}
      .sub{font-size:14px;color:#666;margin:0 0 24px;}
      .grid{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:24px;}
      .card{background:#fff;border-radius:12px;padding:20px;border:1px solid #e0ede0;}
      .card h2{font-size:13px;text-transform:uppercase;letter-spacing:.08em;color:#4a7a4a;margin:0 0 12px;}
      .stat{display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #f0f5f0;}
      .stat:last-child{border:none;}
      .stat-label{font-size:13px;color:#666;}
      .stat-value{font-size:13px;font-weight:700;color:#1a2e1a;}
      img{width:100%;border-radius:12px;margin-bottom:24px;}
      .tag{display:inline-block;background:#e8f5e9;color:#2e7d32;border-radius:99px;
           padding:3px 10px;font-size:11px;margin:3px 3px 0 0;}
      .footer{margin-top:32px;font-size:11px;color:#999;text-align:center;}
      @media print{body{padding:16px;}.no-print{display:none;}}
    </style></head><body>
    <h1>🌱 TerraForge Property Report</h1>
    <p class="sub">${propertyData.address}</p>
    <img src="${propertyData.satelliteUrl}" alt="Satellite view"/>
    <div class="grid">
      <div class="card">
        <h2>Property Dimensions</h2>
        <div class="stat"><span class="stat-label">Total area</span><span class="stat-value">${propertyData.analysis.totalSqFt?.toLocaleString()} sq ft</span></div>
        <div class="stat"><span class="stat-label">Usable garden</span><span class="stat-value">${propertyData.analysis.usableGardenSqFt?.toLocaleString()} sq ft</span></div>
        <div class="stat"><span class="stat-label">House footprint</span><span class="stat-value">${propertyData.analysis.houseFootprintPct}%</span></div>
        <div class="stat"><span class="stat-label">Orientation</span><span class="stat-value">${propertyData.analysis.orientation||'—'}</span></div>
        <div class="stat"><span class="stat-label">Climate hint</span><span class="stat-value">${propertyData.analysis.climateHint||'—'}</span></div>
      </div>
      <div class="card">
        <h2>Existing Features</h2>
        <div class="stat"><span class="stat-label">Mature trees</span><span class="stat-value">${propertyData.analysis.existingTreeCount||0}</span></div>
        <div class="stat"><span class="stat-label">Garden beds</span><span class="stat-value">${propertyData.analysis.gardenBeds||0}</span></div>
        <div class="stat"><span class="stat-label">Driveway</span><span class="stat-value">${propertyData.analysis.hasDriveway?'Yes':'No'}</span></div>
        <div class="stat"><span class="stat-label">Pool</span><span class="stat-value">${propertyData.analysis.hasPool?'Yes':'No'}</span></div>
        <div class="stat"><span class="stat-label">Fence</span><span class="stat-value">${propertyData.analysis.hasFence?'Yes':'No'}</span></div>
      </div>
    </div>
    ${propertyData.analysis.existingFeatures?.length>0?`
    <div class="card">
      <h2>Detected Features</h2>
      <div style="margin-top:4px">${propertyData.analysis.existingFeatures.map((f:string)=>`<span class="tag">${f}</span>`).join('')}</div>
    </div>`:''}
    <div class="footer">Generated by TerraForge · terraforgehome.com · Analysis confidence: ${propertyData.analysis.confidence}</div>
    <script>window.onload=()=>window.print();</script>
    </body></html>`);
    w.document.close();
  };

  const shareBlueprint=()=>{
    if(!hasData)return;
    // Build a compact shareable state: form values + tile counts only
    const summary={
      zone:fv.climateZone,sqft:fv.yardSqFt,family:fv.familySize,budget:fv.budget,
      features:allTiles.reduce((acc:{[k:string]:number},t)=>{acc[t.icon]=(acc[t.icon]??0)+1;return acc;},{}),
      score:calc.resilienceScore,yield:calc.totalYieldLbs,savings:calc.year1Savings,
      bps:blueprints.map(b=>({id:b.id,name:b.name,type:b.type,tiles:b.tiles,gridCols:b.gridCols,gridCount:b.gridCount,rotation:b.rotation})),
    };
    const encoded=btoa(encodeURIComponent(JSON.stringify(summary)));
    const url=`${window.location.origin}/dashboard/garden?share=${encoded}`;
    // Use native share on mobile if available
    if(navigator.share&&/Mobi|Android/i.test(navigator.userAgent)){
      navigator.share({
        title:'My TerraForge Blueprint',
        text:`Check out my homestead plan — ${calc.resilienceScore}/98 resilience, ${calc.totalYieldLbs.toLocaleString()} lbs/yr yield, $${calc.year1Savings.toLocaleString()}/yr savings.`,
        url,
      }).catch(()=>{});
    } else {
      navigator.clipboard.writeText(url).then(()=>{
        setShareToast('Link copied to clipboard!');
        setTimeout(()=>setShareToast(null),2800);
      }).catch(()=>{
        setShareToast('Copy this link: '+url);
        setTimeout(()=>setShareToast(null),5000);
      });
    }
  };
  const loadFromSave=useCallback((data:any)=>{
    if(data.apiBlueprint)setApiBlueprint(data.apiBlueprint);
    if(data.blueprints){
      // Migrate any legacy garden blueprints and sync raised beds
      let bps:Blueprint[]=data.blueprints.filter((b:any)=>b.type!=='garden');
      // Migrate legacy 🌳 generic tree tiles to climate-appropriate specific trees
      const zone=data.formValues?.climateZone||'Temperate';
      const climateTree=(z:string)=>z==='Subtropical'?'🍌':z==='Arid'?'🍋':z==='Cold'?'🍐':'🍎';
      bps=bps.map((b:any)=>({...b,tiles:(b.tiles||[]).map((t:any)=>t.icon==='🌳'?{...t,icon:climateTree(zone)}:t)}));
      bps=syncRaisedBedsToPropertyTiles(bps);
      setBlueprints(bps);
    }
    if(data.formValues)reset(data.formValues);
    const pLen=(data.blueprints??[]).filter((b:any)=>b.type==='property').length;
    setPropIdx(Math.min(data.propIdx??0,Math.max(0,pLen-1)));
    setRbIdx(0);
  },[reset]);

  const deployPlan=useMemo(()=>getDeployPlan(displayCalc,fv,blueprints,fv.climateZone||'Temperate'),[calc,fv.yardSqFt,fv.budget,fv.familySize,fv.climateZone,blueprints]);
  const hasData=mounted&&(apiBlueprint||allTiles.length>1); // >1 means user has done something beyond default 🌱

  /* =======================================================
     RENDER -- VERDANT OS v8.0  |  Definitive Layout
  ======================================================= */

  return(
    <div style={{maxWidth:'100vw',width:'100%',position:'relative'}}>
      <StyleInjector/>
      <div style={{
        background:'var(--void)',color:'var(--tp)',minHeight:'100vh',width:'100%',maxWidth:'100vw',boxSizing:'border-box',position:'relative',
        fontFamily:"'Inter',sans-serif",
        WebkitFontSmoothing:'antialiased',
      }}>

        {/* ==== AXIOM ATMOSPHERE ==== */}
        <div aria-hidden style={{position:'fixed',inset:0,pointerEvents:'none',zIndex:0,overflow:'hidden'}}>
          {/* Primary jade orb — top-left */}
          <div style={{position:'absolute',top:'-10%',left:'-8%',width:960,height:960,
            background:'radial-gradient(circle at 35% 35%,rgba(0,255,170,0.18) 0%,rgba(0,255,170,0.05) 45%,transparent 65%)',
            animation:'orb 42s ease-in-out infinite'}}/>
          {/* Cyan orb — bottom-right */}
          <div style={{position:'absolute',bottom:'-8%',right:'-8%',width:1100,height:1100,
            background:'radial-gradient(circle at 65% 65%,rgba(0,238,255,0.14) 0%,rgba(0,238,255,0.04) 45%,transparent 65%)',
            animation:'orb2 50s ease-in-out infinite'}}/>
          {/* Plasma accent — centre */}
          <div style={{position:'absolute',top:'30%',left:'45%',width:700,height:700,
            background:'radial-gradient(circle,rgba(167,139,250,0.09) 0%,rgba(0,255,170,0.03) 45%,transparent 65%)',
            animation:'orb 36s ease-in-out infinite reverse'}}/>
          {/* Small jade fill — top-right */}
          <div style={{position:'absolute',top:'5%',right:'15%',width:400,height:400,
            background:'radial-gradient(circle,rgba(0,255,170,0.10) 0%,transparent 60%)',
            animation:'orb2 58s ease-in-out infinite reverse'}}/>

          {/* Holographic grid */}
          <div className="holo-grid" style={{position:'absolute',inset:0}}/>
          {/* Hex overlay */}
          <div className="hex" style={{position:'absolute',inset:0,opacity:0.50}}/>

          {/* Rotating 3D wireframe geometry — CSS-only */}
          <div style={{position:'absolute',top:'12%',right:'6%',width:280,height:280,
            perspective:800,perspectiveOrigin:'50% 50%',opacity:0.22,pointerEvents:'none'}}>
            <div style={{width:'100%',height:'100%',transformStyle:'preserve-3d',
              animation:'rotateGeo 40s linear infinite',position:'relative'}}>
              {/* Icosahedron faces approximated with rotated squares */}
              {[0,60,120,180,240,300].map((deg,i)=>(
                <div key={i} style={{position:'absolute',inset:0,
                  border:'1px solid rgba(0,255,170,0.60)',borderRadius:4,
                  transform:`rotateY(${deg}deg) rotateX(${deg*0.6}deg) translateZ(${80+i*8}px)`,
                  background:`rgba(0,255,170,${0.012+i*0.004})`}}/>
              ))}
              {[0,45,90,135].map((deg,i)=>(
                <div key={i+6} style={{position:'absolute',inset:'20%',
                  border:'1px solid rgba(0,238,255,0.40)',borderRadius:2,
                  transform:`rotateZ(${deg}deg) rotateY(${deg*1.2}deg) translateZ(${40+i*6}px)`,
                  background:`rgba(0,238,255,${0.008+i*0.003})`}}/>
              ))}
            </div>
          </div>

          {/* Second rotating geometry — bottom-left */}
          <div style={{position:'absolute',bottom:'8%',left:'3%',width:180,height:180,
            perspective:600,perspectiveOrigin:'50% 50%',opacity:0.16,pointerEvents:'none'}}>
            <div style={{width:'100%',height:'100%',transformStyle:'preserve-3d',
              animation:'rotateGeo2 28s linear infinite',position:'relative'}}>
              {[0,72,144,216,288].map((deg,i)=>(
                <div key={i} style={{position:'absolute',inset:0,
                  border:'1px solid rgba(167,139,250,0.70)',borderRadius:3,
                  transform:`rotateY(${deg}deg) rotateZ(${deg*0.5}deg) translateZ(${50+i*6}px)`,
                  background:`rgba(167,139,250,${0.015+i*0.005})`}}/>
              ))}
            </div>
          </div>

          {/* Energy rings around geometry */}
          <div className="energy-ring-outer" style={{width:340,height:340,top:'calc(12% - 30px)',right:'calc(6% - 30px)'}}/>
          <div className="energy-ring-inner" style={{width:380,height:380,top:'calc(12% - 50px)',right:'calc(6% - 50px)'}}/>

          {/* Scanlines */}
          <div className="a-scan" style={{position:'absolute',left:0,right:0,top:0,height:2,
            background:'linear-gradient(90deg,transparent,rgba(0,255,170,0.08) 35%,rgba(0,238,255,0.06) 60%,transparent)'}}/>
          <div style={{position:'absolute',left:0,right:0,top:0,height:1,
            background:'linear-gradient(90deg,transparent,rgba(0,255,170,0.05) 35%,rgba(0,238,255,0.04) 60%,transparent)',
            animation:'scan2 44s linear infinite 14s'}}/>
        </div>
        {/* ==== DESKTOP TOP NAV (hidden on mobile) ==== */}
        {!isMobile&&(
          <nav style={{
            position:'sticky',top:0,zIndex:200,
            display:'flex',alignItems:'center',
            height:64,padding:'0 10px',gap:0,
            overflow:'hidden',maxWidth:'100vw',boxSizing:'border-box',
            background:'linear-gradient(160deg,rgba(10,46,28,0.99) 0%,rgba(12,28,48,0.99) 60%,rgba(18,8,50,0.98) 100%)',
            backdropFilter:'blur(20px)',
            WebkitBackdropFilter:'blur(48px) saturate(2)',
            borderBottom:'1px solid rgba(0,255,170,0.18)',
            boxShadow:'0 1px 0 rgba(0,255,170,0.08),0 4px 24px rgba(0,0,0,0.35)',
          }}>
            {/* Logo */}
            <div style={{display:'flex',alignItems:'center',gap:10,paddingRight:8,
              borderRight:'1px solid rgba(0,255,170,0.07)',flexShrink:0,marginRight:4}}>
              <div className="a-liquid" style={{
                width:40,height:40,borderRadius:11,flexShrink:0,
                background:'linear-gradient(135deg,rgba(0,255,170,0.15),rgba(0,213,255,0.08))',
                border:'1px solid rgba(0,255,170,0.20)',
                boxShadow:'0 0 16px rgba(0,255,170,0.12)',
                display:'flex',alignItems:'center',justifyContent:'center',
              }}>
                <Sprout style={{width:18,height:18,color:'#00ffaa',filter:'drop-shadow(0 0 5px rgba(0,255,170,0.70))'}}/>
              </div>
              <div style={{fontSize:11,fontWeight:800,letterSpacing:'.22em',color:'#00ffaa',
                fontFamily:"'Space Grotesk',sans-serif",lineHeight:1,
                textShadow:'0 0 16px rgba(0,255,170,0.60)'}}>TERRAFORGE</div>
            </div>
            {/* Tabs */}
            <div style={{display:'flex',alignItems:'center',gap:1,flexShrink:1,padding:'0 2px',minWidth:0}}>
              {TABS.map(({id,label,Icon})=>{
                const on=activeTab===id;
                const proOnly=!isPro&&(id==='roi'||id==='deploy'||id==='blueprints'||id==='calendar'||id==='property');
                return(
                  <button key={id} onClick={()=>{setActiveTab(id);window.scrollTo({top:0,behavior:'smooth'});}}
                    style={{
                      display:'flex',alignItems:'center',gap:4,
                      padding:'6px 8px',borderRadius:9,flexShrink:0,
                      fontSize:11.5,fontWeight:600,cursor:'pointer',whiteSpace:'nowrap',
                      color:on?'#00ffaa':proOnly?'rgba(175,225,195,0.45)':'rgba(175,225,195,0.55)',
                      background:on?'rgba(0,255,170,0.12)':'transparent',
                      border:on?'1px solid rgba(0,255,170,0.28)':'1px solid transparent',
                    }}>
                    <Icon style={{width:14,height:14,flexShrink:0}}/>
                    <span>{label}{proOnly?' 🔒':''}</span>
                  </button>
                );
              })}
            </div>
            {/* How To button */}
            <button title="How to use TerraForge" onClick={()=>setShowHowTo(true)}
              style={{
                display:'flex',alignItems:'center',justifyContent:'center',
                width:34,height:34,borderRadius:9,
                marginLeft:4,flexShrink:0,cursor:'pointer',
                color:'rgba(0,213,255,0.80)',
                background:'rgba(0,213,255,0.07)',
                border:'1px solid rgba(0,213,255,0.22)',
              }}>
              <BookOpen style={{width:15,height:15,flexShrink:0}}/>
            </button>
            {/* Configure button */}
            <button onClick={()=>setFormOpen((v:boolean)=>!v)}
              style={{
                display:'flex',alignItems:'center',gap:6,
                padding:'8px 14px',borderRadius:10,
                marginLeft:6,marginRight:4,flexShrink:0,cursor:'pointer',
                fontFamily:"'Space Grotesk',sans-serif",fontSize:11.5,fontWeight:800,
                letterSpacing:'.06em',textTransform:'uppercase',whiteSpace:'nowrap',
                color:formOpen?'var(--void)':'#00ffaa',
                background:formOpen?'linear-gradient(135deg,#00ffaa 0%,#00d4c8 100%)':'rgba(0,255,170,0.09)',
                border:`1px solid ${formOpen?'transparent':'rgba(0,255,170,0.30)'}`,
                boxShadow:formOpen?'0 0 24px rgba(0,255,170,0.35)':'0 0 12px rgba(0,255,170,0.12)',
              }}>
              <Settings style={{width:13,height:13,flexShrink:0}}/>
              <span>Configure</span>
            </button>
            {/* Live stats */}
            {hasData&&mounted&&(
              <div style={{display:'flex',alignItems:'center',gap:5}}>
                {[
                  {v:`${displayCalc.resilienceScore}`,u:'/98',l:'Score',c:'#00ffaa'},
                  {v:`${displayCalc.totalYieldLbs.toLocaleString()}`,u:'lb',l:'Yield',c:'#00d4ff'},
                  {v:`$${displayCalc.year1Savings.toLocaleString()}`,u:'/yr',l:'Saved',c:'#ffb830'},
                ].map(({v,u,l,c})=>(
                  <div key={l} style={{
                    display:'flex',flexDirection:'column',alignItems:'center',
                    padding:'5px 10px',borderRadius:9,
                    background:'rgba(0,255,170,0.06)',border:'1px solid rgba(0,255,170,0.12)',
                  }}>
                    <span style={{fontSize:14,fontWeight:800,color:c,lineHeight:1.1,
                      fontFamily:"'JetBrains Mono',monospace",whiteSpace:'nowrap'}}>
                      {v}<span style={{fontSize:8,opacity:0.50,marginLeft:1}}>{u}</span>
                    </span>
                    <span style={{fontSize:9,color:'var(--ts)',letterSpacing:'.04em',marginTop:1,
                      fontFamily:"'Inter',sans-serif",fontWeight:600}}>{l}</span>
                  </div>
                ))}
              </div>
            )}
            {/* Action cluster — compact icon buttons */}
            <div style={{display:'flex',alignItems:'center',gap:5,paddingLeft:6,marginLeft:'auto',
              borderLeft:'1px solid rgba(0,255,170,0.07)'}}>
              {hasData&&(
                <div title="Live" style={{display:'flex',alignItems:'center',gap:5,padding:'7px 9px',borderRadius:8,
                  background:'rgba(0,255,170,0.055)',border:'1px solid rgba(0,255,170,0.24)'}}>
                  <div className="a-pulse" style={{width:6,height:6,borderRadius:'50%',
                    background:'#00ffaa',boxShadow:'0 0 6px #00ffaa'}}/>
                </div>
              )}
              {hasData&&(
                <button title="Reset everything" onClick={()=>{
                  if(!confirm('Reset everything? This will clear all blueprints, maps, and settings.'))return;
                  localStorage.removeItem(STORAGE_KEY);
                  reset({yardSqFt:10000,familySize:4,climateZone:'Temperate',budget:2800,prompt:''});
                  setApiBlueprint(null);setBlueprints(RESET_BLUEPRINTS);
                  setPropIdx(0);setGardIdx(0);setRbIdx(0);
                  setMapSubTab('property');setFormOpen(false);setActiveTab('dashboard');
                }} style={{
                  width:34,height:34,borderRadius:9,cursor:'pointer',
                  display:'flex',alignItems:'center',justifyContent:'center',
                  color:'var(--red)',background:'rgba(239,68,68,0.07)',
                  border:'1px solid rgba(239,68,68,0.18)',
                }}>
                  <RotateCcw style={{width:14,height:14}}/>
                </button>
              )}
              <button title="Export PDF" onClick={exportPDF} disabled={!hasData} style={{
                width:34,height:34,borderRadius:9,cursor:hasData?'pointer':'default',
                display:'flex',alignItems:'center',justifyContent:'center',
                color:hasData?'var(--amber)':'var(--ts)',
                background:hasData?'rgba(245,158,11,0.09)':'rgba(255,255,255,0.03)',
                border:`1px solid ${hasData?'rgba(245,158,11,0.25)':'rgba(255,255,255,0.06)'}`,
                opacity:hasData?1:0.4,
              }}>
                <Download style={{width:14,height:14}}/>
              </button>
              <button title="Share blueprint" onClick={shareBlueprint} disabled={!hasData} style={{
                width:34,height:34,borderRadius:9,cursor:hasData?'pointer':'default',
                display:'flex',alignItems:'center',justifyContent:'center',
                color:hasData?'var(--cyan)':'var(--ts)',
                background:hasData?'rgba(0,238,255,0.08)':'rgba(255,255,255,0.03)',
                border:`1px solid ${hasData?'rgba(0,238,255,0.22)':'rgba(255,255,255,0.06)'}`,
                opacity:hasData?1:0.4,
              }}>
                <Share2 style={{width:14,height:14}}/>
              </button>
              <button title="Shopping list" onClick={openShoppingList} disabled={!hasData} style={{
                width:34,height:34,borderRadius:9,cursor:hasData?'pointer':'default',
                display:'flex',alignItems:'center',justifyContent:'center',fontSize:15,
                color:hasData?'#a78bfa':'var(--ts)',
                background:hasData?'rgba(167,139,250,0.10)':'rgba(255,255,255,0.03)',
                border:`1px solid ${hasData?'rgba(167,139,250,0.28)':'rgba(255,255,255,0.06)'}`,
                opacity:hasData?1:0.4,
              }}>
                🛒
              </button>
              <button title="Account" onClick={()=>setShowLogin(true)} style={{
                width:34,height:34,borderRadius:9,cursor:'pointer',
                display:'flex',alignItems:'center',justifyContent:'center',
                background:'rgba(0,255,170,0.14)',border:'1px solid rgba(0,255,170,0.38)',
                boxShadow:'0 0 14px rgba(0,255,170,0.15)',fontSize:15,
              }}>👤</button>
              {isPro&&(
                <span style={{
                  fontSize:9,fontWeight:700,padding:'2px 8px',borderRadius:99,
                  background:'rgba(0,255,130,0.12)',border:'1px solid rgba(0,255,130,0.28)',
                  color:'#00ff82',letterSpacing:'.14em',textTransform:'uppercase',
                  fontFamily:"'Courier New',monospace",whiteSpace:'nowrap',
                }}>PRO</span>
              )}
            </div>
          </nav>
        )}

        {/* ==== MOBILE TOP BAR (sticky, icon-only) ==== */}
        {isMobile&&(
          <div style={{
            position:'sticky',top:0,zIndex:200,
            display:'flex',alignItems:'center',
            height:48,padding:'0 10px',gap:6,
            background:'linear-gradient(160deg,rgba(10,46,28,0.99) 0%,rgba(12,28,48,0.99) 60%,rgba(18,8,50,0.98) 100%)',
            backdropFilter:'blur(20px)',
            borderBottom:'1px solid rgba(0,255,170,0.12)',
            width:'100%',maxWidth:'100%',boxSizing:'border-box',overflow:'hidden',left:0,
          }}>
            <Sprout style={{width:16,height:16,color:'#00ffaa',flexShrink:0}}/>
            <span style={{fontSize:11,fontWeight:800,letterSpacing:'.14em',color:'#00ffaa',
              fontFamily:"'Space Grotesk',sans-serif",flex:1,minWidth:0,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
              TERRAFORGE{isPro&&<span style={{marginLeft:6,fontSize:7,fontWeight:700,
                padding:'1px 5px',borderRadius:99,
                background:'rgba(0,255,130,0.15)',border:'1px solid rgba(0,255,130,0.30)',
                color:'#00ff82',letterSpacing:'.1em',verticalAlign:'middle'}}>PRO</span>}
            </span>
            <button onClick={()=>setFormOpen((v:boolean)=>!v)}
              style={{width:34,height:34,borderRadius:9,cursor:'pointer',flexShrink:0,
                display:'flex',alignItems:'center',justifyContent:'center',
                color:formOpen?'var(--void)':'#00ffaa',
                background:formOpen?'#00ffaa':'rgba(0,255,170,0.10)',
                border:'1px solid rgba(0,255,170,0.30)',
              }}>
              <Settings style={{width:15,height:15}}/>
            </button>
            {hasData&&(
              <button onClick={()=>{
                if(!confirm('Reset everything?'))return;
                localStorage.removeItem(STORAGE_KEY);
                reset({yardSqFt:10000,familySize:4,climateZone:'Temperate',budget:2800,prompt:''});
                setApiBlueprint(null);setBlueprints(RESET_BLUEPRINTS);
                setPropIdx(0);setGardIdx(0);setRbIdx(0);
                setMapSubTab('property');setFormOpen(false);setActiveTab('dashboard');
              }} style={{width:34,height:34,borderRadius:9,cursor:'pointer',flexShrink:0,
                display:'flex',alignItems:'center',justifyContent:'center',
                color:'var(--red)',background:'rgba(239,68,68,0.08)',
                border:'1px solid rgba(239,68,68,0.22)',
              }}>
                <RotateCcw style={{width:14,height:14}}/>
              </button>
            )}
            <button onClick={exportPDF} disabled={!hasData}
              style={{width:34,height:34,borderRadius:9,cursor:hasData?'pointer':'default',flexShrink:0,
                display:'flex',alignItems:'center',justifyContent:'center',
                color:hasData?'var(--amber)':'var(--ts)',
                background:hasData?'rgba(245,158,11,0.09)':'rgba(255,255,255,0.03)',
                border:'1px solid rgba(245,158,11,0.22)',
                opacity:hasData?1:0.35,
              }}>
              <Download style={{width:14,height:14}}/>
            </button>
            <button onClick={shareBlueprint} disabled={!hasData}
              style={{width:34,height:34,borderRadius:9,cursor:hasData?'pointer':'default',flexShrink:0,
                display:'flex',alignItems:'center',justifyContent:'center',
                color:hasData?'var(--cyan)':'var(--ts)',
                background:hasData?'rgba(0,238,255,0.08)':'rgba(255,255,255,0.03)',
                border:'1px solid rgba(0,238,255,0.22)',
                opacity:hasData?1:0.35,
              }}>
              <Share2 style={{width:14,height:14}}/>
            </button>
            <button onClick={openShoppingList} disabled={!hasData}
              style={{width:34,height:34,borderRadius:9,cursor:hasData?'pointer':'default',flexShrink:0,
                display:'flex',alignItems:'center',justifyContent:'center',fontSize:15,
                color:hasData?'#a78bfa':'var(--ts)',
                background:hasData?'rgba(167,139,250,0.10)':'rgba(255,255,255,0.03)',
                border:'1px solid rgba(167,139,250,0.24)',
                opacity:hasData?1:0.35,
              }}>
              🛒
            </button>
            <button onClick={()=>setShowLogin(true)}
              style={{width:34,height:34,borderRadius:9,cursor:'pointer',flexShrink:0,
                display:'flex',alignItems:'center',justifyContent:'center',
                background:'rgba(0,255,170,0.10)',border:'1px solid rgba(0,255,170,0.28)',fontSize:15,
              }}>👤</button>
          </div>
        )}

        {/* ==== MOBILE BOTTOM TAB BAR ==== */}
        {isMobile&&(
          <nav style={{
            position:'fixed',bottom:0,left:0,right:0,
            width:'100%',
            height:56,zIndex:200,
            display:'flex',alignItems:'stretch',
            overflowX:'auto',scrollbarWidth:'none',
            background:'linear-gradient(160deg,rgba(10,46,28,0.99) 0%,rgba(12,28,48,0.99) 60%,rgba(18,8,50,0.98) 100%)',
            backdropFilter:'blur(20px)',
            borderTop:'1px solid rgba(0,255,170,0.18)',
            boxShadow:'0 -4px 24px rgba(0,0,0,0.35)',
            boxSizing:'border-box',overflow:'hidden',
          }}>
            {TABS.map(({id,label,Icon})=>{
              const on=activeTab===id;
              const proOnly=!isPro&&(id==='roi'||id==='deploy'||id==='blueprints'||id==='calendar'||id==='property');
              return(
                <button key={id} onClick={()=>{setActiveTab(id);window.scrollTo({top:0,behavior:'smooth'});}}
                  style={{
                    flex:'0 0 auto',minWidth:52,display:'flex',flexDirection:'column',
                    alignItems:'center',justifyContent:'center',
                    gap:2,padding:'4px 2px',
                    cursor:'pointer',border:'none',
                    color:on?'#00ffaa':proOnly?'rgba(175,225,195,0.40)':'rgba(175,225,195,0.55)',
                    background:on?'rgba(0,255,170,0.08)':'transparent',
                    borderTop:on?'2px solid #00ffaa':'2px solid transparent',
                  }}>
                  <div style={{position:'relative',display:'flex',alignItems:'center',justifyContent:'center'}}>
                    <Icon style={{width:20,height:20,flexShrink:0}}/>
                    {proOnly&&<span style={{
                      position:'absolute',top:-4,right:-6,
                      fontSize:8,lineHeight:1,
                    }}>🔒</span>}
                  </div>
                  <span style={{fontSize:7,fontWeight:600,lineHeight:1,
                    overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',
                    maxWidth:'100%',paddingLeft:1,paddingRight:1,
                  }}>{label}</span>
                </button>
              );
            })}
          </nav>
        )}


        {/* ==== PAGE BODY ==== */}
        <div style={{position:'relative',zIndex:1,maxWidth:1560,margin:'0 auto',padding:isMobile?'12px 10px 100px':'20px 22px 52px',overflowX:'hidden'}}>

          {/* -- CONFIG FORM (collapsible) --------------------------- */}
          {formOpen&&(
            <div className="a-fadeUp" style={{
              marginBottom:18,borderRadius:22,overflow:'hidden',
              background:'rgba(14,30,20,0.76)',
              border:'1px solid rgba(0,255,170,0.10)',
              backdropFilter:'blur(40px) saturate(1.8) brightness(1.24)',
              boxShadow:'0 1px 0 rgba(0,255,170,0.05) inset,0 20px 60px rgba(0,0,0,0.28)',
            }}>
              {/* Form header */}
              <div style={{
  display:'flex',alignItems:'center',justifyContent:'space-between',
  padding:'11px 20px',
  background:'rgba(0,255,170,0.02)',
  borderBottom:'1px solid rgba(0,255,170,0.12)',
}}>
                <div style={{display:'flex',alignItems:'center',gap:8}}>
                  <div className="a-pulse" style={{width:5,height:5,borderRadius:'50%',
                    background:'#00ffaa',boxShadow:'0 0 6px #00ffaa'}}/>
                  <span style={{fontSize:9,fontWeight:800,letterSpacing:'.16em',color:'#00ffaa',
                    fontFamily:"'Space Grotesk',sans-serif",textTransform:'uppercase'}}>Configure Your Homestead</span>
                </div>
                <div style={{display:'flex',alignItems:'center',gap:8}}>
                  {/* Reset -- clears everything back to defaults */}
                  <button
                    type="button"
                    onClick={()=>{
                      if(!confirm('Reset everything? This will clear all blueprints, maps, and settings.'))return;
                      localStorage.removeItem(STORAGE_KEY);
                      reset({yardSqFt:10000,familySize:4,climateZone:'Temperate',budget:2800,prompt:''});
                      setApiBlueprint(null);
                      setBlueprints(RESET_BLUEPRINTS);
                      setPropIdx(0);setGardIdx(0);setRbIdx(0);
                      setMapSubTab('property');
                      setFormOpen(false);
                      setActiveTab('dashboard');
                    }}
                    title="Reset everything to defaults"
                    style={{
                      display:'flex',alignItems:'center',gap:5,
                      padding:'4px 10px',borderRadius:8,cursor:'pointer',
                      fontFamily:"'JetBrains Mono',monospace",fontSize:8,fontWeight:700,
                      letterSpacing:'.10em',textTransform:'uppercase',
                      background:'rgba(239,68,68,0.07)',border:'1px solid rgba(239,68,68,0.18)',
                      color:'var(--red)',transition:'transform 0.15s ease,opacity 0.15s ease,border-color 0.15s ease,box-shadow 0.15s ease',
                    }}
                    onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background='rgba(239,68,68,0.14)';(e.currentTarget as HTMLElement).style.borderColor='rgba(239,68,68,0.35)';}}
                    onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background='rgba(239,68,68,0.07)';(e.currentTarget as HTMLElement).style.borderColor='rgba(239,68,68,0.18)';}}>
                    <RotateCcw style={{width:9,height:9}}/> RESET
                  </button>
                  {/* Close */}
                  {hasData&&(
                    <button onClick={()=>setFormOpen(false)} style={{
                      width:24,height:24,borderRadius:7,cursor:'pointer',
                      display:'flex',alignItems:'center',justifyContent:'center',
                      background:'rgba(0,255,170,0.05)',border:'1px solid rgba(0,255,170,0.24)',
                      color:'var(--tf)',transition:'transform 0.15s ease,opacity 0.15s ease,border-color 0.15s ease,box-shadow 0.15s ease',
                    }}
                    onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background='rgba(0,255,170,0.10)';}}
                    onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background='rgba(0,255,170,0.05)';}}>
                      <X style={{width:11,height:11}}/>
                    </button>
                  )}
                </div>
              </div>

              <form onSubmit={handleSubmit(onGenerate)}>
                {/* 3-column form layout */}
                <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 1fr 2fr'}}>

                  {/* -- Col 1: Property -- */}
                  <div style={{padding:'22px 24px 24px',borderRight:'1px solid rgba(0,255,170,0.06)'}}>
                    <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:18}}>
                      <div style={{width:3,height:16,borderRadius:2,background:'linear-gradient(180deg,#00ffaa,#00d4ff)',boxShadow:'0 0 8px rgba(0,255,170,0.40)'}}/>
                      <span style={{fontSize:12,fontWeight:700,letterSpacing:'.06em',color:'var(--td)',
                        fontFamily:"'Space Grotesk',sans-serif"}}>Property</span>
                    </div>
                    <div style={{display:'flex',flexDirection:'column',gap:16}}>
                      {([
                        {label:'Area (sq ft)',  key:'yardSqFt'   as const,min:500,  max:200000,step:500},
                        {label:'Family size',   key:'familySize' as const,min:1,    max:20,    step:1},
                        {label:'Budget (USD)',  key:'budget'     as const,min:500,  max:100000,step:500},
                      ]).map(({label,key,min,max,step})=>(
                        <div key={key}>
                          <label style={{display:'block',fontSize:12,letterSpacing:'.03em',color:'var(--td)',
                            fontFamily:"'Inter',sans-serif",fontWeight:600,marginBottom:8}}>{label}</label>
                          <StepInput
                            value={Number(fv[key])||0}
                            onChange={n=>setValue(key,n,{shouldValidate:true})}
                            min={min} max={max} step={step}/>
                          {errors[key]&&<p style={{fontSize:8,color:'var(--red)',marginTop:3,
                            fontFamily:"'JetBrains Mono',monospace"}}>{errors[key]?.message}</p>}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* -- Col 2: Climate -- */}
                  <div style={{padding:'22px 24px 24px',borderRight:'1px solid rgba(0,255,170,0.06)'}}>
                    <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:18}}>
                      <div style={{width:3,height:16,borderRadius:2,background:'linear-gradient(180deg,#00d4ff,#7c3aed)',boxShadow:'0 0 8px rgba(0,213,255,0.40)'}}/>
                      <span style={{fontSize:12,fontWeight:700,letterSpacing:'.06em',color:'var(--td)',
                        fontFamily:"'Space Grotesk',sans-serif"}}>Climate Zone</span>
                    </div>
                    <label style={{display:'block',fontSize:8,letterSpacing:'.12em',color:'var(--ts)',
                      fontFamily:"'JetBrains Mono',monospace",marginBottom:5,textTransform:'uppercase'}}>Zone</label>
                    <select {...register('climateZone')} className="tf-in" style={{
                      width:'100%',padding:'8px 11px',borderRadius:9,marginBottom:12,
                      background:'rgba(0,255,170,0.03)',border:'1px solid rgba(0,255,170,0.10)',
                      color:'var(--tp)',fontSize:12,fontFamily:"'Inter',sans-serif",
                    }}>
                      {['Temperate','Arid','Subtropical','Cold','Tropical'].map(z=>(
                        <option key={z} value={z} style={{background:'#040e08'}}>{z}</option>
                      ))}
                    </select>
                    {/* Zone description card */}
                    <div style={{padding:'14px 16px',borderRadius:12,
                      background:'rgba(0,213,255,0.04)',border:'1px solid rgba(0,213,255,0.09)'}}>
                      <div style={{fontSize:11,letterSpacing:'.04em',color:'var(--cyan2)',marginBottom:7,
                        fontFamily:"'Space Grotesk',sans-serif",fontWeight:700}}>Zone Profile</div>
                      <p style={{fontSize:14,color:'var(--td)',lineHeight:1.70,fontFamily:"'Inter',sans-serif",margin:0}}>
                        {fv.climateZone==='Temperate'&&'4 distinct seasons · Moderate rainfall · Year-round growing with cold protection'}
                        {fv.climateZone==='Arid'&&'Hot dry summers · Low rainfall · Shade cloth & water harvesting are critical'}
                        {fv.climateZone==='Subtropical'&&'Warm year-round · High humidity · Ideal for tropical fruit trees & perennials'}
                        {fv.climateZone==='Cold'&&'Long winters · Short growing season · Cold frames & root cellars essential'}
                        {!fv.climateZone&&'Select a zone to see your growing profile'}
                      </p>
                    </div>
                  </div>

                  {/* -- Col 3: Goal prompt -- */}
                  <div style={{padding:'22px 24px 24px',display:'flex',flexDirection:'column',gap:14}}>
                    <div style={{display:'flex',alignItems:'center',gap:7}}>
                      <div style={{width:2,height:13,borderRadius:2,background:'linear-gradient(180deg,#00ffaa,#a0ff60)'}}/>
                      <span style={{fontSize:11,fontWeight:700,letterSpacing:'.06em',color:'var(--tf)',
                        fontFamily:"'Space Grotesk',sans-serif"}}>Describe Your Vision</span>
                    </div>
                    <textarea {...register('prompt')} rows={3}
                      placeholder="Describe your homestead — crops, animals, water systems, energy goals, self-sufficiency targets..."
                      className="tf-in"
                      style={{
                        width:'100%',padding:'14px 16px',borderRadius:12,resize:'none',
                        background:'rgba(0,255,170,0.025)',border:'1px solid rgba(0,255,170,0.12)',
                        color:'var(--tp)',fontSize:15,lineHeight:1.75,
                        fontFamily:"'Inter',sans-serif",
                      }}/>
                    <ExamplePrompts onSelect={v=>setValue('prompt',v,{shouldValidate:false})} currentVal={fv.prompt??''}/>
                    {/* Add to Blueprint toggle — only show if hasData */}
                    {hasData&&(
                    <div style={{marginTop:'auto',marginBottom:8}}>
                      <button type="button" onClick={()=>setAddMode((v:boolean)=>!v)}
                        style={{
                          width:'100%',padding:'11px 14px',borderRadius:14,
                          display:'flex',alignItems:'center',gap:12,cursor:'pointer',
                          transition:'all 0.22s cubic-bezier(0.22,1,0.36,1)',
                          position:'relative',overflow:'hidden',
                          background:addMode
                            ?'linear-gradient(135deg,rgba(251,191,36,0.16) 0%,rgba(255,120,0,0.08) 100%)'
                            :'linear-gradient(135deg,rgba(255,255,255,0.04) 0%,rgba(255,255,255,0.02) 100%)',
                          border:addMode
                            ?'1.5px solid rgba(251,191,36,0.60)'
                            :'1.5px solid rgba(255,255,255,0.09)',
                          boxShadow:addMode
                            ?'0 0 28px rgba(251,191,36,0.18),inset 0 1px 0 rgba(251,191,36,0.12)'
                            :'inset 0 1px 0 rgba(255,255,255,0.04)',
                        }}>
                        {/* Shimmer line when active */}
                        {addMode&&<div style={{position:'absolute',top:0,left:0,right:0,height:1,
                          backgroundImage:'linear-gradient(90deg,transparent,rgba(251,191,36,0.90),transparent)'}}/>}
                        {/* Icon */}
                        <div style={{
                          width:32,height:32,borderRadius:10,flexShrink:0,
                          display:'flex',alignItems:'center',justifyContent:'center',
                          background:addMode?'rgba(251,191,36,0.18)':'rgba(255,255,255,0.05)',
                          border:addMode?'1px solid rgba(251,191,36,0.35)':'1px solid rgba(255,255,255,0.08)',
                          fontSize:15,transition:'all 0.22s',
                        }}>➕</div>
                        {/* Text */}
                        <div style={{textAlign:'left',flex:1,minWidth:0}}>
                          <div style={{
                            fontSize:12,fontWeight:700,letterSpacing:'.02em',
                            fontFamily:"'Space Grotesk',sans-serif",
                            color:addMode?'#fbbf24':'rgba(220,240,230,0.60)',
                            transition:'color 0.22s',
                          }}>
                            {addMode?'Adding to blueprint':'Add to existing'}
                          </div>
                          <div style={{
                            fontSize:10,marginTop:2,letterSpacing:'.03em',
                            fontFamily:"'Inter',sans-serif",
                            color:addMode?'rgba(251,191,36,0.60)':'rgba(255,255,255,0.22)',
                            transition:'color 0.22s',
                          }}>
                            {addMode?'Existing tiles preserved':'New prompt adds, not replaces'}
                          </div>
                        </div>
                        {/* Toggle */}
                        <div style={{
                          width:36,height:20,borderRadius:99,flexShrink:0,
                          background:addMode
                            ?'linear-gradient(135deg,#fbbf24,#f59e0b)'
                            :'rgba(255,255,255,0.10)',
                          position:'relative',transition:'all 0.22s',
                          border:addMode?'none':'1px solid rgba(255,255,255,0.16)',
                          boxShadow:addMode?'0 2px 8px rgba(251,191,36,0.40)':'none',
                        }}>
                          <div style={{
                            position:'absolute',top:3,
                            left:addMode?17:3,
                            width:14,height:14,borderRadius:'50%',
                            background:addMode?'#1a0e00':'rgba(255,255,255,0.55)',
                            transition:'left 0.22s cubic-bezier(0.22,1,0.36,1)',
                            boxShadow:addMode?'0 0 6px rgba(251,191,36,0.60)':'none',
                          }}/>
                        </div>
                      </button>
                    </div>
                    )}

                    {/* BASE vs AI toggle */}
                    <div style={{display:'flex',gap:8}}>
                      <button type="button" onClick={()=>setUseAI(false)}
                        style={{
                          flex:1,padding:'13px 10px',borderRadius:12,
                          display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:5,
                          cursor:'pointer',transition:'all 0.20s',position:'relative',overflow:'hidden',
                          background:!useAI
                            ?'linear-gradient(135deg,rgba(167,139,250,0.22) 0%,rgba(120,80,255,0.12) 100%)'
                            :'rgba(255,255,255,0.03)',
                          border:!useAI?'1.5px solid rgba(167,139,250,0.70)':'1.5px solid rgba(255,255,255,0.10)',
                          boxShadow:!useAI?'0 0 24px rgba(167,139,250,0.30),inset 0 1px 0 rgba(167,139,250,0.20)':'none',
                        }}>
                        {!useAI&&<div style={{position:'absolute',top:0,left:0,right:0,height:1,
                          backgroundImage:'linear-gradient(90deg,transparent,rgba(167,139,250,0.8),transparent)'}}/>}
                        <span style={{fontSize:20,lineHeight:1}}>⚡</span>
                        <div style={{fontSize:12,fontWeight:900,letterSpacing:'.08em',
                          color:!useAI?'#c4b5fd':'rgba(255,255,255,0.35)',
                          fontFamily:"'Space Grotesk',sans-serif",lineHeight:1}}>BASE</div>
                        <div style={{fontSize:9,color:!useAI?'rgba(196,181,253,0.70)':'rgba(255,255,255,0.22)',
                          fontFamily:"'JetBrains Mono',monospace",letterSpacing:'.05em',lineHeight:1}}>
                          Instant · Free
                        </div>
                      </button>
                      <button type="button" onClick={()=>setUseAI(true)}
                        style={{
                          flex:1,padding:'13px 10px',borderRadius:12,
                          display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:5,
                          cursor:'pointer',transition:'all 0.20s',position:'relative',overflow:'hidden',
                          background:useAI
                            ?'linear-gradient(135deg,rgba(0,255,170,0.18) 0%,rgba(0,180,120,0.08) 100%)'
                            :'rgba(255,255,255,0.03)',
                          border:useAI?'1.5px solid rgba(0,255,170,0.65)':'1.5px solid rgba(255,255,255,0.10)',
                          boxShadow:useAI?'0 0 24px rgba(0,255,170,0.25),inset 0 1px 0 rgba(0,255,170,0.18)':'none',
                        }}>
                        {useAI&&<div style={{position:'absolute',top:0,left:0,right:0,height:1,
                          backgroundImage:'linear-gradient(90deg,transparent,rgba(0,255,170,0.8),transparent)'}}/>}
                        <span style={{fontSize:20,lineHeight:1}}>🤖</span>
                        <div style={{fontSize:12,fontWeight:900,letterSpacing:'.08em',
                          color:useAI?'#00ffaa':'rgba(255,255,255,0.35)',
                          fontFamily:"'Space Grotesk',sans-serif",lineHeight:1}}>AI</div>
                        <div style={{fontSize:9,color:useAI?'rgba(0,255,170,0.65)':'rgba(255,255,255,0.22)',
                          fontFamily:"'JetBrains Mono',monospace",letterSpacing:'.05em',lineHeight:1}}>
                          Claude · Smart
                        </div>
                      </button>
                    </div>
                    <button type="submit" disabled={loading} className="gen-btn"
                      style={{padding:'12px 20px',borderRadius:12,display:'flex',alignItems:'center',
                        justifyContent:'center',gap:9,opacity:loading?0.75:1}}>
                      {loading
                        ? <><div className="a-pulse" style={{width:7,height:7,borderRadius:'50%',background:'#00ffaa'}}/>
                            <span style={{fontSize:12,letterSpacing:'.10em',color:'#00ffaa',
                              fontFamily:"'Space Grotesk',sans-serif",fontWeight:800}}>
                              {useAI?'AI Generating…':'Calculating…'}</span></>
                        : <><Zap style={{width:14,height:14,color:'#00ffaa'}}/>
                            <span style={{fontSize:12,letterSpacing:'.10em',color:'#00ffaa',
                              fontFamily:"'Space Grotesk',sans-serif",fontWeight:800}}>
                              {useAI?'Generate with AI':'Generate Base Blueprint'}</span></>
                      }
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* -- LOADING MODAL OVERLAY -- */}
          {loading&&createPortal(
            <div style={{
              position:'fixed',inset:0,zIndex:99999,
              display:'flex',alignItems:'center',justifyContent:'center',
              background:'rgba(0,8,4,0.85)',backdropFilter:'blur(12px)',
            }}>
              <div style={{
                padding:'40px 52px',borderRadius:28,textAlign:'center',
                background:'linear-gradient(160deg,rgba(0,40,24,0.97) 0%,rgba(0,12,28,0.98) 100%)',
                border:'1px solid rgba(0,255,170,0.25)',
                boxShadow:'0 0 80px rgba(0,255,170,0.15),0 40px 80px rgba(0,0,0,0.6)',
                display:'flex',flexDirection:'column',alignItems:'center',gap:20,
                minWidth:280,
              }}>
                {/* Animated rings */}
                <div style={{position:'relative',width:72,height:72}}>
                  <div style={{position:'absolute',inset:0,borderRadius:'50%',
                    border:'2px solid rgba(0,255,170,0.15)'}}/>
                  <div style={{position:'absolute',inset:4,borderRadius:'50%',
                    border:'2px solid transparent',
                    borderTopColor:'#00ffaa',borderRightColor:'rgba(0,255,170,0.3)',
                    animation:'spin 1s linear infinite'}}/>
                  <div style={{position:'absolute',inset:10,borderRadius:'50%',
                    border:'2px solid transparent',
                    borderTopColor:'#a78bfa',borderRightColor:'rgba(167,139,250,0.3)',
                    animation:'spin 1.4s linear infinite reverse'}}/>
                  <div style={{position:'absolute',inset:0,display:'flex',
                    alignItems:'center',justifyContent:'center',
                    fontSize:22}}>{useAI?'🤖':'⚡'}</div>
                </div>
                <div>
                  <div style={{fontSize:16,fontWeight:800,color:'var(--tp)',
                    fontFamily:"'Space Grotesk',sans-serif",letterSpacing:'.04em',marginBottom:6}}>
                    {useAI?'AI Blueprint Generating':'Calculating Blueprint'}
                  </div>
                  <div style={{fontSize:11,color:'rgba(0,255,170,0.55)',
                    fontFamily:"'JetBrains Mono',monospace",letterSpacing:'.06em'}}>
                    {useAI?'Claude is designing your homestead…':'Running permaculture calculations…'}
                  </div>
                </div>
                {useAI&&(
                  <div style={{fontSize:10,color:'rgba(0,255,170,0.30)',
                    fontFamily:"'JetBrains Mono',monospace",letterSpacing:'.04em',
                    lineHeight:1.6,maxWidth:220,textAlign:'center'}}>
                    Analysing land size, climate,<br/>budget &amp; goals…
                  </div>
                )}
              </div>
            </div>,
            document.body
          )}

          {/* -- TAB CONTENT ----------------------------------------- */}

          {/* ========== DASHBOARD ================================== */}
          {activeTab==='dashboard'&&(
            <div className="a-fadeUp" style={{display:'flex',flexDirection:'column',gap:14,position:'relative'}}>
              <div aria-hidden style={{position:'fixed',top:'-10%',left:'-8%',width:700,height:700,borderRadius:'50%',
                background:'radial-gradient(circle at 35% 35%,rgba(0,255,170,0.22) 0%,transparent 55%)',
                pointerEvents:'none',zIndex:0,animation:'orb 40s ease-in-out infinite'}}/>
              <div aria-hidden style={{position:'fixed',bottom:'-15%',right:'-10%',width:600,height:600,borderRadius:'50%',
                background:'radial-gradient(circle at 60% 60%,rgba(120,80,255,0.20) 0%,transparent 55%)',
                pointerEvents:'none',zIndex:0,animation:'orb2 50s ease-in-out infinite'}}/>
              <div aria-hidden style={{position:'fixed',top:'40%',right:'2%',width:300,height:300,borderRadius:'50%',
                background:'radial-gradient(circle,rgba(0,238,255,0.16) 0%,transparent 65%)',
                pointerEvents:'none',zIndex:0,animation:'orb 30s ease-in-out infinite 6s'}}/>

              {/* -- WELCOME STATE -- */}
              {!hasData&&(
                <div style={{position:'relative',overflow:'hidden',borderRadius:28,
                  minHeight:'90vh',display:'flex',flexDirection:'column',
                  background:'linear-gradient(160deg,rgba(8,62,38,0.98) 0%,rgba(10,32,58,0.98) 60%,rgba(18,8,60,0.97) 100%)',
                  border:'1px solid rgba(0,255,170,0.24)',
                  boxShadow:'0 0 180px rgba(0,255,170,0.18),0 60px 120px rgba(0,0,0,0.4)',
                }}>

                  {/* ── Ambient layers ── */}
                  {/* Large green orb top-left */}
                  <div aria-hidden style={{position:'absolute',top:'-20%',left:'-10%',width:900,height:900,borderRadius:'50%',
                    background:'radial-gradient(circle at 35% 35%,rgba(0,255,170,0.28) 0%,transparent 55%)',
                    animation:'orb 32s ease-in-out infinite',pointerEvents:'none'}}/>
                  {/* Purple orb bottom-right */}
                  <div aria-hidden style={{position:'absolute',bottom:'-25%',right:'-12%',width:800,height:800,borderRadius:'50%',
                    background:'radial-gradient(circle at 60% 60%,rgba(120,80,255,0.22) 0%,transparent 55%)',
                    animation:'orb2 40s ease-in-out infinite',pointerEvents:'none'}}/>
                  {/* Cyan orb center-right */}
                  <div aria-hidden style={{position:'absolute',top:'35%',right:'5%',width:400,height:400,borderRadius:'50%',
                    background:'radial-gradient(circle,rgba(0,238,255,0.18) 0%,transparent 65%)',
                    animation:'orb 24s ease-in-out infinite 8s',pointerEvents:'none'}}/>
                  {/* Amber accent bottom-left */}
                  <div aria-hidden style={{position:'absolute',bottom:'10%',left:'8%',width:300,height:300,borderRadius:'50%',
                    background:'radial-gradient(circle,rgba(251,191,36,0.14) 0%,transparent 65%)',
                    animation:'orb2 28s ease-in-out infinite 4s',pointerEvents:'none'}}/>

                  {/* Fine dot-grid */}
                  <div aria-hidden style={{position:'absolute',inset:0,
                    backgroundImage:'radial-gradient(rgba(0,255,170,0.45) 1px,transparent 1px)',
                    backgroundSize:'40px 40px',opacity:0.70,pointerEvents:'none'}}/>

                  {/* Top chromatic edge */}
                  <div aria-hidden style={{position:'absolute',top:0,left:0,right:0,height:2,
                    backgroundImage:'linear-gradient(90deg,transparent 0%,rgba(167,139,250,0.9) 15%,rgba(0,255,170,1) 35%,rgba(34,211,238,1) 52%,rgba(251,191,36,0.8) 68%,rgba(167,139,250,0.9) 85%,transparent 100%)',
                    backgroundSize:'300% 100%',animation:'borderFlow 8s linear infinite',
                    boxShadow:'0 0 40px rgba(0,255,170,0.6)',filter:'blur(0.5px)'}}/>

                  {/* Bottom edge glow */}
                  <div aria-hidden style={{position:'absolute',bottom:0,left:'10%',right:'10%',height:1,
                    background:'linear-gradient(90deg,transparent,rgba(0,255,170,0.3) 50%,transparent)'}}/>

                  {/* Diagonal scan line — decorative */}
                  <div aria-hidden style={{position:'absolute',top:0,left:0,right:0,bottom:0,
                    background:'repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,255,170,0.008) 3px,rgba(0,255,170,0.008) 4px)',
                    pointerEvents:'none',animation:'scanline 8s linear infinite'}}/>

                  {/* ── MAIN LAYOUT ── */}
                  <div style={{position:'relative',zIndex:1,display:'flex',flexDirection:'column',flex:1}}>

                    {/* ═══ HERO SECTION ═══ */}
                    <div style={{
                      display:'grid',
                      gridTemplateColumns:isMobile?'1fr':'1.05fr 0.95fr',
                      flex:1,
                      minHeight:isMobile?300:'62vh',
                      overflow:'hidden',
                    }}>

                      {/* LEFT — Hero copy */}
                      <div style={{
                        display:'flex',flexDirection:'column',justifyContent:'center',
                        padding:isMobile?'40px 24px 32px':'80px 60px 64px 60px',
                      }}>

                        {/* Eyebrow badge */}
                        <div className="a-fadeUp" style={{display:'inline-flex',alignItems:'center',gap:8,
                          marginBottom:32,alignSelf:'flex-start',
                          padding:'7px 14px 7px 9px',borderRadius:99,
                          background:'rgba(0,255,170,0.12)',border:'1px solid rgba(0,255,170,0.38)',
                          backdropFilter:'blur(12px)',
                        }}>
                          <div style={{width:6,height:6,borderRadius:'50%',background:'#00ffaa',
                            boxShadow:'0 0 10px #00ffaa',animation:'breathe 2s ease-in-out infinite'}}/>
                          <span style={{fontSize:10,fontWeight:700,letterSpacing:'.18em',
                            color:'rgba(0,255,170,0.80)',fontFamily:"'JetBrains Mono',monospace",
                            textTransform:'uppercase'}}>Earth Stewardship Intelligence</span>
                        </div>

                        {/* Main headline */}
                        <h1 className="a-fadeUp" style={{
                          fontSize:isMobile?38:68,fontWeight:800,lineHeight:1.0,letterSpacing:'-.03em',
                          fontFamily:"'Space Grotesk',sans-serif",
                          margin:'0 0 8px',color:'var(--tp)',
                          animationDelay:'60ms',
                        }}>
                          Design Your
                        </h1>
                        <h1 className="a-fadeUp" style={{
                          fontSize:isMobile?38:68,fontWeight:800,lineHeight:1.0,letterSpacing:'-.03em',
                          fontFamily:"'Space Grotesk',sans-serif",
                          margin:'0 0 28px',
                          backgroundImage:'linear-gradient(135deg,#00ffaa 0%,#22d3ee 40%,#a78bfa 75%,#00ffaa 100%)',
                          backgroundSize:'200% auto',
                          WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text',
                          animation:'shimmerText 5s linear infinite',
                          animationDelay:'120ms',
                          filter:'drop-shadow(0 0 40px rgba(0,255,170,0.25))',
                        }}>
                          Self-Sufficient<br/>Homestead
                        </h1>

                        {/* Subheadline */}
                        <p className="a-fadeUp" style={{
                          fontSize:isMobile?15:18,fontWeight:300,lineHeight:1.75,
                          color:'rgba(200,240,220,0.88)',fontFamily:"'Inter',sans-serif",
                          margin:'0 0 40px',maxWidth:460,
                          animationDelay:'180ms',
                        }}>
                          The AI-powered permaculture planner that maps your land, models food yields, calculates financial returns, and generates a phase-by-phase deployment plan.
                        </p>

                        {/* CTA row */}
                        <div className="a-fadeUp" style={{display:'flex',alignItems:'center',gap:16,flexWrap:'wrap',animationDelay:'240ms'}}>
                          <button onClick={()=>setFormOpen(true)} className="gen-btn"
                            style={{padding:isMobile?'14px 28px':'18px 40px',borderRadius:16,
                              display:'inline-flex',alignItems:'center',gap:10,
                              fontSize:13,fontWeight:700,letterSpacing:'.10em',
                              boxShadow:'0 0 40px rgba(0,255,170,0.30),0 8px 32px rgba(0,0,0,0.40)',
                            }}>
                            <Sprout style={{width:16,height:16,color:'#00ffaa'}}/>
                            <span style={{color:'#00ffaa',fontFamily:"'Space Grotesk',sans-serif",textTransform:'uppercase'}}>
                              Start My Blueprint
                            </span>
                          </button>
                          <div style={{display:'flex',flexDirection:'column',gap:2}}>
                            <span style={{fontSize:11,color:'rgba(0,255,170,0.55)',fontFamily:"'Inter',sans-serif",fontWeight:500}}>
                              Free · No signup required
                            </span>
                            <span style={{fontSize:10,color:'rgba(0,255,170,0.30)',fontFamily:"'JetBrains Mono',monospace",letterSpacing:'.06em'}}>
                              results in &lt; 30 seconds
                            </span>
                          </div>
                        </div>

                        {/* Social proof bar */}
                        <div className="a-fadeUp" style={{
                          display:'flex',alignItems:'center',gap:isMobile?12:24,
                          marginTop:48,paddingTop:32,
                          borderTop:'1px solid rgba(0,255,170,0.16)',
                          flexWrap:'wrap',
                          animationDelay:'300ms',
                        }}>
                          {[
                            {v:'12,000+',l:'Homesteads planned'},
                            {v:'94%',    l:'Hit food targets'},
                            {v:'4.3 yr', l:'Avg payback period'},
                            {v:'620 lbs',l:'CO₂ offset avg/yr'},
                          ].map(({v,l},i)=>(
                            <div key={l} style={{display:'flex',flexDirection:'column',gap:2}}>
                              <span style={{fontSize:isMobile?18:22,fontWeight:700,color:'#00ffaa',
                                fontFamily:"'Space Grotesk',sans-serif",lineHeight:1,
                                textShadow:'0 0 20px rgba(0,255,170,0.4)'}}>{v}</span>
                              <span style={{fontSize:10,color:'rgba(0,255,170,0.58)',
                                fontFamily:"'JetBrains Mono',monospace",letterSpacing:'.06em'}}>{l}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* RIGHT — Visual panel */}
                      {!isMobile&&(
                        <div style={{
                          position:'relative',overflow:'hidden',
                          borderLeft:'1px solid rgba(0,255,170,0.16)',
                          display:'flex',flexDirection:'column',
                          alignItems:'center',justifyContent:'center',
                          padding:'48px 40px',gap:14,
                          background:'linear-gradient(135deg,rgba(0,255,170,0.07) 0%,rgba(0,20,40,0.30) 60%)',
                        }}>

                          {/* Rotating hex grid decoration */}
                          <div aria-hidden style={{position:'absolute',top:'5%',right:'-6%',
                            width:240,height:240,opacity:0.15,pointerEvents:'none',
                            animation:'rotateGeo 60s linear infinite'}}>
                            {[0,45,90,135,180,225,270,315].map((deg,i)=>(
                              <div key={i} style={{position:'absolute',inset:i*8,
                                border:`1px solid rgba(0,255,170,${0.4+i*0.06})`,
                                borderRadius:i%2===0?4:'50%',
                                transform:`rotate(${deg}deg)`}}/>
                            ))}
                          </div>

                          {/* Main preview card */}
                          <div className="a-fadeUp" style={{
                            width:'100%',padding:'24px',borderRadius:20,
                            background:'linear-gradient(135deg,rgba(0,255,170,0.14) 0%,rgba(8,36,22,0.88) 100%)',
                            border:'1px solid rgba(0,255,170,0.32)',
                            backdropFilter:'blur(32px)',
                            boxShadow:'0 0 60px rgba(0,255,170,0.08),inset 0 1px 0 rgba(0,255,170,0.12)',
                            position:'relative',overflow:'hidden',
                            animationDelay:'200ms',
                          }}>
                            {/* Card top shimmer line */}
                            <div style={{position:'absolute',top:0,left:0,right:0,height:1,
                              background:'linear-gradient(90deg,transparent,rgba(0,255,170,0.80) 50%,transparent)'}}/>
                            <div style={{fontSize:9,fontWeight:700,letterSpacing:'.16em',
                              color:'rgba(0,255,170,0.65)',fontFamily:"'JetBrains Mono',monospace",
                              textTransform:'uppercase',marginBottom:16,display:'flex',alignItems:'center',gap:6}}>
                              <div style={{width:5,height:5,borderRadius:'50%',background:'#00ffaa',
                                boxShadow:'0 0 6px #00ffaa',animation:'breathe 2s ease-in-out infinite'}}/>
                              Live Blueprint Preview · Family of 4
                            </div>
                            {/* Big stat row */}
                            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16,marginBottom:18}}>
                              {[
                                {v:'1,840',u:'lbs food/yr',c:'#00ffaa',icon:'🌾'},
                                {v:'34k',u:'gal saved/yr',c:'#22d3ee',icon:'💧'},
                                {v:'$2.1k',u:'yr 1 savings',c:'#fbbf24',icon:'◆'},
                              ].map(({v,u,c,icon})=>(
                                <div key={u} style={{textAlign:'center'}}>
                                  <div style={{fontSize:13,marginBottom:4}}>{icon}</div>
                                  <div style={{fontSize:24,fontWeight:800,color:c,lineHeight:1,
                                    fontFamily:"'Space Grotesk',sans-serif",
                                    textShadow:`0 0 20px ${c}60`}}>{v}</div>
                                  <div style={{fontSize:9,color:`${c}55`,fontFamily:"'JetBrains Mono',monospace",
                                    letterSpacing:'.05em',marginTop:4}}>{u}</div>
                                </div>
                              ))}
                            </div>
                            {/* Progress bars */}
                            {[
                              {l:'Food sufficiency',v:76,c:'#00ffaa'},
                              {l:'Water independence',v:89,c:'#22d3ee'},
                              {l:'Regeneration score',v:74,c:'#a78bfa'},
                            ].map(({l,v,c})=>(
                              <div key={l} style={{marginBottom:8}}>
                                <div style={{display:'flex',justifyContent:'space-between',marginBottom:4,
                                  fontSize:9,color:'rgba(180,220,200,0.62)',fontFamily:"'JetBrains Mono',monospace",letterSpacing:'.05em'}}>
                                  <span>{l}</span><span style={{color:c,fontWeight:700}}>{v}%</span>
                                </div>
                                <div style={{height:4,borderRadius:99,background:'rgba(0,255,170,0.08)',overflow:'hidden'}}>
                                  <div style={{height:'100%',borderRadius:99,width:`${v}%`,
                                    background:`linear-gradient(90deg,${c}aa,${c})`,
                                    boxShadow:`0 0 10px ${c}70`}}/>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Two mini cards */}
                          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,width:'100%'}}>
                            {[
                              {label:'Payback',value:'4.2 yrs',sub:'then pure profit',c:'#fbbf24',icon:'⏱'},
                              {label:'CO₂ offset',value:'620 lbs',sub:'per year',c:'#86efac',icon:'🌿'},
                            ].map(({label,value,sub,c,icon})=>(
                              <div key={label} className="a-fadeUp" style={{padding:'16px',borderRadius:14,
                                background:`linear-gradient(135deg,${c}18 0%,rgba(8,28,18,0.80) 100%)`,
                                border:`1px solid ${c}1a`,backdropFilter:'blur(16px)',
                                position:'relative',overflow:'hidden',animationDelay:'320ms'}}>
                                <div style={{position:'absolute',top:0,left:0,right:0,height:1,
                                  background:`linear-gradient(90deg,transparent,${c}50,transparent)`}}/>
                                <div style={{fontSize:13,marginBottom:6}}>{icon}</div>
                                <div style={{fontSize:9,color:`${c}60`,fontFamily:"'JetBrains Mono',monospace",
                                  letterSpacing:'.08em',textTransform:'uppercase',marginBottom:4}}>{label}</div>
                                <div style={{fontSize:22,fontWeight:800,color:c,lineHeight:1,
                                  fontFamily:"'Space Grotesk',sans-serif",
                                  textShadow:`0 0 16px ${c}50`,marginBottom:3}}>{value}</div>
                                <div style={{fontSize:10,color:`${c}45`,fontFamily:"'Inter',sans-serif"}}>{sub}</div>
                              </div>
                            ))}
                          </div>

                          {/* Disclaimer */}
                          <p style={{fontSize:9,color:'rgba(0,255,170,0.55)',fontFamily:"'JetBrains Mono',monospace",
                            letterSpacing:'.05em',margin:0,lineHeight:1.6,textAlign:'center'}}>
                            Figures are illustrative. Your results vary by land, climate & feature selection.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* ═══ FEATURE STRIP ═══ */}
                    <div style={{
                      borderTop:'1px solid rgba(0,255,170,0.14)',
                      padding:isMobile?'28px 20px':'32px 60px',
                      background:'linear-gradient(180deg,rgba(0,255,170,0.06) 0%,rgba(0,30,20,0.40) 100%)',
                      display:'flex',flexDirection:'column',gap:isMobile?20:24,
                    }}>

                      {/* Section label */}
                      <div style={{display:'flex',alignItems:'center',gap:10}}>
                        <div style={{flex:1,height:1,background:'rgba(0,255,170,0.18)'}}/>
                        <span style={{fontSize:9,fontWeight:700,letterSpacing:'.22em',
                          color:'rgba(0,255,170,0.55)',fontFamily:"'JetBrains Mono',monospace",
                          textTransform:'uppercase',whiteSpace:'nowrap'}}>Platform Capabilities</span>
                        <div style={{flex:1,height:1,background:'rgba(0,255,170,0.18)'}}/>
                      </div>

                      {/* Feature cards grid */}
                      <div style={{
                        display:'grid',
                        gridTemplateColumns:isMobile?'1fr 1fr':'repeat(6,1fr)',
                        gap:isMobile?8:10,
                      }}>
                        {[
                          {icon:'🗺',title:'AI Blueprint',desc:'Instant AI-generated layout from your land & goals',c:'#00ffaa'},
                          {icon:'📐',title:'3D Grid Maps',desc:'Drag-and-drop property & raised bed planning',c:'#22d3ee'},
                          {icon:'📈',title:'Yield Engine',desc:'Real-world food output & water savings modelling',c:'#86efac'},
                          {icon:'💰',title:'ROI Planner',desc:'20-year compound return & payback analysis',c:'#fbbf24'},
                          {icon:'🌱',title:'Deploy Plan',desc:'Phase-by-phase seasonal implementation calendar',c:'#a78bfa'},
                          {icon:'📄',title:'PDF Export',desc:'Shareable professional report & plant calendar',c:'#fb923c'},
                        ].map(({icon,title,desc,c},i)=>(
                          <div key={title} className="a-fadeUp"
                            style={{
                              padding:'18px 16px',borderRadius:14,
                              background:`linear-gradient(160deg,${c}14 0%,rgba(4,20,12,0.75) 100%)`,
                              border:`1px solid ${c}14`,
                              backdropFilter:'blur(12px)',
                              position:'relative',overflow:'hidden',
                              animationDelay:`${i*60}ms`,
                              cursor:'default',
                              transition:'border-color 0.2s,box-shadow 0.2s',
                            }}
                            onMouseEnter={e=>{
                              (e.currentTarget as HTMLElement).style.borderColor=`${c}35`;
                              (e.currentTarget as HTMLElement).style.boxShadow=`0 0 24px ${c}10`;
                            }}
                            onMouseLeave={e=>{
                              (e.currentTarget as HTMLElement).style.borderColor=`${c}14`;
                              (e.currentTarget as HTMLElement).style.boxShadow='none';
                            }}>
                            <div style={{position:'absolute',top:0,left:0,right:0,height:1,
                              background:`linear-gradient(90deg,transparent,${c}30,transparent)`}}/>
                            <div style={{fontSize:22,marginBottom:10}}>{icon}</div>
                            <div style={{fontSize:12,fontWeight:700,color:'var(--tp)',
                              fontFamily:"'Space Grotesk',sans-serif",marginBottom:5,lineHeight:1.2}}>{title}</div>
                            <p style={{fontSize:10,color:'rgba(180,230,210,0.72)',fontFamily:"'Inter',sans-serif",
                              margin:0,lineHeight:1.6,fontWeight:400}}>{desc}</p>
                          </div>
                        ))}
                      </div>

                      {/* Steps row */}
                      <div style={{
                        display:'grid',
                        gridTemplateColumns:isMobile?'1fr':'repeat(3,1fr)',
                        gap:0,marginTop:8,
                        borderTop:'1px solid rgba(0,255,170,0.12)',paddingTop:28,
                      }}>
                        {[
                          {n:'01',t:'Configure',d:'Enter your land size, climate zone, family size & budget — takes 60 seconds.',c:'#00ffaa'},
                          {n:'02',t:'Design & Place',d:'Drag features onto your interactive 3D property map and raised bed grids.',c:'#22d3ee'},
                          {n:'03',t:'Analyse & Export',d:'Review yield, ROI, CO₂ offset, regeneration score and download your PDF report.',c:'#a78bfa'},
                        ].map(({n,t,d,c},i)=>(
                          <div key={n} style={{
                            padding:isMobile?'16px 0':'20px 28px',
                            borderRight:(!isMobile&&i<2)?'1px solid rgba(0,255,170,0.07)':undefined,
                            paddingLeft:i===0?0:undefined,
                          }}>
                            <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:10}}>
                              <div style={{width:28,height:28,borderRadius:8,flexShrink:0,
                                background:`${c}20`,border:`1px solid ${c}45`,
                                display:'flex',alignItems:'center',justifyContent:'center'}}>
                                <span style={{fontSize:10,fontWeight:800,color:c,
                                  fontFamily:"'JetBrains Mono',monospace"}}>{n}</span>
                              </div>
                              <span style={{fontSize:14,fontWeight:700,color:'var(--tp)',
                                fontFamily:"'Space Grotesk',sans-serif"}}>{t}</span>
                            </div>
                            <p style={{fontSize:11,color:'rgba(180,230,210,0.68)',fontFamily:"'Inter',sans-serif",
                              margin:0,lineHeight:1.7,fontWeight:400}}>{d}</p>
                          </div>
                        ))}
                      </div>

                      {/* Bottom CTA */}
                      <div style={{display:'flex',justifyContent:'center',paddingTop:8}}>
                        <button onClick={()=>setFormOpen(true)} className="gen-btn"
                          style={{padding:'14px 44px',borderRadius:99,display:'inline-flex',alignItems:'center',gap:10,
                            boxShadow:'0 0 48px rgba(0,255,170,0.20),0 8px 24px rgba(0,0,0,0.30)'}}>
                          <Sprout style={{width:14,height:14,color:'#00ffaa'}}/>
                          <span style={{fontSize:11,letterSpacing:'.14em',color:'#00ffaa',
                            fontFamily:"'Space Grotesk',sans-serif",fontWeight:700,textTransform:'uppercase'}}>
                            Generate Your Homestead Blueprint
                          </span>
                        </button>
                      </div>

                    </div>
                  </div>
                </div>
              )}

              {/* -- SHARED VIEW BANNER -- */}
              {isSharedView&&hasData&&(
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',
                  flexWrap:'wrap',gap:12,marginBottom:16,padding:'14px 20px',borderRadius:14,
                  background:'linear-gradient(135deg,rgba(0,255,170,0.10),rgba(4,14,8,0.85))',
                  border:'1px solid rgba(0,255,170,0.25)'}}>
                  <div style={{display:'flex',alignItems:'center',gap:10}}>
                    <span style={{fontSize:20}}>🌱</span>
                    <div>
                      <div style={{fontSize:13,fontWeight:700,color:'#00ffaa',fontFamily:"'Space Grotesk',sans-serif"}}>You are viewing a shared homestead</div>
                      <div style={{fontSize:12,color:'var(--ts)',fontFamily:"'Inter',sans-serif"}}>Like what you see? Design your own self-sufficient property for free.</div>
                    </div>
                  </div>
                  <button type="button" onClick={()=>{
                      trackEvent('shared_make_your_own_click');
                      setIsSharedView(false);setBlueprints([{...DEFAULT_PROP_BP}]);
                      setFormOpen(true);window.scrollTo({top:0,behavior:'smooth'});
                    }}
                    style={{padding:'9px 18px',borderRadius:10,cursor:'pointer',
                      background:'linear-gradient(135deg,#00ffaa,#00c45a)',border:'none',color:'#051a0e',
                      fontSize:12,fontWeight:800,fontFamily:"'Space Grotesk',sans-serif",whiteSpace:'nowrap'}}>
                    Make Your Own →
                  </button>
                </div>
              )}

              {/* -- DEMO BANNER -- */}
              {showDemo&&hasData&&(
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',
                  flexWrap:'wrap',gap:12,marginBottom:16,padding:'14px 20px',borderRadius:14,
                  background:'linear-gradient(135deg,rgba(0,213,255,0.10),rgba(4,14,8,0.85))',
                  border:'1px solid rgba(0,213,255,0.25)'}}>
                  <div style={{display:'flex',alignItems:'center',gap:10}}>
                    <span style={{fontSize:20}}>👋</span>
                    <div>
                      <div style={{fontSize:13,fontWeight:700,color:'#7dd3fc',fontFamily:"'Space Grotesk',sans-serif"}}>This is a sample homestead</div>
                      <div style={{fontSize:12,color:'var(--ts)',fontFamily:"'Inter',sans-serif"}}>Explore the dashboard, then build your own with the Configure button.</div>
                    </div>
                  </div>
                  <button type="button" onClick={()=>{
                      setShowDemo(false);setBlueprints([{...DEFAULT_PROP_BP}]);
                      try{localStorage.setItem('tf-demo-dismissed','1');}catch{}
                      setFormOpen(true);
                    }}
                    style={{padding:'9px 18px',borderRadius:10,cursor:'pointer',
                      background:'linear-gradient(135deg,#00d4ff,#0096c7)',border:'none',color:'#051a0e',
                      fontSize:12,fontWeight:800,fontFamily:"'Space Grotesk',sans-serif",whiteSpace:'nowrap'}}>
                    Start Fresh →
                  </button>
                </div>
              )}

              {/* -- GENERATED STATE — BENTO GRID -- */}
              {hasData&&<BentoGrid
  calc={displayCalc}
  allTiles={allTiles}
  isMobile={isMobile}
  blueprints={blueprints}
  mapSubTab={mapSubTab}
  propIdx={propIdx}
  rbIdx={rbIdx}
  raisedBedBps={raisedBedBps}
  wDragSrc={wDragSrc}
  setWDragSrc={setWDragSrc}
  wOrder={wOrder}
  setWOrder={setWOrder}
  drillInfo={drillInfo}
  setDrillInfo={setDrillInfo}
  terrainMap={terrainMap}
  terrainPropIdx={terrainPropIdx}
  terrainGardIdx={terrainGardIdx}
  parallax={parallax}
  setModal={setModal}
  fv={fv}
  terrainDropdown={terrainDropdown}
  setTerrainDropdown={setTerrainDropdown}
  setTerrainMap={setTerrainMap}
  setTerrainPropIdx={setTerrainPropIdx}
  setTerrainGardIdx={setTerrainGardIdx}
  CAT_COLOR={CAT_COLOR}
  propBps={propBps}
  iconFilter={iconFilter}
  setIconFilter={setIconFilter}
              />}
            </div>
          )}

          {/* ========== OVERVIEW =================================== */}
          {activeTab==='overview'&&!hasData&&(
            <div style={{padding:'64px 32px',textAlign:'center',borderRadius:24,
              background:'linear-gradient(135deg,rgba(0,255,170,0.05),rgba(0,8,6,0.90))',
              border:'1px solid rgba(0,255,170,0.12)',backdropFilter:'blur(48px)'}}>
              <div style={{fontSize:40,marginBottom:16}}>◎</div>
              <p style={{fontSize:16,color:'var(--tf)',fontFamily:"'Inter',sans-serif",
                maxWidth:420,margin:'0 auto',lineHeight:1.75,fontWeight:300}}>
                Generate a blueprint to activate detailed system telemetry.
              </p>
            </div>
          )}
          {activeTab==='overview'&&hasData&&(
            <div className="a-fadeUp" style={{display:'flex',flexDirection:'column',gap:20}}>
            {(()=>{
              const famN = Math.max(1,Number(fv.familySize)||4);
              const net20 = Math.round(displayCalc.year1Savings*((1.03**20-1)/0.03)-(displayCalc.estimatedCostMin+displayCalc.estimatedCostMax)/2);
              const scoreColor = displayCalc.resilienceScore>=70?'#00ffaa':displayCalc.resilienceScore>=40?'#ffb340':'#ff8c42';

              /* -- Shared atoms --------------------------------------- */
              const Divider=({color='rgba(0,255,170,0.08)'}:{color?:string})=>(
                <div style={{height:1,background:color,margin:'2px 0'}}/>
              );

              const SectionHead=({label,color='#00ffaa',right}:{label:string;color?:string;right?:React.ReactNode})=>(
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',
                  gap:12,marginBottom:14,paddingBottom:10,
                  borderBottom:`1px solid ${color}18`,position:'relative'}}>
                  <div style={{display:'flex',alignItems:'center',gap:10,flex:1}}>
                    <div style={{width:2,height:16,borderRadius:99,flexShrink:0,
                      backgroundImage:`linear-gradient(180deg,${color},${color}33)`,
                      boxShadow:`0 0 8px ${color}50`,animation:'breathe 2s ease-in-out infinite'}}/>
                    <span style={{fontSize:9,fontWeight:700,letterSpacing:'.20em',
                      color:`${color}99`,fontFamily:"'JetBrains Mono',monospace",
                      textTransform:'uppercase'}}>{label}</span>
                  </div>
                  {right}
                </div>
              );

              const Card=({children,accent,style:sx}:{children:React.ReactNode;accent?:string;style?:React.CSSProperties})=>(
                <div style={{
                  position:'relative',overflow:'hidden',borderRadius:16,
                  background:'linear-gradient(160deg,rgba(0,255,170,0.04) 0%,rgba(12,28,18,0.78) 100%)',
                  border:'1px solid rgba(0,255,170,0.09)',
                  backdropFilter:'blur(20px)',
                  ...sx,
                }}>
                  <div style={{position:'absolute',top:0,left:0,right:0,height:1,
                    background:`linear-gradient(90deg,transparent,${accent||'rgba(0,255,170,0.22)'} 50%,transparent)`}}/>
                  {children}
                </div>
              );

              return(<>

              {/* ══════════════════════════════════════════
                  HERO — BLUEPRINT ANALYSIS (top of overview)
              ══════════════════════════════════════════ */}
              {(apiBlueprint&&(apiBlueprint.summary||apiBlueprint.recommendations?.length>0))||(!useAI&&allTiles.length>1)?(()=>{
                const isAI=!!(apiBlueprint&&(apiBlueprint.summary||apiBlueprint.recommendations?.length>0));
                const accentC=isAI?'rgba(0,238,255,':'rgba(0,255,170,';
                const accentH=isAI?'#00eeff':'#00ffaa';
                const title=isAI?'Understanding Your Blueprint':'Base Blueprint Analysis';
                const icon=isAI?'🤖':'⚡';
                const label=isAI?'Claude AI · Personalized Analysis':'Base Calculation · System Overview';
                return(
                <section style={{marginBottom:4}}>
                  <div style={{
                    position:'relative',overflow:'hidden',borderRadius:isMobile?14:20,
                    background:isAI
                      ?'linear-gradient(135deg,rgba(0,18,32,0.97) 0%,rgba(0,8,20,0.99) 100%)'
                      :'linear-gradient(135deg,rgba(0,28,18,0.97) 0%,rgba(0,14,8,0.99) 100%)',
                    border:`1px solid ${accentC}0.22)`,
                    boxShadow:`0 0 60px ${accentC}0.08),0 20px 60px rgba(0,0,0,0.40)`,
                  }}>
                    <div style={{position:'absolute',top:0,left:0,right:0,height:2,
                      backgroundImage:isAI
                        ?'linear-gradient(90deg,transparent,rgba(0,238,255,0.9) 30%,rgba(167,139,250,0.7) 60%,rgba(0,255,170,0.8) 85%,transparent)'
                        :'linear-gradient(90deg,transparent,rgba(0,255,170,0.9) 30%,rgba(34,211,238,0.6) 60%,rgba(0,255,170,0.8) 85%,transparent)',
                      boxShadow:`0 0 20px ${accentC}0.40)`}}/>
                    <div style={{padding:isMobile?'12px 14px 12px':'20px 24px 16px',borderBottom:`1px solid ${accentC}0.08)`,
                      display:'flex',alignItems:'center',gap:12,flexWrap:'wrap'}}>
                      <div style={{width:36,height:36,borderRadius:10,flexShrink:0,
                        background:`linear-gradient(135deg,${accentC}0.18),${accentC}0.06))`,
                        border:`1px solid ${accentC}0.30)`,
                        display:'flex',alignItems:'center',justifyContent:'center',
                        boxShadow:`0 0 20px ${accentC}0.18)`}}>
                        <span style={{fontSize:18}}>{icon}</span>
                      </div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontSize:9,fontWeight:700,letterSpacing:'.18em',
                          color:`${accentC}0.55)`,fontFamily:"'JetBrains Mono',monospace",
                          textTransform:'uppercase',marginBottom:3,
                          display:'flex',alignItems:'center',gap:6}}>
                          <div style={{width:5,height:5,borderRadius:'50%',background:accentH,
                            boxShadow:`0 0 8px ${accentH}`,animation:'breathe 2s ease-in-out infinite'}}/>
                          {label}
                        </div>
                        <div style={{fontSize:isMobile?13:16,fontWeight:800,color:'var(--tp)',
                          fontFamily:"'Space Grotesk',sans-serif",letterSpacing:'.01em'}}>
                          {title}
                        </div>
                      </div>
                      <div style={{padding:'4px 10px',borderRadius:99,
                        background:`${accentC}0.08)`,border:`1px solid ${accentC}0.20)`,
                        fontSize:9,fontWeight:700,letterSpacing:'.10em',
                        color:`${accentC}0.65)`,fontFamily:"'JetBrains Mono',monospace",
                        textTransform:'uppercase',whiteSpace:'nowrap'}}>
                        {fv.climateZone||'Temperate'} · {Math.max(1,Number(fv.familySize)||4)} people
                      </div>
                    </div>
                    <div style={{padding:isMobile?'14px 14px 18px':'20px 24px 24px',display:'grid',
                      gridTemplateColumns:'1fr',
                      gap:isMobile?16:24,alignItems:'start'}}>
                      {/* ── AI MODE: stat cards + summary + recs ── */}
                      {isAI?(()=>{
                        const sqft=Math.max(500,Number(fv.yardSqFt)||10000);
                        const zone=(fv.climateZone||'Temperate') as string;
                        const famSize=Math.max(1,Number(fv.familySize)||4);
                        const foodPct=displayCalc.foodSelfSufficiencyPct||0;
                        const yieldLbs=displayCalc.totalYieldLbs||0;
                        const savings=displayCalc.year1Savings||0;
                        const payback=displayCalc.paybackYears||0;
                        const co2Lbs=displayCalc.totalCo2Lbs||0;
                        const waterPct=displayCalc.waterSavingsPct||0;
                        const waterGal=displayCalc.totalWaterGal||0;
                        const score=displayCalc.resilienceScore||0;
                        const scoreColor2=score>=70?'#00ffaa':score>=40?'#fbbf24':'#f87171';
                        const scoreLabel=score>=70?'Self-Sustaining':score>=40?'Developing':'Early Stage';
                        const foodNeed=600*famSize;
                        const gap=Math.max(0,foodNeed-yieldLbs);
                        const aiCats=new Set(allTiles.map((t:{id:number;icon:string})=>ICON_LOOKUP.get(t.icon)?.category).filter(Boolean) as string[]);
                        const aiHasWater=aiCats.has('water');
                        const aiHasEnergy=aiCats.has('energy');
                        const aiHasAnimals=aiCats.has('animals');
                        const missing:{emoji:string;label:string;detail:string}[]=[];
                        if(!aiHasWater)missing.push({emoji:'💧',label:'Rain Tank',detail:'~4,000 gal/yr · $425 avg'});
                        if(!aiHasEnergy)missing.push({emoji:'☀️',label:'Solar Panel',detail:'~$200/yr savings'});
                        if(!aiCats.has('soil'))missing.push({emoji:'♻️',label:'Compost Bin',detail:'Payback under 2 yrs'});
                        if(!aiCats.has('biodiversity'))missing.push({emoji:'🌼',label:'Pollinator Patch',detail:'+15–30% yield boost'});
                        if(!aiHasAnimals&&sqft>3000)missing.push({emoji:'🐔',label:'Chicken Coop',detail:'60 lbs protein/yr'});
                        // Also suggest quantity improvements when gap exists
                        const bedCount=allTiles.filter((t:{id:number;icon:string})=>t.icon==='🌱').length;
                        const treeCount=allTiles.filter((t:{id:number;icon:string})=>['🍎','🍋','🍑','🍐','🥭','🍌','🍄','🫚','🍊','🍒'].includes(t.icon)).length;
                        if(gap>600&&bedCount<8)missing.push({emoji:'🌱',label:'Add Raised Bed',detail:`+40 lbs/yr each · ${Math.ceil(gap/40)} needed`});
                        if(gap>400&&treeCount<4)missing.push({emoji:'🍎',label:'Add Fruit Tree',detail:'+60 lbs/yr each · year 3+'});
                        if(missing.length===0&&gap>0)missing.push({emoji:'🌱',label:'More Raised Beds',detail:`Need ~${Math.ceil(gap/40)} more for self-sufficiency`});
                        const statCards=[
                          {emoji:'🌾',label:'Food Yield',value:yieldLbs>0?yieldLbs.toLocaleString()+' lbs/yr':'0 lbs/yr',sub:foodPct+'% self-sufficient',color:'#00ffaa',bg:'rgba(0,255,170,0.07)',border:'rgba(0,255,170,0.18)'},
                          {emoji:'💧',label:'Water Saved',value:waterGal>0?waterGal.toLocaleString()+' gal/yr':'0 gal/yr',sub:waterPct+'% of baseline',color:'#00e5ff',bg:'rgba(0,229,255,0.07)',border:'rgba(0,229,255,0.18)'},
                          {emoji:'🌿',label:'CO₂ Offset',value:co2Lbs>0?co2Lbs.toLocaleString()+' lbs/yr':'0 lbs/yr',sub:co2Lbs>0?Math.round(co2Lbs/20)+' trees equiv.':'plant more perennials',color:'#86efac',bg:'rgba(134,239,172,0.07)',border:'rgba(134,239,172,0.18)'},
                          {emoji:'💰',label:'Year-1 Savings',value:savings>0?'$'+savings.toLocaleString():'$0',sub:payback>0?payback+'-yr payback':'no ROI yet',color:'#fbbf24',bg:'rgba(251,191,36,0.07)',border:'rgba(251,191,36,0.18)'},
                        ];
                        return(
                        <div style={{display:'flex',flexDirection:'column',gap:20}}>
                          {/* Score badge + stat cards row */}
                          <div style={{display:'flex',alignItems:'center',gap:12,flexWrap:'wrap'}}>
                            <div style={{display:'flex',alignItems:'center',gap:10,
                              padding:'10px 16px',borderRadius:14,flexShrink:0,
                              background:'rgba(0,238,255,0.06)',border:'1px solid rgba(0,238,255,0.18)',
                              boxShadow:'0 0 20px rgba(0,238,255,0.08)'}}>
                              <div style={{fontSize:28,fontWeight:300,color:scoreColor2,lineHeight:1,
                                fontFamily:"'Inter',sans-serif",textShadow:`0 0 16px ${scoreColor2}60`}}>
                                {score}
                              </div>
                              <div>
                                <div style={{fontSize:8,letterSpacing:'.10em',color:'rgba(0,238,255,0.50)',
                                  fontFamily:"'JetBrains Mono',monospace",textTransform:'uppercase',marginBottom:2}}>/98 score</div>
                                <div style={{fontSize:10,fontWeight:700,color:scoreColor2,
                                  fontFamily:"'Space Grotesk',sans-serif"}}>{scoreLabel}</div>
                              </div>
                            </div>
                            <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:8,flex:1,minWidth:0}}>
                              {statCards.map(sc=>(
                                <div key={sc.label} style={{padding:'9px 12px',borderRadius:12,
                                  background:sc.bg,border:`1px solid ${sc.border}`,
                                  display:'flex',alignItems:'center',gap:8}}>
                                  <span style={{fontSize:16,flexShrink:0}}>{sc.emoji}</span>
                                  <div style={{minWidth:0}}>
                                    <div style={{fontSize:isMobile?11:13,fontWeight:700,color:sc.color,
                                      fontFamily:"'Space Grotesk',sans-serif",
                                      whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{sc.value}</div>
                                    <div style={{fontSize:9,color:'rgba(200,230,220,0.45)',
                                      fontFamily:"'JetBrains Mono',monospace",marginTop:1}}>{sc.sub}</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Food gap pill */}
                          {gap>0&&(
                            <div style={{padding:'7px 12px',borderRadius:9,
                              background:'rgba(248,113,113,0.07)',border:'1px solid rgba(248,113,113,0.20)',
                              fontSize:11,fontFamily:"'Inter',sans-serif",
                              display:'flex',alignItems:'center',gap:6}}>
                              <span style={{color:'#f87171',fontWeight:700}}>↓ {gap.toLocaleString()} lbs/yr short</span>
                              <span style={{color:'rgba(220,180,180,0.55)',fontSize:10}}>· {Math.ceil(gap/40)} more beds or {Math.ceil(gap/60)} trees needed</span>
                            </div>
                          )}

                          {/* Recommended additions — same as base mode */}
                          {missing.length>0&&(
                          <div>
                            <div style={{fontSize:9,letterSpacing:'.14em',
                              color:'rgba(251,191,36,0.80)',
                              fontFamily:"'JetBrains Mono',monospace",textTransform:'uppercase',
                              fontWeight:700,marginBottom:8}}>Recommended additions</div>
                            <div style={{display:'flex',flexDirection:'column',gap:5}}>
                              {missing.slice(0,4).map((m,i)=>(
                                <div key={i} style={{display:'flex',alignItems:'center',gap:10,
                                  padding:'8px 10px',borderRadius:8,cursor:'pointer',
                                  background:'rgba(255,255,255,0.02)',
                                  border:'1px solid rgba(255,255,255,0.06)',
                                  transition:'all 0.15s ease'}}
                                  onClick={()=>addFeatureToActiveMap(m.emoji)}
                                  onMouseEnter={e=>{(e.currentTarget as HTMLDivElement).style.background='rgba(251,191,36,0.06)';(e.currentTarget as HTMLDivElement).style.borderColor='rgba(251,191,36,0.20)';}}
                                  onMouseLeave={e=>{(e.currentTarget as HTMLDivElement).style.background='rgba(255,255,255,0.02)';(e.currentTarget as HTMLDivElement).style.borderColor='rgba(255,255,255,0.06)';}}>
                                  <span style={{fontSize:16,flexShrink:0}}>{m.emoji}</span>
                                  <div style={{flex:1,minWidth:0}}>
                                    <span style={{fontSize:12,fontWeight:600,color:'rgba(220,255,240,0.75)',
                                      fontFamily:"'Inter',sans-serif"}}>{m.label}</span>
                                    <span style={{fontSize:10,color:'rgba(200,230,220,0.35)',
                                      fontFamily:"'JetBrains Mono',monospace",marginLeft:8}}>{m.detail}</span>
                                  </div>
                                  <span style={{fontSize:9,color:'rgba(251,191,36,0.50)',flexShrink:0,
                                    fontFamily:"'JetBrains Mono',monospace"}}>+ ADD</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          )}

                          {/* Divider */}
                          <div style={{height:1,background:'linear-gradient(90deg,transparent,rgba(0,238,255,0.20),transparent)'}}/>

                          {/* AI content: summary + recs side by side */}
                          <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':(apiBlueprint.recommendations?.length>0?'1fr 1fr':'1fr'),gap:isMobile?16:20,alignItems:'start'}}>
                            {/* Summary */}
                            <div>
                              <div style={{fontSize:9,fontWeight:700,letterSpacing:'.14em',
                                color:'rgba(0,238,255,0.50)',fontFamily:"'JetBrains Mono',monospace",
                                textTransform:'uppercase',marginBottom:10,display:'flex',alignItems:'center',gap:6}}>
                                <span style={{fontSize:11}}>◈</span> Expert Assessment
                              </div>
                              {apiBlueprint.summary&&(
                                <p style={{fontSize:isMobile?12:13,lineHeight:1.80,
                                  color:'rgba(200,230,220,0.85)',
                                  fontFamily:"'Inter',sans-serif",fontWeight:400,margin:0}}>
                                  {apiBlueprint.summary}
                                </p>
                              )}
                            </div>
                            {/* Recommendations */}
                            {apiBlueprint.recommendations?.length>0&&(
                              <div>
                                <div style={{fontSize:9,fontWeight:700,letterSpacing:'.14em',
                                  color:'rgba(167,139,250,0.60)',fontFamily:"'JetBrains Mono',monospace",
                                  textTransform:'uppercase',marginBottom:10,display:'flex',alignItems:'center',gap:6}}>
                                  <span style={{fontSize:11}}>◈</span> AI Recommendations
                                </div>
                                <div style={{display:'flex',flexDirection:'column',gap:7}}>
                                  {apiBlueprint.recommendations.slice(0,5).map((r:string,i:number)=>(
                                    <div key={i} style={{display:'flex',alignItems:'flex-start',gap:10,
                                      padding:'10px 12px',borderRadius:11,
                                      background:i===0?'rgba(167,139,250,0.07)':'rgba(0,238,255,0.03)',
                                      border:`1px solid ${i===0?'rgba(167,139,250,0.22)':'rgba(0,238,255,0.09)'}`,
                                      position:'relative',overflow:'hidden'}}>
                                      <div style={{position:'absolute',left:0,top:0,bottom:0,width:2,
                                        background:i===0
                                          ?`linear-gradient(180deg,rgba(167,139,250,${0.8-i*0.1}),transparent)`
                                          :`linear-gradient(180deg,rgba(0,238,255,${0.7-i*0.1}),transparent)`}}/>
                                      <div style={{minWidth:22,height:22,borderRadius:7,flexShrink:0,marginTop:1,
                                        background:i===0?'rgba(167,139,250,0.15)':'rgba(0,238,255,0.09)',
                                        border:`1px solid ${i===0?'rgba(167,139,250,0.30)':'rgba(0,238,255,0.18)'}`,
                                        display:'flex',alignItems:'center',justifyContent:'center'}}>
                                        <span style={{fontSize:9,color:i===0?'#c4b5fd':'#00eeff',fontWeight:800,
                                          fontFamily:"'JetBrains Mono',monospace"}}>{i+1}</span>
                                      </div>
                                      <p style={{fontSize:11,lineHeight:1.70,color:'rgba(190,225,215,0.82)',
                                        fontFamily:"'Inter',sans-serif",fontWeight:400,margin:0}}>{r}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        );
                      })():(()=>{
                          const sqft=Math.max(500,Number(fv.yardSqFt)||10000);
                          const zone=(fv.climateZone||'Temperate') as string;
                          const famSize=Math.max(1,Number(fv.familySize)||4);
                          const foodPct=displayCalc.foodSelfSufficiencyPct||0;
                          const yieldLbs=displayCalc.totalYieldLbs||0;
                          const savings=displayCalc.year1Savings||0;
                          const payback=displayCalc.paybackYears||0;
                          const co2Lbs=displayCalc.totalCo2Lbs||0;
                          const waterPct=displayCalc.waterSavingsPct||0;
                          const waterGal=displayCalc.totalWaterGal||0;
                          const score=displayCalc.resilienceScore||0;
                          const cats=new Set(allTiles.map((t:{id:number;icon:string})=>ICON_LOOKUP.get(t.icon)?.category).filter(Boolean) as string[]);
                          const hasWater=cats.has('water');
                          const hasEnergy=cats.has('energy');
                          const hasAnimals=cats.has('animals');
                          const hasTrees=allTiles.some((t:{id:number;icon:string})=>['🍎','🍋','🍑','🍐','🥭','🍌','🍄','🫚','🍊','🍒','🫀','🥑','🍍'].includes(t.icon));
                          const foodNeed=600*famSize;
                          const gap=Math.max(0,foodNeed-yieldLbs);
                          const scoreColor2=score>=70?'#00ffaa':score>=40?'#fbbf24':'#f87171';
                          const scoreLabel=score>=70?'Self-Sustaining':score>=40?'Developing':'Early Stage';
                          const missing:{emoji:string;label:string;detail:string}[]=[];
                          if(!hasWater)missing.push({emoji:'💧',label:'Rain Tank',detail:'~4,000 gal/yr · $425 avg'});
                          if(!hasEnergy)missing.push({emoji:'☀️',label:'Solar Panel',detail:'~$200/yr savings'});
                          if(!cats.has('soil'))missing.push({emoji:'♻️',label:'Compost Bin',detail:'Payback under 2 yrs'});
                          if(!cats.has('biodiversity'))missing.push({emoji:'🌼',label:'Pollinator Patch',detail:'+15–30% yield boost'});
                          if(!hasAnimals&&sqft>3000)missing.push({emoji:'🐔',label:'Chicken Coop',detail:'60 lbs protein/yr'});
                          // Also suggest quantity improvements when gap exists
                          const bedCount=allTiles.filter((t:{id:number;icon:string})=>t.icon==='🌱').length;
                          const treeCount=allTiles.filter((t:{id:number;icon:string})=>['🍎','🍋','🍑','🍐','🥭','🍌','🍄','🫚','🍊','🍒'].includes(t.icon)).length;
                          if(gap>600&&bedCount<8)missing.push({emoji:'🌱',label:'Add Raised Bed',detail:`+40 lbs/yr each · ${Math.ceil(gap/40)} needed`});
                          if(gap>400&&treeCount<4)missing.push({emoji:'🍎',label:'Add Fruit Tree',detail:'+60 lbs/yr each · year 3+'});
                          if(missing.length===0&&gap>0)missing.push({emoji:'🌱',label:'More Raised Beds',detail:`Need ~${Math.ceil(gap/40)} more for self-sufficiency`});
                          // Key stat cards
                          const statCards=[
                            {emoji:'🌾',label:'Food Yield',value:yieldLbs>0?yieldLbs.toLocaleString()+' lbs/yr':'0 lbs/yr',sub:foodPct+'% self-sufficient',color:'#00ffaa',bg:'rgba(0,255,170,0.07)',border:'rgba(0,255,170,0.18)'},
                            {emoji:'💧',label:'Water Saved',value:waterGal>0?waterGal.toLocaleString()+' gal/yr':'0 gal/yr',sub:waterPct+'% of baseline',color:'#00e5ff',bg:'rgba(0,229,255,0.07)',border:'rgba(0,229,255,0.18)'},
                            {emoji:'🌿',label:'CO₂ Offset',value:co2Lbs>0?co2Lbs.toLocaleString()+' lbs/yr':'0 lbs/yr',sub:co2Lbs>0?Math.round(co2Lbs/20)+' trees equiv.':'plant more perennials',color:'#86efac',bg:'rgba(134,239,172,0.07)',border:'rgba(134,239,172,0.18)'},
                            {emoji:'💰',label:'Year-1 Savings',value:savings>0?'$'+savings.toLocaleString():'$0',sub:payback>0?payback+'-yr payback':'no ROI yet',color:'#fbbf24',bg:'rgba(251,191,36,0.07)',border:'rgba(251,191,36,0.18)'},
                          ];
                          return(
                          <div style={{display:'flex',flexDirection:'column',gap:20}}>

                            {/* ── Header: score + label + tagline ── */}
                            <div style={{display:'flex',alignItems:'center',gap:16}}>
                              <div style={{flexShrink:0,width:56,height:56,borderRadius:16,
                                background:`${scoreColor2}12`,border:`1.5px solid ${scoreColor2}35`,
                                display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
                                <div style={{fontSize:22,fontWeight:900,color:scoreColor2,lineHeight:1,
                                  fontFamily:"'Space Grotesk',sans-serif"}}>{score}</div>
                                <div style={{fontSize:8,color:`${scoreColor2}55`,fontWeight:600,
                                  fontFamily:"'JetBrains Mono',monospace",letterSpacing:'.06em'}}>/98</div>
                              </div>
                              <div>
                                <div style={{display:'flex',alignItems:'baseline',gap:8,flexWrap:'wrap'}}>
                                  <span style={{fontSize:15,fontWeight:800,color:scoreColor2,
                                    fontFamily:"'Space Grotesk',sans-serif"}}>{scoreLabel}</span>
                                  <span style={{fontSize:10,color:'rgba(200,230,220,0.35)',
                                    fontFamily:"'JetBrains Mono',monospace"}}>
                                    {allTiles.length} features · {cats.size} categories
                                  </span>
                                </div>
                                <div style={{fontSize:12,color:'rgba(200,230,220,0.55)',marginTop:3,lineHeight:1.5,
                                  fontFamily:"'Inter',sans-serif"}}>
                                  {score>=70
                                    ?`Well-rounded system. ${hasTrees?'Perennial trees secured. ':''}${hasAnimals?'Livestock integrated.':''}`
                                    :score>=40
                                    ?`Good foundation. ${gap>0?`${gap.toLocaleString()} lbs/yr food gap remaining.`:''}`
                                    :`Great start. Focus on food beds, water, and compost next.`}
                                </div>
                              </div>
                            </div>

                            {/* ── 4 inline stats ── */}
                            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
                              {statCards.map(sc=>(
                                <div key={sc.label} style={{display:'flex',alignItems:'center',gap:isMobile?7:10,
                                  padding:isMobile?'8px 10px':'10px 12px',borderRadius:10,
                                  background:sc.bg,border:`1px solid ${sc.border}`}}>
                                  <span style={{fontSize:18,flexShrink:0}}>{sc.emoji}</span>
                                  <div style={{minWidth:0}}>
                                    <div style={{fontSize:isMobile?12:14,fontWeight:800,color:sc.color,lineHeight:1.1,
                                      fontFamily:"'Space Grotesk',sans-serif"}}>{sc.value}</div>
                                    <div style={{fontSize:isMobile?8:9,color:'rgba(200,230,220,0.40)',marginTop:1,
                                      fontFamily:"'JetBrains Mono',monospace"}}>{sc.label}</div>
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* ── Food sufficiency bar ── */}
                            {(foodPct>0||gap>0)&&(
                            <div>
                              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:6}}>
                                <span style={{fontSize:10,color:'rgba(200,230,220,0.45)',
                                  fontFamily:"'JetBrains Mono',monospace",letterSpacing:'.08em',textTransform:'uppercase'}}>
                                  Food self-sufficiency
                                </span>
                                <span style={{fontSize:12,fontWeight:700,
                                  color:foodPct>=80?'#00ffaa':foodPct>=40?'#fbbf24':'#f87171',
                                  fontFamily:"'Space Grotesk',sans-serif"}}>{foodPct}%</span>
                              </div>
                              <div style={{height:5,borderRadius:99,background:'rgba(255,255,255,0.06)',overflow:'hidden'}}>
                                <div style={{height:'100%',borderRadius:99,width:`${Math.max(foodPct,2)}%`,
                                  background:foodPct>=80?'linear-gradient(90deg,#00cc88,#00ffaa)':foodPct>=40?'linear-gradient(90deg,#d97706,#fbbf24)':'linear-gradient(90deg,#dc2626,#f87171)',
                                  transition:'width 0.8s ease'}}/>
                              </div>
                              {gap>0&&(
                              <div style={{marginTop:6,padding:'7px 10px',borderRadius:9,
                                background:'rgba(248,113,113,0.07)',
                                border:'1px solid rgba(248,113,113,0.20)',
                                fontSize:11,fontFamily:"'Inter',sans-serif",
                                display:'flex',alignItems:'center',gap:6}}>
                                <span style={{color:'#f87171',fontWeight:700,letterSpacing:'.01em'}}>
                                  ↓ {gap.toLocaleString()} lbs/yr short
                                </span>
                                <span style={{color:'rgba(220,180,180,0.55)',fontSize:10}}>
                                  · {Math.ceil(gap/40)} more beds or {Math.ceil(gap/60)} trees needed
                                </span>
                              </div>
                              )}
                            </div>
                            )}

                            {/* ── Quick-add missing categories ── */}
                            {missing.length>0&&(
                            <div>
                              <div style={{fontSize:9,letterSpacing:'.14em',
                                color:'rgba(251,191,36,0.80)',
                                fontFamily:"'JetBrains Mono',monospace",textTransform:'uppercase',
                                fontWeight:700,marginBottom:8}}>Recommended additions</div>
                              <div style={{display:'flex',flexDirection:'column',gap:5}}>
                                {missing.slice(0,4).map((m,i)=>(
                                  <div key={i} style={{display:'flex',alignItems:'center',gap:10,
                                    padding:'8px 10px',borderRadius:8,cursor:'pointer',
                                    background:'rgba(255,255,255,0.02)',
                                    border:'1px solid rgba(255,255,255,0.06)',
                                    transition:'all 0.15s ease'}}
                                    onClick={()=>addFeatureToActiveMap(m.emoji)}
                                    onMouseEnter={e=>{(e.currentTarget as HTMLDivElement).style.background='rgba(251,191,36,0.06)';(e.currentTarget as HTMLDivElement).style.borderColor='rgba(251,191,36,0.20)';}}
                                    onMouseLeave={e=>{(e.currentTarget as HTMLDivElement).style.background='rgba(255,255,255,0.02)';(e.currentTarget as HTMLDivElement).style.borderColor='rgba(255,255,255,0.06)';}}>
                                    <span style={{fontSize:16,flexShrink:0}}>{m.emoji}</span>
                                    <div style={{flex:1,minWidth:0}}>
                                      <span style={{fontSize:12,fontWeight:600,color:'rgba(220,255,240,0.75)',
                                        fontFamily:"'Inter',sans-serif"}}>{m.label}</span>
                                      <span style={{fontSize:10,color:'rgba(200,230,220,0.35)',
                                        fontFamily:"'JetBrains Mono',monospace",marginLeft:8}}>{m.detail}</span>
                                    </div>
                                    <span style={{fontSize:9,color:'rgba(251,191,36,0.50)',flexShrink:0,
                                      fontFamily:"'JetBrains Mono',monospace"}}>+ ADD</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            )}

                          </div>
                          );
                        })()}

                    </div>
                    <div style={{padding:'10px 24px',borderTop:`1px solid ${accentC}0.06)`,
                      background:`${accentC}0.02)`,display:'flex',alignItems:'center',gap:8}}>
                      <div style={{width:4,height:4,borderRadius:'50%',
                        background:`${accentC}0.40)`,flexShrink:0}}/>
                      <p style={{fontSize:9,color:`${accentC}0.28)`,margin:0,
                        fontFamily:"'JetBrains Mono',monospace",letterSpacing:'.05em',lineHeight:1.6}}>
                        {isAI
                          ?'Generated by Claude AI · based on your land, climate, family & budget · estimates only'
                          :'Generated by TerraForge calculation engine · upgrade to AI for personalised expert analysis'}
                      </p>
                    </div>
                  </div>
                </section>
                );
              })():null}

              {/* ══════════════════════════════════════════
                  SECTION 1 — SYSTEM HEALTH
              ══════════════════════════════════════════ */}
              <section>
                <SectionHead label="System Health"/>
                <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'200px 1fr',gap:12,alignItems:'stretch'}}>

                  {/* Score ring */}
                  <Card style={{display:'flex',flexDirection:'column',alignItems:'center',
                    justifyContent:'center',padding:'24px 16px',gap:8,
                    background:'linear-gradient(160deg,rgba(0,255,170,0.09) 0%,rgba(12,28,18,0.86) 100%)',
                    border:`1px solid ${scoreColor}28`}}>
                    <div style={{position:'absolute',top:0,left:0,right:0,height:1,
                      background:`linear-gradient(90deg,transparent,${scoreColor}55 50%,transparent)`}}/>
                    <ScoreRing value={displayCalc.resilienceScore} max={98} color={scoreColor} size={130} label="" sublabel="" animated/>
                    <div style={{textAlign:'center',marginTop:4}}>
                      <div style={{fontSize:30,fontWeight:300,color:scoreColor,lineHeight:1,
                        fontFamily:"'Inter',sans-serif",textShadow:`0 0 24px ${scoreColor}50`}}>
                        {displayCalc.resilienceScore}<span style={{fontSize:13,opacity:0.40}}>/98</span>
                      </div>
                      <div style={{marginTop:6,display:'inline-block',
                        padding:'3px 10px',borderRadius:99,
                        fontSize:8,fontWeight:700,letterSpacing:'.09em',
                        fontFamily:"'JetBrains Mono',monospace",textTransform:'uppercase',
                        background:`${scoreColor}12`,color:scoreColor,
                        border:`1px solid ${scoreColor}22`}}>
                        {displayCalc.resilienceScore>=70?'SELF-SUSTAINING':displayCalc.resilienceScore>=40?'DEVELOPING':'EARLY STAGE'}
                      </div>
                      <div style={{fontSize:9,color:'rgba(0,255,170,0.28)',
                        fontFamily:"'JetBrains Mono',monospace",marginTop:7,letterSpacing:'.09em'}}>
                        {allTiles.length} NODES · {Object.keys(Object.fromEntries(allTiles.map((t:{id:number;icon:string})=>[ICON_LOOKUP.get(t.icon)?.category||'?',1]))).length} CATEGORIES
                      </div>
                    </div>
                  </Card>

                  {/* 4 telemetry rings */}
                  <Card>
                    <div style={{padding:'16px 18px'}}>
                      <div style={{display:'grid',gridTemplateColumns:isMobile?'repeat(2,1fr)':'repeat(4,1fr)',gap:8}}>
                        {[
                          {value:displayCalc.foodSelfSufficiencyPct,max:100,color:'#00e09a',
                           label:'Food',sub:`${displayCalc.foodSelfSufficiencyPct}%`},
                          {value:displayCalc.waterSavingsPct,max:100,color:'#00e5ff',
                           label:'Water',sub:`${displayCalc.waterSavingsPct}%`},
                          {value:displayCalc.biodiversityScore,max:100,color:'#c8ff64',
                           label:'Biodiversity',sub:`${displayCalc.biodiversityScore}/100`},
                          {value:Math.min(100,Math.round((displayCalc.totalCo2Lbs/600)*100)),max:100,color:'#ffb340',
                           label:'Carbon',sub:`${displayCalc.totalCo2Lbs.toLocaleString()} lbs`},
                        ].map(({value,max,color,label,sub})=>(
                          <div key={label} style={{display:'flex',flexDirection:'column',
                            alignItems:'center',gap:4,
                            padding:'12px 6px',borderRadius:12,
                            background:`${color}05`,border:`1px solid ${color}12`}}>
                            <ScoreRing value={value} max={max} color={color} size={82} label={label} sublabel={sub} animated/>
                          </div>
                        ))}
                      </div>

                      {/* Score component bars */}
                      <div style={{marginTop:14,display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:'4px 20px'}}>
                        {[
                          {l:'Category diversity',v:Math.min(30,new Set(allTiles.map((t:{id:number;icon:string})=>ICON_LOOKUP.get(t.icon)?.category).filter(Boolean)).size*5),max:30,c:'#00ffaa'},
                          {l:'Food sufficiency',  v:Math.round((displayCalc.foodSelfSufficiencyPct/100)*22),max:22,c:'#00e09a'},
                          {l:'Water independence',v:Math.round((displayCalc.waterSavingsPct/100)*18),       max:18,c:'#00e5ff'},
                          {l:'Carbon offset',     v:Math.round((Math.min(displayCalc.totalCo2Lbs,600)/600)*15),max:15,c:'#c8ff64'},
                          {l:'Energy systems',    v:allTiles.some((t:{id:number;icon:string})=>['☀️','🌬️','🔋','⚡'].includes(t.icon))?8:0,max:8,c:'#ffb340'},
                          {l:'Feature count',     v:Math.min(5,Math.round((allTiles.length/12)*5)),  max:5,c:'#a78bfa'},
                        ].map(({l,v,max,c})=>(
                          <div key={l} style={{padding:'3px 0'}}>
                            <div style={{display:'flex',justifyContent:'space-between',
                              fontSize:9,color:'var(--ts)',fontFamily:"'JetBrains Mono',monospace",
                              letterSpacing:'.04em',marginBottom:3}}>
                              <span>{l}</span>
                              <span style={{color:c,fontWeight:600}}>{v}/{max}</span>
                            </div>
                            <div style={{height:3,borderRadius:99,background:'rgba(255,255,255,0.05)'}}>
                              <div style={{height:'100%',borderRadius:99,
                                background:c,width:`${(v/max)*100}%`,
                                transition:'width 1.4s cubic-bezier(0.22,1,0.36,1)',
                                boxShadow:`0 0 6px ${c}60`}}/>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>
                </div>
              </section>

              {/* ══════════════════════════════════════════
                  SECTION 2 — FINANCIAL SUMMARY
              ══════════════════════════════════════════ */}
              <section>
                <SectionHead label="Financial Summary" color="#ffb340"/>
                <div style={{display:'grid',gridTemplateColumns:isMobile?'repeat(2,1fr)':'repeat(4,1fr)',gap:10}}>
                  {[
                    {icon:'🌾',label:'Annual Yield',    c:'#00e09a',
                     value:displayCalc.totalYieldLbs.toLocaleString()+' lbs',
                     a:'$'+displayCalc.foodSavings.toLocaleString()+' est. food value',
                     b:`${famN} people need ${(famN*FOOD_NEED).toLocaleString()} lbs`},
                    {icon:'💰',label:'Year 1 Return',   c:'#00ffaa',
                     value:'$'+displayCalc.year1Savings.toLocaleString(),
                     a:'$'+Math.round(displayCalc.year1Savings/12).toLocaleString()+' / month',
                     b:'Food · water · CO₂ · energy'},
                    {icon:'💧',label:'Water Saved',     c:'#00e5ff',
                     value:displayCalc.totalWaterGal.toLocaleString()+' gal',
                     a:'$'+Math.round(displayCalc.totalWaterGal*0.005).toLocaleString()+' water value/yr',
                     b:`${displayCalc.waterSavingsPct}% outdoor independence`},
                    {icon:'⏱',label:'Payback',          c:'#ffb340',
                     value:displayCalc.paybackYears>0?displayCalc.paybackYears+' yrs':'—',
                     a:'$'+Math.round(net20>=0?net20:0).toLocaleString()+' net over 20 yrs',
                     b:'$'+Math.round((displayCalc.estimatedCostMin+displayCalc.estimatedCostMax)/2).toLocaleString()+' avg setup cost'},
                  ].map(({icon,label,c,value,a,b})=>(
                    <div key={label} className="tilt-card" style={{
                      position:'relative',overflow:'hidden',borderRadius:14,padding:'16px 16px',
                      background:`linear-gradient(160deg,${c}07 0%,rgba(0,7,4,0.88) 100%)`,
                      border:`1px solid ${c}18`,backdropFilter:'blur(20px)'}}>
                      <div style={{position:'absolute',top:0,left:0,right:0,height:1,
                        background:`linear-gradient(90deg,transparent,${c}40,transparent)`}}/>
                      <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:8}}>
                        <span style={{fontSize:15}}>{icon}</span>
                        <span style={{fontSize:9,fontWeight:700,letterSpacing:'.10em',
                          color:`${c}80`,fontFamily:"'JetBrains Mono',monospace",
                          textTransform:'uppercase'}}>{label}</span>
                      </div>
                      <div style={{fontSize:24,fontWeight:300,color:c,lineHeight:1,marginBottom:5,
                        fontFamily:"'Inter',sans-serif",textShadow:`0 0 16px ${c}45`}}>{value}</div>
                      <div style={{fontSize:11,color:c,opacity:0.72,fontFamily:"'Inter',sans-serif",
                        marginBottom:2,fontWeight:500}}>{a}</div>
                      <div style={{fontSize:10,color:'var(--ts)',fontFamily:"'Inter',sans-serif",
                        lineHeight:1.45}}>{b}</div>
                    </div>
                  ))}
                </div>
              </section>

              {/* ══════════════════════════════════════════
                  SECTION 3 — FEATURE BREAKDOWN
              ══════════════════════════════════════════ */}
              <section>
                <SectionHead label="Feature Breakdown"
                  right={`${displayCalc.featureBreakdown.length} types · ${allTiles.length} total`}/>
                <Card>
                  <div style={{overflowX:'auto',WebkitOverflowScrolling:'touch'}}>
                    <table style={{width:'100%',borderCollapse:'collapse'}}>
                      <thead>
                        <tr style={{background:'rgba(0,255,170,0.025)'}}>
                          {(isMobile?['Feature','CO₂ lbs','$/yr']:['Feature','Qty','Yield (lbs)','Water (gal)','CO₂ (lbs)','Est. Cost','Annual Value']).map((h,i)=>(
                            <th key={h} style={{
                              padding:isMobile?'8px 10px':'9px 14px',textAlign:i===0?'left':'right',
                              fontSize:9,fontWeight:700,letterSpacing:'.10em',textTransform:'uppercase',
                              color:'rgba(0,255,170,0.40)',fontFamily:"'JetBrains Mono',monospace",
                              borderBottom:'1px solid rgba(0,255,170,0.07)',whiteSpace:'nowrap',
                            }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {displayCalc.featureBreakdown.map((f:any)=>{
                          const lib=ICON_LOOKUP.get(f.emoji);
                          const c=(lib&&CAT_COLOR[lib.category])||'#00ffaa';
                          const animalRateOv:Record<string,number>={'🐔':3.30,'🦆':3.30,'🐐':1.25,'🐖':3.00,'🐇':3.00,'🐝':8.00};
                          const foodRateOv=animalRateOv[f.emoji]??0.80;
                          const av=Math.round(f.yieldLbs*f.count*foodRateOv+f.waterGal*f.count*.005+f.co2*f.count*.023);
                          return(
                            <tr key={f.emoji}
                              style={{borderBottom:'1px solid rgba(0,255,170,0.04)',transition:'background 0.11s',cursor:'pointer'}}
                              onClick={()=>setModal({emoji:f.emoji,bpId:activeBp?.id??'',tileId:-1})}
                              onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background=`${c}07`}}
                              onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background='transparent'}}>
                              <td style={{padding:'9px 14px'}}>
                                <div style={{display:'flex',alignItems:'center',gap:9}}>
                                  <FeatureIcon emoji={f.emoji} size={16}/>
                                  <div>
                                    <div style={{fontSize:12,fontWeight:500,color:'var(--td)',
                                      fontFamily:"'Inter',sans-serif"}}>{f.name}</div>
                                    <span style={{fontSize:8,color:c,fontFamily:"'JetBrains Mono',monospace",
                                      letterSpacing:'.05em',textTransform:'uppercase',
                                      padding:'1px 5px',borderRadius:99,background:`${c}0e`,
                                      display:'inline-block',marginTop:2}}>{lib?.category}</span>
                                  </div>
                                </div>
                              </td>
                              {(isMobile
                                ?[f.co2*f.count||'—',av>0?'$'+av.toLocaleString():'—']
                                :[f.count,f.yieldLbs*f.count>0?(f.yieldLbs*f.count).toLocaleString():'—',f.waterGal*f.count>0?(f.waterGal*f.count).toLocaleString():'—',f.co2*f.count||'—',lib?`$${Math.round((lib.costMin+lib.costMax)/2*f.count).toLocaleString()}`:'—',av>0?'$'+av.toLocaleString():'—']
                              ).map((v,j)=>(
                                <td key={j} style={{
                                  padding:isMobile?'7px 8px':'9px 14px',textAlign:'right',
                                  fontSize:isMobile?11:12,fontFamily:"'JetBrains Mono',monospace",
                                  color:j===1?'#a0ff60':'#00e09a',fontWeight:600}}>{v}</td>
                              ))}
                            </tr>
                          );
                        })}
                      </tbody>
                      <tfoot>
                        <tr style={{borderTop:'1px solid rgba(0,255,170,0.09)',background:'rgba(0,255,170,0.018)'}}>
                          <td style={{padding:'10px 14px',fontSize:10,fontWeight:700,
                            color:'rgba(0,255,170,0.55)',fontFamily:"'JetBrains Mono',monospace",
                            letterSpacing:'.08em'}}>TOTALS</td>
                          {(isMobile
                            ?[displayCalc.totalCo2Lbs.toLocaleString(),'$'+displayCalc.year1Savings.toLocaleString()]
                            :[allTiles.length,displayCalc.totalYieldLbs.toLocaleString(),displayCalc.totalWaterGal.toLocaleString(),displayCalc.totalCo2Lbs.toLocaleString(),'$'+displayCalc.estimatedCostMin.toLocaleString(),'$'+displayCalc.year1Savings.toLocaleString()]
                          ).map((v,i)=>(
                            <td key={i} style={{
                              padding:isMobile?'7px 8px':'10px 14px',textAlign:'right',
                              fontSize:isMobile?11:12,fontWeight:700,fontFamily:"'JetBrains Mono',monospace",
                              color:'#00ffaa'}}>{v}</td>
                          ))}
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </Card>
              </section>

              {/* ══════════════════════════════════════════
                  SECTION 4 — IMPROVE YOUR SYSTEM
              ══════════════════════════════════════════ */}
              <section>
                <SectionHead label="Improve Your System"/>
                <div style={{display:'grid',gridTemplateColumns:isMobile?'repeat(2,1fr)':'repeat(4,1fr)',gap:10}}>
                  {([
                    {icon:Award,   label:'Regeneration Score',   value:`${displayCalc.resilienceScore}`,
                     sub:displayCalc.resilienceScore>=70?'🟢 Self-Sustaining':displayCalc.resilienceScore>=40?'🟡 Developing':'🔴 Early Stage',color:'#00ffaa'},
                    {icon:Leaf,    label:'Annual Yield (lbs)',   value:displayCalc.totalYieldLbs.toLocaleString(),
                     sub:`~${Math.round(displayCalc.totalYieldLbs/FOOD_NEED*10)/10} people/yr`,color:'#00e09a'},
                    {icon:Target,  label:'Food Self-Sufficiency',value:`${displayCalc.foodSelfSufficiencyPct}%`,
                     sub:`${displayCalc.totalYieldLbs.toLocaleString()} of ${(famN*FOOD_NEED).toLocaleString()} lbs`,color:'#00ffaa'},
                    {icon:Users,   label:'Biodiversity Score',   value:`${displayCalc.biodiversityScore}`,
                     sub:displayCalc.biodiversityScore>=60?'Thriving':displayCalc.biodiversityScore>=30?'Growing':'Minimal',color:'#c8ff64'},
                    {icon:Droplet, label:'Water Saved',          value:displayCalc.totalWaterGal.toLocaleString()+' gal',
                     sub:`${displayCalc.waterSavingsPct}% of irrigation budget`,color:'#00e5ff'},
                    {icon:Heart,   label:'Year 1 Savings',       value:`$${displayCalc.year1Savings.toLocaleString()}`,
                     sub:`$${Math.round(displayCalc.year1Savings/12).toLocaleString()}/mo`,color:'#ffb340'},
                    {icon:Calendar,label:'Payback Period',       value:displayCalc.paybackYears>0?`${displayCalc.paybackYears} yrs`:'N/A',
                     sub:displayCalc.paybackYears>0?`then $${displayCalc.year1Savings.toLocaleString()}/yr`:'place features',color:'#ffb340'},
                    {icon:Recycle, label:'CO₂ Sequestered',      value:`${displayCalc.totalCo2Lbs.toLocaleString()} lbs`,
                     sub:`≈${Math.round(displayCalc.totalCo2Lbs*1.31).toLocaleString()} fewer miles`,color:'#e09020'},
                  ] as {icon:any;label:string;value:string;sub:string;color:string}[])
                  .slice().sort((a,b)=>{
                    const aT=!!(tips[a.label]?.length),bT=!!(tips[b.label]?.length);
                    return aT===bT?0:aT?-1:1;
                  })
                  .map(({icon,label,value,sub,color},i)=>(
                    <StatCard key={label} icon={icon} label={label} value={value} sub={sub}
                      delay={i*14} tips={tips[label]} onAddFeature={addFeatureToActiveMap} color={color}/>
                  ))}
                </div>
              </section>



              {/* ── Dashboard disclaimer ── */}
              <div style={{
                padding:'14px 20px',borderRadius:14,marginTop:4,
                background:'rgba(0,255,170,0.03)',
                border:'1px solid rgba(0,255,170,0.10)',
                display:'flex',alignItems:'flex-start',gap:10,
              }}>
                <div style={{width:16,height:16,borderRadius:'50%',flexShrink:0,marginTop:1,
                  background:'rgba(0,255,170,0.15)',border:'1px solid rgba(0,255,170,0.35)',
                  display:'flex',alignItems:'center',justifyContent:'center'}}>
                  <span style={{fontSize:9,color:'#00ffaa',fontWeight:800}}>i</span>
                </div>
                <p style={{fontSize:10,color:'rgba(0,255,170,0.45)',margin:0,
                  fontFamily:"'JetBrains Mono',monospace",letterSpacing:'.04em',lineHeight:1.7}}>
                  TerraForge is a planning and educational tool. All yield, water, financial, and carbon figures are 
                  illustrative estimates based on conservative US averages — actual results depend on local soil conditions, 
                  climate variability, implementation quality, and market prices. Consult qualified agronomists, 
                  engineers, and local authorities before major earthworks, energy installations, livestock operations, 
                  or water system changes. Not financial or professional advice.
                </p>
              </div>

              </>);
            })()}
            </div>
          )}

          {activeTab==='maps'&&(
            <div className="a-fadeUp" style={{
              position:'relative',
              display:'grid',
              gridTemplateColumns:isMobile?'1fr':'clamp(280px,340px,32%) 1fr',
              gap:14,alignItems:'start',
            }}>

              {/* -- Feature Library sidebar -- */}
              <div style={{
                position:isMobile?'relative':'sticky',top:isMobile?'auto':76,
                borderRadius:20,overflow:isMobile?'visible':'hidden',
                maxWidth:'100%',
                background:'rgba(14,30,20,0.74)',
                border:'1px solid rgba(0,255,170,0.08)',
                backdropFilter:'blur(40px) saturate(1.8) brightness(1.24)',
                boxShadow:'0 16px 48px rgba(0,0,0,0.35)',
              }}>
                {/* Library header */}
                <div style={{padding:isMobile?'8px 10px':'12px 14px',borderBottom:'1px solid rgba(0,255,170,0.12)',
                  background:'rgba(0,255,170,0.018)'}}>
                  <div style={{display:'flex',alignItems:'center',gap:7,marginBottom:10}}>
                    <BookOpen style={{width:12,height:12,color:'#00ffaa'}}/>
                    <span style={{fontSize:13,fontWeight:700,letterSpacing:'.04em',color:'var(--td)',
                      fontFamily:"'Space Grotesk',sans-serif"}}>Feature Library</span>
                    <span style={{marginLeft:'auto',fontSize:11,color:'var(--ts)',
                      fontFamily:"'Inter',sans-serif"}}>{filteredIcons.length} items</span>
                  </div>
                  {/* Context banner — tells user what the current map accepts */}
                  {mapSubTab==='raised-bed'?(
                    <div style={{marginBottom:10,padding:'7px 10px',borderRadius:9,
                      background:'rgba(0,212,255,0.07)',border:'1px solid rgba(0,212,255,0.20)',
                      display:'flex',alignItems:'center',gap:7}}>
                      <span style={{fontSize:13}}>🌱</span>
                      <span style={{fontSize:11,color:'#00d4ff',fontFamily:"'Inter',sans-serif",lineHeight:1.45}}>
                        <strong>Raised Bed mode</strong> — drag crops &amp; plants into this bed.
                        {raisedBedBps.length===0&&<span style={{display:'block',marginTop:2,opacity:0.75}}>First add a 🌱 tile on the Property Map.</span>}
                      </span>
                    </div>
                  ):(
                    <div style={{marginBottom:10,padding:'7px 10px',borderRadius:9,
                      background:'rgba(0,255,170,0.05)',border:'1px solid rgba(0,255,170,0.24)',
                      display:'flex',alignItems:'center',gap:7}}>
                      <span style={{fontSize:13}}>🏡</span>
                      <span style={{fontSize:11,color:'#00ffaa',fontFamily:"'Inter',sans-serif",lineHeight:1.45}}>
                        <strong>Property Map mode</strong> — drag features onto your land.
                        <span style={{display:'block',marginTop:2,opacity:0.75}}>Tip: place <strong>🌱 Raised Bed</strong> to create plantable beds.</span>
                      </span>
                    </div>
                  )}
                  {/* Category filter chips */}
                  <div style={{display:'flex',flexWrap:'wrap',gap:4}}>
                    {(['all','food','water','energy','soil','biodiversity','animals','flowers'] as const).map(cat=>{
                      const C=cat==='all'?'#00ffaa':(CAT_COLOR[cat]??'#00ffaa');
                      const on=iconFilter===cat;
                      return(
                        <button key={cat} onClick={()=>setIconFilter(cat)} style={{
                          padding:isMobile?'3px 7px':'4px 10px',borderRadius:99,
                          fontSize:10,fontWeight:700,letterSpacing:'.04em',
                          fontFamily:"'Inter',sans-serif",textTransform:'uppercase',
                          cursor:'pointer',transition:'transform 0.13s,opacity 0.13s,border-color 0.13s,box-shadow 0.13s',
                          background:on?C+'1a':'rgba(0,255,170,0.03)',
                          border:'1px solid '+(on?C+'40':'rgba(0,255,170,0.08)'),
                          color:on?C:'var(--ts)',
                        }}>
                          {cat}
                        </button>
                      );
                    })}
                  </div>
                </div>
                {/* Icon grid -- scrollable */}
                <div className="lib-scroll" style={{
                  padding:isMobile?'6px':'10px',
                  overflowY:'scroll',
                  WebkitOverflowScrolling:'touch',
                  maxHeight:isMobile?'45vh':'calc(100vh - 220px)',
                }}>
                  <div style={{display:'grid',gridTemplateColumns:isMobile?'repeat(4,1fr)':'repeat(4,1fr)',gap:isMobile?4:6,width:'100%'}}>
                    {filteredIcons.map((item:any)=>{
                      const C=CAT_COLOR[item.category]??'#00ffaa';
                      return(
                        <div key={item.name}
                          draggable
                          onDragStart={e=>{
                            _draggedEmoji=item.emoji;
                            _isDraggingFromLibrary=true;
                            document.querySelectorAll('[data-bp-id]').forEach(el=>{
                              (el.closest('.hex') as HTMLElement|null)?.classList.add('grid-lib-drag');
                            });
                            e.dataTransfer.setData('text/plain',item.emoji);
                          }}
                          onDragEnd={()=>{
                            _draggedEmoji='';
                            _isDraggingFromLibrary=false;
                            document.querySelectorAll('.grid-lib-drag').forEach(el=>el.classList.remove('grid-lib-drag'));
                          }}
                          onClick={()=>setModal({emoji:item.emoji,bpId:activeBp?.id??'',tileId:-1})}
                          style={{
                            width:'100%',minHeight:isMobile?46:64,display:'flex',flexDirection:'column',
                            alignItems:'center',gap:isMobile?1:4,padding:isMobile?'4px 2px':'8px 4px 7px',borderRadius:10,
                            cursor:'pointer',
                            background:'rgba(0,255,170,0.04)',
                            border:'1px solid rgba(0,255,170,0.10)',
                            transition:'transform 0.14s cubic-bezier(0.22,1,0.36,1),opacity 0.14s cubic-bezier(0.22,1,0.36,1),border-color 0.14s cubic-bezier(0.22,1,0.36,1),box-shadow 0.14s cubic-bezier(0.22,1,0.36,1)',
                          }}
                          onMouseEnter={e=>{const el=e.currentTarget as HTMLElement;
                            el.style.background=C+'12';el.style.borderColor=C+'38';
                            el.style.transform='scale(1.06)';el.style.boxShadow='0 0 12px '+C+'20';}}
                          onMouseLeave={e=>{const el=e.currentTarget as HTMLElement;
                            el.style.background='rgba(0,255,170,0.04)';el.style.borderColor='rgba(0,255,170,0.10)';
                            el.style.transform='scale(1)';el.style.boxShadow='';}}
                          title={item.name+' — click for stats · drag to map'}>
                          <FeatureIcon emoji={item.emoji} size={isMobile?18:22}/>
                          <span style={{
                            fontSize:isMobile?8:10,fontWeight:600,color:'var(--td)',textAlign:'center',
                            lineHeight:1.25,fontFamily:"'Inter',sans-serif",
                            display:'-webkit-box',WebkitLineClamp:2,
                            WebkitBoxOrient:'vertical' as const,overflow:'hidden',width:'100%',
                          }}>{item.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* -- Map area -- */}
              <div style={{display:'flex',flexDirection:'column',gap:11}}>

                {/* Property / Raised Beds switcher */}
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
                  {([['property','🏡','Property Map','#00ffaa'],['raised-bed','🌱','Raised Beds','#00d4ff']] as const).map(([t,icon,label,C])=>{
                    const on=mapSubTab===t;
                    const count=t==='property'?propBps.length:raisedBedBps.length;
                    return(
                      <button key={t} onClick={()=>setMapSubTab(t)} style={{
                        padding:'11px 0',borderRadius:14,cursor:'pointer',
                        display:'flex',alignItems:'center',justifyContent:'center',gap:8,
                        fontFamily:"'Space Grotesk',sans-serif",fontWeight:800,
                        fontSize:12,letterSpacing:'.08em',textTransform:'uppercase',
                        color:on?C:'var(--tf)',
                        background:on?C+'0d':'rgba(0,255,170,0.025)',
                        border:'1px solid '+(on?C+'2e':'rgba(0,255,170,0.07)'),
                        boxShadow:on?'0 0 22px '+C+'0c':'none',
                        transition:'transform 0.20s cubic-bezier(0.22,1,0.36,1),opacity 0.20s cubic-bezier(0.22,1,0.36,1),border-color 0.20s cubic-bezier(0.22,1,0.36,1),box-shadow 0.20s cubic-bezier(0.22,1,0.36,1)',
                      }}>
                        <span style={{fontSize:16}}>{icon}</span>
                        {label}
                        <span style={{fontSize:8,opacity:0.45,fontFamily:"'JetBrains Mono',monospace"}}>
                          ({count})
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Blueprint selector strip */}
                {activeBp&&(
                  <div style={{display:'flex',alignItems:'center',gap:6,flexWrap:'wrap'}}>
                    {(mapSubTab==='property'?propBps:raisedBedBps).map((bp:Blueprint)=>{
                      const on=activeBp?.id===bp.id;
                      const C=mapSubTab==='property'?'#00ffaa':'#00d4ff';
                      return(
                        <button key={bp.id} onClick={()=>setActiveBpId(bp.id)} style={{
                          padding:'5px 13px',borderRadius:9,fontSize:12,cursor:'pointer',
                          fontFamily:"'Inter',sans-serif",fontWeight:600,
                          color:on?C:'var(--tf)',
                          background:on?C+'12':'rgba(0,255,170,0.03)',
                          border:'1px solid '+(on?C+'38':'rgba(0,255,170,0.08)'),
                          boxShadow:on?'0 0 12px '+C+'15':'none',
                          transition:'transform 0.14s ease,opacity 0.14s ease,border-color 0.14s ease,box-shadow 0.14s ease',
                        }}>
                          {bp.name}
                        </button>
                      );
                    })}
                    {mapSubTab==='property'&&(
                      <button onClick={()=>addBlueprint('property')} style={{
                        padding:'4px 10px',borderRadius:9,fontSize:10,cursor:'pointer',
                        fontFamily:"'JetBrains Mono',monospace",
                        color:'var(--ts)',background:'rgba(0,255,170,0.03)',
                        border:'1px dashed rgba(0,255,170,0.14)',
                        display:'flex',alignItems:'center',gap:4,
                      }}>
                        <Plus style={{width:9,height:9}}/> New
                      </button>
                    )}
                    {mapSubTab==='raised-bed'&&(
                      <div style={{display:'flex',alignItems:'center',gap:6,padding:'4px 10px',borderRadius:9,
                        fontSize:10,fontFamily:"'JetBrains Mono',monospace",
                        color:'rgba(0,212,255,0.45)',background:'rgba(0,212,255,0.04)',
                        border:'1px solid rgba(0,212,255,0.10)'}}>
                        <span style={{fontSize:10}}>🌱</span> Add raised beds on Property Map
                      </div>
                    )}
                    {mapSubTab==='property'&&propBps.length>1&&activeBp&&(
                      <button onClick={()=>deleteBp(activeBp.id)} style={{
                        padding:'4px 10px',borderRadius:9,fontSize:10,cursor:'pointer',
                        fontFamily:"'JetBrains Mono',monospace",marginLeft:'auto',
                        color:'var(--red)',background:'rgba(239,68,68,0.05)',
                        border:'1px solid rgba(239,68,68,0.15)',
                        display:'flex',alignItems:'center',gap:4,
                      }}>
                        <Trash2 style={{width:9,height:9}}/> Delete
                      </button>
                    )}
                  </div>
                )}
                {/* Raised Beds empty state */}
                {mapSubTab==='raised-bed'&&raisedBedBps.length===0&&(
                  <div style={{
                    borderRadius:16,padding:'28px 24px',textAlign:'center',
                    background:'rgba(0,212,255,0.03)',border:'1px dashed rgba(0,212,255,0.18)',
                  }}>
                    <div style={{fontSize:32,marginBottom:12}}>🌱</div>
                    <p style={{fontSize:14,fontWeight:600,color:'#00d4ff',fontFamily:"'Space Grotesk',sans-serif",marginBottom:8}}>
                      No Raised Beds Yet
                    </p>
                    <p style={{fontSize:13,color:'var(--tf)',fontFamily:"'Inter',sans-serif",lineHeight:1.65,margin:0}}>
                      Switch to the <strong style={{color:'#00ffaa'}}>Property Map</strong> and place a{' '}
                      <strong style={{color:'#00d4ff'}}>🌱 Raised Bed</strong> tile.<br/>
                      Each bed you place creates a dedicated grid here to fill with crops.
                    </p>
                  </div>
                )}

                {/* 3D Map grid */}
                {activeBp&&(
                  <>

                  <div style={{borderRadius:20,
                    background:'rgba(14,30,20,0.74)',border:'1px solid rgba(0,255,170,0.08)',
                    backdropFilter:'blur(16px)',
                    maxWidth:'100%',
                    overflowX:'hidden',
                  }}>
                    <MapGrid key={activeBp.id+'|'+activeBp.tiles.map(t=>t.id+t.icon).join(',')} bp={liveRot?.id===activeBp.id?{...activeBp,rotation:{x:liveRot.x,y:liveRot.y}}:activeBp}
                      gridPixelSize={isMobile
                        ?(activeBp.type==='property'?Math.min(280,window.innerWidth-56):activeBp.type==='raised-bed'?Math.min(300,window.innerWidth-56):Math.min(240,window.innerWidth-56))
                        :(activeBp.type==='property'?760:activeBp.type==='raised-bed'?680:600)}
                      isDragging={draggingId===activeBp.id}
                      onMouseDown={e=>{if(e.button===0){setDraggingId(activeBp.id);lastMouse.current={x:e.clientX,y:e.clientY};}}}
                      onTouchStart={e=>{
                        if(e.touches.length!==1)return;
                        const t=e.touches[0];
                        setDraggingId(activeBp.id);
                        lastMouse.current={x:t.clientX,y:t.clientY};
                      }}
                      onDrop={(id,em)=>{
                        document.querySelectorAll('.grid-lib-drag').forEach(el=>el.classList.remove('grid-lib-drag'));
                        const bpId=activeBpIdRef.current;
                        if(activeBp.type==='raised-bed'&&RAISED_BED_BLOCKED.has(em)){
                          const toast=document.createElement('div');
                          toast.style.cssText='position:fixed;bottom:32px;left:50%;transform:translateX(-50%);background:#1a0a0a;color:#f87171;border:1px solid rgba(239,68,68,0.35);border-radius:12px;padding:10px 20px;font-size:13px;font-weight:600;z-index:99999;pointer-events:none;';
                          toast.textContent='Place this on the Property Map, not inside a raised bed.';
                          document.body.appendChild(toast);setTimeout(()=>toast.remove(),3000);
                          return;
                        }
                        // If no blueprint yet, auto-generate from drop
                        if(!hasData&&!loading){
                          updateBpTiles(bpId,tiles=>[...tiles.filter((t:{id:number;icon:string})=>t.id!==id),{id,icon:em}]);
                          const featureName=ICON_LOOKUP.get(em)?.name??'feature';
                          onGenerate({...fv,prompt:`Add a ${featureName} to my homestead`});
                        } else {
                          // Route through addFeatureToActiveMap so budget check fires
                          // We place at specific slot id — override the slot logic by placing directly
                          // but still run the budget intercept first
                          if(!budgetWarned){
                            const featureCost=ICON_LOOKUP.get(em);
                            const addCost=featureCost?Math.round((featureCost.costMin+featureCost.costMax)/2):0;
                            const currentCost=allTiles.reduce((sum:number,t:{id:number;icon:string})=>{
                              const f=ICON_LOOKUP.get(t.icon);
                              return sum+(f?Math.round((f.costMin+f.costMax)/2):0);
                            },0);
                            const budget=Math.max(500,Number(fv.budget)||2800);
                            if(addCost>0&&allTiles.length>1&&currentCost+addCost>budget){
                              setPendingBudgetAdd(em);
                              pendingDropSlotRef.current={bpId,id,em};
                              return;
                            }
                          }
                          updateBpTiles(bpId,tiles=>[...tiles.filter((t:{id:number;icon:string})=>t.id!==id),{id,icon:em}]);
                        }
                      }}
                      onTileMove={(from,to)=>{
                        const bpId=activeBpIdRef.current;
                        updateBpTiles(bpId,tiles=>{
                          const tl=[...tiles];
                          const fi=tl.findIndex(t=>t.id===from);
                          const ti=tl.findIndex(t=>t.id===to);
                          if(fi===-1)return tl;
                          if(ti===-1){const u=[...tl];u[fi]={...u[fi],id:to};return u;}
                          const u=[...tl];const ic=u[fi].icon;u[fi]={id:from,icon:u[ti].icon};u[ti]={id:to,icon:ic};return u;
                        });
                      }}
                      onRemove={id=>updateBpTiles(activeBpIdRef.current,tiles=>tiles.filter((t:{id:number;icon:string})=>t.id!==id))}
                      onTileClick={(id,em)=>setModal({emoji:em,bpId:activeBp.id,tileId:id})}
                      onReset={()=>updateBp(activeBp.id,{rotation:{x:-22,y:28}})}/>
                  </div>
                  </>
                )}

                {/* Map actions row */}
                {activeBp&&(
                  <div style={{display:'flex',gap:7,flexWrap:'wrap',alignItems:'center'}}>
                    {activeBp.type!=='raised-bed'&&(
                    <button onClick={()=>duplicateBp(activeBp.id)} style={{
                      display:'flex',alignItems:'center',gap:5,padding:'6px 13px',borderRadius:9,
                      background:'rgba(0,255,170,0.05)',border:'1px solid rgba(0,255,170,0.11)',
                      color:'var(--tf)',fontSize:11,cursor:'pointer',
                      fontFamily:"'Inter',sans-serif",fontWeight:500,
                      transition:'transform 0.14s ease,opacity 0.14s ease,border-color 0.14s ease,box-shadow 0.14s ease',
                    }}>
                      <Copy style={{width:10,height:10}}/> Duplicate
                    </button>
                    )}
                    {activeBp.type==='raised-bed'&&(
                      <div style={{padding:'5px 11px',borderRadius:9,fontSize:11,
                        color:'rgba(0,212,255,0.50)',fontFamily:"'JetBrains Mono',monospace",
                        background:'rgba(0,212,255,0.03)',border:'1px solid rgba(0,212,255,0.10)',
                        letterSpacing:'.06em'}}>
                        🌱 {activeBp.name} · 4×8 bed · {activeBp.tiles.length}/32 planted
                      </div>
                    )}
                    {/* Add to existing blueprint — visible in map actions row when hasData */}
                    {hasData&&(
                      <button type="button" onClick={()=>setAddMode((v:boolean)=>!v)}
                        style={{
                          display:'flex',alignItems:'center',gap:7,
                          padding:'5px 12px',borderRadius:9,cursor:'pointer',
                          transition:'all 0.18s',
                          background:addMode
                            ?'linear-gradient(135deg,rgba(251,191,36,0.18),rgba(255,140,0,0.09))'
                            :'rgba(255,255,255,0.03)',
                          border:addMode?'1px solid rgba(251,191,36,0.55)':'1px solid rgba(255,255,255,0.10)',
                          boxShadow:addMode?'0 0 14px rgba(251,191,36,0.18)':'none',
                          color:addMode?'#fbbf24':'rgba(255,255,255,0.45)',
                          fontSize:11,fontWeight:700,
                          fontFamily:"'Space Grotesk',sans-serif",letterSpacing:'.03em',
                        }}>
                        <span style={{fontSize:12}}>➕</span>
                        {addMode?'Adding to blueprint':'Add to existing'}
                        {/* Toggle pill */}
                        <div style={{width:26,height:14,borderRadius:99,flexShrink:0,position:'relative',
                          background:addMode?'#fbbf24':'rgba(255,255,255,0.12)',
                          border:addMode?'none':'1px solid rgba(255,255,255,0.20)',
                          transition:'all 0.18s'}}>
                          <div style={{position:'absolute',top:1,left:addMode?12:1,width:12,height:12,
                            borderRadius:'50%',background:addMode?'#1a0e00':'rgba(255,255,255,0.50)',
                            transition:'left 0.18s'}}/>
                        </div>
                      </button>
                    )}
                    {renamingId===activeBp.id?(
                      <div style={{display:'flex',gap:6,alignItems:'center'}}>
                        <input value={renameVal} onChange={e=>setRenameVal(e.target.value)}
                          onKeyDown={e=>{
                            if(e.key==='Enter'){const n=renameVal.trim();if(n){updateBp(activeBp.id,{name:n});setRenamingId(null);}else setRenamingId(null);}
                            if(e.key==='Escape')setRenamingId(null);
                          }}
                          style={{
                            padding:'5px 10px',borderRadius:8,fontSize:11,width:136,
                            background:'rgba(0,255,170,0.06)',border:'1px solid rgba(0,255,170,0.22)',
                            color:'var(--tp)',fontFamily:"'Inter',sans-serif",outline:'none',
                          }} autoFocus/>
                        <button onClick={()=>{const n=renameVal.trim();if(n){updateBp(activeBp.id,{name:n});}setRenamingId(null);}}
                          style={{padding:'5px 10px',borderRadius:8,fontSize:11,cursor:'pointer',
                            background:'rgba(0,255,170,0.10)',border:'1px solid rgba(0,255,170,0.24)',
                            color:'#00ffaa',fontFamily:"'Inter',sans-serif",fontWeight:600}}>
                          Save
                        </button>
                      </div>
                    ):(
                      <button onClick={()=>{setRenamingId(activeBp.id);setRenameVal(activeBp.name);}} style={{
                        display:'flex',alignItems:'center',gap:5,padding:'6px 13px',borderRadius:9,
                        background:'rgba(0,255,170,0.05)',border:'1px solid rgba(0,255,170,0.11)',
                        color:'var(--tf)',fontSize:11,cursor:'pointer',
                        fontFamily:"'Inter',sans-serif",fontWeight:500,
                      }}>
                        <Pencil style={{width:10,height:10}}/> Rename
                      </button>
                    )}
                    <div style={{flex:1,minWidth:160}}>
                      <input defaultValue={activeBp.notes??''} onBlur={e=>updateBp(activeBp.id,{notes:e.target.value})} key={activeBp.id}
                        id="map-notes" name="map-notes" placeholder="Map notes…"
                        style={{
                          width:'100%',padding:'6px 11px',borderRadius:9,fontSize:11,
                          background:'rgba(0,255,170,0.03)',border:'1px solid rgba(0,255,170,0.08)',
                          color:'var(--tf)',fontFamily:"'Inter',sans-serif",outline:'none',
                        }}/>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========== BLUEPRINTS ================================== */}
          {activeTab==='blueprints'&&(
            <div className="a-fadeUp" style={{display:'flex',flexDirection:'column',gap:16}}>
              {!isPro&&(
                <div style={{
                  borderRadius:22,padding:'48px 32px',textAlign:'center',
                  background:'linear-gradient(160deg,rgba(0,255,170,0.05) 0%,rgba(8,12,8,0.95) 100%)',
                  border:'1px solid rgba(0,255,170,0.15)',
                }}>
                  <div style={{fontSize:36,marginBottom:16}}>📋</div>
                  <h2 style={{fontSize:22,fontWeight:700,color:'#00ffaa',margin:'0 0 10px',fontFamily:"'Space Grotesk',sans-serif"}}>Blueprints</h2>
                  <p style={{fontSize:14,color:'rgba(200,230,212,0.55)',margin:'0 0 28px',lineHeight:1.7,maxWidth:400,marginLeft:'auto',marginRight:'auto'}}>
                    Create and manage unlimited garden blueprints. Free accounts can save 1 blueprint to their profile. Upgrade to Pro for unlimited saves and sync across devices.
                  </p>
                  <div style={{display:'flex',gap:10,justifyContent:'center',flexWrap:'wrap'}}>
                    <button onClick={()=>handleDirectUpgrade('annual')} style={{
                      position:'relative',
                      background:'linear-gradient(135deg,#00e87a,#00c45a)',border:'none',borderRadius:12,
                      color:'#051a0e',fontSize:14,fontWeight:800,padding:'13px 26px',cursor:'pointer',
                      letterSpacing:'.04em',fontFamily:"'Courier New',monospace",
                      boxShadow:'0 4px 20px rgba(0,232,122,0.25)',
                    }}>
                      Annual — $79/yr
                      <span style={{position:'absolute',top:-9,right:-8,background:'#ffb020',color:'#1a0a00',
                        fontSize:8,fontWeight:800,padding:'2px 7px',borderRadius:99,letterSpacing:'.04em',
                        textTransform:'uppercase'}}>Save 27%</span>
                    </button>
                    <button onClick={()=>handleDirectUpgrade('monthly')} style={{
                      background:'rgba(0,255,130,0.08)',border:'1px solid rgba(0,255,130,0.25)',borderRadius:12,
                      color:'#00ff82',fontSize:14,fontWeight:800,padding:'13px 26px',cursor:'pointer',
                      letterSpacing:'.04em',fontFamily:"'Courier New',monospace",
                    }}>Monthly — $9/mo</button>
                  </div>
                </div>
              )}
              {isPro&&(<>
              {/* Header */}
              <div style={{position:'relative',overflow:'hidden',borderRadius:22,padding:'24px 28px',
                background:'linear-gradient(135deg,rgba(0,255,170,0.06) 0%,rgba(12,28,18,0.82) 40%,rgba(0,6,18,0.88) 100%)',
                border:'1px solid rgba(0,255,170,0.24)',backdropFilter:'blur(18px)',
                boxShadow:'0 0 60px rgba(0,255,170,0.06),0 16px 48px rgba(0,0,0,0.30)'}}>
                <div style={{position:'absolute',top:0,left:0,right:0,height:1,
                  backgroundImage:'linear-gradient(90deg,transparent,rgba(0,255,170,0.60) 30%,rgba(167,139,250,0.40) 70%,transparent)',
                  backgroundSize:'200% 100%',animation:'borderFlow 8s linear infinite'}}/>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:16}}>
                  <div>
                    <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}>
                      <div style={{width:2,height:16,borderRadius:2,background:'linear-gradient(180deg,#00ffaa,#a78bfa)',
                        boxShadow:'0 0 14px rgba(0,255,170,0.70)'}}/>
                      <span style={{fontSize:14,fontWeight:800,letterSpacing:'.12em',
                        background:'linear-gradient(90deg,#00ffaa,#a78bfa)',
                        WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text',
                        fontFamily:"'Space Grotesk',sans-serif",textTransform:'uppercase'}}>Blueprint Archive</span>
                      <span style={{fontSize:10,color:'rgba(0,255,170,0.55)',fontFamily:"'JetBrains Mono',monospace",
                        padding:'3px 9px',borderRadius:99,background:'rgba(0,255,170,0.08)',
                        border:'1px solid rgba(0,255,170,0.16)'}}>{blueprints.length} maps</span>
                    </div>
                    <p style={{fontSize:13,color:'var(--ts)',fontFamily:"'Inter',sans-serif",margin:0}}>
                      Click any blueprint to open it in the map editor.
                    </p>
                  </div>
                  <div style={{display:'flex',gap:8}}>
                    {(['property'] as const).map(t=>(
                      <button key={t} onClick={()=>addBlueprint(t)} style={{
                        display:'flex',alignItems:'center',gap:6,padding:'8px 16px',borderRadius:11,
                        background:'rgba(0,255,170,0.08)',
                        border:'1px solid rgba(0,255,170,0.22)',
                        color:'#00ffaa',fontSize:12,cursor:'pointer',
                        fontFamily:"'Space Grotesk',sans-serif",fontWeight:700,letterSpacing:'.06em',
                        transition:'transform 0.18s,opacity 0.18s,border-color 0.18s,box-shadow 0.18s',
                      }}
                        onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.transform='translateY(-1px)';}}
                        onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.transform='';}}>
                        <Plus style={{width:11,height:11}}/>
                        Property
                      </button>
                    ))}
                    <div style={{display:'flex',alignItems:'center',gap:6,padding:'8px 14px',borderRadius:11,
                      background:'rgba(0,212,255,0.04)',border:'1px solid rgba(0,212,255,0.14)',
                      color:'rgba(0,212,255,0.50)',fontSize:11,
                      fontFamily:"'JetBrains Mono',monospace",letterSpacing:'.06em'}}>
                      🌱 Raised Beds auto-sync
                    </div>
                  </div>
                </div>
              </div>

              {/* Blueprint grid */}
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:12}}>
                {blueprints.filter((b:Blueprint)=>b.type!=='garden').map((bp:Blueprint,bi:number)=>{
                  const bc=calculateFromTiles(bp.tiles,Math.max(1,Number(fv.familySize)||4));
                  const C=bp.type==='property'?'#00ffaa':bp.type==='raised-bed'?'#00d4ff':'#00eeff';
                  return(
                    <div key={bp.id} className="tilt-card"
                      onClick={()=>{
                        if(bp.type==='property'){
                          setMapSubTab('property');
                          const fi=propBps.findIndex((b:Blueprint)=>b.id===bp.id);
                          setPropIdx(Math.max(0,fi));
                        } else if(bp.type==='raised-bed'){
                          setMapSubTab('raised-bed');
                          const fi=raisedBedBps.findIndex((b:Blueprint)=>b.id===bp.id);
                          setRbIdx(Math.max(0,fi));
                        }
                        setActiveTab('maps');
                      }}
                      style={{position:'relative',overflow:'hidden',cursor:'pointer',
                        borderRadius:18,
                        background:`linear-gradient(160deg,${C}0a 0%,rgba(12,28,18,0.78) 50%,rgba(0,6,16,0.84) 100%)`,
                        border:`1px solid ${C}1e`,
                        backdropFilter:'blur(40px) saturate(1.6)',
                        boxShadow:`0 0 24px ${C}08,0 8px 28px rgba(0,0,0,0.35)`,
                        transition:'transform 0.22s cubic-bezier(0.22,1,0.36,1),opacity 0.22s cubic-bezier(0.22,1,0.36,1),border-color 0.22s cubic-bezier(0.22,1,0.36,1),box-shadow 0.22s cubic-bezier(0.22,1,0.36,1)',
                        animationDelay:`${bi*40}ms`}}>
                      <div style={{position:'absolute',top:0,left:0,right:0,height:1,
                        background:`linear-gradient(90deg,transparent,${C}50,transparent)`}}/>
                      {/* Header */}
                      <div style={{padding:'16px 18px 14px',borderBottom:`1px solid ${C}14`}}>
                        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:6}}>
                          <div style={{fontSize:15,fontWeight:800,color:C,
                            fontFamily:"'Space Grotesk',sans-serif",letterSpacing:'.02em',
                            textShadow:`0 0 16px ${C}55`}}>{bp.name}</div>
                          <div style={{fontSize:9,fontWeight:700,letterSpacing:'.12em',
                            padding:'3px 9px',borderRadius:99,
                            background:`${C}12`,border:`1px solid ${C}25`,color:C,
                            fontFamily:"'JetBrains Mono',monospace",textTransform:'uppercase'}}>
                            {bp.type==='raised-bed'?'RAISED BED':bp.type}
                          </div>
                        </div>
                        <div style={{fontSize:11,color:`${C}60`,fontFamily:"'Inter',sans-serif"}}>
                          {bp.tiles.length} features deployed
                        </div>
                      </div>
                      {/* Stats */}
                      <div style={{padding:'12px 18px',display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:8}}>
                        {[
                          {em:'🌾',vl:bc.totalYieldLbs.toLocaleString()+' lbs',c:'#00e09a',label:'Yield'},
                          {em:'💧',vl:bc.totalWaterGal.toLocaleString()+' gal',c:'#00eeff',label:'Water'},
                          {em:'◆',vl:'$'+bc.year1Savings.toLocaleString(),    c:'#ffb020',label:'Savings'},
                        ].map(({em,vl,c,label})=>(
                          <div key={label} style={{textAlign:'center',padding:'8px 6px',borderRadius:10,
                            background:`${c}08`,border:`1px solid ${c}18`}}>
                            <div style={{fontSize:16,lineHeight:1.2,marginBottom:3}}>{em}</div>
                            <div style={{fontSize:11,fontWeight:700,color:c,fontFamily:"'Inter',sans-serif",lineHeight:1}}>{vl}</div>
                            <div style={{fontSize:9,color:`${c}60`,fontFamily:"'JetBrains Mono',monospace",marginTop:2,letterSpacing:'.06em'}}>{label}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
          </>)}
            </div>
          )}

          {/* ========== ROI ========================================= */}
          {activeTab==='roi'&&(
            <div className="a-fadeUp" style={{display:'flex',flexDirection:'column',gap:16}}>
              {!isPro&&(
                <div style={{
                  borderRadius:22,padding:'48px 32px',textAlign:'center',
                  background:'linear-gradient(160deg,rgba(255,176,32,0.05) 0%,rgba(8,12,8,0.95) 100%)',
                  border:'1px solid rgba(255,176,32,0.15)',
                }}>
                  <div style={{fontSize:36,marginBottom:16}}>📈</div>
                  <h2 style={{fontSize:22,fontWeight:700,color:'#ffb020',margin:'0 0 10px',fontFamily:"'Space Grotesk',sans-serif"}}>ROI & 20-Year Projections</h2>
                  <p style={{fontSize:14,color:'rgba(200,230,212,0.55)',margin:'0 0 28px',lineHeight:1.7,maxWidth:400,marginLeft:'auto',marginRight:'auto'}}>
                    See your full financial return over 20 years — including payback period, cumulative savings, and investment timeline. Upgrade to Pro to unlock.
                  </p>
                  <div style={{display:'flex',gap:10,justifyContent:'center',flexWrap:'wrap'}}>
                  <button onClick={()=>handleDirectUpgrade('annual')} style={{
                    position:'relative',
                    background:'linear-gradient(135deg,#ffb020,#f97316)',border:'none',borderRadius:12,
                    color:'#1a0a00',fontSize:14,fontWeight:800,padding:'13px 26px',cursor:'pointer',
                    letterSpacing:'.04em',fontFamily:"'Courier New',monospace",
                  }}>
                    Annual — $79/yr
                    <span style={{position:'absolute',top:-9,right:-8,background:'#ffb020',color:'#1a0a00',
                      fontSize:8,fontWeight:800,padding:'2px 7px',borderRadius:99,letterSpacing:'.04em',
                      textTransform:'uppercase'}}>Save 27%</span>
                  </button>
                  <button onClick={()=>handleDirectUpgrade('monthly')} style={{
                    background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.18)',borderRadius:12,
                    color:'#ffd9a0',fontSize:14,fontWeight:800,padding:'13px 26px',cursor:'pointer',
                    letterSpacing:'.04em',fontFamily:"'Courier New',monospace",
                  }}>Monthly — $9/mo</button>
                  </div>
                </div>
              )}
              {isPro&&(<>
              {/* Header */}
              <div style={{position:'relative',overflow:'hidden',borderRadius:22,padding:'24px 28px',
                background:'linear-gradient(135deg,rgba(255,176,32,0.08) 0%,rgba(20,12,0,0.90) 40%,rgba(8,6,0,0.88) 100%)',
                border:'1px solid rgba(255,176,32,0.20)',backdropFilter:'blur(18px)',
                boxShadow:'0 0 60px rgba(255,176,32,0.08),0 16px 48px rgba(0,0,0,0.30)'}}>
                <div style={{position:'absolute',top:0,left:0,right:0,height:1,
                  background:'linear-gradient(90deg,transparent,rgba(255,176,32,0.70) 40%,rgba(255,100,30,0.40) 70%,transparent)'}}/>
                <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:8}}>
                  <div style={{width:3,height:20,borderRadius:2,background:'linear-gradient(180deg,#ffb020,#f97316)',
                    boxShadow:'0 0 16px rgba(255,176,32,0.70)'}}/>
                  <span style={{fontSize:16,fontWeight:900,letterSpacing:'.08em',
                    background:'linear-gradient(90deg,#ffb020,#f97316)',
                    WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text',
                    fontFamily:"'Space Grotesk',sans-serif"}}>Return on Investment</span>
                </div>
                {hasData&&(
                  <div style={{display:'flex',gap:12,flexWrap:'wrap',marginTop:16}}>
                    {[
                      {l:'Est. Setup Cost',v:'$'+displayCalc.estimatedCostMin.toLocaleString(),c:'#ffb020'},
                      {l:'Year 1 Return',  v:'$'+displayCalc.year1Savings.toLocaleString(),c:'#00ffaa'},
                      {l:'Payback Period', v:displayCalc.paybackYears>0?displayCalc.paybackYears+' yrs':'N/A',c:'#a78bfa'},
                    ].map(({l,v,c})=>(
                      <div key={l} style={{padding:'12px 18px',borderRadius:12,
                        background:`${c}0c`,border:`1px solid ${c}25`}}>
                        <div style={{fontSize:18,fontWeight:900,color:c,fontFamily:"'Space Grotesk',sans-serif",
                          textShadow:`0 0 16px ${c}55`,marginBottom:4}}>{v}</div>
                        <div style={{fontSize:10,color:`${c}80`,fontFamily:"'Inter',sans-serif",fontWeight:600}}>{l}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {/* ROI chart */}
              <div style={{position:'relative',overflow:'hidden',borderRadius:20,padding:'20px 24px',
                background:'linear-gradient(135deg,rgba(16,10,0,0.90),rgba(8,6,0,0.88))',
                border:'1px solid rgba(255,176,32,0.10)',
                backdropFilter:'blur(24px)',
                boxShadow:'0 12px 40px rgba(0,0,0,0.28)'}}>
                <div style={{position:'absolute',top:0,left:0,right:0,height:1,
                  background:'linear-gradient(90deg,transparent,rgba(255,176,32,0.35) 50%,transparent)'}}/>
                {hasData?<ROICalculator calc={displayCalc}/>:(
                  <div style={{padding:'56px 24px',textAlign:'center'}}>
                    <div style={{fontSize:36,marginBottom:16}}>◐</div>
                    <p style={{color:'var(--tf)',fontSize:15,fontFamily:"'Inter',sans-serif",lineHeight:1.70}}>
                      Generate a blueprint to unlock your 20-year financial projection.
                    </p>
                  </div>
                )}
              </div>
            </>)}
            </div>
          )}

          {/* ========== DEPLOY ====================================== */}
          {/* ═══════════════════════ PROPERTY TAB ═══════════════════════ */}
          {activeTab==='property'&&(
            <div className="a-fadeUp" style={{display:'flex',flexDirection:'column',gap:20}}>

              {/* Pro gate */}
              {!isPro&&(
                <div style={{padding:'64px 32px',textAlign:'center',borderRadius:24,
                  background:'linear-gradient(135deg,rgba(255,176,32,0.05),rgba(4,14,8,0.90))',
                  border:'1px solid rgba(255,176,32,0.15)'}}>
                  <div style={{fontSize:42,marginBottom:16}}>🛰️</div>
                  <h2 style={{fontSize:22,fontWeight:700,color:'#ffb020',margin:'0 0 10px',
                    fontFamily:"'Space Grotesk',sans-serif"}}>Property Analysis</h2>
                  <p style={{fontSize:14,color:'rgba(200,230,212,0.55)',margin:'0 0 28px',
                    lineHeight:1.7,maxWidth:400,marginLeft:'auto',marginRight:'auto',
                    fontFamily:"'Inter',sans-serif"}}>
                    Enter your address and get a satellite view of your property with AI-powered analysis — lot size, orientation, existing trees, and more. Upgrade to Pro to unlock.
                  </p>
                  <div style={{display:'flex',gap:10,justifyContent:'center',flexWrap:'wrap'}}>
                  <button onClick={()=>handleDirectUpgrade('annual')} style={{
                    position:'relative',
                    background:'linear-gradient(135deg,#ffb020,#f97316)',border:'none',borderRadius:12,
                    color:'#1a0a00',fontSize:14,fontWeight:800,padding:'13px 26px',cursor:'pointer',
                    letterSpacing:'.04em',fontFamily:"'Courier New',monospace",
                  }}>
                    Annual — $79/yr
                    <span style={{position:'absolute',top:-9,right:-8,background:'#ffb020',color:'#1a0a00',
                      fontSize:8,fontWeight:800,padding:'2px 7px',borderRadius:99,letterSpacing:'.04em',
                      textTransform:'uppercase'}}>Save 27%</span>
                  </button>
                  <button onClick={()=>handleDirectUpgrade('monthly')} style={{
                    background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.18)',borderRadius:12,
                    color:'#ffd9a0',fontSize:14,fontWeight:800,padding:'13px 26px',cursor:'pointer',
                    letterSpacing:'.04em',fontFamily:"'Courier New',monospace",
                  }}>Monthly — $9/mo</button>
                  </div>
                </div>
              )}

              {isPro&&<>
              {/* Header */}
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:12}}>
                <div>
                  <h2 style={{fontSize:22,fontWeight:800,color:'var(--tp)',
                    fontFamily:"'Space Grotesk',sans-serif",margin:'0 0 4px',letterSpacing:'-.01em'}}>
                    Property Analysis
                  </h2>
                  <p style={{fontSize:13,color:'var(--ts)',fontFamily:"'Inter',sans-serif",margin:0,lineHeight:1.5}}>
                    Enter your address to get a satellite view and AI analysis of your property.
                  </p>
                </div>
                {propertyData&&(
                  <button type="button" onClick={printPropertyReport}
                    style={{display:'flex',alignItems:'center',gap:8,padding:'10px 20px',
                      borderRadius:12,cursor:'pointer',
                      background:'linear-gradient(135deg,rgba(0,255,170,0.12),rgba(0,255,170,0.06))',
                      border:'1px solid rgba(0,255,170,0.30)',color:'var(--tf)',
                      fontSize:13,fontWeight:700,fontFamily:"'Space Grotesk',sans-serif"}}>
                    <Download style={{width:14,height:14}}/> Print Report
                  </button>
                )}
              </div>

              {/* Address input card */}
              <div style={{borderRadius:20,padding:'28px 28px',
                background:'linear-gradient(135deg,rgba(0,255,170,0.05),rgba(4,14,8,0.90))',
                border:'1px solid rgba(0,255,170,0.14)'}}>
                <div style={{fontSize:11,letterSpacing:'.12em',color:'var(--tf)',
                  fontFamily:"'JetBrains Mono',monospace",textTransform:'uppercase',
                  fontWeight:700,marginBottom:14}}>📍 Property Address</div>
                <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
                  <input
                    type="text"
                    value={propertyAddress}
                    onChange={e=>setPropertyAddress(e.target.value)}
                    onKeyDown={e=>{if(e.key==='Enter'){e.preventDefault();analyseProperty();}}}
                    placeholder="e.g. 123 Main Street, Portland, OR 97201"
                    className="tf-in"
                    style={{flex:'1 1 300px',padding:'12px 16px',borderRadius:12,fontSize:14,
                      fontFamily:"'Inter',sans-serif",
                      background:'rgba(0,255,170,0.03)',border:'1px solid rgba(0,255,170,0.15)',
                      color:'var(--tp)'}}
                  />
                  <button type="button" onClick={analyseProperty}
                    disabled={propertyAnalysing||!propertyAddress.trim()}
                    style={{padding:'12px 28px',borderRadius:12,
                      cursor:propertyAnalysing||!propertyAddress.trim()?'default':'pointer',
                      background:propertyAnalysing?'rgba(0,255,170,0.05)':
                        !propertyAddress.trim()?'rgba(0,255,170,0.03)':
                        'linear-gradient(135deg,rgba(0,255,170,0.18),rgba(0,255,170,0.08))',
                      border:'1px solid rgba(0,255,170,0.25)',color:'var(--tf)',
                      fontSize:13,fontWeight:700,fontFamily:"'Space Grotesk',sans-serif",
                      opacity:!propertyAddress.trim()?0.5:1,
                      transition:'all 0.2s',whiteSpace:'nowrap'}}>
                    {propertyAnalysing?(
                      <span style={{display:'flex',alignItems:'center',gap:8}}>
                        <div className="a-pulse" style={{width:6,height:6,borderRadius:'50%',background:'#00ffaa'}}/>
                        Analysing…
                      </span>
                    ):'Analyse Property →'}
                  </button>
                </div>
                {propertyError&&(
                  <p style={{fontSize:12,color:'var(--red)',marginTop:10,
                    fontFamily:"'JetBrains Mono',monospace"}}>{propertyError}</p>
                )}
                <p style={{fontSize:11,color:'var(--ts)',marginTop:10,fontFamily:"'Inter',sans-serif",lineHeight:1.5}}>
                  Uses Google satellite imagery + Claude Vision AI to detect your property dimensions, orientation, existing trees, and features.
                </p>
              </div>

              {/* Results */}
              {propertyData&&(
                <div style={{display:'flex',flexDirection:'column',gap:16}}>

                  {/* Satellite image + quick stats row */}
                  <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 1fr',gap:16}}>

                    {/* Satellite image */}
                    <div style={{borderRadius:20,overflow:'hidden',
                      border:'1px solid rgba(0,255,170,0.14)',position:'relative'}}>
                      <img src={propertyData.satelliteUrl} alt="Satellite view of property"
                        style={{width:'100%',height:320,objectFit:'cover',display:'block'}}/>
                      <div style={{position:'absolute',bottom:0,left:0,right:0,
                        background:'linear-gradient(transparent,rgba(4,14,8,0.90))',
                        padding:'32px 16px 14px'}}>
                        <div style={{fontSize:12,fontWeight:700,color:'#e8f5ee',
                          fontFamily:"'Space Grotesk',sans-serif",marginBottom:2}}>
                          {propertyData.address}
                        </div>
                        <div style={{fontSize:10,color:'rgba(0,255,170,0.60)',
                          fontFamily:"'JetBrains Mono',monospace"}}>
                          {propertyData.lat.toFixed(4)}, {propertyData.lng.toFixed(4)} · Zoom 19 satellite
                        </div>
                      </div>
                      <div style={{position:'absolute',top:12,right:12,
                        background:'rgba(4,14,8,0.85)',borderRadius:8,padding:'4px 10px',
                        fontSize:10,color:'var(--tf)',fontFamily:"'JetBrains Mono',monospace",
                        border:'1px solid rgba(0,255,170,0.20)'}}>
                        {propertyData.analysis.confidence} confidence
                      </div>
                    </div>

                    {/* Key metrics */}
                    <div style={{display:'flex',flexDirection:'column',gap:12}}>
                      {[
                        {label:'Total Lot Size',value:`${propertyData.analysis.totalSqFt?.toLocaleString()} sq ft`,icon:'📐',color:'#00ffaa'},
                        {label:'Usable Garden Area',value:`${propertyData.analysis.usableGardenSqFt?.toLocaleString()} sq ft`,icon:'🌱',color:'#00ffaa'},
                        {label:'House Footprint',value:`${propertyData.analysis.houseFootprintPct}% of lot`,icon:'🏠',color:'#00d4ff'},
                        {label:'Garden Orientation',value:propertyData.analysis.orientation||'—',icon:'🧭',color:'#ffb830'},
                        {label:'Climate Zone',value:propertyData.analysis.climateHint||'—',icon:'🌡️',color:'#a78bfa'},
                        {label:'Mature Trees',value:String(propertyData.analysis.existingTreeCount||0),icon:'🌳',color:'#00ffaa'},
                      ].map(({label,value,icon,color})=>(
                        <div key={label} style={{display:'flex',alignItems:'center',gap:14,
                          padding:'14px 18px',borderRadius:14,
                          background:'rgba(255,255,255,0.025)',
                          border:'1px solid rgba(0,255,170,0.08)'}}>
                          <span style={{fontSize:20}}>{icon}</span>
                          <div style={{flex:1}}>
                            <div style={{fontSize:10,color:'var(--ts)',letterSpacing:'.06em',
                              fontFamily:"'JetBrains Mono',monospace",textTransform:'uppercase',marginBottom:2}}>{label}</div>
                            <div style={{fontSize:15,fontWeight:700,color,
                              fontFamily:"'Space Grotesk',sans-serif"}}>{value}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Feature tags + property details */}
                  <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 1fr',gap:16}}>

                    {/* Detected features */}
                    {propertyData.analysis.existingFeatures?.length>0&&(
                      <div style={{padding:'20px 22px',borderRadius:18,
                        background:'rgba(0,255,170,0.03)',border:'1px solid rgba(0,255,170,0.10)'}}>
                        <div style={{fontSize:11,letterSpacing:'.10em',color:'var(--tf)',
                          fontFamily:"'JetBrains Mono',monospace",textTransform:'uppercase',
                          fontWeight:700,marginBottom:14}}>Detected on property</div>
                        <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
                          {propertyData.analysis.existingFeatures.map((f:string)=>(
                            <span key={f} style={{padding:'5px 12px',borderRadius:99,
                              background:'rgba(0,255,170,0.08)',border:'1px solid rgba(0,255,170,0.18)',
                              color:'var(--tf)',fontSize:12,fontFamily:"'Inter',sans-serif"}}>
                              {f}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Property flags */}
                    <div style={{padding:'20px 22px',borderRadius:18,
                      background:'rgba(0,213,255,0.03)',border:'1px solid rgba(0,213,255,0.10)'}}>
                      <div style={{fontSize:11,letterSpacing:'.10em',color:'var(--cyan2)',
                        fontFamily:"'JetBrains Mono',monospace",textTransform:'uppercase',
                        fontWeight:700,marginBottom:14}}>Property features</div>
                      <div style={{display:'flex',flexDirection:'column',gap:8}}>
                        {[
                          {label:'Driveway',val:propertyData.analysis.hasDriveway},
                          {label:'Swimming pool',val:propertyData.analysis.hasPool},
                          {label:'Fencing',val:propertyData.analysis.hasFence},
                          {label:'Existing garden beds',val:(propertyData.analysis.gardenBeds||0)>0,
                           extra:propertyData.analysis.gardenBeds>0?`${propertyData.analysis.gardenBeds} detected`:''},
                        ].map(({label,val,extra})=>(
                          <div key={label} style={{display:'flex',alignItems:'center',
                            justifyContent:'space-between',padding:'8px 0',
                            borderBottom:'1px solid rgba(0,213,255,0.06)'}}>
                            <span style={{fontSize:13,color:'var(--td)',fontFamily:"'Inter',sans-serif"}}>{label}</span>
                            <span style={{fontSize:12,fontWeight:700,
                              color:val?'#00ffaa':'rgba(255,255,255,0.25)',
                              fontFamily:"'Space Grotesk',sans-serif"}}>
                              {extra||(val?'✓ Yes':'No')}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* CTA to generate blueprint */}
                  <div style={{padding:'24px 28px',borderRadius:18,
                    background:'linear-gradient(135deg,rgba(0,255,170,0.07),rgba(4,14,8,0.90))',
                    border:'1px solid rgba(0,255,170,0.18)',
                    display:'flex',alignItems:'center',justifyContent:'space-between',
                    flexWrap:'wrap',gap:16}}>
                    <div>
                      <div style={{fontSize:15,fontWeight:700,color:'var(--tp)',
                        fontFamily:"'Space Grotesk',sans-serif",marginBottom:4}}>
                        Ready to design your homestead?
                      </div>
                      <div style={{fontSize:12,color:'var(--ts)',fontFamily:"'Inter',sans-serif"}}>
                        Head to the Dashboard and use your address data to generate a blueprint tailored to your actual property.
                      </div>
                    </div>
                    <button type="button"
                      onClick={()=>{
                        // Pre-fill form with detected data
                        if(propertyData.analysis.totalSqFt)setValue('yardSqFt',propertyData.analysis.totalSqFt,{shouldValidate:true});
                        if(propertyData.analysis.climateHint)setValue('climateZone',propertyData.analysis.climateHint,{shouldValidate:true});
                        setActiveTab('dashboard');
                        setFormOpen(true);
                      }}
                      style={{padding:'12px 24px',borderRadius:12,cursor:'pointer',
                        background:'linear-gradient(135deg,#00ffaa,#00c45a)',
                        border:'none',color:'#051a0e',fontSize:13,fontWeight:800,
                        fontFamily:"'Space Grotesk',sans-serif",
                        boxShadow:'0 4px 20px rgba(0,255,170,0.25)',
                        whiteSpace:'nowrap'}}>
                      Generate Blueprint →
                    </button>
                  </div>

                  {/* ── Garden Visualiser ── */}
                  <div style={{padding:'24px 28px',borderRadius:18,
                    background:'linear-gradient(135deg,rgba(138,43,226,0.07),rgba(4,14,8,0.90))',
                    border:'1px solid rgba(138,43,226,0.20)'}}>
                    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',
                      flexWrap:'wrap',gap:12,marginBottom:visualSvg?20:0}}>
                      <div>
                        <div style={{fontSize:15,fontWeight:700,color:'var(--tp)',
                          fontFamily:"'Space Grotesk',sans-serif",marginBottom:4}}>
                          🎨 Garden Visualiser
                        </div>
                        <div style={{fontSize:12,color:'var(--ts)',fontFamily:"'Inter',sans-serif"}}>
                          Generate a beautiful artistic illustration of your homestead layout.
                        </div>
                      </div>
                      <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
                        {visualSvg&&(
                          <button type="button" onClick={downloadVisualisation}
                            style={{display:'flex',alignItems:'center',gap:6,padding:'10px 18px',
                              borderRadius:10,cursor:'pointer',
                              background:'rgba(138,43,226,0.12)',
                              border:'1px solid rgba(138,43,226,0.30)',
                              color:'rgba(200,150,255,0.90)',
                              fontSize:12,fontWeight:700,fontFamily:"'Space Grotesk',sans-serif"}}>
                            <Download style={{width:13,height:13}}/> Save SVG
                          </button>
                        )}
                        <button type="button" onClick={generateVisualisation}
                          disabled={visualising}
                          style={{display:'flex',alignItems:'center',gap:8,padding:'10px 22px',
                            borderRadius:10,cursor:visualising?'wait':'pointer',
                            background:visualising?'rgba(138,43,226,0.05)':
                              'linear-gradient(135deg,rgba(138,43,226,0.20),rgba(138,43,226,0.08))',
                            border:'1px solid rgba(138,43,226,0.35)',
                            color:'rgba(200,150,255,0.95)',
                            fontSize:12,fontWeight:700,fontFamily:"'Space Grotesk',sans-serif",
                            boxShadow:visualising?'none':'0 4px 16px rgba(138,43,226,0.15)'}}>
                          {visualising?(
                            <><div className="a-pulse" style={{width:6,height:6,borderRadius:'50%',
                              background:'rgba(200,150,255,0.90)'}}/> Creating art…</>
                          ):<>✦ {visualSvg?'Regenerate':'Generate Illustration'}</>}
                        </button>
                      </div>
                    </div>
                    {visualError&&<p style={{fontSize:12,color:'var(--red)',marginTop:8,
                      fontFamily:"'JetBrains Mono',monospace"}}>{visualError}</p>}
                    {visualSvg&&(
                      <div style={{borderRadius:14,overflow:'hidden',
                        border:'1px solid rgba(138,43,226,0.20)',
                        background:'rgba(255,255,255,0.02)'}}>
                        <img
                          src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(visualSvg||'')}`}
                          alt="Garden visualisation"
                          style={{width:'100%',display:'block'}}
                        />
                      </div>
                    )}
                  </div>

                </div>
              )}

              {/* Empty state */}
              {!propertyData&&!propertyAnalysing&&(
                <div style={{padding:'64px 32px',textAlign:'center',borderRadius:24,
                  background:'linear-gradient(135deg,rgba(0,255,170,0.03),rgba(4,14,8,0.90))',
                  border:'1px dashed rgba(0,255,170,0.12)'}}>
                  <div style={{fontSize:48,marginBottom:16}}>🛰️</div>
                  <div style={{fontSize:18,fontWeight:700,color:'var(--tp)',
                    fontFamily:"'Space Grotesk',sans-serif",marginBottom:8}}>
                    Enter your address above
                  </div>
                  <p style={{fontSize:14,color:'var(--ts)',fontFamily:"'Inter',sans-serif",
                    maxWidth:400,margin:'0 auto',lineHeight:1.6}}>
                    TerraForge will fetch a satellite image of your property and use AI to estimate your lot size, garden orientation, existing trees, and more.
                  </p>
                </div>
              )}

            {/* Property Canvas — inline, always visible, tiles persist via localStorage */}
            <PropertyCanvas
              isPro={isPro}
              onPaywall={()=>setPaywallFeature('Property Canvas')}
              address={propertyAddress}
            />

            </>}
            </div>
          )}

          {activeTab==='deploy'&&(
            <div className="a-fadeUp" style={{display:'flex',flexDirection:'column',gap:16}}>
              {!isPro&&(
                <div style={{
                  borderRadius:22,padding:'48px 32px',textAlign:'center',
                  background:'linear-gradient(160deg,rgba(167,139,250,0.05) 0%,rgba(8,12,8,0.95) 100%)',
                  border:'1px solid rgba(167,139,250,0.15)',
                }}>
                  <div style={{fontSize:36,marginBottom:16}}>🚀</div>
                  <h2 style={{fontSize:22,fontWeight:700,color:'#a78bfa',margin:'0 0 10px',fontFamily:"'Space Grotesk',sans-serif"}}>Deploy Plan</h2>
                  <p style={{fontSize:14,color:'rgba(200,230,212,0.55)',margin:'0 0 28px',lineHeight:1.7,maxWidth:400,marginLeft:'auto',marginRight:'auto'}}>
                    Get a personalised phase-by-phase implementation guide — what to build, when to build it, and estimated costs for each stage. Upgrade to Pro to unlock.
                  </p>
                  <div style={{display:'flex',gap:10,justifyContent:'center',flexWrap:'wrap'}}>
                  <button onClick={()=>handleDirectUpgrade('annual')} style={{
                    position:'relative',
                    background:'linear-gradient(135deg,#a78bfa,#7c3aed)',border:'none',borderRadius:12,
                    color:'#fff',fontSize:14,fontWeight:800,padding:'13px 26px',cursor:'pointer',
                    letterSpacing:'.04em',fontFamily:"'Courier New',monospace",
                  }}>
                    Annual — $79/yr
                    <span style={{position:'absolute',top:-9,right:-8,background:'#ffb020',color:'#1a0a00',
                      fontSize:8,fontWeight:800,padding:'2px 7px',borderRadius:99,letterSpacing:'.04em',
                      textTransform:'uppercase'}}>Save 27%</span>
                  </button>
                  <button onClick={()=>handleDirectUpgrade('monthly')} style={{
                    background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.18)',borderRadius:12,
                    color:'#d8c9ff',fontSize:14,fontWeight:800,padding:'13px 26px',cursor:'pointer',
                    letterSpacing:'.04em',fontFamily:"'Courier New',monospace",
                  }}>Monthly — $9/mo</button>
                  </div>
                </div>
              )}
              {isPro&&(<>
              {/* Header */}
              <div style={{position:'relative',overflow:'hidden',borderRadius:isMobile?14:22,padding:isMobile?'16px 16px':'28px 32px',
                background:'linear-gradient(135deg,rgba(167,139,250,0.08) 0%,rgba(10,4,20,0.92) 40%,rgba(4,10,8,0.90) 100%)',
                border:'1px solid rgba(167,139,250,0.20)',backdropFilter:'blur(18px)',
                boxShadow:'0 0 80px rgba(167,139,250,0.08),0 20px 60px rgba(0,0,0,0.32)'}}>
                <div style={{position:'absolute',top:0,left:0,right:0,height:1,
                  backgroundImage:'linear-gradient(90deg,transparent,rgba(167,139,250,0.70) 30%,rgba(0,255,170,0.40) 70%,transparent)',
                  backgroundSize:'200% 100%',animation:'borderFlow 8s linear infinite'}}/>
                {/* Decorative rings */}
                {[160,240].map((s,i)=>(
                  <div key={i} style={{position:'absolute',right:-s/3,top:-s/3,width:s,height:s,
                    borderRadius:'50%',border:`1px solid rgba(167,139,250,${0.08-i*0.03})`,
                    animation:`energyRing ${16+i*8}s linear infinite`,pointerEvents:'none'}}/>
                ))}
                <div style={{position:'relative',zIndex:1,display:'flex',alignItems:'flex-start',
                  justifyContent:'space-between',gap:isMobile?12:24,flexWrap:'wrap'}}>
                  <div>
                    <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:12}}>
                      <div style={{width:3,height:24,borderRadius:2,
                        background:'linear-gradient(180deg,#a78bfa,#00ffaa)',
                        boxShadow:'0 0 18px rgba(167,139,250,0.70)',flexShrink:0}}/>
                      <h2 style={{fontSize:isMobile?18:24,fontWeight:900,letterSpacing:'.04em',margin:0,
                        fontFamily:"'Space Grotesk',sans-serif",
                        background:'linear-gradient(90deg,#a78bfa,#00ffaa)',
                        WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>
                        Deployment Plan
                      </h2>
                    </div>
                    <p style={{fontSize:isMobile?12:15,color:'var(--tf)',lineHeight:1.65,
                      fontFamily:"'Inter',sans-serif",maxWidth:560,margin:0}}>
                      A phased execution guide engineered from your blueprint. Each phase builds on the last — follow the sequence for maximum system resilience.
                    </p>
                  </div>
                  {hasData&&(
                    <div style={{display:'flex',gap:isMobile?6:10,flexShrink:0,flexWrap:'wrap',
                      width:isMobile?'100%':'auto',justifyContent:isMobile?'space-between':'flex-start'}}>
                      {[
                        {l:'Regen Score',v:displayCalc.resilienceScore+'/98',c:'#00ffaa'},
                        {l:'Est. Budget', v:'$'+displayCalc.estimatedCostMin.toLocaleString(),c:'#ffb020'},
                        {l:'Payback',    v:displayCalc.paybackYears>0?displayCalc.paybackYears+' yrs':'N/A',c:'#a78bfa'},
                      ].map(({l,v,c})=>(
                        <div key={l} style={{padding:isMobile?'8px 10px':'12px 18px',borderRadius:12,textAlign:'center',
                          flex:isMobile?'1':'auto',
                          background:`${c}0c`,border:`1px solid ${c}28`,
                          boxShadow:`0 0 20px ${c}0a`}}>
                          <div style={{fontSize:isMobile?14:18,fontWeight:900,color:c,fontFamily:"'Space Grotesk',sans-serif",
                            lineHeight:1.2,marginBottom:3,textShadow:`0 0 16px ${c}55`}}>{v}</div>
                          <div style={{fontSize:isMobile?8:10,color:`${c}80`,fontFamily:"'JetBrains Mono',monospace",
                            letterSpacing:'.08em'}}>{l}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {hasData&&(
                  <button onClick={openShoppingList}
                    style={{display:'flex',alignItems:'center',justifyContent:'center',gap:10,
                      width:'100%',marginTop:16,padding:'14px 24px',borderRadius:14,cursor:'pointer',
                      background:'linear-gradient(135deg,rgba(167,139,250,0.18),rgba(167,139,250,0.08))',
                      border:'1px solid rgba(167,139,250,0.35)',color:'#c4b5fd',
                      fontSize:14,fontWeight:800,fontFamily:"'Space Grotesk',sans-serif",
                      boxShadow:'0 4px 20px rgba(167,139,250,0.12)'}}>
                    🛒 Generate Shopping List — Everything You Need to Buy
                  </button>
                )}
              </div>

              {!hasData&&(
                <div style={{padding:'64px 32px',textAlign:'center',borderRadius:20,
                  background:'linear-gradient(135deg,rgba(167,139,250,0.05),rgba(12,28,18,0.82))',
                  border:'1px solid rgba(167,139,250,0.12)',backdropFilter:'blur(20px)'}}>
                  <div style={{fontSize:40,marginBottom:16,color:'#a78bfa'}}>◆</div>
                  <p style={{fontSize:15,color:'var(--tf)',fontFamily:"'Inter',sans-serif",
                    maxWidth:400,margin:'0 auto',lineHeight:1.75}}>
                    Generate a blueprint to unlock your phased deployment plan.
                  </p>
                </div>
              )}
              {hasData&&<DeployPhases plan={deployPlan} score={displayCalc.resilienceScore}/>}
            </>)}
            </div>
          )}

          {/* ========== CALENDAR ==================================== */}
          {activeTab==='calendar'&&(
            <div className="a-fadeUp" style={{display:'flex',flexDirection:'column',gap:16}}>
              {!isPro&&(
                <div style={{
                  borderRadius:22,padding:'48px 32px',textAlign:'center',
                  background:'linear-gradient(160deg,rgba(0,238,255,0.04) 0%,rgba(8,12,8,0.95) 100%)',
                  border:'1px solid rgba(0,238,255,0.12)',
                }}>
                  <div style={{fontSize:36,marginBottom:16}}>📅</div>
                  <h2 style={{fontSize:22,fontWeight:700,color:'#00eeff',margin:'0 0 10px',fontFamily:"'Space Grotesk',sans-serif"}}>Seasonal Calendar</h2>
                  <p style={{fontSize:14,color:'rgba(200,230,212,0.55)',margin:'0 0 28px',lineHeight:1.7,maxWidth:400,marginLeft:'auto',marginRight:'auto'}}>
                    Access your personalised seasonal planting and maintenance calendar. Upgrade to Pro to unlock.
                  </p>
                  <div style={{display:'flex',gap:10,justifyContent:'center',flexWrap:'wrap'}}>
                  <button onClick={()=>handleDirectUpgrade('annual')} style={{
                    position:'relative',
                    background:'linear-gradient(135deg,#00eeff,#0099bb)',border:'none',borderRadius:12,
                    color:'#001a1f',fontSize:14,fontWeight:800,padding:'13px 26px',cursor:'pointer',
                    letterSpacing:'.04em',fontFamily:"'Courier New',monospace",
                  }}>
                    Annual — $79/yr
                    <span style={{position:'absolute',top:-9,right:-8,background:'#ffb020',color:'#1a0a00',
                      fontSize:8,fontWeight:800,padding:'2px 7px',borderRadius:99,letterSpacing:'.04em',
                      textTransform:'uppercase'}}>Save 27%</span>
                  </button>
                  <button onClick={()=>handleDirectUpgrade('monthly')} style={{
                    background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.18)',borderRadius:12,
                    color:'#a0f0ff',fontSize:14,fontWeight:800,padding:'13px 26px',cursor:'pointer',
                    letterSpacing:'.04em',fontFamily:"'Courier New',monospace",
                  }}>Monthly — $9/mo</button>
                  </div>
                </div>
              )}
              {isPro&&(<>
              {/* Header */}
              <div style={{position:'relative',overflow:'hidden',borderRadius:22,padding:'24px 28px',
                background:'linear-gradient(135deg,rgba(68,238,136,0.07) 0%,rgba(12,32,20,0.81) 40%,rgba(0,10,20,0.88) 100%)',
                border:'1px solid rgba(68,238,136,0.16)',backdropFilter:'blur(18px)',
                boxShadow:'0 0 60px rgba(68,238,136,0.06),0 16px 48px rgba(0,0,0,0.30)'}}>
                <div style={{position:'absolute',top:0,left:0,right:0,height:1,
                  background:'linear-gradient(90deg,transparent,rgba(68,238,136,0.65) 35%,rgba(34,211,238,0.40) 65%,transparent)'}}/>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:12}}>
                  <div>
                    <div style={{display:'flex',alignItems:'center',gap:9,marginBottom:8}}>
                      <div style={{width:3,height:18,borderRadius:2,background:'linear-gradient(180deg,#44ee88,#22d3ee)',
                        boxShadow:'0 0 16px rgba(68,238,136,0.70)'}}/>
                      <span style={{fontSize:15,fontWeight:900,letterSpacing:'.08em',
                        background:'linear-gradient(90deg,#44ee88,#22d3ee)',
                        WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text',
                        fontFamily:"'Space Grotesk',sans-serif"}}>Seasonal Planting Guide</span>
                    </div>
                    <p style={{fontSize:13,color:'var(--ts)',fontFamily:"'Inter',sans-serif",margin:0}}>
                      Monthly growing recommendations calibrated to your climate zone.
                    </p>
                  </div>
                  <div style={{display:'flex',alignItems:'center',gap:10}}>
                    <span style={{fontSize:10,fontWeight:700,color:'rgba(68,238,136,0.70)',
                      fontFamily:"'JetBrains Mono',monospace",letterSpacing:'.12em',
                      padding:'5px 14px',borderRadius:99,
                      background:'rgba(68,238,136,0.08)',border:'1px solid rgba(68,238,136,0.20)'}}>
                      ◎ {fv.climateZone?.toUpperCase()||'TEMPERATE'}
                    </span>
                    <button onClick={exportPDF} disabled={!hasData} style={{
                      display:'flex',alignItems:'center',gap:6,padding:'6px 14px',
                      borderRadius:10,border:'1px solid rgba(245,158,11,0.28)',
                      background:'rgba(245,158,11,0.08)',cursor:hasData?'pointer':'default',
                      fontFamily:"'JetBrains Mono',monospace",fontSize:10,fontWeight:700,
                      letterSpacing:'.08em',color:'var(--amber)',opacity:hasData?1:0.4,
                    }}>
                      <Download style={{width:12,height:12}}/> Export PDF
                    </button>
                    <button onClick={shareBlueprint} disabled={!hasData} style={{
                      display:'flex',alignItems:'center',gap:6,padding:'6px 14px',
                      borderRadius:10,border:'1px solid rgba(0,238,255,0.22)',
                      background:'rgba(0,238,255,0.07)',cursor:hasData?'pointer':'default',
                      fontFamily:"'JetBrains Mono',monospace",fontSize:10,fontWeight:700,
                      letterSpacing:'.08em',color:'var(--cyan)',opacity:hasData?1:0.4,
                    }}>
                      <Share2 style={{width:12,height:12}}/> Share
                    </button>
                  </div>
                </div>
              </div>
              {/* Calendar body */}
              <div style={{position:'relative',overflow:'hidden',borderRadius:20,padding:'20px 24px',
                background:'linear-gradient(135deg,rgba(0,12,8,0.88),rgba(0,10,18,0.85))',
                border:'1px solid rgba(68,238,136,0.09)',
                backdropFilter:'blur(24px)',
                boxShadow:'0 12px 40px rgba(0,0,0,0.28)'}}>
                <div style={{position:'absolute',top:0,left:0,right:0,height:1,
                  background:'linear-gradient(90deg,transparent,rgba(68,238,136,0.28) 50%,transparent)'}}/>
                <SeasonalCalendar zone={fv.climateZone||'Temperate'} userTiles={allTiles.map((t:any)=>t.icon)}/>
              </div>
            </>)}
            </div>
          )}

        </div>{/* end page body */}

        {/* ==== BUDGET WARNING MODAL ==== */}
        {pendingBudgetAdd&&mounted&&createPortal((()=>{
          const f=ICON_LOOKUP.get(pendingBudgetAdd);
          const addCost=f?Math.round((f.costMin+f.costMax)/2):0;
          const currentCost=allTiles.reduce((sum:number,t:{id:number;icon:string})=>{
            const f2=ICON_LOOKUP.get(t.icon);
            return sum+(f2?Math.round((f2.costMin+f2.costMax)/2):0);
          },0);
          const budget=Math.max(500,Number(fv.budget)||2800);
          const newTotal=currentCost+addCost;
          const over=newTotal-budget;
          return(
            <div style={{position:'fixed',inset:0,zIndex:99998,
              background:'rgba(4,12,8,0.82)',backdropFilter:'blur(12px)',
              display:'flex',alignItems:'center',justifyContent:'center',padding:16}}
              onClick={e=>{if(e.target===e.currentTarget)setPendingBudgetAdd(null);}}>
              <div style={{
                maxWidth:420,width:'100%',
                background:'linear-gradient(160deg,rgba(28,14,6,0.98),rgba(18,8,4,0.99))',
                border:'1.5px solid rgba(251,113,133,0.35)',
                borderRadius:22,padding:'32px 28px',
                boxShadow:'0 40px 100px rgba(0,0,0,0.70),0 0 40px rgba(251,113,133,0.06)',
                position:'relative',overflow:'hidden',
              }}>
                <div style={{position:'absolute',top:0,left:0,right:0,height:2,
                  background:'linear-gradient(90deg,transparent,rgba(251,113,133,0.80),transparent)'}}/>
                <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:20}}>
                  <div style={{width:40,height:40,borderRadius:12,flexShrink:0,
                    background:'rgba(251,113,133,0.12)',border:'1px solid rgba(251,113,133,0.30)',
                    display:'flex',alignItems:'center',justifyContent:'center',fontSize:20}}>⚠️</div>
                  <div>
                    <div style={{fontSize:9,fontWeight:700,letterSpacing:'.16em',
                      color:'rgba(251,113,133,0.65)',fontFamily:"'JetBrains Mono',monospace",
                      textTransform:'uppercase',marginBottom:3}}>Budget Alert</div>
                    <div style={{fontSize:17,fontWeight:800,color:'#ffe4e6',
                      fontFamily:"'Space Grotesk',sans-serif",letterSpacing:'-.01em'}}>
                      Over budget by ${over.toLocaleString()}
                    </div>
                  </div>
                </div>
                <p style={{fontSize:13,color:'rgba(255,220,224,0.72)',lineHeight:1.70,
                  fontFamily:"'Inter',sans-serif",margin:'0 0 20px'}}>
                  Adding <strong style={{color:'#ffe4e6'}}>{f?.name??pendingBudgetAdd}</strong> {f?`(~$${addCost.toLocaleString()})`:''}
                  {' '}will bring your estimated total to{' '}
                  <strong style={{color:newTotal>budget?'#f87171':'#86efac'}}>${newTotal.toLocaleString()}</strong>
                  {' '}against your{' '}
                  <strong style={{color:'rgba(255,220,224,0.90)'}}>${budget.toLocaleString()}</strong> budget.
                  {newTotal>budget&&<span style={{color:'#f87171',fontWeight:700}}> This exceeds your budget.</span>}
                </p>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:16}}>
                  {[
                    {label:'Current cost',value:'$'+currentCost.toLocaleString(),color:'rgba(255,220,224,0.55)'},
                    {label:'This addition',value:'+$'+addCost.toLocaleString(),color:'#f87171'},
                    {label:'New total',value:'$'+newTotal.toLocaleString(),color:'#f87171'},
                    {label:'Your budget',value:'$'+budget.toLocaleString(),color:'rgba(255,220,224,0.55)'},
                  ].map(({label,value,color})=>(
                    <div key={label} style={{padding:'8px 12px',borderRadius:10,
                      background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.07)'}}>
                      <div style={{fontSize:9,color:'rgba(255,200,210,0.40)',
                        fontFamily:"'JetBrains Mono',monospace",letterSpacing:'.08em',
                        textTransform:'uppercase',marginBottom:3}}>{label}</div>
                      <div style={{fontSize:14,fontWeight:700,color,
                        fontFamily:"'Space Grotesk',sans-serif"}}>{value}</div>
                    </div>
                  ))}
                </div>
                <div style={{display:'flex',gap:10}}>
                  <button onClick={()=>setPendingBudgetAdd(null)} style={{
                    flex:1,padding:'11px 16px',borderRadius:12,cursor:'pointer',
                    background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.12)',
                    color:'rgba(255,220,224,0.60)',fontSize:13,fontWeight:600,
                    fontFamily:"'Inter',sans-serif",
                  }}>Cancel</button>
                  <button onClick={()=>{
                    setBudgetWarned(true);
                    const pendingSlot=pendingDropSlotRef.current;
                    if(pendingSlot){
                      // Was a drag-drop — place at the specific slot
                      updateBpTiles(pendingSlot.bpId,(tiles:{id:number;icon:string}[])=>[...tiles.filter((t:{id:number;icon:string})=>t.id!==pendingSlot.id),{id:pendingSlot.id,icon:pendingSlot.em}]);
                      pendingDropSlotRef.current=null;
                    } else {
                      addFeatureToActiveMap(pendingBudgetAdd,true);
                    }
                    setPendingBudgetAdd(null);
                  }} style={{
                    flex:2,padding:'11px 16px',borderRadius:12,cursor:'pointer',
                    background:'linear-gradient(135deg,rgba(251,113,133,0.22),rgba(239,68,68,0.14))',
                    border:'1.5px solid rgba(251,113,133,0.45)',
                    color:'#ffe4e6',fontSize:13,fontWeight:700,
                    fontFamily:"'Space Grotesk',sans-serif",letterSpacing:'.02em',
                    boxShadow:'0 4px 20px rgba(251,113,133,0.15)',
                  }}>Add anyway →</button>
                </div>
                <p style={{marginTop:14,fontSize:10,color:'rgba(255,200,210,0.25)',
                  textAlign:'center',fontFamily:"'Inter',sans-serif"}}>
                  You will not be warned again for this blueprint
                </p>
              </div>
            </div>
          );
        })(),document.body)}

        {/* ==== SHARE TOAST ==== */}
        {shareToast&&mounted&&createPortal(
          <div style={{
            position:'fixed',bottom:80,left:'50%',transform:'translateX(-50%)',
            zIndex:9999,padding:'12px 22px',borderRadius:14,
            background:'linear-gradient(135deg,rgba(0,238,255,0.18),rgba(0,28,38,0.97))',
            border:'1px solid rgba(0,238,255,0.45)',
            boxShadow:'0 8px 32px rgba(0,0,0,0.55),0 0 24px rgba(0,238,255,0.18)',
            backdropFilter:'blur(20px)',
            display:'flex',alignItems:'center',gap:10,
            animation:'fadeUp 0.3s cubic-bezier(0.22,1,0.36,1) both',
            maxWidth:'90vw',
          }}>
            <Link style={{width:16,height:16,color:'#00eeff',flexShrink:0}}/>
            <span style={{fontSize:13,fontWeight:600,color:'#e0f8ff',
              fontFamily:"'Inter',sans-serif",whiteSpace:'nowrap',overflow:'hidden',
              textOverflow:'ellipsis',maxWidth:320}}>{shareToast}</span>
          </div>,document.body
        )}

        {/* ==== SHOPPING LIST MODAL ==== */}
        {showShoppingList&&mounted&&createPortal(
          <div style={{position:'fixed',inset:0,zIndex:99900,
            background:'rgba(2,8,4,0.92)',backdropFilter:'blur(16px)',
            display:'flex',alignItems:'center',justifyContent:'center',padding:16,overflowY:'auto'}}
            onClick={e=>{if(e.target===e.currentTarget)setShowShoppingList(false);}}>
            <div className="a-scaleIn" style={{maxWidth:560,width:'100%',maxHeight:'90vh',overflowY:'auto',
              background:'linear-gradient(160deg,rgba(18,12,30,0.99),rgba(8,14,22,0.99))',
              border:'1.5px solid rgba(167,139,250,0.25)',borderRadius:22,padding:'32px 28px',
              boxShadow:'0 40px 100px rgba(0,0,0,0.70)',position:'relative'}}>
              <button onClick={()=>setShowShoppingList(false)}
                style={{position:'absolute',top:16,right:16,width:32,height:32,borderRadius:8,
                  border:'1px solid rgba(167,139,250,0.25)',background:'rgba(167,139,250,0.08)',
                  color:'#a78bfa',cursor:'pointer',fontSize:16,display:'flex',alignItems:'center',justifyContent:'center'}}>×</button>

              <div style={{marginBottom:24}}>
                <div style={{fontSize:11,letterSpacing:'.14em',color:'#a78bfa',
                  fontFamily:"'JetBrains Mono',monospace",textTransform:'uppercase',marginBottom:8}}>🛒 Shopping List</div>
                <h2 style={{fontSize:22,fontWeight:800,color:'var(--tp)',margin:'0 0 4px',
                  fontFamily:"'Space Grotesk',sans-serif"}}>Everything You Need</h2>
                <p style={{fontSize:13,color:'var(--ts)',fontFamily:"'Inter',sans-serif",margin:0}}>
                  {shoppingListData.itemCount} features across {shoppingListData.groups.length} categories.
                </p>
              </div>

              {shoppingListData.groups.map(g=>(
                <div key={g.category} style={{marginBottom:20}}>
                  <div style={{fontSize:12,fontWeight:700,color:'#c4b5fd',marginBottom:8,
                    fontFamily:"'Space Grotesk',sans-serif",borderBottom:'1px solid rgba(167,139,250,0.15)',paddingBottom:6}}>
                    {g.label}
                  </div>
                  {g.items.map(it=>(
                    <div key={it.emoji} style={{display:'flex',alignItems:'center',justifyContent:'space-between',
                      padding:'7px 0',fontFamily:"'Inter',sans-serif"}}>
                      <span style={{fontSize:13,color:'var(--td)'}}>
                        <span style={{marginRight:8}}>{it.emoji}</span>{it.name}
                        {it.qty>1&&<span style={{marginLeft:6,fontSize:11,color:'#a78bfa',fontWeight:700}}>×{it.qty}</span>}
                      </span>
                      <span style={{fontSize:12,fontWeight:700,color:'var(--tp)',whiteSpace:'nowrap'}}>
                        ${it.costMin.toLocaleString()}–${it.costMax.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              ))}

              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',
                padding:'16px 18px',borderRadius:14,marginTop:8,marginBottom:20,
                background:'rgba(167,139,250,0.08)',border:'1px solid rgba(167,139,250,0.20)'}}>
                <span style={{fontSize:13,fontWeight:700,color:'#c4b5fd',fontFamily:"'Space Grotesk',sans-serif"}}>Estimated Total</span>
                <span style={{fontSize:18,fontWeight:800,color:'#a78bfa',fontFamily:"'Space Grotesk',sans-serif"}}>
                  ${shoppingListData.totalMin.toLocaleString()} – ${shoppingListData.totalMax.toLocaleString()}
                </span>
              </div>

              <button onClick={printShoppingList}
                style={{width:'100%',padding:'13px',borderRadius:12,cursor:'pointer',
                  background:'linear-gradient(135deg,#a78bfa,#7c3aed)',border:'none',color:'#fff',
                  fontSize:13,fontWeight:800,fontFamily:"'Space Grotesk',sans-serif",
                  boxShadow:'0 4px 20px rgba(167,139,250,0.25)'}}>
                Print / Save as PDF →
              </button>
              <p style={{textAlign:'center',fontSize:11,color:'var(--ts)',marginTop:12,
                fontFamily:"'Inter',sans-serif",lineHeight:1.5}}>
                Estimates for materials and starting stock. Prices vary by region and supplier.
              </p>
            </div>
          </div>,
          document.body
        )}

        {/* ==== HOW TO MODAL ==== */}
        {showHowTo&&mounted&&createPortal(
          <div style={{position:'fixed',inset:0,zIndex:99900,
            background:'rgba(2,8,4,0.92)',backdropFilter:'blur(16px)',
            display:'flex',alignItems:'center',justifyContent:'center',padding:16,
            overflowY:'auto'}}
            onClick={e=>{if(e.target===e.currentTarget)setShowHowTo(false);}}>
            <div style={{
              maxWidth:680,width:'100%',maxHeight:'90vh',overflowY:'auto',
              background:'linear-gradient(160deg,rgba(8,28,16,0.99),rgba(6,18,30,0.99))',
              border:'1.5px solid rgba(0,255,170,0.20)',
              borderRadius:24,padding:'36px 32px',
              boxShadow:'0 40px 100px rgba(0,0,0,0.70)',
              position:'relative',
            }}>
              {/* Close */}
              <button onClick={()=>setShowHowTo(false)}
                style={{position:'absolute',top:16,right:16,width:32,height:32,
                  borderRadius:8,border:'1px solid rgba(0,255,170,0.20)',
                  background:'rgba(0,255,170,0.06)',color:'var(--tf)',
                  cursor:'pointer',fontSize:16,display:'flex',alignItems:'center',justifyContent:'center'}}>
                ×
              </button>

              {/* Header */}
              <div style={{marginBottom:28}}>
                <div style={{fontSize:11,letterSpacing:'.16em',color:'var(--tf)',
                  fontFamily:"'JetBrains Mono',monospace",textTransform:'uppercase',marginBottom:8}}>
                  🌱 TerraForge
                </div>
                <h2 style={{fontSize:26,fontWeight:800,color:'var(--tp)',margin:'0 0 8px',
                  fontFamily:"'Space Grotesk',sans-serif",letterSpacing:'-.02em'}}>
                  How To Use TerraForge
                </h2>
                <p style={{fontSize:13,color:'var(--ts)',fontFamily:"'Inter',sans-serif",margin:0,lineHeight:1.6}}>
                  Your complete guide to designing a self-sufficient homestead.
                </p>
              </div>

              {/* Sections */}
              {[
                {icon:'⚡',title:'1. Generate a Blueprint',color:'#00ffaa',steps:[
                  'Set your property size (sq ft), family size, budget, and climate zone in the Configure panel.',
                  'Choose Base (instant, free) or AI (powered by Claude, Pro only).',
                  'For AI: describe what you want — "Add 3 raised beds with tomatoes and a solar panel" — the more detail the better.',
                  'Hit Generate. Your blueprint appears in seconds with a full dashboard of metrics.',
                ]},
                {icon:'🗺️',title:'2. Customise Your Maps',color:'#00d4ff',steps:[
                  'Go to the Maps tab to see your Property Map (full yard) and Raised Bed maps (individual beds).',
                  'Drag any icon from the icon library on the right onto your map.',
                  'Drag tiles around to rearrange them. Click any tile to see care tips and companion plants.',
                  'Add to Existing toggle lets you add features without replacing your current layout.',
                ]},
                {icon:'📊',title:'3. Read Your Dashboard',color:'#00ffaa',steps:[
                  'Regen Score (out of 98) measures how resilient and diverse your homestead is.',
                  'Key Metrics shows Annual Yield, Water Saved, Year 1 Savings, and CO₂ Offset.',
                  'Drag the dashboard widgets to reorder them — your layout is saved automatically.',
                  'Click any widget for a detailed breakdown of how the score is calculated.',
                ]},
                {icon:'📍',title:'4. Property Analysis (Pro)',color:'#a78bfa',steps:[
                  'Go to the Property tab and enter your home address.',
                  'TerraForge fetches a satellite image and uses AI to detect your lot size, orientation, existing trees, and more.',
                  'Your square footage and climate zone auto-fill from the analysis.',
                  'Use Garden Visualiser to generate a beautiful artistic illustration of your planned layout.',
                ]},
                {icon:'📈',title:'5. ROI & 20-Year Projections (Pro)',color:'#ffb830',steps:[
                  'The ROI tab shows your estimated financial return over 20 years.',
                  'See your payback period, cumulative savings, and which features give the best return.',
                  'Based on real averages for food costs, energy savings, and water savings in your region.',
                ]},
                {icon:'📅',title:'6. Seasonal Calendar (Pro)',color:'#4ade80',steps:[
                  'The Calendar tab shows exactly what to plant and harvest each month for your climate zone.',
                  'Switch between Seasonal view (activities per season) and Monthly view (crop-by-crop timeline).',
                  'Only shows crops you have placed on your maps.',
                ]},
                {icon:'🚀',title:'7. Deploy Plan (Pro)',color:'#f97316',steps:[
                  'The Deploy tab gives you a phased implementation plan — what to build first, second, third.',
                  'Each phase has a cost estimate, timeline, and step-by-step instructions.',
                  'Designed so you can start small and expand over time without wasting money.',
                ]},
                {icon:'💾',title:'8. Save & Share',color:'#00ffaa',steps:[
                  'Log in to save your blueprints to the cloud. Free accounts get 1 save. Pro gets unlimited.',
                  'The Blueprints tab shows all your saved layouts — load any previous design.',
                  'Use the Share button to generate a link anyone can view.',
                  'Export PDF to get a printable report of your entire blueprint and metrics.',
                ]},
              ].map(({icon,title,color,steps})=>(
                <div key={title} style={{marginBottom:24,paddingBottom:24,
                  borderBottom:'1px solid rgba(0,255,170,0.07)'}}>
                  <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:12}}>
                    <span style={{fontSize:18}}>{icon}</span>
                    <h3 style={{fontSize:15,fontWeight:700,color,margin:0,
                      fontFamily:"'Space Grotesk',sans-serif"}}>{title}</h3>
                  </div>
                  <div style={{display:'flex',flexDirection:'column',gap:7,paddingLeft:28}}>
                    {steps.map((step,i)=>(
                      <div key={i} style={{display:'flex',gap:10,alignItems:'flex-start'}}>
                        <span style={{fontSize:10,fontWeight:800,color,opacity:0.6,
                          fontFamily:"'JetBrains Mono',monospace",flexShrink:0,marginTop:2}}>
                          {String(i+1).padStart(2,'0')}
                        </span>
                        <p style={{fontSize:13,color:'rgba(200,230,212,0.70)',margin:0,
                          fontFamily:"'Inter',sans-serif",lineHeight:1.6}}>{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Footer */}
              <div style={{textAlign:'center',paddingTop:8}}>
                <button onClick={()=>setShowHowTo(false)}
                  style={{padding:'12px 32px',borderRadius:12,cursor:'pointer',
                    background:'linear-gradient(135deg,#00ffaa,#00c45a)',
                    border:'none',color:'#051a0e',fontSize:13,fontWeight:800,
                    fontFamily:"'Space Grotesk',sans-serif",
                    boxShadow:'0 4px 20px rgba(0,255,170,0.25)'}}>
                  Let's Build →
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

        {/* ==== ONBOARDING OVERLAY ==== */}
        {showOnboarding&&mounted&&createPortal(
          <OnboardingOverlay onDone={()=>{
            try{localStorage.setItem('tf-onboarded','1');}catch{}
            setShowOnboarding(false);
          }}/>,document.body
        )}

        {/* ==== FOOTER DISCLAIMER ==== */}
        <footer style={{
          position:'relative',zIndex:1,
          borderTop:'1px solid rgba(0,255,170,0.14)',
          background:'rgba(10,24,16,0.79)',
          backdropFilter:'blur(24px) saturate(1.5) brightness(1.05)',
          padding:'28px 32px 24px',
        }}>
          <div style={{maxWidth:1560,margin:'0 auto'}}>

            {/* Top row -- logo + version */}
            <div style={{
              display:'flex',alignItems:'center',justifyContent:'space-between',
              marginBottom:18,paddingBottom:16,
              borderBottom:'1px solid rgba(0,255,170,0.10)',
              flexWrap:'wrap',gap:10,
            }}>
              <div style={{display:'flex',alignItems:'center',gap:8}}>
                <Sprout style={{width:14,height:14,color:'rgba(0,255,170,0.75)'}}/>
                <span style={{fontSize:12,fontWeight:700,letterSpacing:'.12em',
                  color:'rgba(0,255,170,0.75)',fontFamily:"'Space Grotesk',sans-serif"}}>
                  TERRAFORGE
                </span>
                <span style={{fontSize:10,color:'rgba(0,255,170,0.40)',
                  fontFamily:"'JetBrains Mono',monospace",marginLeft:4}}>
                  Verdant OS v8.0
                </span>
              </div>
              <span style={{fontSize:10,color:'rgba(150,215,180,0.60)',
                fontFamily:"'JetBrains Mono',monospace",letterSpacing:'.06em'}}>
                For planning purposes only -- not professional advice
              </span>
            </div>

            {/* Disclaimer blocks */}
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))',gap:16,marginBottom:20}}>
              {[
                {
                  icon:'📐',
                  title:'Yield Estimates',
                  body:'Conservative averages for established plants. Actual yields vary by soil, climate, and experience. New plantings yield 30--50% less in years 1--2.',
                },
                {
                  icon:'💧',
                  title:'Water Calculations',
                  body:'Modelled on US national average (~30 in/yr rainfall). Arid, subtropical, and cold climates will differ significantly. Water savings figures reflect supply costs only (~$0.005/gal); sewer/wastewater fees vary by municipality and are not included. Verify local rainfall and utility rates before sizing water systems.',
                },
                {
                  icon:'💰',
                  title:'Financial Projections',
                  body:'Conservative US estimates: $0.80/lb produce (farm-gate equivalent), $0.005/gal water supply, $0.023/lb CO₂ (~$50/tonne, voluntary carbon market rate), 3% annual compounding (approximate US CPI). Energy offsets: $200/yr per solar or wind installation, $120/yr battery, $60/yr pump. Actual returns depend on local utility rates, climate, and market prices.',
                },
                {
                  icon:'🌿',
                  title:'Climate & Placement',
                  body:'The app does not penalise wrong-climate placements. Verify all features suit your USDA hardiness zone and local frost dates before investing. Tropical and subtropical yields, timing, and water needs differ from temperate defaults.',
                },
                {
                  icon:'⚡',
                  title:'Energy Estimates',
                  body:'Based on US national averages (NREL, EPA eGRID 2023). Actual solar output varies by tilt, azimuth, shading, and local irradiance. Wind output varies sharply with site exposure. Obtain licensed installer quotes before purchasing any system.',
                },
                {
                  icon:'📋',
                  title:'Not Professional Advice',
                  body:'TerraForge is a planning and educational tool only. Yield, water, and financial figures are illustrative estimates. Consult qualified agronomists, engineers, electricians, and local authorities before major earthworks, energy installs, livestock operations, or water system changes.',
                },
              ].map(({icon,title,body})=>(
                <div key={title} style={{display:'flex',gap:11,alignItems:'flex-start'}}>
                  <span style={{fontSize:15,flexShrink:0,marginTop:1,opacity:0.80}}>{icon}</span>
                  <div>
                    <p style={{
                      fontSize:11,fontWeight:700,color:'rgba(195,240,215,0.80)',
                      fontFamily:"'Space Grotesk',sans-serif",letterSpacing:'.04em',
                      marginBottom:4,
                    }}>{title}</p>
                    <p style={{
                      fontSize:11,color:'rgba(150,215,180,0.65)',
                      fontFamily:"'Inter',sans-serif",lineHeight:1.60,margin:0,
                    }}>{body}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom legal line */}
            <div style={{
              paddingTop:14,
              borderTop:'1px solid rgba(0,255,170,0.08)',
              display:'flex',alignItems:'center',justifyContent:'space-between',
              flexWrap:'wrap',gap:8,
            }}>
              <p style={{
                fontSize:10,color:'rgba(150,215,180,0.50)',
                fontFamily:"'Inter',sans-serif",margin:0,lineHeight:1.6,
                maxWidth:680,
              }}>
                Data sourced from USDA ARS extension guidelines, NREL PVWatts, EPA eGRID 2023, AWWA water rate surveys, and university permaculture extension services.
                Yield, water, and financial figures are conservative planning estimates, not guarantees.
                TerraForge makes no warranty of accuracy for any specific property, climate zone, or situation.
              </p>
              <p style={{
                fontSize:10,color:'rgba(110,185,145,0.40)',
                fontFamily:"'JetBrains Mono',monospace",margin:0,whiteSpace:'nowrap',
              }}>
                {new Date().getFullYear()} TerraForge -- All rights reserved
              </p>
            </div>

          </div>
        </footer>

        {/* ==== MODALS ==== */}
        {modal&&modalInfo&&(
          <FeaturePanel
            mf={{...(ICON_LOOKUP.get(modalInfo.resolved??modal.emoji)??ICON_LOOKUP.get(modal.emoji)??{emoji:modalInfo.resolved??modal.emoji,name:'',category:'food',yieldLbs:0,waterGal:0,co2:0,costMin:0,costMax:0}),emoji:modalInfo.resolved??modal.emoji,tileId:modal.tileId}}
            info={modalInfo}
            onClose={()=>setModal(null)}
            onRemove={()=>{
              updateBpTiles(modal.bpId,tiles=>tiles.filter((t:{id:number;icon:string})=>t.id!==modal.tileId));
              setModal(null);
            }}
          />
        )}

        {showLogin&&(
          <LoginModal
            onClose={()=>setShowLogin(false)}
            onLoad={d=>{loadFromSave(d);setShowLogin(false);}}
            currentData={{apiBlueprint,blueprints,formValues:fv,propIdx,gardIdx}}
            isPro={isPro}
          />
        )}

        {paywallFeature&&(
          <Paywall
            feature={paywallFeature}
            initialPlan={upgradePlan}
            onClose={()=>setPaywallFeature(null)}
            isLoggedIn={isLoggedIn}
            accessToken={supaSession?.access_token}
            onLogin={()=>{setPaywallFeature(null);setShowLogin(true);}}
          />
        )}


      </div>
    </div>
  );
}