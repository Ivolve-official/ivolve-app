import Link from "next/link";
import Header from "../components/header";

import { supabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

type LeaderboardEntry = {
  wallet: string;
  points: number;
};

function shortenWallet(wallet: string) {
  return wallet.length > 12
    ? `${wallet.slice(0, 6)}...${wallet.slice(-4)}`
    : wallet;
}

export default async function LeaderboardPage() {
  const { data: pointsEvents, error } = await supabaseAdmin
    .from("points_events")
    .select("wallet, weight");

  const leaderboardMap = new Map<string, number>();

  if (!error && pointsEvents) {
    for (const event of pointsEvents) {
      const wallet = event.wallet.toLowerCase();
      const weight = event.weight ?? 0;

      leaderboardMap.set(
        wallet,
        (leaderboardMap.get(wallet) ?? 0) + weight
      );
    }
  }

  const leaderboard: LeaderboardEntry[] = Array.from(
    leaderboardMap.entries()
  )
    .map(([wallet, points]) => ({
      wallet,
      points,
    }))
    .sort((a, b) => b.points - a.points);

  const topEntry = leaderboard[0];

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <Header />

      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute left-1/2 top-0 h-96 w-[600px] -translate-x-1/2 rounded-full bg-emerald-400/[0.06] blur-[120px]" />

        <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-emerald-300">
            Leaderboard
          </p>

          <h1 className="mt-4 max-w-4xl text-5xl font-semibold tracking-[-0.05em] sm:text-6xl">
            Reputation in motion.
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-7 text-white/40 sm:text-lg">
            See how wallets are building Ivolve Points through
            verified activity and contributions.
          </p>
        </div>
      </section>

      {/* ================= TOP STATS ================= */}
      <section className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-3">
          {/* Ranked wallets */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-7">
            <p className="text-sm text-white/35">
              Ranked wallets
            </p>

            <p className="mt-3 text-4xl font-semibold">
              {leaderboard.length.toLocaleString()}
            </p>

            <p className="mt-2 text-xs text-white/25">
              Wallets with recorded points
            </p>
          </div>

          {/* Top points */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-7">
            <p className="text-sm text-white/35">
              Top points
            </p>

            <p className="mt-3 text-4xl font-semibold">
              {topEntry
                ? topEntry.points.toLocaleString()
                : "—"}
            </p>

            <p className="mt-2 text-xs text-emerald-300">
              {topEntry
                ? "Current leader"
                : "Leaderboard is being built"}
            </p>
          </div>

          {/* Your position */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-7">
            <p className="text-sm text-white/35">
              Your position
            </p>

            <p className="mt-3 text-4xl font-semibold">
              —
            </p>

            <p className="mt-2 text-xs text-white/25">
              Connect your wallet to see your rank
            </p>
          </div>
        </div>
      </section>

      {/* ================= LEADERBOARD ================= */}
      <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-8">
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">

          {/* Table header */}
          <div className="hidden grid-cols-[80px_1fr_200px] border-b border-white/10 px-7 py-4 text-xs uppercase tracking-wider text-white/25 sm:grid">
            <span>Rank</span>
            <span>Wallet</span>
            <span>Points</span>
          </div>

          {/* Empty state */}
          {leaderboard.length === 0 && (
            <div className="px-6 py-20 text-center sm:px-7">
              <p className="text-sm font-medium text-white/60">
                Leaderboard is being built.
              </p>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/30">
                Rankings will appear here once Ivolve has real
                points data.
              </p>
            </div>
          )}

          {/* Rows */}
          {leaderboard.map((entry, index) => (
            <Link
              key={entry.wallet}
              href={`/profile/${entry.wallet}`}
              className={`grid grid-cols-[55px_1fr_auto] items-center gap-4 px-6 py-6 transition hover:bg-white/[0.04] sm:grid-cols-[80px_1fr_200px] sm:px-7 ${
                index !== leaderboard.length - 1
                  ? "border-b border-white/10"
                  : ""
              }`}
            >
              {/* Rank */}
              <span
                className={`text-sm ${
                  index === 0
                    ? "font-semibold text-emerald-300"
                    : "text-white/30"
                }`}
              >
                {String(index + 1).padStart(2, "0")}
              </span>

              {/* Wallet */}
              <div>
                <p className="font-mono text-sm text-white/70">
                  {shortenWallet(entry.wallet)}
                </p>

                <p className="mt-1 text-xs text-white/25 sm:hidden">
                  {entry.points.toLocaleString()} points
                </p>
              </div>

              {/* Points */}
              <span className="hidden text-sm font-medium sm:block">
                {entry.points.toLocaleString()}
              </span>
            </Link>
          ))}
        </div>

        {/* ================= YOUR POSITION ================= */}
        <div className="mt-6 rounded-3xl border border-emerald-400/20 bg-emerald-400/[0.04] p-7 sm:p-8">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-emerald-300">
                Your position
              </p>

              <h2 className="mt-3 text-2xl font-semibold">
                Your ranking is coming soon.
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-6 text-white/35">
                Connect your wallet to build your Ivolve profile.
                Your position will appear here once your wallet has
                recorded points.
              </p>
            </div>

            <Link
              href="/"
              className="inline-flex w-fit rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-white/90"
            >
              Connect wallet →
            </Link>
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="border-t border-white/10">
        <div className="mx-auto max-w-5xl px-6 py-24 text-center lg:px-8">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-emerald-300">
            Keep building
          </p>

          <h2 className="mx-auto mt-4 max-w-3xl text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
            Reputation compounds over time.
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-white/40">
            Participate, contribute, earn points, and build a
            reputation that grows with you.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/opportunities"
              className="inline-flex rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-black transition hover:bg-white/90"
            >
              Explore Opportunities →
            </Link>

            <Link
              href="/mint"
              className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-6 py-3.5 text-sm font-medium transition hover:border-white/20 hover:bg-white/[0.08]"
            >
              Founding Member
            </Link>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-6 py-8 text-sm text-white/30 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <span>© 2026 Ivolve</span>

          <div className="flex flex-wrap gap-5">
            <Link
              href="/"
              className="transition hover:text-white"
            >
              Home
            </Link>

            <Link
              href="/opportunities"
              className="transition hover:text-white"
            >
              Opportunities
            </Link>

            <Link
              href="/mint"
              className="transition hover:text-white"
            >
              Mint
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}