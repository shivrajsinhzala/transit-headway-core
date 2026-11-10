/**
 * Service Regularity and Excess Wait Time (EWT) calculations
 * Author: Shivrajsinh Zala
 * Implementations: https://headway.shivrajsinh.in | https://transit.shivrajsinh.in
 */
import { TransitDeparture, RegularityStatistics } from './types.js';
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
export declare function calculateRegularityIndex(departures: TransitDeparture[]): RegularityStatistics;
//# sourceMappingURL=regularity.d.ts.map