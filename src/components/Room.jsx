import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import GameScreen from './GameScreen';
import { playSound } from '../utils/sounds';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3001');

export default function Room({ roomId, identity, onLeave }) {
  const [socket, setSocket] = useState(null);
  const [players, setPlayers] = useState([]);
  const [gameState, setGameState] = useState({
    phase: 'waiting',
    birthdates: new Map(),
    zodiacSigns: new Map(),
    guesses: new Map(),
    guessedCorrectly: new Map()
  });

  useEffect(() => {
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    // Join room
    newSocket.emit('join_room', { roomId, identity });

    // Listen for user joined
    newSocket.on('user_joined', ({ userId, username, color, avatar }) => {
      setPlayers(prev => [...prev, { id: userId, username, color, avatar }]);
    });

    // Listen for user leaving
    newSocket.on('user_left', ({ userId }) => {
      setPlayers(prev => prev.filter(p => p.id !== userId));
    });

    return () => newSocket.close();
  }, [roomId, identity]);

  return (
    <div className="w-full h-full relative bg-black overflow-hidden animate-ethereal">
      {/* Spooky bg decorations */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-900/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-800/10 rounded-full blur-3xl -z-10" />

      {/* Exit Button */}
      <button
        onClick={() => {
          playSound('click');
          onLeave();
        }}
        className="absolute top-4 left-4 z-50 px-4 py-2 text-xs text-purple-300
                   hover:text-purple-100 border-2 border-purple-600 rounded-lg
                   hover:border-purple-400 transition-all cursor-pointer font-bold witchy-border active:scale-95"
      >
        🌙 RETURN 🌙
      </button>

      {/* Room Info */}
      <div className="absolute top-4 right-4 z-50 text-right">
        <div className="text-purple-400 text-xs font-mono mb-1 font-bold truncate">
          🔮 chamber {roomId.slice(0, 8)}
        </div>
        <div className="text-purple-300 text-xs font-bold">
          👻 {players.length + 1} souls
        </div>
      </div>

      {/* Game Screen */}
      {socket && (
        <GameScreen
          socket={socket}
          roomId={roomId}
          identity={identity}
          gameState={gameState}
        />
      )}
    </div>
  );
}