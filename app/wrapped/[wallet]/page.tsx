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

      <section className="relative flex min-h-[calc(100vh-76px)] items-center justify-center overflow-hidden px-6 py-20">
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400/[0.08] blur-[140px]" />

        <div className="relative w-full max-w-4xl">
          <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.035]">
            
            {/* Header */}
            <div className="border-b border-white/10 px-8 py-8 sm:px-12">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-emerald-300">
                    Ivolve Wrapped
                  </p>

                  <p className="mt-3 font-mono text-xs text-white/30">
                    {shortenedWallet}
                  </p>
                </div>

                <div className="text-sm text-white/30">
                  2026
                </div>
              </div>
            </div>

            {/* Main */}
            <div className="px-8 py-14 sm:px-12 sm:py-20">
              <p className="text-sm text-white/35">
                Your on-chain year
              </p>

              <h1 className="mt-4 max-w-3xl text-5xl font-semibold leading-[0.98] tracking-[-0.05em] sm:text-7xl">
                You didn&apos;t just use Web3.
                <span className="block text-white/40">
                  You built a reputation.
                </span>
              </h1>

              <div className="mt-16">
                <p className="text-xs uppercase tracking-[0.2em] text-white/30">
                  Reputation score
                </p>

                <div className="mt-3 text-8xl font-semibold tracking-[-0.07em] sm:text-9xl">
                  842
                </div>

                <p className="mt-3 text-sm text-emerald-300">
                  Top 8% of demo wallets
                </p>
              </div>

              <div className="mt-16 grid gap-4 sm:grid-cols-3">
                <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
                  <p className="text-xs text-white/30">
                    Attestations
                  </p>

                  <p className="mt-3 text-3xl font-semibold">
                    27
                  </p>
                </div>

                <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
                  <p className="text-xs text-white/30">
                    Points
                  </p>

                  <p className="mt-3 text-3xl font-semibold">
                    12,480
                  </p>
                </div>

                <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
                  <p className="text-xs text-white/30">
                    Opportunities
                  </p>

                  <p className="mt-3 text-3xl font-semibold">
                    08
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom */}
            <div className="border-t border-white/10 px-8 py-6 sm:px-12">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-white/30">
                  Ivolve · On-chain identity & reputation
                </p>

                <div className="flex gap-3">
                  <Link
                    href="/profile/demo"
                    className="rounded-full border border-white/10 px-4 py-2 text-xs font-medium hover:bg-white/[0.06]"
                  >
                    Profile
                  </Link>

                  <Link
                    href="/opportunities"
                    className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-black hover:bg-white/90"
                  >
                    Opportunities
                  </Link>
                </div>
              </div>
            </div>
          </div>

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