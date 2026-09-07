"use client";

import Link from "next/link";
import { useAccount } from "wagmi";

import Header from "../components/header";
import WalletButton from "../wallet-button";

export default function MintPage() {
  const { address, isConnected } = useAccount();

  const profileUrl =
    isConnected && address ? `/profile/${address}` : "/";

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <Header />

      <section className="relative overflow-hidden px-6 py-16 sm:py-20 lg:py-24">
        {/* Glow */}
        <div className="absolute left-1/2 top-20 h-[650px] w-[650px] -translate-x-1/2 rounded-full bg-emerald-400/[0.06] blur-[150px]" />

        <div className="relative mx-auto max-w-5xl">

          {/* Intro */}
          <div className="mb-10 text-center">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-emerald-300">
              Ivolve Founding Member
            </p>

            <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] sm:text-5xl lg:text-6xl">
              Be early.
              <span className="block text-white/35">
                Build with Ivolve.
              </span>
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/40">
              A founding-member NFT representing early participation in the
              Ivolve reputation ecosystem.
            </p>
          </div>

          {/* Main Card */}
          <div className="grid overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.035] shadow-2xl lg:grid-cols-2">

            {/* ================= ARTWORK ================= */}
            <div className="relative flex min-h-[500px] items-center justify-center overflow-hidden border-b border-white/10 bg-gradient-to-br from-white/[0.05] to-transparent p-10 lg:border-b-0 lg:border-r">
              <div className="absolute h-[350px] w-[350px] rounded-full bg-emerald-400/[0.06] blur-[100px]" />

              <div className="relative flex h-72 w-72 items-center justify-center rounded-[2.5rem] border border-emerald-400/20 bg-[#080909] shadow-[0_0_120px_rgba(52,211,153,0.08)]">
                <div className="absolute inset-5 rounded-[2rem] border border-white/10" />

                <div className="absolute inset-10 rounded-[1.5rem] border border-emerald-400/10" />

                <div className="relative text-center">
                  <p className="text-xs uppercase tracking-[0.3em] text-emerald-300">
                    Ivolve
                  </p>

                  <p className="mt-5 text-4xl font-semibold tracking-[-0.04em]">
                    Founder
                  </p>

                  <p className="mt-3 font-mono text-xs text-white/30">
                    001 / ∞
                  </p>
                </div>
              </div>
            </div>

            {/* ================= CONTENT ================= */}
            <div className="p-8 sm:p-10 lg:p-12">

              <div className="flex items-center justify-between gap-4">
                <p className="text-xs uppercase tracking-[0.2em] text-white/30">
                  Founding Collection
                </p>

                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-white/40">
                  Base
                </span>
              </div>

              <h2 className="mt-6 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
                Ivolve Founder #001
              </h2>

              <p className="mt-5 text-sm leading-7 text-white/40">
                The founding-member NFT will recognize the earliest members
                of the Ivolve ecosystem and their role in helping shape the
                reputation layer.
              </p>

              {/* Details */}
              <div className="mt-10 space-y-5">

                <div className="flex items-center justify-between border-b border-white/10 pb-5">
                  <span className="text-sm text-white/35">
                    Collection
                  </span>

                  <span className="text-sm font-medium">
                    Ivolve Founders
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-white/10 pb-5">
                  <span className="text-sm text-white/35">
                    Network
                  </span>

                  <span className="text-sm font-medium">
                    Base
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-white/10 pb-5">
                  <span className="text-sm text-white/35">
                    Supply
                  </span>

                  <span className="text-sm font-medium">
                    Limited
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/35">
                    Status
                  </span>

                  <span className="flex items-center gap-2 text-sm font-medium text-emerald-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    Coming soon
                  </span>
                </div>

              </div>

              {/* Wallet */}
              <div className="mt-10">
                <WalletButton />
              </div>

              <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.025] p-5">
                <p className="text-xs font-medium text-white/60">
                  Minting is not live yet.
                </p>

                <p className="mt-2 text-xs leading-5 text-white/25">
                  The mint will become available once the Ivolve smart
                  contract and founding-member infrastructure are ready.
                </p>
              </div>

            </div>
          </div>

          {/* ================= LINKS ================= */}
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
            <Link
              href="/"
              className="text-sm text-white/30 transition hover:text-white"
            >
              ← Back home
            </Link>

            <Link
              href={profileUrl}
              className="text-sm text-white/30 transition hover:text-white"
            >
              View your profile →
            </Link>

            <Link
              href="/opportunities"
              className="text-sm text-white/30 transition hover:text-white"
            >
              Explore opportunities →
            </Link>
          </div>

        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 px-6 py-8 text-sm text-white/30 sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 Ivolve</span>

          <div className="flex gap-5">
            <Link
              href="/leaderboard"
              className="transition hover:text-white"
            >
              Leaderboard
            </Link>

            <Link
              href="/opportunities"
              className="transition hover:text-white"
            >
              Opportunities
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}