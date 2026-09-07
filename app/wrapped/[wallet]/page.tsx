import Link from "next/link";
import Header from "../../components/header";

import { supabaseAdmin } from "@/lib/supabase-admin";
import { syncWalletActivity } from "@/lib/blockchain/sync";

type WrappedPageProps = {
  params: Promise<{ wallet: string }>;
};

export const dynamic = "force-dynamic";

function shortenWallet(wallet: string) {
  return wallet.length > 12
    ? `${wallet.slice(0, 6)}...${wallet.slice(-4)}`
    : wallet;
}

export default async function WrappedPage({
  params,
}: WrappedPageProps) {
  const { wallet } = await params;

  const normalizedWallet = wallet.toLowerCase();

  let activityCount = 0;
  let attestationCount = 0;
  let pointsTotal = 0;

  try {
    const [baseActivity, baseSepoliaActivity] =
      await Promise.all([
        syncWalletActivity(normalizedWallet, "base"),
        syncWalletActivity(normalizedWallet, "base-sepolia"),
      ]);

    activityCount =
      baseActivity.synced + baseSepoliaActivity.synced;

    const { data: attestations, error: attestationError } =
      await supabaseAdmin
        .from("attestations_cache")
        .select("id")
        .eq("wallet", normalizedWallet);

    if (!attestationError) {
      attestationCount = attestations?.length ?? 0;
    }

    const { data: pointsEvents, error: pointsError } =
      await supabaseAdmin
        .from("points_events")
        .select("weight")
        .eq("wallet", normalizedWallet);

    if (!pointsError) {
      pointsTotal =
        pointsEvents?.reduce(
          (total, event) => total + (event.weight ?? 0),
          0
        ) ?? 0;
    }
  } catch {
    // Keep the Wrapped page renderable even if a live data
    // provider temporarily fails.
  }

  const shortenedWallet = shortenWallet(normalizedWallet);

  const hasActivity = activityCount > 0;
  const hasAttestations = attestationCount > 0;
  const hasPoints = pointsTotal > 0;

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <Header />

      {/* ================= WRAPPED ================= */}
      <section className="relative overflow-hidden px-6 py-16 sm:py-20 lg:py-24">
        <div className="absolute left-1/2 top-20 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-emerald-400/[0.07] blur-[150px]" />

        <div className="relative mx-auto max-w-5xl">

          {/* Intro */}
          <div className="mb-8 text-center">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-emerald-300">
              Ivolve Wrapped
            </p>

            <p className="mt-3 font-mono text-xs text-white/30">
              {shortenedWallet}
            </p>
          </div>

          {/* Main Card */}
          <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.035] shadow-2xl">

            {/* Card Header */}
            <div className="border-b border-white/10 px-8 py-7 sm:px-12">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-white/30">
                    Your on-chain year
                  </p>

                  <p className="mt-2 text-sm text-white/50">
                    2026 reputation recap
                  </p>
                </div>

                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-white/40">
                  Live data
                </span>
              </div>
            </div>

            {/* Hero */}
            <div className="px-8 py-14 sm:px-12 sm:py-20">
              <p className="text-sm text-white/35">
                Your wallet told a story.
              </p>

              <h1 className="mt-4 max-w-4xl text-5xl font-semibold leading-[0.95] tracking-[-0.06em] sm:text-7xl">
                Your on-chain history.
                <span className="block text-white/35">
                  Your reputation in progress.
                </span>
              </h1>

              {/* Score */}
              <div className="mt-16">
                <p className="text-xs uppercase tracking-[0.2em] text-white/30">
                  Reputation score
                </p>

                <div className="mt-3 flex flex-wrap items-end gap-5">
                  <span className="text-8xl font-semibold tracking-[-0.08em] sm:text-9xl">
                    —
                  </span>

                  <span className="mb-4 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/45">
                    Building
                  </span>
                </div>

                <p className="mt-4 text-sm text-white/30">
                  Your reputation score will appear once the scoring
                  engine is live.
                </p>
              </div>

              {/* Stats */}
              <div className="mt-16 grid gap-4 sm:grid-cols-3">
                <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
                  <p className="text-xs text-white/30">
                    On-chain activity
                  </p>

                  <p className="mt-3 text-3xl font-semibold">
                    {activityCount.toLocaleString()}
                  </p>

                  <p className="mt-2 text-xs text-white/25">
                    Base + Base Sepolia
                  </p>
                </div>

                <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
                  <p className="text-xs text-white/30">
                    Attestations
                  </p>

                  <p className="mt-3 text-3xl font-semibold">
                    {attestationCount.toLocaleString()}
                  </p>

                  <p className="mt-2 text-xs text-white/25">
                    Verified signals
                  </p>
                </div>

                <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
                  <p className="text-xs text-white/30">
                    Ivolve Points
                  </p>

                  <p className="mt-3 text-3xl font-semibold">
                    {pointsTotal.toLocaleString()}
                  </p>

                  <p className="mt-2 text-xs text-white/25">
                    Reputation ledger
                  </p>
                </div>
              </div>

              {/* ================= BREAKDOWN ================= */}
              <div className="mt-16">
                <p className="text-xs uppercase tracking-[0.2em] text-white/30">
                  What we know so far
                </p>

                <div className="mt-8 space-y-7">

                  {/* Activity */}
                  <div>
                    <div className="mb-3 flex justify-between text-sm">
                      <span className="text-white/50">
                        On-chain activity
                      </span>

                      <span className="text-white/50">
                        {hasActivity ? "Detected" : "None detected"}
                      </span>
                    </div>

                    <div className="h-2 rounded-full bg-white/5">
                      <div
                        className={`h-full rounded-full ${
                          hasActivity
                            ? "w-full bg-emerald-400"
                            : "w-0"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Attestations */}
                  <div>
                    <div className="mb-3 flex justify-between text-sm">
                      <span className="text-white/50">
                        Attestations
                      </span>

                      <span className="text-white/50">
                        {hasAttestations
                          ? "Detected"
                          : "None detected"}
                      </span>
                    </div>

                    <div className="h-2 rounded-full bg-white/5">
                      <div
                        className={`h-full rounded-full ${
                          hasAttestations
                            ? "w-full bg-emerald-400"
                            : "w-0"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Points */}
                  <div>
                    <div className="mb-3 flex justify-between text-sm">
                      <span className="text-white/50">
                        Contributions
                      </span>

                      <span className="text-white/50">
                        {hasPoints
                          ? "Points recorded"
                          : "No points yet"}
                      </span>
                    </div>

                    <div className="h-2 rounded-full bg-white/5">
                      <div
                        className={`h-full rounded-full ${
                          hasPoints
                            ? "w-full bg-emerald-400"
                            : "w-0"
                        }`}
                      />
                    </div>
                  </div>

                </div>
              </div>

              {/* ================= HIGHLIGHTS ================= */}
              <div className="mt-16">
                <p className="text-xs uppercase tracking-[0.2em] text-white/30">
                  Highlights
                </p>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">

                  {/* Activity */}
                  <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
                    <p className="text-xs text-emerald-300">
                      01
                    </p>

                    <h3 className="mt-4 text-lg font-semibold">
                      On-chain presence
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-white/35">
                      {hasActivity
                        ? `Ivolve detected ${activityCount.toLocaleString()} on-chain ${
                            activityCount === 1
                              ? "activity"
                              : "activities"
                          } across Base networks.`
                        : "No indexed on-chain activity has been detected yet."}
                    </p>
                  </div>

                  {/* Attestations */}
                  <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
                    <p className="text-xs text-emerald-300">
                      02
                    </p>

                    <h3 className="mt-4 text-lg font-semibold">
                      Verified signals
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-white/35">
                      {hasAttestations
                        ? `Your wallet has ${attestationCount.toLocaleString()} ${
                            attestationCount === 1
                              ? "attestation"
                              : "attestations"
                          } recorded in Ivolve.`
                        : "Your attestation history has not been indexed yet."}
                    </p>
                  </div>

                  {/* Points */}
                  <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
                    <p className="text-xs text-emerald-300">
                      03
                    </p>

                    <h3 className="mt-4 text-lg font-semibold">
                      Reputation ledger
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-white/35">
                      {hasPoints
                        ? `Your Ivolve ledger currently contains ${pointsTotal.toLocaleString()} points.`
                        : "Your Ivolve points ledger does not have recorded points yet."}
                    </p>
                  </div>

                  {/* Score */}
                  <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
                    <p className="text-xs text-emerald-300">
                      04
                    </p>

                    <h3 className="mt-4 text-lg font-semibold">
                      Reputation in progress
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-white/35">
                      The Ivolve reputation engine is still being
                      built. Your verified signals will feed into
                      it once scoring is live.
                    </p>
                  </div>

                </div>
              </div>
            </div>

            {/* Card Footer */}
            <div className="border-t border-white/10 px-8 py-7 sm:px-12">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                <div>
                  <p className="text-xs text-white/30">
                    Ivolve
                  </p>

                  <p className="mt-1 text-xs text-white/20">
                    On-chain identity & reputation
                  </p>
                </div>

                <div className="flex gap-3">
                  <Link
                    href={`/profile/${wallet}`}
                    className="rounded-full border border-white/10 px-5 py-2.5 text-xs font-medium text-white/70 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
                  >
                    View Profile
                  </Link>

                  <Link
                    href="/opportunities"
                    className="rounded-full bg-white px-5 py-2.5 text-xs font-semibold text-black transition hover:bg-white/90"
                  >
                    Opportunities
                  </Link>
                </div>

              </div>
            </div>
          </div>

          {/* Leaderboard */}
          <div className="mt-7 flex justify-center">
            <Link
              href="/leaderboard"
              className="text-sm text-white/35 transition hover:text-white"
            >
              See the leaderboard →
            </Link>
          </div>

        </div>
      </section>
    </main>
  );
}