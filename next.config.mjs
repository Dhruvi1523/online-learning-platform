/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: 'utfs.io'},
      { hostname: 'img.clerk.com'}
    ]
  } ,
  typescript: {
    ignoreBuildErrors: true
  }
};

export default nextConfig;
