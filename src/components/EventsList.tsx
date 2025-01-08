import React from 'react';
import { SessionEvent } from "@/types/session";

interface EventsListProps {
  events: SessionEvent[];
}

export const EventsList = ({ events }: EventsListProps) => {
  if (events.length === 0) return null;

  return (
    <div className="space-y-2">
      <h3 className="text-xl font-bold text-white">Session Events</h3>
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
    </div>
  );
};