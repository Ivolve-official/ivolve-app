"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useAccount } from "wagmi";

import WalletButton from "./wallet-button";
import Header from "./components/header";
import { supabase } from "@/lib/supabase";

type Transaction = {
  id: string;
  wallet: string;
  chain: string;
  transaction_hash: string;
  from_address: string;
  to_address: string | null;
  category: string;
  asset: string | null;
  value: number | null;
  timestamp: string | null;
};

type Attestation = {
  id: string;
  wallet: string;
  schema_uid: string;
  attester: string;
  project_name: string | null;
  role: string | null;
  attested_at: string | null;
};

type PointEvent = {
  id: string;
  wallet: string;
  source: string;
  weight: number;
  description: string | null;
  created_at: string;
};

type Protocol = {
  id: string;
  name: string;
  chain: string;
  contract_address: string | null;
  category: string | null;
  snapshot_notes: string | null;
  active: boolean;
};

type WalletProtocolActivity = {
  protocol_id: string | null;
  has_interacted: boolean;
};

type User = {
  wallet: string;
  display_name: string | null;
  bio: string | null;
};

type EASAttestation = {
  id: string;
  schemaId: string;
  attester: string;
  recipient: string;
  time: string;
  expirationTime: string;
  revocationTime: string;
  data: string;
  chain: "base" | "base-sepolia";
};

type LeaderboardRow = {
  wallet: string;
  displayName: string;
  points: number;
};

type PageData = {
  transactions: Transaction[];
  attestations: Attestation[];
  pointsEvents: PointEvent[];
  protocols: Protocol[];
  walletProtocolActivity: WalletProtocolActivity[];
  users: User[];
  leaderboardPoints: PointEvent[];
};

function shortenAddress(address: string) {
  if (address.length <= 12) {
    return address;
  }

  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function formatNumber(value: number) {
  return value.toLocaleString("en-US");
}

function chainLabel(chain: string) {
  const value = chain.toLowerCase();

  if (value === "base") {
    return "Base";
  }

  if (
    value === "base-sepolia" ||
    value === "base_sepolia" ||
    value === "basesepolia"
  ) {
    return "Base Sepolia";
  }

  return chain;
}

function categoryLabel(category: string) {
  switch (category) {
    case "external":
      return "ETH transfer";

    case "erc20":
      return "Token transfer";

    case "erc721":
      return "NFT transfer";

    case "erc1155":
      return "NFT / asset transfer";

    default:
      return "On-chain activity";
  }
}

function formatActivityDate(timestamp: string | null) {
  if (!timestamp) {
    return "Unknown date";
  }

  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return "Unknown date";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function calculateScore(
  activityCount: number,
  attestationCount: number,
  points: number
) {
  if (
    activityCount === 0 &&
    attestationCount === 0 &&
    points === 0
  ) {
    return null;
  }

  const activitySignal = Math.min(
    100,
    Math.round(
      Math.log10(activityCount + 1) * 30
    )
  );

  const attestationSignal = Math.min(
    100,
    attestationCount * 10
  );

  const contributionSignal = Math.min(
    100,
    Math.round(points / 100)
  );

  return Math.round(
    activitySignal * 0.6 +
      attestationSignal * 0.2 +
      contributionSignal * 0.2
  );
}

function getProtocolCategory(
  protocol: Protocol
) {
  if (protocol.category) {
    return protocol.category;
  }

  return "Ecosystem";
}
async function fetchEASAttestations(
  wallet: string,
  endpoint: string,
  chain: "base" | "base-sepolia"
): Promise<EASAttestation[]> {
  const query = `
    query GetAttestationsByRecipient(
      $recipient: String!
    ) {
      attestations(
        where: {
          recipient: {
            equals: $recipient
          }
        }
        take: 100
      ) {
        id
        schemaId
        attester
        recipient
        time
        expirationTime
        revocationTime
        data
      }
    }
  `;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables: {
        recipient: wallet.toLowerCase(),
      },
    }),
  });

  if (!response.ok) {
    throw new Error(
      `EAS request failed: ${response.status}`
    );
  }

  const result = await response.json();

  if (result.errors) {
    console.error(
      "EAS GraphQL errors:",
      result.errors
    );

    throw new Error(
      "EAS GraphQL query failed"
    );
  }

  return (result.data?.attestations ?? []).map(
    (
      attestation: Omit<
        EASAttestation,
        "chain"
      >
    ) => ({
      ...attestation,
      chain,
    })
  );
}
export default function Home() {
  const { address, isConnected } = useAccount();

  const [pageData, setPageData] =
    useState<PageData>({
      transactions: [],
      attestations: [],
      pointsEvents: [],
      protocols: [],
      walletProtocolActivity: [],
      users: [],
      leaderboardPoints: [],
    });

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const connected = Boolean(
    isConnected && address
  );

  /*
   * =========================================================
   * LOAD REAL DATA DIRECTLY FROM SUPABASE
   * =========================================================
   */

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      try {
        setLoading(true);
        setError(null);

        /*
         * -----------------------------------------------------
         * GLOBAL DATA
         * -----------------------------------------------------
         */

        const [
          transactionsResult,
          protocolsResult,
          usersResult,
          allPointsResult,
        ] = await Promise.all([
          supabase
            .from("wallet_transactions")
            .select(
              `
                id,
                wallet,
                chain,
                transaction_hash,
                from_address,
                to_address,
                category,
                asset,
                value,
                timestamp
              `
            )
            .order("timestamp", {
              ascending: false,
            })
            .limit(5000),

          supabase
            .from("protocols_tracked")
            .select(
              `
                id,
                name,
                chain,
                contract_address,
                category,
                snapshot_notes,
                active
              `
            )
            .eq("active", true)
            .order("name", {
              ascending: true,
            }),

          supabase
            .from("users")
            .select(
              `
                wallet,
                display_name,
                bio
              `
            )
            .limit(1000),

          supabase
            .from("points_events")
            .select(
              `
                id,
                wallet,
                source,
                weight,
                description,
                created_at
              `
            )
            .order("created_at", {
              ascending: false,
            })
            .limit(5000),
        ]);

        if (transactionsResult.error) {
          throw transactionsResult.error;
        }

        if (protocolsResult.error) {
          throw protocolsResult.error;
        }

        if (usersResult.error) {
          throw usersResult.error;
        }

        if (allPointsResult.error) {
          throw allPointsResult.error;
        }

        /*
         * -----------------------------------------------------
         * WALLET-SPECIFIC DATA
         * -----------------------------------------------------
         */

        let attestations: Attestation[] = [];
        let walletPoints: PointEvent[] = [];
        let walletProtocolActivity: WalletProtocolActivity[] =
          [];

        if (address) {
          const [
            attestationsResult,
            walletPointsResult,
            walletActivityResult,
          ] = await Promise.all([
            supabase
              .from("attestations_cache")
              .select(
                `
                  id,
                  wallet,
                  schema_uid,
                  attester,
                  project_name,
                  role,
                  attested_at
                `
              )
              .eq(
                "wallet",
                address.toLowerCase()
              )
              .order("attested_at", {
                ascending: false,
              })
              .limit(5000),

            supabase
              .from("points_events")
              .select(
                `
                  id,
                  wallet,
                  source,
                  weight,
                  description,
                  created_at
                `
              )
              .eq(
                "wallet",
                address.toLowerCase()
              )
              .order("created_at", {
                ascending: false,
              })
              .limit(5000),

            supabase
              .from("wallet_activity")
              .select(
                `
                  protocol_id,
                  has_interacted
                `
              )
              .eq(
                "wallet",
                address.toLowerCase()
              ),
          ]);

          if (attestationsResult.error) {
            throw attestationsResult.error;
          }

          if (walletPointsResult.error) {
            throw walletPointsResult.error;
          }

          if (walletActivityResult.error) {
            throw walletActivityResult.error;
          }

          attestations =
            attestationsResult.data ?? [];

          walletPoints =
            walletPointsResult.data ?? [];

          walletProtocolActivity =
            walletActivityResult.data ?? [];
        }

        if (!cancelled) {
          setPageData({
            transactions:
              transactionsResult.data ?? [],

            attestations,

            pointsEvents:
              walletPoints,

            protocols:
              protocolsResult.data ?? [],

            walletProtocolActivity,

            users:
              usersResult.data ?? [],

            leaderboardPoints:
              allPointsResult.data ?? [],
          });
        }
      } catch (loadError) {
        console.error(
          "Ivolve homepage data error:",
          loadError
        );

        if (!cancelled) {
          setError(
            "Some live data could not be loaded."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      cancelled = true;
    };
  }, [address]);

  /*
   * =========================================================
   * WALLET TRANSACTIONS
   * =========================================================
   */

  const walletTransactions = useMemo(() => {
    if (!address) {
      return [];
    }

    const wallet =
      address.toLowerCase();

    return pageData.transactions.filter(
      (transaction) =>
        transaction.wallet.toLowerCase() ===
        wallet
    );
  }, [
    address,
    pageData.transactions,
  ]);

  /*
   * =========================================================
   * REAL METRICS
   * =========================================================
   */

  const activityCount =
    walletTransactions.length;

  const attestationCount =
    pageData.attestations.length;

  const points = useMemo(() => {
    return pageData.pointsEvents.reduce(
      (total, event) =>
        total + (event.weight ?? 0),
      0
    );
  }, [pageData.pointsEvents]);

  const score = calculateScore(
    activityCount,
    attestationCount,
    points
  );

  /*
   * =========================================================
   * OPPORTUNITIES
   * =========================================================
   */

  const interactedProtocolIds =
    useMemo(() => {
      return new Set(
        pageData.walletProtocolActivity
          .filter(
            (item) =>
              item.has_interacted
          )
          .map(
            (item) =>
              item.protocol_id
          )
          .filter(Boolean)
      );
    }, [
      pageData.walletProtocolActivity,
    ]);

  const availableOpportunities =
    useMemo(() => {
      if (!connected) {
        return pageData.protocols;
      }

      return pageData.protocols.filter(
        (protocol) =>
          !interactedProtocolIds.has(
            protocol.id
          )
      );
    }, [
      connected,
      pageData.protocols,
      interactedProtocolIds,
    ]);

  /*
   * =========================================================
   * LEADERBOARD
   * =========================================================
   */

  const leaderboard =
    useMemo<LeaderboardRow[]>(() => {
      const totals =
        new Map<string, number>();

      pageData.leaderboardPoints.forEach(
        (event) => {
          const wallet =
            event.wallet.toLowerCase();

          totals.set(
            wallet,
            (totals.get(wallet) ?? 0) +
              (event.weight ?? 0)
          );
        }
      );

      const usersByWallet =
        new Map<string, User>();

      pageData.users.forEach(
        (user) => {
          usersByWallet.set(
            user.wallet.toLowerCase(),
            user
          );
        }
      );

      return Array.from(
        totals.entries()
      )
        .map(
          ([wallet, totalPoints]) => {
            const user =
              usersByWallet.get(
                wallet
              );

            return {
              wallet,
              displayName:
                user?.display_name ??
                shortenAddress(wallet),
              points: totalPoints,
            };
          }
        )
        .sort(
          (a, b) =>
            b.points - a.points
        )
        .slice(0, 5);
    }, [
      pageData.leaderboardPoints,
      pageData.users,
    ]);

  /*
   * =========================================================
   * CURRENT WALLET RANK
   * =========================================================
   */

  const walletRank =
    useMemo(() => {
      if (!address) {
        return null;
      }

      const wallet =
        address.toLowerCase();

      const allTotals =
        new Map<string, number>();

      pageData.leaderboardPoints.forEach(
        (event) => {
          const eventWallet =
            event.wallet.toLowerCase();

          allTotals.set(
            eventWallet,
            (allTotals.get(
              eventWallet
            ) ?? 0) +
              (event.weight ?? 0)
          );
        }
      );

      const sorted =
        Array.from(
          allTotals.entries()
        ).sort(
          (a, b) =>
            b[1] - a[1]
        );

      const index =
        sorted.findIndex(
          ([itemWallet]) =>
            itemWallet === wallet
        );

      if (index === -1) {
        return null;
      }

      return index + 1;
    }, [
      address,
      pageData.leaderboardPoints,
    ]);

  /*
   * =========================================================
   * ACTIVITY BARS
   *
   * Derived entirely from real activity.
   * =========================================================
   */

  const activityBars =
    useMemo(() => {
      if (walletTransactions.length === 0) {
        return Array.from(
          { length: 12 },
          () => 0
        );
      }

      const now =
        new Date();

      const buckets =
        Array.from(
          { length: 12 },
          () => 0
        );

      walletTransactions.forEach(
        (transaction) => {
          if (!transaction.timestamp) {
            return;
          }

          const date =
            new Date(
              transaction.timestamp
            );

          if (
            Number.isNaN(
              date.getTime()
            )
          ) {
            return;
          }

          const daysAgo =
            Math.floor(
              (now.getTime() -
                date.getTime()) /
                (1000 *
                  60 *
                  60 *
                  24)
            );

          const bucket =
            Math.floor(
              daysAgo / 30
            );

          if (
            bucket >= 0 &&
            bucket < 12
          ) {
            buckets[
              11 - bucket
            ] += 1;
          }
        }
      );

      const maximum =
        Math.max(
          ...buckets,
          1
        );

      return buckets.map(
        (value) =>
          value === 0
            ? 4
            : Math.max(
                10,
                (value /
                  maximum) *
                  100
              )
      );
    }, [
      walletTransactions,
    ]);

  /*
   * =========================================================
   * REPUTATION SIGNALS
   * =========================================================
   */

  const activityPercentage =
    Math.min(
      100,
      Math.round(
        Math.log10(
          activityCount + 1
        ) * 30
      )
    );

  const attestationPercentage =
    Math.min(
      100,
      attestationCount * 10
    );

  const contributionPercentage =
    Math.min(
      100,
      Math.round(
        points / 100
      )
    );

  /*
   * =========================================================
   * RECENT ACTIVITY
   * =========================================================
   */

  const recentActivity =
    useMemo(() => {
      return walletTransactions
        .slice()
        .sort((a, b) => {
          const aTime =
            a.timestamp
              ? new Date(
                  a.timestamp
                ).getTime()
              : 0;

          const bTime =
            b.timestamp
              ? new Date(
                  b.timestamp
                ).getTime()
              : 0;

          return bTime - aTime;
        })
        .slice(0, 5);
    }, [
      walletTransactions,
    ]);

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <Header />

      {/* =====================================================
          LIVE DATA STATUS
          ===================================================== */}

      {connected && (
        <div className="border-b border-emerald-400/10 bg-emerald-400/[0.025]">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-2 text-[11px] lg:px-8">
            <span className="text-white/35">
              {loading
                ? "Loading live Ivolve data..."
                : "Live on-chain reputation data"}
            </span>

            <span className="text-emerald-300/70">
              {shortenAddress(
                address!
              )}
            </span>
          </div>
        </div>
      )}

      {error && (
        <div className="border-b border-amber-400/10 bg-amber-400/[0.025]">
          <div className="mx-auto max-w-7xl px-6 py-3 text-xs text-amber-200/70 lg:px-8">
            {error}
          </div>
        </div>
      )}

      {/* =====================================================
          HERO
          ===================================================== */}

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
                Turn your on-chain activity,
                attestations, and contributions
                into a reputation you can
                understand, build, and carry
                across Web3.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <WalletButton />

                <Link
                  href="/opportunities"
                  className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/[0.035] px-6 py-3.5 text-sm font-medium text-white transition hover:border-white/20 hover:bg-white/[0.07]"
                >
                  Explore Ivolve
                </Link>
              </div>

              <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-xs text-white/30">
                <span>
                  Non-custodial
                </span>

                <span>•</span>

                <span>
                  On-chain
                </span>

                <span>•</span>

                <span>
                  Built for Web3
                </span>
              </div>
            </div>

            {/* Profile card */}

            <div className="relative">
              <div className="absolute -inset-10 rounded-full bg-emerald-400/[0.04] blur-3xl" />

              <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.035] shadow-2xl">

                <div className="border-b border-white/10 px-7 py-6">
                  <div className="flex items-center justify-between gap-4">

                    <div className="min-w-0">
                      <p className="text-xs uppercase tracking-[0.18em] text-white/30">
                        Reputation profile
                      </p>

                      <p className="mt-2 truncate font-mono text-sm text-white/50">
                        {connected
                          ? shortenAddress(
                              address!
                            )
                          : "Connect your wallet"}
                      </p>
                    </div>

                    <div
                      className={
                        connected
                          ? "flex shrink-0 items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs text-emerald-300"
                          : "flex shrink-0 items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-white/40"
                      }
                    >
                      <span
                        className={
                          connected
                            ? "h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"
                            : "h-1.5 w-1.5 rounded-full bg-white/30"
                        }
                      />

                      {connected
                        ? "Connected"
                        : "Not connected"}
                    </div>

                  </div>
                </div>

                <div className="px-7 py-8">

                  <p className="text-sm text-white/35">
                    Reputation Score
                  </p>

                  <div className="mt-2 flex items-end gap-3">
                    <span className="text-7xl font-semibold tracking-[-0.06em]">
                      {!connected
                        ? "—"
                        : loading
                        ? "..."
                        : score ?? "—"}
                    </span>

                    <span className="mb-3 text-sm text-white/35">
                      {connected
                        ? score !== null
                          ? "Live signal"
                          : "Building"
                        : "Connect"}
                    </span>
                  </div>

                  {/* Real activity graph */}

                  <div className="mt-8 flex h-24 items-end gap-2">
                    {activityBars.map(
                      (
                        height,
                        index
                      ) => (
                        <div
                          key={index}
                          className="flex-1 rounded-t-md bg-emerald-400/[0.12] transition-all duration-500"
                          style={{
                            height: `${height}%`,
                          }}
                        />
                      )
                    )}
                  </div>

                  {/* Real stats */}

                  <div className="mt-8 grid grid-cols-3 gap-3">

                    <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
                      <p className="text-xs text-white/30">
                        Attestations
                      </p>

                      <p className="mt-2 text-xl font-semibold">
                        {connected
                          ? formatNumber(
                              attestationCount
                            )
                          : "—"}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
                      <p className="text-xs text-white/30">
                        Points
                      </p>

                      <p className="mt-2 text-xl font-semibold">
                        {connected
                          ? formatNumber(
                              points
                            )
                          : "—"}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
                      <p className="text-xs text-white/30">
                        Opportunities
                      </p>

                      <p className="mt-2 text-xl font-semibold">
                        {connected
                          ? formatNumber(
                              availableOpportunities.length
                            )
                          : "—"}
                      </p>
                    </div>

                  </div>

                  {connected ? (
                    <div className="mt-5 rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.06] px-5 py-3 text-center text-sm text-emerald-300">
                      {formatNumber(
                        activityCount
                      )}{" "}
                      real on-chain activities indexed
                    </div>
                  ) : (
                    <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-center text-sm text-white/35">
                      Connect your wallet to load your live reputation
                    </div>
                  )}

                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =====================================================
          HOW IT WORKS
          ===================================================== */}

      <section
        id="how-it-works"
        className="border-t border-white/10"
      >
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">

          <div className="max-w-2xl">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-emerald-300">
              Your data
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Your reputation is built from what you actually do.
            </h2>

            <p className="mt-4 text-base leading-7 text-white/40">
              Ivolve reads real wallet activity,
              attestations, contributions, and
              ecosystem participation to create
              a reputation signal.
            </p>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-3">

            {/* Activity */}

            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-7">

              <span className="text-sm text-white/25">
                01
              </span>

              <h3 className="mt-10 text-xl font-semibold">
                On-chain activity
              </h3>

              <p className="mt-3 text-sm leading-6 text-white/40">
                Your indexed Base activity becomes
                a measurable reputation signal.
              </p>

              <div className="mt-8">
                <p className="text-3xl font-semibold">
                  {connected
                    ? formatNumber(
                        activityCount
                      )
                    : "—"}
                </p>

                <p className="mt-1 text-xs text-white/25">
                  {connected
                    ? "indexed activities"
                    : "connect wallet"}
                </p>
              </div>

            </div>

            {/* Attestations */}

            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-7">

              <span className="text-sm text-white/25">
                02
              </span>

              <h3 className="mt-10 text-xl font-semibold">
                Verified identity
              </h3>

              <p className="mt-3 text-sm leading-6 text-white/40">
                EAS attestations can add verified
                context to your on-chain identity.
              </p>

              <div className="mt-8">
                <p className="text-3xl font-semibold">
                  {connected
                    ? formatNumber(
                        attestationCount
                      )
                    : "—"}
                </p>

                <p className="mt-1 text-xs text-white/25">
                  {connected
                    ? "cached attestations"
                    : "connect wallet"}
                </p>
              </div>

            </div>

            {/* Points */}

            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-7">

              <span className="text-sm text-white/25">
                03
              </span>

              <h3 className="mt-10 text-xl font-semibold">
                Contributions
              </h3>

              <p className="mt-3 text-sm leading-6 text-white/40">
                Meaningful contributions can become
                non-transferable reputation points.
              </p>

              <div className="mt-8">
                <p className="text-3xl font-semibold">
                  {connected
                    ? formatNumber(
                        points
                      )
                    : "—"}
                </p>

                <p className="mt-1 text-xs text-white/25">
                  {connected
                    ? "reputation points"
                    : "connect wallet"}
                </p>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* =====================================================
          REPUTATION
          ===================================================== */}

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
                Ivolve combines real activity,
                attestations, and contributions
                into a transparent reputation signal.
              </p>

              {connected && (
                <div className="mt-8 grid grid-cols-2 gap-4">

                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                    <p className="text-xs text-white/30">
                      Current score
                    </p>

                    <p className="mt-2 text-3xl font-semibold">
                      {score ?? "—"}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                    <p className="text-xs text-white/30">
                      Leaderboard rank
                    </p>

                    <p className="mt-2 text-3xl font-semibold">
                      {walletRank
                        ? `#${walletRank}`
                        : "—"}
                    </p>
                  </div>

                </div>
              )}

            </div>

            {/* Live reputation signals */}

            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8">

              <div className="flex items-center justify-between border-b border-white/10 pb-6">

                <div>
                  <p className="text-xs text-white/30">
                    Reputation
                  </p>

                  <p className="mt-2 text-4xl font-semibold">
                    {connected
                      ? score ?? "—"
                      : "—"}
                  </p>
                </div>

                <div className="rounded-full border border-emerald-400/20 bg-emerald-400/[0.06] px-3 py-1.5 text-xs text-emerald-300">
                  {connected
                    ? "Live signal"
                    : "Connect wallet"}
                </div>

              </div>

              <div className="mt-7 space-y-6">

                {/* Activity */}

                <div>
                  <div className="mb-2 flex justify-between text-xs">
                    <span className="text-white/40">
                      On-chain activity
                    </span>

                    <span className="text-white/40">
                      {connected
                        ? `${formatNumber(
                            activityCount
                          )} activities`
                        : "—"}
                    </span>
                  </div>

                  <div className="h-2 rounded-full bg-white/5">
                    <div
                      className="h-full rounded-full bg-emerald-400/40 transition-all duration-700"
                      style={{
                        width: connected
                          ? `${activityPercentage}%`
                          : "0%",
                      }}
                    />
                  </div>
                </div>

                {/* Attestations */}

                <div>
                  <div className="mb-2 flex justify-between text-xs">
                    <span className="text-white/40">
                      Attestations
                    </span>

                    <span className="text-white/40">
                      {connected
                        ? `${formatNumber(
                            attestationCount
                          )} verified`
                        : "—"}
                    </span>
                  </div>

                  <div className="h-2 rounded-full bg-white/5">
                    <div
                      className="h-full rounded-full bg-emerald-400/40 transition-all duration-700"
                      style={{
                        width: connected
                          ? `${attestationPercentage}%`
                          : "0%",
                      }}
                    />
                  </div>
                </div>

                {/* Contributions */}

                <div>
                  <div className="mb-2 flex justify-between text-xs">
                    <span className="text-white/40">
                      Contributions
                    </span>

                    <span className="text-white/40">
                      {connected
                        ? `${formatNumber(
                            points
                          )} points`
                        : "—"}
                    </span>
                  </div>

                  <div className="h-2 rounded-full bg-white/5">
                    <div
                      className="h-full rounded-full bg-emerald-400/40 transition-all duration-700"
                      style={{
                        width: connected
                          ? `${contributionPercentage}%`
                          : "0%",
                      }}
                    />
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =====================================================
          RECENT ACTIVITY
          ===================================================== */}

      {connected && (
        <section className="border-t border-white/10">
          <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">

            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">

              <div>
                <p className="text-sm font-medium uppercase tracking-[0.18em] text-emerald-300">
                  Activity
                </p>

                <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                  Your latest on-chain activity.
                </h2>

                <p className="mt-4 max-w-xl text-base leading-7 text-white/40">
                  These are real indexed transactions
                  associated with your connected wallet.
                </p>
              </div>

              <div className="text-sm text-white/30">
                {formatNumber(
                  activityCount
                )}{" "}
                total activities
              </div>

            </div>

            <div className="mt-10 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">

              {recentActivity.length === 0 ? (

                <div className="px-6 py-12 text-center">
                  <p className="text-sm text-white/50">
                    No indexed activity found for this wallet yet.
                  </p>

                  <p className="mt-2 text-xs text-white/25">
                    Activity will appear here when it is available in Ivolve.
                  </p>
                </div>

              ) : (

                <div className="divide-y divide-white/10">

                  {recentActivity.map(
                    (activity) => (
                      <div
                        key={activity.id}
                        className="flex flex-col gap-3 px-6 py-5 sm:flex-row sm:items-center sm:justify-between"
                      >

                        <div className="min-w-0">

                          <div className="flex flex-wrap items-center gap-3">

                            <span className="text-sm font-medium">
                              {categoryLabel(
                                activity.category
                              )}
                            </span>

                            <span className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[10px] text-white/40">
                              {chainLabel(
                                activity.chain
                              )}
                            </span>

                          </div>

                          <div className="mt-2 flex flex-wrap gap-3 text-xs text-white/30">

                            <span>
                              {activity.asset ??
                                "On-chain"}
                            </span>

                            <span>
                              {formatActivityDate(
                                activity.timestamp
                              )}
                            </span>

                          </div>

                          <p className="mt-2 truncate font-mono text-[10px] text-white/20">
                            {activity.transaction_hash}
                          </p>

                        </div>

                        <span className="shrink-0 text-xs text-white/35">
                          Indexed
                        </span>

                      </div>
                    )
                  )}

                </div>

              )}

            </div>
          </div>
        </section>
      )}

      {/* =====================================================
          OPPORTUNITIES
          ===================================================== */}

      <section className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">

          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">

            <div>

              <p className="text-sm font-medium uppercase tracking-[0.18em] text-emerald-300">
                Opportunities
              </p>

              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                Opportunities from real protocols.
              </h2>

              <p className="mt-4 max-w-xl text-base leading-7 text-white/40">
                Ivolve compares your wallet activity
                against protocols tracked in the database.
              </p>

            </div>

            <Link
              href="/opportunities"
              className="w-fit text-sm font-medium text-white transition hover:text-emerald-300"
            >
              Explore opportunities →
            </Link>

          </div>

          {availableOpportunities.length === 0 ? (

            <div className="mt-12 rounded-3xl border border-white/10 bg-white/[0.03] px-8 py-14 text-center">

              <p className="text-sm font-medium text-white/50">
                {connected
                  ? "No unmatched opportunities are available yet."
                  : "Connect your wallet to discover opportunities."}
              </p>

              <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-white/25">
                {connected
                  ? "As real protocols are added to Ivolve, eligible opportunities will appear here."
                  : "Your wallet history will be compared against the protocols tracked by Ivolve."}
              </p>

            </div>

          ) : (

            <div className="mt-12 grid gap-5 md:grid-cols-3">

              {availableOpportunities
                .slice(0, 3)
                .map((protocol) => (

                  <Link
                    key={protocol.id}
                    href={`/opportunities/${protocol.id}`}
                    className="group rounded-3xl border border-white/10 bg-white/[0.03] p-7 transition hover:-translate-y-1 hover:border-emerald-400/20 hover:bg-white/[0.045]"
                  >

                    <div className="flex items-start justify-between gap-4">

                      <span className="text-sm text-white/25">
                        {chainLabel(
                          protocol.chain
                        )}
                      </span>

                      <span className="rounded-full border border-emerald-400/15 bg-emerald-400/[0.05] px-2.5 py-1 text-[10px] text-emerald-300/70">
                        Available
                      </span>

                    </div>

                    <h3 className="mt-10 text-xl font-semibold transition group-hover:text-emerald-300">
                      {protocol.name}
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-white/40">
                      {getProtocolCategory(
                        protocol
                      )}
                    </p>

                    {protocol.snapshot_notes && (
                      <p className="mt-4 line-clamp-3 text-xs leading-5 text-white/25">
                        {protocol.snapshot_notes}
                      </p>
                    )}

                    <div className="mt-8 text-xs text-white/30 transition group-hover:text-emerald-300">
                      View opportunity →
                    </div>

                  </Link>

                ))}

            </div>

          )}

        </div>
      </section>

      {/* =====================================================
          LEADERBOARD
          ===================================================== */}

      <section className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">

          <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">

            <div>

              <p className="text-sm font-medium uppercase tracking-[0.18em] text-emerald-300">
                Leaderboard
              </p>

              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                Reputation in motion.
              </h2>

              <p className="mt-5 max-w-xl text-base leading-7 text-white/40">
                Rankings are calculated from real
                contribution points stored by Ivolve.
              </p>

              <Link
                href="/leaderboard"
                className="mt-8 inline-flex rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-white/90"
              >
                View leaderboard →
              </Link>

            </div>

            <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">

              <div className="border-b border-white/10 px-6 py-5">
                <div className="flex items-center justify-between">

                  <p className="text-xs uppercase tracking-[0.18em] text-white/25">
                    Live rankings
                  </p>

                  {walletRank && (
                    <span className="text-xs text-emerald-300/70">
                      You #{walletRank}
                    </span>
                  )}

                </div>
              </div>

              {leaderboard.length === 0 ? (

                <div className="px-6 py-12 text-center">

                  <p className="text-sm font-medium text-white/50">
                    No point rankings yet.
                  </p>

                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/25">
                    Rankings will appear automatically when real contribution points are recorded.
                  </p>

                </div>

              ) : (

                <div className="divide-y divide-white/10">

                  {leaderboard.map(
                    (
                      player,
                      index
                    ) => {

                      const isCurrentWallet =
                        connected &&
                        player.wallet ===
                          address!.toLowerCase();

                      return (
                        <div
                          key={
                            player.wallet
                          }
                          className={
                            isCurrentWallet
                              ? "flex items-center gap-4 bg-emerald-400/[0.035] px-6 py-5"
                              : "flex items-center gap-4 px-6 py-5"
                          }
                        >

                          <div className="w-8 text-sm text-white/25">
                            #{index + 1}
                          </div>

                          <div className="min-w-0 flex-1">

                            <p className="truncate text-sm font-medium">
                              {player.displayName}
                            </p>

                            <p className="mt-1 truncate font-mono text-[10px] text-white/20">
                              {player.wallet}
                            </p>

                          </div>

                          <div className="text-right">

                            <p className="text-sm font-semibold">
                              {formatNumber(
                                player.points
                              )}
                            </p>

                            <p className="mt-1 text-[10px] text-white/25">
                              points
                            </p>

                          </div>

                        </div>
                      );
                    }
                  )}

                </div>

              )}

            </div>

          </div>
        </div>
      </section>

      {/* =====================================================
          FINAL CTA
          ===================================================== */}

      <section className="border-t border-white/10">
        <div className="mx-auto max-w-5xl px-6 py-28 text-center lg:px-8">

          <p className="text-sm font-medium uppercase tracking-[0.18em] text-emerald-300">
            {connected
              ? "Your reputation"
              : "Start building"}
          </p>

          <h2 className="mx-auto mt-4 max-w-3xl text-4xl font-semibold tracking-[-0.04em] sm:text-5xl lg:text-6xl">

            {connected
              ? "Your wallet is already telling the story."
              : "Your reputation already exists."}

            <span className="block text-white/40">
              {connected
                ? "Ivolve makes it visible."
                : "Make it visible."}
            </span>

          </h2>

          <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-white/40">
            {connected
              ? `${formatNumber(
                  activityCount
                )} real on-chain activities are currently indexed for your wallet.`
              : "Connect your wallet and explore the reputation you are already building on-chain."}
          </p>

          <div className="mt-9 flex justify-center">
            <WalletButton />
          </div>

        </div>
      </section>

      {/* =====================================================
          FOOTER
          ===================================================== */}

      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-6 py-8 text-sm text-white/30 sm:flex-row sm:items-center sm:justify-between lg:px-8">

          <div>
            © 2026 Ivolve
          </div>

          <div className="flex flex-wrap gap-5">

            <Link
              href="/opportunities"
              className="transition hover:text-white"
            >
              Opportunities
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