'use client';
import React from 'react';
import W from '../utils/iconWrapper';
import type { IconMap } from '../utils/types';

export const soilIcons: IconMap = {
  '🪟': (s) => <W size={s}>
    <rect x={5} y={26} width={38} height={20} rx={4} fill="url(#gBark)"/>
    <rect x={5} y={21} width={38} height={7} rx={3} fill="#5D4037"/>
    <rect x={7} y={10} width={34} height={17} rx={2.5} fill="#80CBC4" opacity={0.2} stroke="#66BB6A" strokeWidth={1.8}/>
    <line x1={7} y1={19} x2={41} y2={10} stroke="#66BB6A" strokeWidth={1.8}/>
    <line x1={24} y1={10} x2={24} y2={27} stroke="#66BB6A" strokeWidth={1.2}/>
    <path d="M13 31Q13 25 13 21" stroke="#4CAF50" strokeWidth={1.8} fill="none"/>
    <ellipse cx={13} cy={20} rx={3.5} ry={2.5} fill="#66BB6A"/>
    <path d="M24 31Q24 25 24 21" stroke="#388E3C" strokeWidth={1.8} fill="none"/>
    <ellipse cx={24} cy={20} rx={3.5} ry={2.5} fill="#81C784"/>
    <path d="M35 31Q35 25 35 21" stroke="#4CAF50" strokeWidth={1.8} fill="none"/>
    <ellipse cx={35} cy={20} rx={3.5} ry={2.5} fill="#66BB6A"/>
  </W>,

  '♻️': (s) => <W size={s}>
    <rect x={9} y={16} width={30} height={28} rx={4} fill="#5D4037"/>
    <rect x={9} y={16} width={30} height={28} rx={4} fill="none" stroke="#795548" strokeWidth={1.5}/>
    {[22,28,34,38].map(y=><line key={y} x1={9} y1={y} x2={39} y2={y} stroke="#6D4C41" strokeWidth={1.2}/>)}
    {[[14,26],[20,29],[26,26],[32,29],[18,35],[30,35]].map(([x,y],i)=><ellipse key={i} cx={x} cy={y} rx={2} ry={1.3} fill="#4E342E"/>)}
    <rect x={7} y={11} width={34} height={7} rx={3} fill="#6D4C41"/>
    <rect x={15} y={8} width={18} height={5} rx={2.5} fill="#5D4037"/>
    <path d="M16 11Q14 7 16 4" stroke="#8BC34A" strokeWidth={2} strokeLinecap="round" fill="none"/>
    <path d="M24 11Q22 6 24 3" stroke="#66BB6A" strokeWidth={2} strokeLinecap="round" fill="none"/>
    <path d="M32 11Q34 7 32 4" stroke="#8BC34A" strokeWidth={2} strokeLinecap="round" fill="none"/>
  </W>,

  '🌾': (s) => <W size={s}>
    {[5,11,17,24,31,38,44].map((x,i)=>(
      <g key={i}>
        <path d={`M${x} 46Q${x+(i%2===0?1.5:-1.5)} ${37} ${x+(i%3===0?1:i%3===1?-1:0)} ${25-i%3*3}`}
          stroke={['#AED581','#9CCC65','#8BC34A','#7CB342','#C5E1A5','#AED581','#9CCC65'][i]}
          strokeWidth={2.2} fill="none" strokeLinecap="round"/>
        {i%2===0 && [0,1,2].map(j=><ellipse key={j} cx={(x+(i%3===0?1:i%3===1?-1:0))+(j%2===0?2.5:-2.5)} cy={25-i%3*3+j*3.5} rx={3.5} ry={2} fill="#FFD54F" opacity={0.88}/>)}
      </g>
    ))}
    <rect x={3} y={44} width={42} height={5} rx={2.5} fill="url(#gSoil)" opacity={0.7}/>
  </W>,

  '🌲': (s) => <W size={s}>
    <path d="M2 38Q6 26 24 22Q42 26 46 38Z" fill="url(#gBark)"/>
    <path d="M3 38Q8 28 24 24Q40 28 45 38Z" fill="#795548"/>
    <ellipse cx={11} cy={33} rx={6} ry={5} fill="#5D4037"/>
    <ellipse cx={11} cy={33} rx={4} ry={3.5} fill="#6D4C41"/>
    <circle cx={11} cy={33} r={1.8} fill="#795548"/>
    <ellipse cx={24} cy={31} rx={7} ry={5.5} fill="#4E342E"/>
    <ellipse cx={24} cy={31} rx={5} ry={4} fill="#5D4037"/>
    <circle cx={24} cy={31} r={2.2} fill="#6D4C41"/>
    <ellipse cx={37} cy={33} rx={6} ry={5} fill="#5D4037"/>
    <ellipse cx={37} cy={33} rx={4} ry={3.5} fill="#6D4C41"/>
    <circle cx={37} cy={33} r={1.8} fill="#795548"/>
    {[[8,22],[13,19],[18,17],[24,16],[30,17],[35,19],[40,22]].map(([gx,gy],i)=>(
      <g key={i}><line x1={gx} y1={gy+3} x2={gx+(i%2===0?2:-2)} y2={gy} stroke="#558B2F" strokeWidth={2}/>
      <ellipse cx={gx+(i%2===0?3.5:-3.5)} cy={gy+1} rx={4} ry={2.5} fill={i%2===0?'#66BB6A':'#4CAF50'} transform={`rotate(${i%2===0?-20:20} ${gx} ${gy})`}/></g>
    ))}
  </W>,

  '🍂': (s) => <W size={s}>
    <ellipse cx={24} cy={35} rx={20} ry={11} fill="#6D4C41"/>
    <ellipse cx={24} cy={35} rx={20} ry={11} fill="url(#gBrown)" opacity={0.4}/>
    {[[11,33],[16,30],[21,35],[28,31],[34,35],[38,30],[14,39],[24,39],[35,39],[20,37],[30,37]].map(([x,y],i)=>(
      <ellipse key={i} cx={x} cy={y} rx={4.5} ry={2} fill={i%3===0?'#795548':i%3===1?'#6D4C41':'#8D6E63'} transform={`rotate(${i*25} ${x} ${y})`} opacity={0.82}/>
    ))}
    {[[14,28],[23,24],[34,26],[18,32],[36,32]].map(([x,y],i)=>(
      <path key={i} d={`M${x} ${y}Q${x+4} ${y-4} ${x+2.5} ${y-8}Q${x-1.5} ${y-4} ${x} ${y}Z`}
        fill={['#E53935','#FF8F00','#FDD835','#E53935','#FF8F00'][i]}
        transform={`rotate(${i*40-40} ${x} ${y})`} opacity={0.9}/>
    ))}
  </W>,

  '🪱': (s) => <W size={s}>
    <rect x={7} y={22} width={34} height={24} rx={4} fill="#5D4037"/>
    <rect x={7} y={22} width={34} height={24} rx={4} fill="none" stroke="#6D4C41" strokeWidth={1.5}/>
    {[29,35,40].map(y=><line key={y} x1={7} y1={y} x2={41} y2={y} stroke="#4E342E" strokeWidth={1.2}/>)}
    <rect x={5} y={17} width={38} height={7} rx={3} fill="#4E342E"/>
    <rect x={14} y={13} width={20} height={6} rx={3} fill="#5D4037"/>
    <path d="M13 31Q17 28 20 31Q23 34 26 31" stroke="#EF9A9A" strokeWidth={3} fill="none" strokeLinecap="round"/>
    <circle cx={13} cy={31} r={2} fill="#FFCDD2"/>
    <path d="M23 39Q26 36 29 39Q32 42 35 39" stroke="#E57373" strokeWidth={3} fill="none" strokeLinecap="round"/>
    <circle cx={23} cy={39} r={2} fill="#FFCDD2"/>
    <ellipse cx={24} cy={23} rx={16} ry={3.5} fill="#4E342E"/>
  </W>,
};
