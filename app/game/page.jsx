'use client';

import { useState, useEffect, useRef } from 'react';
import useGameEngine from '../util/useGameEngine';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { InformationCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';

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
    'fs2',
    'g2',
    'a2',
    'b[2',
    'b2',
    'c3',
    'd3',
    'e3',
    'f3',
    'fs3',
    'g3',
    'a3',
    'b3',
    'c4left',
    'c4right',
    'd4',
    'e4',
    'f4',
    'fs4',
    'g4',
    'a4',
    'b[4',
    'b4',
    'c5',
    'd5',
    'e5',
    'f5',
    'fs5',
    'g5',
    'a5',
  ];

  const letters = ['c', 'd', 'e', 'f', 'g', 'a', 'b'];
  const modifiers = ['♭', '♯'];
  const octaves = ['1', '2', '3', '4', '5', '6'];

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

  const parseNote = (note) => {
    return note
      .replace(/#/g, 's')
      .replace(/\//g, 's')
      .replace(/♭/g, '[')
      .replace(/♯/g, 's')
      .toLowerCase();
  };

  const visualNote = (note) => {
    return parseNote(note)
      .replace('[', '♭')
      .replace(']', '♯')
      .replace('s', '♯')

      .toUpperCase();
  };

  const checkForMatch = (note) => {
    const parsedNote = parseNote(note);
    let matchedAsteroid = asteroids.find(
      (asteroid) => asteroid.note === parsedNote
    );

    if (parsedNote === 'c4') {
      asteroids.forEach((asteroid) => {
        if (asteroid.note === 'c4left' || asteroid.note === 'c4right') {
          matchedAsteroid = asteroid;
        }
      });
    }

    return matchedAsteroid;
  };

  const handleInputChange = (e) => {
    const note = e.target.value.toLowerCase();
    if (typednote[typednote.length - 1] !== note[note.length - 1]) {
      setTypednote(note);
    }
  };

  const handleInputSubmit = (e, note) => {
    e.preventDefault();

    const matchedAsteroid = checkForMatch(typednote);
    if (matchedAsteroid) {
      shootBullet(matchedAsteroid);
    }
  };

  const buttonClasses =
    'bg-gray-800 text-white rounded hover:bg-gray-700 p-2 text-xs sm:text-lg w-8 h-8 sm:w-10 sm:h-10';

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

        <div className="flex items-center justify-end gap-4 w-full absolute top-0 right-0 p-2">
          <Link href="/instructions">
            <span className="text-white hover:text-gray-400 cursor-pointer">
              <InformationCircleIcon className="h-8 w-8" />
            </span>
          </Link>
        </div>
      </div>

      <div className="relative w-[90%] flex-grow bg-gray-800 overflow-hidden">
        {bullets.map((bullet, index) => (
          <Bullet key={index} bullet={bullet} angle={angle} />
        ))}

        {asteroids.map((asteroid, index) => (
          <Asteroid key={index} asteroid={asteroid} visualNote={visualNote} />
        ))}
      </div>

      <div className="flex flex-col items-center sm:mt-4 w-full">
        <button
          onClick={(e) => {
            handleInputSubmit(e, typednote);
          }}
          className="block sm:hidden bg-red-800 text-white rounded text-xs p-1 hover:bg-red-700 mt-3 w-[90%] h-8"
        >
          Fire!
        </button>

        <div className="flex w-full justify-center gap-2 sm:gap-10 mt-4">
          <div className="grid grid-row-2 grid-cols-4 gap-2">
            {letters.map((letter) => (
              <button
                key={letter}
                onClick={() => {
                  if (typednote.length === 0) {
                    setTypednote((prevNote) => prevNote + letter);
                  }
                }}
                className={buttonClasses}
              >
                {letter.toUpperCase()}
              </button>
            ))}
            <button
              onClick={() => {
                setTypednote('');
              }}
              className={buttonClasses}
            >
              <XMarkIcon className="h-4 w-4 sm:h-6 sm:w-6 text-red-500" />
            </button>
          </div>

          <div className="flex flex-col items-center">
            <Image
              height={65}
              width={65}
              src="/Assets/images/Ship.png"
              alt="Player Ship"
              className="transition-transform duration-200 hidden sm:block"
              style={{ transform: `rotate(${angle}deg)` }}
            />
            <Image
              height={35}
              width={35}
              src="/Assets/images/Ship.png"
              alt="Player Ship"
              className="transition-transform duration-200 block sm:hidden"
              style={{ transform: `rotate(${angle}deg)` }}
            />
            <p className="block sm:hidden text-center text-sm mt-4">
              {visualNote(typednote)}
            </p>

            <form
              className="hidden sm:flex flex-row items-center justify-center gap-2"
              handleSubmit={handleInputSubmit}
            >
              <input
                ref={inputRef}
                type="text"
                value={visualNote(typednote)}
                onChange={handleInputChange}
                disabled={gameOver}
                placeholder="Destroy the Invader!"
                className="p-2 bg-gray-800 text-white border border-gray-600 rounded w-[95%] text-center"
              />
              <button
                onClick={(e) => {
                  handleInputSubmit(e, typednote);
                }}
                className="bg-red-800 text-white p-2 rounded hover:bg-red-700"
              >
                Fire!
              </button>
            </form>
          </div>

          <div className="grid grid-row-2 grid-cols-4 gap-2">
            {modifiers.map((modifier) => (
              <button
                key={modifier}
                onClick={() => {
                  if (typednote.length === 1) {
                    setTypednote((prevNote) => prevNote + modifier);
                  }
                }}
                className={buttonClasses}
              >
                {modifier}
              </button>
            ))}
            {octaves.map((octave) => (
              <button
                key={octave}
                onClick={() => {
                  if (typednote.length === 1 || typednote.length === 2) {
                    setTypednote((prevNote) => prevNote + octave);
                  }
                }}
                className={buttonClasses}
              >
                {octave}
              </button>
            ))}
          </div>
        </div>
      </div>

      {gameOver && <GameOverScreen score={score} resetGame={resetGame} />}

      <audio ref={bulletSoundRef} src="/Assets/sounds/Shot.mp3" />
      <audio ref={explosionSoundRef} src="/Assets/sounds/Explosion.mp3" />
    </div>
  );
}

const GameOverScreen = ({ score, resetGame }) => (
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
);

const Bullet = ({ bullet, angle }) => (
  <Image
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
);

const Asteroid = ({ asteroid, visualNote }) => (
  <>
    <Image
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
    {asteroid.y <= 10 && <>{visualNote(asteroid.note)}</>}
  </>
);


