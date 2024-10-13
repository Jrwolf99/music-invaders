import { XMarkIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

export default function Controls({
  typednote,
  angle,
  message,
  handleInputChange,
  setTypednote,
  visualNote,
  gameOver,
  inputRef,
}) {
  const letters = ['c', 'd', 'e', 'f', 'g', 'a', 'b'];
  const modifiers = ['♭', '♯'];
  const octaves = ['1', '2', '3', '4', '5', '6'];

  const buttonClasses =
    'bg-gray-800 text-white rounded hover:bg-gray-700 p-2 text-xs sm:text-lg w-9 h-9 sm:w-10 sm:h-10';

  return (
    <div className="flex flex-col items-center sm:mt-4 w-full">
      <button
        onClick={() => setTypednote('')}
        className="w-[90%] my-4 p-2 rounded bg-gray-800 rounded hover:bg-gray-700"
      >
        <XMarkIcon className="h-4 w-full sm:h-6 text-red-500 text-xs sm:text-lg" />
      </button>
      <div className="flex w-full justify-center gap-2 sm:gap-10">
        <div className="grid grid-row-2 grid-cols-4 gap-1">
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
            onSubmit={(e) => {
              e.preventDefault();
            }}
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
          </form>
        </div>

        <div className="grid grid-row-2 grid-cols-4 gap-1">
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
  );
}
