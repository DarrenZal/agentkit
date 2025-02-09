// File: typescript/agentkit/src/action-providers/knowledge/knowledgeSchemas.ts

import { z } from "zod";

/**
 * Input schema for minting a knowledge asset.
 */
export const MintKnowledgeAssetSchema = z
  .object({
    assetName: z.string().describe("The name of the knowledge asset"),
    assetMetadata: z.string().describe("Metadata associated with the knowledge asset"),
  })
  .strip()
  .describe("Instructions for minting a new knowledge asset");
