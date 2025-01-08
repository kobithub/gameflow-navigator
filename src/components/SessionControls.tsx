import React from 'react';
import { Button } from "@/components/ui/button";
import { Pause, Play, Square } from "lucide-react";
import { SessionStatus } from "@/types/session";

interface SessionControlsProps {
  status: SessionStatus;
  onPause: () => void;
  onResume: () => void;
  onEnd: () => void;
}

export const SessionControls = ({
  status,
  onPause,
  onResume,
  onEnd
}: SessionControlsProps) => {
  return (
    <div className="flex space-x-2">
      {status === 'active' && (
        <>
          <Button
            onClick={onPause}
            variant="secondary"
            className="bg-gaming-secondary hover:bg-gaming-secondary/80 text-white"
          >
            <Pause className="w-4 h-4 mr-2" /> Pause
          </Button>
          <Button
            onClick={onEnd}
            variant="destructive"
          >
            <Square className="w-4 h-4 mr-2" /> End
          </Button>
        </>
      )}
      {status === 'paused' && (
        <>
          <Button
            onClick={onResume}
            className="bg-gaming-accent hover:bg-gaming-accent/80 text-white"
          >
            <Play className="w-4 h-4 mr-2" /> Resume
          </Button>
          <Button
            onClick={onEnd}
            variant="destructive"
          >
            <Square className="w-4 h-4 mr-2" /> End
          </Button>
        </>
      )}
    </div>
  );
};