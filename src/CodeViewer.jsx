import React from 'react';

const javaCode = `class MRUQueue {
    List<List<Integer>> l = new ArrayList<>();
    int buck;

    public MRUQueue(int n) {
        buck = (int) Math.sqrt(n);
        List<Integer> cur = new ArrayList<>();
        l.add(cur);
        for (int i = 1; i <= n; ++i) {
            cur.add(i);
            if (cur.size() == buck) {
                cur = new ArrayList<>();
                l.add(cur);
            }
        }
    }

    public int fetch(int k) {
        k = k - 1;
        int buc = buck;
        // List<List<Integer>> list = l;
        List<Integer> lastBucket = l.get(l.size() - 1);

        // find kth elem
        int mod = k / buc;
        int remain = k % buc;

        List<Integer> bucket = l.get(mod);
        int val = bucket.get(remain);

        bucket.remove(remain);
        lastBucket.add(val);
        for (int i = mod + 1; i < l.size(); i++) {
            List<Integer> next = l.get(i);
            if (next.isEmpty()) {
                break;
            }
            int first = next.remove(0);
            bucket.add(first);
            bucket = next;
        }

        return val;
    }
}

/**
 * Your MRUQueue object will be instantiated and called as such:
 * MRUQueue obj = new MRUQueue(n);
 * int param_1 = obj.fetch(k);
 */`;

export default function CodeViewer({ activeLine }) {
  const lines = javaCode.split('\n');
  return (
    <div style={{ fontFamily: 'monospace', whiteSpace: 'pre', overflowY: 'auto', background: '#282c34', color: '#abb2bf', padding: '16px', borderRadius: '8px', height: '100%', fontSize: '14px' }}>
      {lines.map((line, idx) => {
        const lineNum = idx + 1;
        const isActive = lineNum === activeLine;
        return (
          <div key={lineNum} style={{ 
            backgroundColor: isActive ? 'rgba(97, 175, 239, 0.3)' : 'transparent',
            borderLeft: isActive ? '4px solid #61afef' : '4px solid transparent',
            paddingLeft: '8px',
            lineHeight: '1.5',
            display: 'flex'
          }}>
            <span style={{ color: '#5c6370', minWidth: '30px', userSelect: 'none', marginRight: '16px', textAlign: 'right' }}>
              {lineNum}
            </span>
            <span>{line}</span>
          </div>
        );
      })}
    </div>
  );
}
