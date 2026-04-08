import { useEffect, useState } from 'react';
import ZodiacIcon from './ZodiacIcon';
import { getZodiacColor, zodiacData } from '../utils/zodiacUI';
import { playSound } from '../utils/sounds';

const zodiacSigns = Object.keys(zodiacData);

export default function Lobby({ socket, identity, onJoinRoom }) {
  const [selectedSign, setSelectedSign] = useState('Aries');
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    if (!socket) return;

    socket.emit('get_rooms');
    socket.on('rooms_update', setRooms);

    return () => {
      socket.off('rooms_update', setRooms);
    };
  }, [socket]);

  const handleJoin = (roomId) => {
    playSound('select');
    onJoinRoom({ roomId, sign: selectedSign });
  };

  const handleCreate = () => {
    playSound('select');
    onJoinRoom({ roomId: null, sign: selectedSign });
  };

  const openRooms = rooms.filter((room) => room.occupants < 2);

  return (
    <div className="h-screen w-full overflow-hidden relative bg-black text-white animate-ethereal">
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-900/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-800/10 rounded-full blur-3xl -z-10" />
      <div className="relative z-10 flex h-full w-full flex-col px-4 py-6 sm:px-6 sm:py-8 overflow-y-auto scrollbar-hide">
        <div className="flex-none text-center mb-6">
          <div className="mx-auto mb-4 inline-flex h-20 w-20 items-center justify-center rounded-full bg-white text-5xl text-black shadow-lg shadow-black/20">
            <ZodiacIcon sign={selectedSign} size={56} />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 mb-2 tracking-wider">
            ZODIAC BATTLE ROOMS
          </h1>
          <p className="text-purple-300 text-xs sm:text-sm max-w-2xl mx-auto">
            Choose a zodiac sprite, enter a chamber, and battle it out.
          </p>
        </div>

        <div className="flex-none mb-4 flex flex-wrap items-center justify-center gap-3 rounded-full border border-purple-700/50 bg-black/40 px-4 py-3 text-xs sm:text-sm text-purple-200 shadow-lg shadow-purple-900/10">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-black text-sm" style={{ color: identity.color }}>
            {selectedSign.slice(0, 1)}
          </span>
          <span className="font-semibold text-xs sm:text-sm">{identity.username}</span>
        </div>

        <div className="flex-1 grid gap-4 w-full max-w-4xl mx-auto min-h-0">
          <div className="rounded-2xl border border-purple-700/50 bg-gradient-to-br from-purple-950/40 to-black/60 p-4 sm:p-6 shadow-lg shadow-purple-900/20 backdrop-blur-sm overflow-y-auto scrollbar-hide">
          <div className="mb-4 text-xs sm:text-sm text-purple-300 uppercase tracking-[0.2em] font-bold flex items-center gap-2">
            <span className="inline-block w-2 h-2 bg-pink-400 rounded-full flex-shrink-0"></span>
            <span>Choose your constellation</span>
            <span className="inline-block w-2 h-2 bg-purple-400 rounded-full flex-shrink-0"></span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {zodiacSigns.map((sign) => (
              <button
                key={sign}
                type="button"
                onClick={() => setSelectedSign(sign)}
                className={`rounded-2xl border transition-all duration-300 px-2 py-3 text-center transform hover:scale-105 active:scale-95 ${
                  selectedSign === sign
                    ? 'border-pink-400 bg-gradient-to-br from-pink-500/30 to-purple-500/20 shadow-lg shadow-pink-500/30 ring-2 ring-pink-400/50'
                    : 'border-purple-600/40 bg-purple-950/30 text-purple-100 hover:border-purple-400/60 hover:bg-purple-900/40'
                }`}
              >
                <div className="mb-2 flex items-center justify-center">
                  <ZodiacIcon sign={sign} size={44} animate={selectedSign === sign} />
                </div>
                <div className="text-xs font-semibold uppercase tracking-[0.15em] text-purple-200">{sign}</div>
              </button>
            ))}
          </div>
        </div>

          <div className="rounded-2xl border border-purple-700/50 bg-gradient-to-br from-purple-950/40 to-black/60 p-4 sm:p-6 shadow-lg shadow-purple-900/20 backdrop-blur-sm overflow-y-auto scrollbar-hide">
            <div className="mb-4 text-xs sm:text-sm text-purple-300 uppercase tracking-[0.2em] font-bold flex items-center gap-2">
              <span className="inline-block w-2 h-2 bg-pink-400 rounded-full flex-shrink-0"></span>
              <span>Waiting chambers</span>
              <span className="inline-block w-2 h-2 bg-purple-400 rounded-full flex-shrink-0"></span>
            </div>
            {rooms.length === 0 ? (
              <div className="text-purple-300 text-xs sm:text-sm text-center py-8">
                <div className="animate-spin-slow inline-block mb-2 text-2xl opacity-40">✦</div>
                <div>No chambers open yet...</div>
              </div>
            ) : (
              <div className="space-y-2">
              {rooms.map((room) => (
                <div key={room.id} className="flex items-center justify-between gap-2 sm:gap-3 rounded-xl border border-purple-600/40 p-3 bg-purple-950/20 hover:border-purple-400/60 hover:bg-purple-900/30 transition-all duration-300">
                  <div className="min-w-0">
                    <div className="text-xs uppercase tracking-[0.2em] text-purple-400 font-semibold">Chamber</div>
                    <div className="text-xs sm:text-sm text-white font-mono truncate">{room.id.slice(0, 8)}</div>
                  </div>
                  <div className="text-right text-xs text-purple-300 flex-shrink-0">
                    <div className="font-semibold">{room.occupants}/2</div>
                    <div className={`text-xs ${room.status === 'playing' ? 'text-pink-400' : 'text-emerald-400'}`}>
                      {room.status === 'playing' ? '⚔️' : '⏳'}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleJoin(room.id)}
                    disabled={room.occupants >= 2}
                    className={`text-xs font-bold px-3 py-2 rounded-full transition-all duration-200 flex-shrink-0 ${
                      room.occupants >= 2
                        ? 'bg-gray-700 text-gray-400 cursor-not-allowed opacity-50'
                        : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-500 hover:to-pink-500 active:scale-95 shadow-lg shadow-purple-600/30'
                    }`}
                  >
                    {room.occupants < 2 ? 'Join' : 'Full'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        </div>

        <div className="flex-none mt-4 w-full max-w-4xl mx-auto">
          <button
            type="button"
            onClick={handleCreate}
            className="w-full py-3 sm:py-4 rounded-2xl text-xs sm:text-sm font-bold transition-all text-white witchy-border bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 portal-glow active:scale-95"
          >
            + Create New Chamber
          </button>
        </div>
      </div>
    </div>
  );
}
