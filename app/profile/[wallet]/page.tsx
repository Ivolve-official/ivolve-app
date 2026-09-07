import Link from "next/link";
import Header from "../../components/header";
import ActivitySection from "../../components/activity-section";

import { supabaseAdmin } from "@/lib/supabase-admin";
import { syncWalletActivity } from "@/lib/blockchain/sync";
import type { SupportedChain } from "@/lib/blockchain/activity";

export const dynamic = "force-dynamic";

type ActivityRow = {
  id: string;
  wallet: string;
  chain: string;
  transaction_hash: string;
  from_address: string;
  to_address: string | null;
  category: string;
  asset: string | null;
  value: number | null;
  timestamp: string | null;
};

function shortenAddress(address: string) {
  if (address.length <= 12) {
    return address;
  }

  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ wallet: string }>;
}) {
  const { wallet } = await params;

  const normalizedWallet = wallet.toLowerCase();

  const shortenedWallet = shortenAddress(normalizedWallet);

  let syncErrors: string[] = [];

  /*
   * ---------------------------------------------------------
   * 1. SYNC REAL BLOCKCHAIN ACTIVITY
   * ---------------------------------------------------------
   */

  const chains: SupportedChain[] = [
    "base",
    "base-sepolia",
  ];

  await Promise.all(
    chains.map(async (chain) => {
      try {
        await syncWalletActivity(
          normalizedWallet,
          chain
        );
      } catch (error) {
        syncErrors.push(
          `${chain}: ${
            error instanceof Error
              ? error.message
              : "Unable to sync"
          }`
        );
      }
    })
  );

  /*
   * ---------------------------------------------------------
   * 2. LOAD REAL TRANSACTIONS FROM SUPABASE
   * ---------------------------------------------------------
   */

  const {
    data: transactions,
    error: transactionsError,
  } = await supabaseAdmin
    .from("wallet_transactions")
    .select(
      `
        id,
        wallet,
        chain,
        transaction_hash,
        from_address,
        to_address,
        category,
        asset,
        value,
        timestamp
      `
    )
    .eq("wallet", normalizedWallet)
    .order("timestamp", {
      ascending: false,
    })
    .limit(1000);

  /*
   * ---------------------------------------------------------
   * 3. LOAD REAL ATTESTATIONS
   * ---------------------------------------------------------
   */

  const {
    count: attestationCount,
    error: attestationsError,
  } = await supabaseAdmin
    .from("attestations_cache")
    .select("id", {
      count: "exact",
      head: true,
    })
    .eq("wallet", normalizedWallet);

  /*
   * ---------------------------------------------------------
   * 4. LOAD REAL IVOLVE POINTS
   * ---------------------------------------------------------
   */

  const {
    data: pointEvents,
    error: pointsError,
  } = await supabaseAdmin
    .from("points_events")
    .select("weight")
    .eq("wallet", normalizedWallet);

  const activityRows =
    (transactions as ActivityRow[] | null) ?? [];

  const pointsRows = pointEvents ?? [];

  const totalPoints = pointsRows.reduce(
    (total, event) =>
      total + (event.weight ?? 0),
    0
  );

  /*
   * ---------------------------------------------------------
   * 5. CALCULATE REAL ACTIVITY METRICS
   * ---------------------------------------------------------
   */

  const uniqueTransactionHashes = new Set(
    activityRows.map(
      (activity) =>
        activity.transaction_hash
    )
  );

  const uniqueTransactions =
    uniqueTransactionHashes.size;

  const externalTransfers =
    activityRows.filter(
      (activity) =>
        activity.category === "external"
    ).length;

  const tokenTransfers =
    activityRows.filter(
      (activity) =>
        activity.category === "erc20"
    ).length;

  const nftTransfers =
    activityRows.filter(
      (activity) =>
        activity.category === "erc721" ||
        activity.category === "erc1155"
    ).length;

  /*
   * ---------------------------------------------------------
   * 6. PROVISIONAL REPUTATION SIGNAL
   * ---------------------------------------------------------
   *
   * This is NOT the final Ivolve reputation algorithm.
   *
   * We only use real data here so the UI has a useful
   * reputation signal while the final scoring engine is built.
   */

  const activitySignal = Math.min(
    100,
    Math.round(
      Math.log10(
        uniqueTransactions + 1
      ) * 30
    )
  );

  const attestationSignal = Math.min(
    100,
    (attestationCount ?? 0) * 10
  );

  const contributionSignal = Math.min(
    100,
    Math.round(totalPoints / 100)
  );

  const provisionalScore = Math.round(
    activitySignal * 0.6 +
      attestationSignal * 0.2 +
      contributionSignal * 0.2
  );

  const hasScoringData =
    uniqueTransactions > 0 ||
    (attestationCount ?? 0) > 0 ||
    totalPoints > 0;

  /*
   * ---------------------------------------------------------
   * 7. DATA ERROR STATE
   * ---------------------------------------------------------
   */

  const dataError =
    transactionsError ||
    attestationsError ||
    pointsError;

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <Header />

      {/* =====================================================
          PROFILE HEADER
      ===================================================== */}

      <section className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div>
              <div className="mb-5 flex items-center gap-2 text-sm text-emerald-300">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]" />

                On-chain profile
              </div>

              <h1 className="text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
                Reputation Profile
              </h1>

              <p className="mt-4 font-mono text-sm text-white/40">
                {shortenedWallet}
              </p>
            </div>

            <Link
              href={`/wrapped/${normalizedWallet}`}
              className="inline-flex w-fit rounded-full border border-white/10 bg-white/[0.035] px-6 py-3 text-sm font-medium transition hover:border-white/20 hover:bg-white/[0.07]"
            >
              View Wrapped →
            </Link>
          </div>
        </div>
      </section>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <section>
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">

          {/* =================================================
              DATA STATUS
          ================================================= */}

          {dataError && (
            <div className="mb-6 rounded-2xl border border-yellow-400/20 bg-yellow-400/[0.05] px-5 py-4 text-sm text-yellow-200">
              Some reputation data is not available yet.
              On-chain activity can still be displayed.
            </div>
          )}

          {syncErrors.length > 0 &&
            !transactionsError && (
              <div className="mb-6 rounded-2xl border border-white/10 bg-white/[0.025] px-5 py-4 text-sm text-white/40">
                Some network activity could not be
                refreshed. Previously synced activity is
                still shown.
              </div>
            )}

          {/* =================================================
              REPUTATION SCORE
          ================================================= */}

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-8 lg:p-10">
            <div className="grid items-center gap-10 lg:grid-cols-[1fr_auto]">

              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-white/35">
                  Reputation Score
                </p>

                <div className="mt-5 flex flex-wrap items-end gap-4">
                  <span className="text-7xl font-semibold tracking-[-0.06em]">
                    {hasScoringData
                      ? provisionalScore
                      : "—"}
                  </span>

                  <span className="mb-3 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs text-emerald-300">
                    {hasScoringData
                      ? "Provisional"
                      : "Building"}
                  </span>
                </div>

                <p className="mt-6 max-w-2xl text-sm leading-6 text-white/40">
                  Your current reputation signal is
                  calculated from real on-chain activity,
                  verified attestations, and Ivolve points.
                </p>

                <p className="mt-3 text-xs text-white/25">
                  Final Ivolve reputation scoring will use
                  the complete verification and
                  contribution engine.
                </p>
              </div>

              <div className="flex h-36 w-36 items-center justify-center rounded-full border border-emerald-400/20">
                <div className="flex h-28 w-28 items-center justify-center rounded-full border border-white/10 bg-[#050505]">
                  <div className="text-center">
                    <p className="text-2xl font-semibold">
                      {hasScoringData
                        ? `${provisionalScore}%`
                        : "—"}
                    </p>

                    <p className="mt-1 text-[10px] uppercase tracking-widest text-white/30">
                      Signal
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* =================================================
              REAL STATS
          ================================================= */}

          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-7">
              <p className="text-sm text-white/40">
                Transactions
              </p>

              <p className="mt-4 text-4xl font-semibold">
                {uniqueTransactions.toLocaleString()}
              </p>

              <p className="mt-2 text-xs text-white/25">
                Unique transactions detected
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-7">
              <p className="text-sm text-white/40">
                On-chain activity
              </p>

              <p className="mt-4 text-4xl font-semibold">
                {activityRows.length.toLocaleString()}
              </p>

              <p className="mt-2 text-xs text-white/25">
                Transfer events indexed
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-7">
              <p className="text-sm text-white/40">
                Attestations
              </p>

              <p className="mt-4 text-4xl font-semibold">
                {(attestationCount ?? 0).toLocaleString()}
              </p>

              <p className="mt-2 text-xs text-white/25">
                Verified reputation signals
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-7">
              <p className="text-sm text-white/40">
                Ivolve Points
              </p>

              <p className="mt-4 text-4xl font-semibold">
                {totalPoints.toLocaleString()}
              </p>

              <p className="mt-2 text-xs text-white/25">
                Reputation ledger
              </p>
            </div>

          </div>

          {/* =================================================
              ACTIVITY BREAKDOWN
          ================================================= */}

          <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-8 lg:p-10">

            <p className="text-xs uppercase tracking-[0.18em] text-white/30">
              Activity breakdown
            </p>

            <h2 className="mt-3 text-2xl font-semibold">
              What we can see on-chain
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/35">
              These numbers come directly from the wallet
              activity indexed from the supported Base networks.
            </p>

            <div className="mt-10 space-y-8">

              {/* ETH */}

              <div>
                <div className="mb-3 flex items-end justify-between">
                  <div>
                    <p className="text-sm font-medium">
                      ETH transfers
                    </p>

                    <p className="mt-1 text-xs text-white/30">
                      Native asset transfers
                    </p>
                  </div>

                  <span className="text-sm text-white/60">
                    {externalTransfers.toLocaleString()}
                  </span>
                </div>

                <div className="h-2 rounded-full bg-white/5">
                  <div
                    className="h-full rounded-full bg-emerald-400"
                    style={{
                      width: `${
                        activityRows.length > 0
                          ? Math.min(
                              100,
                              (externalTransfers /
                                activityRows.length) *
                                100
                            )
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>

              {/* TOKENS */}

              <div>
                <div className="mb-3 flex items-end justify-between">
                  <div>
                    <p className="text-sm font-medium">
                      Token transfers
                    </p>

                    <p className="mt-1 text-xs text-white/30">
                      ERC-20 activity detected
                    </p>
                  </div>

                  <span className="text-sm text-white/60">
                    {tokenTransfers.toLocaleString()}
                  </span>
                </div>

                <div className="h-2 rounded-full bg-white/5">
                  <div
                    className="h-full rounded-full bg-emerald-400"
                    style={{
                      width: `${
                        activityRows.length > 0
                          ? Math.min(
                              100,
                              (tokenTransfers /
                                activityRows.length) *
                                100
                            )
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>

              {/* NFTs */}

              <div>
                <div className="mb-3 flex items-end justify-between">
                  <div>
                    <p className="text-sm font-medium">
                      NFT / asset activity
                    </p>

                    <p className="mt-1 text-xs text-white/30">
                      ERC-721 and ERC-1155 activity
                    </p>
                  </div>

                  <span className="text-sm text-white/60">
                    {nftTransfers.toLocaleString()}
                  </span>
                </div>

                <div className="h-2 rounded-full bg-white/5">
                  <div
                    className="h-full rounded-full bg-emerald-400"
                    style={{
                      width: `${
                        activityRows.length > 0
                          ? Math.min(
                              100,
                              (nftTransfers /
                                activityRows.length) *
                                100
                            )
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>

            </div>
          </div>

          {/* =================================================
              ON-CHAIN ACTIVITY
          ================================================= */}

          <ActivitySection
            activities={activityRows}
            wallet={normalizedWallet}
          />

          {/* =================================================
              REPUTATION FOUNDATION
          ================================================= */}

          <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-8 lg:p-10">

            <p className="text-xs uppercase tracking-[0.18em] text-emerald-300">
              Reputation foundation
            </p>

            <h2 className="mt-3 text-2xl font-semibold">
              What Ivolve can verify today
            </h2>

            <div className="mt-8 grid gap-4 md:grid-cols-3">

              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
                <p className="text-sm font-medium">
                  On-chain history
                </p>

                <p className="mt-3 text-sm leading-6 text-white/35">
                  Real wallet activity is indexed across
                  Base Mainnet and Base Sepolia.
                </p>

                <span className="mt-5 inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs text-emerald-300">
                  Live
                </span>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
                <p className="text-sm font-medium">
                  Attestations
                </p>

                <p className="mt-3 text-sm leading-6 text-white/35">
                  Verified attestations will contribute
                  additional reputation signals once indexed.
                </p>

                <span className="mt-5 inline-flex rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-white/35">
                  {attestationCount
                    ? "Live"
                    : "Not indexed yet"}
                </span>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
                <p className="text-sm font-medium">
                  Ivolve points
                </p>

                <p className="mt-3 text-sm leading-6 text-white/35">
                  Points will represent verified
                  contributions, participation, usage, and
                  other reputation events.
                </p>

                <span className="mt-5 inline-flex rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-white/35">
                  {totalPoints > 0
                    ? "Active"
                    : "Building"}
                </span>
              </div>

            </div>
          </div>

          {/* =================================================
              CTA
          ================================================= */}

          <div className="mt-6 flex flex-col items-center justify-between gap-5 rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center md:flex-row md:text-left">

            <div>
              <p className="text-lg font-semibold">
                Ready to discover more opportunities?
              </p>

              <p className="mt-2 text-sm text-white/35">
                Explore opportunities based on the reputation
                you are building.
              </p>
            </div>

            <Link
              href="/opportunities"
              className="inline-flex rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-white/90"
            >
              Explore Opportunities →
            </Link>

          </div>

        </div>
      </section>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="mt-12 border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-6 py-8 text-sm text-white/30 sm:flex-row sm:items-center sm:justify-between lg:px-8">

          <div>
            © 2026 Ivolve
          </div>

          <div className="flex flex-wrap gap-5">

            <Link
              href="/opportunities"
              className="transition hover:text-white"
            >
              Opportunities
            </Link>

            <Link
              href={`/wrapped/${normalizedWallet}`}
              className="transition hover:text-white"
            >
              Wrapped
            </Link>

            <Link
              href="/leaderboard"
              className="transition hover:text-white"
            >
              Leaderboard
            </Link>

            <Link
              href="/mint"
              className="transition hover:text-white"
            >
              Founding Member
            </Link>

          </div>
        </div>
      </footer>
    </main>
  );
}