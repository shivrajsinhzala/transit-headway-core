"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = require("node:test");
const node_assert_1 = __importDefault(require("node:assert"));
const index_js_1 = require("../src/index.js");
(0, node_test_1.describe)('transit-headway-core', () => {
    const baseTime = 1700000000; // Epoch seconds
    const sampleDepartures = [
        { tripId: 'T1', routeId: 'R1', stopId: 'S1', scheduledTime: baseTime, actualTime: baseTime + 60 },
        { tripId: 'T2', routeId: 'R1', stopId: 'S1', scheduledTime: baseTime + 600, actualTime: baseTime + 630 },
        { tripId: 'T3', routeId: 'R1', stopId: 'S1', scheduledTime: baseTime + 1200, actualTime: baseTime + 1220 },
        { tripId: 'T4', routeId: 'R1', stopId: 'S1', scheduledTime: baseTime + 1800, actualTime: baseTime + 2100 },
    ];
    (0, node_test_1.it)('calculates scheduled headways correctly', () => {
        const headways = (0, index_js_1.calculateHeadways)(sampleDepartures, false);
        node_assert_1.default.strictEqual(headways.length, 3);
        node_assert_1.default.strictEqual(headways[0].headwaySeconds, 600);
        node_assert_1.default.strictEqual(headways[0].headwayMinutes, 10.0);
        node_assert_1.default.strictEqual(headways[1].headwayMinutes, 10.0);
        node_assert_1.default.strictEqual(headways[2].headwayMinutes, 10.0);
    });
    (0, node_test_1.it)('calculates regularity index and excess wait time', () => {
        const stats = (0, index_js_1.calculateRegularityIndex)(sampleDepartures);
        node_assert_1.default.strictEqual(stats.sampleCount, 4);
        node_assert_1.default.strictEqual(stats.meanScheduledHeadwayMin, 10.0);
        (0, node_assert_1.default)(stats.regularityIndex > 0 && stats.regularityIndex <= 1.0);
        (0, node_assert_1.default)(stats.excessWaitTimeMin >= 0);
    });
    (0, node_test_1.it)('detects bunching or gapping if headway deviates significantly', () => {
        const bunchedDepartures = [
            { tripId: 'T1', routeId: 'R1', stopId: 'S1', scheduledTime: baseTime, actualTime: baseTime },
            { tripId: 'T2', routeId: 'R1', stopId: 'S1', scheduledTime: baseTime + 600, actualTime: baseTime + 120 }, // 2m instead of 10m -> bunching
            { tripId: 'T3', routeId: 'R1', stopId: 'S1', scheduledTime: baseTime + 1200, actualTime: baseTime + 2400 }, // 38m instead of 10m -> gapping
        ];
        const alerts = (0, index_js_1.detectBunchingAndGaps)(bunchedDepartures);
        (0, node_assert_1.default)(alerts.length >= 2);
        (0, node_assert_1.default)(alerts.some((a) => a.type === 'BUNCHING'));
        (0, node_assert_1.default)(alerts.some((a) => a.type === 'GAPPING'));
    });
    (0, node_test_1.it)('evaluates corridor frequency and qualifies high frequency', () => {
        const corridor = (0, index_js_1.analyzeCorridorFrequency)('S1', sampleDepartures);
        node_assert_1.default.strictEqual(corridor.stopId, 'S1');
        node_assert_1.default.strictEqual(corridor.totalDepartures, 4);
        (0, node_assert_1.default)(corridor.averageHeadwayMin === 10);
    });
});
//# sourceMappingURL=headway.test.js.map