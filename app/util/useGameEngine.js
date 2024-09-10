import { useEffect, useRef } from 'react';

export default function useGameEngine(fps, onGameTick) {
  const gameLoop = useRef(null);

  useEffect(() => {
    const frameRate = 1000 / fps;
    let lastFrameTime = performance.now();

    const runGame = (now) => {
      const deltaTime = now - lastFrameTime;
      if (deltaTime >= frameRate) {
        onGameTick();
        lastFrameTime = now;
      }
      gameLoop.current = requestAnimationFrame(runGame);
    };

    gameLoop.current = requestAnimationFrame(runGame);

    return () => cancelAnimationFrame(gameLoop.current);
  }, [fps, onGameTick]);
}
