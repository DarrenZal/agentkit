Project Path: erc20

Source Tree:

```
├── README.md
├── constants.ts
├── erc20ActionProvider.test.ts
├── erc20ActionProvider.ts
├── index.ts
└── schemas.ts
```

`typescript/agentkit/src/action-providers/erc20/schemas.ts`:

```ts
import { z } from "zod";

/**
 * Input schema for transfer action.
 */
export const TransferSchema = z
  .object({
    amount: z.custom<bigint>().describe("The amount of the asset to transfer"),
    contractAddress: z.string().describe("The contract address of the token to transfer"),
    destination: z.string().describe("The destination to transfer the funds"),
  })
  .strip()
  .describe("Instructions for transferring assets");

/**
 * Input schema for get balance action.
 */
export const GetBalanceSchema = z
  .object({
    contractAddress: z
      .string()
      .describe("The contract address of the token to get the balance for"),
  })
  .strip()
  .describe("Instructions for getting wallet balance");

```


`typescript/agentkit/src/action-providers/erc20/erc20ActionProvider.ts`:

```ts
import { z } from "zod";
import { ActionProvider } from "../actionProvider";
import { Network } from "../../network";
import { CreateAction } from "../actionDecorator";
import { GetBalanceSchema, TransferSchema } from "./schemas";
import { abi } from "./constants";
import { encodeFunctionData, Hex } from "viem";
import { EvmWalletProvider } from "../../wallet-providers";

/**
 * ERC20ActionProvider is an action provider for ERC20 tokens.
 */
export class ERC20ActionProvider extends ActionProvider<EvmWalletProvider> {
  /**
   * Constructor for the ERC20ActionProvider.
   */
  constructor() {
    super("erc20", []);
  }

  /**
   * Gets the balance of an ERC20 token.
   *
   * @param walletProvider - The wallet provider to get the balance from.
   * @param args - The input arguments for the action.
   * @returns A message containing the balance.
   */
  @CreateAction({
    name: "get_balance",
    description: `
    This tool will get the balance of an ERC20 asset in the wallet. It takes the contract address as input.
    `,
    schema: GetBalanceSchema,
  })
  async getBalance(
    walletProvider: EvmWalletProvider,
    args: z.infer<typeof GetBalanceSchema>,
  ): Promise<string> {
    try {
      const balance = await walletProvider.readContract({
        address: args.contractAddress as Hex,
        abi,
        functionName: "balanceOf",
        args: [walletProvider.getAddress()],
      });

      return `Balance of ${args.contractAddress} is ${balance}`;
    } catch (error) {
      return `Error getting balance: ${error}`;
    }
  }

  /**
   * Transfers a specified amount of an ERC20 token to a destination onchain.
   *
   * @param walletProvider - The wallet provider to transfer the asset from.
   * @param args - The input arguments for the action.
   * @returns A message containing the transfer details.
   */
  @CreateAction({
    name: "transfer",
    description: `
    This tool will transfer an ERC20 token from the wallet to another onchain address.

It takes the following inputs:
- amount: The amount to transfer
- contractAddress: The contract address of the token to transfer
- destination: Where to send the funds (can be an onchain address, ENS 'example.eth', or Basename 'example.base.eth')

Important notes:
- Ensure sufficient balance of the input asset before transferring
- When sending native assets (e.g. 'eth' on base-mainnet), ensure there is sufficient balance for the transfer itself AND the gas cost of this transfer
    `,
    schema: TransferSchema,
  })
  async transfer(
    walletProvider: EvmWalletProvider,
    args: z.infer<typeof TransferSchema>,
  ): Promise<string> {
    try {
      const hash = await walletProvider.sendTransaction({
        to: args.contractAddress as Hex,
        data: encodeFunctionData({
          abi,
          functionName: "transfer",
          args: [args.destination as Hex, BigInt(args.amount)],
        }),
      });

      await walletProvider.waitForTransactionReceipt(hash);

      return `Transferred ${args.amount} of ${args.contractAddress} to ${
        args.destination
      }.\nTransaction hash for the transfer: ${hash}`;
    } catch (error) {
      return `Error transferring the asset: ${error}`;
    }
  }

  /**
   * Checks if the ERC20 action provider supports the given network.
   *
   * @param _ - The network to check.
   * @returns True if the ERC20 action provider supports the network, false otherwise.
   */
  supportsNetwork = (_: Network) => true;
}

export const erc20ActionProvider = () => new ERC20ActionProvider();

```


`typescript/agentkit/src/action-providers/erc20/README.md`:

```md
# ERC20 Action Provider
```


`typescript/agentkit/src/action-providers/erc20/constants.ts`:

```ts
export const abi = [
  {
    type: "event",
    name: "Approval",
    inputs: [
      {
        indexed: true,
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        name: "value",
        type: "uint256",
      },
    ],
  },
  {
    type: "event",
    name: "Transfer",
    inputs: [
      {
        indexed: true,
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        name: "value",
        type: "uint256",
      },
    ],
  },
  {
    type: "function",
    name: "allowance",
    stateMutability: "view",
    inputs: [
      {
        name: "owner",
        type: "address",
      },
      {
        name: "spender",
        type: "address",
      },
    ],
    outputs: [
      {
        type: "uint256",
      },
    ],
  },
  {
    type: "function",
    name: "approve",
    stateMutability: "nonpayable",
    inputs: [
      {
        name: "spender",
        type: "address",
      },
      {
        name: "amount",
        type: "uint256",
      },
    ],
    outputs: [
      {
        type: "bool",
      },
    ],
  },
  {
    type: "function",
    name: "balanceOf",
    stateMutability: "view",
    inputs: [
      {
        name: "account",
        type: "address",
      },
    ],
    outputs: [
      {
        type: "uint256",
      },
    ],
  },
  {
    type: "function",
    name: "decimals",
    stateMutability: "view",
    inputs: [],
    outputs: [
      {
        type: "uint8",
      },
    ],
  },
  {
    type: "function",
    name: "name",
    stateMutability: "view",
    inputs: [],
    outputs: [
      {
        type: "string",
      },
    ],
  },
  {
    type: "function",
    name: "symbol",
    stateMutability: "view",
    inputs: [],
    outputs: [
      {
        type: "string",
      },
    ],
  },
  {
    type: "function",
    name: "totalSupply",
    stateMutability: "view",
    inputs: [],
    outputs: [
      {
        type: "uint256",
      },
    ],
  },
  {
    type: "function",
    name: "transfer",
    stateMutability: "nonpayable",
    inputs: [
      {
        name: "recipient",
        type: "address",
      },
      {
        name: "amount",
        type: "uint256",
      },
    ],
    outputs: [
      {
        type: "bool",
      },
    ],
  },
  {
    type: "function",
    name: "transferFrom",
    stateMutability: "nonpayable",
    inputs: [
      {
        name: "sender",
        type: "address",
      },
      {
        name: "recipient",
        type: "address",
      },
      {
        name: "amount",
        type: "uint256",
      },
    ],
    outputs: [
      {
        type: "bool",
      },
    ],
  },
] as const;

```


`typescript/agentkit/src/action-providers/erc20/erc20ActionProvider.test.ts`:

```ts
import { erc20ActionProvider } from "./erc20ActionProvider";
import { TransferSchema } from "./schemas";
import { EvmWalletProvider } from "../../wallet-providers";
import { encodeFunctionData, Hex } from "viem";
import { abi } from "./constants";

const MOCK_AMOUNT = 15;
const MOCK_CONTRACT_ADDRESS = "0x1234567890123456789012345678901234567890";
const MOCK_DESTINATION = "0x9876543210987654321098765432109876543210";
const MOCK_ADDRESS = "0x1234567890123456789012345678901234567890";

describe("Transfer Schema", () => {
  it("should successfully parse valid input", () => {
    const validInput = {
      amount: MOCK_AMOUNT,
      contractAddress: MOCK_CONTRACT_ADDRESS,
      destination: MOCK_DESTINATION,
    };

    const result = TransferSchema.safeParse(validInput);

    expect(result.success).toBe(true);
    expect(result.data).toEqual(validInput);
  });

  it("should fail parsing empty input", () => {
    const emptyInput = {};
    const result = TransferSchema.safeParse(emptyInput);

    expect(result.success).toBe(false);
  });
});

describe("Get Balance Action", () => {
  let mockWallet: jest.Mocked<EvmWalletProvider>;
  const actionProvider = erc20ActionProvider();

  beforeEach(async () => {
    mockWallet = {
      getAddress: jest.fn().mockReturnValue(MOCK_ADDRESS),
      readContract: jest.fn(),
    } as unknown as jest.Mocked<EvmWalletProvider>;

    mockWallet.readContract.mockResolvedValue(MOCK_AMOUNT);
  });

  it("should successfully respond", async () => {
    const args = {
      contractAddress: MOCK_CONTRACT_ADDRESS,
    };

    const response = await actionProvider.getBalance(mockWallet, args);

    expect(mockWallet.readContract).toHaveBeenCalledWith({
      address: args.contractAddress as Hex,
      abi,
      functionName: "balanceOf",
      args: [mockWallet.getAddress()],
    });
    expect(response).toContain(`Balance of ${MOCK_CONTRACT_ADDRESS} is ${MOCK_AMOUNT}`);
  });

  it("should fail with an error", async () => {
    const args = {
      contractAddress: MOCK_CONTRACT_ADDRESS,
    };

    const error = new Error("Failed to get balance");
    mockWallet.readContract.mockRejectedValue(error);

    const response = await actionProvider.getBalance(mockWallet, args);

    expect(mockWallet.readContract).toHaveBeenCalledWith({
      address: args.contractAddress as Hex,
      abi,
      functionName: "balanceOf",
      args: [mockWallet.getAddress()],
    });

    expect(response).toContain(`Error getting balance: ${error}`);
  });
});

describe("Transfer Action", () => {
  const TRANSACTION_HASH = "0xghijkl987654321";

  let mockWallet: jest.Mocked<EvmWalletProvider>;

  const actionProvider = erc20ActionProvider();

  beforeEach(async () => {
    mockWallet = {
      sendTransaction: jest.fn(),
      waitForTransactionReceipt: jest.fn(),
    } as unknown as jest.Mocked<EvmWalletProvider>;

    mockWallet.sendTransaction.mockResolvedValue(TRANSACTION_HASH);
    mockWallet.waitForTransactionReceipt.mockResolvedValue({});
  });

  it("should successfully respond", async () => {
    const args = {
      amount: BigInt(MOCK_AMOUNT),
      contractAddress: MOCK_CONTRACT_ADDRESS,
      destination: MOCK_DESTINATION,
    };

    const response = await actionProvider.transfer(mockWallet, args);

    expect(mockWallet.sendTransaction).toHaveBeenCalledWith({
      to: args.contractAddress as Hex,
      data: encodeFunctionData({
        abi,
        functionName: "transfer",
        args: [args.destination as Hex, BigInt(args.amount)],
      }),
    });
    expect(mockWallet.waitForTransactionReceipt).toHaveBeenCalledWith(TRANSACTION_HASH);
    expect(response).toContain(
      `Transferred ${MOCK_AMOUNT} of ${MOCK_CONTRACT_ADDRESS} to ${MOCK_DESTINATION}`,
    );
    expect(response).toContain(`Transaction hash for the transfer: ${TRANSACTION_HASH}`);
  });

  it("should fail with an error", async () => {
    const args = {
      amount: BigInt(MOCK_AMOUNT),
      contractAddress: MOCK_CONTRACT_ADDRESS,
      destination: MOCK_DESTINATION,
    };

    const error = new Error("Failed to execute transfer");
    mockWallet.sendTransaction.mockRejectedValue(error);

    const response = await actionProvider.transfer(mockWallet, args);

    expect(mockWallet.sendTransaction).toHaveBeenCalledWith({
      to: args.contractAddress as Hex,
      data: encodeFunctionData({
        abi,
        functionName: "transfer",
        args: [args.destination as Hex, BigInt(args.amount)],
      }),
    });
    expect(response).toContain(`Error transferring the asset: ${error}`);
  });
});

```


`typescript/agentkit/src/action-providers/erc20/index.ts`:

```ts
export * from "./erc20ActionProvider";

```

