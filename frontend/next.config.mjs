/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'picsum.photos',
        },
        {
          protocol: 'https',
          hostname: 'i.pravatar.cc',
        },
        {
          protocol: 'http',
          hostname: 'localhost',
        }
      ],
    },
  };
  
  export default nextConfig;