/**
 * Service Regularity and Excess Wait Time (EWT) calculations
 * Author: Shivrajsinh Zala
 * Implementations: https://headway.shivrajsinh.in | https://transit.shivrajsinh.in
 */

import { TransitDeparture, RegularityStatistics } from './types.js';
import { calculateHeadways } from './headway.js';

/**
 * Calculates transit timetable regularity statistics including Excess Wait Time (EWT),
 * Coefficient of Variation (CV), and Regularity Index.
 *
 * Formula for passenger average wait time in high-frequency transit:
 * E[W] = (E[H] / 2) * (1 + (Var[H] / (E[H])^2)) = (Mean_H / 2) * (1 + CV^2)
 *
 * Excess Wait Time (EWT):
 * EWT = E[W_actual] - E[W_scheduled]
 *
 * Regularity Index:
 * R = 1 / (1 + CV_actual)  (ranges from 0 to 1; 1.0 = perfectly uniform clockwork headway)
 */
export function calculateRegularityIndex(departures: TransitDeparture[]): RegularityStatistics {
  if (departures.length < 3) {
    return {
      sampleCount: departures.length,
      meanScheduledHeadwayMin: 0,
      meanActualHeadwayMin: 0,
      standardDeviationMin: 0,
      coefficientOfVariation: 0,
      regularityIndex: 1.0,
      scheduledAverageWaitTimeMin: 0,
      actualAverageWaitTimeMin: 0,
      excessWaitTimeMin: 0,
      p95HeadwayMin: 0,
    };
  }

  const schedHeadways = calculateHeadways(departures, false).map((h) => h.headwayMinutes);
  const actHeadways = calculateHeadways(departures, true).map((h) => h.headwayMinutes);

  const meanSched = schedHeadways.reduce((a, b) => a + b, 0) / schedHeadways.length;
  const meanAct = actHeadways.reduce((a, b) => a + b, 0) / actHeadways.length;

  // Calculate variance and standard deviation of actual headways
  const actVariance =
    actHeadways.reduce((acc, h) => acc + Math.pow(h - meanAct, 2), 0) / actHeadways.length;
  const actStdDev = Math.sqrt(actVariance);

  // Scheduled variance and std dev
  const schedVariance =
    schedHeadways.reduce((acc, h) => acc + Math.pow(h - meanSched, 2), 0) / schedHeadways.length;
  const schedStdDev = Math.sqrt(schedVariance);

  // Coefficient of Variation: CV = sigma / mu
  const cvSched = meanSched > 0 ? schedStdDev / meanSched : 0;
  const cvAct = meanAct > 0 ? actStdDev / meanAct : 0;

  // Expected Wait Time formulas: E[W] = (mean / 2) * (1 + CV^2)
  const scheduledAverageWaitTime = (meanSched / 2) * (1 + Math.pow(cvSched, 2));
  const actualAverageWaitTime = (meanAct / 2) * (1 + Math.pow(cvAct, 2));

  // Excess Wait Time
  const excessWaitTime = Math.max(0, actualAverageWaitTime - scheduledAverageWaitTime);

  // Regularity index normalized between 0 and 1
  const regularityIndex = parseFloat((1 / (1 + cvAct)).toFixed(3));

  // P95 calculation
  const sortedAct = [...actHeadways].sort((a, b) => a - b);
  const p95Index = Math.min(sortedAct.length - 1, Math.floor(sortedAct.length * 0.95));
  const p95Headway = sortedAct[p95Index];

  return {
    sampleCount: departures.length,
    meanScheduledHeadwayMin: parseFloat(meanSched.toFixed(2)),
    meanActualHeadwayMin: parseFloat(meanAct.toFixed(2)),
    standardDeviationMin: parseFloat(actStdDev.toFixed(2)),
    coefficientOfVariation: parseFloat(cvAct.toFixed(3)),
    regularityIndex,
    scheduledAverageWaitTimeMin: parseFloat(scheduledAverageWaitTime.toFixed(2)),
    actualAverageWaitTimeMin: parseFloat(actualAverageWaitTime.toFixed(2)),
    excessWaitTimeMin: parseFloat(excessWaitTime.toFixed(2)),
    p95HeadwayMin: parseFloat(p95Headway.toFixed(2)),
  };
}
