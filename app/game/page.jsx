'use client';

import { useState, useEffect, useRef } from 'react';
import useGameEngine from '../util/useGameEngine';
import Image from 'next/image';

export default function AsteroidDestroyerGame() {
  const [bullets, setBullets] = useState([]);
  const [asteroids, setAsteroids] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [typedWord, setTypedWord] = useState('');

  const [angle, setAngle] = useState(0);

  const gameAreaWidth = 100;
  const gameAreaHeight = 100;
  const bulletSpeed = 3;
  const asteroidSpeed = 0.3;
  const words = ['alpha'];
  const [currentGameTime, setCurrentGameTime] = useState(0);

  const inputRef = useRef(null);
  const bulletSoundRef = useRef(null);
  const explosionSoundRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus(); // Automatically focus the input on page load
    }
  }, []);

  const handleGameTick = () => {
    if (gameOver) return;

    setCurrentGameTime((prevTime) => prevTime + 1);

    updateBullets();
    updateAsteroids();
    checkCollisions();

    if (currentGameTime % 100 === 0) spawnAsteroid();
  };

  const updateBullets = () => {
    setBullets((prevBullets) =>
      prevBullets
        .map((bullet) => {
          const dx = bullet.targetX - bullet.x;
          const dy = bullet.targetY - bullet.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 1) {
            return null;
          }

          const moveX = (dx / distance) * bulletSpeed;
          const moveY = (dy / distance) * bulletSpeed;

          return {
            ...bullet,
            x: bullet.x + moveX,
            y: bullet.y + moveY,
          };
        })
        .filter((bullet) => bullet !== null)
        .filter(
          (bullet) =>
            bullet.x >= 0 &&
            bullet.x <= gameAreaWidth &&
            bullet.y >= 0 &&
            bullet.y <= gameAreaHeight
        )
    );
  };

  const updateAsteroids = () => {
    setAsteroids((prevAsteroids) => {
      const updatedAsteroids = prevAsteroids
        .map((asteroid) => ({ ...asteroid, y: asteroid.y - asteroidSpeed }))
        .filter((asteroid) => asteroid.y >= 0);

      if (updatedAsteroids.some((asteroid) => asteroid.y <= 10)) {
        setGameOver(true);
      }

      return updatedAsteroids;
    });
  };

  const checkCollisions = () => {
    setAsteroids((prevAsteroids) => {
      const updatedAsteroids = [...prevAsteroids];
      bullets.forEach((bullet, bulletIndex) => {
        updatedAsteroids.forEach((asteroid, asteroidIndex) => {
          if (isCollision(asteroid, bullet)) {
            updatedAsteroids.splice(asteroidIndex, 1);
            removeBullet(bulletIndex);
            explosionSoundRef.current.play();
            setScore((prevScore) => prevScore + 1);
          }
        });
      });
      return updatedAsteroids;
    });
  };

  const isCollision = (asteroid, bullet) => {
    return (
      Math.abs(asteroid.x - bullet.x) < 5 && Math.abs(asteroid.y - bullet.y) < 5
    );
  };

  const removeBullet = (bulletIndex) => {
    setBullets((prevBullets) =>
      prevBullets.filter((_, i) => i !== bulletIndex)
    );
  };

  const spawnAsteroid = () => {
    const newAsteroid = {
      x: Math.random() * 0.8 * gameAreaWidth + 0.1 * gameAreaWidth, // shift up 10% and reduce length 80%. keeps asteroid on screen
      y: gameAreaHeight,
      word: words[Math.floor(Math.random() * words.length)],
    };
    setAsteroids((prevAsteroids) => [...prevAsteroids, newAsteroid]);
  };

  useGameEngine(144, handleGameTick, () => {
    alert('Game Over');
  });

  const resetGame = () => {
    setBullets([]);
    setAsteroids([]);
    setScore(0);
    setGameOver(false);
  };

  const shootBullet = (matchedAsteroid) => {
    const asteroidX = matchedAsteroid.x;
    const asteroidY = matchedAsteroid.y;

    setAngle((270 - Math.atan2(asteroidY - 0, asteroidX - 50) * 180) / Math.PI);

    setBullets((prevBullets) => [
      ...prevBullets,
      {
        x: 50,
        y: 0,
        targetX: asteroidX,
        targetY: asteroidY,
      },
    ]);

    bulletSoundRef.current.volume = 0.1;
    bulletSoundRef.current.play();
    setTypedWord('');
  };

  const handleInputChange = (e) => {
    const word = e.target.value.toLowerCase();
    setTypedWord(word);

    const matchedAsteroid = asteroids.find(
      (asteroid) => asteroid.word.toLowerCase() === word
    );

    if (matchedAsteroid) {
      shootBullet(matchedAsteroid);
    }
  };

  return (
    <div className="flex flex-col items-center justify-between h-screen p-4 bg-gray-900 text-white relative">
      <h1 className="text-4xl text-red-700 font-bold mb-4">Music Invaders</h1>
      <p className="text-xl mb-4">Score: {score}</p>
      <div className="relative w-[90%] flex-grow bg-gray-800 overflow-hidden">
        {bullets.map((bullet, index) => (
          <Image
            key={index}
            alt="Bullet"
            src="/Assets/SVGs/bullet.svg"
            className="absolute"
            width={30}
            height={40}
            style={{
              bottom: `${bullet.y}%`,
              left: `${bullet.x}%`,
              transform: `rotate(${angle}deg)`,
            }}
          />
        ))}

        {asteroids.map((asteroid, index) => (
          <div
            key={index}
            className="absolute bg-gray-400 rounded-full"
            style={{
              width: '30px',
              height: '30px',
              zIndex: 2,
              bottom: `${asteroid.y}%`,
              left: `${asteroid.x}%`,
            }}
          >
            <p className="text-red-800 text-center">{asteroid.word}</p>
          </div>
        ))}
      </div>
      <img
        src="/Assets/images/Ship.png"
        alt="Player Ship"
        className="w-10 h-10 mt-4 transition-transform duration-200"
        style={{ transform: `rotate(${angle}deg)` }}
      />
      <input
        ref={inputRef}
        type="text"
        value={typedWord}
        onChange={handleInputChange}
        placeholder="Type the note to destroy the invader"
        className="p-2 mt-4 bg-gray-800 text-white border border-gray-600 rounded w-full"
      />
      {gameOver && (
        <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center bg-black bg-opacity-70">
          <h2 className="text-4xl font-bold mb-4">Game Over</h2>
          <p className="text-xl mb-4">Your score: {score}</p>
          <button
            onClick={resetGame}
            className="bg-green-500 px-4 py-2 rounded hover:bg-green-400"
          >
            Play Again
          </button>
        </div>
      )}
      <audio ref={bulletSoundRef} src="/Assets/sounds/Shot.mp3" />
      <audio ref={explosionSoundRef} src="/Assets/sounds/Explosion.mp3" />
    </div>
  );
}
