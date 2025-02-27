/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@workspace/ui"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "takglywyy4.ufs.sh",
      },
    ],
  },
};

export default nextConfig;
