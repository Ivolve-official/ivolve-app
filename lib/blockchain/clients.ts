import { createPublicClient, http } from "viem";

import { productionChain, testChain } from "./chains";

export const baseClient = createPublicClient({
  chain: productionChain,
  transport: http(),
});

export const baseSepoliaClient = createPublicClient({
  chain: testChain,
  transport: http(),
});