import { NextResponse } from "next/server";
import {
  syncWalletActivity,
} from "@/lib/blockchain/sync";
import type { SupportedChain } from "@/lib/blockchain/activity";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ wallet: string }> }
) {
  try {
    const { wallet } = await params;

    const url = new URL(request.url);

    const requestedChain = url.searchParams.get("chain");

    const chain: SupportedChain =
      requestedChain === "base-sepolia"
        ? "base-sepolia"
        : "base";

    const activity = await syncWalletActivity(
      wallet,
      chain
    );

    return NextResponse.json({
      success: true,
      data: activity,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to sync wallet activity";

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 400 }
    );
  }
}