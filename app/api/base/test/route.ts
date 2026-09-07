import { NextResponse } from "next/server";

const BASE_RPC_URL = "https://mainnet.base.org";

export async function GET() {
  const response = await fetch(BASE_RPC_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "eth_blockNumber",
      params: [],
    }),
  });

  const data = await response.json();

  return NextResponse.json({
    success: true,
    network: "Base",
    latestBlock: data.result,
  });
}