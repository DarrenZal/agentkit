"use strict";
// File: typescript/agentkit/src/action-providers/knowledge/knowledgeActionProvider.ts
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.knowledgeActionProvider = exports.KnowledgeActionProvider = void 0;
const actionProvider_1 = require("../actionProvider");
const actionDecorator_1 = require("../actionDecorator");
const schemas_1 = require("./schemas");
const wallet_providers_1 = require("../../wallet-providers");
/**
 * KnowledgeActionProvider is an action provider for minting knowledge assets.
 * This provider requires an EVM wallet and exposes an action that, for testing,
 * simply returns "successful".
 */
class KnowledgeActionProvider extends actionProvider_1.ActionProvider {
    /**
     * Constructs a new KnowledgeActionProvider.
     */
    constructor() {
        super("knowledge", []);
        /**
         * Checks if the knowledge action provider supports the given network.
         *
         * @param network - The network to check.
         * @returns True if the network is supported; otherwise, false.
         */
        this.supportsNetwork = (network) => {
            return true;
        };
    }
    /**
     * Mints a new knowledge asset.
     *
     * For testing purposes, this method simply returns "successful".
     *
     * @param walletProvider - The EVM wallet provider to use for signing or sending transactions.
     * @param args - An object containing:
     *   - assetName: The name of the knowledge asset.
     *   - assetMetadata: The metadata associated with the knowledge asset.
     * @returns A promise that resolves to "successful".
     *
     * @param args.assetName - The name of the knowledge asset.
     * @param args.assetMetadata - The metadata associated with the knowledge asset.
     */
    async mintKnowledgeAsset(walletProvider, args) {
        return "successful";
    }
}
exports.KnowledgeActionProvider = KnowledgeActionProvider;
__decorate([
    (0, actionDecorator_1.CreateAction)({
        name: "mint_knowledge_asset",
        description: "Mint a new knowledge asset via OriginTrail's DKG.",
        schema: schemas_1.MintKnowledgeAssetSchema,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [wallet_providers_1.EvmWalletProvider, Object]),
    __metadata("design:returntype", Promise)
], KnowledgeActionProvider.prototype, "mintKnowledgeAsset", null);
/**
 * Factory function for creating a new KnowledgeActionProvider.
 *
 * @returns A new instance of KnowledgeActionProvider.
 */
const knowledgeActionProvider = () => new KnowledgeActionProvider();
exports.knowledgeActionProvider = knowledgeActionProvider;
