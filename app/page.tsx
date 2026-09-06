export default function Home() {
  return (
    <main className="min-h-screen bg-[#07080a] text-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-black font-black">
            I
          </div>

          <span className="text-xl font-semibold tracking-tight">
            ivolve
          </span>
        </div>

        <div className="hidden items-center gap-8 text-sm text-zinc-400 md:flex">
          <a href="#how-it-works" className="transition hover:text-white">
            How it works
          </a>
          <a href="#reputation" className="transition hover:text-white">
            Reputation
          </a>
          <a href="#opportunities" className="transition hover:text-white">
            Opportunities
          </a>
        </div>

        <button className="rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-medium backdrop-blur transition hover:bg-white/10">
          Connect wallet
        </button>
      </nav>

      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute left-1/2 top-20 h-96 w-96 -translate-x-1/2 rounded-full bg-white/10 blur-[120px]" />

        <div className="relative mx-auto max-w-5xl px-6 pb-28 pt-24 text-center lg:px-8 lg:pt-32">
          <div className="mx-auto mb-8 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-300">
            <span className="mr-2 h-2 w-2 rounded-full bg-emerald-400" />
            Your on-chain identity, finally organized.
          </div>

          <h1 className="mx-auto max-w-4xl text-5xl font-semibold tracking-tight sm:text-6xl lg:text-8xl">
            Your wallet tells a story.
            <span className="block text-zinc-500">
              Ivolve makes it visible.
            </span>
          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-zinc-400">
            Turn your verified on-chain activity into a reputation profile,
            discover opportunities, and build a history that compounds over time.
          </p>

          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <button className="rounded-full bg-white px-7 py-3.5 font-semibold text-black transition hover:scale-[1.02]">
              Build your reputation
            </button>

            <button className="rounded-full border border-white/15 bg-white/5 px-7 py-3.5 font-semibold text-white transition hover:bg-white/10">
              Explore Ivolve
            </button>
          </div>

          <div className="mx-auto mt-20 max-w-4xl rounded-3xl border border-white/10 bg-white/[0.03] p-3 shadow-2xl">
            <div className="rounded-2xl border border-white/10 bg-[#0c0d10] p-6 text-left">
              <div className="flex items-center justify-between border-b border-white/10 pb-5">
                <div>
                  <p className="text-sm text-zinc-500">REPUTATION PROFILE</p>
                  <p className="mt-1 text-lg font-medium">Your on-chain identity</p>
                </div>

                <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300">
                  VERIFIED
                </div>
              </div>

              <div className="grid gap-4 py-6 sm:grid-cols-3">
                <div className="rounded-2xl bg-white/[0.04] p-5">
                  <p className="text-sm text-zinc-500">Reputation</p>
                  <p className="mt-2 text-4xl font-semibold">842</p>
                </div>

                <div className="rounded-2xl bg-white/[0.04] p-5">
                  <p className="text-sm text-zinc-500">Attestations</p>
                  <p className="mt-2 text-4xl font-semibold">27</p>
                </div>

                <div className="rounded-2xl bg-white/[0.04] p-5">
                  <p className="text-sm text-zinc-500">Opportunities</p>
                  <p className="mt-2 text-4xl font-semibold">08</p>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Verified activity</p>
                  <p className="text-xs text-zinc-500">Last 90 days</p>
                </div>

                <div className="mt-6 flex h-24 items-end gap-2">
                  {[35, 52, 42, 70, 58, 82, 68, 92, 76, 100, 84, 96].map(
                    (height, index) => (
                      <div
                        key={index}
                        className="flex-1 rounded-t-md bg-white/20 transition hover:bg-white/40"
                        style={{ height: `${height}%` }}
                      />
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="how-it-works"
        className="border-t border-white/10 px-6 py-24 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500">
            How Ivolve works
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              {
                number: "01",
                title: "Connect",
                text: "Connect your wallet without giving up custody of your assets.",
              },
              {
                number: "02",
                title: "Verify",
                text: "Turn meaningful contributions and activity into verifiable reputation.",
              },
              {
                number: "03",
                title: "Compound",
                text: "Use your reputation to discover opportunities and build your on-chain history.",
              },
            ].map((item) => (
              <div
                key={item.number}
                className="rounded-3xl border border-white/10 bg-white/[0.03] p-7"
              >
                <p className="text-sm text-zinc-600">{item.number}</p>
                <h2 className="mt-8 text-2xl font-semibold">{item.title}</h2>
                <p className="mt-4 leading-7 text-zinc-400">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 px-6 py-10 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 text-sm text-zinc-500 sm:flex-row">
          <p>© 2026 Ivolve</p>
          <p>On-chain reputation. Real opportunities.</p>
        </div>
      </footer>
    </main>
  );
}