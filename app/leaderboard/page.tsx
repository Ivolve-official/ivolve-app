import Link from "next/link";
import Header from "../components/header";

const leaderboard = [
  {
    rank: "01",
    wallet: "0x82...F91A",
    score: "1,842",
    change: "+124",
  },
  {
    rank: "02",
    wallet: "0x14...B72C",
    score: "1,721",
    change: "+98",
  },
  {
    rank: "03",
    wallet: "0xA4...19DE",
    score: "1,680",
    change: "+87",
  },
  {
    rank: "04",
    wallet: "0x71...9A2F",
    score: "842",
    change: "+54",
  },
  {
    rank: "05",
    wallet: "0x39...C81E",
    score: "798",
    change: "+42",
  },
  {
    rank: "06",
    wallet: "0xB7...42AC",
    score: "764",
    change: "+31",
  },
];

export default function LeaderboardPage() {
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
            See how wallets across the ecosystem are building reputation,
            earning points, and moving through the ranks.
          </p>
        </div>
      </section>

      {/* ================= TOP STATS ================= */}
      <section className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-7">
            <p className="text-sm text-white/35">
              Ranked wallets
            </p>

            <p className="mt-3 text-4xl font-semibold">
              1,248
            </p>

            <p className="mt-2 text-xs text-white/25">
              Active reputation profiles
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-7">
            <p className="text-sm text-white/35">
              Top reputation
            </p>

            <p className="mt-3 text-4xl font-semibold">
              1,842
            </p>

            <p className="mt-2 text-xs text-emerald-300">
              Current leader
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-7">
            <p className="text-sm text-white/35">
              Your rank
            </p>

            <p className="mt-3 text-4xl font-semibold">
              #04
            </p>

            <p className="mt-2 text-xs text-emerald-300">
              +2 positions this month
            </p>
          </div>
        </div>
      </section>

      {/* ================= LEADERBOARD ================= */}
      <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-8">
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">

          {/* Table header */}
          <div className="hidden grid-cols-[80px_1fr_160px_140px] border-b border-white/10 px-7 py-4 text-xs uppercase tracking-wider text-white/25 sm:grid">
            <span>Rank</span>
            <span>Wallet</span>
            <span>Reputation</span>
            <span>Change</span>
          </div>

          {/* Rows */}
          {leaderboard.map((entry, index) => (
            <Link
              key={entry.rank}
              href={`/profile/${entry.wallet}`}
              className={`grid grid-cols-[55px_1fr_auto] items-center gap-4 px-6 py-6 transition hover:bg-white/[0.04] sm:grid-cols-[80px_1fr_160px_140px] sm:px-7 ${
                index !== leaderboard.length - 1
                  ? "border-b border-white/10"
                  : ""
              }`}
            >
              <span
                className={`text-sm ${
                  entry.rank === "01"
                    ? "font-semibold text-emerald-300"
                    : "text-white/30"
                }`}
              >
                {entry.rank}
              </span>

              <div>
                <p className="font-mono text-sm text-white/70">
                  {entry.wallet}
                </p>

                <p className="mt-1 text-xs text-white/25 sm:hidden">
                  Reputation {entry.score}
                </p>
              </div>

              <span className="hidden text-sm font-medium sm:block">
                {entry.score}
              </span>

              <span className="text-sm text-emerald-300">
                {entry.change}
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
                You're currently ranked #04.
              </h2>

              <p className="mt-2 text-sm text-white/35">
                Your reputation score is 842, with +54 points this month.
              </p>
            </div>

            <Link
              href="/profile/demo"
              className="inline-flex w-fit rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-white/90"
            >
              View profile →
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
            Participate, contribute, earn points, and move up the
            leaderboard.
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
              href="/wrapped/demo"
              className="transition hover:text-white"
            >
              Wrapped
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