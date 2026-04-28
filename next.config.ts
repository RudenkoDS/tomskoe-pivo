import type { NextConfig } from "next";

const isProd = process.env.DEPLOY_TARGET === "github";
const base = isProd ? "/tomskoe-pivo" : "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  basePath: base,
  assetPrefix: base,
  env: { NEXT_PUBLIC_BASE: base },
};

export default nextConfig;
