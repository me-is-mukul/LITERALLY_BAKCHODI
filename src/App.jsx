import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import Lobby from './components/Lobby';
import Room from './components/Room';
import { generateUsername, generateAvatar } from './utils/identity';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3001');

function App() {
  const [socket, setSocket] = useState(null);
  const [currentView, setCurrentView] = useState('lobby');
  const [roomConfig, setRoomConfig] = useState(null);
  const [identity, setIdentity] = useState(null);

  useEffect(() => {
    const storedIdentity = sessionStorage.getItem('identity');
    if (storedIdentity) {
      setIdentity(JSON.parse(storedIdentity));
    } else {
      const newIdentity = {
        username: generateUsername(),
        avatar: generateAvatar(),
        color: `hsl(${Math.random() * 360}, 70%, 60%)`
      };
      setIdentity(newIdentity);
      sessionStorage.setItem('identity', JSON.stringify(newIdentity));
    }
  }, []);

  useEffect(() => {
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const joinRoom = (config) => {
    setRoomConfig(config);
    setCurrentView('room');
  };

  const leaveRoom = () => {
    setRoomConfig(null);
    setCurrentView('lobby');
  };

  if (!identity || !socket) {
    return (
      <div className="w-screen h-screen bg-black flex items-center justify-center">
        <div className="text-zinc-500 text-sm animate-pulse">materializing...</div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen relative overflow-hidden">
      <div className="absolute inset-0 -z-10" aria-hidden />
      <div className="w-full h-full relative z-10">
        {currentView === 'lobby' ? (
          <Lobby socket={socket} identity={identity} onJoinRoom={joinRoom} />
        ) : (
          <Room socket={socket} roomConfig={roomConfig} identity={identity} onLeave={leaveRoom} />
        )}
      </div>
    </div>
  );
}

export default App;
