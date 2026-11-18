import React from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../../store/useStore';
import { Layers, ArrowUp, ArrowDown } from 'lucide-react';

export function ElevatorHUD() {
  const currentView = useStore((state) => state.currentView);
  const targetFloor = useStore((state) => state.targetFloor);
  const selectedFloor = useStore((state) => state.selectedFloor);
  const elevatorFloorDisplay = useStore((state) => state.elevatorFloorDisplay);
  const elevatorMoving = useStore((state) => state.elevatorMoving);
  const floors = useStore((state) => state.floors);

  if (currentView !== 'IN_ELEVATOR' && currentView !== 'TRANSITION_ELEVATOR') {
    return null;
  }

  const targetFloorObj = floors.find((f) => f.floor_number === targetFloor) || {
    name: `Floor ${targetFloor}`,
    short_title: `FLOOR ${targetFloor}`
  };

  const isGoingUp = targetFloor >= selectedFloor;

  return (
    <div className="absolute inset-0 z-30 pointer-events-none flex flex-col items-center justify-between p-8">
      {/* Top Elevator Info Bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-6 py-3.5 rounded-2xl flex items-center gap-4 bg-white/95 backdrop-blur-md border border-slate-200 text-navy-dark shadow-xl"
      >
        <div className="flex items-center gap-1.5 text-flipkart-blue font-black text-sm">
          {isGoingUp ? (
            <ArrowUp className="w-5 h-5 animate-bounce text-flipkart-blue" />
          ) : (
            <ArrowDown className="w-5 h-5 animate-bounce text-flipkart-blue" />
          )}
          <span>EXPRESS ELEVATOR</span>
        </div>

        <div className="w-[1px] h-6 bg-slate-200" />

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-semibold">Destination:</span>
          <span className="text-sm font-extrabold text-navy-dark">
            {targetFloorObj.name || targetFloorObj.short_title}
          </span>
        </div>

        <div className="w-[1px] h-6 bg-slate-200" />

        {/* Digital LED Floor Matrix */}
        <div className="bg-slate-950 px-3 py-1 rounded-lg border border-slate-800 text-flipkart-yellow font-black font-mono text-base tracking-widest shadow-inner">
          {elevatorFloorDisplay}
        </div>
      </motion.div>

      {/* Center Cinematic Motion Prompt */}
      {elevatorMoving && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-blue-200 text-flipkart-blue text-xs font-bold tracking-wider mb-2 shadow-md">
            <span className="w-2 h-2 rounded-full bg-flipkart-blue animate-ping" />
            ASCENDING TO DEPARTMENT
          </div>
          <p className="text-sm font-bold text-navy-dark">
            Please hold on while the elevator reaches Floor {targetFloor}
          </p>
        </motion.div>
      )}

      {/* Bottom spacer */}
      <div />
    </div>
  );
}
