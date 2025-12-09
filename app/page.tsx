import React from "react";
import { calculateEloFromLedger } from "../algos/elo";
import racers from "./racers.json";
import ledger from "./ledger.json";
import racerProfiles from "./racerprofiles.json";
import { RacerCard } from "./components/RacerCard";
import { FaTrophy, FaMedal, FaCalendarAlt, FaToilet, FaFlagCheckered, FaUsers, FaChartLine } from "react-icons/fa";
import { Tooltip } from "@nextui-org/react";

export default function Home() {
  const eloRatings = calculateEloFromLedger(racers, ledger);
  
  // Check if all racers have Elo ratings
  racers.forEach(racer => {
    if (!(racer.id in eloRatings)) {
      throw new Error(`Elo rating not calculated for racer: ${racer.name} (ID: ${racer.id})`);
    }
  });

  const sortedRacers = racers
    .map(racer => ({
      ...racer,
      elo: Math.round(eloRatings[racer.id])
    }))
    .sort((a, b) => b.elo - a.elo);

  const recentRaces = [...ledger].reverse().slice(0, 5);

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <FaTrophy className="text-yellow-400" />;
      case 1:
        return <FaMedal className="text-stone-400" />;
      case 2:
        return <FaMedal className="text-amber-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="font-[family-name:var(--font-geist-sans)] p-4 md:p-8 lg:p-10 min-h-screen flex justify-center">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">
        <section className="w-full flex flex-col gap-2">
          <h2 className="font-bold">Rankings</h2>
          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
            {sortedRacers.map((racer, index) => {
              const profile = racerProfiles.find(p => p.id === racer.id);
              return (
                <div key={racer.id} className="flex flex-row items-center space-x-4 w-full">
                  <div className="flex flex-col items-center w-12">
                    <div className="flex items-center space-x-1">
                      <span>#{index + 1}</span>
                      {getRankIcon(index)}
                    </div>
                    <span className="font-mono text-sm text-stone-500">{racer.elo}</span>
                  </div>
                  <div className="flex-grow">
                    <RacerCard racer={racer} profile={profile || {profilePicture: null, company: null, university: null, age: null, linkedInURL: null}} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="w-full space-y-8">
          <div>
            <h2 className="font-bold mb-4">Recent Races</h2>
            <div className="space-y-6 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
              {recentRaces.map((race, idx) => {
                const sortedResults = [...race.results].sort((a, b) => a.position - b.position);
                const lastPosition = Math.max(...race.results.map(r => r.position));
                return (
                  <div key={`${race.raceId}-${idx}`}>
                    {sortedResults.map((result) => {
                      const racer = racers.find(r => r.id === result.racerId);
                      const isFirst = result.position === 1;
                      const isLast = result.position === lastPosition;
                      return (
                        <p key={result.racerId} className="flex items-center">
                          <span className="w-6 flex justify-center mr-2">
                            {isFirst ? <FaTrophy className="text-yellow-400" /> : 
                             isLast ? <FaToilet /> : 
                             <span className="text-stone-500">-</span>}
                          </span>
                          <span className="text-stone-500 w-4 mr-2">{result.position}.</span>
                          {racer?.name}
                        </p>
                      );
                    })}
                    <p className="flex items-center justify-end text-sm text-stone-500 mt-1">
                      <FaCalendarAlt className="mr-2" size={12} />
                      {new Date(race.date).toLocaleDateString()}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <h2 className="font-bold mb-4">Stats</h2>
            <div className="flex flex-row gap-6">
              <p className="flex items-center gap-2">
                <Tooltip content="Total number of races completed">
                  <span className="cursor-pointer"><FaFlagCheckered /></span>
                </Tooltip>
                {ledger.length}
              </p>
              <p className="flex items-center gap-2">
                <Tooltip content="Total number of registered racers">
                  <span className="cursor-pointer"><FaUsers /></span>
                </Tooltip>
                {racers.length}
              </p>
              <p className="flex items-center gap-2">
                <Tooltip content="Average Elo rating across all racers">
                  <span className="cursor-pointer"><FaChartLine /></span>
                </Tooltip>
                {Math.round(sortedRacers.reduce((sum, racer) => sum + racer.elo, 0) / racers.length)}
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
