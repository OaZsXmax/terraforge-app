'use client';
import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const t = setInterval(() => {
      setCountdown(n => {
        if (n <= 1) { clearInterval(t); router.push('/'); }
        return n - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [router]);

  return (
    <main style={{
      background:'#060f0a',minHeight:'100vh',
      display:'flex',alignItems:'center',justifyContent:'center',
      padding:24,fontFamily:"'Courier New', monospace",
    }}>
      <div style={{
        maxWidth:480,width:'100%',textAlign:'center',
        background:'linear-gradient(160deg,#0d2218 0%,#081a10 100%)',
        border:'1px solid rgba(0,255,130,0.18)',
        borderRadius:28,padding:'56px 40px',
        boxShadow:'0 40px 120px rgba(0,0,0,0.6)',
      }}>
        <div style={{
          width:72,height:72,borderRadius:'50%',
          background:'rgba(0,255,130,0.1)',
          border:'2px solid rgba(0,255,130,0.3)',
          display:'flex',alignItems:'center',justifyContent:'center',
          margin:'0 auto 28px',fontSize:32,
        }}>✓</div>
        <div style={{fontSize:10,fontWeight:700,letterSpacing:'.2em',color:'rgba(0,255,130,0.6)',textTransform:'uppercase',marginBottom:16}}>
          Payment confirmed
        </div>
        <h1 style={{fontSize:32,fontWeight:700,color:'#e8f5ee',margin:'0 0 12px',letterSpacing:'-.02em',fontFamily:"'Georgia', serif"}}>
          Welcome to Pro
        </h1>
        <p style={{fontSize:15,color:'rgba(200,230,212,0.55)',margin:'0 0 40px',lineHeight:1.7}}>
          Your TerraForge Pro subscription is now active. All features are unlocked.
        </p>
        <button
          onClick={() => router.push('/')}
          style={{
            background:'linear-gradient(135deg,#00e87a 0%,#00c45a 100%)',
            border:'none',borderRadius:14,color:'#051a0e',fontSize:15,fontWeight:800,
            padding:'14px 32px',cursor:'pointer',letterSpacing:'.04em',width:'100%',
            boxShadow:'0 4px 24px rgba(0,232,122,0.3)',
          }}
        >
          Open TerraForge →
        </button>
        <p style={{marginTop:18,fontSize:11,color:'rgba(200,230,212,0.2)',letterSpacing:'.06em'}}>
          Redirecting in {countdown}s
        </p>
      </div>
    </main>
  );
}
