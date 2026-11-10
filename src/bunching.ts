/**
 * Bunching and Gapping Detection
 * Author: Shivrajsinh Zala
 * Implementations: https://headway.shivrajsinh.in | https://transit.shivrajsinh.in
 */

import { TransitDeparture, BunchingGapAlert } from './types.js';
import { calculateHeadways } from './headway.js';

export interface BunchingThresholds {
  /** Headway ratio below which departures are considered bunched (default: 0.35, e.g. <3.5 min on a 10 min line) */
  bunchingRatio?: number;
  /** Headway ratio above which departures are considered gapped (default: 1.75, e.g. >17.5 min on a 10 min line) */
  gappingRatio?: number;
}

/**
 * Detects bus/train bunching and excessive headway gaps along a corridor.
 */
export function detectBunchingAndGaps(
  departures: TransitDeparture[],
  thresholds: BunchingThresholds = {}
): BunchingGapAlert[] {
  const bunchRatioThresh = thresholds.bunchingRatio ?? 0.35;
  const gapRatioThresh = thresholds.gappingRatio ?? 1.75;

  const actualHeadways = calculateHeadways(departures, true);
  const schedHeadways = calculateHeadways(departures, false);

  const schedMap = new Map<string, number>();
  for (const sh of schedHeadways) {
    schedMap.set(`${sh.fromTripId}->${sh.toTripId}`, sh.headwaySeconds);
  }

  const alerts: BunchingGapAlert[] = [];

  for (const ah of actualHeadways) {
    const key = `${ah.fromTripId}->${ah.toTripId}`;
    const schedSec = schedMap.get(key) || ah.headwaySeconds;

    if (schedSec <= 0) continue;

    const ratio = ah.headwaySeconds / schedSec;

    if (ratio <= bunchRatioThresh) {
      let severity: BunchingGapAlert['severity'] = 'LOW';
      if (ratio <= 0.15) severity = 'CRITICAL';
      else if (ratio <= 0.25) severity = 'HIGH';
      else severity = 'MEDIUM';

      alerts.push({
        type: 'BUNCHING',
        precedingTripId: ah.fromTripId,
        followingTripId: ah.toTripId,
        scheduledHeadwaySec: schedSec,
        actualHeadwaySec: ah.headwaySeconds,
        ratio: parseFloat(ratio.toFixed(2)),
        severity,
      });
    } else if (ratio >= gapRatioThresh) {
      let severity: BunchingGapAlert['severity'] = 'LOW';
      if (ratio >= 2.5) severity = 'CRITICAL';
      else if (ratio >= 2.0) severity = 'HIGH';
      else severity = 'MEDIUM';

      alerts.push({
        type: 'GAPPING',
        precedingTripId: ah.fromTripId,
        followingTripId: ah.toTripId,
        scheduledHeadwaySec: schedSec,
        actualHeadwaySec: ah.headwaySeconds,
        ratio: parseFloat(ratio.toFixed(2)),
        severity,
      });
    }
  }

  return alerts;
}
