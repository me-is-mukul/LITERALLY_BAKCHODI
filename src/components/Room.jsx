import { useEffect, useRef, useState } from 'react';
import GameScreen from './GameScreen';
import ZodiacIcon from './ZodiacIcon';
import { playSound } from '../utils/sounds';
import { getZodiacSymbol } from '../utils/zodiacUI';

export default function Room({ socket, roomConfig, identity, onLeave }) {
  const [roomId, setRoomId] = useState(roomConfig?.roomId || null);
  const [players, setPlayers] = useState([]);
  const [gameState, setGameState] = useState(null);
  const [loading, setLoading] = useState(true);
  const roomRef = useRef(roomId);

  useEffect(() => {
    if (!socket || !roomConfig) return;

    const currentRoom = roomConfig.roomId || null;
    let joined = false;

    const handleJoinedRoom = ({ roomId: joinedRoomId, players, gameState }) => {
      roomRef.current = joinedRoomId;
      setRoomId(joinedRoomId);
      setPlayers(players);
      setGameState(gameState);
      setLoading(false);
      joined = true;
    };

    const handleRoomUpdate = ({ roomId: updatedRoomId, players, gameState }) => {
      if (roomRef.current && updatedRoomId !== roomRef.current) return;
      setRoomId(updatedRoomId);
      setPlayers(players);
      setGameState(gameState);
      setLoading(false);
    };

    socket.on('joined_room', handleJoinedRoom);
    socket.on('room_update', handleRoomUpdate);

    socket.emit('join_room', { roomId: currentRoom, identity, sign: roomConfig.sign });

    return () => {
      socket.off('joined_room', handleJoinedRoom);
      socket.off('room_update', handleRoomUpdate);
      if (joined || roomRef.current) {
        socket.emit('leave_room', { roomId: roomRef.current });
      }
    };
  }, [socket, roomConfig, identity]);

  if (loading) {
    return (
      <div className="w-full h-full bg-black flex items-center justify-center text-purple-300">
        Connecting to your chamber...
      </div>
    );
  }

  const currentPlayers = players.length > 0 ? players : [];
  const waiting = currentPlayers.length < 2 || gameState?.phase === 'waiting';
  const myPlayer = currentPlayers.find((player) => player.id === socket.id);

  return (
    <div className="h-screen w-full relative bg-black overflow-hidden animate-ethereal">
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-900/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-800/10 rounded-full blur-3xl -z-10" />

      <button
        onClick={() => {
          playSound('click');
          onLeave();
        }}
        className="absolute top-4 left-4 z-50 px-4 py-2 text-xs text-purple-300 hover:text-purple-100 border-2 border-purple-600 rounded-lg hover:border-purple-400 transition-all cursor-pointer font-bold witchy-border active:scale-95"
      >
        RETURN TO LOBBY
      </button>

      <div className="absolute top-4 right-4 z-50 text-right">
        <div className="text-purple-400 text-xs font-mono mb-1 font-bold truncate">
          ZODIAC chamber {roomId?.slice(0, 8)}
        </div>
        <div className="text-purple-300 text-xs font-bold">
          {currentPlayers.length}/2 souls present
        </div>
      </div>

      <div className="h-full w-full flex flex-col items-center justify-between pt-24 pb-6 px-4">
        <div className="w-full max-w-6xl">
          {waiting ? (
            <div className="rounded-3xl border border-purple-700/50 bg-gradient-to-br from-purple-950/40 to-black/60 p-8 text-center text-purple-300 shadow-lg shadow-purple-900/20 backdrop-blur-sm">
              <div className="mx-auto mb-6 inline-flex items-center justify-center rounded-full bg-gradient-to-br from-white to-slate-50 shadow-lg shadow-black/30" style={{ width: 100, height: 100 }}>
                <ZodiacIcon sign={myPlayer?.sign || roomConfig.sign} size={80} animate={true} />
              </div>
              <h2 className="text-2xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-pink-300">Channeling the Cosmos...</h2>
              <p className="text-sm text-purple-400 mb-6 font-medium">Your zodiac constellation is primed for battle</p>

              <div className="flex items-center justify-center gap-2 mb-6">
                <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse"></div>
                <div className="text-purple-400 text-sm font-semibold">Awaiting a worthy opponent...</div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
              </div>

              <div className="bg-purple-950/30 border border-purple-600/30 rounded-2xl p-4 inline-block">
                <div className="text-xs text-purple-400 uppercase tracking-[0.2em] font-bold mb-1">Chamber ID</div>
                <div className="font-mono text-sm text-white">{roomId?.slice(0, 16)}...</div>
              </div>
            </div>
          ) : (
            <GameScreen socket={socket} roomId={roomId} players={currentPlayers} gameState={gameState} myId={socket.id} onLeave={onLeave} />
          )}
        </div>
      </div>
    </div>
  );
}
