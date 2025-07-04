import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
  domains: ['lh3.googleusercontent.com'],
},

productionSourceMaps: true, // kalau mau aktif juga di production
};

export default nextConfig;
