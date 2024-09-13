import { calculateEloFromLedger } from "./algos/elo";
import racers from "./racers.json";
import ledger from "./ledger.json";
import racerProfiles from "./racerprofiles.json";
import raceData from "./raceData.json";
import { RacerCard } from "./components/RacerCard";
import { FaTrophy, FaMedal, FaCalendarAlt, FaToilet} from "react-icons/fa";
import { Image } from "@nextui-org/react";
import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';

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
    <div className="flex flex-col gap-8 p-8 pb-20 sm:p-20 lg:px-40 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-3xl font-bold text-left">areyoufast.io</h1>
      <p className="text-base font-bold text-left">Who{"'"}s actually fast in SF?</p>
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


      <footer className="mt-8 p-6 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">About Our Elo Ranking System</h2>
        <p className="mb-4">
          We use the Elo rating system to rank racers based on their performance in races, similar to the system used in chess.
        </p>
        <h3 className="text-xl font-semibold mb-2">General Approach</h3>
        <p className="mb-4">
          In a race, each finishing position is treated as a series of individual victories and defeats.
        </p>
        <ul className="list-disc list-inside ml-4 mb-4">
          <li>1st place {'"beats"'} all other participants.</li>
          <li>2nd place {'"beats"'} all except 1st place, and so on.</li>
        </ul>
        <h3 className="text-xl font-semibold mb-2">Elo Adjustment</h3>
        <p className="mb-4">
          Each participant starts with their current Elo rating. The race is treated as a series of pairwise comparisons. For example, with 10 racers, there are 45 pairwise comparisons 
          <Latex>{'$(\\binom{10}{2} = 45)$'}</Latex>.
        </p>
        <p className="mb-4">
          The expected score for Racer A against Racer B is:
        </p>
        <div className="bg-gray-200 dark:bg-gray-700 p-4 rounded-lg mb-4 overflow-x-auto">
          <Latex>{'$E_{A,B} = \\frac{1}{1 + 10^{(R_B - R_A) / 400}}$'}</Latex>
        </div>
        <p className="mb-4">
          If Racer A finishes ahead of Racer B, assign a score of 1 for Racer A and 0 for Racer B.
        </p>
        <p className="mb-4">
          Update each participant’s Elo rating based on their performance relative to others:
        </p>
        <div className="bg-gray-200 dark:bg-gray-700 p-4 rounded-lg mb-4 overflow-x-auto">
          <Latex>{'$\\Delta R_A = K \\times \\frac{1}{n-1} \\sum_{i=1}^{n-1} (S_{A,i} - E_{A,i})$'}</Latex>
          <p className="mt-2">Where:</p>
          <ul className="list-disc list-inside ml-4">
            <li><Latex>{'$K$ is the adjustment factor (e.g., 30 or 50)'}</Latex></li>
            <li><Latex>{'$n$ is the total number of participants'}</Latex></li>
            <li><Latex>{'$S_{A,i}$ is the actual score for Racer A against Racer $i$'}</Latex></li>
            <li><Latex>{'$E_{A,i}$ is the expected score between Racer A and Racer $i$'}</Latex></li>
          </ul>
        </div>
        <h3 className="text-xl font-semibold mb-2">Example</h3>
        <p className="mb-4">
          Three racers with initial Elo ratings:
        </p>
        <ul className="list-disc list-inside ml-4 mb-4">
          <li>Racer A: 1000</li>
          <li>Racer B: 1500</li>
          <li>Racer C: 1200</li>
        </ul>
        <p className="mb-4">
          Finishing order: A, B, C.
        </p>
        <p className="mb-4">
          Pairwise comparisons:
        </p>
        <ul className="list-disc list-inside ml-4 mb-4">
          <li>A {'"beats"'} B and C (2 wins)</li>
          <li>B {'"beats"'} C (1 win)</li>
          <li>C comes in last (0 wins)</li>
        </ul>
        <p className="mb-4">
          Calculate expected scores and update Elo ratings based on the differences between expected and actual outcomes:
        </p>
        <div className="bg-gray-200 dark:bg-gray-700 p-4 rounded-lg mb-4 overflow-x-auto">
          <p className="mb-2">Expected scores:</p>
          <ul className="list-disc list-inside ml-4 mb-4">
            <li><Latex>{'$E_{A,B} = \\frac{1}{1 + 10^{(1500 - 1000) / 400}} = 0.05$'}</Latex></li>
            <li><Latex>{'$E_{A,C} = \\frac{1}{1 + 10^{(1200 - 1000) / 400}} = 0.24$'}</Latex></li>
            <li><Latex>{'$E_{B,C} = \\frac{1}{1 + 10^{(1200 - 1500) / 400}} = 0.76$'}</Latex></li>
          </ul>
          <p className="mb-2">New Elo ratings:</p>
          <ul className="list-disc list-inside ml-4 mb-4">
            <li><Latex>{'$R_A = 1000 + 30 \\times (1 - 0.05) + 30 \\times (1 - 0.24) = 1451$'}</Latex></li>
            <li><Latex>{'$R_B = 1500 + 30 \\times (0 - 0.95) + 30 \\times (1 - 0.76) = 1462$'}</Latex></li>
            <li><Latex>{'$R_C = 1200 + 30 \\times (0 - 0.76) + 30 \\times (0 - 0.24) = 1140$'}</Latex></li>
          </ul>
        </div>
        <p className="mb-4">
          New Elo ratings after the race:
        </p>
        <ul className="list-disc list-inside ml-4 mb-4">
          <li>Racer A: 1451</li>
          <li>Racer B: 1462</li>
          <li>Racer C: 1140</li>
        </ul>
      </footer>
      <div className="mt-4 p-6 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Why was this created?</h2>
        <p>People severely overestimate how fast they are. They also overestimate their competitiveness.</p>
      </div>
    </div>
  );
}
