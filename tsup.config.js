"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tsup_1 = require("tsup");
exports.default = (0, tsup_1.defineConfig)({
    entryPoints: ["src/node/cli.ts"],
    bundle: true,
    splitting: true,
    outDir: "dist",
    format: ["cjs", "esm"],
    dts: true,
    shims: true,
});
