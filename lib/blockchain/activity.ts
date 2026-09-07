import { isAddress } from "viem";

const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;

export type SupportedChain = "base" | "base-sepolia";

const ALCHEMY_URLS: Record<SupportedChain, string> = {
  base: `https://base-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
  "base-sepolia": `https://base-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
};

const transferCategories = [
  "external",
  "erc20",
  "erc721",
  "erc1155",
];

type AlchemyTransfer = {
  blockNum: string;
  uniqueId: string;
  hash: string;
  from: string;
  to: string;
  value?: number;
  asset?: string;
  category: string;
  rawContract?: {
    address?: string;
    value?: string;
    decimal?: string;
  };
  metadata?: {
    blockTimestamp?: string;
  };
};

type AlchemyTransferResponse = {
  transfers: AlchemyTransfer[];
  pageKey?: string;
};

export type WalletActivity = {
  id: string;
  transactionHash: string;
  wallet: string;
  chain: SupportedChain;
  from: string;
  to: string;
  category: string;
  asset: string | null;
  value: number | null;
  timestamp: string | null;
};

async function fetchTransfers(
  wallet: string,
  chain: SupportedChain,
  direction: "fromAddress" | "toAddress"
): Promise<AlchemyTransfer[]> {
  const transfers: AlchemyTransfer[] = [];
  let pageKey: string | undefined;

  do {
    const params: Record<string, unknown> = {
      fromBlock: "0x0",
      toBlock: "latest",
      [direction]: wallet,
      category: transferCategories,
      withMetadata: true,
      excludeZeroValue: false,
      maxCount: "0x64",
    };

    if (pageKey) {
      params.pageKey = pageKey;
    }

    const response = await fetch(ALCHEMY_URLS[chain], {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "alchemy_getAssetTransfers",
        params: [params],
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Alchemy request failed: ${response.status}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message ?? "Alchemy request failed");
    }

    const result = (data.result ?? {}) as AlchemyTransferResponse;

    transfers.push(...(result.transfers ?? []));

    pageKey = result.pageKey;
  } while (pageKey);

  return transfers;
}

function normalizeTransfer(
  transfer: AlchemyTransfer,
  wallet: string,
  chain: SupportedChain
): WalletActivity {
  return {
    id: transfer.uniqueId,
    transactionHash: transfer.hash,
    wallet,
    chain,
    from: transfer.from,
    to: transfer.to,
    category: transfer.category,
    asset: transfer.asset ?? null,
    value: transfer.value ?? null,
    timestamp: transfer.metadata?.blockTimestamp ?? null,
  };
}

export async function getWalletActivity(
  wallet: string,
  chain: SupportedChain = "base"
) {
  if (!ALCHEMY_API_KEY) {
    throw new Error("Alchemy API key is not configured");
  }

  if (!isAddress(wallet)) {
    throw new Error("Invalid EVM wallet address");
  }

  const normalizedWallet = wallet.toLowerCase();

  const [sent, received] = await Promise.all([
    fetchTransfers(normalizedWallet, chain, "fromAddress"),
    fetchTransfers(normalizedWallet, chain, "toAddress"),
  ]);

  const combined = [...sent, ...received];

  const unique = Array.from(
    new Map(
      combined.map((transfer) => [
        transfer.uniqueId,
        transfer,
      ])
    ).values()
  );

  unique.sort((a, b) => {
    const aTime = a.metadata?.blockTimestamp
      ? new Date(a.metadata.blockTimestamp).getTime()
      : 0;

    const bTime = b.metadata?.blockTimestamp
      ? new Date(b.metadata.blockTimestamp).getTime()
      : 0;

    return bTime - aTime;
  });

  const activities = unique.map((transfer) =>
    normalizeTransfer(transfer, normalizedWallet, chain)
  );

  return {
    wallet: normalizedWallet,
    chain,
    activities,
    totalActivities: activities.length,
  };
}