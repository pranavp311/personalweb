import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
  // Cap share links (pranavpappu.dev/s/<id>) were handed out while Cap served this domain; send them to Cap.
  async redirects() {
    return [
      {
        source: "/s/:id",
        destination: "https://cap.so/s/:id",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
