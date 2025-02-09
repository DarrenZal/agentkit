"use strict";
// File: typescript/agentkit/src/action-providers/knowledge/knowledgeSchemas.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.MintKnowledgeAssetSchema = void 0;
const zod_1 = require("zod");
/**
 * Input schema for minting a knowledge asset.
 */
exports.MintKnowledgeAssetSchema = zod_1.z
    .object({
    assetName: zod_1.z.string().describe("The name of the knowledge asset"),
    assetMetadata: zod_1.z.string().describe("Metadata associated with the knowledge asset"),
})
    .strip()
    .describe("Instructions for minting a new knowledge asset");
