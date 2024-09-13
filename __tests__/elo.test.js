import { calculateEloFromLedger } from '../algos/elo';

const DECIMAL_ACCURACY = 3

const racers = [
  { id: '1', name: 'Alice', handle: 'myhandle' },
  { id: '2', name: 'Bob', handle: 'myhandle2' },
  { id: '3', name: 'Charlie', handle: 'myhandle3' },
];

const ledger = [
  {
    raceId: 'race1',
    date: '2023-01-01',
    results: [
      { racerId: '1', position: 1 },
      { racerId: '2', position: 2 },
      { racerId: '3', position: 3 },
    ],
  },
  {
    raceId: 'race2',
    date: '2023-01-08',
    results: [
      { racerId: '2', position: 1 },
      { racerId: '3', position: 2 },
      { racerId: '1', position: 3 },
    ],
  },
];

describe('Elo Rating System', () => {
  test('calculateEloFromLedger should correctly update Elo ratings', () => {
    const eloRatings = calculateEloFromLedger(racers, ledger);

    // All racers have Elo ratings
    expect(Object.keys(eloRatings)).toHaveLength(3);

    // Elo ratings are numbers
    Object.values(eloRatings).forEach(rating => {
      expect(typeof rating).toBe('number');
    });

    // Elo ratings have changed
    expect(eloRatings['1']).not.toBe(1000);
    expect(eloRatings['2']).not.toBe(1000);
    expect(eloRatings['3']).not.toBe(1000);

    // Order makes sense based on results
    expect(eloRatings['1']).toBeGreaterThan(eloRatings['3']);
    expect(eloRatings['2']).toBeGreaterThan(eloRatings['3']);
  });

  test('calculateEloFromLedger correctly calculates Elo ratings', () => {
    const eloRatings = calculateEloFromLedger(racers, ledger);
    
    expect(eloRatings['1']).toBeCloseTo(995.7448, DECIMAL_ACCURACY);
    expect(eloRatings['2']).toBeCloseTo(1031.3619, DECIMAL_ACCURACY);
    expect(eloRatings['3']).toBeCloseTo(972.8932, DECIMAL_ACCURACY);
  });

});

