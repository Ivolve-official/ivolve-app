import Link from "next/link";
import Header from "../components/header";
import WalletButton from "../wallet-button";

export default function MintPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <Header />

      <section className="relative flex min-h-[calc(100vh-76px)] items-center justify-center overflow-hidden px-6 py-20">
        <div className="absolute left-1/2 top-1/2 h-[550px] w-[550px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400/[0.07] blur-[130px]" />

        <div className="relative w-full max-w-4xl">
          <div className="grid overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.035] lg:grid-cols-2">
            
            {/* Artwork */}
            <div className="flex min-h-[420px] items-center justify-center border-b border-white/10 bg-gradient-to-br from-white/[0.05] to-transparent p-10 lg:border-b-0 lg:border-r">
              <div className="relative flex h-64 w-64 items-center justify-center rounded-[2rem] border border-emerald-400/20 bg-emerald-400/[0.04] shadow-[0_0_100px_rgba(52,211,153,0.08)]">
                <div className="absolute inset-6 rounded-[1.5rem] border border-white/10" />

                <div className="text-center">
                  <p className="text-xs uppercase tracking-[0.25em] text-emerald-300">
                    Ivolve
                  </p>

                  <p className="mt-4 text-4xl font-semibold tracking-tight">
                    Founder
                  </p>

                  <p className="mt-2 text-sm text-white/35">
                    001 / ∞
                  </p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-8 sm:p-10 lg:p-12">
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-emerald-300">
                Founding Member
              </p>

              <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
                Become part of Ivolve.
              </h1>

              <p className="mt-6 text-sm leading-7 text-white/40">
                The Ivolve founding-member NFT will represent early
                participation in the reputation ecosystem.
              </p>

              <div className="mt-10 space-y-4">
                <div className="flex justify-between border-b border-white/10 pb-4">
                  <span className="text-sm text-white/35">
                    Collection
                  </span>

                  <span className="text-sm font-medium">
                    Ivolve Founders
                  </span>
                </div>

                <div className="flex justify-between border-b border-white/10 pb-4">
                  <span className="text-sm text-white/35">
                    Network
                  </span>

                  <span className="text-sm font-medium">
                    Base
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-white/35">
                    Status
                  </span>

                  <span className="text-sm font-medium text-emerald-300">
                    Coming soon
                  </span>
                </div>
              </div>

              <div className="mt-10">
                <WalletButton />
              </div>

              <p className="mt-4 text-xs leading-5 text-white/25">
                Mint functionality will be enabled after the core Ivolve
                product and smart-contract infrastructure are ready.
              </p>
            </div>
          </div>

          <div className="mt-7 flex justify-center gap-6 text-sm text-white/30">
            <Link href="/" className="hover:text-white">
              Back home
            </Link>

            <Link
              href="/profile/demo"
              className="hover:text-white"
            >
              View profile
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}