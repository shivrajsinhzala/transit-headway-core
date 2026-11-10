import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  calculateHeadways,
  calculateRegularityIndex,
  detectBunchingAndGaps,
  analyzeCorridorFrequency,
} from '../src/index.js';

describe('transit-headway-core', () => {
  const baseTime = 1700000000; // Epoch seconds

  const sampleDepartures = [
    { tripId: 'T1', routeId: 'R1', stopId: 'S1', scheduledTime: baseTime, actualTime: baseTime + 60 },
    { tripId: 'T2', routeId: 'R1', stopId: 'S1', scheduledTime: baseTime + 600, actualTime: baseTime + 630 },
    { tripId: 'T3', routeId: 'R1', stopId: 'S1', scheduledTime: baseTime + 1200, actualTime: baseTime + 1220 },
    { tripId: 'T4', routeId: 'R1', stopId: 'S1', scheduledTime: baseTime + 1800, actualTime: baseTime + 2100 },
  ];

  it('calculates scheduled headways correctly', () => {
    const headways = calculateHeadways(sampleDepartures, false);
    assert.strictEqual(headways.length, 3);
    assert.strictEqual(headways[0].headwaySeconds, 600);
    assert.strictEqual(headways[0].headwayMinutes, 10.0);
    assert.strictEqual(headways[1].headwayMinutes, 10.0);
    assert.strictEqual(headways[2].headwayMinutes, 10.0);
  });

  it('calculates regularity index and excess wait time', () => {
    const stats = calculateRegularityIndex(sampleDepartures);
    assert.strictEqual(stats.sampleCount, 4);
    assert.strictEqual(stats.meanScheduledHeadwayMin, 10.0);
    assert(stats.regularityIndex > 0 && stats.regularityIndex <= 1.0);
    assert(stats.excessWaitTimeMin >= 0);
  });

  it('detects bunching or gapping if headway deviates significantly', () => {
    const bunchedDepartures = [
      { tripId: 'T1', routeId: 'R1', stopId: 'S1', scheduledTime: baseTime, actualTime: baseTime },
      { tripId: 'T2', routeId: 'R1', stopId: 'S1', scheduledTime: baseTime + 600, actualTime: baseTime + 120 }, // 2m instead of 10m -> bunching
      { tripId: 'T3', routeId: 'R1', stopId: 'S1', scheduledTime: baseTime + 1200, actualTime: baseTime + 2400 }, // 38m instead of 10m -> gapping
    ];

    const alerts = detectBunchingAndGaps(bunchedDepartures);
    assert(alerts.length >= 2);
    assert(alerts.some((a) => a.type === 'BUNCHING'));
    assert(alerts.some((a) => a.type === 'GAPPING'));
  });

  it('evaluates corridor frequency and qualifies high frequency', () => {
    const corridor = analyzeCorridorFrequency('S1', sampleDepartures);
    assert.strictEqual(corridor.stopId, 'S1');
    assert.strictEqual(corridor.totalDepartures, 4);
    assert(corridor.averageHeadwayMin === 10);
  });
});
