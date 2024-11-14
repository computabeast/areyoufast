import React from "react";
import { calculateEloFromLedger } from "../../algos/elo"; 
import racers from "../racers.json";
import ledger from "../ledger.json";
import racerProfiles from "../racerprofiles.json";
import raceData from "../raceData.json";
import { RacerCard } from "../components/RacerCard";
import { FaTrophy, FaMedal, FaCalendarAlt, FaToilet} from "react-icons/fa";
import { Image } from "@nextui-org/react";

export default function RankingsPage() {
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

  const mostRecentRace = ledger[ledger.length - 1];

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <FaTrophy className="text-yellow-400" />;
      case 1:
        return <FaMedal className="text-gray-400" />;
      case 2:
        return <FaMedal className="text-amber-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-4 p-8 pb-20 sm:p-10 lg:px-40 font-[family-name:var(--font-geist-sans)]">
      <h2 className="text-2xl mb-4">Full Rankings</h2>

      <div className="space-y-4">
          {sortedRacers.map((racer, index) => {
            const profile = racerProfiles.find(p => p.id === racer.id);
            return (
              <div key={racer.id} className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full">
                <div className="flex flex-row items-center space-x-2">
                  <div className="flex items-center justify-center space-x-2 w-full sm:w-16">
                    <span>#{index + 1}</span>
                    {getRankIcon(index)}
                  </div>
                  <span className="font-mono w-full sm:w-16 text-center sm:text-left">{racer.elo}</span>
                </div>
                <div className="flex-grow w-full">
                  <RacerCard racer={racer} profile={profile || {profilePicture: null, company: null, university: null, age: null, linkedInURL: null}} />
                </div>
              </div>
            );
          })}
        </div>
    </div>
  );
}