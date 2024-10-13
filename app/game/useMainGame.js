import React, { useEffect, useRef, useState } from 'react';
import useGameEngine from '../util/useGameEngine';
import { useSearchParams } from 'next/navigation';

export default function useMainGame() {
  const [bullets, setBullets] = useState([]);
  const [asteroids, setAsteroids] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [typednote, setTypednote] = useState('');
  const [message, setMessage] = useState('');
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

  const spawnAsteroid = () => {
    const newAsteroid = {
      x: Math.random() * 0.8 * gameAreaWidth + 0.1 * gameAreaWidth, // shift up 10% and reduce length 80%. keeps asteroid on screen
      y: gameAreaHeight,
      note: notes[Math.floor(Math.random() * notes.length)],
    };
    setAsteroids((prevAsteroids) => [...prevAsteroids, newAsteroid]);
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

  const failBullet = () => {
    setMessage('Missed!');
    setTimeout(() => {
      setMessage('');
    }, 1000);
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

    if (navigator.vibrate) {
      navigator.vibrate(100);
    } else {
      console.log('Vibration not supported');
    }

    if (typednote[typednote.length - 1] !== note[note.length - 1]) {
      setTypednote(note);
    }
  };

  const handleInputSubmit = (note) => {
    const matchedAsteroid = checkForMatch(note);
    if (matchedAsteroid) {
      shootBullet(matchedAsteroid);
    } else {
      failBullet();
    }
  };

  useEffect(() => {
    if (/\d/.test(typednote)) {
      handleInputSubmit(typednote);
    }
  }, [typednote]);

  const handleGameTick = () => {
    if (gameOver) return;

    setCurrentGameTime((prevTime) => prevTime + 1);

    updateBullets();
    updateAsteroids();
    checkCollisions();

    if (currentGameTime % (600 / difficulty) === 0) spawnAsteroid();
  };

  useGameEngine(144, handleGameTick, () => {
    alert('Game Over');
  });

  return {
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
    setters: {
      setBullets,
      setAsteroids,
      setScore,
      setGameOver,
      setTypednote,
      setMessage,
      setAngle,
      setDifficulty,
      setCurrentGameTime,
    },
    refs: {
      inputRef,
      bulletSoundRef,
      explosionSoundRef,
    },
    handlers: {
      resetGame,
      handleInputChange,
      handleInputSubmit,
      visualNote,
    },
  };
}
