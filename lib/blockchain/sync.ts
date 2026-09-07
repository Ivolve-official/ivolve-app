import { supabaseAdmin } from "@/lib/supabase-admin";
import {
  getWalletActivity,
  type SupportedChain,
} from "@/lib/blockchain/activity";

export async function syncWalletActivity(
  wallet: string,
  chain: SupportedChain
) {
  const normalizedWallet = wallet.toLowerCase();

  // 1. Make sure the wallet exists in our users table.
  const { error: userError } = await supabaseAdmin
    .from("users")
    .upsert(
      {
        wallet: normalizedWallet,
      },
      {
        onConflict: "wallet",
      }
    );

  if (userError) {
    throw new Error(
      `Unable to create wallet profile: ${userError.message}`
    );
  }

  // 2. Fetch real blockchain activity from Alchemy.
  const activity = await getWalletActivity(
    normalizedWallet,
    chain
  );

  // 3. Nothing to save for a wallet with no activity.
  if (activity.activities.length === 0) {
    return {
      wallet: normalizedWallet,
      chain,
      synced: 0,
      activities: [],
    };
  }

  // 4. Convert normalized activity into database rows.
  const rows = activity.activities.map((item) => ({
    wallet: normalizedWallet,
    chain: item.chain,
    transaction_hash: item.transactionHash,
    from_address: item.from,
    to_address: item.to,
    category: item.category,
    asset: item.asset,
    value: item.value,
    timestamp: item.timestamp,
  }));

  // 5. Save the transactions.
  // Existing transactions are ignored.
  const { error: transactionError } = await supabaseAdmin
    .from("wallet_transactions")
    .upsert(rows, {
      onConflict:
        "wallet,chain,transaction_hash,category",
      ignoreDuplicates: true,
    });

  if (transactionError) {
    throw new Error(
      `Unable to save wallet activity: ${transactionError.message}`
    );
  }

  return {
    wallet: normalizedWallet,
    chain,
    synced: rows.length,
    activities: activity.activities,
  };
}