import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { getZodiacEmoji } from '../utils/zodiacUI';
import { playSound } from '../utils/sounds';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3001');

export default function Lobby({ onJoinRoom, identity }) {
  const [rooms, setRooms] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.debug('socket connected', newSocket.id, 'to', SOCKET_URL);
      newSocket.emit('get_rooms');
    });

    newSocket.on('rooms_update', (roomsList) => {
      setRooms(roomsList);
    });

    newSocket.on('connect_error', (err) => {
      console.error('socket connect_error', err);
    });

    return () => newSocket.close();
  }, []);

  const handleJoinRoom = (roomId) => {
    playSound('select');
    if (socket) {
      socket.close();
    }
    onJoinRoom(roomId);
  };

  const availableRooms = rooms.filter(room => room.occupants < 2);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 sm:p-8 animate-ethereal overflow-y-auto">
      {/* Spooky background elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-900/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-800/10 rounded-full blur-3xl -z-10" />

      {/* Floating zodiac symbols background */}
      <div className="absolute top-10 right-20 text-4xl sm:text-6xl opacity-10 animate-float">♈</div>
      <div className="absolute top-32 left-16 text-3xl sm:text-5xl opacity-10 animate-float" style={{ animationDelay: '0.5s' }}>♉</div>
      <div className="absolute bottom-20 right-10 text-2xl sm:text-4xl opacity-10 animate-float" style={{ animationDelay: '1s' }}>♊</div>

      {/* Header */}
      <div className="mb-8 sm:mb-12 text-center relative z-10">
        <div className="text-5xl sm:text-6xl mb-4 animate-bounce">🌙</div>
        <h1 className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 mb-2 tracking-wider">
          ZODIAC CASTLE
        </h1>
        <p className="text-purple-300 text-xs sm:text-sm italic">
          ✨ enter the witch's chamber · guess the stars · both must see true ✨
        </p>
      </div>

      {/* Identity Display */}
      <div className="mb-8 flex items-center gap-3 px-4 sm:px-6 py-2 sm:py-3 rounded-full witchy-border animate-cosmic">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-lg"
          style={{ backgroundColor: identity.color }}
        >
          {getZodiacEmoji('Leo')}
        </div>
        <span className="text-purple-200 text-xs sm:text-sm font-mono">{identity.username}</span>
      </div>

      {/* Game Rooms */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full max-w-5xl relative z-10">
        {availableRooms.map((room, idx) => (
          <RoomCard
            key={room.id}
            room={room}
            onJoin={() => handleJoinRoom(room.id)}
            delay={idx}
          />
        ))}

        {availableRooms.length === 0 && (
          <div className="col-span-full text-center py-12 sm:py-16 animate-cosmic">
            <div className="text-3xl sm:text-4xl mb-4">🔮</div>
            <div className="text-purple-300 text-xs sm:text-sm mb-6">
              no chambers available · opening a new mystical portal...
            </div>
            <button
              onClick={() => {
                playSound('select');
                handleJoinRoom(null);
              }}
              className="px-6 sm:px-8 py-2 sm:py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-lg transition-all font-bold witchy-border portal-glow active:scale-95"
            >
              ✨ ENTER THE CHAMBER ✨
            </button>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-12 sm:mt-16 text-purple-400 text-xs text-center max-w-md relative z-10 italic">
        👁️ wait for a soul · read the cosmic hints · guess their sign · both must divine correctly 👁️
      </div>

      {/* Bottom decoration */}
      <div className="absolute bottom-4 text-lg sm:text-2xl opacity-20 animate-rotate-slow">
        {['♈', '♉', '♊', '♋', '♌', '♍'].map((sign, i) => (
          <span key={i} className="mx-1 sm:mx-2">{sign}</span>
        ))}
      </div>
    </div>
  );
}

function RoomCard({ room, onJoin, delay }) {
  const [isHovered, setIsHovered] = useState(false);
  const zodiacEmojis = ['🔮', '✨', '🌙', '⭐', '🌟', '💫'];
  const emoji = zodiacEmojis[room.occupants % zodiacEmojis.length];

  return (
    <button
      onClick={onJoin}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ animationDelay: `${delay * 0.1}s` }}
      className="animate-cosmic relative group rounded-lg p-8 transition-all duration-300 witchy-border"
    >
      {isHovered && <div className="portal-glow absolute inset-0 rounded-lg" />}

      {/* Room decoration */}
      <div className="absolute top-3 right-3 text-3xl opacity-50 group-hover:opacity-100 transition-opacity">
        {emoji}
      </div>

      {/* Room Info */}
      <div className="text-purple-400 text-xs font-mono mb-3">
        🔮 chamber {room.id.slice(0, 8)}
      </div>

      {/* Occupancy */}
      <div className="flex items-baseline gap-2 mb-4">
        <span className="text-white text-3xl font-black">{room.occupants}</span>
        <span className="text-purple-300 text-sm">
          {room.occupants === 1 ? '👻 soul waiting' : '👫 full'}
        </span>
      </div>

      {/* Status */}
      <div className="text-purple-200 text-xs font-bold">
        {room.occupants === 1 ? '✨ JOIN NOW ✨' : '🚫 FULL'}
      </div>
    </button>
  );
}
