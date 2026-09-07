import Link from "next/link";
import Header from "../../components/header";

export default async function WrappedPage({
  params,
}: {
  params: Promise<{ wallet: string }>;
}) {
  const { wallet } = await params;

  const shortenedWallet =
    wallet.length > 12
      ? `${wallet.slice(0, 6)}...${wallet.slice(-4)}`
      : wallet;

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

                <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs text-emerald-300">
                  Verified
                </span>
              </div>
            </div>

            {/* Hero */}
            <div className="px-8 py-14 sm:px-12 sm:py-20">
              <p className="text-sm text-white/35">
                Your wallet told a story.
              </p>

              <h1 className="mt-4 max-w-4xl text-5xl font-semibold leading-[0.95] tracking-[-0.06em] sm:text-7xl">
                You didn&apos;t just use Web3.
                <span className="block text-white/35">
                  You built a reputation.
                </span>
              </h1>

              {/* Score */}
              <div className="mt-16">
                <p className="text-xs uppercase tracking-[0.2em] text-white/30">
                  Reputation score
                </p>

                <div className="mt-3 flex flex-wrap items-end gap-5">
                  <span className="text-8xl font-semibold tracking-[-0.08em] sm:text-9xl">
                    842
                  </span>

                  <span className="mb-4 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-300">
                    Excellent
                  </span>
                </div>

                <p className="mt-4 text-sm text-emerald-300">
                  Top 8% of Ivolve profiles
                </p>
              </div>

              {/* Stats */}
              <div className="mt-16 grid gap-4 sm:grid-cols-3">
                <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
                  <p className="text-xs text-white/30">
                    Attestations
                  </p>

                  <p className="mt-3 text-3xl font-semibold">
                    27
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
                    12,480
                  </p>

                  <p className="mt-2 text-xs text-white/25">
                    Reputation ledger
                  </p>
                </div>

                <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
                  <p className="text-xs text-white/30">
                    Opportunities
                  </p>

                  <p className="mt-3 text-3xl font-semibold">
                    08
                  </p>

                  <p className="mt-2 text-xs text-white/25">
                    Discovered
                  </p>
                </div>
              </div>

              {/* ================= BREAKDOWN ================= */}
              <div className="mt-16">
                <p className="text-xs uppercase tracking-[0.2em] text-white/30">
                  What shaped your score
                </p>

                <div className="mt-8 space-y-7">

                  {/* Activity */}
                  <div>
                    <div className="mb-3 flex justify-between text-sm">
                      <span className="text-white/50">
                        On-chain activity
                      </span>

                      <span className="text-white/70">
                        92
                      </span>
                    </div>

                    <div className="h-2 rounded-full bg-white/5">
                      <div className="h-full w-[92%] rounded-full bg-emerald-400" />
                    </div>
                  </div>

                  {/* Attestations */}
                  <div>
                    <div className="mb-3 flex justify-between text-sm">
                      <span className="text-white/50">
                        Attestations
                      </span>

                      <span className="text-white/70">
                        84
                      </span>
                    </div>

                    <div className="h-2 rounded-full bg-white/5">
                      <div className="h-full w-[84%] rounded-full bg-emerald-400" />
                    </div>
                  </div>

                  {/* Contributions */}
                  <div>
                    <div className="mb-3 flex justify-between text-sm">
                      <span className="text-white/50">
                        Contributions
                      </span>

                      <span className="text-white/70">
                        78
                      </span>
                    </div>

                    <div className="h-2 rounded-full bg-white/5">
                      <div className="h-full w-[78%] rounded-full bg-emerald-400" />
                    </div>
                  </div>

                </div>
              </div>

              {/* ================= ACHIEVEMENTS ================= */}
              <div className="mt-16">
                <p className="text-xs uppercase tracking-[0.2em] text-white/30">
                  Highlights
                </p>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">

                  <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
                    <p className="text-xs text-emerald-300">
                      01
                    </p>

                    <h3 className="mt-4 text-lg font-semibold">
                      Consistent contributor
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-white/35">
                      Your activity shows consistent participation across
                      the ecosystem.
                    </p>
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
                    <p className="text-xs text-emerald-300">
                      02
                    </p>

                    <h3 className="mt-4 text-lg font-semibold">
                      Verified reputation
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-white/35">
                      Your reputation is supported by verified attestations.
                    </p>
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
                    <p className="text-xs text-emerald-300">
                      03
                    </p>

                    <h3 className="mt-4 text-lg font-semibold">
                      Opportunity ready
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-white/35">
                      Your reputation qualifies you for multiple ecosystem
                      opportunities.
                    </p>
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
                    <p className="text-xs text-emerald-300">
                      04
                    </p>

                    <h3 className="mt-4 text-lg font-semibold">
                      Reputation momentum
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-white/35">
                      Your reputation continues to compound through activity.
                    </p>
                  </div>

                </div>
              </div>
            </div>

            {/* ================= CARD FOOTER ================= */}
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