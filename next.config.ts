import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    // applies to all routes
    "/*": [
      "./lib/generated/prisma/**",
      "./node_modules/.prisma/**",
      "./node_modules/@prisma/client/**",
      "./prisma/**",
    ],
  },
};

export default nextConfig;
