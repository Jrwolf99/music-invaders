'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [difficulty, setDifficulty] = useState(1);

  const startGame = () => {
    router.push(`/game?difficulty=${difficulty}`);
  };

  return (
    <div className="flex flex-col items-center justify-center gap-[10vh] min-h-screen text-black">
      <h1 className="text-5xl font-bold mb-8 dark:text-red-700">
        Music Invaders
      </h1>
      <div className="flex flex-col items-center gap-4">
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setDifficulty(1)}
            className={`px-4 py-2 border-2 ${
              difficulty === 1
                ? 'bg-blue-500 text-white'
                : 'border-blue-500 text-blue-500'
            } hover:bg-blue-500 hover:text-white transition-all duration-300 rounded-lg`}
          >
            Easy
          </button>
          <button
            onClick={() => setDifficulty(2)}
            className={`px-4 py-2 border-2 ${
              difficulty === 2
                ? 'bg-green-500 text-white'
                : 'border-green-500 text-green-500'
            } hover:bg-green-500 hover:text-white transition-all duration-300 rounded-lg`}
          >
            Medium
          </button>
          <button
            onClick={() => setDifficulty(3)}
            className={`px-4 py-2 border-2 ${
              difficulty === 3
                ? 'bg-red-500 text-white'
                : 'border-red-500 text-red-500'
            } hover:bg-red-500 hover:text-white transition-all duration-300 rounded-lg`}
          >
            Hard
          </button>
        </div>
        <button
          onClick={startGame}
          className="px-6 py-3 border-[2px] border-red-700 text-red-700 hover:bg-red-800 hover:text-white transition-all duration-300 rounded-lg text-2xl"
        >
          Start Game
        </button>
      </div>
    </div>
  );
}
