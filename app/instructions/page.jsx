import Link from 'next/link';
import React from 'react';

export default function Instruction() {

  const noteClasses = 'text-red-500 font-bold';
  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-900 text-white">
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 gap-4 text-center">
        <h1
          className="font-bold text-red-700"
          style={{
            fontFamily: 'Impact',
            fontSize: '80px',
          }}
        >
          Music Invaders
        </h1>
        {/* description */}
        <div className="flex flex-col items-center gap-8 px-4 mb-10">
          <p className="text-base max-w-md text-center leading-relaxed">
            <span className={noteClasses}>Music Invaders </span>
            is a game that helps you learn music notes and sight reading. The
            game will display a note, and you have to type the correct note to
            shoot the asteroid. The game ends if the asteroid reaches the bottom
            of the screen.
          </p>

          <p className="text-base max-w-md text-center leading-relaxed">
            Be aware that the notes require an octave as well. For example, if
            the note is <span className={noteClasses}>C</span>, you can type{' '}
            <span className={noteClasses}>C4</span> or{' '}
            <span className={noteClasses}>C5</span>.
          </p>

          <div>
            <h2 className="text-red-500 italic font-semibold">PC Controls:</h2>
            <ul className="text-base max-w-md list-disc list-inside leading-relaxed">
              <li>Type the note in the bottom text input box.</li>
              <li>
                If you are typing instead of using the buttons, <br />
                use <span className={noteClasses}>[</span> for{' '}
                <span className={noteClasses}>♭</span> and{' '}
                <span className={noteClasses}>]</span> for{' '}
                <span className={noteClasses}>♯</span>.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-red-500 italic font-semibold">
              Mobile Controls:
            </h2>
            <ul className="text-base max-w-md list-disc list-inside leading-relaxed">
              <li>Tap the note and apply and modifiers as necessary.</li>
            </ul>
          </div>

          <Link href="/" className="w-full my-4">
            <p className="bg-gray-800 text-white p-2 rounded-lg cursor-pointer hover:bg-gray-700">
              Play Game
            </p>
          </Link>
        </div>
      </div>

      <footer className="flex flex-col items-center justify-center w-full h-[20vh] border-t gap-4 border-gray-800 text-sm text-gray-400">
        <p>© 2024 Jonathan Wolf</p>
        <p className="text-sm text-gray-400">
          App designed and made by{' '}
          <a
            href="https://jrwolf.netlify.app"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:italic"
          >
            Jonathan Wolf
          </a>
        </p>
      </footer>
    </div>
  );
}
