import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Lets `next dev` work when opened from the LAN address (e.g. on a phone).
  allowedDevOrigins: ['10.0.0.5'],
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
