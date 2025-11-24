const nextConfig = {
  /* config options here */
  images: {
    domains: ["res.cloudinary.com", "via.placeholder.com"],
  },
  // Ignore TypeScript and ESLint errors during build
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
