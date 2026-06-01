'use client';
import React from 'react';
import W from '../utils/iconWrapper';
import type { IconMap } from '../utils/types';

const P = (cx:number,cy:number,n:number,r:number,rx:number,ry:number,fill:string,op=0.92) =>
  Array.from({length:n},(_,i)=>{const a=(i*(360/n)-90)*Math.PI/180;return<ellipse key={i} cx={cx+Math.cos(a)*r} cy={cy+Math.sin(a)*r} rx={rx} ry={ry} fill={fill} transform={`rotate(${i*(360/n)-90} ${cx+Math.cos(a)*r} ${cy+Math.sin(a)*r})`} opacity={op}/>;});

export const waterIcons: IconMap = {
  '🪣': (s) => <W size={s}>
    <path d="M9 18L12 44L36 44L39 18Z" fill="url(#gSkyBlue)"/>
    <path d="M9 18L12 44L36 44L39 18Z" fill="url(#gSteel)" opacity={0.25}/>
    <ellipse cx={24} cy={18} rx={15} ry={4.5} fill="#607D8B"/>
    <path d="M16 18Q24 14 32 18" stroke="#90A4AE" strokeWidth={2.2} fill="none"/>
    <ellipse cx={24} cy={33} rx={8} ry={4.5} fill="#81D4FA" opacity={0.4}/>
    <path d="M18 18Q18 11 21 9" stroke="#90A4AE" strokeWidth={3.5} strokeLinecap="round" fill="none"/>
    <path d="M30 18Q30 11 27 9" stroke="#90A4AE" strokeWidth={3.5} strokeLinecap="round" fill="none"/>
    <path d="M21 9Q24 7 27 9" stroke="#B0BEC5" strokeWidth={2.2} fill="none"/>
  </W>,

  '🚿': (s) => <W size={s}>
    <path d="M6 35Q10 35 10 31L10 15Q10 12 13 12L38 12Q41 12 41 16L41 21Q41 23 39 23L20 23Q18 23 18 25L18 35Q18 37 21 37L30 37" stroke="#90CAF9" strokeWidth={3.8} fill="none" strokeLinecap="round"/>
    {[[27,35],[31,35],[35,35],[39,35],[27,39],[31,39],[35,39],[39,39],[29,43],[33,43],[37,43]].map(([x,y],i)=><circle key={i} cx={x} cy={y} r={1.8} fill="#64B5F6" opacity={0.85}/>)}
  </W>,

  '🐟': (s) => <W size={s}>
    <ellipse cx={24} cy={33} rx={22} ry={13} fill="#0D47A1" opacity={0.35}/>
    <ellipse cx={24} cy={33} rx={22} ry={13} fill="url(#gWater)" opacity={0.32}/>
    <path d="M4,33 Q24,28 44,33 Q24,38 4,33Z" fill="#0D47A1" opacity={0.22}/>
    <circle cx={15} cy={36} r={7} fill="#2E7D32" opacity={0.85}/>
    <path d="M15,36 L15,29" stroke="#1B5E20" strokeWidth={1.2}/>
    <circle cx={35} cy={34} r={7} fill="#388E3C" opacity={0.85}/>
    <path d="M35,34 L35,27" stroke="#2E7D32" strokeWidth={1.2}/>
    <path d="M24,27 Q21,22 22,18 Q24,21 24,27Z" fill="#F06292"/>
    <path d="M24,27 Q27,22 26,18 Q24,21 24,27Z" fill="#E91E63"/>
    <path d="M24,27 Q18,24 18,20 Q21,22 24,27Z" fill="#F48FB1"/>
    <path d="M24,27 Q30,24 30,20 Q27,22 24,27Z" fill="#F06292"/>
    <circle cx={24} cy={25} r={3.2} fill="#FDD835"/>
    <ellipse cx={38} cy={23} rx={4} ry={2} fill="#80DEEA"/>
    <path d="M38,23 Q33,20 30,21" stroke="#B2EBF2" strokeWidth={1.5} fill="none"/>
    <path d="M38,23 Q43,20 46,21" stroke="#B2EBF2" strokeWidth={1.5} fill="none"/>
    <path d="M38,23 Q33,26 30,25" stroke="#B2EBF2" strokeWidth={1.5} fill="none"/>
    <path d="M38,23 Q43,26 46,25" stroke="#B2EBF2" strokeWidth={1.5} fill="none"/>
    <circle cx={36} cy={23} r={2} fill="#006064"/>
    <path d="M6,42 Q6,24 6,24" stroke="#8BC34A" strokeWidth={2.5} strokeLinecap="round" fill="none"/>
    <ellipse cx={6} cy={24} rx={2} ry={4.5} fill="#8D6E63"/>
    <path d="M10,44 Q10,24 10,24" stroke="#7CB342" strokeWidth={2.5} strokeLinecap="round" fill="none"/>
    <ellipse cx={10} cy={24} rx={2} ry={4} fill="#6D4C41"/>
    <path d="M41,42 Q41,24 41,24" stroke="#8BC34A" strokeWidth={2.5} strokeLinecap="round" fill="none"/>
    <ellipse cx={41} cy={24} rx={2} ry={4.5} fill="#8D6E63"/>
  </W>,  '🌧️': (s) => <W size={s}>
    <path d="M9 24Q8 15 14 11Q19 7 28 10Q35 7 40 14Q45 21 40 25L9 25Z" fill="url(#gSteel)"/>
    <ellipse cx={24} cy={21} rx={11} ry={3} fill="white" opacity={0.16}/>
    {[[9,32],[14,31],[19,32],[24,31],[29,32],[34,31],[39,32],[11,40],[17,39],[23,40],[29,39],[35,40]].map(([x,y],i)=><path key={i} d={`M${x} ${y}Q${x+0.8} ${y+3} ${x} ${y+6}`} stroke="#90CAF9" strokeWidth={2.5} strokeLinecap="round" fill="none"/>)}
  </W>,

  '💧': (s) => <W size={s}>
    <rect x={7} y={20} width={34} height={24} rx={5} fill="url(#gSkyBlue)"/>
    <rect x={7} y={20} width={34} height={24} rx={5} fill="url(#gSteel)" opacity={0.2}/>
    <rect x={5} y={16} width={38} height={5} rx={2.5} fill="#607D8B"/>
    <path d="M15 16L15 12Q15 9 18 9L30 9Q33 9 33 12L33 16" stroke="#546E7A" strokeWidth={1.8} fill="none"/>
    <ellipse cx={24} cy={35} rx={12} ry={5} fill="#B3E5FC" opacity={0.3}/>
    <rect x={38} y={29} width={7} height={4} rx={2} fill="#546E7A"/>
    <path d="M45 31Q48 33 47 37" stroke="#90CAF9" strokeWidth={2.5} strokeLinecap="round" fill="none"/>
  </W>,

  '🌊': (s) => <W size={s}>
    <path d="M2 28Q6 18 12 23Q18 28 24 21Q30 14 36 19Q40 23 46 17L46 44L2 44Z" fill="#0D47A1" opacity={0.45}/>
    <path d="M2 29Q6 19 12 24Q18 29 24 22Q30 15 36 20Q40 24 46 18" stroke="#90CAF9" strokeWidth={3.2} fill="none" strokeLinecap="round"/>
    <path d="M2 36Q8 29 16 33Q24 37 30 31Q38 25 44 30" stroke="#64B5F6" strokeWidth={2} fill="none" strokeLinecap="round"/>
    <path d="M2 28Q4 21 6 17" stroke="#4CAF50" strokeWidth={2.5} strokeLinecap="round" fill="none"/>
    <ellipse cx={6} cy={15} rx={5.5} ry={3} fill="#66BB6A"/>
    <path d="M46 18Q44 12 42 9" stroke="#4CAF50" strokeWidth={2.5} strokeLinecap="round" fill="none"/>
    <ellipse cx={42} cy={7} rx={5.5} ry={3} fill="#66BB6A"/>
  </W>,
};

export const energyIcons: IconMap = {
  '🔋': (s) => <W size={s}>
    <rect x={7} y={14} width={34} height={26} rx={5} fill="#2E7D32"/>
    <rect x={7} y={14} width={34} height={26} rx={5} fill="none" stroke="#4CAF50" strokeWidth={1.8}/>
    <rect x={41} y={20} width={5} height={12} rx={2.5} fill="#66BB6A"/>
    <rect x={10} y={17} width={8} height={20} rx={2.5} fill="#81C784"/>
    <rect x={20} y={17} width={8} height={20} rx={2.5} fill="#66BB6A"/>
    <rect x={30} y={17} width={8} height={20} rx={2.5} fill="#A5D6A7"/>
    <path d="M19 8L22 14L26 14L23 8Z" fill="#FFD54F"/>
    <path d="M23 8Q23 5 23 4" stroke="#FDD835" strokeWidth={2} strokeLinecap="round" fill="none"/>
  </W>,

  '☀️': (s) => <W size={s}>
    <rect x={5} y={22} width={38} height={22} rx={4} fill="url(#gSkyBlue)" opacity={0.6}/>
    {[0,1,2].map(col=>[0,1].map(row=><rect key={`${col}${row}`} x={7+col*13} y={24+row*9} width={11} height={7} rx={1.8} fill="#1E88E5" opacity={0.75}/>))}
    <rect x={5} y={20} width={38} height={4} rx={2} fill="#90CAF9" opacity={0.5}/>
    <path d="M15 22L15 14" stroke="#607D8B" strokeWidth={2.2}/>
    <path d="M33 22L33 14" stroke="#607D8B" strokeWidth={2.2}/>
    <path d="M12 14Q24 10 36 14" stroke="#546E7A" strokeWidth={2}/>
    <path d="M24 10Q24 7 24 5" stroke="#FDD835" strokeWidth={3} strokeLinecap="round" fill="none"/>
    <path d="M17 7Q18 10 17 13" stroke="#FDD835" strokeWidth={2} strokeLinecap="round" fill="none"/>
    <path d="M31 7Q30 10 31 13" stroke="#FDD835" strokeWidth={2} strokeLinecap="round" fill="none"/>
    <path d="M11 9Q13 11 12 14" stroke="#FDD835" strokeWidth={1.8} strokeLinecap="round" fill="none"/>
    <path d="M37 9Q35 11 36 14" stroke="#FDD835" strokeWidth={1.8} strokeLinecap="round" fill="none"/>
  </W>,

  '⚡': (s) => <W size={s}>
    <rect x={5} y={7} width={25} height={17} rx={3} fill="url(#gSkyBlue)" opacity={0.65}/>
    {[0,1].map(row=>[0,1].map(col=><rect key={`${row}${col}`} x={7+col*12} y={9+row*7} width={10} height={5.5} rx={1.5} fill="#1E88E5" opacity={0.75}/>))}
    <path d="M30 15Q36 15 36 20L36 30" stroke="#546E7A" strokeWidth={3.8} fill="none" strokeLinecap="round"/>
    <rect x={28} y={28} width={14} height={16} rx={7} fill="#455A64"/>
    <path d="M28 38Q24 42 20 44" stroke="#546E7A" strokeWidth={3} fill="none" strokeLinecap="round"/>
    <path d="M20 44Q15 46 12 44Q10 42 12 40" stroke="#90CAF9" strokeWidth={2.2} fill="none"/>
    {[0,1,2,3].map(i=><path key={i} d={`M${12+i*5} 42Q${13+i*5} 45 ${12+i*5} 48`} stroke="#64B5F6" strokeWidth={2} strokeLinecap="round" fill="none"/>)}
  </W>,

  '🌬️': (s) => <W size={s}>
    <rect x={21} y={26} width={5} height={21} rx={2.5} fill="url(#gSteel)"/>
    <circle cx={24} cy={26} r={5} fill="#CFD8DC"/>
    <circle cx={24} cy={26} r={3.5} fill="#B0BEC5"/>
    <path d="M24 26Q21 16 24 6Q31 9 24 26Z" fill="url(#gSteel)"/>
    <path d="M24 26Q33 29 42 24Q42 18 24 26Z" fill="#CFD8DC"/>
    <path d="M24 26Q15 32 12 41Q7 36 24 26Z" fill="url(#gSteel)"/>
    <path d="M4 14Q9 12 11 16" stroke="#90CAF9" strokeWidth={2.2} strokeLinecap="round" fill="none"/>
    <path d="M4 20Q9 18 11 22" stroke="#90CAF9" strokeWidth={2.2} strokeLinecap="round" fill="none"/>
    <path d="M5 26Q10 24 12 28" stroke="#90CAF9" strokeWidth={1.8} strokeLinecap="round" fill="none"/>
  </W>,
};

export const animalIcons: IconMap = {
  '🐔': (s) => <W size={s}>
    <rect x={7} y={26} width={34} height={18} rx={4} fill="url(#gBark)"/>
    <rect x={7} y={26} width={34} height={7} rx={4} fill="url(#gBrown)"/>
    {[0,1,2].map(i=><rect key={i} x={10+i*11} y={31} width={8} height={11} rx={2.5} fill="#5D4037"/>)}
    <path d="M7 26L24 10L41 26Z" fill="#795548"/>
    <path d="M7 26L24 12L41 26Z" fill="url(#gBrown)" opacity={0.4}/>
    <ellipse cx={24} cy={17} rx={7.5} ry={8} fill="#FFF176"/>
    <ellipse cx={24} cy={17} rx={7.5} ry={8} fill="url(#rShine)"/>
    <path d="M19 10Q21 6 24 4Q27 6 29 10" fill="#E53935"/>
    <path d="M20 17Q22 20 24 17Q26 20 28 17" stroke="#FF8F00" strokeWidth={1.8} fill="none"/>
    <circle cx={21} cy={15} r={2.2} fill="white"/><circle cx={21} cy={15} r={1} fill="#1A237E"/>
    <circle cx={27} cy={15} r={2.2} fill="white"/><circle cx={27} cy={15} r={1} fill="#1A237E"/>
    <path d="M28 20Q33 18 37 20" stroke="#FF8F00" strokeWidth={2} strokeLinecap="round" fill="none"/>
  </W>,

  '🦆': (s) => <W size={s}>
    <rect x={7} y={28} width={34} height={18} rx={4} fill="url(#gBark)"/>
    <rect x={7} y={28} width={34} height={7} rx={4} fill="url(#gBrown)"/>
    {[0,1,2].map(i=><rect key={i} x={10+i*11} y={33} width={8} height={11} rx={2.5} fill="#5D4037"/>)}
    <path d="M7 28L24 10L41 28Z" fill="#6D4C41"/>
    <ellipse cx={24} cy={20} rx={11} ry={9} fill="#4CAF50"/>
    <ellipse cx={24} cy={20} rx={11} ry={9} fill="url(#rSoft)"/>
    <ellipse cx={24} cy={15} rx={8} ry={7} fill="#388E3C"/>
    <path d="M30 17Q35 16 38 18" fill="#FF8F00"/>
    <circle cx={28} cy={13} r={2.2} fill="white"/><circle cx={28} cy={13} r={1} fill="#1A237E"/>
    <ellipse cx={16} cy={21} rx={4} ry={2.5} fill="#66BB6A" opacity={0.45}/>
  </W>,

  '🐐': (s) => <W size={s}>
    <rect x={5} y={30} width={38} height={16} rx={4} fill="url(#gBark)"/>
    <rect x={5} y={30} width={38} height={6} rx={4} fill="url(#gBrown)"/>
    {[0,1,2,3].map(i=><rect key={i} x={9+i*10} y={34} width={6.5} height={10} rx={2} fill="#5D4037"/>)}
    <ellipse cx={22} cy={22} rx={14} ry={9} fill="#EFEBE9"/>
    <ellipse cx={22} cy={22} rx={14} ry={9} fill="url(#rSoft)"/>
    <ellipse cx={22} cy={18} rx={9} ry={8} fill="#F5F5F5"/>
    <path d="M17 12Q17 7 19 5" stroke="#BCAAA4" strokeWidth={2.2} strokeLinecap="round" fill="none"/>
    <path d="M17 5Q15 4 13 5" stroke="#A1887F" strokeWidth={1.8} strokeLinecap="round" fill="none"/>
    <path d="M27 12Q27 7 25 5" stroke="#BCAAA4" strokeWidth={2.2} strokeLinecap="round" fill="none"/>
    <path d="M25 5Q27 4 29 5" stroke="#A1887F" strokeWidth={1.8} strokeLinecap="round" fill="none"/>
    <circle cx={19} cy={16} r={2.2} fill="white"/><circle cx={19} cy={16} r={1} fill="#4E342E"/>
    <circle cx={25} cy={16} r={2.2} fill="white"/><circle cx={25} cy={16} r={1} fill="#4E342E"/>
    <path d="M26 21Q31 20 35 22" stroke="#BCAAA4" strokeWidth={2} strokeLinecap="round" fill="none"/>
    <ellipse cx={17} cy={24} rx={4} ry={2.5} fill="#FFCDD2"/>
  </W>,

  '🐖': (s) => <W size={s}>
    <rect x={5} y={30} width={38} height={16} rx={4} fill="url(#gBark)"/>
    <rect x={5} y={30} width={38} height={6} rx={4} fill="url(#gBrown)"/>
    {[0,1,2,3].map(i=><rect key={i} x={9+i*10} y={34} width={6.5} height={10} rx={2} fill="#5D4037"/>)}
    <ellipse cx={22} cy={22} rx={15} ry={9} fill="#FFCCBC"/>
    <ellipse cx={22} cy={22} rx={15} ry={9} fill="url(#rSoft)"/>
    <ellipse cx={22} cy={17} rx={9.5} ry={8.5} fill="#FFAB91"/>
    <ellipse cx={22} cy={16} rx={6} ry={6} fill="#FF8A65"/>
    <circle cx={20} cy={16} r={2.5} fill="#BF360C" opacity={0.32}/><circle cx={20} cy={15} r={1} fill="#4E342E"/>
    <circle cx={26} cy={16} r={2.5} fill="#BF360C" opacity={0.32}/><circle cx={26} cy={15} r={1} fill="#4E342E"/>
    <circle cx={18} cy={12} r={2.2} fill="white"/><circle cx={18} cy={12} r={1} fill="#4E342E"/>
    <circle cx={28} cy={12} r={2.2} fill="white"/><circle cx={28} cy={12} r={1} fill="#4E342E"/>
    <path d="M30 19Q35 18 38 21Q34 23 30 19Z" fill="#FFCCBC"/>
  </W>,

  '🐇': (s) => <W size={s}>
    <rect x={7} y={30} width={34} height={16} rx={4} fill="url(#gBark)"/>
    <rect x={7} y={30} width={34} height={6} rx={4} fill="url(#gBrown)"/>
    {[0,1,2].map(i=><rect key={i} x={10+i*11} y={34} width={8} height={10} rx={2.5} fill="#5D4037"/>)}
    <ellipse cx={24} cy={22} rx={11} ry={9} fill="#F5F5F5"/>
    <ellipse cx={24} cy={18} rx={8} ry={7} fill="white"/>
    <path d="M19 13Q18 6 20 3" stroke="#BDBDBD" strokeWidth={4} strokeLinecap="round" fill="none"/>
    <path d="M20 3Q17 2 15 4Q17 7 20 7" fill="#FFCDD2"/>
    <path d="M29 13Q30 6 28 3" stroke="#BDBDBD" strokeWidth={4} strokeLinecap="round" fill="none"/>
    <path d="M28 3Q31 2 33 4Q31 7 28 7" fill="#FFCDD2"/>
    <circle cx={21} cy={16} r={2.2} fill="white"/><circle cx={21} cy={16} r={1} fill="#F06292"/>
    <circle cx={27} cy={16} r={2.2} fill="white"/><circle cx={27} cy={16} r={1} fill="#F06292"/>
    <ellipse cx={24} cy={19} rx={2.2} ry={1.5} fill="#FFCDD2"/>
    <path d="M22 22Q23 24 24 23Q25 24 26 22" stroke="#BDBDBD" strokeWidth={1.3} fill="none"/>
    <path d="M28 19Q32 17 34 20" stroke="#BDBDBD" strokeWidth={1.8} strokeLinecap="round" fill="none"/>
  </W>,
};

export const biodiversityIcons: IconMap = {
  '🦇': (s) => <W size={s}>
    <rect x={15} y={21} width={18} height={25} rx={3.5} fill="url(#gBark)"/>
    <rect x={15} y={21} width={18} height={7} rx={3.5} fill="#6D4C41"/>
    {[0,1,2].map(i=><rect key={i} x={17+i*6} y={26} width={4} height={8} rx={1.2} fill="#5D4037"/>)}
    <rect x={13} y={17} width={22} height={5} rx={2.5} fill="#4E342E"/>
    <rect x={19} y={12} width={10} height={6} rx={3} fill="#5D4037"/>
    <path d="M24 7Q21 3 14 4Q12 10 18 13" fill="#6D4C41"/>
    <path d="M24 7Q27 3 34 4Q36 10 30 13" fill="#6D4C41"/>
    <ellipse cx={24} cy={7.5} rx={4} ry={3.5} fill="#5D4037"/>
    <circle cx={22} cy={7} r={1.5} fill="#FF6F00" opacity={0.85}/>
    <circle cx={26} cy={7} r={1.5} fill="#FF6F00" opacity={0.85}/>
    <path d="M22 9.5Q24 11 26 9.5" stroke="#4E342E" strokeWidth={1} fill="none"/>
  </W>,

'🐝': (s) => (
    <svg width={s} height={s} viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(1 1)">
	<g>
		<polygon fill="#FDCC00" points="17.286,81.286 364.714,81.286 364.714,8.143 17.286,8.143 		"/>
		<polygon fill="#FDCC00" points="364.714,81.286 492.714,81.286 492.714,8.143 364.714,8.143 		"/>
	</g>
	<g>
		<polygon fill="#FFE100" points="346.429,447 474.429,447 474.429,81.286 346.429,81.286 		"/>
		<polygon fill="#FFE100" points="35.571,501.857 90.429,501.857 90.429,447 35.571,447 		"/>
		<polygon fill="#FFE100" points="264.143,501.857 319,501.857 319,447 264.143,447 		"/>
		<polygon fill="#FFE100" points="419.571,501.857 474.429,501.857 474.429,447 419.571,447 		"/>
		<polygon fill="#FFE100" points="35.571,447 346.429,447 346.429,81.286 35.571,81.286 		"/>
	</g>
	<polygon fill="#FFFFFF" points="35.571,501.857 63,501.857 63,81.286 35.571,81.286 	"/>
	<polygon fill="#FFA800" points="447,501.857 474.429,501.857 474.429,81.286 447,81.286 	"/>
	<polygon fill="#FFFFFF" points="17.286,81.286 44.714,81.286 44.714,8.143 17.286,8.143 	"/>
	<g>
		<polygon fill="#FFA800" points="465.286,81.286 492.714,81.286 492.714,8.143 465.286,8.143 		"/>
		<polygon fill="#FFA800" points="191,337.286 163.571,319 163.571,291.571 191,273.286 218.429,291.571 218.429,319 		"/>
		<polygon fill="#FFA800" points="218.429,383 191,364.714 191,337.286 218.429,319 245.857,337.286 245.857,364.714 		"/>
		<polygon fill="#FFA800" points="163.571,383 136.143,364.714 136.143,337.286 163.571,319 191,337.286 191,364.714 		"/>
	</g>
	<path fill="#63D3FD" d="M236.714,209.286h-91.429c-15.543,0-27.429-11.886-27.429-27.429s11.886-27.429,27.429-27.429
		h91.429c15.543,0,27.429,11.886,27.429,27.429S252.257,209.286,236.714,209.286"/>
	<path fill="#3DB9F9" d="M236.714,154.429h-27.429c15.543,0,27.429,11.886,27.429,27.429s-11.886,27.429-27.429,27.429
		h27.429c15.543,0,27.429-11.886,27.429-27.429S252.257,154.429,236.714,154.429"/>
	<path d="M373.857,90.429H8.143V-1h365.714V90.429z M26.429,72.143h329.143V17.286H26.429V72.143z"/>
	<path d="M501.857,90.429H355.571V-1h146.286V90.429z M373.857,72.143h109.714V17.286H373.857V72.143z"/>
	<path d="M355.571,456.143H26.429v-384h329.143V456.143z M44.714,437.857h292.571V90.429H44.714V437.857z"/>
	<path d="M483.571,456.143H337.286v-384h146.286V456.143z M355.571,437.857h109.714V90.429H355.571V437.857z"/>
	<path d="M90.429,511H35.571c-5.486,0-9.143-3.657-9.143-9.143V447c0-5.486,3.657-9.143,9.143-9.143h54.857
		c5.486,0,9.143,3.657,9.143,9.143v54.857C99.571,507.343,95.914,511,90.429,511z M44.714,492.714h36.571v-36.571H44.714V492.714z"
		/>
	<path d="M319,511h-54.857c-5.486,0-9.143-3.657-9.143-9.143V447c0-5.486,3.657-9.143,9.143-9.143H319
		c5.486,0,9.143,3.657,9.143,9.143v54.857C328.143,507.343,324.486,511,319,511z M273.286,492.714h36.571v-36.571h-36.571V492.714z"
		/>
	<path d="M474.429,511h-54.857c-5.486,0-9.143-3.657-9.143-9.143V447c0-5.486,3.657-9.143,9.143-9.143h54.857
		c5.486,0,9.143,3.657,9.143,9.143v54.857C483.571,507.343,479.914,511,474.429,511z M428.714,492.714h36.571v-36.571h-36.571
		V492.714z"/>
	<path d="M474.429,127h-64c-5.486,0-9.143-3.657-9.143-9.143s3.657-9.143,9.143-9.143h64c5.486,0,9.143,3.657,9.143,9.143
		S479.914,127,474.429,127z"/>
	<path d="M474.429,163.571h-36.571c-5.486,0-9.143-3.657-9.143-9.143s3.657-9.143,9.143-9.143h36.571
		c5.486,0,9.143,3.657,9.143,9.143S479.914,163.571,474.429,163.571z"/>
	<path d="M474.429,200.143h-64c-5.486,0-9.143-3.657-9.143-9.143s3.657-9.143,9.143-9.143h64c5.486,0,9.143,3.657,9.143,9.143
		S479.914,200.143,474.429,200.143z"/>
	<path d="M474.429,236.714h-36.571c-5.486,0-9.143-3.657-9.143-9.143s3.657-9.143,9.143-9.143h36.571
		c5.486,0,9.143,3.657,9.143,9.143S479.914,236.714,474.429,236.714z"/>
	<path d="M474.429,273.286h-64c-5.486,0-9.143-3.657-9.143-9.143s3.657-9.143,9.143-9.143h64c5.486,0,9.143,3.657,9.143,9.143
		S479.914,273.286,474.429,273.286z"/>
	<path d="M474.429,309.857h-36.571c-5.486,0-9.143-3.657-9.143-9.143c0-5.486,3.657-9.143,9.143-9.143h36.571
		c5.486,0,9.143,3.657,9.143,9.143S479.914,309.857,474.429,309.857z"/>
	<path d="M474.429,346.429h-64c-5.486,0-9.143-3.657-9.143-9.143c0-5.486,3.657-9.143,9.143-9.143h64
		c5.486,0,9.143,3.657,9.143,9.143C483.571,342.771,479.914,346.429,474.429,346.429z"/>
	<path d="M474.429,419.571h-64c-5.486,0-9.143-3.657-9.143-9.143s3.657-9.143,9.143-9.143h64c5.486,0,9.143,3.657,9.143,9.143
		S479.914,419.571,474.429,419.571z"/>
	<path d="M474.429,383h-36.571c-5.486,0-9.143-3.657-9.143-9.143c0-5.486,3.657-9.143,9.143-9.143h36.571
		c5.486,0,9.143,3.657,9.143,9.143C483.571,379.343,479.914,383,474.429,383z"/>
	<path d="M236.714,218.429h-91.429c-20.114,0-36.571-16.457-36.571-36.571s16.457-36.571,36.571-36.571h91.429
		c20.114,0,36.571,16.457,36.571,36.571S256.829,218.429,236.714,218.429z M145.286,163.571c-10.057,0-18.286,8.229-18.286,18.286
		s8.229,18.286,18.286,18.286h91.429c10.057,0,18.286-8.229,18.286-18.286s-8.229-18.286-18.286-18.286H145.286z"/>
	<path d="M191,346.429c-1.829,0-3.657-0.914-5.486-1.829l-27.429-18.286c-1.829-1.829-3.657-4.571-3.657-7.314v-27.429
		c0-2.743,1.829-5.486,3.657-7.314l27.429-18.286c2.743-1.829,7.314-1.829,10.057,0L223,284.257
		c2.743,1.829,3.657,4.571,3.657,7.314V319c0,2.743-1.829,5.486-3.657,7.314L195.571,344.6
		C194.657,345.514,192.829,346.429,191,346.429z M172.714,314.429L191,326.314l18.286-11.886v-17.371L191,285.171l-18.286,11.886
		V314.429z"/>
	<path d="M218.429,392.143c-1.829,0-3.657-0.914-5.486-1.829l-27.429-18.286c-1.829-1.829-3.657-4.571-3.657-7.314v-27.429
		c0-2.743,1.829-5.486,3.657-7.314l27.429-18.286c2.743-1.829,7.314-1.829,10.057,0l27.429,18.286
		c2.743,1.829,3.657,4.571,3.657,7.314v27.429c0,2.743-1.829,5.486-3.657,7.314L223,390.314
		C222.086,391.229,220.257,392.143,218.429,392.143z M200.143,360.143l18.286,11.886l18.286-11.886v-17.371l-18.286-11.886
		l-18.286,11.886V360.143z"/>
	<path d="M163.571,392.143c-1.829,0-3.657-0.914-5.486-1.829l-27.429-18.286c-1.829-1.829-3.657-4.571-3.657-7.314v-27.429
		c0-2.743,1.829-5.486,3.657-7.314l27.429-18.286c2.743-1.829,7.314-1.829,10.057,0l27.429,18.286
		c2.743,1.829,3.657,4.571,3.657,7.314v27.429c0,2.743-1.829,5.486-3.657,7.314l-27.429,18.286
		C167.229,391.229,165.4,392.143,163.571,392.143z M145.286,360.143l18.286,11.886l18.286-11.886v-17.371l-18.286-11.886
		l-18.286,11.886V360.143z"/>
</g>
    </svg>
  ),

'🐦': (s) => (
    <svg width={s} height={s} viewBox="0 0 511.999 511.999" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polygon fill="#FFF476" points="384.698,345.519 127.303,345.519 127.303,131.607 256,14.086 384.698,131.607 "/>
<rect x="229.698" y="346.533" fill="#00D7DF" width="52.592" height="151.38"/>
<g>
	<path fill="#7BD36A" d="M450.977,497.911c0.744-3.569,1.14-7.265,1.14-11.055c0-29.77-24.134-53.904-53.904-53.904
		c-19.994,0-37.433,10.895-46.738,27.064c-6.94-4.576-15.248-7.247-24.181-7.247c-24.298,0-43.995,19.697-43.995,43.995
		c0,0.385,0.018,0.765,0.03,1.147L450.977,497.911L450.977,497.911z"/>
	<path fill="#7BD36A" d="M227.562,497.911c0.744-3.569,1.14-7.265,1.14-11.055c0-29.77-24.134-53.904-53.904-53.904
		c-19.994,0-37.433,10.895-46.738,27.064c-6.94-4.576-15.248-7.247-24.181-7.247c-24.298,0-43.995,19.697-43.995,43.995
		c0,0.385,0.018,0.765,0.03,1.147L227.562,497.911L227.562,497.911z"/>
</g>
<path d="M398.214,418.863c-19.749,0-38.398,8.676-51.182,23.266c-6.288-2.274-12.95-3.449-19.739-3.449
	c-11.354,0-21.947,3.287-30.906,8.941v-88.013h88.311c7.78,0,14.088-6.307,14.088-14.088V161.391l31.334,28.168
	c2.692,2.419,6.059,3.611,9.415,3.611c3.856,0,7.699-1.575,10.48-4.669c5.201-5.786,4.728-14.694-1.058-19.897L265.419,3.609
	c-0.179-0.161-0.368-0.301-0.552-0.451c-0.148-0.121-0.293-0.249-0.445-0.363c-0.193-0.145-0.396-0.272-0.595-0.404
	c-0.168-0.113-0.332-0.234-0.503-0.338c-0.194-0.118-0.396-0.218-0.593-0.327c-0.185-0.1-0.366-0.21-0.554-0.301
	c-0.2-0.097-0.406-0.178-0.609-0.265c-0.192-0.083-0.382-0.173-0.576-0.248c-0.211-0.08-0.428-0.142-0.642-0.211
	c-0.192-0.062-0.382-0.134-0.576-0.187c-0.23-0.063-0.462-0.108-0.695-0.159c-0.183-0.041-0.365-0.092-0.548-0.125
	c-0.275-0.051-0.554-0.079-0.83-0.113c-0.144-0.017-0.286-0.045-0.43-0.058c-0.844-0.076-1.693-0.076-2.539,0
	c-0.144,0.013-0.286,0.041-0.43,0.058c-0.278,0.034-0.555,0.063-0.83,0.113c-0.185,0.034-0.366,0.085-0.548,0.125
	c-0.232,0.052-0.465,0.096-0.695,0.159c-0.194,0.054-0.385,0.125-0.576,0.187c-0.214,0.069-0.431,0.131-0.642,0.211
	c-0.194,0.073-0.385,0.165-0.576,0.248c-0.203,0.087-0.41,0.168-0.609,0.265c-0.187,0.092-0.369,0.2-0.554,0.301
	c-0.199,0.108-0.399,0.209-0.593,0.327c-0.172,0.104-0.335,0.225-0.503,0.338c-0.199,0.134-0.402,0.261-0.595,0.404
	c-0.152,0.114-0.296,0.242-0.445,0.363c-0.185,0.149-0.373,0.29-0.552,0.451L63.041,168.604c-5.786,5.201-6.26,14.11-1.058,19.897
	c5.2,5.786,14.107,6.258,19.896,1.058l31.334-28.168v184.128c0,7.781,6.309,14.088,14.088,14.088h88.311v72.908
	c-11.375-8.566-25.511-13.652-40.816-13.652c-19.749,0-38.397,8.673-51.181,23.266c-6.286-2.274-12.95-3.449-19.739-3.449
	c-32.027,0-58.084,26.057-58.084,58.084c0,0.414,0.011,0.827,0.025,1.238l0.008,0.263c0.193,7.64,6.441,13.733,14.084,13.733h167.65
	c0.386,0,0.768-0.02,1.147-0.051c0.33,0.023,0.658,0.051,0.993,0.051h52.598c0.172,0,0.34-0.02,0.51-0.025
	c0.173,0.007,0.344,0.025,0.518,0.025h167.651c6.672,0,12.429-4.68,13.791-11.212c0.954-4.569,1.437-9.256,1.437-13.932
	C466.205,449.365,435.705,418.863,398.214,418.863z M141.391,137.821l114.61-104.655l114.61,104.655V331.43H141.391V137.821z
	 M76.918,483.822c4.834-10.028,15.103-16.965,26.96-16.965c5.864,0,11.544,1.702,16.426,4.921c3.245,2.139,7.227,2.84,11.006,1.947
	c3.781-0.896,7.022-3.314,8.96-6.681c7.102-12.339,20.332-20.003,34.528-20.003c20.934,0,38.147,16.238,39.701,36.782H76.918
	V483.822z M268.21,483.822h-24.421V360.619h24.421V483.822z M300.335,483.822c4.834-10.028,15.101-16.965,26.958-16.965
	c5.864,0,11.544,1.702,16.429,4.921c3.243,2.137,7.225,2.842,11.006,1.946c3.781-0.896,7.022-3.314,8.959-6.681
	c7.101-12.337,20.331-20.003,34.528-20.003c20.934,0,38.147,16.238,39.701,36.782L300.335,483.822L300.335,483.822z"/>
<circle fill="#00D7DF" cx="256.001" cy="173.245" r="52.709"/>
<path d="M256,240.04c-36.833,0-66.796-29.965-66.796-66.798s29.965-66.798,66.796-66.798s66.796,29.965,66.796,66.798
	S292.833,240.04,256,240.04z M256,134.623c-21.295,0-38.619,17.325-38.619,38.621s17.325,38.621,38.619,38.621
	s38.619-17.325,38.619-38.621S277.294,134.623,256,134.623z"/>
<path d="M270.088,296.446h-70.442c-7.78,0-14.088-6.307-14.088-14.088c0-7.781,6.309-14.088,14.088-14.088h70.442
	c7.78,0,14.088,6.307,14.088,14.088C284.177,290.138,277.869,296.446,270.088,296.446z"/>
<path d="M312.354,296.447c-0.916,0-1.847-0.099-2.747-0.282c-0.902-0.169-1.789-0.451-2.649-0.803
	c-0.847-0.352-1.662-0.789-2.423-1.296c-0.776-0.507-1.495-1.099-2.143-1.747c-2.62-2.62-4.128-6.255-4.128-9.961
	c0-0.916,0.085-1.846,0.266-2.747c0.182-0.902,0.465-1.789,0.817-2.649c0.352-0.845,0.775-1.662,1.282-2.423
	c0.521-0.775,1.113-1.493,1.761-2.141c0.648-0.648,1.367-1.24,2.143-1.761c0.761-0.507,1.577-0.93,2.423-1.282
	c0.859-0.352,1.747-0.634,2.649-0.803c1.817-0.366,3.677-0.38,5.495,0c0.902,0.169,1.789,0.451,2.633,0.803
	c0.859,0.352,1.677,0.775,2.437,1.282c0.775,0.521,1.493,1.113,2.141,1.761c0.649,0.648,1.241,1.367,1.747,2.141
	c0.507,0.761,0.944,1.578,1.296,2.423c0.352,0.859,0.634,1.747,0.803,2.649c0.183,0.902,0.282,1.832,0.282,2.747
	s-0.099,1.846-0.282,2.747c-0.169,0.902-0.451,1.789-0.803,2.635c-0.352,0.859-0.789,1.677-1.296,2.437
	c-0.506,0.775-1.098,1.493-1.747,2.141c-0.648,0.648-1.367,1.24-2.141,1.747c-0.761,0.507-1.578,0.944-2.437,1.296
	c-0.845,0.352-1.731,0.634-2.633,0.803C314.199,296.349,313.269,296.447,312.354,296.447z"/>
    </svg>
  ),

  '🌴': (s) => <W size={s}>
    <rect x={2} y={42} width={44} height={6} rx={3} fill="#5D4037"/>
    <ellipse cx={5} cy={34} rx={4.5} ry={8} fill="#1B5E20"/>
    <ellipse cx={5} cy={30} rx={3.5} ry={5.5} fill="#2E7D32"/>
    <circle cx={4} cy={30} r={2} fill="#E53935"/>
    <circle cx={6.5} cy={33} r={2} fill="#E53935"/>
    <ellipse cx={13} cy={31} rx={5.5} ry={9.5} fill="#2E7D32"/>
    <ellipse cx={13} cy={27} rx={4.5} ry={7} fill="#388E3C"/>
    <circle cx={11} cy={27} r={1.8} fill="#1A237E"/>
    <circle cx={14} cy={29} r={1.8} fill="#1A237E"/>
    <ellipse cx={22} cy={29} rx={6} ry={11} fill="#388E3C"/>
    <ellipse cx={22} cy={25} rx={5} ry={8} fill="#43A047"/>
    <circle cx={19} cy={25} r={2} fill="#E53935"/>
    <circle cx={23} cy={27} r={2} fill="#1A237E"/>
    <ellipse cx={31} cy={29} rx={6} ry={11} fill="#2E7D32"/>
    <ellipse cx={31} cy={25} rx={5} ry={8} fill="#388E3C"/>
    <circle cx={29} cy={24} r={2} fill="#1A237E"/>
    <circle cx={33} cy={26} r={2} fill="#E53935"/>
    <ellipse cx={40} cy={31} rx={5.5} ry={9.5} fill="#1B5E20"/>
    <ellipse cx={40} cy={27} rx={4.5} ry={7} fill="#2E7D32"/>
    <circle cx={38} cy={27} r={1.8} fill="#E53935"/>
    <circle cx={41} cy={29} r={1.8} fill="#1A237E"/>
    <rect x={2} y={34} width={44} height={8} rx={0} fill="#2E7D32" opacity={0.22}/>
  </W>,  '🐛': (s) => <W size={s}>
    <rect x={7} y={27} width={34} height={18} rx={4} fill="url(#gBark)"/>
    <rect x={7} y={27} width={34} height={7} rx={4} fill="url(#gBrown)"/>
    <rect x={10} y={32} width={8} height={11} rx={2.5} fill="#5D4037"/>
    <rect x={21} y={32} width={8} height={11} rx={2.5} fill="#5D4037"/>
    <rect x={30} y={32} width={8} height={11} rx={2.5} fill="#5D4037"/>
    <ellipse cx={14} cy={23} rx={6} ry={4.5} fill="#6D4C41"/>
    <ellipse cx={14} cy={23} rx={3.8} ry={3} fill="#5D4037"/>
    <ellipse cx={14} cy={23} rx={2} ry={1.5} fill="#4E342E"/>
    <ellipse cx={13.5} cy={22.5} rx={0.8} ry={0.6} fill="#3E2723"/>
    <ellipse cx={24} cy={21} rx={6} ry={4.5} fill="#5D4037"/>
    <ellipse cx={24} cy={21} rx={3.8} ry={3} fill="#4E342E"/>
    <ellipse cx={24} cy={21} rx={2} ry={1.5} fill="#3E2723"/>
    <ellipse cx={23.5} cy={20.5} rx={0.8} ry={0.6} fill="#3E2723"/>
    <ellipse cx={34} cy={23} rx={6} ry={4.5} fill="#6D4C41"/>
    <ellipse cx={34} cy={23} rx={3.8} ry={3} fill="#5D4037"/>
    <ellipse cx={34} cy={23} rx={2} ry={1.5} fill="#4E342E"/>
    <ellipse cx={18} cy={17} rx={6} ry={4.5} fill="#5D4037"/>
    <ellipse cx={18} cy={17} rx={3.8} ry={3} fill="#4E342E"/>
    <ellipse cx={18} cy={17} rx={2} ry={1.5} fill="#3E2723"/>
    <ellipse cx={30} cy={17} rx={6} ry={4.5} fill="#6D4C41"/>
    <ellipse cx={30} cy={17} rx={3.8} ry={3} fill="#5D4037"/>
    <ellipse cx={30} cy={17} rx={2} ry={1.5} fill="#4E342E"/>
    <ellipse cx={11} cy={11} rx={5} ry={4} fill="#6D4C41"/>
    <ellipse cx={11} cy={11} rx={3} ry={2.5} fill="#5D4037"/>
    <ellipse cx={24} cy={10} rx={5.5} ry={4} fill="#5D4037"/>
    <ellipse cx={24} cy={10} rx={3.5} ry={2.5} fill="#4E342E"/>
    <ellipse cx={37} cy={11} rx={5} ry={4} fill="#6D4C41"/>
    <ellipse cx={37} cy={11} rx={3} ry={2.5} fill="#5D4037"/>
  </W>,  '🌺': (s) => <W size={s}>
    <path d="M4,46 Q4,36 5,24" stroke="#558B2F" strokeWidth={1.8} fill="none" strokeLinecap="round"/>
    <path d="M10,46 Q9,36 10,28" stroke="#66BB6A" strokeWidth={1.8} fill="none" strokeLinecap="round"/>
    <path d="M17,46 Q17,34 18,24" stroke="#558B2F" strokeWidth={1.8} fill="none" strokeLinecap="round"/>
    <path d="M24,46 Q24,34 24,24" stroke="#7CB342" strokeWidth={1.8} fill="none" strokeLinecap="round"/>
    <path d="M31,46 Q30,34 31,28" stroke="#558B2F" strokeWidth={1.8} fill="none" strokeLinecap="round"/>
    <path d="M38,46 Q38,34 38,24" stroke="#66BB6A" strokeWidth={1.8} fill="none" strokeLinecap="round"/>
    <path d="M44,46 Q45,36 44,28" stroke="#558B2F" strokeWidth={1.8} fill="none" strokeLinecap="round"/>
    <ellipse cx={8} cy={18} rx={5.5} ry={3} fill="#F48FB1" transform="rotate(0)"/>
    <ellipse cx={8} cy={18} rx={5.5} ry={3} fill="#F48FB1" transform="rotate(72 8 18)"/>
    <ellipse cx={8} cy={18} rx={5.5} ry={3} fill="#F48FB1" transform="rotate(144 8 18)"/>
    <ellipse cx={8} cy={18} rx={5.5} ry={3} fill="#F48FB1" transform="rotate(216 8 18)"/>
    <ellipse cx={8} cy={18} rx={5.5} ry={3} fill="#F48FB1" transform="rotate(288 8 18)"/>
    <circle cx={8} cy={18} r={3.2} fill="#FDD835"/>
    <ellipse cx={20} cy={13} rx={6} ry={3} fill="#FFB74D" transform="rotate(0)"/>
    <ellipse cx={20} cy={13} rx={6} ry={3} fill="#FFB74D" transform="rotate(60 20 13)"/>
    <ellipse cx={20} cy={13} rx={6} ry={3} fill="#FFA000" transform="rotate(120 20 13)"/>
    <ellipse cx={20} cy={13} rx={6} ry={3} fill="#FFB74D" transform="rotate(180 20 13)"/>
    <ellipse cx={20} cy={13} rx={6} ry={3} fill="#FFA000" transform="rotate(240 20 13)"/>
    <ellipse cx={20} cy={13} rx={6} ry={3} fill="#FFB74D" transform="rotate(300 20 13)"/>
    <circle cx={20} cy={13} r={3.5} fill="#FF6F00"/>
    <ellipse cx={32} cy={16} rx={5.5} ry={3} fill="#80DEEA" transform="rotate(0)"/>
    <ellipse cx={32} cy={16} rx={5.5} ry={3} fill="#4DD0E1" transform="rotate(72 32 16)"/>
    <ellipse cx={32} cy={16} rx={5.5} ry={3} fill="#80DEEA" transform="rotate(144 32 16)"/>
    <ellipse cx={32} cy={16} rx={5.5} ry={3} fill="#4DD0E1" transform="rotate(216 32 16)"/>
    <ellipse cx={32} cy={16} rx={5.5} ry={3} fill="#80DEEA" transform="rotate(288 32 16)"/>
    <circle cx={32} cy={16} r={3.2} fill="#006064"/>
    <ellipse cx={43} cy={14} rx={5} ry={3} fill="#CE93D8" transform="rotate(0)"/>
    <ellipse cx={43} cy={14} rx={5} ry={3} fill="#AB47BC" transform="rotate(72 43 14)"/>
    <ellipse cx={43} cy={14} rx={5} ry={3} fill="#CE93D8" transform="rotate(144 43 14)"/>
    <ellipse cx={43} cy={14} rx={5} ry={3} fill="#AB47BC" transform="rotate(216 43 14)"/>
    <ellipse cx={43} cy={14} rx={5} ry={3} fill="#CE93D8" transform="rotate(288 43 14)"/>
    <circle cx={43} cy={14} r={3} fill="#7B1FA2"/>
    <path d="M23,30 Q18,25 15,26 Q18,32 23,30Z" fill="#FF6F00" opacity={0.9}/>
    <path d="M23,30 Q28,25 31,26 Q28,32 23,30Z" fill="#FF6F00" opacity={0.9}/>
    <ellipse cx={23} cy={30} rx={1} ry={3} fill="#333"/>
    <rect x={2} y={44} width={44} height={4} rx={2} fill="url(#gSoil)" opacity={0.45}/>
  </W>,  '🌼': (s) => <W size={s}>
    <path d="M5,46 Q5,36 5,30" stroke="#558B2F" strokeWidth={1.8} fill="none" strokeLinecap="round"/>
    <path d="M13,46 Q12,36 13,30" stroke="#66BB6A" strokeWidth={1.8} fill="none" strokeLinecap="round"/>
    <path d="M22,46 Q22,34 22,26" stroke="#558B2F" strokeWidth={1.8} fill="none" strokeLinecap="round"/>
    <path d="M31,46 Q31,34 31,26" stroke="#66BB6A" strokeWidth={1.8} fill="none" strokeLinecap="round"/>
    <path d="M39,46 Q38,34 39,30" stroke="#558B2F" strokeWidth={1.8} fill="none" strokeLinecap="round"/>
    <ellipse cx={9} cy={22} rx={8} ry={3.5} fill="white" transform="rotate(0)"/>
    <ellipse cx={9} cy={22} rx={8} ry={3.5} fill="white" transform="rotate(25.7 9 22)"/>
    <ellipse cx={9} cy={22} rx={8} ry={3.5} fill="white" transform="rotate(51.4 9 22)"/>
    <ellipse cx={9} cy={22} rx={8} ry={3.5} fill="white" transform="rotate(77.1 9 22)"/>
    <ellipse cx={9} cy={22} rx={8} ry={3.5} fill="white" transform="rotate(102.8 9 22)"/>
    <ellipse cx={9} cy={22} rx={8} ry={3.5} fill="white" transform="rotate(128.5 9 22)"/>
    <ellipse cx={9} cy={22} rx={8} ry={3.5} fill="white" transform="rotate(154.2 9 22)"/>
    <circle cx={9} cy={22} r={5.5} fill="#FDD835"/>
    <circle cx={9} cy={22} r={4} fill="#F9A825"/>
    <ellipse cx={26} cy={20} rx={12} ry={5} fill="#FFD54F" transform="rotate(0)"/>
    <ellipse cx={26} cy={20} rx={12} ry={5} fill="#FFCA28" transform="rotate(18 26 20)"/>
    <ellipse cx={26} cy={20} rx={12} ry={5} fill="#FFD54F" transform="rotate(36 26 20)"/>
    <ellipse cx={26} cy={20} rx={12} ry={5} fill="#FFCA28" transform="rotate(54 26 20)"/>
    <ellipse cx={26} cy={20} rx={12} ry={5} fill="#FFD54F" transform="rotate(72 26 20)"/>
    <ellipse cx={26} cy={20} rx={12} ry={5} fill="#FFCA28" transform="rotate(90 26 20)"/>
    <ellipse cx={26} cy={20} rx={12} ry={5} fill="#FFD54F" transform="rotate(108 26 20)"/>
    <ellipse cx={26} cy={20} rx={12} ry={5} fill="#FFCA28" transform="rotate(126 26 20)"/>
    <ellipse cx={26} cy={20} rx={12} ry={5} fill="#FFD54F" transform="rotate(144 26 20)"/>
    <ellipse cx={26} cy={20} rx={12} ry={5} fill="#FFCA28" transform="rotate(162 26 20)"/>
    <circle cx={26} cy={20} r={9} fill="#4E2D00"/>
    <circle cx={26} cy={20} r={7} fill="#5D3A00"/>
    <circle cx={23} cy={18} r={0.9} fill="#3E2000"/>
    <circle cx={26} cy={17} r={0.9} fill="#3E2000"/>
    <circle cx={29} cy={18} r={0.9} fill="#3E2000"/>
    <circle cx={23} cy={22} r={0.9} fill="#3E2000"/>
    <circle cx={26} cy={23} r={0.9} fill="#3E2000"/>
    <circle cx={29} cy={22} r={0.9} fill="#3E2000"/>
    <ellipse cx={41} cy={22} rx={7} ry={3} fill="#F48FB1" transform="rotate(0)"/>
    <ellipse cx={41} cy={22} rx={7} ry={3} fill="#EC407A" transform="rotate(45 41 22)"/>
    <ellipse cx={41} cy={22} rx={7} ry={3} fill="#F48FB1" transform="rotate(90 41 22)"/>
    <ellipse cx={41} cy={22} rx={7} ry={3} fill="#EC407A" transform="rotate(135 41 22)"/>
    <circle cx={41} cy={22} r={4} fill="#FDD835"/>
    <ellipse cx={20} cy={12} rx={5} ry={3} fill="#FDD835"/>
    <path d="M17,12 Q17,8 19,6" stroke="#E0F2F1" strokeWidth={2} fill="none"/>
    <ellipse cx={19} cy={5} rx={4} ry={2.5} fill="#E0F2F1" opacity={0.65}/>
  </W>,  '🪷': (s) => <W size={s}>
    <ellipse cx={24} cy={36} rx={22} ry={12} fill="#0D47A1" opacity={0.38}/>
    <ellipse cx={24} cy={36} rx={22} ry={12} fill="url(#gWater)" opacity={0.28}/>
    <path d="M4,36 Q24,31 44,36 Q24,41 4,36Z" fill="#0D47A1" opacity={0.2}/>
    <circle cx={15} cy={40} r={7} fill="#2E7D32" opacity={0.85}/>
    <path d="M15,40 L15,33" stroke="#1B5E20" strokeWidth={1.2}/>
    <circle cx={36} cy={38} r={7} fill="#388E3C" opacity={0.85}/>
    <path d="M36,38 L36,31" stroke="#2E7D32" strokeWidth={1.2}/>
    <path d="M24,28 Q21,23 22,18 Q24,21 24,28Z" fill="#F06292"/>
    <path d="M24,28 Q27,23 26,18 Q24,21 24,28Z" fill="#E91E63"/>
    <path d="M24,28 Q18,25 18,21 Q21,23 24,28Z" fill="#F48FB1"/>
    <path d="M24,28 Q30,25 30,21 Q27,23 24,28Z" fill="#F06292"/>
    <path d="M24,28 Q20,30 19,34 Q22,31 24,28Z" fill="#EC407A"/>
    <circle cx={24} cy={27} r={3.8} fill="#FDD835"/>
    <ellipse cx={38} cy={24} rx={3.8} ry={2} fill="#80DEEA"/>
    <path d="M38,24 Q33,21 30,22" stroke="#B2EBF2" strokeWidth={1.5} fill="none"/>
    <path d="M38,24 Q43,21 46,22" stroke="#B2EBF2" strokeWidth={1.5} fill="none"/>
    <path d="M38,24 Q33,27 30,26" stroke="#B2EBF2" strokeWidth={1.5} fill="none"/>
    <path d="M38,24 Q43,27 46,26" stroke="#B2EBF2" strokeWidth={1.5} fill="none"/>
    <circle cx={36} cy={24} r={2} fill="#006064"/>
    <path d="M6,42 Q6,24 6,24" stroke="#8BC34A" strokeWidth={2.5} strokeLinecap="round" fill="none"/>
    <ellipse cx={6} cy={24} rx={2} ry={4} fill="#8D6E63"/>
    <path d="M10,44 Q10,24 10,24" stroke="#7CB342" strokeWidth={2.5} strokeLinecap="round" fill="none"/>
    <ellipse cx={10} cy={24} rx={2} ry={4.5} fill="#6D4C41"/>
    <path d="M41,42 Q41,24 41,24" stroke="#8BC34A" strokeWidth={2.5} strokeLinecap="round" fill="none"/>
    <ellipse cx={41} cy={24} rx={2} ry={4} fill="#8D6E63"/>
  </W>,
};
