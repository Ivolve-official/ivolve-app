"use client";

import Link from "next/link";
import { useAccount } from "wagmi";
import Header from "../components/header";

const opportunities = [
  {
    name: "Protocol Alpha",
    category: "Ecosystem",
    reward: "+500 pts",
    status: "Eligible",
    description:
      "Explore a new ecosystem opportunity based on your current reputation.",
  },
  {
    name: "Protocol Beta",
    category: "Community",
    reward: "+350 pts",
    status: "Available",
    description:
      "Participate in community activity and strengthen your reputation.",
  },
  {
    name: "Protocol Gamma",
    category: "Early Access",
    reward: "+250 pts",
    status: "Explore",
    description:
      "Discover an early opportunity available to active wallets.",
  },
  {
    name: "Builder Network",
    category: "Contribution",
    reward: "+700 pts",
    status: "Eligible",
    description:
      "Contribute to the ecosystem and earn additional reputation points.",
  },
  {
    name: "Base Community",
    category: "Community",
    reward: "+400 pts",
    status: "Available",
    description:
      "Connect with the Base ecosystem through verified activity.",
  },
  {
    name: "Ivolve Quest",
    category: "Ivolve",
    reward: "+1,000 pts",
    status: "Coming soon",
    description:
      "A future Ivolve-native reputation challenge.",
  },
];

export default function DashboardPage() {
  const { address, isConnected } = useAccount();

  const profileUrl =
    isConnected && address ? `/profile/${address}` : "/profile/demo";

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <Header />

      {/* ================= HEADER ================= */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute left-1/2 top-0 h-96 w-[600px] -translate-x-1/2 rounded-full bg-emerald-400/[0.06] blur-[120px]" />

        <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-emerald-300">
            Opportunities
          </p>

          <h1 className="mt-4 max-w-4xl text-5xl font-semibold tracking-[-0.05em] sm:text-6xl">
            Opportunities built around your reputation.
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-7 text-white/40 sm:text-lg">
            Discover ecosystems, contributions, and opportunities that match
            the reputation you are building on-chain.
          </p>
        </div>
      </section>

      {/* ================= STATS ================= */}
      <section className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-7 transition hover:border-white/20 hover:bg-white/[0.05]">
            <p className="text-sm text-white/35">Available</p>

            <p className="mt-3 text-4xl font-semibold">
              08
            </p>

            <p className="mt-2 text-xs text-white/25">
              Opportunities to explore
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-7 transition hover:border-white/20 hover:bg-white/[0.05]">
            <p className="text-sm text-white/35">Eligible</p>

            <p className="mt-3 text-4xl font-semibold">
              03
            </p>

            <p className="mt-2 text-xs text-emerald-300">
              Ready to claim
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-7 transition hover:border-white/20 hover:bg-white/[0.05]">
            <p className="text-sm text-white/35">
              Potential points
            </p>

            <p className="mt-3 text-4xl font-semibold">
              3.1K
            </p>

            <p className="mt-2 text-xs text-white/25">
              Available across opportunities
            </p>
          </div>
        </div>
      </section>

      {/* ================= OPPORTUNITIES ================= */}
      <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-sm text-white/30">
              DISCOVER
            </p>

            <h2 className="mt-2 text-2xl font-semibold">
              Recommended opportunities
            </h2>
          </div>

          <span className="hidden text-sm text-white/30 sm:block">
            Based on reputation
          </span>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {opportunities.map((opportunity) => (
            <Link
              key={opportunity.name}
              href={`/opportunities/${opportunity.name
                 .toLowerCase()
                    .replace(/\s+/g, "-")}`}
                    
              className="group rounded-3xl border border-white/10 bg-white/[0.03] p-7 transition hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.05]"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-white/40">
                  {opportunity.category}
                </span>

                <span className="text-xs text-emerald-300">
                  {opportunity.reward}
                </span>
              </div>

              <h3 className="mt-9 text-xl font-semibold">
                {opportunity.name}
              </h3>

              <p className="mt-3 min-h-12 text-sm leading-6 text-white/35">
                {opportunity.description}
              </p>

              <div className="mt-7 flex items-center justify-between">
                <span className="text-xs text-white/30">
                  {opportunity.status}
                </span>

                <span className="rounded-full border border-white/10 px-4 py-2 text-xs font-medium text-white/70 transition group-hover:border-white/20 group-hover:bg-white/[0.06] group-hover:text-white">
                  Explore →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="flex flex-col justify-between gap-7 rounded-3xl border border-white/10 bg-white/[0.03] p-8 sm:p-10 md:flex-row md:items-center">
            <div>
              <p className="text-sm font-medium text-emerald-300">
                Your reputation
              </p>

              <h2 className="mt-2 text-2xl font-semibold">
                See what is powering your opportunities.
              </h2>

              <p className="mt-2 text-sm text-white/35">
                Review your reputation score, attestations, and contributions.
              </p>
            </div>

            <Link
              href={profileUrl}
              className="inline-flex w-fit rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-white/90"
            >
              View profile →
            </Link>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 text-sm text-white/30 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <span>© 2026 Ivolve</span>

          <div className="flex flex-wrap gap-5">
            <Link href="/" className="transition hover:text-white">
              Home
            </Link>

            <Link
              href={profileUrl}
              className="transition hover:text-white"
            >
              Profile
            </Link>

            <Link
              href={
                isConnected && address
                  ? `/wrapped/${address}`
                  : "/wrapped/demo"
              }
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