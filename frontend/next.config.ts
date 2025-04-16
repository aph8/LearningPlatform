/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    CUSTOM_API_URL: process.env.CUSTOM_API_URL,
  },
  async redirects() {
    return [
      {
        source: "/old-path",
        destination: "/new-path",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
