import { calculateEloFromLedger } from "../algos/elo";
import racers from "./racers.json";
import ledger from "./ledger.json";
import racerProfiles from "./racerprofiles.json";
import raceData from "./raceData.json";
import { RacerCard } from "./components/RacerCard";
import { FaTrophy, FaMedal, FaCalendarAlt, FaToilet} from "react-icons/fa";
import { Image } from "@nextui-org/react";
import 'katex/dist/katex.min.css';

import Header from "./components/Header";

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
    <div className="flex flex-col gap-4 p-8 pb-20 sm:p-20 lg:px-52 font-[family-name:var(--font-geist-sans)]">
      <Header />

      <section className="p-6 rounded-lg w-full">
        <h2 className="text-2xl font-bold mb-4">Full Rankings</h2>
        <div className="space-y-4 max-h-96 overflow-y-auto">
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
      </section>

      <section className="p-6 rounded-lg w-full">
        <h2 className="text-2xl font-bold mb-4">Most Recent Race</h2>
        <p className="flex items-center">
          <FaCalendarAlt className="mr-2" />
          {new Date(mostRecentRace.date).toLocaleDateString()}
        </p>
        <p className="flex items-center">
          <FaTrophy className="mr-2 text-yellow-400" />
          {racers.find(r => r.id === mostRecentRace.results.find(result => result.position === 1)?.racerId)?.name}
        </p>
        <p className="flex items-center">
          <FaToilet className="mr-2" />
          {racers.find(r => r.id === mostRecentRace.results.find(result => result.position === Math.max(...mostRecentRace.results.map(r => r.position)))?.racerId)?.name}
        </p>
        {raceData.find(race => race.raceId === mostRecentRace.raceId)?.imageURL && (
          <div className="mt-4">
            <Image 
              src={"/images/photofinish.jpg"} 
              alt="Most recent race" 
              className="w-full h-auto rounded-lg"
              width={500}
              height={300}
              fallbackSrc="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+F9PQAI8wNPvd7POQAAAABJRU5ErkJggg=="
            />
          </div>
        )}
      </section>

      <section className="p-6 rounded-lg w-full">
        <h2 className="text-2xl font-bold mb-4">Stats</h2>
        <p>Total Races: {ledger.length}</p>
        <p>Total Racers: {racers.length}</p>
        <p>Average Elo: {Math.round(sortedRacers.reduce((sum, racer) => sum + racer.elo, 0) / racers.length)}</p>
      </section>

      <div className="mt-4 p-6 bg-cardbg rounded-lg">
        <h2 className="text-2xl font-bold mb-4 text-cardfg">Why was this created?</h2>
        <p className="text-cardfg">People severely overestimate how fast they are. They also overestimate their competitiveness.</p>
      </div>
    </div>
  );
}
