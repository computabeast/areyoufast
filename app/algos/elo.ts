import { RaceLedger, Racer } from "../types";

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
