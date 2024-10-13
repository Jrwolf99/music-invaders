// AsteroidDestroyerGame.js

'use client';

import Link from 'next/link';

import GameOverScreen from './GameOverScreen';
import GameArea from './GameArea';
import Controls from './Controls';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import useMainGame from './useMainGame';

export default function AsteroidDestroyerGame() {
  const {
    state: {
      bullets,
      asteroids,
      score,
      gameOver,
      typednote,
      message,
      angle,
      difficulty,
      currentGameTime,
    },
    setters: { setTypednote },
    refs: { inputRef, bulletSoundRef, explosionSoundRef },
    handlers: { resetGame, handleInputChange, visualNote },
  } = useMainGame();

  return (
    <div className="flex flex-col items-center justify-between h-screen bg-gray-900 text-white relative pb-2">
      <div className="relative w-full flex items-start justify-center p-2">
        <Header score={score} />
        <GameInfoLink />
      </div>

      <GameArea
        bullets={bullets}
        asteroids={asteroids}
        angle={angle}
        visualNote={visualNote}
      />

      <Controls
        typednote={typednote}
        angle={angle}
        message={message}
        handleInputChange={handleInputChange}
        setTypednote={setTypednote}
        visualNote={visualNote}
        gameOver={gameOver}
        inputRef={inputRef}
      />

      {gameOver && <GameOverScreen score={score} resetGame={resetGame} />}

      <audio ref={bulletSoundRef} src="/Assets/sounds/Shot.mp3" />
      <audio ref={explosionSoundRef} src="/Assets/sounds/Explosion.mp3" />
    </div>
  );
}

const Header = ({ score }) => (
  <div className="flex flex-col items-center justify-center top-2 mx-auto">
    <h1
      className="text-red-700 font-bold"
      style={{ fontFamily: 'Impact', fontSize: '30px' }}
    >
      Music Invaders
    </h1>
    <p className="text-lg">Score: {score}</p>
  </div>
);

const GameInfoLink = () => (
  <div className="flex items-center justify-end gap-4 w-full absolute top-0 right-0 p-2">
    <Link href="/instructions">
      <span className="text-white hover:text-gray-400 cursor-pointer">
        <InformationCircleIcon className="h-8 w-8" />
      </span>
    </Link>
  </div>
);
