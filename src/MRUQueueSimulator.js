export class MRUQueueSimulator {
  constructor(n) {
    this.n = n;
    this.buck = Math.floor(Math.sqrt(n));
    this.buckets = [];
    
    let cur = [];
    this.buckets.push(cur);
    for (let i = 1; i <= n; ++i) {
      cur.push(i);
      if (cur.length === this.buck) {
        cur = [];
        this.buckets.push(cur);
      }
    }
  }

  fetch(k) {
    const steps = [];
    
    // Helper to record the snapshot of the array and the currently active code line
    const capture = (line, description, activeNode = null) => {
      steps.push({
        line,
        description,
        activeNode,
        state: this.buckets.map(b => [...b]) // deep clone buckets
      });
    };

    k = k - 1;
    let buc = this.buck;
    let lastBucket = this.buckets[this.buckets.length - 1];

    capture(24, "Calculate mod and remain to locate the k-th element");
    
    let mod = Math.floor(k / buc);
    let remain = k % buc;

    let bucket = this.buckets[mod];
    let val = bucket[remain];
    capture(28, `Target element ${val} found at bucket[${mod}][${remain}]`, val);

    bucket.splice(remain, 1);
    capture(30, `Extracted ${val} from its bucket`, val);

    lastBucket.push(val);
    capture(31, `Added ${val} to the end of the last bucket`, val);

    for (let i = mod + 1; i < this.buckets.length; i++) {
        let next = this.buckets[i];
        if (next.length === 0) {
            capture(35, "Next bucket is empty, breaking the loop");
            break;
        }
        let first = next.shift(); // remove(0)
        capture(37, `Removed the first element (${first}) from bucket ${i}`, first);
        
        bucket.push(first);
        capture(38, `Appended ${first} to bucket ${i - 1} to maintain size`, first);
        
        bucket = next;
        capture(39, `Advanced current bucket pointer to bucket ${i}`);
    }

    capture(42, `Returned ${val}`, val);
    
    return { val, steps };
  }
}
