export type SessionStatus = 'idle' | 'active' | 'paused';

export interface SessionEvent {
  timestamp: Date;
  description: string;
}

export interface GameSession {
  id: string;
  name: string;
  status: SessionStatus;
  events: SessionEvent[];
  startTime: Date;
  elapsedTime: number;
}