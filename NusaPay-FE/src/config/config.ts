import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { arbitrumSepolia } from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "NusaPay",
  projectId: "YOUR_PROJECT_ID",
  chains: [arbitrumSepolia],
  ssr: false, // If your dApp uses server side rendering (SSR)
});
