'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

export default function Home() {
  const router = useRouter();
  const [difficulty, setDifficulty] = useState(1);

  const startGame = () => {
    router.push(`/game?difficulty=${difficulty}`);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-900 text-white">
      <div className="relative">
        <Link href="/instructions" className="absolute top-5 right-5">
          <span className="text-white hover:text-gray-400 cursor-pointer">
            <InformationCircleIcon className="h-8 w-8" />
          </span>
        </Link>
      </div>
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 gap-4 text-center">
        <h1
          className="font-bold mb-4 text-red-700"
          style={{
            fontFamily: 'Impact',
            fontSize: '80px',
          }}
        >
          Music Invaders
        </h1>
        <div className="flex flex-col items-center gap-6">
          <div className="flex gap-4">
            <button
              onClick={() => setDifficulty(1)}
              className={`px-4 py-2 sm:px-6 sm:py-3 border-2 ${
                difficulty === 1
                  ? 'bg-blue-600 text-white'
                  : 'border-blue-600 text-blue-600'
              } hover:bg-blue-600 hover:text-white transition-all duration-300 rounded-lg`}
            >
              Easy
            </button>
            <button
              onClick={() => setDifficulty(2)}
              className={`px-4 py-2 sm:px-6 sm:py-3 border-2 ${
                difficulty === 2
                  ? 'bg-green-600 text-white'
                  : 'border-green-600 text-green-600'
              } hover:bg-green-600 hover:text-white transition-all duration-300 rounded-lg`}
            >
              Medium
            </button>
            <button
              onClick={() => setDifficulty(3)}
              className={`px-4 py-2 sm:px-6 sm:py-3 border-2 ${
                difficulty === 3
                  ? 'bg-red-600 text-white'
                  : 'border-red-600 text-red-600'
              } hover:bg-red-600 hover:text-white transition-all duration-300 rounded-lg`}
            >
              Hard
            </button>
          </div>
          <button
            onClick={startGame}
            className="px-6 py-3 sm:px-8 sm:py-4 border-[2px] border-red-600 text-red-500 hover:bg-red-700 hover:text-white transition-all duration-300 rounded-lg text-xl sm:text-2xl"
          >
            Start Game
          </button>
        </div>
      </div>

      <footer className="flex flex-col items-center justify-center w-full h-[20vh] border-t gap-4 border-gray-800 text-sm text-gray-400">
        <p>© 2024 Jonathan Wolf</p>
        <p className="text-sm text-gray-400">
          App designed and made by{' '}
          <a
            href="https://jrwolf.netlify.app"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline"
          >
            Jonathan Wolf
          </a>
        </p>
      </footer>
    </div>
  );
}
