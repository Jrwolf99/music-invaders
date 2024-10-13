// Bullet.js

import Image from 'next/image';

export default function Bullet({ bullet, angle }) {
  return (
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
}
