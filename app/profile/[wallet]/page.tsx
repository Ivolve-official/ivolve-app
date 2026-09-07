import Link from "next/link";
import Header from "../../components/header";

export default async function ProfilePage({
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

      {/* ================= PROFILE HEADER ================= */}
      <section className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div>
              <div className="mb-5 flex items-center gap-2 text-sm text-emerald-300">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]" />
                Verified wallet
              </div>

              <h1 className="text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
                Reputation Profile
              </h1>

              <p className="mt-4 font-mono text-sm text-white/40">
                {shortenedWallet}
              </p>
            </div>

            <Link
              href={`/wrapped/${wallet}`}
              className="inline-flex w-fit rounded-full border border-white/10 bg-white/[0.035] px-6 py-3 text-sm font-medium transition hover:border-white/20 hover:bg-white/[0.07]"
            >
              View Wrapped →
            </Link>
          </div>
        </div>
      </section>

      {/* ================= MAIN CONTENT ================= */}
      <section>
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">

          {/* Reputation Score */}
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-8 lg:p-10">
            <div className="grid items-center gap-10 lg:grid-cols-[1fr_auto]">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-white/35">
                  Reputation Score
                </p>

                <div className="mt-5 flex items-end gap-4">
                  <span className="text-7xl font-semibold tracking-[-0.06em]">
                    842
                  </span>

                  <span className="mb-3 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs text-emerald-300">
                    Excellent
                  </span>
                </div>

                <p className="mt-6 max-w-xl text-sm leading-6 text-white/40">
                  A composite view of your verified on-chain activity,
                  attestations, and ecosystem contributions.
                </p>
              </div>

              <div className="flex h-36 w-36 items-center justify-center rounded-full border border-emerald-400/30">
                <div className="flex h-28 w-28 items-center justify-center rounded-full border border-white/10 bg-[#050505]">
                  <div className="text-center">
                    <p className="text-2xl font-semibold">84%</p>
                    <p className="mt-1 text-[10px] uppercase tracking-widest text-white/30">
                      Score
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-7">
              <p className="text-sm text-white/40">
                Attestations
              </p>

              <p className="mt-4 text-4xl font-semibold">
                27
              </p>

              <p className="mt-2 text-xs text-emerald-300">
                +4 this month
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-7">
              <p className="text-sm text-white/40">
                Ivolve Points
              </p>

              <p className="mt-4 text-4xl font-semibold">
                12,480
              </p>

              <p className="mt-2 text-xs text-white/30">
                Reputation ledger
              </p>
            </div>
          </div>

          {/* ================= BREAKDOWN ================= */}
          <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-8 lg:p-10">
            <p className="text-xs uppercase tracking-[0.18em] text-white/30">
              Breakdown
            </p>

            <h2 className="mt-3 text-2xl font-semibold">
              What shapes your reputation
            </h2>

            <div className="mt-10 space-y-8">

              {/* Activity */}
              <div>
                <div className="mb-3 flex items-end justify-between">
                  <div>
                    <p className="text-sm font-medium">
                      On-chain activity
                    </p>

                    <p className="mt-1 text-xs text-white/30">
                      Consistency and depth of wallet activity
                    </p>
                  </div>

                  <span className="text-sm text-white/60">
                    92
                  </span>
                </div>

                <div className="h-2 rounded-full bg-white/5">
                  <div className="h-full w-[92%] rounded-full bg-emerald-400" />
                </div>
              </div>

              {/* Attestations */}
              <div>
                <div className="mb-3 flex items-end justify-between">
                  <div>
                    <p className="text-sm font-medium">
                      Attestations
                    </p>

                    <p className="mt-1 text-xs text-white/30">
                      Verified reputation signals
                    </p>
                  </div>

                  <span className="text-sm text-white/60">
                    84
                  </span>
                </div>

                <div className="h-2 rounded-full bg-white/5">
                  <div className="h-full w-[84%] rounded-full bg-emerald-400" />
                </div>
              </div>

              {/* Contributions */}
              <div>
                <div className="mb-3 flex items-end justify-between">
                  <div>
                    <p className="text-sm font-medium">
                      Contributions
                    </p>

                    <p className="mt-1 text-xs text-white/30">
                      Ecosystem participation and contributions
                    </p>
                  </div>

                  <span className="text-sm text-white/60">
                    78
                  </span>
                </div>

                <div className="h-2 rounded-full bg-white/5">
                  <div className="h-full w-[78%] rounded-full bg-emerald-400" />
                </div>
              </div>

            </div>
          </div>

          {/* ================= ACTIVITY ================= */}
          <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-8 lg:p-10">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-white/30">
                  Recent activity
                </p>

                <h2 className="mt-3 text-2xl font-semibold">
                  Reputation history
                </h2>
              </div>
            </div>

            <div className="mt-8 divide-y divide-white/10">

              <div className="flex items-center justify-between py-5">
                <div>
                  <p className="text-sm font-medium">
                    Ecosystem contribution
                  </p>

                  <p className="mt-1 text-xs text-white/30">
                    Protocol Alpha
                  </p>
                </div>

                <span className="text-sm text-emerald-300">
                  +120
                </span>
              </div>

              <div className="flex items-center justify-between py-5">
                <div>
                  <p className="text-sm font-medium">
                    Reputation attestation
                  </p>

                  <p className="mt-1 text-xs text-white/30">
                    Verified contributor
                  </p>
                </div>

                <span className="text-sm text-emerald-300">
                  +85
                </span>
              </div>

              <div className="flex items-center justify-between py-5">
                <div>
                  <p className="text-sm font-medium">
                    Community participation
                  </p>

                  <p className="mt-1 text-xs text-white/30">
                    Protocol Beta
                  </p>
                </div>

                <span className="text-sm text-emerald-300">
                  +60
                </span>
              </div>

            </div>
          </div>

          {/* ================= CTA ================= */}
          <div className="mt-6 flex flex-col items-center justify-between gap-5 rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center md:flex-row md:text-left">
            <div>
              <p className="text-lg font-semibold">
                Ready to discover more opportunities?
              </p>

              <p className="mt-2 text-sm text-white/35">
                Explore opportunities based on your reputation.
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

      {/* ================= FOOTER ================= */}
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
              href={`/wrapped/${wallet}`}
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
          </div>
        </div>
      </footer>
    </main>
  );
}