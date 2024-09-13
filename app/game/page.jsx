'use client';

import { useState, useEffect, useRef } from 'react';
import useGameEngine from '../util/useGameEngine';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

export default function AsteroidDestroyerGame() {
  const [bullets, setBullets] = useState([]);
  const [asteroids, setAsteroids] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [typednote, setTypednote] = useState('');

  const [angle, setAngle] = useState(0);

  const searchParams = useSearchParams();
  const [difficulty, setDifficulty] = useState(1);

  useEffect(() => {
    const difficultyParam = searchParams.get('difficulty');
    if (difficultyParam) {
      setDifficulty(difficultyParam);
    }
  }, [searchParams]);

  const gameAreaWidth = 100;
  const gameAreaHeight = 100;
  const bulletSpeed = 3;
  const asteroidSpeed = 0.1 * difficulty;
  const notes = [
    'e2',
    'f2',
    'f#2',
    'g2',
    'a2',
    'bb2',
    'b2',
    'c3',
    'd3',
    'e3',
    'f3',
    'f#3',
    'g3',
    'a3',
    'b3',
    'c4left',
    'c4right',
    'd4',
    'e4',
    'f4',
    'f#4',
    'g4',
    'a4',
    'bb4',
    'b4',
    'c5',
    'd5',
    'e5',
    'f5',
    'f#5',
    'g5',
    'a5',
  ];

  const [currentGameTime, setCurrentGameTime] = useState(0);

  const inputRef = useRef(null);
  const bulletSoundRef = useRef(null);
  const explosionSoundRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleGameTick = () => {
    if (gameOver) return;

    setCurrentGameTime((prevTime) => prevTime + 1);

    updateBullets();
    updateAsteroids();
    checkCollisions();

    if (currentGameTime % (600 / difficulty) === 0) spawnAsteroid();
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
        .filter((asteroid) => asteroid.y >= -11);

      if (updatedAsteroids.some((asteroid) => asteroid.y <= -10)) {
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
      note: notes[Math.floor(Math.random() * notes.length)],
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
    setCurrentGameTime(0);
    setTypednote('');
    setTimeout(() => {
      inputRef.current.focus();
    }, 100);
  };

  const shootBullet = (matchedAsteroid) => {
    const asteroidX = matchedAsteroid.x;
    const asteroidY = matchedAsteroid.y;

    const radians = Math.atan2(asteroidY - 0, asteroidX - 50);
    const ang = radians * (180 / Math.PI);
    setAngle(90 - ang);

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
    setTypednote('');
  };

  const checkForMatch = (note) => {
    const parsedNote = note
      .replace(/#/g, 's')
      .replace(/b/g, '.')
      .replace(/\//g, 's')
      .toLowerCase();
    const matchedAsteroid = asteroids.find(
      (asteroid) => asteroid.note === parsedNote
    );

    return matchedAsteroid;
  };

  const handleInputChange = (e) => {
    const note = e.target.value.toLowerCase();
    setTypednote(note);

    const matchedAsteroid = checkForMatch(note);
    if (matchedAsteroid) {
      shootBullet(matchedAsteroid);
    }
  };

  const notePic = (note) => {
    return `/Assets/images/notes/${note}.png`;
  };

  return (
    <div className="flex flex-col items-center justify-between h-screen bg-gray-900 text-white relative pb-2">
      <div className="relative w-full flex items-start justify-center p-2">
        <div className="flex flex-col items-center justify-center top-2 mx-auto">
          <h1
            className="text-red-700 font-bold"
            style={{
              fontFamily: 'Impact',
              fontSize: '30px',
            }}
          >
            Music Invaders
          </h1>
          <p className="text-lg">Score: {score}</p>
        </div>

        <Link href="/instructions" className="absolute top-2 right-2">
          <span className="text-white hover:text-gray-400 cursor-pointer">
            <InformationCircleIcon className="h-8 w-8" />
          </span>
        </Link>
      </div>

      <div className="relative w-[90%] flex-grow bg-gray-800 overflow-hidden">
        {bullets.map((bullet, index) => (
          <Image
            key={index}
            alt="Bullet"
            src="/Assets/SVGs/bullet.svg"
            className="absolute"
            width={50}
            height={50}
            style={{
              bottom: `${bullet.y}%`,
              left: `${bullet.x}%`,
              transform: `translate(-50%, -50%) rotate(${angle}deg)`,
            }}
          />
        ))}

        {asteroids.map((asteroid, index) => (
          <>
            <Image
              key={index}
              height={100}
              width={150}
              src={`/Assets/images/notes/${asteroid.note}.png`}
              alt={asteroid.note}
              className="absolute bg-white shadow rounded-lg py-2"
              style={{
                zIndex: 2,
                bottom: `${asteroid.y}%`,
                left: `${asteroid.x}%`,
                transform: 'translate(-50%, -50%)',
              }}
            />
            {asteroid.y <= 10 && <p>{asteroid.note}</p>}
          </>
        ))}
      </div>
      <Image
        height={65}
        width={65}
        src="/Assets/images/Ship.png"
        alt="Player Ship"
        className="mt-4 transition-transform duration-200"
        style={{ transform: `rotate(${angle}deg)` }}
      />
      <input
        ref={inputRef}
        type="text"
        value={typednote}
        onChange={handleInputChange}
        disabled={gameOver}
        placeholder="Type the note to destroy the invader!"
        className="p-2 mt-4 bg-gray-800 text-white border border-gray-600 rounded w-[95%] text-center"
      />
      {gameOver && (
        <div className="absolute z-[3] top-0 left-0 w-full h-full flex flex-col items-center justify-center bg-black bg-opacity-70">
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
