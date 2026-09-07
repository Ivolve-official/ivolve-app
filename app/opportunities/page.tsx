import Link from "next/link";
import Header from "../components/header";

import { supabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

type Protocol = {
  id: string;
  name: string;
  chain: string;
  contract_address: string | null;
  category: string | null;
  snapshot_notes: string | null;
  active: boolean;
};

function createSlug(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default async function OpportunitiesPage() {
  const { data: protocols, error } = await supabaseAdmin
    .from("protocols_tracked")
    .select(
      "id, name, chain, contract_address, category, snapshot_notes, active"
    )
    .eq("active", true)
    .order("name", { ascending: true });

  const opportunities: Protocol[] = protocols ?? [];

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
            Discover ecosystems, contributions, and opportunities that
            connect with the reputation you are building on-chain.
          </p>
        </div>
      </section>

      {/* ================= STATS ================= */}
      <section className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-3">

          {/* Available */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-7 transition hover:border-white/20 hover:bg-white/[0.05]">
            <p className="text-sm text-white/35">
              Tracked
            </p>

            <p className="mt-3 text-4xl font-semibold">
              {opportunities.length.toLocaleString()}
            </p>

            <p className="mt-2 text-xs text-white/25">
              Active ecosystem records
            </p>
          </div>

          {/* Networks */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-7 transition hover:border-white/20 hover:bg-white/[0.05]">
            <p className="text-sm text-white/35">
              Networks
            </p>

            <p className="mt-3 text-4xl font-semibold">
              {new Set(
                opportunities.map((opportunity) => opportunity.chain)
              ).size.toLocaleString()}
            </p>

            <p className="mt-2 text-xs text-emerald-300">
              Networks with tracked protocols
            </p>
          </div>

          {/* Status */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-7 transition hover:border-white/20 hover:bg-white/[0.05]">
            <p className="text-sm text-white/35">
              Status
            </p>

            <p className="mt-3 text-4xl font-semibold">
              Live
            </p>

            <p className="mt-2 text-xs text-white/25">
              Showing database records
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
              Tracked opportunities
            </h2>
          </div>

          <span className="hidden text-sm text-white/30 sm:block">
            Based on tracked ecosystem data
          </span>
        </div>

        {/* Error state */}
        {error && (
          <div className="rounded-3xl border border-red-400/20 bg-red-400/[0.04] p-8">
            <p className="text-sm font-medium text-white/70">
              Unable to load opportunities.
            </p>

            <p className="mt-2 text-sm leading-6 text-white/35">
              Ivolve could not retrieve the current tracked ecosystem
              data. Please try again later.
            </p>
          </div>
        )}

        {/* Empty state */}
        {!error && opportunities.length === 0 && (
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] px-6 py-20 text-center">
            <p className="text-sm font-medium text-white/60">
              Opportunities are being built.
            </p>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/30">
              Ivolve will show real ecosystem opportunities here once
              protocols have been added to the tracked database.
            </p>
          </div>
        )}

        {/* Real opportunities */}
        {!error && opportunities.length > 0 && (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {opportunities.map((opportunity) => (
              <Link
                key={opportunity.id}
                href={`/opportunities/${createSlug(
                  opportunity.name
                )}`}
                className="group rounded-3xl border border-white/10 bg-white/[0.03] p-7 transition hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.05]"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-white/40">
                    {opportunity.category || "Ecosystem"}
                  </span>

                  <span className="text-xs text-emerald-300">
                    {opportunity.chain}
                  </span>
                </div>

                <h3 className="mt-9 text-xl font-semibold">
                  {opportunity.name}
                </h3>

                <p className="mt-3 min-h-12 text-sm leading-6 text-white/35">
                  {opportunity.snapshot_notes ||
                    "Tracked ecosystem opportunity in Ivolve."}
                </p>

                <div className="mt-7 flex items-center justify-between">
                  <span className="text-xs text-white/30">
                    Tracked
                  </span>

                  <span className="rounded-full border border-white/10 px-4 py-2 text-xs font-medium text-white/70 transition group-hover:border-white/20 group-hover:bg-white/[0.06] group-hover:text-white">
                    Explore →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
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
                Review your on-chain activity, attestations, and
                contributions.
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

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 text-sm text-white/30 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <span>© 2026 Ivolve</span>

          <div className="flex flex-wrap gap-5">
            <Link
              href="/"
              className="transition hover:text-white"
            >
              Home
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