import type { Config } from "vike/types";
import vikeReact from "vike-react/config";

const config: Config = {
  title: "Alpha Dent",
  description: "Alpha Dent fogászati rendelő weboldala",
  extends: [vikeReact],
  prerender: true,
};

export default config;
