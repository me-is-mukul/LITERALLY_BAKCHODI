import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

const app = express();
const httpServer = createServer(app);
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN;
const corsOrigin = CLIENT_ORIGIN ? CLIENT_ORIGIN : true; // true reflects request origin
const io = new Server(httpServer, {
  cors: {
    origin: corsOrigin,
    methods: ["GET", "POST"]
  }
});

// Zodiac calculation
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
    'Aries': ['Courageous', 'Passionate', 'Impulsive', 'Leadership'],
    'Taurus': ['Reliable', 'Stubborn', 'Practical', 'Sensual'],
    'Gemini': ['Adaptable', 'Intellectual', 'Curious', 'Communicative'],
    'Cancer': ['Emotional', 'Protective', 'Intuitive', 'Loyal'],
    'Leo': ['Confident', 'Creative', 'Generous', 'Dramatic'],
    'Virgo': ['Analytical', 'Practical', 'Perfectionistic', 'Detail-oriented'],
    'Libra': ['Diplomatic', 'Fair-minded', 'Artistic', 'Social'],
    'Scorpio': ['Secretive', 'Powerful', 'Intense', 'Mysterious'],
    'Sagittarius': ['Optimistic', 'Adventure-loving', 'Philosophical', 'Honest'],
    'Capricorn': ['Disciplined', 'Responsible', 'Ambitious', 'Self-controlled'],
    'Aquarius': ['Independent', 'Intellectual', 'Humanitarian', 'Eccentric'],
    'Pisces': ['Artistic', 'Gentle', 'Wise', 'Compassionate']
  };

  return hints[zodiacSign] || [];
}

// Diagnostic: log engine handshake/connect errors
io.engine.on && io.engine.on('connection_error', (err) => {
  console.error('Socket engine connection_error:', err);
});

// In-memory state
const rooms = new Map();
const userRooms = new Map();

// Room management
function getOrCreateRoom() {
  // Find room with < 2 people
  for (const [roomId, room] of rooms.entries()) {
    if (room.users.size < 2) {
      return roomId;
    }
  }

  // Create new room
  const roomId = uuidv4();
  rooms.set(roomId, {
    id: roomId,
    users: new Map(),
    gameState: {
      phase: 'waiting', // waiting, guessing, results
      birthdates: new Map(),
      zodiacSigns: new Map(),
      guesses: new Map(), // userId -> [guess1, guess2]
      guessedCorrectly: new Map() // userId -> boolean
    },
    activity: 0,
    lastActivity: Date.now()
  });

  return roomId;
}

function getRoomsList() {
  return Array.from(rooms.values()).map(room => ({
    id: room.id,
    occupants: room.users.size,
    activity: room.activity
  }));
}

function calculateActivity(room) {
  const now = Date.now();
  const timeSinceActivity = now - room.lastActivity;
  
  // Activity decays over 10 seconds
  const decay = Math.max(0, 1 - (timeSinceActivity / 10000));
  return decay;
}

function cleanupEmptyRooms() {
  for (const [roomId, room] of rooms.entries()) {
    if (room.users.size === 0) {
      rooms.delete(roomId);
    }
  }
}

// Socket.IO handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  console.log('Handshake origin:', socket.handshake?.headers?.origin, 'address:', socket.handshake?.address);

  // Send current rooms
  socket.on('get_rooms', () => {
    socket.emit('rooms_update', getRoomsList());
  });

  // Join room
  socket.on('join_room', ({ roomId, identity }) => {
    if (!roomId) {
      roomId = getOrCreateRoom();
    }

    const room = rooms.get(roomId);
    if (!room) return;

    // Add user to room
    socket.join(roomId);
    userRooms.set(socket.id, roomId);
    
    room.users.set(socket.id, {
      id: socket.id,
      username: identity.username,
      color: identity.color,
      avatar: identity.avatar,
      x: 50,
      y: 50
    });

    // Notify others in room (silently - no join message)
    socket.to(roomId).emit('user_joined', {
      userId: socket.id,
      username: identity.username,
      color: identity.color,
      avatar: identity.avatar
    });

    // Update rooms list
    io.emit('rooms_update', getRoomsList());

    console.log(`User ${identity.username} joined room ${roomId}`);
  });

  // Submit birthdate
  socket.on('submit_birthdate', ({ roomId, birthDate }) => {
    const room = rooms.get(roomId);
    if (!room) return;

    const zodiacSign = getZodiacSign(birthDate);
    room.gameState.birthdates.set(socket.id, birthDate);
    room.gameState.zodiacSigns.set(socket.id, zodiacSign);

    // When both players have submitted birthdate, send hints
    if (room.gameState.zodiacSigns.size === 2) {
      room.gameState.phase = 'guessing';

      // Get the other player's zodiac sign
      const userIds = Array.from(room.gameState.zodiacSigns.keys());
      const otherUserId = userIds.find(id => id !== socket.id);
      const otherZodiacSign = room.gameState.zodiacSigns.get(otherUserId);
      const hints = getHints(otherZodiacSign);

      // Send to both players
      io.to(roomId).emit('game_start', {
        hints: hints,
        guessCount: 0
      });
    }
  });

  // Make a guess
  socket.on('make_guess', ({ roomId, guess }) => {
    const room = rooms.get(roomId);
    if (!room || room.gameState.phase !== 'guessing') return;

    const zodiacSign = room.gameState.zodiacSigns.get(socket.id);
    if (!room.gameState.guesses.has(socket.id)) {
      room.gameState.guesses.set(socket.id, []);
    }

    const userGuesses = room.gameState.guesses.get(socket.id);
    userGuesses.push(guess);

    // Get other player's zodiac sign to check if guess is correct
    const userIds = Array.from(room.gameState.zodiacSigns.keys());
    const otherUserId = userIds.find(id => id !== socket.id);
    const otherZodiacSign = room.gameState.zodiacSigns.get(otherUserId);

    const isCorrect = guess === otherZodiacSign;

    // Send response (without revealing correctness)
    socket.emit('guess_response', {
      guessCount: userGuesses.length
    });

    // Check if both players made 2 guesses or got it right
    const userIds2 = Array.from(room.gameState.zodiacSigns.keys());
    const allUsersGuessed = userIds2.every(id => {
      const guesses = room.gameState.guesses.get(id) || [];
      return guesses.length === 2 || guesses.includes(room.gameState.zodiacSigns.get(userIds2.find(u => u !== id)));
    });

    if (allUsersGuessed) {
      room.gameState.phase = 'results';

      // Calculate results for each player
      const results = {};
      for (const [userId, guesses] of room.gameState.guesses.entries()) {
        const otherUserId = userIds2.find(id => id !== userId);
        const otherZodiac = room.gameState.zodiacSigns.get(otherUserId);
        results[userId] = guesses.includes(otherZodiac);
      }

      // Broadcast final results (don't tell who was right/wrong)
      io.to(roomId).emit('game_results', {
        bothCorrect: results[userIds2[0]] && results[userIds2[1]],
        message: (results[userIds2[0]] && results[userIds2[1]]) ? 'Both guessed correctly!' : 'Not both correct. Try again?'
      });
    }
  });

  // Disconnect
  socket.on('disconnect', () => {
    const roomId = userRooms.get(socket.id);
    if (!roomId) return;

    const room = rooms.get(roomId);
    if (room) {
      room.users.delete(socket.id);
      
      // Notify others (silently)
      socket.to(roomId).emit('user_left', { userId: socket.id });
    }

    userRooms.delete(socket.id);
    cleanupEmptyRooms();
    
    // Update rooms list
    io.emit('rooms_update', getRoomsList());

    console.log('User disconnected:', socket.id);
  });
});

// Activity decay interval
setInterval(() => {
  for (const room of rooms.values()) {
    room.activity = calculateActivity(room);
  }
  io.emit('rooms_update', getRoomsList());
}, 1000);

// Auto-create seed rooms
function ensureMinimumRooms() {
  if (rooms.size < 3) {
    getOrCreateRoom();
  }
}

setInterval(ensureMinimumRooms, 5000);
ensureMinimumRooms();

// Health / diagnostic endpoint
app.get('/_status', (req, res) => {
  res.json({ status: 'ok', rooms: rooms.size, origin: req.headers.origin || req.headers.host });
});

// Serve built frontend when available (production)
const distPath = path.resolve(process.cwd(), '..', 'dist');
try {
  // If the Vite build exists, serve static files from it
  // This makes the backend a single deployable image that serves the frontend
  app.use(express.static(distPath));

  // Serve index.html for SPA routes
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
} catch (err) {
  // if dist doesn't exist, continue — frontend can be served separately in dev
}

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`🕳️  GhostRooms server running on port ${PORT}`);
});