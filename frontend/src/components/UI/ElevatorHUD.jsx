import React from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../../store/useStore';
import { ArrowUp, ArrowDown, FastForward } from 'lucide-react';

export function ElevatorHUD() {
  const currentView = useStore((state) => state.currentView);
  const phase = useStore((state) => state.phase);
  const targetFloor = useStore((state) => state.targetFloor);
  const selectedFloor = useStore((state) => state.selectedFloor);
  const currentFloor = useStore((state) => state.currentFloor);
  const elevatorFloorDisplay = useStore((state) => state.elevatorFloorDisplay);
  const elevatorMoving = useStore((state) => state.elevatorMoving);
  const elevatorStatus = useStore((state) => state.elevatorStatus);
  const selectedCategory = useStore((state) => state.selectedCategory);
  const skipCinematic = useStore((state) => state.skipCinematic);
  const floors = useStore((state) => state.floors);

  const isInElevator =
    currentView === 'IN_ELEVATOR' ||
    currentView === 'TRANSITION_ELEVATOR' ||
    phase === 'toElevator' ||
    phase === 'riding' ||
    phase === 'arriving';

  if (!isInElevator) {
    return null;
  }

  const activeFloor = selectedFloor !== undefined ? selectedFloor : currentFloor;
  const targetFloorObj = floors.find((f) => f.floor_number === targetFloor) || {
    name: targetFloor === 0 ? 'Ground Lobby' : `Floor ${targetFloor}`,
    short_title: targetFloor === 0 ? 'GROUND LOBBY' : `FLOOR ${targetFloor}`
  };

  const isGoingUp = targetFloor >= activeFloor;

  const statusLabels = {
    approaching: 'APPROACHING PANORAMIC ELEVATOR',
    doors_opening: 'ELEVATOR DOORS OPENING',
    boarding: 'ENTERING GLASS CABIN',
    moving: isGoingUp ? 'ASCENDING THROUGH ATRIUM' : 'DESCENDING THROUGH ATRIUM',
    arrived: 'ARRIVED • DOORS OPENING',
    exiting: 'STEPPING OUT INTO SHOWROOM'
  };
  const statusText = statusLabels[elevatorStatus] || (isGoingUp ? 'ASCENDING THROUGH ATRIUM' : 'DESCENDING THROUGH ATRIUM');

  return (
    <div className="absolute inset-0 z-30 pointer-events-none flex flex-col items-center justify-between p-6 md:p-8">
      {/* Top Elevator Info Bar & Skip Ride Button */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <div className="px-5 py-3 rounded-2xl flex items-center gap-3.5 bg-white/95 backdrop-blur-md border border-slate-200 text-navy-dark shadow-xl">
          <div className="flex items-center gap-1.5 text-flipkart-blue font-black text-xs md:text-sm">
            {isGoingUp ? (
              <ArrowUp className="w-4 h-4 md:w-5 md:h-5 animate-bounce text-flipkart-blue" />
            ) : (
              <ArrowDown className="w-4 h-4 md:w-5 md:h-5 animate-bounce text-flipkart-blue" />
            )}
            <span>EXPRESS ELEVATOR</span>
          </div>

          <div className="w-[1px] h-5 bg-slate-200" />

          <div className="flex items-center gap-2 text-xs md:text-sm">
            <span className="text-slate-500 font-semibold hidden sm:inline">Destination:</span>
            <span className="font-extrabold text-navy-dark">
              {targetFloorObj.name || targetFloorObj.short_title}
            </span>
          </div>

          <div className="w-[1px] h-5 bg-slate-200" />

          {/* Digital LED Floor Matrix */}
          <div className="bg-slate-950 px-2.5 py-0.5 rounded-lg border border-slate-800 text-flipkart-yellow font-black font-mono text-sm md:text-base tracking-widest shadow-inner">
            {elevatorFloorDisplay}
          </div>
        </div>

        {/* Skip Ride Button */}
        <button
          onClick={skipCinematic}
          className="pointer-events-auto px-4 py-3 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200 text-navy-dark hover:text-flipkart-blue hover:bg-white transition-all font-bold text-xs shadow-xl flex items-center gap-1.5 hover:scale-105"
          title="Skip elevator transit"
        >
          <FastForward className="w-4 h-4 text-flipkart-blue" />
          <span className="hidden sm:inline">Skip</span>
        </button>
      </motion.div>

      {/* Center Motion Status Indicator */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center bg-white/90 backdrop-blur-md px-6 py-3 rounded-2xl border border-blue-200/90 shadow-lg"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-flipkart-blue text-[11px] font-black tracking-wider mb-1">
          <span className={`w-2 h-2 rounded-full ${elevatorMoving ? 'bg-flipkart-blue animate-ping' : 'bg-emerald-500'}`} />
          {statusText}
        </div>
        <p className="text-xs md:text-sm font-bold text-slate-700">
          {selectedCategory
            ? `Heading to ${selectedCategory.name} on ${targetFloorObj.short_title}`
            : `Enjoy the panoramic glass view as you approach ${targetFloorObj.short_title}`}
        </p>
      </motion.div>

      {/* Bottom spacer */}
      <div />
    </div>
  );
}

export default ElevatorHUD;
