import { Suspense } from 'react';
import SuccessContent from './SuccessContent';

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <main style={{background:'#060f0a',minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center'}}>
        <div style={{color:'#00ff82',fontFamily:"'Courier New',monospace",fontSize:14}}>Loading...</div>
      </main>
    }>
      <SuccessContent />
    </Suspense>
  );
}
