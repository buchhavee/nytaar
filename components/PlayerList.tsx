"use client";

import { Player } from "@/types/game";
import { Plus, Minus } from "lucide-react";

interface PlayerListProps {
  players: Player[];
  onAddPlayer: () => void;
  onRemovePlayer: (playerId: string) => void;
  onUpdateScore: (playerId: string, points: number) => void;
  onUpdateName?: (playerId: string, name: string) => void;
}

export default function PlayerList({ players, onAddPlayer, onRemovePlayer, onUpdateScore, onUpdateName }: PlayerListProps) {
  return (
    <div className="w-full mx-auto px-4 py-3">
      <div className="flex flex-wrap gap-2 justify-center items-center max-w-[90vw] mx-auto">
        {players.map((player) => (
          <div key={player.id} className="bg-white/[0.08] backdrop-blur-xl rounded-xl p-3 border border-white/[0.12] shadow-xl min-w-[140px]">
            <div className="flex items-center justify-between mb-2">
              <input type="text" value={player.name} className="bg-transparent text-white font-semibold text-sm outline-none border-b border-white/20 focus:border-[#007AFF] transition-colors flex-1 mr-1 w-[80px]" placeholder="Navn" onChange={(e) => onUpdateName?.(player.id, e.target.value)} />
              <button onClick={() => onRemovePlayer(player.id)} className="text-[#FF453A] hover:text-[#FF6961] transition-colors">
                <Minus size={16} />
              </button>
            </div>
            <div className="text-center">
              <div className="font-mono text-2xl font-bold text-[#FFCC00]">{player.score}</div>
              <div className="text-[10px] text-white/50 mt-0.5 font-medium">point</div>
            </div>
          </div>
        ))}

        {/* Add Player Button */}
        <button onClick={onAddPlayer} className="bg-gradient-to-br from-purple-600/20 to-violet-600/20 hover:from-purple-500/30 hover:to-violet-500/30 backdrop-blur-2xl rounded-xl p-3 border border-transparent hover:border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.2)] hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] min-w-[140px] min-h-[85px] flex items-center justify-center transition-all hover:scale-[1.02]">
          <Plus size={28} className="text-purple-400" />
        </button>
      </div>
    </div>
  );
}
