import { ActionProvider } from "../actionProvider";
import { EvmWalletProvider } from "../../wallet-providers";
import { Network } from "../../network";
/**
 * KnowledgeActionProvider is an action provider for minting knowledge assets.
 * This provider requires an EVM wallet and exposes an action that, for testing,
 * simply returns "successful".
 */
export declare class KnowledgeActionProvider extends ActionProvider<EvmWalletProvider> {
    /**
     * Constructs a new KnowledgeActionProvider.
     */
    constructor();
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
    mintKnowledgeAsset(walletProvider: EvmWalletProvider, args: {
        assetName: string;
        assetMetadata: string;
    }): Promise<string>;
    /**
     * Checks if the knowledge action provider supports the given network.
     *
     * @param network - The network to check.
     * @returns True if the network is supported; otherwise, false.
     */
    supportsNetwork: (network: Network) => boolean;
}
/**
 * Factory function for creating a new KnowledgeActionProvider.
 *
 * @returns A new instance of KnowledgeActionProvider.
 */
export declare const knowledgeActionProvider: () => KnowledgeActionProvider;
