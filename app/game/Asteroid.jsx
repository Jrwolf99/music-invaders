// Asteroid.js

import Image from 'next/image';

export default function Asteroid({ asteroid, visualNote }) {
  return (
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
}
