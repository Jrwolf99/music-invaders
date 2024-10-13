// GameArea.js

import Bullet from './Bullet';
import Asteroid from './Asteroid';

export default function GameArea({ bullets, asteroids, angle, visualNote }) {
  return (
    <div className="relative w-[97%] sm:w-[90%] flex-grow bg-gray-800 rounded overflow-hidden">
      {bullets.map((bullet, index) => (
        <Bullet key={index} bullet={bullet} angle={angle} />
      ))}

      {asteroids.map((asteroid, index) => (
        <Asteroid key={index} asteroid={asteroid} visualNote={visualNote} />
      ))}
    </div>
  );
}
