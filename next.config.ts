const nextConfig = {
  images: {
    domains: [
      "res.cloudinary.com",
      "via.placeholder.com",
      "cdn.weatherapi.com",
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
