import React from "react";
import { calculateEloFromLedger } from "../algos/elo";
import racers from "./racers.json";
import ledger from "./ledger.json";
import racerProfiles from "./racerprofiles.json";
import { RacerCard } from "./components/RacerCard";
import FadeIn from "./components/FadeIn";
import RecentRaces from "./components/RecentRaces";
import { FaTrophy, FaMedal, FaFlagCheckered, FaUsers, FaChartLine, FaQuestionCircle, FaToilet } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
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

  // Calculate finish stats for all racers
  const finishStats: Record<string, { first: number; second: number; third: number; fourthPlus: number; last: number }> = {};
  
  racers.forEach(racer => {
    let first = 0;
    let second = 0;
    let third = 0;
    let fourthPlus = 0;
    let last = 0;

    ledger.forEach(race => {
      const result = race.results.find(r => r.racerId === racer.id);
      if (result) {
        const lastPosition = Math.max(...race.results.map(r => r.position));
        if (result.position === 1) first++;
        else if (result.position === 2) second++;
        else if (result.position === 3) third++;
        else if (result.position === lastPosition) last++;
        else fourthPlus++;
      }
    });

    finishStats[racer.id] = { first, second, third, fourthPlus, last };
  });

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
      <div className="max-w-4xl w-full space-y-6">
        <FadeIn delay={0}>
          <div className="border border-stone-300 rounded-lg p-6 bg-gradient-to-r from-blue-100/80 via-yellow-50/70 to-red-100/80">
            <p className="mb-4">
              {"The Silicon Games'"} inaugural charity track meet is in the works for Summer 2026 in San Francisco, CA.{" "}
              <a href="https://x.com/thesilicongames" target="_blank" className="inline-flex items-center gap-1">
                <span className="underline">Follow us</span> on <FaXTwitter size={12} />
              </a>{" "}
              for updates.
            </p>
            <div>
              <p className="font-semibold mb-2">Proposed events</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="font-medium mb-1">{"Men's and Women's"}</p>
                  <p>100, 400, 1600, 110m Hurdles, Long jump, High jump, Shot put, Discus, Octathalon</p>
                </div>
                <div>
                  <p className="font-medium mb-1">Mixed Relays</p>
                  <p>4x100, 4x400, Distance medley relay {"(1200, 400, 800, 400)"}</p>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-6 mt-8 md:mt-0">
        <FadeIn delay={0.1} className="w-full flex flex-col gap-2 border border-stone-300 rounded-lg p-6 bg-white md:border-0 md:rounded-none md:p-0 md:bg-transparent">
          <h2 className="font-bold flex items-center gap-2">
            Head to Head Leaderboard
            <Tooltip placement="left" content="For now, this is an agreed upon race across an arbitrary distrance.">
              <span className="cursor-help hidden md:inline">
                <FaQuestionCircle size={14} className="text-stone-400" />
              </span>
            </Tooltip>
          </h2>
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
                    <Tooltip 
                      placement="left"
                      content={
                        <div className="text-xs space-y-1">
                          <div className="flex items-center gap-2">
                            <FaTrophy className="text-yellow-400" size={12} />
                            <span>{finishStats[racer.id]?.first || 0}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FaMedal className="text-stone-400" size={12} />
                            <span>{finishStats[racer.id]?.second || 0}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FaMedal className="text-amber-600" size={12} />
                            <span>{finishStats[racer.id]?.third || 0}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-stone-500">—</span>
                            <span>{finishStats[racer.id]?.fourthPlus || 0}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FaToilet size={12} />
                            <span>{finishStats[racer.id]?.last || 0}</span>
                          </div>
                        </div>
                      }
                    >
                      <span className="font-mono text-sm text-stone-500 cursor-pointer">{racer.elo}</span>
                    </Tooltip>
                  </div>
                  <div className="flex-grow">
                    <RacerCard racer={racer} profile={profile || {profilePicture: null, company: null, university: null, age: null, linkedInURL: null}} />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 text-xs text-stone-500">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-1">
                <FaTrophy className="text-yellow-400" size={12} />
                <span>1st</span>
              </div>
              <div className="flex items-center gap-1">
                <FaMedal className="text-stone-400" size={12} />
                <span>2nd</span>
              </div>
              <div className="flex items-center gap-1">
                <FaMedal className="text-amber-600" size={12} />
                <span>3rd</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-stone-500">—</span>
                <span>4th+</span>
              </div>
              <div className="flex items-center gap-1">
                <FaToilet size={12} />
                <span>Last</span>
              </div>
            </div>
          </div>
        </FadeIn>

        <div className="w-full space-y-8 border border-stone-300 rounded-lg p-6 bg-white md:border-0 md:rounded-none md:p-0 md:bg-transparent">
          <FadeIn delay={0.2}>
            <RecentRaces races={recentRaces} racers={racers} initialCount={2} />
          </FadeIn>

          <FadeIn delay={0.3}>
            <h2 className="font-bold mb-4">Stats</h2>
            <div className="flex flex-row gap-6 items-center">
              <p className="flex items-center gap-2">
                <Tooltip placement="left" content="Total number of races completed">
                  <span className="cursor-pointer"><FaFlagCheckered /></span>
                </Tooltip>
                {ledger.length}
              </p>
              <p className="flex items-center gap-2">
                <Tooltip placement="left" content="Total number of registered racers">
                  <span className="cursor-pointer"><FaUsers /></span>
                </Tooltip>
                {racers.length}
              </p>
              <p className="flex items-center gap-2">
                <Tooltip placement="left" content="Average Elo rating across all racers">
                  <span className="cursor-pointer"><FaChartLine /></span>
                </Tooltip>
                {Math.round(sortedRacers.reduce((sum, racer) => sum + racer.elo, 0) / racers.length)}
              </p>
            </div>
          </FadeIn>
        </div>
        </div>
      </div>
    </div>
  );
}
