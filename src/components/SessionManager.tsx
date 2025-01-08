import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { SessionCard } from "./SessionCard";
import { GameSession, GameEventType } from "@/types/session";

export const SessionManager = () => {
  const [sessions, setSessions] = useState<GameSession[]>([]);
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

  const startNewSession = () => {
    const newSession: GameSession = {
      id: Date.now().toString(),
      name: `Session ${sessions.length + 1}`,
      status: 'active',
      events: [],
      startTime: new Date(),
      elapsedTime: 0
    };

    setSessions(prev => {
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

  const handleSessionAction = {
    pause: (sessionId: string) => {
      setSessions(prev => prev.map(session => 
        session.id === sessionId ? { ...session, status: 'paused' } : session
      ));
      toast.info("Session paused");
    },

    resume: (sessionId: string) => {
      setSessions(prev => prev.map(session => ({
        ...session,
        status: session.id === sessionId ? 'active' : 
               session.status === 'active' ? 'paused' : session.status,
        startTime: session.id === sessionId ? 
                  new Date(new Date().getTime() - (elapsedTimes[session.id] || 0) * 1000) : 
                  session.startTime
      })));
      toast.success("Session resumed");
    },

    end: (sessionId: string) => {
      setSessions(prev => prev.filter(session => session.id !== sessionId));
      setElapsedTimes(prev => {
        const newTimes = { ...prev };
        delete newTimes[sessionId];
        return newTimes;
      });
      toast.info("Session ended");
    },

    addEvent: (sessionId: string, eventType: GameEventType) => {
      setSessions(prev => prev.map(session => 
        session.id === sessionId
          ? { ...session, events: [...session.events, { timestamp: new Date(), description: eventType }] }
          : session
      ));
      toast.success(`${eventType} event recorded`);
    },

    updateName: (sessionId: string, name: string) => {
      setSessions(prev => prev.map(session =>
        session.id === sessionId ? { ...session, name } : session
      ));
    }
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
          <SessionCard
            key={session.id}
            session={session}
            elapsedTime={elapsedTimes[session.id] || 0}
            onPause={handleSessionAction.pause}
            onResume={handleSessionAction.resume}
            onEnd={handleSessionAction.end}
            onAddEvent={handleSessionAction.addEvent}
            onNameChange={handleSessionAction.updateName}
          />
        ))}
      </div>
    </div>
  );
};