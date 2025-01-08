import React from 'react';
import { Button } from "@/components/ui/button";
import { GameEventType } from "@/types/session";

const EVENT_TYPES: GameEventType[] = [
  'Kill',
  'Death',
  'Level Up',
  'Boss Fight',
  'Checkpoint',
  'Item Found',
  'Achievement'
];

interface EventsGridProps {
  onAddEvent: (eventType: GameEventType) => void;
}

export const EventsGrid = ({ onAddEvent }: EventsGridProps) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
      {EVENT_TYPES.map((eventType) => (
        <Button
          key={eventType}
          onClick={() => onAddEvent(eventType)}
          variant="secondary"
          className="bg-white/10 hover:bg-white/20 text-white"
        >
          {eventType}
        </Button>
      ))}
    </div>
  );
};