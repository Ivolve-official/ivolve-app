import Link from "next/link";
import Header from "../../components/header";

const opportunityData: Record<
  string,
  {
    name: string;
    category: string;
    reward: string;
    status: string;
    description: string;
  }
> = {
  "protocol-alpha": {
    name: "Protocol Alpha",
    category: "Ecosystem",
    reward: "+500 pts",
    status: "Eligible",
    description:
      "Explore a new ecosystem opportunity based on your current reputation.",
  },

  "protocol-beta": {
    name: "Protocol Beta",
    category: "Community",
    reward: "+350 pts",
    status: "Available",
    description:
      "Participate in community activity and strengthen your reputation.",
  },

  "protocol-gamma": {
    name: "Protocol Gamma",
    category: "Early Access",
    reward: "+250 pts",
    status: "Explore",
    description:
      "Discover an early opportunity available to active wallets.",
  },

  "builder-network": {
    name: "Builder Network",
    category: "Contribution",
    reward: "+700 pts",
    status: "Eligible",
    description:
      "Contribute to the ecosystem and earn additional reputation points.",
  },

  "base-community": {
    name: "Base Community",
    category: "Community",
    reward: "+400 pts",
    status: "Available",
    description:
      "Connect with the Base ecosystem through verified activity.",
  },

  "ivolve-quest": {
    name: "Ivolve Quest",
    category: "Ivolve",
    reward: "+1,000 pts",
    status: "Coming soon",
    description:
      "A future Ivolve-native reputation challenge.",
  },
};

export default async function OpportunityPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const opportunity = opportunityData[slug];

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

          <Link
            href="/opportunities"
            className="mt-8 inline-flex rounded-full bg-white px-6 py-3 text-sm font-semibold text-black"
          >
            Back to Opportunities
          </Link>
        </div>
      </main>
    );
  }

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
              {opportunity.category}
            </span>

            <h1 className="mt-6 text-5xl font-semibold tracking-[-0.05em] sm:text-6xl">
              {opportunity.name}
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/40">
              {opportunity.description}
            </p>
          </div>
        </div>
      </section>

      {/* ================= DETAILS ================= */}
      <section className="mx-auto max-w-5xl px-6 py-12 lg:px-8">
        <div className="grid gap-5 sm:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-7">
            <p className="text-xs uppercase tracking-wider text-white/30">
              Status
            </p>

            <p className="mt-3 text-xl font-semibold text-emerald-300">
              {opportunity.status}
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-7">
            <p className="text-xs uppercase tracking-wider text-white/30">
              Reward
            </p>

            <p className="mt-3 text-xl font-semibold">
              {opportunity.reward}
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-7">
            <p className="text-xs uppercase tracking-wider text-white/30">
              Category
            </p>

            <p className="mt-3 text-xl font-semibold">
              {opportunity.category}
            </p>
          </div>
        </div>

        {/* Main opportunity card */}
        <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-8 lg:p-10">
          <p className="text-sm font-medium text-emerald-300">
            Opportunity details
          </p>

          <h2 className="mt-3 text-2xl font-semibold">
            Build reputation through participation.
          </h2>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/40">
            This opportunity page is currently using demo data. Later,
            this section will show the real eligibility requirements,
            actions, rewards, and verification status.
          </p>

          <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <p className="text-sm font-medium">
              What happens next?
            </p>

            <div className="mt-5 space-y-4 text-sm text-white/40">
              <div className="flex gap-3">
                <span className="text-emerald-300">01</span>
                <span>Review the opportunity requirements.</span>
              </div>

              <div className="flex gap-3">
                <span className="text-emerald-300">02</span>
                <span>Complete the required activity.</span>
              </div>

              <div className="flex gap-3">
                <span className="text-emerald-300">03</span>
                <span>Receive verified reputation points.</span>
              </div>
            </div>
          </div>

          <button
            disabled={opportunity.status === "Coming soon"}
            className="mt-8 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-30"
          >
            {opportunity.status === "Coming soon"
              ? "Coming soon"
              : "Start opportunity →"}
          </button>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-5xl justify-between px-6 py-8 text-sm text-white/30">
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