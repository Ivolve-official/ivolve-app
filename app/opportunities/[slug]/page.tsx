import Link from "next/link";
import Header from "../../components/header";

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

export default async function OpportunityPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { data: protocols, error } = await supabaseAdmin
    .from("protocols_tracked")
    .select(
      "id, name, chain, contract_address, category, snapshot_notes, active"
    )
    .eq("active", true);

  if (error) {
    return (
      <main className="min-h-screen bg-[#050505] text-white">
        <Header />

        <div className="mx-auto max-w-4xl px-6 py-24 text-center">
          <p className="text-sm text-white/40">
            Unable to load opportunity
          </p>

          <h1 className="mt-3 text-4xl font-semibold">
            Something went wrong.
          </h1>

          <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-white/30">
            Ivolve could not retrieve the current opportunity data.
            Please try again later.
          </p>

          <Link
            href="/opportunities"
            className="mt-8 inline-flex rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-white/90"
          >
            Back to Opportunities
          </Link>
        </div>
      </main>
    );
  }

  const opportunity = (protocols ?? []).find(
    (protocol: Protocol) => createSlug(protocol.name) === slug
  );

  if (!opportunity) {
    return (
      <main className="min-h-screen bg-[#050505] text-white">
        <Header />

        <div className="mx-auto max-w-4xl px-6 py-24 text-center">
          <p className="text-sm text-white/40">
            Opportunity not found
          </p>

          <h1 className="mt-3 text-4xl font-semibold">
            This opportunity does not exist.
          </h1>

          <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-white/30">
            The opportunity may no longer be active or may not have
            been added to the Ivolve ecosystem yet.
          </p>

          <Link
            href="/opportunities"
            className="mt-8 inline-flex rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-white/90"
          >
            Back to Opportunities
          </Link>
        </div>
      </main>
    );
  }

  const category = opportunity.category || "Ecosystem";

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <Header />

      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute left-1/2 top-0 h-96 w-[600px] -translate-x-1/2 rounded-full bg-emerald-400/[0.06] blur-[120px]" />

        <div className="relative mx-auto max-w-5xl px-6 py-20 lg:px-8 lg:py-28">
          <Link
            href="/opportunities"
            className="text-sm text-white/35 transition hover:text-white"
          >
            ← Back to Opportunities
          </Link>

          <div className="mt-10">
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-white/45">
              {category}
            </span>

            <h1 className="mt-6 text-5xl font-semibold tracking-[-0.05em] sm:text-6xl">
              {opportunity.name}
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/40">
              {opportunity.snapshot_notes ||
                "Tracked ecosystem activity in the Ivolve reputation layer."}
            </p>
          </div>
        </div>
      </section>

      {/* ================= DETAILS ================= */}
      <section className="mx-auto max-w-5xl px-6 py-12 lg:px-8">
        <div className="grid gap-5 sm:grid-cols-3">

          {/* Status */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-7">
            <p className="text-xs uppercase tracking-wider text-white/30">
              Status
            </p>

            <p className="mt-3 text-xl font-semibold text-emerald-300">
              Tracked
            </p>
          </div>

          {/* Network */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-7">
            <p className="text-xs uppercase tracking-wider text-white/30">
              Network
            </p>

            <p className="mt-3 text-xl font-semibold">
              {opportunity.chain}
            </p>
          </div>

          {/* Category */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-7">
            <p className="text-xs uppercase tracking-wider text-white/30">
              Category
            </p>

            <p className="mt-3 text-xl font-semibold">
              {category}
            </p>
          </div>

        </div>

        {/* Main opportunity card */}
        <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-8 lg:p-10">
          <p className="text-sm font-medium text-emerald-300">
            Opportunity details
          </p>

          <h2 className="mt-3 text-2xl font-semibold">
            Tracked by Ivolve.
          </h2>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/40">
            Ivolve is currently tracking this ecosystem record as
            part of its on-chain reputation infrastructure.
          </p>

          {/* Protocol information */}
          <div className="mt-8 space-y-5">

            <div className="flex flex-col gap-2 border-b border-white/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-sm text-white/35">
                Protocol
              </span>

              <span className="text-sm font-medium">
                {opportunity.name}
              </span>
            </div>

            <div className="flex flex-col gap-2 border-b border-white/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-sm text-white/35">
                Network
              </span>

              <span className="text-sm font-medium">
                {opportunity.chain}
              </span>
            </div>

            <div className="flex flex-col gap-2 border-b border-white/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-sm text-white/35">
                Category
              </span>

              <span className="text-sm font-medium">
                {category}
              </span>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-sm text-white/35">
                Contract
              </span>

              <span className="break-all font-mono text-xs text-white/50 sm:max-w-[65%] sm:text-right">
                {opportunity.contract_address ||
                  "Not specified"}
              </span>
            </div>

          </div>

          {/* Current state */}
          <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <p className="text-sm font-medium">
              Opportunity actions
            </p>

            <p className="mt-3 text-sm leading-6 text-white/40">
              Eligibility checks, participation actions, rewards,
              and verification will appear here once the Ivolve
              opportunity engine is connected to real program data.
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/opportunities"
              className="inline-flex w-fit rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-white/90"
            >
              Explore opportunities →
            </Link>

            <Link
              href="/"
              className="inline-flex w-fit rounded-full border border-white/10 bg-white/[0.04] px-6 py-3 text-sm font-medium text-white/70 transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
            >
              View Ivolve
            </Link>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-5xl flex-col justify-between gap-4 px-6 py-8 text-sm text-white/30 sm:flex-row sm:items-center">
          <span>© 2026 Ivolve</span>

          <Link
            href="/opportunities"
            className="transition hover:text-white"
          >
            Opportunities
          </Link>
        </div>
      </footer>
    </main>
  );
}