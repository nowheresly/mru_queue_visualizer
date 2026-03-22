import React, { useEffect, useRef } from 'react';

export default function CanvasVisualizer({ buckets, activeNode }) {
  const canvasRef = useRef(null);
  
  // Keep track of all nodes and their current pixel positions for animation
  const nodesRef = useRef(new Map()); // id -> { id, val, x, y, targetX, targetY }
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Calculate target positions based on the buckets
    const startX = 30;
    const startY = 30;
    const nodeSize = 40;
    const gapX = 10;
    const gapY = 20;
    
    // Update target positions
    const currentTargets = new Set();
    buckets.forEach((bucket, row) => {
      bucket.forEach((val, col) => {
        const id = val; // Assuming values are unique 1..n
        currentTargets.add(id);
        
        const tx = startX + col * (nodeSize + gapX);
        const ty = startY + row * (nodeSize + gapY);
        
        if (!nodesRef.current.has(id)) {
          // If new node, start it at its target
          nodesRef.current.set(id, { id, val, x: tx, y: ty, targetX: tx, targetY: ty });
        } else {
          // Update target
          const node = nodesRef.current.get(id);
          node.targetX = tx;
          node.targetY = ty;
        }
      });
    });
    
    // If a node was removed (edge case), remove from ref
    for (const [id] of nodesRef.current.entries()) {
      if (!currentTargets.has(id)) {
        nodesRef.current.delete(id);
      }
    }
    
    let animationFrameId;
    
    const render = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Interpolate and draw
      let isAnimating = false;
      
      // Draw bucket containers roughly
      ctx.strokeStyle = '#ccc';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      buckets.forEach((bucket, row) => {
        // Just draw a row indicator
        ctx.strokeRect(startX - 10, startY + row * (nodeSize + gapY) - 5, 
                       Math.max(1, bucket.length) * (nodeSize + gapX), nodeSize + 10);
      });
      ctx.setLineDash([]);
      
      nodesRef.current.forEach(node => {
        // Interpolate
        const dx = node.targetX - node.x;
        const dy = node.targetY - node.y;
        
        if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
          node.x += dx * 0.15; // Smooth easing
          node.y += dy * 0.15;
          isAnimating = true;
        } else {
          node.x = node.targetX;
          node.y = node.targetY;
        }
        
        // Draw physical node
        ctx.fillStyle = (node.val === activeNode) ? '#facc15' : '#3b82f6';
        if (node.val === activeNode && isAnimating) {
           // Highlight differently moving node
           ctx.fillStyle = '#4ade80'; 
        }
        
        ctx.fillRect(node.x, node.y, nodeSize, nodeSize);
        
        // Draw value
        ctx.fillStyle = 'white';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(node.val, node.x + nodeSize/2, node.y + nodeSize/2);
        
        // Outline
        ctx.strokeStyle = '#1e3a8a';
        ctx.strokeRect(node.x, node.y, nodeSize, nodeSize);
      });
      
      animationFrameId = requestAnimationFrame(render);
    };
    
    render();
    
    return () => cancelAnimationFrame(animationFrameId);
  }, [buckets, activeNode]); 
  
  return (
    <div style={{ width: '100%', height: '100%', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <canvas 
        ref={canvasRef} 
        width={800} 
        height={600} 
        style={{ border: 'none', background: '#fafafa', width: '100%', height: '100%' }}
      />
    </div>
  );
}
