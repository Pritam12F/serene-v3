/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@workspace/ui"],
  images: {
    domains: ["assets-prd.ignimgs.com"],
  },
};

export default nextConfig;
