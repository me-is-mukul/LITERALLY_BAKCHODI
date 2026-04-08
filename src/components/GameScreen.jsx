import { getZodiacColor } from '../utils/zodiacUI';
import ZodiacIcon from './ZodiacIcon';

export default function GameScreen({ socket, roomId, players, gameState, myId, onLeave }) {
  const myPlayer = players.find((player) => player.id === myId);
  const currentPlayer = players.find((player) => player.id === gameState?.currentPlayerId);
  const currentColor = currentPlayer ? getZodiacColor(currentPlayer.sign) : '#9f7aea';

  const handleCellClick = (boardIdx, cellIdx) => {
    if (!gameState || gameState.gameOver) return;
    if (gameState.currentPlayerId !== myId) return;
    if (gameState.boardWinners[boardIdx]) return;
    if (gameState.boards[boardIdx][cellIdx]) return;
    if (gameState.activeBoard !== null && gameState.activeBoard !== boardIdx) return;

    socket.emit('make_move', { roomId, boardIdx, cellIdx });
  };

  const getPlayerById = (id) => players.find((player) => player.id === id) || { sign: '' };

  return (
    <div className="h-screen w-full overflow-hidden flex flex-row items-center justify-between px-4 py-4 gap-6">
      {/* LEFT SIDE - GAME BOARD */}
      <div className="flex-1 flex flex-col items-center justify-center min-w-0 max-h-full">
        <div className="grid grid-cols-3 gap-1.5 w-full max-w-md">
          {gameState.boards.map((board, boardIdx) => {
            const winnerId = gameState.boardWinners[boardIdx];
            const isActive = gameState.activeBoard === null || gameState.activeBoard === boardIdx;
            const isDisabled = gameState.gameOver || Boolean(winnerId) || (gameState.activeBoard !== null && gameState.activeBoard !== boardIdx);

            return (
              <div key={boardIdx} className={`relative aspect-square rounded-lg border-2 p-1 transition-all duration-300 ${isActive ? 'border-pink-500/80 shadow-[0_0_0_3px_rgba(236,72,153,0.25)] bg-gradient-to-br from-pink-600/10 to-purple-600/5' : 'border-purple-700/40 bg-purple-950/20'} ${winnerId ? 'opacity-90' : ''}`}>
                <div className="absolute top-0.5 left-0.5 text-[6px] uppercase tracking-[0.05em] text-purple-400 font-bold">B{boardIdx + 1}</div>
                <div className="grid grid-cols-3 gap-0.5 h-full">
                  {board.map((cell, cellIdx) => {
                    const occupied = Boolean(cell);
                    const cellPlayer = occupied ? getPlayerById(cell) : null;
                    const isMyCell = occupied && cell === myId;

                    return (
                      <button
                        key={cellIdx}
                        type="button"
                        onClick={() => handleCellClick(boardIdx, cellIdx)}
                        disabled={isDisabled || occupied}
                        className={`aspect-square inline-flex items-center justify-center rounded-md border transition-all duration-200 ${
                          occupied
                            ? isMyCell
                              ? 'bg-white shadow-md border-white/50 cursor-default'
                              : 'bg-orange-400 shadow-md border-orange-300/70 cursor-default'
                            : 'bg-purple-950/40 border-purple-600/40 hover:border-pink-500/70 hover:bg-purple-900/50 cursor-pointer'
                        } ${isDisabled && !occupied ? 'opacity-40 cursor-not-allowed' : ''}`}
                      >
                        {occupied ? <ZodiacIcon sign={cellPlayer.sign} size={18} /> : ''}
                      </button>
                    );
                  })}
                </div>
                {winnerId && (
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-lg bg-black/80 text-white font-black animate-slide-in">
                    <div className="text-center">
                      <div className="text-sm mb-0.5">{winnerId === 'T' ? '🤝' : <ZodiacIcon sign={getPlayerById(winnerId).sign} size={20} />}</div>
                      <div className="text-xs uppercase tracking-[0.08em]">{winnerId === 'T' ? 'Draw' : 'Win'}</div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT SIDE - INFO PANEL */}
      <div className="flex-none w-72 flex flex-col gap-3 py-2 max-h-screen overflow-y-auto scrollbar-hide">
        {/* Current Turn */}
        <div className="rounded-lg border border-purple-700/50 bg-gradient-to-br from-purple-950/40 to-black/60 p-3 shadow-lg shadow-purple-900/20 backdrop-blur-sm">
          <div className="text-xs uppercase tracking-[0.2em] text-purple-400 font-bold mb-2">Current Turn</div>
          <div className="flex flex-col items-center gap-2">
            <ZodiacIcon sign={currentPlayer?.sign || myPlayer?.sign || 'Aries'} size={48} animate={true} />
            <div className="text-sm font-semibold text-purple-200 text-center line-clamp-2">{currentPlayer?.username || '...'}</div>
          </div>
        </div>

        {/* Player Cards */}
        <div className="space-y-2">
          {players.map((player) => (
            <div key={player.id} className={`rounded-lg border-2 transition-all duration-300 p-3 ${player.id === myId ? 'border-pink-500/70 bg-gradient-to-br from-pink-600/15 to-purple-600/10 shadow-lg shadow-pink-500/25' : 'border-purple-500/60 bg-gradient-to-br from-purple-600/15 to-purple-500/10 shadow-lg shadow-purple-500/20'}`}>
              <div className="text-xs uppercase tracking-[0.1em] text-purple-400 font-bold mb-2">{player.id === myId ? '👑 You' : '⚔️ Opponent'}</div>
              <div className="mb-2 flex items-center justify-center">
                <ZodiacIcon sign={player.sign} size={40} colored={true} variant={player.id === myId ? 'player' : 'opponent'} />
              </div>
              <div className="font-bold text-white text-xs text-center">{player.sign}</div>
              <div className="text-xs text-purple-300 text-center truncate">{player.username}</div>
            </div>
          ))}
        </div>

        {/* Status Message */}
        <div className="rounded-lg border border-purple-700/50 bg-purple-950/20 p-3">
          <div className="text-xs text-purple-300 text-center font-medium">
            {gameState.gameOver ? (
              gameState.macroWinner === 'T' ? (
                <div><div className="text-lg mb-1">🌟</div>Draw</div>
              ) : (
                <div><div className="text-lg mb-1">✨</div>{getPlayerById(gameState.macroWinner).sign} wins!</div>
              )
            ) : currentPlayer ? (
              <div><div className="text-lg mb-1">⚔️</div>{currentPlayer.username}'s turn</div>
            ) : (
              <div><div className="text-lg mb-1">⏳</div>Starting...</div>
            )}
          </div>
        </div>

        {/* Back Button */}
        <button
          type="button"
          onClick={() => socket.emit('make_move', { roomId, boardIdx: null, cellIdx: null })}
          className="hidden"
        />
        <button
          type="button"
          onClick={onLeave}
          className="w-full px-4 py-3 rounded-lg border border-purple-600/60 bg-purple-900/30 text-purple-200 font-bold text-xs transition-all duration-200 hover:border-purple-400/80 hover:bg-purple-900/60 active:scale-95"
        >
          ← Back to Lobby
        </button>
      </div>
    </div>
  );
}
