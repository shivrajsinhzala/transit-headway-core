/**
 * Transit Headway Core - Type Definitions
 * Author: Shivrajsinh Zala
 * Implementations: https://headway.shivrajsinh.in | https://transit.shivrajsinh.in
 */

export interface TransitDeparture {
  /** Trip identifier (GTFS trip_id or real-time ID) */
  tripId: string;
  /** Route identifier (GTFS route_id or short name) */
  routeId: string;
  /** Stop identifier (GTFS stop_id) */
  stopId: string;
  /** Scheduled departure timestamp in epoch milliseconds or seconds */
  scheduledTime: number;
  /** Actual / Real-time estimated departure timestamp (if available) */
  actualTime?: number;
  /** Direction ID (0 or 1) */
  directionId?: number;
  /** Vehicle identifier if tracked in real-time */
  vehicleId?: string;
}

export interface HeadwayResult {
  /** Headway in seconds between departure n-1 and departure n */
  headwaySeconds: number;
  /** Headway in fractional minutes */
  headwayMinutes: number;
  /** Scheduled headway vs actual headway delta (seconds) */
  headwayDeltaSeconds?: number;
  /** Preceding departure trip ID */
  fromTripId: string;
  /** Current departure trip ID */
  toTripId: string;
  /** Departure timestamp of preceding vehicle */
  fromTimestamp: number;
  /** Departure timestamp of current vehicle */
  toTimestamp: number;
}

export interface RegularityStatistics {
  /** Total number of trips analyzed */
  sampleCount: number;
  /** Mean scheduled headway in minutes */
  meanScheduledHeadwayMin: number;
  /** Mean actual headway in minutes */
  meanActualHeadwayMin: number;
  /** Standard deviation of actual headway */
  standardDeviationMin: number;
  /** Coefficient of Variation (CV = SD / Mean) */
  coefficientOfVariation: number;
  /** Headway Regularity Index (0.0 to 1.0, where 1.0 is perfectly clockwork) */
  regularityIndex: number;
  /** Scheduled Average Wait Time: E(W_sched) = E(H_sched)/2 * (1 + CV_sched^2) */
  scheduledAverageWaitTimeMin: number;
  /** Actual Average Wait Time: E(W_act) = E(H_act)/2 * (1 + CV_act^2) */
  actualAverageWaitTimeMin: number;
  /** Excess Wait Time (EWT) in minutes: actual wait time - scheduled wait time */
  excessWaitTimeMin: number;
  /** 95th Percentile Headway in minutes */
  p95HeadwayMin: number;
}

export interface BunchingGapAlert {
  type: 'BUNCHING' | 'GAPPING';
  precedingTripId: string;
  followingTripId: string;
  scheduledHeadwaySec: number;
  actualHeadwaySec: number;
  ratio: number;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface FrequencyCorridorOptions {
  /** Minimum departures per hour to qualify as a high-frequency corridor (default: 6, i.e., <=10m headway) */
  minDeparturesPerHour?: number;
  /** Window start hour (0-23, e.g. 7 for morning peak) */
  startHour?: number;
  /** Window end hour (0-23, e.g. 19 for evening peak) */
  endHour?: number;
  /** Maximum acceptable headway in minutes (default: 15) */
  maxHeadwayMinutes?: number;
}

export interface CorridorFrequencySummary {
  stopId: string;
  totalDepartures: number;
  windowDurationHours: number;
  departuresPerHour: number;
  averageHeadwayMin: number;
  medianHeadwayMin: number;
  isHighFrequency: boolean;
}
