"use client"

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTrophy, FaCalendarAlt, FaToilet, FaChevronDown, FaChevronUp } from "react-icons/fa";

interface RaceResult {
  racerId: string;
  position: number;
}

interface Race {
  raceId: string;
  date: string;
  results: RaceResult[];
  originalIndex: number;
}

interface Racer {
  id: string;
  name: string;
}

interface EloChanges {
  [raceIndex: number]: { [racerId: string]: number };
}

interface RecentRacesProps {
  races: Race[];
  racers: Racer[];
  eloChanges: EloChanges;
  initialCount?: number;
}

export default function RecentRaces({ races, racers, eloChanges, initialCount = 2 }: RecentRacesProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Check if we're on mobile (less than 768px)
    const isMobile = window.innerWidth < 768;
    setIsExpanded(!isMobile); // Expanded on desktop, collapsed on mobile
    setIsInitialized(true);
  }, []);
  
  const displayedRaces = isExpanded ? races : races.slice(0, initialCount);

  // Don't render until we know the screen size to avoid flash
  if (!isInitialized) {
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold">Recent Races</h2>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold">Recent Races</h2>
        {races.length > initialCount && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 text-xs text-stone-500 hover:text-stone-700 transition-colors"
          >
            {isExpanded ? (
              <>
                <span>Show less</span>
                <FaChevronUp size={10} />
              </>
            ) : (
              <>
                <span>Show more</span>
                <FaChevronDown size={10} />
              </>
            )}
          </button>
        )}
      </div>
      
      <div className="space-y-6">
        <AnimatePresence initial={false}>
          {displayedRaces.map((race, idx) => {
            const sortedResults = [...race.results].sort((a, b) => a.position - b.position);
            const lastPosition = Math.max(...race.results.map(r => r.position));
            return (
              <motion.div 
                key={`${race.raceId}-${idx}`}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                {sortedResults.map((result) => {
                  const racer = racers.find(r => r.id === result.racerId);
                  const isFirst = result.position === 1;
                  const isLast = result.position === lastPosition;
                  const eloChange = eloChanges[race.originalIndex]?.[result.racerId] || 0;
                  return (
                    <p key={result.racerId} className="flex items-center">
                      <span className="w-6 flex justify-center mr-2">
                        {isFirst ? <FaTrophy className="text-yellow-400" /> : 
                         isLast ? <FaToilet /> : 
                         <span className="text-stone-500">-</span>}
                      </span>
                      <span className="text-stone-500 w-4 mr-2">{result.position}.</span>
                      <span className="flex-grow">{racer?.name}</span>
                      <span className={`text-xs font-mono ${eloChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {eloChange >= 0 ? '+' : ''}{eloChange}
                      </span>
                    </p>
                  );
                })}
                <p className="flex items-center justify-end text-sm text-stone-500 mt-1">
                  <FaCalendarAlt className="mr-2" size={12} />
                  {new Date(race.date).toLocaleDateString()}
                </p>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}

