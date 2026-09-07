import Link from "next/link";
import WalletButton from "./wallet-button";
import Header from "./components/header";

const opportunities = [
  {
    name: "Protocol Alpha",
    type: "Ecosystem",
    status: "Eligible",
    points: "+500",
  },
  {
    name: "Protocol Beta",
    type: "Community",
    status: "Available",
    points: "+350",
  },
  {
    name: "Protocol Gamma",
    type: "Early Access",
    status: "Explore",
    points: "+250",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#050505] text-white">
     <Header />
     

      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-emerald-400/[0.07] blur-[120px]" />

        <div className="relative mx-auto max-w-7xl px-6 pb-24 pt-24 lg:px-8 lg:pb-32 lg:pt-32">
          <div className="grid items-center gap-16 lg:grid-cols-[1.05fr_0.95fr]">
            {/* Hero text */}
            <div>
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-4 py-2 text-xs text-white/55">
                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]" />
                On-chain reputation layer
              </div>

              <h1 className="max-w-3xl text-5xl font-semibold leading-[0.98] tracking-[-0.05em] sm:text-6xl lg:text-7xl">
                Your wallet tells a story.
                <span className="block text-white/45">
                  Ivolve makes it visible.
                </span>
              </h1>

              <p className="mt-7 max-w-xl text-base leading-7 text-white/45 sm:text-lg">
                Turn your on-chain activity, attestations, and contributions
                into a reputation you can understand, build, and carry
                across Web3.
              </p>

              {/* Hero buttons */}
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/profile/demo"
                  className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-black transition hover:bg-white/90"
                >
                  Build your reputation →
                </Link>

                <Link
                  href="/opportunities"
                  className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/[0.035] px-6 py-3.5 text-sm font-medium text-white transition hover:border-white/20 hover:bg-white/[0.07]"
                >
                  Explore Ivolve
                </Link>
              </div>

              <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-xs text-white/30">
                <span>Non-custodial</span>
                <span>•</span>
                <span>On-chain</span>
                <span>•</span>
                <span>Built for Web3</span>
              </div>
            </div>

            {/* ================= PROFILE PREVIEW ================= */}
            <div className="relative">
              <div className="absolute -inset-10 rounded-full bg-emerald-400/[0.04] blur-3xl" />

              <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.035] shadow-2xl">
                {/* Preview header */}
                <div className="border-b border-white/10 px-7 py-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-white/30">
                        Reputation profile
                      </p>

                      <p className="mt-2 font-mono text-sm text-white/50">
                        0x71...9A2F
                      </p>
                    </div>

                    <div className="flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs text-emerald-300">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      Verified
                    </div>
                  </div>
                </div>

                {/* Score */}
                <div className="px-7 py-8">
                  <p className="text-sm text-white/35">
                    Reputation Score
                  </p>

                  <div className="mt-2 flex items-end gap-3">
                    <span className="text-7xl font-semibold tracking-[-0.06em]">
                      842
                    </span>

                    <span className="mb-3 text-sm text-emerald-300">
                      Excellent
                    </span>
                  </div>

                  {/* Activity bars */}
                  <div className="mt-8 flex h-24 items-end gap-2">
                    {[35, 48, 42, 60, 55, 72, 66, 84, 78, 92, 86, 100].map(
                      (height, index) => (
                        <div
                          key={index}
                          className="flex-1 rounded-t-md bg-white/[0.09]"
                          style={{ height: `${height}%` }}
                        />
                      )
                    )}
                  </div>

                  {/* Stats */}
                  <div className="mt-8 grid grid-cols-3 gap-3">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
                      <p className="text-xs text-white/30">
                        Attestations
                      </p>
                      <p className="mt-2 text-xl font-semibold">
                        27
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
                      <p className="text-xs text-white/30">
                        Points
                      </p>
                      <p className="mt-2 text-xl font-semibold">
                        12.4K
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
                      <p className="text-xs text-white/30">
                        Opportunities
                      </p>
                      <p className="mt-2 text-xl font-semibold">
                        08
                      </p>
                    </div>
                  </div>

                  {/* Profile redirect */}
                  <Link
                    href="/profile/demo"
                    className="mt-5 flex w-full items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-medium transition hover:border-white/20 hover:bg-white/[0.08]"
                  >
                    View full profile →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section
        id="how-it-works"
        className="border-t border-white/10"
      >
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-emerald-300">
              How it works
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Reputation should compound.
            </h2>

            <p className="mt-4 text-base leading-7 text-white/40">
              Ivolve turns your existing on-chain activity into a
              reputation layer that grows with you.
            </p>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {/* Step 1 */}
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-7">
              <span className="text-sm text-white/25">
                01
              </span>

              <h3 className="mt-12 text-xl font-semibold">
                Connect
              </h3>

              <p className="mt-3 text-sm leading-6 text-white/40">
                Connect your wallet and let Ivolve understand your
                public on-chain identity.
              </p>
            </div>

            {/* Step 2 */}
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-7">
              <span className="text-sm text-white/25">
                02
              </span>

              <h3 className="mt-12 text-xl font-semibold">
                Verify
              </h3>

              <p className="mt-3 text-sm leading-6 text-white/40">
                Turn meaningful activity and attestations into
                verifiable reputation signals.
              </p>
            </div>

            {/* Step 3 */}
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-7">
              <span className="text-sm text-white/25">
                03
              </span>

              <h3 className="mt-12 text-xl font-semibold">
                Compound
              </h3>

              <p className="mt-3 text-sm leading-6 text-white/40">
                Build points, unlock opportunities, and carry your
                reputation forward.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= REPUTATION ================= */}
      <section className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-emerald-300">
                Reputation
              </p>

              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                Make your on-chain history useful.
              </h2>

              <p className="mt-5 max-w-xl text-base leading-7 text-white/40">
                Your wallet already contains signals about what you do,
                where you participate, and how consistently you contribute.
                Ivolve organizes those signals into a reputation profile.
              </p>

              <Link
                href="/profile/demo"
                className="mt-8 inline-flex rounded-full border border-white/10 bg-white/[0.035] px-6 py-3 text-sm font-medium transition hover:border-white/20 hover:bg-white/[0.07]"
              >
                Explore reputation →
              </Link>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8">
              <div className="flex items-center justify-between border-b border-white/10 pb-6">
                <div>
                  <p className="text-xs text-white/30">
                    Reputation
                  </p>

                  <p className="mt-2 text-4xl font-semibold">
                    842
                  </p>
                </div>

                <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs text-emerald-300">
                  Top 8%
                </div>
              </div>

              <div className="mt-7 space-y-6">
                <div>
                  <div className="mb-2 flex justify-between text-xs">
                    <span className="text-white/40">
                      On-chain activity
                    </span>

                    <span className="text-white/60">
                      92
                    </span>
                  </div>

                  <div className="h-2 rounded-full bg-white/5">
                    <div className="h-full w-[92%] rounded-full bg-emerald-400" />
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex justify-between text-xs">
                    <span className="text-white/40">
                      Attestations
                    </span>

                    <span className="text-white/60">
                      84
                    </span>
                  </div>

                  <div className="h-2 rounded-full bg-white/5">
                    <div className="h-full w-[84%] rounded-full bg-emerald-400" />
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex justify-between text-xs">
                    <span className="text-white/40">
                      Contributions
                    </span>

                    <span className="text-white/60">
                      78
                    </span>
                  </div>

                  <div className="h-2 rounded-full bg-white/5">
                    <div className="h-full w-[78%] rounded-full bg-emerald-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= OPPORTUNITIES ================= */}
      <section className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-emerald-300">
                Opportunities
              </p>

              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                Your reputation opens doors.
              </h2>

              <p className="mt-4 max-w-xl text-base leading-7 text-white/40">
                Discover opportunities based on the reputation you are
                already building.
              </p>
            </div>

            <Link
              href="/opportunities"
              className="w-fit text-sm font-medium text-white transition hover:text-emerald-300"
            >
              View all opportunities →
            </Link>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {opportunities.map((opportunity) => (
              <Link
                key={opportunity.name}
                href="/opportunities"
                className="group rounded-3xl border border-white/10 bg-white/[0.03] p-7 transition hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.05]"
              >
                <div className="flex items-start justify-between">
                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-white/40">
                    {opportunity.type}
                  </span>

                  <span className="text-xs text-emerald-300">
                    {opportunity.points}
                  </span>
                </div>

                <h3 className="mt-10 text-xl font-semibold">
                  {opportunity.name}
                </h3>

                <p className="mt-2 text-sm text-white/35">
                  {opportunity.status}
                </p>

                <div className="mt-8 text-sm text-white/40 transition group-hover:text-white">
                  Explore →
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ================= LEADERBOARD ================= */}
      <section className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-emerald-300">
                Leaderboard
              </p>

              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                See reputation in motion.
              </h2>

              <p className="mt-5 max-w-xl text-base leading-7 text-white/40">
                Compare reputation across the ecosystem and see where
                your wallet stands.
              </p>

              <Link
                href="/leaderboard"
                className="mt-8 inline-flex rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-white/90"
              >
                View leaderboard →
              </Link>
            </div>

            <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">
              {[
                ["01", "0x82...F91A", "1,842"],
                ["02", "0x14...B72C", "1,721"],
                ["03", "0xA4...19DE", "1,680"],
                ["04", "0x71...9A2F", "842"],
              ].map(([rank, wallet, score]) => (
                <div
                  key={rank}
                  className="flex items-center justify-between border-b border-white/10 px-6 py-5 last:border-b-0"
                >
                  <div className="flex items-center gap-5">
                    <span className="text-xs text-white/25">
                      {rank}
                    </span>

                    <span className="font-mono text-sm text-white/60">
                      {wallet}
                    </span>
                  </div>

                  <span className="text-sm font-medium">
                    {score}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section className="border-t border-white/10">
        <div className="mx-auto max-w-5xl px-6 py-28 text-center lg:px-8">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-emerald-300">
            Start building
          </p>

          <h2 className="mx-auto mt-4 max-w-3xl text-4xl font-semibold tracking-[-0.04em] sm:text-5xl lg:text-6xl">
            Your reputation already exists.
            <span className="block text-white/40">
              Make it visible.
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-white/40">
            Connect your wallet and explore the reputation you are
            already building on-chain.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <WalletButton />

            <Link
              href="/profile/demo"
              className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-6 py-3.5 text-sm font-medium transition hover:bg-white/[0.08]"
            >
              Open demo profile
            </Link>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-6 py-8 text-sm text-white/30 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <div>
            © 2026 Ivolve
          </div>

          <div className="flex flex-wrap gap-5">
            <Link
              href="/profile/demo"
              className="transition hover:text-white"
            >
              Profile
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
              href="/leaderboard"
              className="transition hover:text-white"
            >
              Leaderboard
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