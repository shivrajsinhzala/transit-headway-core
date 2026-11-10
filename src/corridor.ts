/**
 * Transit Corridor Frequency Analysis
 * Author: Shivrajsinh Zala
 * Implementations: https://headway.shivrajsinh.in | https://transit.shivrajsinh.in
 */

import { TransitDeparture, FrequencyCorridorOptions, CorridorFrequencySummary } from './types.js';
import { calculateHeadways, computeHeadwayMetrics } from './headway.js';

/**
 * Analyzes departure frequencies at a stop or along a merged trunk corridor over a specified time window.
 */
export function analyzeCorridorFrequency(
  stopId: string,
  departures: TransitDeparture[],
  options: FrequencyCorridorOptions = {}
): CorridorFrequencySummary {
  const minDPH = options.minDeparturesPerHour ?? 6;
  const maxHeadway = options.maxHeadwayMinutes ?? 15;

  if (departures.length === 0) {
    return {
      stopId,
      totalDepartures: 0,
      windowDurationHours: 0,
      departuresPerHour: 0,
      averageHeadwayMin: 0,
      medianHeadwayMin: 0,
      isHighFrequency: false,
    };
  }

  // Filter by hour if specified
  let filtered = departures;
  if (options.startHour !== undefined && options.endHour !== undefined) {
    filtered = departures.filter((d) => {
      const date = new Date(d.scheduledTime > 1e11 ? d.scheduledTime : d.scheduledTime * 1000);
      const hour = date.getHours();
      return hour >= options.startHour! && hour <= options.endHour!;
    });
  }

  if (filtered.length < 2) {
    return {
      stopId,
      totalDepartures: filtered.length,
      windowDurationHours: 1,
      departuresPerHour: filtered.length,
      averageHeadwayMin: 0,
      medianHeadwayMin: 0,
      isHighFrequency: false,
    };
  }

  const headways = calculateHeadways(filtered, false);
  const metrics = computeHeadwayMetrics(headways);

  const firstTime = Math.min(...filtered.map((d) => d.scheduledTime));
  const lastTime = Math.max(...filtered.map((d) => d.scheduledTime));
  const durationSec =
    firstTime > 1e11 ? (lastTime - firstTime) / 1000 : lastTime - firstTime;
  const durationHours = Math.max(1, durationSec / 3600);

  const departuresPerHour = parseFloat((filtered.length / durationHours).toFixed(1));
  const isHighFrequency = departuresPerHour >= minDPH && metrics.meanMin <= maxHeadway;

  return {
    stopId,
    totalDepartures: filtered.length,
    windowDurationHours: parseFloat(durationHours.toFixed(2)),
    departuresPerHour,
    averageHeadwayMin: metrics.meanMin,
    medianHeadwayMin: metrics.medianMin,
    isHighFrequency,
  };
}
