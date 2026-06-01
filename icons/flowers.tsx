'use client';
import React from 'react';
import W from '../utils/iconWrapper';
import type { IconMap } from '../utils/types';

export const flowerIcons: IconMap = {

  // Borage — 5-pointed vivid blue star flower, white centre, yellow anthers
  '💙': (s) => <W size={s}>
    <path d="M24,44 Q23,35 24,25" stroke="#558B2F" strokeWidth={2.2} fill="none" strokeLinecap="round"/>
    <path d="M21,35 Q17,33 15,29" stroke="#66BB6A" strokeWidth={1.8} fill="none"/>
    <ellipse cx={14} cy={28} rx={4.5} ry={2.5} fill="#66BB6A" transform="rotate(-20 14 28)"/>
    <path d="M24,14 Q20,7 16,9 Q17,15 24,14Z" fill="#1565C0"/>
    <path d="M24,14 Q18,14 16,20 Q21,22 24,14Z" fill="#1565C0"/>
    <path d="M24,14 Q20,21 24,26 Q28,21 24,14Z" fill="#1565C0"/>
    <path d="M24,14 Q30,22 36,20 Q34,14 24,14Z" fill="#1565C0"/>
    <path d="M24,14 Q32,15 32,9 Q28,7 24,14Z" fill="#1565C0"/>
    <circle cx={24} cy={14} r={5.5} fill="white"/>
    <line x1={24} y1={10} x2={24} y2={14} stroke="#FDD835" strokeWidth={1.5}/>
    <circle cx={24} cy={10} r={1.4} fill="#F9A825"/>
    <line x1={21} y1={12} x2={24} y2={14} stroke="#FDD835" strokeWidth={1.5}/>
    <circle cx={21} cy={12} r={1.4} fill="#F9A825"/>
    <line x1={21} y1={16} x2={24} y2={14} stroke="#FDD835" strokeWidth={1.5}/>
    <circle cx={21} cy={16} r={1.4} fill="#F9A825"/>
    <line x1={27} y1={12} x2={24} y2={14} stroke="#FDD835" strokeWidth={1.5}/>
    <circle cx={27} cy={12} r={1.4} fill="#F9A825"/>
    <line x1={27} y1={16} x2={24} y2={14} stroke="#FDD835" strokeWidth={1.5}/>
    <circle cx={27} cy={16} r={1.4} fill="#F9A825"/>
    <circle cx={24} cy={14} r={2.2} fill="#1565C0"/>
  </W>,

  // Calendula — bright orange daisy, 16 rays, dark centre
  '🌻': (s) => <W size={s}>
    <path d="M24,44 Q24,35 24,30" stroke="#558B2F" strokeWidth={2.2} strokeLinecap="round" fill="none"/>
    <path d="M24,37 Q19,35 17,31" stroke="#66BB6A" strokeWidth={1.8} fill="none"/>
    <ellipse cx={24} cy={16} rx={14} ry={7.5} fill="#FF8F00" transform="rotate(0)"/>
    <ellipse cx={24} cy={16} rx={14} ry={7.5} fill="#FF8F00" transform="rotate(22.5 24 16)"/>
    <ellipse cx={24} cy={16} rx={14} ry={7.5} fill="#FF8F00" transform="rotate(45 24 16)"/>
    <ellipse cx={24} cy={16} rx={14} ry={7.5} fill="#FF8F00" transform="rotate(67.5 24 16)"/>
    <ellipse cx={24} cy={16} rx={14} ry={7.5} fill="#FFA000" transform="rotate(90 24 16)"/>
    <ellipse cx={24} cy={16} rx={14} ry={7.5} fill="#FFA000" transform="rotate(112.5 24 16)"/>
    <ellipse cx={24} cy={16} rx={14} ry={7.5} fill="#FFA000" transform="rotate(135 24 16)"/>
    <ellipse cx={24} cy={16} rx={14} ry={7.5} fill="#FFA000" transform="rotate(157.5 24 16)"/>
    <circle cx={24} cy={16} r={7} fill="#BF360C"/>
    <circle cx={24} cy={16} r={5} fill="#D84315"/>
    <circle cx={21.5} cy={14} r={0.9} fill="#FF6D00"/>
    <circle cx={24} cy={13} r={0.9} fill="#FF6D00"/>
    <circle cx={26.5} cy={14} r={0.9} fill="#FF6D00"/>
    <circle cx={21.5} cy={18} r={0.9} fill="#FF6D00"/>
    <circle cx={24} cy={19} r={0.9} fill="#FF6D00"/>
    <circle cx={26.5} cy={18} r={0.9} fill="#FF6D00"/>
  </W>,

  // Chamomile — 14 white rays, golden dome, tall stem with side leaf
  '🌸': (s) => <W size={s}>
    <path d="M24,44 Q23,35 24,27" stroke="#558B2F" strokeWidth={2.2} strokeLinecap="round" fill="none"/>
    <path d="M24,36 Q19,34 17,30" stroke="#66BB6A" strokeWidth={1.8} fill="none"/>
    <ellipse cx={16} cy={28} rx={4} ry={2.5} fill="#66BB6A" transform="rotate(-20 16 28)"/>
    <ellipse cx={24} cy={15} rx={12} ry={5} fill="white" transform="rotate(0)"/>
    <ellipse cx={24} cy={15} rx={12} ry={5} fill="white" transform="rotate(25.7 24 15)"/>
    <ellipse cx={24} cy={15} rx={12} ry={5} fill="white" transform="rotate(51.4 24 15)"/>
    <ellipse cx={24} cy={15} rx={12} ry={5} fill="white" transform="rotate(77.1 24 15)"/>
    <ellipse cx={24} cy={15} rx={12} ry={5} fill="white" transform="rotate(102.8 24 15)"/>
    <ellipse cx={24} cy={15} rx={12} ry={5} fill="white" transform="rotate(128.5 24 15)"/>
    <ellipse cx={24} cy={15} rx={12} ry={5} fill="white" transform="rotate(154.2 24 15)"/>
    <circle cx={24} cy={15} r={7} fill="#FDD835"/>
    <circle cx={24} cy={15} r={5.5} fill="#FFEB3B"/>
    <circle cx={20.5} cy={13} r={0.9} fill="#F9A825"/>
    <circle cx={24} cy={12} r={0.9} fill="#F9A825"/>
    <circle cx={27.5} cy={13} r={0.9} fill="#F9A825"/>
    <circle cx={20.5} cy={17} r={0.9} fill="#F9A825"/>
    <circle cx={24} cy={18} r={0.9} fill="#F9A825"/>
    <circle cx={27.5} cy={17} r={0.9} fill="#F9A825"/>
    <circle cx={24} cy={15} r={1.8} fill="#F57F17"/>
  </W>,

  // Cosmos — delicate 8-petal pale pink flower
  '✿': (s) => <W size={s}>
    <path d="M24,44 Q23,35 24,27" stroke="#558B2F" strokeWidth={2.2} strokeLinecap="round" fill="none"/>
    <ellipse cx={24} cy={15} rx={11} ry={5.5} fill="#F8BBD0" transform="rotate(0)"/>
    <ellipse cx={24} cy={15} rx={11} ry={5.5} fill="#F8BBD0" transform="rotate(45 24 15)"/>
    <ellipse cx={24} cy={15} rx={11} ry={5.5} fill="#F8BBD0" transform="rotate(90 24 15)"/>
    <ellipse cx={24} cy={15} rx={11} ry={5.5} fill="#F8BBD0" transform="rotate(135 24 15)"/>
    <ellipse cx={24} cy={15} rx={8} ry={3.5} fill="#FCE4EC" transform="rotate(22.5 24 15)"/>
    <ellipse cx={24} cy={15} rx={8} ry={3.5} fill="#FCE4EC" transform="rotate(67.5 24 15)"/>
    <ellipse cx={24} cy={15} rx={8} ry={3.5} fill="#FCE4EC" transform="rotate(112.5 24 15)"/>
    <ellipse cx={24} cy={15} rx={8} ry={3.5} fill="#FCE4EC" transform="rotate(157.5 24 15)"/>
    <circle cx={24} cy={15} r={5} fill="#FDD835"/>
    <circle cx={24} cy={15} r={3} fill="#FF8F00"/>
    <circle cx={22} cy={14} r={0.7} fill="#FF6F00" opacity={0.7}/>
    <circle cx={24} cy={13} r={0.7} fill="#FF6F00" opacity={0.7}/>
    <circle cx={26} cy={14} r={0.7} fill="#FF6F00" opacity={0.7}/>
  </W>,

  // Dahlias — dense overlapping petals, rich purple-violet
  '🏵️': (s) => <W size={s}>
    <path d="M24,44 Q24,35 24,29" stroke="#558B2F" strokeWidth={2.2} strokeLinecap="round" fill="none"/>
    <ellipse cx={24} cy={18} rx={14} ry={5} fill="#BA68C8" transform="rotate(0)"/>
    <ellipse cx={24} cy={18} rx={14} ry={5} fill="#BA68C8" transform="rotate(25.7 24 18)"/>
    <ellipse cx={24} cy={18} rx={14} ry={5} fill="#AB47BC" transform="rotate(51.4 24 18)"/>
    <ellipse cx={24} cy={18} rx={14} ry={5} fill="#AB47BC" transform="rotate(77.1 24 18)"/>
    <ellipse cx={24} cy={18} rx={14} ry={5} fill="#9C27B0" transform="rotate(102.8 24 18)"/>
    <ellipse cx={24} cy={18} rx={14} ry={5} fill="#9C27B0" transform="rotate(128.5 24 18)"/>
    <ellipse cx={24} cy={18} rx={14} ry={5} fill="#BA68C8" transform="rotate(154.2 24 18)"/>
    <ellipse cx={24} cy={18} rx={9.5} ry={4} fill="#9C27B0" transform="rotate(18 24 18)"/>
    <ellipse cx={24} cy={18} rx={9.5} ry={4} fill="#9C27B0" transform="rotate(54 24 18)"/>
    <ellipse cx={24} cy={18} rx={9.5} ry={4} fill="#8E24AA" transform="rotate(90 24 18)"/>
    <ellipse cx={24} cy={18} rx={9.5} ry={4} fill="#8E24AA" transform="rotate(126 24 18)"/>
    <ellipse cx={24} cy={18} rx={9.5} ry={4} fill="#9C27B0" transform="rotate(162 24 18)"/>
    <ellipse cx={24} cy={18} rx={6} ry={3.5} fill="#7B1FA2" transform="rotate(30 24 18)"/>
    <ellipse cx={24} cy={18} rx={6} ry={3.5} fill="#7B1FA2" transform="rotate(90 24 18)"/>
    <ellipse cx={24} cy={18} rx={6} ry={3.5} fill="#7B1FA2" transform="rotate(150 24 18)"/>
    <circle cx={24} cy={18} r={4.5} fill="#FFF9C4"/>
    <circle cx={24} cy={18} r={2.8} fill="#FFE082"/>
  </W>,

  // Echinacea — spiny orange cone, drooping pink ray petals
  '🌟': (s) => <W size={s}>
    <path d="M24,44 Q23,35 24,28" stroke="#558B2F" strokeWidth={2.2} strokeLinecap="round" fill="none"/>
    <ellipse cx={24} cy={18} rx={13} ry={5} fill="#E91E63" transform="rotate(0)" opacity={0.87}/>
    <ellipse cx={24} cy={18} rx={13} ry={5} fill="#E91E63" transform="rotate(27.7 24 18)" opacity={0.87}/>
    <ellipse cx={24} cy={18} rx={13} ry={5} fill="#E91E63" transform="rotate(55.4 24 18)" opacity={0.87}/>
    <ellipse cx={24} cy={18} rx={13} ry={5} fill="#E91E63" transform="rotate(83.1 24 18)" opacity={0.87}/>
    <ellipse cx={24} cy={18} rx={13} ry={5} fill="#E91E63" transform="rotate(110.8 24 18)" opacity={0.87}/>
    <ellipse cx={24} cy={18} rx={13} ry={5} fill="#F06292" transform="rotate(138.5 24 18)" opacity={0.87}/>
    <ellipse cx={24} cy={18} rx={13} ry={5} fill="#F06292" transform="rotate(166.2 24 18)" opacity={0.87}/>
    <ellipse cx={24} cy={18} rx={8} ry={9} fill="#FF8F00"/>
    <ellipse cx={24} cy={18} rx={6} ry={7} fill="#FF6F00"/>
    <path d="M21,14 L24,11 L27,14" stroke="#BF360C" strokeWidth={1.5} strokeLinecap="round" fill="none"/>
    <path d="M21,18 L18,15" stroke="#BF360C" strokeWidth={1.5} strokeLinecap="round" fill="none"/>
    <path d="M27,18 L30,15" stroke="#BF360C" strokeWidth={1.5} strokeLinecap="round" fill="none"/>
    <path d="M21,22 L21,25" stroke="#BF360C" strokeWidth={1.5} strokeLinecap="round" fill="none"/>
    <path d="M27,22 L27,25" stroke="#BF360C" strokeWidth={1.5} strokeLinecap="round" fill="none"/>
    <circle cx={24} cy={18} r={2.5} fill="#E65100"/>
  </W>,

  // Foxglove — tall spike of 6 tubular purple bells alternating sides
  '🔔': (s) => <W size={s}>
    <line x1={24} y1={46} x2={24} y2={3} stroke="#558B2F" strokeWidth={2.2}/>
    <path d="M24,43 Q15,39 13,44 Q16,48 24,43Z" fill="#4CAF50"/>
    <path d="M24,43 Q33,39 35,44 Q32,48 24,43Z" fill="#388E3C"/>
    <path d="M24,38 Q15,36 13,42 Q12,44 16,44 Q19,44 24,38Z" fill="#AB47BC"/>
    <path d="M13,42 Q14,39 16,39 Q16,40 13,42Z" fill="#9C27B0" opacity={0.5}/>
    <circle cx={16} cy={40} r={1} fill="white" opacity={0.5}/>
    <circle cx={16} cy={42} r={1} fill="white" opacity={0.5}/>
    <path d="M24,31 Q33,29 35,35 Q34,37 30,37 Q27,37 24,31Z" fill="#9C27B0"/>
    <circle cx={32} cy={33} r={1} fill="white" opacity={0.5}/>
    <circle cx={32} cy={35} r={1} fill="white" opacity={0.5}/>
    <path d="M24,24 Q15,22 13,28 Q12,30 16,30 Q19,30 24,24Z" fill="#8E24AA"/>
    <circle cx={16} cy={26} r={1} fill="white" opacity={0.5}/>
    <circle cx={16} cy={28} r={1} fill="white" opacity={0.5}/>
    <path d="M24,17 Q33,15 35,21 Q34,23 30,23 Q27,23 24,17Z" fill="#7B1FA2"/>
    <circle cx={32} cy={19} r={1} fill="white" opacity={0.5}/>
    <circle cx={32} cy={21} r={1} fill="white" opacity={0.5}/>
    <path d="M24,11 Q15,9 13,15 Q12,17 16,17 Q19,17 24,11Z" fill="#6A1B9A"/>
    <path d="M24,6 Q33,4 35,10 Q34,12 30,12 Q27,12 24,6Z" fill="#5E35B1"/>
    <path d="M24,43 Q21,39 18,35 Q18,32 21,31" stroke="#66BB6A" strokeWidth={2} fill="none"/>
  </W>,

  // Lavender — three tall spikes, paired purple florets with grey-green calyxes
  '💜': (s) => <W size={s}>
    <line x1={11} y1={46} x2={9} y2={10} stroke="#8BC34A" strokeWidth={2}/>
    <ellipse cx={8} cy={38} rx={3.5} ry={2.2} fill="#7B1FA2" transform="rotate(-25 8 38)"/>
    <ellipse cx={12} cy={38} rx={3.5} ry={2.2} fill="#9C27B0" transform="rotate(25 12 38)"/>
    <ellipse cx={7} cy={35} rx={3} ry={2} fill="#8E24AA" transform="rotate(-25 7 35)"/>
    <ellipse cx={11} cy={35} rx={3} ry={2} fill="#9C27B0" transform="rotate(25 11 35)"/>
    <ellipse cx={7} cy={32} rx={3} ry={2} fill="#7B1FA2" transform="rotate(-25 7 32)"/>
    <ellipse cx={11} cy={32} rx={3} ry={2} fill="#8E24AA" transform="rotate(25 11 32)"/>
    <ellipse cx={7} cy={29} rx={2.8} ry={1.8} fill="#6A1B9A" transform="rotate(-25 7 29)"/>
    <ellipse cx={11} cy={29} rx={2.8} ry={1.8} fill="#7B1FA2" transform="rotate(25 11 29)"/>
    <ellipse cx={8} cy={26} rx={2.5} ry={1.6} fill="#6A1B9A" transform="rotate(-22 8 26)"/>
    <ellipse cx={11} cy={26} rx={2.5} ry={1.6} fill="#7B1FA2" transform="rotate(22 11 26)"/>
    <ellipse cx={8} cy={38} rx={1.3} ry={1.1} fill="#7CB342"/>
    <ellipse cx={11} cy={35} rx={1.3} ry={1} fill="#7CB342"/>
    <ellipse cx={8} cy={32} rx={1.3} ry={1} fill="#7CB342"/>
    <line x1={24} y1={46} x2={24} y2={8} stroke="#8BC34A" strokeWidth={2}/>
    <ellipse cx={21} cy={38} rx={3.5} ry={2.2} fill="#AB47BC" transform="rotate(-25 21 38)"/>
    <ellipse cx={27} cy={38} rx={3.5} ry={2.2} fill="#BA68C8" transform="rotate(25 27 38)"/>
    <ellipse cx={21} cy={35} rx={3.2} ry={2} fill="#9C27B0" transform="rotate(-25 21 35)"/>
    <ellipse cx={27} cy={35} rx={3.2} ry={2} fill="#AB47BC" transform="rotate(25 27 35)"/>
    <ellipse cx={21} cy={32} rx={3} ry={1.8} fill="#8E24AA" transform="rotate(-25 21 32)"/>
    <ellipse cx={27} cy={32} rx={3} ry={1.8} fill="#9C27B0" transform="rotate(25 27 32)"/>
    <ellipse cx={21} cy={29} rx={2.8} ry={1.6} fill="#7B1FA2" transform="rotate(-25 21 29)"/>
    <ellipse cx={27} cy={29} rx={2.8} ry={1.6} fill="#8E24AA" transform="rotate(25 27 29)"/>
    <ellipse cx={21} cy={26} rx={2.5} ry={1.5} fill="#6A1B9A" transform="rotate(-22 21 26)"/>
    <ellipse cx={27} cy={26} rx={2.5} ry={1.5} fill="#7B1FA2" transform="rotate(22 27 26)"/>
    <ellipse cx={21} cy={22} rx={2} ry={1.3} fill="#6A1B9A" transform="rotate(-20 21 22)"/>
    <ellipse cx={27} cy={22} rx={2} ry={1.3} fill="#7B1FA2" transform="rotate(20 27 22)"/>
    <ellipse cx={21} cy={18} rx={1.8} ry={1.2} fill="#5E35B1" transform="rotate(-18 21 18)"/>
    <ellipse cx={27} cy={18} rx={1.8} ry={1.2} fill="#6A1B9A" transform="rotate(18 27 18)"/>
    <ellipse cx={21} cy={14} rx={1.5} ry={1} fill="#5E35B1" transform="rotate(-15 21 14)"/>
    <ellipse cx={27} cy={14} rx={1.5} ry={1} fill="#6A1B9A" transform="rotate(15 27 14)"/>
    <line x1={37} y1={46} x2={39} y2={12} stroke="#8BC34A" strokeWidth={2}/>
    <ellipse cx={36} cy={38} rx={3.5} ry={2.2} fill="#7B1FA2" transform="rotate(-20 36 38)"/>
    <ellipse cx={40} cy={38} rx={3.5} ry={2.2} fill="#9C27B0" transform="rotate(30 40 38)"/>
    <ellipse cx={36} cy={35} rx={3} ry={2} fill="#7B1FA2" transform="rotate(-25 36 35)"/>
    <ellipse cx={40} cy={35} rx={3} ry={2} fill="#8E24AA" transform="rotate(25 40 35)"/>
    <ellipse cx={36} cy={32} rx={2.8} ry={1.8} fill="#6A1B9A" transform="rotate(-22 36 32)"/>
    <ellipse cx={40} cy={32} rx={2.8} ry={1.8} fill="#7B1FA2" transform="rotate(22 40 32)"/>
    <ellipse cx={36} cy={29} rx={2.5} ry={1.5} fill="#6A1B9A" transform="rotate(-20 36 29)"/>
    <ellipse cx={40} cy={29} rx={2.5} ry={1.5} fill="#7B1FA2" transform="rotate(20 40 29)"/>
    <path d="M5,46 Q7,42 11,44 Q9,48 5,46Z" fill="#8BC34A"/>
    <path d="M43,46 Q41,42 37,44 Q39,48 43,46Z" fill="#8BC34A"/>
  </W>,

  // Lupins — three tall spikes with pea-flowers (standard + wings + keel)
  '🫧': (s) => <W size={s}>
    <line x1={11} y1={46} x2={9} y2={10} stroke="#558B2F" strokeWidth={2}/>
    <ellipse cx={9} cy={40} rx={4.5} ry={3} fill="#AB47BC"/><ellipse cx={11.5} cy={40} rx={3} ry={2.2} fill="#7B1FA2" transform="rotate(20 11.5 40)"/>
    <ellipse cx={9} cy={35} rx={4.2} ry={2.8} fill="#9C27B0"/><ellipse cx={11.5} cy={35} rx={2.8} ry={2} fill="#6A1B9A" transform="rotate(20 11.5 35)"/>
    <ellipse cx={9} cy={30} rx={4} ry={2.6} fill="#8E24AA"/><ellipse cx={11.5} cy={30} rx={2.5} ry={1.8} fill="#6A1B9A" transform="rotate(20 11.5 30)"/>
    <ellipse cx={9} cy={25} rx={3.8} ry={2.4} fill="#7B1FA2"/><ellipse cx={11.5} cy={25} rx={2.2} ry={1.6} fill="#5E35B1" transform="rotate(20 11.5 25)"/>
    <ellipse cx={9} cy={20} rx={3.5} ry={2.2} fill="#6A1B9A"/>
    <ellipse cx={9} cy={15} rx={3} ry={2} fill="#5E35B1"/>
    <line x1={24} y1={46} x2={24} y2={4} stroke="#558B2F" strokeWidth={2}/>
    <ellipse cx={24} cy={40} rx={4.5} ry={3} fill="#CE93D8"/><ellipse cx={27} cy={40} rx={3.2} ry={2.2} fill="#9C27B0" transform="rotate(20 27 40)"/><ellipse cx={21} cy={40} rx={3.2} ry={2.2} fill="#9C27B0" transform="rotate(-20 21 40)"/>
    <ellipse cx={24} cy={35} rx={4.2} ry={2.8} fill="#BA68C8"/><ellipse cx={27} cy={35} rx={3} ry={2} fill="#8E24AA" transform="rotate(20 27 35)"/><ellipse cx={21} cy={35} rx={3} ry={2} fill="#8E24AA" transform="rotate(-20 21 35)"/>
    <ellipse cx={24} cy={30} rx={4} ry={2.6} fill="#AB47BC"/><ellipse cx={27} cy={30} rx={2.8} ry={1.8} fill="#7B1FA2" transform="rotate(20 27 30)"/><ellipse cx={21} cy={30} rx={2.8} ry={1.8} fill="#7B1FA2" transform="rotate(-20 21 30)"/>
    <ellipse cx={24} cy={25} rx={3.8} ry={2.4} fill="#9C27B0"/><ellipse cx={27} cy={25} rx={2.5} ry={1.6} fill="#6A1B9A" transform="rotate(20 27 25)"/><ellipse cx={21} cy={25} rx={2.5} ry={1.6} fill="#6A1B9A" transform="rotate(-20 21 25)"/>
    <ellipse cx={24} cy={20} rx={3.5} ry={2.2} fill="#8E24AA"/>
    <ellipse cx={24} cy={15} rx={3.2} ry={2} fill="#7B1FA2"/>
    <ellipse cx={24} cy={10} rx={3} ry={1.8} fill="#6A1B9A"/>
    <line x1={37} y1={46} x2={39} y2={10} stroke="#558B2F" strokeWidth={2}/>
    <ellipse cx={39} cy={40} rx={4.5} ry={3} fill="#AB47BC"/><ellipse cx={36.5} cy={40} rx={3} ry={2.2} fill="#7B1FA2" transform="rotate(-20 36.5 40)"/>
    <ellipse cx={39} cy={35} rx={4.2} ry={2.8} fill="#9C27B0"/><ellipse cx={36.5} cy={35} rx={2.8} ry={2} fill="#6A1B9A" transform="rotate(-20 36.5 35)"/>
    <ellipse cx={39} cy={30} rx={4} ry={2.6} fill="#8E24AA"/><ellipse cx={36.5} cy={30} rx={2.5} ry={1.8} fill="#6A1B9A" transform="rotate(-20 36.5 30)"/>
    <ellipse cx={39} cy={25} rx={3.8} ry={2.4} fill="#7B1FA2"/>
    <ellipse cx={39} cy={20} rx={3.5} ry={2.2} fill="#6A1B9A"/>
    <ellipse cx={39} cy={15} rx={3} ry={2} fill="#5E35B1"/>
    <ellipse cx={18} cy={46} rx={3} ry={2} fill="#7CB342"/>
    <ellipse cx={24} cy={46} rx={3} ry={2} fill="#558B2F"/>
    <ellipse cx={30} cy={46} rx={3} ry={2} fill="#7CB342"/>
  </W>,

  // Marigolds — dense concentric orange petal rings
  '🟠': (s) => <W size={s}>
    <path d="M24,44 Q24,36 24,31" stroke="#558B2F" strokeWidth={2.2} strokeLinecap="round" fill="none"/>
    <path d="M24,38 Q18,36 16,32" stroke="#66BB6A" strokeWidth={1.8} fill="none"/>
    <ellipse cx={24} cy={18} rx={14} ry={5.5} fill="#E65100" transform="rotate(0)"/>
    <ellipse cx={24} cy={18} rx={14} ry={5.5} fill="#EF6C00" transform="rotate(25.7 24 18)"/>
    <ellipse cx={24} cy={18} rx={14} ry={5.5} fill="#E65100" transform="rotate(51.4 24 18)"/>
    <ellipse cx={24} cy={18} rx={14} ry={5.5} fill="#EF6C00" transform="rotate(77.1 24 18)"/>
    <ellipse cx={24} cy={18} rx={14} ry={5.5} fill="#E65100" transform="rotate(102.8 24 18)"/>
    <ellipse cx={24} cy={18} rx={14} ry={5.5} fill="#EF6C00" transform="rotate(128.5 24 18)"/>
    <ellipse cx={24} cy={18} rx={14} ry={5.5} fill="#E65100" transform="rotate(154.2 24 18)"/>
    <ellipse cx={24} cy={18} rx={9} ry={4.5} fill="#FF8F00" transform="rotate(18 24 18)"/>
    <ellipse cx={24} cy={18} rx={9} ry={4.5} fill="#FFA000" transform="rotate(54 24 18)"/>
    <ellipse cx={24} cy={18} rx={9} ry={4.5} fill="#FF8F00" transform="rotate(90 24 18)"/>
    <ellipse cx={24} cy={18} rx={9} ry={4.5} fill="#FFA000" transform="rotate(126 24 18)"/>
    <ellipse cx={24} cy={18} rx={9} ry={4.5} fill="#FF8F00" transform="rotate(162 24 18)"/>
    <ellipse cx={24} cy={18} rx={5.5} ry={3.5} fill="#FFB300" transform="rotate(30 24 18)"/>
    <ellipse cx={24} cy={18} rx={5.5} ry={3.5} fill="#FFC107" transform="rotate(90 24 18)"/>
    <ellipse cx={24} cy={18} rx={5.5} ry={3.5} fill="#FFB300" transform="rotate(150 24 18)"/>
    <circle cx={24} cy={18} r={4.5} fill="#BF360C"/>
    <circle cx={24} cy={18} r={2.8} fill="#D84315"/>
  </W>,

  // Nasturtium — round orange flowers with round lily-pad leaves
  '🧡': (s) => <W size={s}>
    <circle cx={11} cy={37} r={10} fill="#43A047"/>
    <line x1={11} y1={27} x2={11} y2={47} stroke="#388E3C" strokeWidth={0.8} opacity={0.5}/>
    <line x1={1} y1={37} x2={21} y2={37} stroke="#388E3C" strokeWidth={0.8} opacity={0.5}/>
    <line x1={4} y1={30} x2={18} y2={44} stroke="#388E3C" strokeWidth={0.8} opacity={0.45}/>
    <line x1={4} y1={44} x2={18} y2={30} stroke="#388E3C" strokeWidth={0.8} opacity={0.45}/>
    <line x1={11} y1={27} x2={24} y2={18} stroke="#558B2F" strokeWidth={1.5}/>
    <ellipse cx={32} cy={16} rx={10} ry={9.5} fill="#FF5722" transform="rotate(0)"/>
    <ellipse cx={32} cy={16} rx={10} ry={9.5} fill="#FF6D40" transform="rotate(72 32 16)"/>
    <ellipse cx={32} cy={16} rx={10} ry={9.5} fill="#FF5722" transform="rotate(144 32 16)"/>
    <ellipse cx={32} cy={16} rx={10} ry={9.5} fill="#FF6D40" transform="rotate(216 32 16)"/>
    <ellipse cx={32} cy={16} rx={10} ry={9.5} fill="#FF5722" transform="rotate(288 32 16)"/>
    <path d="M29,12 L35,12" stroke="#FFB300" strokeWidth={1.2} fill="none" opacity={0.6}/>
    <path d="M26,16 L38,16" stroke="#FFB300" strokeWidth={1.2} fill="none" opacity={0.6}/>
    <path d="M29,20 L35,20" stroke="#FFB300" strokeWidth={1.2} fill="none" opacity={0.6}/>
    <circle cx={32} cy={16} r={5} fill="#FFF176"/>
    <circle cx={32} cy={16} r={3} fill="#FFD54F"/>
  </W>,

  // Peonies — very full multi-layer ruffled pink flower
  '🪻': (s) => <W size={s}>
    <path d="M24,44 Q24,36 24,30" stroke="#558B2F" strokeWidth={2.2} strokeLinecap="round" fill="none"/>
    <ellipse cx={24} cy={19} rx={16} ry={7} fill="#E91E63" transform="rotate(0)" opacity={0.85}/>
    <ellipse cx={24} cy={19} rx={16} ry={7} fill="#EC407A" transform="rotate(36 24 19)" opacity={0.88}/>
    <ellipse cx={24} cy={19} rx={16} ry={7} fill="#E91E63" transform="rotate(72 24 19)" opacity={0.85}/>
    <ellipse cx={24} cy={19} rx={16} ry={7} fill="#EC407A" transform="rotate(108 24 19)" opacity={0.88}/>
    <ellipse cx={24} cy={19} rx={16} ry={7} fill="#E91E63" transform="rotate(144 24 19)" opacity={0.85}/>
    <ellipse cx={24} cy={19} rx={10} ry={6} fill="#F06292" transform="rotate(18 24 19)"/>
    <ellipse cx={24} cy={19} rx={10} ry={6} fill="#F06292" transform="rotate(54 24 19)"/>
    <ellipse cx={24} cy={19} rx={10} ry={6} fill="#EF6694" transform="rotate(90 24 19)"/>
    <ellipse cx={24} cy={19} rx={10} ry={6} fill="#F06292" transform="rotate(126 24 19)"/>
    <ellipse cx={24} cy={19} rx={10} ry={6} fill="#F06292" transform="rotate(162 24 19)"/>
    <ellipse cx={24} cy={19} rx={7} ry={5} fill="#F48FB1" transform="rotate(0)"/>
    <ellipse cx={24} cy={19} rx={7} ry={5} fill="#F48FB1" transform="rotate(45 24 19)"/>
    <ellipse cx={24} cy={19} rx={7} ry={5} fill="#F06292" transform="rotate(90 24 19)"/>
    <ellipse cx={24} cy={19} rx={7} ry={5} fill="#F48FB1" transform="rotate(135 24 19)"/>
    <ellipse cx={24} cy={19} rx={4.5} ry={4} fill="#FCE4EC" transform="rotate(22.5 24 19)"/>
    <ellipse cx={24} cy={19} rx={4.5} ry={4} fill="#FCE4EC" transform="rotate(67.5 24 19)"/>
    <ellipse cx={24} cy={19} rx={4.5} ry={4} fill="#FCE4EC" transform="rotate(112.5 24 19)"/>
    <ellipse cx={24} cy={19} rx={4.5} ry={4} fill="#FCE4EC" transform="rotate(157.5 24 19)"/>
    <circle cx={24} cy={19} r={5} fill="#FFF9C4"/>
    <circle cx={22} cy={17} r={0.8} fill="#FF8F00"/>
    <circle cx={24} cy={16} r={0.8} fill="#FF8F00"/>
    <circle cx={26} cy={17} r={0.8} fill="#FF8F00"/>
    <circle cx={22} cy={21} r={0.8} fill="#FF8F00"/>
    <circle cx={24} cy={22} r={0.8} fill="#FF8F00"/>
    <circle cx={26} cy={21} r={0.8} fill="#FF8F00"/>
  </W>,

  // Roses — classic red rose in full bloom
'🌹': (s) => (
    <svg width={s} height={s} viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M56.81 85.29l21.86.17s-1.74 5.65-3.18 7.87c-2.35 3.6-3.52 5.44-4.52 9.13c-1.55 5.68-1.42 10.05-1.42 10.05s1.21-.42 2.68 0c1.79.51 2.76 1.7 2.6 2.43c-.15.65-2.14.21-3.52 1.59c-1.09 1.09-1.51 3.02-1.68 4.27c-.17 1.26-.34 2.85-2.68 3.18c-2.35.34-5.86.59-6.62-.59c-.75-1.17-.34-21.61-.34-21.61l-3.18-16.49z" fill="#307d31"></path><path d="M56.56 80.76c-.42.75-10.32 2.53-10.32 2.53s-3.31 1.77-4.56 7.55c-.68 3.13-.53 9.47-1.12 11.69c-.84 3.18-4.36 5.03-4.19 5.78c.17.75 3.24.7 5.61-.34c5.36-2.35 6.3-7.21 8.04-11.39c1.68-4.02 4.86-6.13 4.86-6.13s-.75 2.92-.43 6.14c.27 2.77 1.14 6.3 0 9.73c-1.09 3.27-2.62 5.24-2.01 5.54c.46.22 5.92-.33 8.1-5.11c2.41-5.28 2.58-9.61 4.02-12.71c1.59-3.43 4.62-4.89 4.62-4.89s2.15 1.26 4.78 4.94c2.93 4.1 5.38 7.55 6.96 9.67c3.7 4.98 8.83 6.55 8.99 5.71c.25-1.34-2.47-3.49-3.02-6.11c-1.35-6.45.5-9.54-1.03-14.49c-2.2-7.15-7.39-7.28-9.19-7.62c-.42-.06-20.11-.49-20.11-.49z" fill="#5c9823"></path><path d="M47.31 44.34c-1.13-1.01-17.87-13.21-17.87-13.21l-.25-7.42s-4.1-7.75.62-13.52c4.1-5.01 9.57-3.59 9.57-3.59s2.74-3.45 7.52-3.69c6.11-.31 9.09 4.83 9.09 4.83l27.55 4.53l15.47 10.06s2.29-.74 4.19.6c1.98 1.39 1.33 4.31 1.11 5.62c-.21 1.25-20.65 17.56-20.65 17.56l2.14 31.96l-7.14 7.97s-1 .98-3.05 1.24c-1.19.15-2.72-.33-2.72-.33l-4.45-12.78l-21.13-29.83z" fill="#96010c"></path><path d="M83.15 6.86l-3.72.28l-2.61 2.19l.93 4.21s.12 3.15-2.36 4.66c-2.48 1.51-7.35 3.99-7.35 3.99l-3.36 5.56s-2.16-.71-5.68-2.52c-3.29-1.7-7.5-5.58-7.5-5.58l-7.53-.51s-1.44-.13-2.65 1.15c-1.74 1.86-1.12 5.8 2.29 9.41c3.28 3.47 10.38 7.7 11.96 8.87c1.58 1.17 3.99 2.67 5.36 3.44c1.32.74 2.9 1.8 3.59 1.67c.69-.14 1.71-2.49 4.94-4.76c3.23-2.27 6.39-4.19 11.55-5.98c5.16-1.79 10.11-3.85 11.62-4.81c1.51-.96-.55-7.49-2.41-11.48s-6.94-10.2-7.07-9.79z" fill="#af0c1b"></path><path d="M65.07 23.98c-1.27 1.68-1.03 3.64-1.03 3.64s2.77 1.66 5.5 2.61c4.95 1.72 16.09 1.24 21.45-1.17s7.98-4.49 8.8-7.01c.96-2.96 1.76-8.94-4-13.55c-6.6-5.29-16.56-2.4-16.56-1.02s3.99.28 3.99 5.29s-4.4 8.04-8.87 8.66c-4.47.62-7.36 0-9.28 2.55z" fill="#db132c"></path><path d="M42.24 19.65s-.51-2.02 1.17-3.64c2.54-2.48 5.78-3.78 7.63-5.78s4.48-5.79 10.93-6.67c9.56-1.31 15.74 2.27 17.12 6.67s-1.24 5.91-3.92 5.98c-2.68.07-4.17-1.19-9.08-.34c-8.32 1.44-11.21 5.91-11.96 6.33c-.76.41-3.23-1.03-6.6-1.93c-2.43-.65-4.19-.49-5.29-.62z" fill="#f71538"></path><path d="M69.62 48.38s1.7-5.65 7.25-9.23c5.56-3.58 9.61-3.67 16.68-6.88s9.51-5.32 10.64-6.06c1.16-.76 2.21-1.45 3.02-.12c.52.86-.38 4.38-2.77 7.8c-2.44 3.49-4.84 5.41-6.66 11.42c-2.41 7.93 2.22 15.14-2.72 27.88c-1.6 4.12-5.35 7.89-8.84 10.34s-8.52 3-8.52 3s1.79-1.25 2.77-5.85c.48-2.26 1.2-6.27.65-10.54c-1.57-12.21-11.5-21.76-11.5-21.76z" fill="#cd0e1f"></path><path d="M31.74 46.68c.12 2.68-1.14 12.43.49 20.26c1.28 6.16 7.62 17.05 19.49 20.25c10.92 2.95 22.61-.09 22.61-.09s4.41-7.45 2.18-18.31c-2.43-11.84-14.26-20.64-27.9-27.38c-16.39-8.1-19.36-17.86-19.36-17.86s-5.39-1.41-6.74 3.44c-2.07 7.44 9.05 15.64 9.23 19.69z" fill="#e2122d"></path>
    </svg>
  ),

  // Sunflowers — bold sunflower, 20 yellow ray petals, dark textured disc
'🌞': (s) => (
    <svg width={s} height={s} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill="#3E721D" d="M28 27c-8 0-8 6-8 6V22h-4v11s0-6-8-6c-4 0-7-2-7-2s0 9 9 9h6s0 2 2 2s2-2 2-2h6c9 0 9-9 9-9s-3 2-7 2z"></path><path fill="#FFAC33" d="M21.125 27.662c-.328 0-.651-.097-.927-.283l-2.323-1.575l-2.322 1.575a1.667 1.667 0 0 1-1.358.226a1.647 1.647 0 0 1-1.06-.874l-1.225-2.527l-2.797.204c-.04.002-.079.004-.119.004a1.656 1.656 0 0 1-1.651-1.772l.201-2.8l-2.523-1.225a1.658 1.658 0 0 1-.648-2.418l1.573-2.323l-1.573-2.322a1.65 1.65 0 0 1-.228-1.357a1.66 1.66 0 0 1 .876-1.06L7.544 7.91l-.201-2.797a1.656 1.656 0 0 1 1.77-1.771l2.797.201l1.225-2.523a1.66 1.66 0 0 1 2.418-.648l2.322 1.573L20.198.372a1.642 1.642 0 0 1 1.355-.228c.465.125.854.444 1.062.876l1.225 2.523l2.8-.201c.037-.003.078-.003.116-.003a1.655 1.655 0 0 1 1.652 1.774l-.204 2.797l2.527 1.225c.433.209.751.598.874 1.06c.124.465.043.96-.227 1.357l-1.575 2.322l1.575 2.323c.269.398.351.892.227 1.356a1.649 1.649 0 0 1-.874 1.062l-2.527 1.225l.204 2.8c.034.478-.143.946-.48 1.288a1.662 1.662 0 0 1-1.288.48l-2.8-.204l-1.225 2.527a1.646 1.646 0 0 1-1.062.874a1.55 1.55 0 0 1-.428.057z"></path><circle fill="#732700" cx="18" cy="14" r="7"></circle>
    </svg>
  ),

  // Sweet Peas — climbing vine with pea-flower anatomy (standard+wings+keel)
  // Tulips — two tulips in full bloom on straight stems with strap leaves
'🌷': (s) => (
    <svg width={s} height={s} viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M65.33 114.77c-3.62-.34-9.05-.1-14.82-3.67c-13.73-8.48-21.79-28.39-27.42-40.59c-1.14-2.48-.15-2.91 1.61-2.43c2.95.8 8.1 4.02 9.01 4.64c23.46 15.89 38.21 31.15 39.94 36.49c1.84 5.63-6.09 5.77-8.32 5.56z" fill="#7cb342">

</path>

<defs>

<path id="IconifyId17ecdb2904d178eab21234" d="M65.33 114.77c-3.62-.34-9.05-.1-14.82-3.67c-13.73-8.48-21.79-28.39-27.42-40.59c-1.14-2.48-.15-2.91 1.61-2.43c2.95.8 8.1 4.02 9.01 4.64c23.46 15.89 38.21 31.15 39.94 36.49c1.84 5.63-6.09 5.77-8.32 5.56z">

</path>

</defs>

<clipPath id="IconifyId17ecdb2904d178eab21235">

<use href="#IconifyId17ecdb2904d178eab21234" overflow="visible">

</use>

</clipPath>

<path d="M77.22 116.12c0-13.6-6.92-17.32-6.92-17.32c-22.28-27.22-48.5-35.38-48.5-35.38l-.25 5.44c5.71.21 35.37 26.97 43.48 38.33c3.15 4.41 3.75 7.5 3.75 7.5l8.44 1.43z" clipPath="url(#IconifyId17ecdb2904d178eab21235)" fill="#bdcf46">

</path>

<path d="M44.34 24.64c.6-3.94 6.74-18.47 16.12-19.07c6.44-.42 13.98 5.47 15.88 14.56c1.83 8.77 4.26 17.9.08 26.15c-3.48 6.86-11.37 14.96-19.78 9.94c-9.44-5.63-14.13-19.84-12.3-31.58z" fill="#eb4e9d">

</path>

<path d="M50.52 24.5c.38-2.48 4.24-11.6 10.13-11.99c4.05-.26 8.79 3.43 9.98 9.16c1.15 5.52 2.67 11.26.05 16.44c-2.19 4.32-7.16 9.41-12.44 6.26c-5.93-3.55-8.86-12.49-7.72-19.87z" fill="#f387ab">

</path>

<path d="M68.22 111.32c-.12.44-.28.87-.45 1.29c-.31.78-.62 1.56-.95 2.34c-.28.64-.56 1.43-1.29 1.7c-.91.35-2.05.19-2.96-.08c-3.78-1.11-2.45-4.65-1.84-7.4c1.22-5.54 2.38-11.15 2.78-16.81c.41-5.84.02-11.7.02-17.55c0-.11.01-2.49-.08-2.49h7.46v2.74c0 4.24.01 8.47-.08 12.7c-.19 7.84-.34 15.95-2.61 23.56z" fill="#7cb342">

</path>

<g>

<path d="M53.94 118.6c1.74-5.34 16.48-20.6 39.94-36.49c.91-.62 6.07-3.85 9.01-4.64c1.76-.48 2.76-.05 1.61 2.43c-5.63 12.2-13.69 32.11-27.42 40.59c-5.77 3.56-11.2 3.33-14.82 3.67c-2.22.2-10.15.06-8.32-5.56z" fill="#7cb342">

</path>

<defs>

<path id="IconifyId17ecdb2904d178eab21236" d="M53.94 118.6c1.74-5.34 16.48-20.6 39.94-36.49c.91-.62 6.07-3.85 9.01-4.64c1.76-.48 2.76-.05 1.61 2.43c-5.63 12.2-13.69 32.11-27.42 40.59c-5.77 3.56-11.2 3.33-14.82 3.67c-2.22.2-10.15.06-8.32-5.56z">

</path>

</defs>

<clipPath id="IconifyId17ecdb2904d178eab21237">

<use href="#IconifyId17ecdb2904d178eab21236" overflow="visible">

</use>

</clipPath>

<path d="M58.82 124.07s.6-3.09 3.75-7.5c8.1-11.36 37.77-38.12 43.48-38.33l-.25-5.44s-26.22 8.16-48.5 35.38c0 0-6.92 3.71-6.92 17.32l8.44-1.43z" clipPath="url(#IconifyId17ecdb2904d178eab21237)" fill="#bdcf46">

</path>

</g>

<path d="M75.62 12.39c2.49-2.55 7.2-6.78 12.1-1.85c-1.6-2.43-3.16-4.05-4.5-5.02c-2.04-1.49-4.27-1.74-6.4-.31c-9.75 6.54-16.44 24.38-18.1 40.3c-.05.49-.1 1.62-.1 3.18c.79-6.08 2.19-11.22 2.65-12.59c3.23-9.51 9.38-18.61 14.35-23.71z" fill="#ea4e9c">

</path>

<g>

<path d="M96.85 43.02c-1.58-16.83-5.44-26.85-9.14-32.48c-4.9-4.93-9.61-.7-12.1 1.85c-4.8 4.93-10.71 13.63-14.01 22.81c-5.52-7.93-12.86-16.41-19.29-17.83c-2.35-.52-5.16-1.03-7.91 3.14c-1 1.51-2.04 3.82-2.82 7.02c-.6 5.87-.55 13.34.69 22.75c1.13 8.6 3.69 13.74 4.58 15.53c6.37 12.92 19.59 14.16 21.96 14.16C70 81.32 77.46 77.9 77.57 77.85h.02c2.31-.53 14.92-4.67 18.26-18.69c.45-1.92 1.81-7.51 1-16.14z" fill="#f387ab">

</path>

<path d="M42.31 17.37c10.74 2.36 24.05 24.46 27.11 30.77c.27.56.98 2.56 1.69 5.3c-.83-4.38-1.88-7.8-2.22-8.73c-3.07-8.24-14.54-31.55-25.49-35.75c-2.4-.92-4.52-.18-6.17 1.73c-2.19 2.52-4.71 7.75-5.65 16.84c.78-3.2 1.82-5.51 2.82-7.02c2.75-4.17 5.56-3.65 7.91-3.14z" fill="#ea4e9c">

</path>

</g>
    </svg>
  ),

  // Wildflower Mix — 5 different wildflower species in a meadow
  '🌈': (s) => <W size={s}>
    <path d="M5,46 Q5,36 6,24" stroke="#558B2F" strokeWidth={1.8} fill="none" strokeLinecap="round"/>
    <path d="M12,46 Q11,36 12,28" stroke="#66BB6A" strokeWidth={1.8} fill="none" strokeLinecap="round"/>
    <path d="M19,46 Q19,34 20,24" stroke="#558B2F" strokeWidth={1.8} fill="none" strokeLinecap="round"/>
    <path d="M28,46 Q28,34 28,24" stroke="#7CB342" strokeWidth={1.8} fill="none" strokeLinecap="round"/>
    <path d="M36,46 Q35,34 36,28" stroke="#558B2F" strokeWidth={1.8} fill="none" strokeLinecap="round"/>
    <path d="M43,46 Q44,36 43,24" stroke="#66BB6A" strokeWidth={1.8} fill="none" strokeLinecap="round"/>
    <ellipse cx={6} cy={16} rx={6.5} ry={3} fill="#1565C0" transform="rotate(0)"/>
    <ellipse cx={6} cy={16} rx={6.5} ry={3} fill="#1565C0" transform="rotate(45 6 16)"/>
    <ellipse cx={6} cy={16} rx={6.5} ry={3} fill="#1565C0" transform="rotate(90 6 16)"/>
    <ellipse cx={6} cy={16} rx={6.5} ry={3} fill="#1565C0" transform="rotate(135 6 16)"/>
    <circle cx={6} cy={16} r={3.2} fill="#0D47A1"/>
    <ellipse cx={16} cy={17} rx={6} ry={8.5} fill="#E53935" transform="rotate(0)"/>
    <ellipse cx={16} cy={17} rx={6} ry={8.5} fill="#E53935" transform="rotate(90 16 17)"/>
    <circle cx={16} cy={17} r={3.8} fill="#212121"/>
    <circle cx={14.5} cy={15.5} r={0.7} fill="#4FC3F7"/>
    <circle cx={17.5} cy={15.5} r={0.7} fill="#4FC3F7"/>
    <ellipse cx={27} cy={14} rx={10} ry={4} fill="white" transform="rotate(0)"/>
    <ellipse cx={27} cy={14} rx={10} ry={4} fill="white" transform="rotate(25.7 27 14)"/>
    <ellipse cx={27} cy={14} rx={10} ry={4} fill="white" transform="rotate(51.4 27 14)"/>
    <ellipse cx={27} cy={14} rx={10} ry={4} fill="white" transform="rotate(77.1 27 14)"/>
    <ellipse cx={27} cy={14} rx={10} ry={4} fill="white" transform="rotate(102.8 27 14)"/>
    <ellipse cx={27} cy={14} rx={10} ry={4} fill="white" transform="rotate(128.5 27 14)"/>
    <ellipse cx={27} cy={14} rx={10} ry={4} fill="white" transform="rotate(154.2 27 14)"/>
    <circle cx={27} cy={14} r={5.5} fill="#FDD835"/>
    <circle cx={27} cy={14} r={3.5} fill="#F9A825"/>
    <path d="M36,24 Q37,18 36,15 Q39,12 37,17Z" fill="#F06292"/>
    <path d="M36,24 Q35,18 36,15 Q33,12 35,17Z" fill="#CE93D8"/>
    <path d="M36,20 Q39,15 40,18Z" fill="#F06292"/>
    <ellipse cx={43} cy={17} rx={7} ry={3} fill="#7B1FA2" transform="rotate(0)"/>
    <ellipse cx={43} cy={17} rx={7} ry={3} fill="#7B1FA2" transform="rotate(72 43 17)"/>
    <ellipse cx={43} cy={17} rx={7} ry={3} fill="#6A1B9A" transform="rotate(144 43 17)"/>
    <ellipse cx={43} cy={17} rx={7} ry={3} fill="#7B1FA2" transform="rotate(216 43 17)"/>
    <ellipse cx={43} cy={17} rx={7} ry={3} fill="#6A1B9A" transform="rotate(288 43 17)"/>
    <circle cx={43} cy={17} r={2.5} fill="#FFF176"/>
  </W>,

  // Zinnias — multicolour double-ring disc flower
  '🌠': (s) => <W size={s}>
    <path d="M24,44 Q24,36 24,31" stroke="#558B2F" strokeWidth={2.2} strokeLinecap="round" fill="none"/>
    <path d="M24,38 Q18,35 16,31" stroke="#66BB6A" strokeWidth={1.8} fill="none"/>
    <ellipse cx={24} cy={16} rx={14} ry={5.5} fill="#E53935" transform="rotate(0)" opacity={0.92}/>
    <ellipse cx={24} cy={16} rx={14} ry={5.5} fill="#FF5722" transform="rotate(25.7 24 16)" opacity={0.92}/>
    <ellipse cx={24} cy={16} rx={14} ry={5.5} fill="#FF9800" transform="rotate(51.4 24 16)" opacity={0.92}/>
    <ellipse cx={24} cy={16} rx={14} ry={5.5} fill="#FDD835" transform="rotate(77.1 24 16)" opacity={0.92}/>
    <ellipse cx={24} cy={16} rx={14} ry={5.5} fill="#8BC34A" transform="rotate(102.8 24 16)" opacity={0.92}/>
    <ellipse cx={24} cy={16} rx={14} ry={5.5} fill="#1E88E5" transform="rotate(128.5 24 16)" opacity={0.92}/>
    <ellipse cx={24} cy={16} rx={14} ry={5.5} fill="#E91E63" transform="rotate(154.2 24 16)" opacity={0.92}/>
    <ellipse cx={24} cy={16} rx={9} ry={4.5} fill="#EF9A9A" transform="rotate(18 24 16)"/>
    <ellipse cx={24} cy={16} rx={9} ry={4.5} fill="#FFAB91" transform="rotate(54 24 16)"/>
    <ellipse cx={24} cy={16} rx={9} ry={4.5} fill="#FFE082" transform="rotate(90 24 16)"/>
    <ellipse cx={24} cy={16} rx={9} ry={4.5} fill="#90CAF9" transform="rotate(126 24 16)"/>
    <ellipse cx={24} cy={16} rx={9} ry={4.5} fill="#CE93D8" transform="rotate(162 24 16)"/>
    <ellipse cx={24} cy={16} rx={5.5} ry={3.5} fill="#FFF176" transform="rotate(0)"/>
    <ellipse cx={24} cy={16} rx={5.5} ry={3.5} fill="#FFF9C4" transform="rotate(45 24 16)"/>
    <ellipse cx={24} cy={16} rx={5.5} ry={3.5} fill="#FFF176" transform="rotate(90 24 16)"/>
    <ellipse cx={24} cy={16} rx={5.5} ry={3.5} fill="#FFF9C4" transform="rotate(135 24 16)"/>
    <circle cx={24} cy={16} r={5} fill="#FF6F00"/>
    <circle cx={24} cy={16} r={3} fill="#E65100"/>
  </W>,
};
