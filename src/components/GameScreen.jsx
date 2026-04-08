import { useState, useEffect } from 'react';
import { getZodiacSymbol, getZodiacColor, getZodiacEmoji, zodiacData } from '../utils/zodiacUI';
import { playSound } from '../utils/sounds';

export default function GameScreen({ socket, roomId, identity, gameState }) {
  const [birthDate, setBirthDate] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [hints, setHints] = useState([]);
  const [guessCount, setGuessCount] = useState(0);
  const [selectedGuess, setSelectedGuess] = useState('');
  const [gamePhase, setGamePhase] = useState('waiting'); // waiting, guessing, results
  const [result, setResult] = useState(null); // 'win', 'lose'
  const zodiacSigns = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
  ];

  useEffect(() => {
    if (!socket) return;

    socket.on('game_start', ({ hints: receivedHints, guessCount: count }) => {
      setHints(receivedHints);
      setGuessCount(count);
      setGamePhase('guessing');
      playSound('ambient');
    });

    socket.on('guess_response', ({ guessCount: count }) => {
      setGuessCount(count);
      setSelectedGuess('');
      if (count === 1) {
        playSound('wrong');
      }
    });

    socket.on('game_results', ({ bothCorrect, message }) => {
      setGamePhase('results');
      setResult(bothCorrect ? 'win' : 'lose');
      if (bothCorrect) {
        playSound('success');
      } else {
        playSound('failure');
      }
    });

    return () => {
      socket.off('game_start');
      socket.off('guess_response');
      socket.off('game_results');
    };
  }, [socket]);

  const handleSubmitBirthdate = (e) => {
    e.preventDefault();
    if (!birthDate) return;

    playSound('select');
    socket.emit('submit_birthdate', { roomId, birthDate });
    setSubmitted(true);
  };

  const handleMakeGuess = () => {
    if (!selectedGuess) return;

    playSound('guess');
    socket.emit('make_guess', { roomId, guess: selectedGuess });
  };

  const handleSelectGuess = (sign) => {
    playSound('click');
    setSelectedGuess(sign);
  };

  if (!submitted) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-4 sm:p-8 animate-ethereal overflow-y-auto">
        {/* Spooky bg */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-900/10 rounded-full blur-3xl -z-10" />

        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="text-6xl sm:text-7xl mb-3 animate-bounce">🔮</div>
            <h2 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              reveal your sign
            </h2>
          </div>

          <form onSubmit={handleSubmitBirthdate} className="space-y-4">
            <div className="witchy-border rounded-lg p-6">
              <label className="text-purple-300 text-xs font-bold mb-3 block">
                📅 WHEN WERE YOU BORN?
              </label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full frost-input border-2 border-purple-600 rounded-lg px-4 py-3
                         text-white bg-black/50 focus:outline-none focus:ring-2 focus:ring-purple-500
                         transition-all cursor-text text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={!birthDate}
              onClick={() => !birthDate && playSound('click')}
              className={`w-full px-4 py-4 rounded-lg transition-all text-sm font-bold witchy-border
                       ${birthDate
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white cursor-pointer portal-glow active:scale-95'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed opacity-50'}`}
            >
              ✨ CONFIRM YOUR DESTINY ✨
            </button>
          </form>

          <div className="mt-8 text-center text-purple-400 text-xs animate-pulse">
            👻 waiting for another soul to enter the chamber...
          </div>
        </div>
      </div>
    );
  }

  if (gamePhase === 'waiting') {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-8 animate-ethereal">
        <div className="text-center">
          <div className="text-7xl mb-4 animate-float">🌙</div>
          <div className="text-purple-300 text-lg font-bold mb-4">channeling cosmic energies...</div>
          <div className="flex gap-2 justify-center">
            {[0, 1, 2].map(i => (
              <div key={i} className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.2}s` }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (gamePhase === 'results') {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-4 sm:p-8 animate-ethereal overflow-y-auto">
        {/* Spooky bg */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-900/10 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-800/10 rounded-full blur-3xl -z-10" />

        <div className="w-full max-w-md witchy-border rounded-lg p-8 sm:p-12 portal-glow">
          {result === 'win' ? (
            <>
              <div className="text-8xl mb-6 animate-bounce text-center">✨</div>
              <h3 className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400 mb-6 text-center">
                YOU BOTH WIN!
              </h3>
              <p className="text-green-300 text-sm mb-8 italic text-center">
                🔮 the stars have aligned · both souls saw true 🔮
              </p>
            </>
          ) : (
            <>
              <div className="text-8xl mb-6 animate-shake text-center">💀</div>
              <h3 className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-pink-400 mb-6 text-center">
                GAME OVER
              </h3>
              <p className="text-red-300 text-sm mb-8 italic text-center">
                ☠️ the cosmic veil remains unbroken ☠️
              </p>
            </>
          )}
          <button
            onClick={() => {
              playSound('click');
              window.location.reload();
            }}
            className="w-full px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-lg transition-all text-sm font-bold active:scale-95"
          >
            🌙 RETURN TO LOBBY 🌙
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 sm:p-8 animate-ethereal overflow-y-auto">
      {/* Spooky bg */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-900/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-800/10 rounded-full blur-3xl -z-10" />

      {/* Floating zodiac background */}
      <div className="absolute top-10 right-20 text-8xl opacity-5 animate-float">♈</div>
      <div className="absolute bottom-20 left-10 text-7xl opacity-5 animate-float" style={{ animationDelay: '1s' }}>♓</div>

      <div className="w-full max-w-5xl">
        <h2 className="text-3xl sm:text-4xl font-black text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 mb-8">
          DIVINE THE ZODIAC
        </h2>

        {/* Hints Display */}
        <div className="mb-8 p-6 witchy-border rounded-lg animate-cosmic">
          <h3 className="text-sm text-purple-300 mb-4 font-bold">🌟 COSMIC HINTS 🌟</h3>
          <div className="flex flex-wrap gap-3">
            {hints.map((hint, idx) => (
              <span
                key={idx}
                className="px-3 sm:px-4 py-2 bg-gradient-to-r from-purple-700 to-pink-700 text-white rounded-full text-xs sm:text-sm font-bold"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                ✨ {hint}
              </span>
            ))}
          </div>
        </div>

        {/* Guess Status */}
        <div className="mb-6 text-center">
          <div className="text-purple-300 text-base sm:text-lg font-bold">
            {guessCount === 0 && "🎯 MAKE YOUR 1ST GUESS 🎯"}
            {guessCount === 1 && "❌ That's not it! 🔮 MAKE YOUR 2ND GUESS 🔮"}
            {guessCount >= 2 && "⏳ Out of guesses · waiting for the other soul..."}
          </div>
        </div>

        {/* Guess Selection */}
        {guessCount < 2 && (
          <>
            <div className="mb-8">
              <div className="text-center text-purple-300 text-sm font-bold mb-4">
                ✨ SELECT A ZODIAC SIGN ✨
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
                {zodiacSigns.map((sign) => (
                  <button
                    key={sign}
                    onClick={() => handleSelectGuess(sign)}
                    disabled={guessCount >= 2}
                    className={`py-4 sm:py-5 px-2 rounded-lg text-xs sm:text-sm transition-all font-bold witchy-border relative overflow-hidden active:scale-95
                      ${
                        selectedGuess === sign
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white portal-glow'
                          : 'bg-black/40 text-purple-300 hover:bg-black/60 hover:border-purple-400'
                      } ${guessCount >= 2 ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <div className="text-xl sm:text-2xl mb-1">{getZodiacEmoji(sign)}</div>
                    <div className="text-xs leading-tight">{sign}</div>
                    <div className="text-base sm:text-lg leading-none">{getZodiacSymbol(sign)}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Guess Button */}
            <button
              onClick={handleMakeGuess}
              disabled={!selectedGuess || guessCount >= 2}
              className={`w-full px-4 py-4 rounded-lg transition-all text-sm font-bold witchy-border active:scale-95
                       ${selectedGuess && guessCount < 2
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white cursor-pointer portal-glow'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed opacity-50'}`}
            >
              🔮 SUBMIT YOUR GUESS 🔮
            </button>
          </>
        )}

        {guessCount >= 2 && (
          <div className="mt-8 text-center">
            <div className="text-7xl mb-4 animate-float">👁️</div>
            <div className="text-purple-300 text-sm font-bold animate-pulse">
              the fates are deciding · waiting for destiny...
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
