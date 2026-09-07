"use client";

import Link from "next/link";
import { useAccount } from "wagmi";
import WalletButton from "../wallet-button";

export default function Header() {
  const { address, isConnected } = useAccount();

  const profileUrl = isConnected && address
    ? `/profile/${address}`
    : "/profile/demo";

  const wrappedUrl = isConnected && address
    ? `/wrapped/${address}`
    : "/wrapped/demo";

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#050505]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-6 lg:px-8">
        
        {/* Logo */}
        <Link
          href="/"
          className="text-xl font-semibold tracking-tight text-white transition hover:text-white/80"
        >
          Ivolve
        </Link>

        {/* Navigation */}
        <nav className="hidden items-center gap-8 text-sm md:flex">
          <Link
            href="/"
            className="text-white/55 transition hover:text-white"
          >
            Home
          </Link>

          <Link
            href={profileUrl}
            className="text-white/55 transition hover:text-white"
          >
            Profile
          </Link>

          <Link
            href="/opportunities"
            className="text-white/55 transition hover:text-white"
          >
            Opportunities
          </Link>

          <Link
            href={wrappedUrl}
            className="text-white/55 transition hover:text-white"
          >
            Wrapped
          </Link>

          <Link
            href="/leaderboard"
            className="text-white/55 transition hover:text-white"
          >
            Leaderboard
          </Link>
        </nav>

        {/* Wallet */}
        <WalletButton />
      </div>
    </header>
  );
}