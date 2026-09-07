import { base, baseSepolia } from "viem/chains";

export const supportedChains = {
  base,
  baseSepolia,
} as const;

export const productionChain = base;

export const testChain = baseSepolia;