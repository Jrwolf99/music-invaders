// GameOverScreen.js

export default function GameOverScreen({ score, resetGame }) {
  return (
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
}
