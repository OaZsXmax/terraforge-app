'use client';
import React from 'react';
import W from '../utils/iconWrapper';
import type { IconMap } from '../utils/types';

export const infrastructureIcons: IconMap = {

  '🏡': (s) => <W size={s}>
    <rect x={5} y={27} width={38} height={20} rx={3} fill="#A5D6A7" opacity={0.18}/>
    <rect x={5} y={27} width={38} height={20} rx={3} fill="none" stroke="#4CAF50" strokeWidth={1.8}/>
    {[0,1,2].map(i=><rect key={i} x={8+i*13} y={30} width={10} height={15} rx={1.5} fill="#80CBC4" opacity={0.25}/>)}
    <line x1={5} y1={27} x2={43} y2={27} stroke="#66BB6A" strokeWidth={1.5}/>
    <line x1={21} y1={27} x2={21} y2={47} stroke="#66BB6A" strokeWidth={1.2}/>
    <line x1={34} y1={27} x2={34} y2={47} stroke="#66BB6A" strokeWidth={1.2}/>
    <path d="M2 27L24 7L46 27Z" fill="#A5D6A7" opacity={0.25} stroke="#4CAF50" strokeWidth={1.8}/>
    <line x1={24} y1={7} x2={24} y2={27} stroke="#66BB6A" strokeWidth={1.2}/>
    <line x1={13} y1={17} x2={35} y2={17} stroke="#66BB6A" strokeWidth={1}/>
    <path d="M13 41Q13 34 13 30" stroke="#4CAF50" strokeWidth={1.8} fill="none"/>
    <ellipse cx={13} cy={29} rx={3.5} ry={2.5} fill="#66BB6A"/>
    <path d="M24 41Q24 33 24 29" stroke="#388E3C" strokeWidth={1.8} fill="none"/>
    <ellipse cx={24} cy={28} rx={3.5} ry={2.5} fill="#81C784"/>
    <path d="M37 41Q37 34 37 30" stroke="#4CAF50" strokeWidth={1.8} fill="none"/>
    <ellipse cx={37} cy={29} rx={3.5} ry={2.5} fill="#66BB6A"/>
  </W>,

  '🌿': (s) => <W size={s}>
    <path d="M24 25Q32 25 32 18Q32 10 24 10Q16 10 16 18Q16 26 24 27Q32 27 35 20Q38 13 33 8" stroke="#78909C" strokeWidth={4.5} fill="none" strokeLinecap="round"/>
    {[[32,23],[32,19],[32,15],[30,11],[25,10],[20,11],[16,15],[16,19],[17,24],[22,27],[28,27],[34,25],[37,20],[38,14],[35,9]].map(([sx,sy],i)=>(
      <ellipse key={i} cx={sx} cy={sy} rx={2.2} ry={1.5} fill={i%2===0?'#90A4AE':'#607D8B'} opacity={0.9}/>
    ))}
    {[[26,11,'#66BB6A'],[20,13,'#4CAF50'],[16,18,'#81C784'],[17,24,'#43A047'],[24,27,'#66BB6A'],[31,25,'#4CAF50'],[37,20,'#81C784'],[34,12,'#A5D6A7']].map(([hx,hy,hc],i)=>(
      <g key={i}><circle cx={hx as number} cy={hy as number} r={2.5} fill={hc as string}/><line x1={hx as number} y1={hy as number} x2={(hx as number)+(i%2===0?1:-1)} y2={(hy as number)-3} stroke="#558B2F" strokeWidth={1}/></g>
    ))}
    <ellipse cx={24} cy={41} rx={17} ry={5} fill="#6D4C41" opacity={0.35}/>
  </W>,
};
