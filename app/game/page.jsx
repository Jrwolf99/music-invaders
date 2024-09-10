'use client';

import { useState, useEffect, useRef } from 'react';
import useGameEngine from '../util/useGameEngine';

export default function AsteroidDestroyerGame() {
  const [bullets, setBullets] = useState([]);
  const [asteroids, setAsteroids] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [typedWord, setTypedWord] = useState('');

  const gameAreaWidth = 100;
  const gameAreaHeight = 100;
  const bulletSpeed = 5;
  const asteroidSpeed = 0.5;
  const words = ['alpha', 'beta', 'gamma', 'delta', 'epsilon'];
  const [currentGameTime, setCurrentGameTime] = useState(0);

  const bulletSoundRef = useRef(null);
  const explosionSoundRef = useRef(null);

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
            return null; // Bullet reached the target
          }

          const moveX = (dx / distance) * bulletSpeed;
          const moveY = (dy / distance) * bulletSpeed;

          return {
            ...bullet,
            x: bullet.x + moveX,
            y: bullet.y + moveY,
          };
        })
        .filter((bullet) => bullet !== null) // Remove bullets that reached their target
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
        .map((asteroid) => ({ ...asteroid, y: asteroid.y - asteroidSpeed })) // Asteroids move down (negative y direction)
        .filter((asteroid) => asteroid.y >= 0); // Remove asteroids that have reached the bottom

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
      Math.abs(asteroid.x - bullet.x) < 5 && // Adjusted collision threshold for accuracy
      Math.abs(asteroid.y - bullet.y) < 5
    );
  };

  const removeBullet = (bulletIndex) => {
    setBullets((prevBullets) =>
      prevBullets.filter((_, i) => i !== bulletIndex)
    );
  };

  const spawnAsteroid = () => {
    const newAsteroid = {
      x: Math.random() * gameAreaWidth,
      y: gameAreaHeight, // Asteroids start from the top
      word: words[Math.floor(Math.random() * words.length)],
    };
    setAsteroids((prevAsteroids) => [...prevAsteroids, newAsteroid]);
  };

  useGameEngine(60, handleGameTick, () => {
    alert('Game Over');
  });

  const resetGame = () => {
    setBullets([]);
    setAsteroids([]);
    setScore(0);
    setGameOver(false);
  };

  const handleInputChange = (e) => {
    const word = e.target.value.toLowerCase();
    setTypedWord(word);

    const matchedAsteroid = asteroids.find(
      (asteroid) => asteroid.word.toLowerCase() === word
    );

    if (matchedAsteroid) {
      const asteroidX = matchedAsteroid.x;
      const asteroidY = matchedAsteroid.y;

      setBullets((prevBullets) => [
        ...prevBullets,
        { x: 50, y: 0, targetX: asteroidX, targetY: asteroidY },
      ]);

      bulletSoundRef.current.play(); // Play bullet sound
      setTypedWord('');
    }
  };

  return (
    <div className="flex flex-col items-center justify-between h-screen p-4 bg-gray-900 text-white relative">
      <h1 className="text-4xl text-red-700 font-bold mb-4">Music Invaders</h1>
      <p className="text-xl mb-4">Score: {score}</p>

      <div className="relative w-full flex-grow bg-gray-800 overflow-hidden">
        {bullets.map((bullet, index) => (
          <div
            key={index}
            className="absolute"
            style={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              bottom: `${bullet.y}%`,
              left: `${bullet.x}%`,
              backgroundColor: 'red',
            }}
          ></div>
        ))}

        {asteroids.map((asteroid, index) => (
          <div
            key={index}
            className="absolute bg-gray-400 rounded-full"
            style={{
              width: '30px',
              height: '30px',
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
        className="w-10 h-10 mt-4"
      />

      <input
        type="text"
        value={typedWord}
        onChange={handleInputChange}
        placeholder="Type the word to destroy the asteroid"
        className="p-2 mt-4 bg-gray-800 text-white border border-gray-600 rounded"
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
