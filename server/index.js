import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

const app = express();
const httpServer = createServer(app);
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN;
const corsOrigin = CLIENT_ORIGIN ? CLIENT_ORIGIN : true;
const io = new Server(httpServer, {
  cors: {
    origin: corsOrigin,
    methods: ['GET', 'POST']
  }
});

const staticRoot = path.resolve(process.cwd(), '../dist');
app.use(express.static(staticRoot));
app.get('*', (req, res) => {
  res.sendFile(path.join(staticRoot, 'index.html'));
});

function getZodiacSign(birthDate) {
  const date = new Date(birthDate);
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const zodiacSigns = [
    { name: 'Capricorn', start: [12, 22], end: [1, 19] },
    { name: 'Aquarius', start: [1, 20], end: [2, 18] },
    { name: 'Pisces', start: [2, 19], end: [3, 20] },
    { name: 'Aries', start: [3, 21], end: [4, 19] },
    { name: 'Taurus', start: [4, 20], end: [5, 20] },
    { name: 'Gemini', start: [5, 21], end: [6, 20] },
    { name: 'Cancer', start: [6, 21], end: [7, 22] },
    { name: 'Leo', start: [7, 23], end: [8, 22] },
    { name: 'Virgo', start: [8, 23], end: [9, 22] },
    { name: 'Libra', start: [9, 23], end: [10, 22] },
    { name: 'Scorpio', start: [10, 23], end: [11, 21] },
    { name: 'Sagittarius', start: [11, 22], end: [12, 21] }
  ];

  for (const sign of zodiacSigns) {
    const [startMonth, startDay] = sign.start;
    const [endMonth, endDay] = sign.end;
    let inRange = false;

    if (startMonth === endMonth) {
      inRange = month === startMonth && day >= startDay && day <= endDay;
    } else if (startMonth > endMonth) {
      inRange = (month === startMonth && day >= startDay) || (month === endMonth && day <= endDay);
    } else {
      inRange = (month === startMonth && day >= startDay) || (month === endMonth && day <= endDay);
    }

    if (inRange) return sign.name;
  }

  return 'Capricorn';
}

function getHints(zodiacSign) {
  const hints = {
    Aries: ['Courageous', 'Passionate', 'Impulsive', 'Leadership'],
    Taurus: ['Reliable', 'Stubborn', 'Practical', 'Sensual'],
    Gemini: ['Adaptable', 'Intellectual', 'Curious', 'Communicative'],
    Cancer: ['Emotional', 'Protective', 'Intuitive', 'Loyal'],
    Leo: ['Confident', 'Creative', 'Generous', 'Dramatic'],
    Virgo: ['Analytical', 'Practical', 'Perfectionistic', 'Detail-oriented'],
    Libra: ['Diplomatic', 'Fair-minded', 'Artistic', 'Social'],
    Scorpio: ['Secretive', 'Powerful', 'Intense', 'Mysterious'],
    Sagittarius: ['Optimistic', 'Adventure-loving', 'Philosophical', 'Honest'],
    Capricorn: ['Disciplined', 'Responsible', 'Ambitious', 'Self-controlled'],
    Aquarius: ['Independent', 'Intellectual', 'Humanitarian', 'Eccentric'],
    Pisces: ['Artistic', 'Gentle', 'Wise', 'Compassionate']
  };

  return hints[zodiacSign] || [];
}

const rooms = new Map();
const userRooms = new Map();
const winningLines = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

function createEmptyGameState() {
  return {
    phase: 'waiting',
    boards: Array.from({ length: 9 }, () => Array(9).fill(null)),
    boardWinners: Array(9).fill(null),
    currentPlayerId: null,
    activeBoard: null,
    macroWinner: null,
    gameOver: false
  };
}

function createRoom() {
  const roomId = uuidv4();
  rooms.set(roomId, {
    id: roomId,
    users: new Map(),
    gameState: createEmptyGameState(),
    lastActivity: Date.now()
  });
  return roomId;
}

function getOrCreateRoom() {
  for (const [roomId, room] of rooms.entries()) {
    if (room.users.size < 2) {
      return roomId;
    }
  }
  return createRoom();
}

function ensureOpenRoomExists() {
  if (!Array.from(rooms.values()).some((room) => room.users.size < 2)) {
    createRoom();
  }
}

function cleanupEmptyRooms() {
  for (const [roomId, room] of rooms.entries()) {
    if (room.users.size === 0) {
      rooms.delete(roomId);
    }
  }
}

function getRoomsList() {
  cleanupEmptyRooms();
  return Array.from(rooms.values()).map((room) => ({
    id: room.id,
    occupants: room.users.size,
    status: room.users.size === 2 ? 'playing' : 'waiting'
  }));
}

function getRoomPlayers(room) {
  return Array.from(room.users.values()).map((user) => ({
    id: user.id,
    username: user.username,
    color: user.color,
    avatar: user.avatar,
    sign: user.sign
  }));
}

function computeWinner(cells) {
  for (const [a, b, c] of winningLines) {
    if (cells[a] && cells[a] === cells[b] && cells[b] === cells[c]) {
      return cells[a];
    }
  }
  return null;
}

function isFull(cells) {
  return cells.every(Boolean);
}

function startGame(room) {
  room.gameState = createEmptyGameState();
  room.gameState.phase = 'playing';
  room.gameState.currentPlayerId = Array.from(room.users.keys())[0];
  room.gameState.activeBoard = null;
  room.gameState.macroWinner = null;
  room.gameState.gameOver = false;
}

function sendRoomUpdate(room) {
  io.to(room.id).emit('room_update', {
    roomId: room.id,
    players: getRoomPlayers(room),
    gameState: room.gameState
  });
}

function cleanupUserFromRoom(socket, room) {
  if (!room) return;
  room.users.delete(socket.id);
  userRooms.delete(socket.id);
  socket.leave(room.id);

  if (room.users.size === 0) {
    rooms.delete(room.id);
  } else {
    room.gameState = createEmptyGameState();
    room.gameState.phase = 'waiting';
    sendRoomUpdate(room);
  }

  io.emit('rooms_update', getRoomsList());
  ensureOpenRoomExists();
}

io.engine.on?.('connection_error', (err) => {
  console.error('Socket engine connection_error:', err);
});

io.on('connection', (socket) => {
  socket.on('get_rooms', () => {
    socket.emit('rooms_update', getRoomsList());
  });

  socket.on('join_room', ({ roomId, identity, sign }) => {
    if (!roomId) {
      roomId = getOrCreateRoom();
    }

    let room = rooms.get(roomId);
    if (!room || room.users.size >= 2) {
      roomId = getOrCreateRoom();
      room = rooms.get(roomId);
    }

    socket.join(roomId);
    userRooms.set(socket.id, roomId);
    room.users.set(socket.id, {
      id: socket.id,
      username: identity.username,
      color: identity.color,
      avatar: identity.avatar,
      sign
    });
    room.lastActivity = Date.now();

    if (room.users.size === 2) {
      startGame(room);
      ensureOpenRoomExists();
    }

    socket.emit('joined_room', {
      roomId,
      players: getRoomPlayers(room),
      gameState: room.gameState
    });

    sendRoomUpdate(room);
    io.emit('rooms_update', getRoomsList());
  });

  socket.on('leave_room', ({ roomId }) => {
    const room = rooms.get(roomId);
    cleanupUserFromRoom(socket, room);
  });

  socket.on('make_move', ({ roomId, boardIdx, cellIdx }) => {
    const room = rooms.get(roomId);
    if (!room || room.gameState.phase !== 'playing') return;
    if (room.gameState.currentPlayerId !== socket.id) return;
    if (room.gameState.boardWinners[boardIdx] || room.gameState.boards[boardIdx][cellIdx]) return;

    room.gameState.boards[boardIdx][cellIdx] = socket.id;
    const miniWinner = computeWinner(room.gameState.boards[boardIdx]);

    if (miniWinner) {
      room.gameState.boardWinners[boardIdx] = miniWinner;
    } else if (isFull(room.gameState.boards[boardIdx])) {
      room.gameState.boardWinners[boardIdx] = 'T';
    }

    const macroWinner = computeWinner(room.gameState.boardWinners);
    room.gameState.macroWinner = macroWinner;
    room.gameState.gameOver = Boolean(macroWinner) || room.gameState.boardWinners.every((value) => value !== null);
    room.gameState.phase = room.gameState.gameOver ? 'ended' : 'playing';

    const nextActive = room.gameState.boardWinners[cellIdx] ? null : cellIdx;
    room.gameState.activeBoard = nextActive;

    const nextPlayers = Array.from(room.users.keys());
    room.gameState.currentPlayerId = room.gameState.gameOver ? null : nextPlayers.find((id) => id !== socket.id);

    sendRoomUpdate(room);
  });

  socket.on('disconnect', () => {
    const roomId = userRooms.get(socket.id);
    if (!roomId) return;
    const room = rooms.get(roomId);
    cleanupUserFromRoom(socket, room);
  });
});

ensureOpenRoomExists();

httpServer.listen(3001, () => {
  console.log('Socket server listening on port 3001');
});
