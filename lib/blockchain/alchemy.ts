import { createPublicClient, http } from "viem";
import { base, baseSepolia } from "viem/chains";

const alchemyApiKey = process.env.ALCHEMY_API_KEY;

if (!alchemyApiKey) {
  throw new Error("Alchemy API key is not defined");
}

export const alchemyBaseClient = createPublicClient({
  chain: base,
  transport: http(
    `https://base-mainnet.g.alchemy.com/v2/${alchemyApiKey}`
  ),
});

export const alchemyBaseSepoliaClient = createPublicClient({
  chain: baseSepolia,
  transport: http(
    `https://base-sepolia.g.alchemy.com/v2/${alchemyApiKey}`
  ),
});