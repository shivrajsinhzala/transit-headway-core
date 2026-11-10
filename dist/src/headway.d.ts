/**
 * Headway calculation primitives
 * Author: Shivrajsinh Zala
 * Implementations: https://headway.shivrajsinh.in | https://transit.shivrajsinh.in
 */
import { TransitDeparture, HeadwayResult } from './types.js';
/**
 * Normalizes timestamp input (converts epoch ms to seconds if timestamp > 1e11)
 */
export declare function normalizeSeconds(timestamp: number): number;
/**
 * Calculates pairwise headways for an ordered sequence of departures at a given stop/corridor.
 * Sorts departures chronologically before calculating intervals.
 *
 * @param departures Array of departures (scheduled or real-time)
 * @param useActualTime If true, uses actualTime when present; falls back to scheduledTime
 * @returns Array of HeadwayResult objects representing intervals between sequential departures
 */
export declare function calculateHeadways(departures: TransitDeparture[], useActualTime?: boolean): HeadwayResult[];
/**
 * Calculates the mean, median, min, and max headway from a collection of departures.
 */
export declare function computeHeadwayMetrics(headways: HeadwayResult[]): {
    count: number;
    meanSec: number;
    medianSec: number;
    minSec: number;
    maxSec: number;
    meanMin: number;
    medianMin: number;
};
//# sourceMappingURL=headway.d.ts.map