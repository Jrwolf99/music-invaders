'use client';

import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  const startGame = () => {
    router.push('/game');
  };

  return (
    <div className="flex flex-col items-center justify-center gap-[10vh] min-h-screen text-black">
      <h1 className="text-5xl font-bold mb-8">Music Invaders</h1>
      <button
        onClick={startGame}
        className="px-6 py-3 border-[2px] border-red-700 text-red-700 border-red-700 hover:bg-red-800 hover:text-white transition-all duration-300 rounded-lg text-2xl"
      >
        Start Game
      </button>
    </div>
  );
}
