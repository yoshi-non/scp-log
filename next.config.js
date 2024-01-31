/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // クライアントサイドでのみ無視するモジュールを指定
      config.externals = config.externals || [];
      config.externals.push('./lib-cov/fluent-ffmpeg');
    }

    return config;
  },
  //output: 'export',
  images: {
    unoptimized: true,
    domains: ['i.ytimg.com', 'yt3.ggpht.com'],
  },
};

module.exports = nextConfig;
