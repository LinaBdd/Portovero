import type { NextConfig } from "next";
import { loadEnvConfig } from "@next/env";

// next.config.ts tourne hors du pipeline webpack : il faut charger les
// .env explicitement pour lire NEXT_PUBLIC_API_URL ici (voir .env.example).
loadEnvConfig(process.cwd());

const remotePatterns: NonNullable<NextConfig["images"]>["remotePatterns"] = [
  // Backend local, pour le développement.
  { protocol: "http", hostname: "127.0.0.1", port: "8000", pathname: "/uploads/**" },
  { protocol: "http", hostname: "localhost", port: "8000", pathname: "/uploads/**" },
];

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

if (apiUrl) {
  const { protocol, hostname, port } = new URL(apiUrl);

  remotePatterns.push({
    protocol: protocol.replace(":", "") as "http" | "https",
    hostname,
    port,
    pathname: "/uploads/**",
  });
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns,
  },
};

export default nextConfig;
