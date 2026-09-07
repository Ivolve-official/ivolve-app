"use client";

import { useMemo, useState } from "react";

type ActivityRow = {
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

type Props = {
  activities: ActivityRow[];
  wallet: string;
};

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

function explorerUrl(
  chain: string,
  hash: string
) {
  const value = chain.toLowerCase();

  if (
    value.includes("sepolia")
  ) {
    return `https://sepolia.basescan.org/tx/${hash}`;
  }

  return `https://basescan.org/tx/${hash}`;
}

function activityLabel(category: string) {
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

function direction(
  wallet: string,
  from: string,
  to: string | null
) {
  const w = wallet.toLowerCase();

  if (
    to &&
    to.toLowerCase() === w
  ) {
    return "Received";
  }

  if (
    from.toLowerCase() === w
  ) {
    return "Sent";
  }

  return "Activity";
}

function formatDate(
  timestamp: string | null
) {
  if (!timestamp) {
    return "Unknown date";
  }

  return new Intl.DateTimeFormat(
    "en-US",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }
  ).format(new Date(timestamp));
}

function formatValue(
  value: number | null
) {
  if (value === null) {
    return null;
  }

  if (value === 0) {
    return "0";
  }

  if (value < 0.000001) {
    return value.toExponential(2);
  }

  return value
    .toLocaleString(
      "en-US",
      {
        maximumFractionDigits: 6,
      }
    );
}

export default function ActivitySection({
  activities,
  wallet,
}: Props) {
  const [chain, setChain] =
    useState("all");

  const [type, setType] =
    useState("all");

  const chains = useMemo(() => {
    return Array.from(
      new Set(
        activities.map(
          (item) => item.chain
        )
      )
    );
  }, [activities]);

  const filtered = useMemo(() => {
    return activities.filter(
      (item) => {
        const chainMatch =
          chain === "all" ||
          item.chain === chain;

        const typeMatch =
          type === "all" ||
          item.category === type;

        return (
          chainMatch &&
          typeMatch
        );
      }
    );
  }, [
    activities,
    chain,
    type,
  ]);

  return (
    <section className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-8 lg:p-10">

      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">

        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-white/30">
            On-chain activity
          </p>

          <h2 className="mt-3 text-2xl font-semibold">
            Your wallet activity
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/35">
            Real activity indexed from your wallet across supported networks.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">

          <select
            value={chain}
            onChange={(event) =>
              setChain(
                event.target.value
              )
            }
            className="rounded-full border border-white/10 bg-[#0b0b0b] px-4 py-3 text-sm text-white outline-none transition hover:border-white/20 focus:border-emerald-400/40"
          >
            <option value="all">
              All Chains
            </option>

            {chains.map(
              (item) => (
                <option
                  key={item}
                  value={item}
                >
                  {chainLabel(item)}
                </option>
              )
            )}
          </select>

          <select
            value={type}
            onChange={(event) =>
              setType(
                event.target.value
              )
            }
            className="rounded-full border border-white/10 bg-[#0b0b0b] px-4 py-3 text-sm text-white outline-none transition hover:border-white/20 focus:border-emerald-400/40"
          >
            <option value="all">
              All Activity
            </option>

            <option value="external">
              ETH transfers
            </option>

            <option value="erc20">
              Token transfers
            </option>

            <option value="erc721">
              NFT transfers
            </option>

            <option value="erc1155">
              NFT / asset transfers
            </option>
          </select>

        </div>
      </div>

      <div className="mt-8 flex items-center justify-between border-b border-white/10 pb-4">

        <p className="text-xs text-white/30">
          Showing{" "}
          {filtered.length.toLocaleString()}{" "}
          activities
        </p>

        {(chain !== "all" ||
          type !== "all") && (
          <button
            type="button"
            onClick={() => {
              setChain("all");
              setType("all");
            }}
            className="text-xs text-emerald-300 hover:text-emerald-200"
          >
            Clear filters
          </button>
        )}

      </div>

      {filtered.length === 0 ? (

        <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.02] p-10 text-center">

          <p className="text-sm text-white/50">
            No activity matches these filters.
          </p>

          <p className="mt-2 text-xs text-white/25">
            Try another chain or activity type.
          </p>

        </div>

      ) : (

        <div className="divide-y divide-white/10">

          {filtered
            .slice(0, 50)
            .map((item) => {

              const itemDirection =
                direction(
                  wallet,
                  item.from_address,
                  item.to_address
                );

              const value =
                formatValue(
                  item.value
                );

              return (
                <div
                  key={item.id}
                  className="flex flex-col gap-5 py-6 sm:flex-row sm:items-center sm:justify-between"
                >

                  <div className="min-w-0">

                    <div className="flex flex-wrap items-center gap-3">

                      <span className="text-sm font-medium">
                        {activityLabel(
                          item.category
                        )}
                      </span>

                      <span className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[10px] text-white/40">
                        {chainLabel(
                          item.chain
                        )}
                      </span>

                      <span
                        className={
                          itemDirection ===
                          "Received"
                            ? "text-xs text-emerald-300"
                            : "text-xs text-white/30"
                        }
                      >
                        {itemDirection}
                      </span>

                    </div>

                    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-white/30">

                      {item.asset && (
                        <span>
                          {item.asset}
                        </span>
                      )}

                      {value !== null && (
                        <span>
                          {value}
                        </span>
                      )}

                      <span>
                        {formatDate(
                          item.timestamp
                        )}
                      </span>

                    </div>

                    <p className="mt-3 truncate font-mono text-[10px] text-white/20">
                      {item.transaction_hash}
                    </p>

                  </div>

                  <a
                    href={explorerUrl(
                      item.chain,
                      item.transaction_hash
                    )}
                    target="_blank"
                    rel="noreferrer"
                    className="shrink-0 text-xs text-white/40 transition hover:text-emerald-300"
                  >
                    View transaction →
                  </a>

                </div>
              );
            })}

        </div>

      )}

      {filtered.length > 50 && (
        <p className="mt-6 text-center text-xs text-white/25">
          Showing the latest 50 of{" "}
          {filtered.length.toLocaleString()}{" "}
          matching activities.
        </p>
      )}

    </section>
  );
}