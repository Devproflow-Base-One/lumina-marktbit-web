'use client';

import { useState, useEffect, useRef } from 'react';

export default function PapanKebenaran() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);
  const [lastFetch, setLastFetch] = useState<string>('');
  const errorCount = useRef(0);

  useEffect(() => {
    const fetchSignals = async () => {
      try {
        const res = await fetch('/api/signals?t=' + Date.now(), { cache: 'no-store' });
        if (!res.ok) {
          console.warn('⚠️ /api/signals returned status:', res.status);
          return;
        }
        const text = await res.text();
        try {
          const json = JSON.parse(text);
          if (json && json.signals) {
            setData(json);
            setLastFetch(new Date().toLocaleTimeString());
            errorCount.current = 0;
          }
        } catch {
          console.warn('⚠️ /api/signals returned non-JSON. First 80 chars:', text.slice(0, 80));
        }
      } catch (err) {
        console.error("Gagal nyedot sinyal:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSignals();
    const interval = setInterval(fetchSignals, 3000); 
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div style={{color: '#eab308', textAlign: 'center', padding: '50px', fontFamily: 'monospace'}}>Menghubungkan ke Lumina Overmind...</div>;
  if (!data) return <div style={{color: '#ef4444', textAlign: 'center', padding: '50px', fontFamily: 'monospace'}}>Radar Offline.</div>;

  const signals = data.signals || [];
  const mintedTime = data.minted_at ? new Date(data.minted_at).toLocaleTimeString() : '—';
  const safeNum = (v: any, fallback: number = 0): number => {
    const n = Number(v);
    return isNaN(n) ? fallback : n;
  };
  const safeFixed = (v: any, digits: number = 2): string => {
    const n = Number(v);
    return isNaN(n) ? '—' : n.toFixed(digits);
  };

  return (
    <div style={{maxWidth: '1200px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif', backgroundColor: '#000', color: '#fff'}}>
      
      {/* HEADER */}
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid #27272a', paddingBottom: '14px', marginBottom: '18px'}}>
        <div style={{flexGrow: 1}}>
          <h2 style={{fontSize: '32px', fontWeight: 900, margin: 0, letterSpacing: '-0.025em'}}>MARKET<span style={{color: '#eab308'}}>BIT</span> RADAR</h2>
          <p style={{color: '#a1a1aa', fontSize: '14px', fontFamily: 'monospace', margin: '4px 0 0 0'}}>
            Status: {data.engine_status || '—'} | Terakhir Update: {mintedTime} | Poll: {lastFetch || '—'}
          </p>
        </div>
        <div style={{backgroundColor: 'rgba(234,179,8,0.1)', color: '#eab308', border: '1px solid rgba(234,179,8,0.2)', padding: '6px 14px', borderRadius: '9999px', fontSize: '12px', fontWeight: 'bold'}}>
          {signals.length} Koin Terpantau
        </div>
      </div>

      {/* GRID CONTAINER */}
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px'}}>
        {signals.map((sig: any, idx: number) => {
          const ind = sig.indicators || {};
          const rsi = safeNum(ind.rsi);
          const macdHist = ind.macd ? safeNum(ind.macd.histogram) : 0;
          const price = safeNum(sig.currentPrice || sig.price);

          return (
          <div key={sig.id || idx} style={{backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'column'}}>
            
            {/* KARTU ATAS */}
            <div style={{padding: '16px', borderBottom: '1px solid #27272a'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px'}}>
                <div>
                  <h3 style={{fontSize: '18px', fontWeight: 'bold', margin: 0}}>{sig.symbol || '???'} <span style={{color: '#71717a', fontSize: '12px'}}>/ USDT</span></h3>
                  <p style={{color: '#a1a1aa', fontSize: '13px', margin: '4px 0 0 0'}}>{sig.name || sig.symbol || 'Unknown'}</p>
                </div>
                <div style={{
                  padding: '6px 12px', borderRadius: '6px', fontSize: '13px', fontWeight: 'bold',
                  backgroundColor: (sig.type || '').includes('BUY') ? 'rgba(34,197,94,0.2)' : (sig.type || '').includes('SELL') ? 'rgba(239,68,68,0.2)' : 'rgba(113,113,122,0.2)',
                  color: (sig.type || '').includes('BUY') ? '#4ade80' : (sig.type || '').includes('SELL') ? '#f87171' : '#d4d4d8'
                }}>
                  {sig.type || 'NEUTRAL'}
                </div>
              </div>
              <div style={{fontFamily: 'monospace', fontSize: '24px', fontWeight: 'bold', color: '#fff', letterSpacing: '-0.02em'}}>
                ${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
              </div>
            </div>

            {/* INDIKATOR */}
            <div style={{padding: '14px 16px', backgroundColor: 'rgba(24,24,27,0.5)', display: 'flex', justifyContent: 'space-between', fontSize: '13px', borderBottom: '1px solid #27272a'}}>
              <div>
                <span style={{color: '#71717a', display: 'block', fontSize: '13px', marginBottom: '4px'}}>RSI (14)</span>
                <span style={{fontFamily: 'monospace', fontWeight: 'bold', color: rsi > 70 ? '#f87171' : rsi < 30 ? '#4ade80' : '#e4e4e7'}}>
                  {safeFixed(rsi)}
                </span>
              </div>
              <div>
                <span style={{color: '#71717a', display: 'block', fontSize: '13px', marginBottom: '4px'}}>MACD Hist</span>
                <span style={{fontFamily: 'monospace', fontWeight: 'bold', color: macdHist > 0 ? '#4ade80' : '#f87171'}}>
                  {safeFixed(macdHist)}
                </span>
              </div>
              <div>
                <span style={{color: '#71717a', display: 'block', fontSize: '13px', marginBottom: '4px'}}>Kategori</span>
                <span style={{fontFamily: 'monospace', color: '#d4d4d8', textTransform: 'uppercase'}}>{sig.category || 'top'}</span>
              </div>
            </div>

            {/* PREMIUM TRAP LAYER */}
            <div style={{padding: '16px', backgroundColor: '#09090b', position: 'relative', flexGrow: 1}}>
              
              {!isPremium && (
                <div style={{
                  position: 'absolute', inset: 0, zIndex: 10, 
                  backgroundColor: 'rgba(9,9,11,0.85)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px'
                }}>
                  <span style={{color: '#d4a017', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', textShadow: '0 0 6px rgba(212,160,23,0.3), 0 0 12px rgba(212,160,23,0.15)'}}>🔒 Layer 3-5 Terkunci</span>
                  <button className="blink-lock" onClick={() => alert("Redirect ke Stripe Checkout $29/mo")} style={{
                    backgroundColor: '#caac3e', color: '#000', border: 'none', fontSize: '12px', fontWeight: 'bold',
                    padding: '8px 18px', borderRadius: '9999px', cursor: 'pointer',
                    boxShadow: '0 0 10px rgba(202,172,62,0.3), 0 0 20px rgba(202,172,62,0.1)'
                  }}>
                    Unlock Probability & Risk
                  </button>
                </div>
              )}

              <div style={{opacity: 0.2, filter: 'blur(2px)', userSelect: 'none'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px'}}>
                  <span style={{color: '#a1a1aa'}}>AI Probability Score:</span>
                  <span style={{color: '#fff', fontFamily: 'monospace'}}>{safeNum(sig.confidence)}% Win Rate</span>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginTop: '14px'}}>
                   <span style={{color: '#a1a1aa'}}>Bot risk Profile:</span>
                   <span style={{color: '#f87171', fontWeight: 'bold', fontSize: '13px'}}>{sig.riskLevel || 'MEDIUM'}</span>
                </div>
              </div>
            </div>

          </div>
          );
        })}
      </div>
    </div>
  );
}