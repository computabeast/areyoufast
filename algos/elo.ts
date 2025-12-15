import { RaceLedger, Racer } from "../app/types";

// Everyone starts with 1000 elo
const INITIAL_ELO = 1000;
const K_FACTOR = 32;


const calculateExpectedOutcome = (racerElo: number, opponentElo: number): number => {
    return 1 / (1 + 10 ** ((opponentElo - racerElo) / 400));
};

const calculateNewElo = (oldElo: number, expected: number, actual: number, kFactor: number = K_FACTOR): number => {
    return oldElo + kFactor * (actual - expected);
}

export const calculateEloFromLedger = (racers: Racer[], ledger: RaceLedger): { [key: string]: number } => {
    // Initialize
    const eloRatings: { [key: string]: number } = {};
    racers.forEach(racer => {
        eloRatings[racer.id] = INITIAL_ELO;
    });

    ledger.forEach(race => {
        race.results.forEach((racerA, i) => {
            race.results.slice(i + 1).forEach(racerB => {
                const [eloA, eloB] = [eloRatings[racerA.racerId], eloRatings[racerB.racerId]];
                const expectedA = calculateExpectedOutcome(eloA, eloB);
                const actualA = racerA.position < racerB.position ? 1 : 0;
                
                eloRatings[racerA.racerId] = calculateNewElo(eloA, expectedA, actualA);
                eloRatings[racerB.racerId] = calculateNewElo(eloB, 1 - expectedA, 1 - actualA);
            });
        });
    });

    return eloRatings;
}

// Calculate elo ratings up to (and including) a specific race index
// If raceIndex is -1, returns initial elo (before any races)
export const calculateEloAtRaceIndex = (racers: Racer[], ledger: RaceLedger, raceIndex: number): { [key: string]: number } => {
    const eloRatings: { [key: string]: number } = {};
    racers.forEach(racer => {
        eloRatings[racer.id] = INITIAL_ELO;
    });

    if (raceIndex < 0) {
        return eloRatings;
    }

    for (let i = 0; i <= raceIndex && i < ledger.length; i++) {
        const race = ledger[i];
        race.results.forEach((racerA, j) => {
            race.results.slice(j + 1).forEach(racerB => {
                const [eloA, eloB] = [eloRatings[racerA.racerId], eloRatings[racerB.racerId]];
                const expectedA = calculateExpectedOutcome(eloA, eloB);
                const actualA = racerA.position < racerB.position ? 1 : 0;
                
                eloRatings[racerA.racerId] = calculateNewElo(eloA, expectedA, actualA);
                eloRatings[racerB.racerId] = calculateNewElo(eloB, 1 - expectedA, 1 - actualA);
            });
        });
    }

    return eloRatings;
}

// Calculate elo change for a specific race (by index)
// Returns the elo change that occurred during that race
export const calculateEloChangeForRace = (
    racers: Racer[], 
    ledger: RaceLedger, 
    raceIndex: number
): { [racerId: string]: number } => {
    const eloBefore = calculateEloAtRaceIndex(racers, ledger, raceIndex - 1);
    const eloAfter = calculateEloAtRaceIndex(racers, ledger, raceIndex);

    const changes: { [racerId: string]: number } = {};
    racers.forEach(racer => {
        changes[racer.id] = Math.round(eloAfter[racer.id] - eloBefore[racer.id]);
    });

    return changes;
}

