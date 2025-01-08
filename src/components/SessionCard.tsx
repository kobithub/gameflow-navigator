import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Timer, Pause, Play, Square, Plus } from "lucide-react";
import { SessionEvent, GameSession } from "@/types/session";

interface SessionCardProps {
  session: GameSession;
  elapsedTime: number;
  onPause: (id: string) => void;
  onResume: (id: string) => void;
  onEnd: (id: string) => void;
  onAddEvent: (id: string, e: React.FormEvent) => void;
  onNameChange: (id: string, name: string) => void;
  newEventValue: string;
  onNewEventChange: (value: string) => void;
}

export const SessionCard = ({
  session,
  elapsedTime,
  onPause,
  onResume,
  onEnd,
  onAddEvent,
  onNameChange,
  newEventValue,
  onNewEventChange
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

        <div className="flex space-x-2">
          {session.status === 'active' && (
            <>
              <Button
                onClick={() => onPause(session.id)}
                variant="secondary"
                className="bg-gaming-secondary hover:bg-gaming-secondary/80 text-white"
              >
                <Pause className="w-4 h-4 mr-2" /> Pause
              </Button>
              <Button
                onClick={() => onEnd(session.id)}
                variant="destructive"
              >
                <Square className="w-4 h-4 mr-2" /> End
              </Button>
            </>
          )}
          {session.status === 'paused' && (
            <>
              <Button
                onClick={() => onResume(session.id)}
                className="bg-gaming-accent hover:bg-gaming-accent/80 text-white"
              >
                <Play className="w-4 h-4 mr-2" /> Resume
              </Button>
              <Button
                onClick={() => onEnd(session.id)}
                variant="destructive"
              >
                <Square className="w-4 h-4 mr-2" /> End
              </Button>
            </>
          )}
        </div>

        <form onSubmit={(e) => onAddEvent(session.id, e)} className="flex space-x-2">
          <Input
            value={newEventValue}
            onChange={(e) => onNewEventChange(e.target.value)}
            placeholder="Record event..."
            className="flex-1 bg-white/10 text-white placeholder:text-white/50"
          />
          <Button type="submit" variant="secondary">
            <Plus className="w-4 h-4 mr-2" /> Add Event
          </Button>
        </form>

        {session.events.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white">Session Events</h3>
            <div className="space-y-2">
              {session.events.map((event, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-4 p-2 rounded bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <span className="text-sm text-gaming-secondary">
                    {event.timestamp.toLocaleTimeString()}
                  </span>
                  <span className="text-white">{event.description}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};