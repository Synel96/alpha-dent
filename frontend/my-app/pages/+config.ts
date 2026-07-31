import type { Config } from "vike/types";
import vikeReact from "vike-react/config";

const config: Config = {
  // title/description are locale-aware: see pages/+title.ts and pages/+description.ts.
  extends: [vikeReact],
  prerender: true,
  passToClient: ["locale"],
};

export default config;
