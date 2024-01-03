/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        port: "",
        pathname: "/v0/b/crayobois-fe722.appspot.com/o/**",
      },
    ],
  },
};

module.exports = nextConfig;
