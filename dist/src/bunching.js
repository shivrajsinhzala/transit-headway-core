"use strict";
/**
 * Bunching and Gapping Detection
 * Author: Shivrajsinh Zala
 * Implementations: https://headway.shivrajsinh.in | https://transit.shivrajsinh.in
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectBunchingAndGaps = detectBunchingAndGaps;
const headway_js_1 = require("./headway.js");
/**
 * Detects bus/train bunching and excessive headway gaps along a corridor.
 */
function detectBunchingAndGaps(departures, thresholds = {}) {
    const bunchRatioThresh = thresholds.bunchingRatio ?? 0.35;
    const gapRatioThresh = thresholds.gappingRatio ?? 1.75;
    const actualHeadways = (0, headway_js_1.calculateHeadways)(departures, true);
    const schedHeadways = (0, headway_js_1.calculateHeadways)(departures, false);
    const schedMap = new Map();
    for (const sh of schedHeadways) {
        schedMap.set(`${sh.fromTripId}->${sh.toTripId}`, sh.headwaySeconds);
    }
    const alerts = [];
    for (const ah of actualHeadways) {
        const key = `${ah.fromTripId}->${ah.toTripId}`;
        const schedSec = schedMap.get(key) || ah.headwaySeconds;
        if (schedSec <= 0)
            continue;
        const ratio = ah.headwaySeconds / schedSec;
        if (ratio <= bunchRatioThresh) {
            let severity = 'LOW';
            if (ratio <= 0.15)
                severity = 'CRITICAL';
            else if (ratio <= 0.25)
                severity = 'HIGH';
            else
                severity = 'MEDIUM';
            alerts.push({
                type: 'BUNCHING',
                precedingTripId: ah.fromTripId,
                followingTripId: ah.toTripId,
                scheduledHeadwaySec: schedSec,
                actualHeadwaySec: ah.headwaySeconds,
                ratio: parseFloat(ratio.toFixed(2)),
                severity,
            });
        }
        else if (ratio >= gapRatioThresh) {
            let severity = 'LOW';
            if (ratio >= 2.5)
                severity = 'CRITICAL';
            else if (ratio >= 2.0)
                severity = 'HIGH';
            else
                severity = 'MEDIUM';
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
//# sourceMappingURL=bunching.js.map