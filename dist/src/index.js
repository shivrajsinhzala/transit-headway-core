"use strict";
/**
 * transit-headway-core
 * High-performance transit headway calculation, irregularity analysis, and EWT calculation.
 *
 * Author: Shivrajsinh Zala
 * Live Applications:
 *  - Headway: https://headway.shivrajsinh.in
 *  - Stopwatch Transit: https://transit.shivrajsinh.in
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./types.js"), exports);
__exportStar(require("./headway.js"), exports);
__exportStar(require("./regularity.js"), exports);
__exportStar(require("./bunching.js"), exports);
__exportStar(require("./corridor.js"), exports);
//# sourceMappingURL=index.js.map