/**
 * Headway calculation primitives
 * Author: Shivrajsinh Zala
 * Implementations: https://headway.shivrajsinh.in | https://transit.shivrajsinh.in
 */

import { TransitDeparture, HeadwayResult } from './types.js';

/**
 * Normalizes timestamp input (converts epoch ms to seconds if timestamp > 1e11)
 */
export function normalizeSeconds(timestamp: number): number {
  return timestamp > 1e11 ? Math.floor(timestamp / 1000) : Math.floor(timestamp);
}

/**
 * Calculates pairwise headways for an ordered sequence of departures at a given stop/corridor.
 * Sorts departures chronologically before calculating intervals.
 *
 * @param departures Array of departures (scheduled or real-time)
 * @param useActualTime If true, uses actualTime when present; falls back to scheduledTime
 * @returns Array of HeadwayResult objects representing intervals between sequential departures
 */
export function calculateHeadways(
  departures: TransitDeparture[],
  useActualTime: boolean = false
): HeadwayResult[] {
  if (departures.length < 2) {
    return [];
  }

  // Clone and sort chronologically
  const sorted = [...departures].sort((a, b) => {
    const timeA = normalizeSeconds(useActualTime && a.actualTime ? a.actualTime : a.scheduledTime);
    const timeB = normalizeSeconds(useActualTime && b.actualTime ? b.actualTime : b.scheduledTime);
    return timeA - timeB;
  });

  const results: HeadwayResult[] = [];

  for (let i = 1; i < sorted.length; i++) {
    const prev = sorted[i - 1];
    const curr = sorted[i];

    const prevTime = normalizeSeconds(
      useActualTime && prev.actualTime ? prev.actualTime : prev.scheduledTime
    );
    const currTime = normalizeSeconds(
      useActualTime && curr.actualTime ? curr.actualTime : curr.scheduledTime
    );

    const headwaySeconds = Math.max(0, currTime - prevTime);
    const headwayMinutes = parseFloat((headwaySeconds / 60).toFixed(2));

    let headwayDeltaSeconds: number | undefined;
    if (useActualTime && prev.actualTime && curr.actualTime) {
      const scheduledHeadway =
        normalizeSeconds(curr.scheduledTime) - normalizeSeconds(prev.scheduledTime);
      headwayDeltaSeconds = headwaySeconds - scheduledHeadway;
    }

    results.push({
      headwaySeconds,
      headwayMinutes,
      headwayDeltaSeconds,
      fromTripId: prev.tripId,
      toTripId: curr.tripId,
      fromTimestamp: prevTime,
      toTimestamp: currTime,
    });
  }

  return results;
}

/**
 * Calculates the mean, median, min, and max headway from a collection of departures.
 */
export function computeHeadwayMetrics(headways: HeadwayResult[]) {
  if (headways.length === 0) {
    return { count: 0, meanSec: 0, medianSec: 0, minSec: 0, maxSec: 0, meanMin: 0, medianMin: 0 };
  }

  const secondsArr = headways.map((h) => h.headwaySeconds).sort((a, b) => a - b);
  const totalSec = secondsArr.reduce((sum, val) => sum + val, 0);
  const meanSec = Math.round(totalSec / secondsArr.length);

  const mid = Math.floor(secondsArr.length / 2);
  const medianSec =
    secondsArr.length % 2 !== 0
      ? secondsArr[mid]
      : Math.round((secondsArr[mid - 1] + secondsArr[mid]) / 2);

  return {
    count: headways.length,
    meanSec,
    medianSec,
    minSec: secondsArr[0],
    maxSec: secondsArr[secondsArr.length - 1],
    meanMin: parseFloat((meanSec / 60).toFixed(2)),
    medianMin: parseFloat((medianSec / 60).toFixed(2)),
  };
}
