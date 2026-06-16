/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**"
      },
      {
        protocol: "https",
        hostname: "source.unsplash.com",
        pathname: "/**"
      },
      {
        protocol: "https",
        hostname: "www.tahona.mx",
        pathname: "/**"
      }
    ]
  }
};

export default nextConfig;
