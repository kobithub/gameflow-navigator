import React from 'react';
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Timer } from "lucide-react";
import { GameSession, GameEventType } from "@/types/session";
import { SessionControls } from "./SessionControls";
import { EventsGrid } from "./EventsGrid";
import { EventsList } from "./EventsList";

interface SessionCardProps {
  session: GameSession;
  elapsedTime: number;
  onPause: (id: string) => void;
  onResume: (id: string) => void;
  onEnd: (id: string) => void;
  onAddEvent: (id: string, eventType: GameEventType) => void;
  onNameChange: (id: string, name: string) => void;
}

export const SessionCard = ({
  session,
  elapsedTime,
  onPause,
  onResume,
  onEnd,
  onAddEvent,
  onNameChange
}: SessionCardProps) => {
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="p-6 bg-gaming-primary bg-opacity-95 border-gaming-secondary">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <Input
            value={session.name}
            onChange={(e) => onNameChange(session.id, e.target.value)}
            placeholder="Session Name"
            className="max-w-[200px] bg-white/10 text-white placeholder:text-white/50"
          />
          <div className="flex items-center space-x-2">
            <Timer className="w-5 h-5 text-gaming-secondary" />
            <span className="text-xl font-mono text-gaming-secondary">
              {formatTime(elapsedTime)}
            </span>
          </div>
        </div>

        <SessionControls
          status={session.status}
          onPause={() => onPause(session.id)}
          onResume={() => onResume(session.id)}
          onEnd={() => onEnd(session.id)}
        />

        {session.status === 'active' && (
          <EventsGrid onAddEvent={(eventType) => onAddEvent(session.id, eventType)} />
        )}

        <EventsList events={session.events} />
      </div>
    </Card>
  );
};