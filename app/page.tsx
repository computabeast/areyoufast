import React from "react";
import { calculateEloFromLedger } from "../algos/elo";
import racers from "./racers.json";
import ledger from "./ledger.json";
import racerProfiles from "./racerprofiles.json";
import { RacerCard } from "./components/RacerCard";
import RunningSprite from "./components/RunningSprite";
import FadeIn from "./components/FadeIn";
import RecentRaces from "./components/RecentRaces";
import { FaTrophy, FaMedal, FaFlagCheckered, FaUsers, FaChartLine } from "react-icons/fa";
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
        <FadeIn delay={0.1} className="w-full flex flex-col gap-2">
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
        </FadeIn>

        <div className="w-full space-y-8">
          <FadeIn delay={0.2}>
            <RecentRaces races={recentRaces} racers={racers} initialCount={2} />
          </FadeIn>

          <FadeIn delay={0.3}>
            <h2 className="font-bold mb-4">Stats</h2>
            <div className="flex flex-row gap-6 items-center">
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
              <RunningSprite size={48} />
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
