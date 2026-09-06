import { cookieStorage, createStorage } from "@wagmi/core";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { baseSepolia } from "@reown/appkit/networks";

const envProjectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID;

if (!envProjectId) {
  throw new Error("Reown Project ID is not defined");
}

export const projectId: string = envProjectId;

export const networks = [baseSepolia];

export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
  projectId,
  networks,
});

export const config = wagmiAdapter.wagmiConfig;