import React, { useState, useEffect, useCallback } from 'react';
import { MRUQueueSimulator } from './MRUQueueSimulator';
import CanvasVisualizer from './CanvasVisualizer';
import CodeViewer from './CodeViewer';
import { Play, Pause, SkipForward, SkipBack, RotateCcw } from 'lucide-react';

export default function App() {
  const [n, setN] = useState(16);
  const [k, setK] = useState(4);
  const [simulator, setSimulator] = useState(null);
  const [buckets, setBuckets] = useState([]);
  
  const [steps, setSteps] = useState([]);
  const [stepIndex, setStepIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speedMs, setSpeedMs] = useState(800);
  
  // Stats
  const [activeLine, setActiveLine] = useState(-1);
  const [activeNode, setActiveNode] = useState(null);
  const [stepDesc, setStepDesc] = useState('Ready.');

  const initQueue = useCallback((size) => {
    const sim = new MRUQueueSimulator(size);
    setSimulator(sim);
    setBuckets(sim.buckets.map(b => [...b]));
    setSteps([]);
    setStepIndex(-1);
    setIsPlaying(false);
    setActiveLine(-1);
    setActiveNode(null);
    setStepDesc(`Initialized MRUQueue with ${size} elements.`);
  }, []);

  useEffect(() => {
    initQueue(n);
  }, []); // on mount

  const handleFetch = () => {
    if (!simulator) return;
    if (k < 1 || k > n) {
      alert(`k must be between 1 and ${n}`);
      return;
    }
    const { val, steps: newSteps } = simulator.fetch(k);
    setSteps(newSteps);
    setStepIndex(0);
    setIsPlaying(true);
  };
  
  const applyStep = (index) => {
    if (index >= 0 && index < steps.length) {
      const step = steps[index];
      setBuckets(step.state);
      setActiveLine(step.line);
      setActiveNode(step.activeNode);
      setStepDesc(step.description);
    } else if (index === steps.length) {
      setIsPlaying(false);
      setStepDesc('Fetch complete.');
      setActiveLine(-1);
      setActiveNode(null);
    }
  };

  useEffect(() => {
    applyStep(stepIndex);
  }, [stepIndex, steps]);

  useEffect(() => {
    let timer;
    if (isPlaying && stepIndex < steps.length) {
      timer = setTimeout(() => {
        setStepIndex(prev => prev + 1);
      }, speedMs);
    } else if (isPlaying && stepIndex >= steps.length) {
      setIsPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, stepIndex, steps.length, speedMs]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#f3f4f6', fontFamily: 'system-ui, sans-serif' }}>
      {/* Header bar */}
      <div style={{ padding: '16px 24px', backgroundColor: 'white', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0, color: '#111827' }}>MRU Queue Visualizer</h1>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div>
            <label style={{ marginRight: '8px', fontSize: '14px', fontWeight: 500 }}>Size (N):</label>
            <input type="number" value={n} onChange={e => setN(Number(e.target.value))} style={{ width: '60px', padding: '4px', border: '1px solid #d1d5db', borderRadius: '4px' }} />
            <button onClick={() => initQueue(n)} style={{ marginLeft: '8px', padding: '4px 12px', background: '#e5e7eb', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Reset</button>
          </div>
          <div style={{ width: '1px', height: '24px', background: '#d1d5db' }}></div>
          <div>
            <label style={{ marginRight: '8px', fontSize: '14px', fontWeight: 500 }}>Fetch (k):</label>
            <input type="number" value={k} onChange={e => setK(Number(e.target.value))} style={{ width: '60px', padding: '4px', border: '1px solid #d1d5db', borderRadius: '4px' }} />
            <button onClick={handleFetch} style={{ marginLeft: '8px', padding: '4px 12px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 500 }}>Fetch!</button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div style={{ display: 'flex', flex: 1, padding: '24px', gap: '24px', overflow: 'hidden' }}>
        {/* Left pane: Canvas */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px', minWidth: 0 }}>
          <div style={{ flex: 1, background: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
            <CanvasVisualizer buckets={buckets} activeNode={activeNode} />
          </div>
          
          {/* Controls */}
          <div style={{ background: 'white', padding: '16px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ fontSize: '15px', fontWeight: 500, color: '#374151', minHeight: '24px' }}>
              Status: <span style={{ color: '#2563eb' }}>{stepDesc}</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => { setIsPlaying(false); setStepIndex(-1); }} disabled={steps.length === 0} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #e5e7eb', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Reset Animation"><RotateCcw size={18} /></button>
                <button onClick={() => { setIsPlaying(false); setStepIndex(Math.max(0, stepIndex - 1)); }} disabled={steps.length === 0 || stepIndex <= 0} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #e5e7eb', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Previous Step"><SkipBack size={18} /></button>
                <button onClick={() => setIsPlaying(!isPlaying)} disabled={steps.length === 0 || stepIndex >= steps.length} style={{ padding: '8px 16px', borderRadius: '4px', border: 'none', background: '#3b82f6', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 500 }}>
                  {isPlaying ? <><Pause size={18}/> Pause</> : <><Play size={18}/> Play</>}
                </button>
                <button onClick={() => { setIsPlaying(false); setStepIndex(Math.min(steps.length, stepIndex + 1)); }} disabled={steps.length === 0 || stepIndex >= steps.length} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #e5e7eb', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Next Step"><SkipForward size={18} /></button>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <label style={{ fontSize: '13px', color: '#6b7280' }}>Speed</label>
                <input type="range" min="100" max="2000" step="100" value={2100 - speedMs} onChange={e => setSpeedMs(2100 - Number(e.target.value))} style={{ width: '100px' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Right pane: Code */}
        <div style={{ width: '450px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 1, borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
             <CodeViewer activeLine={activeLine} />
          </div>
        </div>
      </div>
    </div>
  );
}
