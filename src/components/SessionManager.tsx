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

interface GameSession {
  id: string;
  status: SessionStatus;
  events: SessionEvent[];
  startTime: Date;
  elapsedTime: number;
}

export const SessionManager = () => {
  const [sessions, setSessions] = useState<GameSession[]>([]);
  const [newEvent, setNewEvent] = useState('');
  const [elapsedTimes, setElapsedTimes] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    let interval: NodeJS.Timeout;
    const activeSession = sessions.find(s => s.status === 'active');
    
    if (activeSession) {
      interval = setInterval(() => {
        setElapsedTimes(prev => ({
          ...prev,
          [activeSession.id]: Math.floor((new Date().getTime() - activeSession.startTime.getTime()) / 1000)
        }));
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [sessions]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startNewSession = () => {
    const newSession: GameSession = {
      id: Date.now().toString(),
      status: 'active',
      events: [],
      startTime: new Date(),
      elapsedTime: 0
    };

    setSessions(prev => {
      // Pause any currently active session
      const updatedSessions = prev.map(session => ({
        ...session,
        status: session.status === 'active' ? 'paused' : session.status
      }));
      return [...updatedSessions, newSession];
    });
    
    setElapsedTimes(prev => ({
      ...prev,
      [newSession.id]: 0
    }));
    
    toast.success("New session started!");
  };

  const pauseSession = (sessionId: string) => {
    setSessions(prev => prev.map(session => 
      session.id === sessionId ? { ...session, status: 'paused' } : session
    ));
    toast.info("Session paused");
  };

  const resumeSession = (sessionId: string) => {
    setSessions(prev => prev.map(session => ({
      ...session,
      status: session.id === sessionId ? 'active' : 
             session.status === 'active' ? 'paused' : session.status,
      startTime: session.id === sessionId ? 
                new Date(new Date().getTime() - (elapsedTimes[session.id] || 0) * 1000) : 
                session.startTime
    })));
    toast.success("Session resumed");
  };

  const endSession = (sessionId: string) => {
    setSessions(prev => prev.filter(session => session.id !== sessionId));
    setElapsedTimes(prev => {
      const newTimes = { ...prev };
      delete newTimes[sessionId];
      return newTimes;
    });
    toast.info("Session ended");
  };

  const addEvent = (sessionId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.trim()) return;

    const event = {
      timestamp: new Date(),
      description: newEvent.trim()
    };

    setSessions(prev => prev.map(session => 
      session.id === sessionId
        ? { ...session, events: [...session.events, event] }
        : session
    ));
    
    setNewEvent('');
    toast.success("Event recorded");
  };

  return (
    <div className="container max-w-4xl mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Gaming Sessions</h1>
        <Button
          onClick={startNewSession}
          className="bg-gaming-accent hover:bg-gaming-accent/80 text-white"
        >
          <Plus className="w-4 h-4 mr-2" /> New Session
        </Button>
      </div>

      <div className="space-y-6">
        {sessions.map(session => (
          <Card key={session.id} className="p-6 bg-gaming-primary bg-opacity-95 border-gaming-secondary">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">
                  Session {session.id.slice(-4)}
                </h2>
                <div className="flex items-center space-x-2">
                  <Timer className="w-5 h-5 text-gaming-secondary" />
                  <span className="text-xl font-mono text-gaming-secondary">
                    {formatTime(elapsedTimes[session.id] || 0)}
                  </span>
                </div>
              </div>

              <div className="flex space-x-2">
                {session.status === 'active' && (
                  <>
                    <Button
                      onClick={() => pauseSession(session.id)}
                      variant="secondary"
                      className="bg-gaming-secondary hover:bg-gaming-secondary/80 text-white"
                    >
                      <Pause className="w-4 h-4 mr-2" /> Pause
                    </Button>
                    <Button
                      onClick={() => endSession(session.id)}
                      variant="destructive"
                    >
                      <Square className="w-4 h-4 mr-2" /> End
                    </Button>
                  </>
                )}
                {session.status === 'paused' && (
                  <>
                    <Button
                      onClick={() => resumeSession(session.id)}
                      className="bg-gaming-accent hover:bg-gaming-accent/80 text-white"
                    >
                      <Play className="w-4 h-4 mr-2" /> Resume
                    </Button>
                    <Button
                      onClick={() => endSession(session.id)}
                      variant="destructive"
                    >
                      <Square className="w-4 h-4 mr-2" /> End
                    </Button>
                  </>
                )}
              </div>

              <form onSubmit={(e) => addEvent(session.id, e)} className="flex space-x-2">
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
        ))}
      </div>
    </div>
  );
};