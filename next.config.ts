import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  redirects() {
    return [
      { source: "/projects/resilient-runtime-lab", destination: "/projects/cephalon-ordis", permanent: true },
      { source: "/projects/interface-protocols", destination: "/projects/velora", permanent: true },
    ];
  },
};

export default nextConfig;
