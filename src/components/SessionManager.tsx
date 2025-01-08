import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Timer, Pause, Play, Square, Plus } from "lucide-react";

type SessionStatus = 'idle' | 'active' | 'paused';

interface SessionEvent {
  timestamp: Date;
  description: string;
}

export const SessionManager = () => {
  const [status, setStatus] = useState<SessionStatus>('idle');
  const [events, setEvents] = useState<SessionEvent[]>([]);
  const [newEvent, setNewEvent] = useState('');
  const [sessionStart, setSessionStart] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (status === 'active' && sessionStart) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((new Date().getTime() - sessionStart.getTime()) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [status, sessionStart]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startSession = () => {
    setSessionStart(new Date());
    setStatus('active');
    setEvents([]);
    toast.success("Session started!");
  };

  const pauseSession = () => {
    setStatus('paused');
    toast.info("Session paused");
  };

  const resumeSession = () => {
    setStatus('active');
    toast.success("Session resumed");
  };

  const endSession = () => {
    setStatus('idle');
    setSessionStart(null);
    setElapsedTime(0);
    toast.info("Session ended");
  };

  const addEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.trim()) return;

    const event = {
      timestamp: new Date(),
      description: newEvent.trim()
    };

    setEvents(prev => [...prev, event]);
    setNewEvent('');
    toast.success("Event recorded");
  };

  return (
    <div className="container max-w-4xl mx-auto p-4 space-y-6">
      <Card className="p-6 bg-gaming-primary bg-opacity-95 border-gaming-secondary">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Gaming Session Manager</h2>
            <div className="flex items-center space-x-2">
              <Timer className="w-5 h-5 text-gaming-secondary" />
              <span className="text-xl font-mono text-gaming-secondary">
                {formatTime(elapsedTime)}
              </span>
            </div>
          </div>

          <div className="flex space-x-2">
            {status === 'idle' && (
              <Button
                onClick={startSession}
                className="bg-gaming-accent hover:bg-gaming-accent/80 text-white"
              >
                <Play className="w-4 h-4 mr-2" /> Start Session
              </Button>
            )}
            {status === 'active' && (
              <>
                <Button
                  onClick={pauseSession}
                  variant="secondary"
                  className="bg-gaming-secondary hover:bg-gaming-secondary/80 text-white"
                >
                  <Pause className="w-4 h-4 mr-2" /> Pause
                </Button>
                <Button
                  onClick={endSession}
                  variant="destructive"
                >
                  <Square className="w-4 h-4 mr-2" /> End
                </Button>
              </>
            )}
            {status === 'paused' && (
              <>
                <Button
                  onClick={resumeSession}
                  className="bg-gaming-accent hover:bg-gaming-accent/80 text-white"
                >
                  <Play className="w-4 h-4 mr-2" /> Resume
                </Button>
                <Button
                  onClick={endSession}
                  variant="destructive"
                >
                  <Square className="w-4 h-4 mr-2" /> End
                </Button>
              </>
            )}
          </div>

          {status !== 'idle' && (
            <form onSubmit={addEvent} className="flex space-x-2">
              <Input
                value={newEvent}
                onChange={(e) => setNewEvent(e.target.value)}
                placeholder="Record event..."
                className="flex-1 bg-white/10 text-white placeholder:text-white/50"
              />
              <Button type="submit" variant="secondary">
                <Plus className="w-4 h-4 mr-2" /> Add Event
              </Button>
            </form>
          )}
        </div>
      </Card>

      {events.length > 0 && (
        <Card className="p-6 bg-gaming-primary bg-opacity-95 border-gaming-secondary">
          <h3 className="text-xl font-bold mb-4 text-white">Session Events</h3>
          <div className="space-y-2">
            {events.map((event, index) => (
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
        </Card>
      )}
    </div>
  );
};