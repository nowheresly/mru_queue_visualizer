# MRUQueue Visualizer

**[🌐 View the Live Demo!](https://nowheresly.github.io/mru_queue_visualizer/)**

This project provides an interactive, visually stunning demonstration of a custom **Most Recently Used (MRU) Queue** implemented using **Square Root Decomposition** (similar to the logic in [LeetCode 1756: Design Most Recently Used Queue](https://leetcode.com/problems/design-most-recently-used-queue/description/)).

It features a split-pane layout to maximize educational value:
- **Left Pane:** A smooth **HTML5 Canvas** engine that breaks down the cascading array shifts frame-by-frame. Nodes physically separate and glide to their new indices.
- **Right Pane:** An interactive **Java Code Viewer** that sequentially tracks and highlights the executing `MRUQueue.java` lines alongside the canvas animations.

## How the Algorithm Works
The MRU Queue splits its underlying array into `sqrt(N)` isolated buckets to achieve a highly optimized $O(\sqrt{N})$ time complexity for the `fetch(k)` operation. When an element is fetched:
1. It is extracted from its current bucket.
2. Because removing it breaks the uniform bucket length, the algorithm sequentially shifts the first element of every *subsequent* bucket directly into the end of the *previous* bucket.
3. The fetched element is finally appended to the very end of the last bucket.

The visualizer parses this trajectory step-by-step to animate this complex cascade seamlessly!

## Technologies Used
- **React.js & Vite**: Fast UI component tracking.
- **HTML5 Canvas API**: Interfaced via React refs to achieve performance-heavy visual interpolations without massive DOM overhead.
- **Yarn**: Fast, reliable package management.

## Running Locally

1. Ensure you have Node.js and Yarn installed.
2. Navigate to the project directory:
   ```bash
   cd mru_queue_visualizer
   ```
3. Install the required dependencies:
   ```bash
   yarn install
   ```
4. Start the development server:
   ```bash
   yarn dev
   ```
5. Open your browser and navigate to the local server URL (usually `http://localhost:5173/`).

## Usage
- Enter a numerical value for `Size (N)` and click **Reset** to dictate the scale of the queue.
- Enter an index for `Fetch (k)` and click **Fetch!** to start the animation trajectory.
- Use the built-in playback controls to pause, replay, or step linearly through the shifts line-by-line!

---

<div align="center">
  <a href="https://antigravity.google/">
    <img src="https://img.shields.io/badge/Built%20with-Antigravity-blue?style=for-the-badge&logo=google" alt="Built with Antigravity" />
  </a>
</div>
