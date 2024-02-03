/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "axxvbauccqdrffmnozld.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "strcjgyhajgezzgrjcyg.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  reactStrictMode: false,
  productionBrowserSourceMaps: true,
};

module.exports = nextConfig;
