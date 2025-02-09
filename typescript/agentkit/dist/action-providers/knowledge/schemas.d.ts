import { z } from "zod";
/**
 * Input schema for minting a knowledge asset.
 */
export declare const MintKnowledgeAssetSchema: z.ZodObject<{
    assetName: z.ZodString;
    assetMetadata: z.ZodString;
}, "strip", z.ZodTypeAny, {
    assetName: string;
    assetMetadata: string;
}, {
    assetName: string;
    assetMetadata: string;
}>;
