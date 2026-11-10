/**
 * Bunching and Gapping Detection
 * Author: Shivrajsinh Zala
 * Implementations: https://headway.shivrajsinh.in | https://transit.shivrajsinh.in
 */
import { TransitDeparture, BunchingGapAlert } from './types.js';
export interface BunchingThresholds {
    /** Headway ratio below which departures are considered bunched (default: 0.35, e.g. <3.5 min on a 10 min line) */
    bunchingRatio?: number;
    /** Headway ratio above which departures are considered gapped (default: 1.75, e.g. >17.5 min on a 10 min line) */
    gappingRatio?: number;
}
/**
 * Detects bus/train bunching and excessive headway gaps along a corridor.
 */
export declare function detectBunchingAndGaps(departures: TransitDeparture[], thresholds?: BunchingThresholds): BunchingGapAlert[];
//# sourceMappingURL=bunching.d.ts.map