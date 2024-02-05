/** @type {import('next').NextConfig} */
const nextConfig = {
  //output: 'export',
  images: {
    unoptimized: true,
    domains: ['i.ytimg.com', 'yt3.ggpht.com'],
  },
};

module.exports = nextConfig;
